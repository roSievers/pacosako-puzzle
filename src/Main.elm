module Main exposing (main)

import Browser
import Browser.Dom as Dom
import Browser.Events
import Element exposing (Element, centerX, centerY, fill, height, padding, spacing, width)
import Element.Background as Background
import Element.Font as Font
import Element.Input as Input
import Element.Region
import File.Download
import FontAwesome.Icon exposing (Icon, viewIcon)
import FontAwesome.Regular as Regular
import FontAwesome.Solid as Solid
import FontAwesome.Styles
import Html exposing (Html)
import Html.Attributes
import Html.Events.Extra.Mouse as Mouse
import Http
import Json.Decode as Decode
import Json.Encode as Encode exposing (Value)
import List.Extra as List
import Markdown.Html
import Markdown.Parser
import Pieces
import Pivot as P exposing (Pivot)
import Ports
import RemoteData exposing (WebData)
import Sako exposing (PacoPiece, Tile(..))
import StaticText
import Svg exposing (Svg)
import Svg.Attributes
import Task


main : Program Decode.Value Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Model =
    { taco : Taco
    , page : Page
    , editor : EditorModel
    , blog : BlogModel
    , login : LoginModel

    -- LibraryPage
    , exampleFile : WebData (List PacoPosition)
    , storedPositions : WebData (List StoredPosition)
    }


type Page
    = MainPage
    | EditorPage
    | LibraryPage
    | BlogPage
    | LoginPage


type alias User =
    { id : Int
    , username : String
    }


type alias Taco =
    { colorScheme : Pieces.ColorScheme
    , login : Maybe User
    }


type alias LoginModel =
    { usernameRaw : String
    , passwordRaw : String
    }


{-| Represents the possible save states a persisted object can have.

TODO: Add "Currently Saving", with and without id, then update saveStateStored
and saveStateModify accordingly

-}
type SaveState
    = SaveIsCurrent Int
    | SaveIsModified Int
    | SaveDoesNotExist
    | SaveNotRequired


{-| Update a save state when something is changed in the editor
-}
saveStateModify : SaveState -> SaveState
saveStateModify old =
    case old of
        SaveIsCurrent id ->
            SaveIsModified id

        SaveNotRequired ->
            SaveDoesNotExist

        otherwise ->
            otherwise


saveStateStored : Int -> SaveState -> SaveState
saveStateStored newId _ =
    SaveIsCurrent newId


saveStateId : SaveState -> Maybe Int
saveStateId saveState =
    case saveState of
        SaveIsCurrent id ->
            Just id

        SaveIsModified id ->
            Just id

        SaveDoesNotExist ->
            Nothing

        SaveNotRequired ->
            Nothing


type alias EditorModel =
    { saveState : SaveState
    , game : Pivot PacoPosition
    , preview : Maybe PacoPosition
    , drag : DragState
    , windowSize : ( Int, Int )
    , userPaste : String
    , pasteParsed : PositionParseResult
    , viewMode : ViewMode
    , analysis : Maybe AnalysisReport
    , rect : Rect
    , smartTool : SmartToolModel
    }


type alias SmartToolModel =
    { highlight : Maybe ( Tile, Highlight )
    , dragStartTile : Maybe Tile
    , dragDelta : Maybe SvgCoord
    , draggingPieces : List PacoPiece
    , hover : Maybe Tile
    }


smartToolRemoveDragInfo : SmartToolModel -> SmartToolModel
smartToolRemoveDragInfo tool =
    { tool
        | dragStartTile = Nothing
        , draggingPieces = []
        , dragDelta = Nothing
    }


type Highlight
    = HighlightBoth
    | HighlightWhite
    | HighlightBlack
    | HighlightLingering


nextHighlight : Tile -> Maybe ( Tile, Highlight ) -> Maybe ( Tile, Highlight )
nextHighlight newTile maybeHighlight =
    case maybeHighlight of
        Nothing ->
            Just ( newTile, HighlightBoth )

        Just ( oldTile, HighlightBoth ) ->
            if oldTile == newTile then
                Just ( oldTile, HighlightWhite )

            else
                Just ( newTile, HighlightBoth )

        Just ( oldTile, HighlightWhite ) ->
            if oldTile == newTile then
                Just ( oldTile, HighlightBlack )

            else
                Just ( newTile, HighlightBoth )

        Just ( oldTile, HighlightBlack ) ->
            if oldTile == newTile then
                Nothing

            else
                Just ( newTile, HighlightBoth )

        Just ( oldTile, HighlightLingering ) ->
            if oldTile == newTile then
                Just ( oldTile, HighlightBoth )

            else
                Just ( newTile, HighlightBoth )


initSmartTool : SmartToolModel
initSmartTool =
    { highlight = Nothing
    , dragStartTile = Nothing
    , dragDelta = Nothing
    , draggingPieces = []
    , hover = Nothing
    }


type ToolOutputMsg
    = ToolNoOp -- Don't do anything.
    | ToolCommit PacoPosition -- Add state to history.
    | ToolPreview PacoPosition -- Don't add this to the history.
    | ToolRollback -- Remove an ephemeral state that was set by ToolPreview


type BoardDecoration
    = HighlightTile ( Tile, Highlight )
    | DropTarget Tile
    | DragPiece DragPieceData


type alias DragPieceData =
    { color : Sako.Color
    , pieceType : Sako.Type
    , coord : SvgCoord
    }


getHighlightTile : BoardDecoration -> Maybe ( Tile, Highlight )
getHighlightTile decoration =
    case decoration of
        HighlightTile ( tile, highlight ) ->
            Just ( tile, highlight )

        _ ->
            Nothing


getDropTarget : BoardDecoration -> Maybe Tile
getDropTarget decoration =
    case decoration of
        DropTarget tile ->
            Just tile

        _ ->
            Nothing


getDragPiece : BoardDecoration -> Maybe DragPieceData
getDragPiece decoration =
    case decoration of
        DragPiece data ->
            Just data

        _ ->
            Nothing


type alias BlogModel =
    { text : String }


type PositionParseResult
    = NoInput
    | ParseError String
    | ParseSuccess PacoPosition


type alias PacoPosition =
    { moveNumber : Int
    , pieces : List PacoPiece
    }


pacoPositionFromPieces : List PacoPiece -> PacoPosition
pacoPositionFromPieces pieces =
    { emptyPosition | pieces = pieces }


{-| Represents a point in the Svg coordinate space. The game board is rendered from 0 to 800 in
both directions but additional objects are rendered outside.
-}
type SvgCoord
    = SvgCoord Int Int


initialPosition : PacoPosition
initialPosition =
    { moveNumber = 0
    , pieces = Sako.defaultInitialPosition
    }


emptyPosition : PacoPosition
emptyPosition =
    { moveNumber = 0
    , pieces = []
    }


type DragState
    = DragOff
    | Dragging { start : SvgCoord, current : SvgCoord }


startDrag : Rect -> Mouse.Event -> { start : SvgCoord, current : SvgCoord }
startDrag rect event =
    let
        start =
            gameSpaceCoordinate rect (realizedBoardViewBox ShowNumbers) event.clientPos
    in
    { start = start
    , current = start
    }


relativeInside : Rect -> ( Float, Float ) -> ( Float, Float )
relativeInside rect ( x, y ) =
    ( (x - rect.x) / rect.width, (y - rect.y) / rect.height )


absoluteOutside : Rect -> ( Float, Float ) -> ( Float, Float )
absoluteOutside rect ( x, y ) =
    ( x * rect.width + rect.x, y * rect.height + rect.y )


roundTuple : ( Float, Float ) -> ( Int, Int )
roundTuple ( x, y ) =
    ( round x, round y )


{-| Transforms a screen space coordinate into a Svg coordinate.
-}
gameSpaceCoordinate : Rect -> Rect -> ( Float, Float ) -> SvgCoord
gameSpaceCoordinate elementRect gameView coord =
    coord
        |> relativeInside elementRect
        |> absoluteOutside gameView
        |> roundTuple
        |> (\( x, y ) -> SvgCoord x y)


{-| Transforms an Svg coordinate into a logical tile coordinte.
Returns Nothing, if the SvgCoordinate is outside the board.
-}
safeTileCoordinate : SvgCoord -> Maybe Tile
safeTileCoordinate (SvgCoord x y) =
    if 0 <= x && x < 800 && 0 <= y && y < 800 then
        Just (Tile (x // 100) (7 - y // 100))

    else
        Nothing


type alias Rect =
    { x : Float
    , y : Float
    , width : Float
    , height : Float
    }


type Msg
    = GlobalNoOp
    | EditorMsgWrapper EditorMsg
    | BlogMsgWrapper BlogEditorMsg
    | LoginPageMsgWrapper LoginPageMsg
    | LoadIntoEditor PacoPosition
    | OpenPage Page
    | WhiteSideColor Pieces.SideColor
    | BlackSideColor Pieces.SideColor
    | GetLibrarySuccess String
    | GetLibraryFailure Http.Error
    | HttpError Http.Error
    | LoginSuccess User
    | LogoutSuccess
    | AllPositionsLoadedSuccess (List StoredPosition)


{-| Messages that may only affect data in the position editor page.
-}
type EditorMsg
    = EditorMsgNoOp
    | MouseDown Mouse.Event
    | MouseMove Mouse.Event
    | MouseUp Mouse.Event
    | GotBoardPosition (Result Dom.Error Dom.Element)
    | WindowResize Int Int
    | Undo
    | Redo
    | Reset PacoPosition
    | KeyUp KeyStroke
    | DownloadSvg
    | DownloadPng
    | SvgReadyForDownload String
    | UpdateUserPaste String
    | UseUserPaste PacoPosition
    | SetViewMode ViewMode
    | SavePosition PacoPosition SaveState
    | PositionSaveSuccess SavePositionDone
    | RequestRandomPosition
    | GotRandomPosition PacoPosition
    | RequestAnalysePosition PacoPosition
    | GotAnalysePosition AnalysisReport
    | ToolAddPiece Sako.Color Sako.Type


type BlogEditorMsg
    = OnMarkdownInput String


type LoginPageMsg
    = TypeUsername String
    | TypePassword String
    | TryLogin
    | Logout


type alias KeyStroke =
    { key : String
    , ctrlKey : Bool
    , altKey : Bool
    }


type alias DownloadRequest =
    { svgNode : String
    , outputWidth : Int
    , outputHeight : Int
    }


encodeDownloadRequest : DownloadRequest -> Encode.Value
encodeDownloadRequest record =
    Encode.object
        [ ( "svgNode", Encode.string <| record.svgNode )
        , ( "outputWidth", Encode.int <| record.outputWidth )
        , ( "outputHeight", Encode.int <| record.outputHeight )
        ]


initialEditor : Decode.Value -> EditorModel
initialEditor flags =
    { saveState = SaveNotRequired
    , game = P.singleton initialPosition
    , preview = Nothing
    , drag = DragOff
    , windowSize = parseWindowSize flags
    , userPaste = ""
    , pasteParsed = NoInput
    , viewMode = ShowNumbers
    , analysis = Nothing
    , rect =
        { x = 0
        , y = 0
        , width = 1
        , height = 1
        }
    , smartTool = initSmartTool
    }


initialBlog : BlogModel
initialBlog =
    { text = StaticText.blogEditorExampleText }


initialLogin : LoginModel
initialLogin =
    { usernameRaw = "", passwordRaw = "" }


initialTaco : Taco
initialTaco =
    { colorScheme = Pieces.defaultColorScheme, login = Nothing }


parseWindowSize : Decode.Value -> ( Int, Int )
parseWindowSize value =
    Decode.decodeValue sizeDecoder value
        |> Result.withDefault ( 100, 100 )


sizeDecoder : Decode.Decoder ( Int, Int )
sizeDecoder =
    Decode.map2 (\x y -> ( x, y ))
        (Decode.field "width" Decode.int)
        (Decode.field "height" Decode.int)


init : Decode.Value -> ( Model, Cmd Msg )
init flags =
    ( { taco = initialTaco
      , page = MainPage
      , editor = initialEditor flags
      , blog = initialBlog
      , login = initialLogin
      , exampleFile = RemoteData.Loading
      , storedPositions = RemoteData.NotAsked
      }
    , Cmd.batch
        [ Http.get
            { expect = Http.expectString expectLibrary
            , url = "static/examples.txt"
            }
        , getCurrentLogin
        , Task.attempt
            (GotBoardPosition >> EditorMsgWrapper)
            (Dom.getElement "boardDiv")
        ]
    )


expectLibrary : Result Http.Error String -> Msg
expectLibrary result =
    case result of
        Ok content ->
            GetLibrarySuccess content

        Err error ->
            GetLibraryFailure error


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GlobalNoOp ->
            ( model, Cmd.none )

        EditorMsgWrapper editorMsg ->
            let
                ( editorModel, editorCmd ) =
                    updateEditor editorMsg model.editor
            in
            ( { model | editor = editorModel }, editorCmd )

        BlogMsgWrapper blogEditorMsg ->
            let
                ( blogEditorModel, blogEditorCmd ) =
                    updateBlogEditor blogEditorMsg model.blog
            in
            ( { model | blog = blogEditorModel }, blogEditorCmd )

        LoginPageMsgWrapper loginPageMsg ->
            let
                ( loginPageModel, loginPageCmd ) =
                    updateLoginPage loginPageMsg model.login
            in
            ( { model | login = loginPageModel }, loginPageCmd )

        LoadIntoEditor newPosition ->
            let
                ( editorModel, editorCmd ) =
                    updateEditor (Reset newPosition) model.editor
            in
            ( { model | editor = editorModel, page = EditorPage }
            , editorCmd
            )

        WhiteSideColor newSideColor ->
            ( { model | taco = setColorScheme (Pieces.setWhite newSideColor model.taco.colorScheme) model.taco }
            , Cmd.none
            )

        BlackSideColor newSideColor ->
            ( { model | taco = setColorScheme (Pieces.setBlack newSideColor model.taco.colorScheme) model.taco }
            , Cmd.none
            )

        GetLibrarySuccess content ->
            let
                examples =
                    case Sako.importExchangeNotationList content of
                        Err _ ->
                            RemoteData.Failure (Http.BadBody "The examples file is broken")

                        Ok positions ->
                            RemoteData.Success (List.map pacoPositionFromPieces positions)
            in
            ( { model | exampleFile = examples }, Cmd.none )

        GetLibraryFailure error ->
            ( { model | exampleFile = RemoteData.Failure error }, Cmd.none )

        OpenPage newPage ->
            ( { model | page = newPage }
            , Task.attempt
                (GotBoardPosition >> EditorMsgWrapper)
                (Dom.getElement "boardDiv")
            )

        LoginSuccess user ->
            ( { model
                | taco = setLoggedInUser user model.taco
                , login = initialLogin
                , storedPositions = RemoteData.Loading
              }
            , getAllSavedPositions
            )

        LogoutSuccess ->
            ( { model
                | taco = removeLoggedInUser model.taco
                , login = initialLogin
                , storedPositions = RemoteData.NotAsked
              }
            , Cmd.none
            )

        HttpError error ->
            Debug.log "Http Error" (Debug.toString error) |> (\_ -> ( model, Cmd.none ))

        AllPositionsLoadedSuccess list ->
            ( { model | storedPositions = RemoteData.Success list }, Cmd.none )


{-| Helper function to update the color scheme inside the taco.
-}
setColorScheme : Pieces.ColorScheme -> Taco -> Taco
setColorScheme colorScheme taco =
    { taco | colorScheme = colorScheme }


setLoggedInUser : User -> Taco -> Taco
setLoggedInUser user taco =
    { taco | login = Just user }


removeLoggedInUser : Taco -> Taco
removeLoggedInUser taco =
    { taco | login = Nothing }


updateEditor : EditorMsg -> EditorModel -> ( EditorModel, Cmd Msg )
updateEditor msg model =
    case msg of
        EditorMsgNoOp ->
            ( model, Cmd.none )

        -- When we register a mouse down event on the board we read the current board position
        -- from the DOM.
        MouseDown event ->
            let
                dragData =
                    startDrag model.rect event

                maybeTile =
                    safeTileCoordinate dragData.start
            in
            case maybeTile of
                Just tile ->
                    clickStart tile { model | drag = Dragging dragData }

                Nothing ->
                    ( model, Cmd.none )

        MouseMove event ->
            handleMouseMove event model

        MouseUp event ->
            let
                drag =
                    moveDrag model.rect event model.drag
            in
            case drag of
                DragOff ->
                    ( { model | drag = DragOff }, Cmd.none )

                Dragging dragData ->
                    clickRelease dragData.start dragData.current { model | drag = DragOff }

        GotBoardPosition domElement ->
            case domElement of
                Ok element ->
                    ( { model | rect = element.element }, Cmd.none )

                Err _ ->
                    ( model, Cmd.none )

        WindowResize width height ->
            ( { model | windowSize = ( width, height ) }
            , Task.attempt
                (GotBoardPosition >> EditorMsgWrapper)
                (Dom.getElement "boardDiv")
            )

        Undo ->
            ( applyUndo model, Cmd.none )

        Redo ->
            ( applyRedo model, Cmd.none )

        Reset newPosition ->
            ( { model
                | game = addHistoryState newPosition model.game
              }
                |> editorStateModify
            , Cmd.none
            )

        KeyUp stroke ->
            keyUp stroke model

        DownloadSvg ->
            ( model, Ports.requestSvgNodeContent sakoEditorId )

        DownloadPng ->
            ( model
            , Ports.triggerPngDownload
                (encodeDownloadRequest
                    { svgNode = sakoEditorId
                    , outputWidth = 1000
                    , outputHeight = 1000
                    }
                )
            )

        SvgReadyForDownload fileContent ->
            ( model, File.Download.string "pacoSako.svg" "image/svg+xml" fileContent )

        UpdateUserPaste pasteContent ->
            let
                parseInput () =
                    case Sako.importExchangeNotation pasteContent of
                        Err _ ->
                            -- ParseError (Debug.toString err)
                            ParseError "Error: Make sure your input has the right shape!"

                        Ok position ->
                            ParseSuccess (pacoPositionFromPieces position)
            in
            ( { model
                | userPaste = pasteContent
                , pasteParsed =
                    if String.isEmpty pasteContent then
                        NoInput

                    else
                        parseInput ()
              }
            , Cmd.none
            )

        UseUserPaste newPosition ->
            ( { model
                | game = addHistoryState newPosition model.game
                , saveState = SaveDoesNotExist
              }
            , Cmd.none
            )

        SetViewMode newViewMode ->
            ( { model | viewMode = newViewMode }, Cmd.none )

        SavePosition position saveState ->
            ( model, postSave position saveState )

        PositionSaveSuccess data ->
            ( { model | saveState = saveStateStored data.id model.saveState }, Cmd.none )

        RequestRandomPosition ->
            ( model, getRandomPosition )

        GotRandomPosition newPosition ->
            ( { model | game = addHistoryState newPosition model.game }, Cmd.none )

        RequestAnalysePosition position ->
            ( model, postAnalysePosition position )

        GotAnalysePosition analysis ->
            ( { model | analysis = Just analysis }, Cmd.none )

        ToolAddPiece color pieceType ->
            updateSmartToolAdd (P.getC model.game) color pieceType
                |> liftToolUpdate model


editorStateModify : EditorModel -> EditorModel
editorStateModify editorModel =
    { editorModel
        | saveState = saveStateModify editorModel.saveState
        , analysis = Nothing
    }


applyUndo : EditorModel -> EditorModel
applyUndo model =
    { model | game = P.withRollback P.goL model.game }


applyRedo : EditorModel -> EditorModel
applyRedo model =
    { model | game = P.withRollback P.goR model.game }


{-| Handles all key presses.
-}
keyUp : KeyStroke -> EditorModel -> ( EditorModel, Cmd Msg )
keyUp stroke model =
    if stroke.ctrlKey == False && stroke.altKey == False then
        regularKeyUp stroke.key model

    else if stroke.ctrlKey == True && stroke.altKey == False then
        ctrlKeyUp stroke.key model

    else
        ( model, Cmd.none )


{-| Handles all ctrl + x shortcuts.
-}
ctrlKeyUp : String -> EditorModel -> ( EditorModel, Cmd Msg )
ctrlKeyUp key model =
    case key of
        "z" ->
            ( applyUndo model, Cmd.none )

        "y" ->
            ( applyRedo model, Cmd.none )

        _ ->
            ( model, Cmd.none )


regularKeyUp : String -> EditorModel -> ( EditorModel, Cmd Msg )
regularKeyUp key model =
    case key of
        "Delete" ->
            let
                ( newTool, outMsg ) =
                    updateSmartToolDelete (P.getC model.game) model.smartTool
            in
            handleToolOutputMsg outMsg
                { model | smartTool = newTool }

        _ ->
            ( model, Cmd.none )


clickStart : Tile -> EditorModel -> ( EditorModel, Cmd Msg )
clickStart downTile model =
    updateSmartToolStartDrag (P.getC model.game) downTile
        |> liftToolUpdate model


clickRelease : SvgCoord -> SvgCoord -> EditorModel -> ( EditorModel, Cmd Msg )
clickRelease down up model =
    smartToolRelease (safeTileCoordinate down) (safeTileCoordinate up) model


smartToolRelease : Maybe Tile -> Maybe Tile -> EditorModel -> ( EditorModel, Cmd Msg )
smartToolRelease down up model =
    case ( down, up ) of
        ( Just oldTileCoordinate, Just clickedTileCoordinate ) ->
            if oldTileCoordinate == clickedTileCoordinate then
                updateSmartToolClick (P.getC model.game) clickedTileCoordinate
                    |> liftToolUpdate model

            else
                updateSmartToolStopDrag (P.getC model.game) oldTileCoordinate clickedTileCoordinate
                    |> liftToolUpdate model

        _ ->
            liftToolUpdate model updateSmartToolDeselect


liftToolUpdate : EditorModel -> (SmartToolModel -> ( SmartToolModel, ToolOutputMsg )) -> ( EditorModel, Cmd Msg )
liftToolUpdate model toolUpdate =
    let
        ( newTool, outMsg ) =
            toolUpdate model.smartTool
    in
    case outMsg of
        ToolNoOp ->
            ( { model | smartTool = newTool }, Cmd.none )

        ToolCommit position ->
            ( { model
                | game = addHistoryState position model.game
                , preview = Nothing
                , smartTool = newTool
              }
            , Cmd.none
            )

        ToolPreview preview ->
            ( { model
                | preview = Just preview
                , smartTool = newTool
              }
            , Cmd.none
            )

        ToolRollback ->
            ( { model
                | preview = Nothing
                , smartTool = newTool
              }
            , Cmd.none
            )


handleToolOutputMsg : ToolOutputMsg -> EditorModel -> ( EditorModel, Cmd Msg )
handleToolOutputMsg msg model =
    case msg of
        ToolNoOp ->
            ( model, Cmd.none )

        ToolCommit position ->
            ( { model
                | game = addHistoryState position model.game
                , preview = Nothing
              }
            , Cmd.none
            )

        ToolPreview preview ->
            ( { model | preview = Just preview }, Cmd.none )

        ToolRollback ->
            ( { model | preview = Nothing }, Cmd.none )


handleMouseMove : Mouse.Event -> EditorModel -> ( EditorModel, Cmd Msg )
handleMouseMove event model =
    let
        gameSpacePos =
            gameSpaceCoordinate model.rect (realizedBoardViewBox ShowNumbers) event.clientPos
    in
    case model.drag of
        -- Moving the mouse when it is not held down.
        DragOff ->
            liftToolUpdate model
                (updateSmartToolHover (P.getC model.game) (safeTileCoordinate gameSpacePos))

        --Moving the mouse when it is held down.
        Dragging { start } ->
            liftToolUpdate
                { model | drag = Dragging { start = start, current = gameSpacePos } }
                (updateSmartToolContinueDrag start gameSpacePos)



--------------------------------------------------------------------------------
-- Editor > Smart Tool methods -------------------------------------------------
--------------------------------------------------------------------------------


moveDrag : Rect -> Mouse.Event -> DragState -> DragState
moveDrag rect event drag =
    case drag of
        DragOff ->
            DragOff

        Dragging { start } ->
            Dragging
                { start = start
                , current = gameSpaceCoordinate rect (realizedBoardViewBox ShowNumbers) event.clientPos
                }


pieceHighlighted : Tile -> Highlight -> PacoPiece -> Bool
pieceHighlighted tile highlight piece =
    if Sako.isAt tile piece then
        case highlight of
            HighlightBoth ->
                True

            HighlightWhite ->
                Sako.isColor Sako.White piece

            HighlightBlack ->
                Sako.isColor Sako.Black piece

            HighlightLingering ->
                False

    else
        False


updateSmartToolClick : PacoPosition -> Tile -> SmartToolModel -> ( SmartToolModel, ToolOutputMsg )
updateSmartToolClick position tile model =
    case model.highlight of
        Just ( highlightTile, highlight ) ->
            if highlightTile == tile then
                updateSmartToolSelection position highlightTile model

            else
                let
                    sourcePieces =
                        List.filter (pieceHighlighted highlightTile highlight) position.pieces

                    involvedPieces =
                        List.filter (Sako.isAt tile) position.pieces ++ sourcePieces

                    moveAction piece =
                        if pieceHighlighted highlightTile highlight piece then
                            { piece | position = tile }

                        else
                            piece

                    newPosition =
                        { position | pieces = List.map moveAction position.pieces }
                in
                if sourcePieces == [] then
                    ( smartToolRemoveDragInfo
                        { model | highlight = Just ( tile, HighlightBoth ) }
                    , ToolRollback
                    )

                else if isMoveBlocked involvedPieces then
                    ( smartToolRemoveDragInfo
                        { model | highlight = Nothing }
                    , ToolRollback
                    )

                else
                    ( smartToolRemoveDragInfo
                        { model | highlight = Nothing }
                    , ToolCommit newPosition
                    )

        Nothing ->
            ( smartToolRemoveDragInfo
                { model | highlight = Just ( tile, HighlightBoth ) }
            , ToolRollback
            )


updateSmartToolHover : PacoPosition -> Maybe Tile -> SmartToolModel -> ( SmartToolModel, ToolOutputMsg )
updateSmartToolHover position maybeTile model =
    -- To show a hover marker, we need both a highlighted tile and a
    -- hovered tile. Otherwise we don't do anything at all.
    Maybe.map2
        (\( highlightTile, _ ) hover ->
            if highlightTile == hover then
                -- We don't show a hover marker if we are above the
                -- highlighted tile.
                ( { model | hover = Nothing }, ToolNoOp )

            else if List.all (\p -> p.position /= highlightTile) position.pieces then
                -- If the highlight position is empty, then we don't show
                -- a highlighted tile either.
                ( { model | hover = Nothing }, ToolNoOp )

            else
                ( { model | hover = Just hover }, ToolNoOp )
        )
        model.highlight
        maybeTile
        |> Maybe.withDefault ( { model | hover = Nothing }, ToolNoOp )


updateSmartToolDeselect : SmartToolModel -> ( SmartToolModel, ToolOutputMsg )
updateSmartToolDeselect model =
    ( smartToolRemoveDragInfo { model | highlight = Nothing }, ToolRollback )


updateSmartToolDelete : PacoPosition -> SmartToolModel -> ( SmartToolModel, ToolOutputMsg )
updateSmartToolDelete position model =
    case model.highlight of
        Just ( highlightTile, highlight ) ->
            -- Delete all pieces that are currently selected.
            let
                deletionHighlight =
                    if highlight == HighlightLingering then
                        HighlightBoth

                    else
                        highlight

                deleteAction piece =
                    not (pieceHighlighted highlightTile deletionHighlight piece)

                newPosition =
                    { position | pieces = List.filter deleteAction position.pieces }
            in
            ( smartToolRemoveDragInfo
                { model | highlight = Just ( highlightTile, HighlightBoth ) }
            , ToolCommit newPosition
            )

        Nothing ->
            ( smartToolRemoveDragInfo model, ToolRollback )


updateSmartToolAdd : PacoPosition -> Sako.Color -> Sako.Type -> SmartToolModel -> ( SmartToolModel, ToolOutputMsg )
updateSmartToolAdd position color pieceType model =
    case model.highlight of
        Just ( highlightTile, _ ) ->
            let
                deleteAction piece =
                    piece.color /= color || piece.position /= highlightTile

                newPosition =
                    { position
                        | pieces =
                            { color = color, position = highlightTile, pieceType = pieceType }
                                :: List.filter deleteAction position.pieces
                    }
            in
            ( smartToolRemoveDragInfo
                { model | highlight = Just ( highlightTile, HighlightLingering ) }
            , ToolCommit newPosition
            )

        Nothing ->
            ( smartToolRemoveDragInfo model, ToolRollback )


updateSmartToolStartDrag : PacoPosition -> Tile -> SmartToolModel -> ( SmartToolModel, ToolOutputMsg )
updateSmartToolStartDrag position startTile model =
    let
        highlightType =
            case model.highlight of
                Just ( highlightTile, highlight ) ->
                    if highlightTile == startTile && highlight /= HighlightLingering then
                        highlight

                    else
                        HighlightBoth

                Nothing ->
                    HighlightBoth

        deleteAction piece =
            pieceHighlighted startTile highlightType piece

        newPosition =
            { position
                | pieces = List.filter (not << deleteAction) position.pieces
            }

        draggingPieces =
            List.filter deleteAction position.pieces
    in
    ( { model | dragStartTile = Just startTile, draggingPieces = draggingPieces }
    , ToolPreview newPosition
    )


updateSmartToolContinueDrag : SvgCoord -> SvgCoord -> SmartToolModel -> ( SmartToolModel, ToolOutputMsg )
updateSmartToolContinueDrag (SvgCoord ax ay) (SvgCoord bx by) model =
    ( { model | dragDelta = Just (SvgCoord (bx - ax) (by - ay)) }
    , ToolNoOp
    )


updateSmartToolStopDrag : PacoPosition -> Tile -> Tile -> SmartToolModel -> ( SmartToolModel, ToolOutputMsg )
updateSmartToolStopDrag position startTile targetTile model =
    let
        highlightType =
            case model.highlight of
                Just ( highlightTile, highlight ) ->
                    if highlightTile == startTile && highlight /= HighlightLingering then
                        highlight

                    else
                        HighlightBoth

                Nothing ->
                    HighlightBoth
    in
    case movePiecesIfPermitted highlightType startTile targetTile position of
        Just newPosition ->
            ( smartToolRemoveDragInfo { model | highlight = Nothing }
            , ToolCommit newPosition
            )

        Nothing ->
            ( smartToolRemoveDragInfo { model | highlight = Nothing }
            , ToolRollback
            )


updateSmartToolSelection : PacoPosition -> Tile -> SmartToolModel -> ( SmartToolModel, ToolOutputMsg )
updateSmartToolSelection position highlightTile model =
    let
        pieceCountOnSelectedTile =
            position.pieces
                |> List.filter (Sako.isAt highlightTile)
                |> List.length
    in
    if pieceCountOnSelectedTile > 1 then
        -- If there are two pieces, cycle through selection states.
        ( smartToolRemoveDragInfo
            { model
                | highlight = nextHighlight highlightTile model.highlight
            }
        , ToolRollback
        )

    else
        -- If there is only one piece, then we remove the selection.
        ( smartToolRemoveDragInfo
            { model | highlight = Nothing }
        , ToolRollback
        )


movePiecesIfPermitted : Highlight -> Tile -> Tile -> PacoPosition -> Maybe PacoPosition
movePiecesIfPermitted highlightType startTile targetTile position =
    let
        sourcePieces =
            List.filter (pieceHighlighted startTile highlightType) position.pieces

        involvedPieces =
            List.filter (Sako.isAt targetTile) position.pieces ++ sourcePieces

        moveAction piece =
            if pieceHighlighted startTile highlightType piece then
                { piece | position = targetTile }

            else
                piece

        newPosition =
            { position | pieces = List.map moveAction position.pieces }
    in
    if sourcePieces == [] || isMoveBlocked involvedPieces then
        Nothing

    else
        Just newPosition


isMoveBlocked : List PacoPiece -> Bool
isMoveBlocked involvedPieces =
    (List.count (Sako.isColor Sako.White) involvedPieces > 1)
        || (List.count (Sako.isColor Sako.Black) involvedPieces > 1)


{-| Adds a new state, storing the current state in the history. If there currently is a redo chain
it is discarded.
-}
addHistoryState : a -> Pivot a -> Pivot a
addHistoryState newState p =
    if P.getC p == newState then
        p

    else
        p |> P.setR [] |> P.appendGoR newState


subscriptions : model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ Browser.Events.onResize WindowResize
        , Browser.Events.onKeyUp (Decode.map KeyUp decodeKeyStroke)
        , Ports.responseSvgNodeContent SvgReadyForDownload
        ]
        |> Sub.map EditorMsgWrapper


decodeKeyStroke : Decode.Decoder KeyStroke
decodeKeyStroke =
    Decode.map3 KeyStroke
        (Decode.field "key" Decode.string)
        (Decode.field "ctrlKey" Decode.bool)
        (Decode.field "altKey" Decode.bool)


updateBlogEditor : BlogEditorMsg -> BlogModel -> ( BlogModel, Cmd Msg )
updateBlogEditor msg blog =
    case msg of
        OnMarkdownInput newText ->
            ( { blog | text = newText }, Cmd.none )


updateLoginPage : LoginPageMsg -> LoginModel -> ( LoginModel, Cmd Msg )
updateLoginPage msg loginPageModel =
    case msg of
        TypeUsername newText ->
            ( { loginPageModel | usernameRaw = newText }, Cmd.none )

        TypePassword newText ->
            ( { loginPageModel | passwordRaw = newText }, Cmd.none )

        TryLogin ->
            ( loginPageModel, postLoginPassword { username = loginPageModel.usernameRaw, password = loginPageModel.passwordRaw } )

        Logout ->
            ( loginPageModel, getLogout )



--------------------------------------------------------------------------------
-- View code -------------------------------------------------------------------
--------------------------------------------------------------------------------


view : Model -> Html Msg
view model =
    Element.layout [] (globalUi model)


globalUi : Model -> Element Msg
globalUi model =
    case model.page of
        MainPage ->
            mainPageUi model.taco

        EditorPage ->
            editorUi model.taco model.editor

        LibraryPage ->
            libraryUi model.taco model

        BlogPage ->
            blogUi model.taco model.blog

        LoginPage ->
            loginUi model.taco model.login


type alias PageHeaderInfo =
    { currentPage : Page
    , targetPage : Page
    , caption : String
    }


{-| Header that is shared by all pages.
-}
pageHeader : Taco -> Page -> Element Msg -> Element Msg
pageHeader taco currentPage additionalHeader =
    Element.row [ width fill, Background.color (Element.rgb255 230 230 230) ]
        [ pageHeaderButton [ Font.bold ]
            { currentPage = currentPage, targetPage = MainPage, caption = "Paco Ŝako Tools" }
        , pageHeaderButton [] { currentPage = currentPage, targetPage = EditorPage, caption = "Position Editor" }
        , pageHeaderButton [] { currentPage = currentPage, targetPage = LibraryPage, caption = "Library" }
        , pageHeaderButton [] { currentPage = currentPage, targetPage = BlogPage, caption = "Blog Editor" }
        , additionalHeader
        , loginHeaderInfo taco
        ]


yourDataWillNotBeSaved : Element a
yourDataWillNotBeSaved =
    Element.el [ padding 10, Font.color (Element.rgb255 200 150 150), Font.bold ] (Element.text "Your data will not be saved!")


pageHeaderButton : List (Element.Attribute Msg) -> PageHeaderInfo -> Element Msg
pageHeaderButton attributes { currentPage, targetPage, caption } =
    Input.button
        (padding 10
            :: (backgroundFocus (currentPage == targetPage)
                    ++ attributes
               )
        )
        { onPress =
            if currentPage == targetPage then
                Nothing

            else
                Just (OpenPage targetPage)
        , label = Element.text caption
        }



--------------------------------------------------------------------------------
-- Main Page viev --------------------------------------------------------------
--------------------------------------------------------------------------------


{-| The greeting that is shown when you first open the page.
-}
mainPageUi : Taco -> Element Msg
mainPageUi taco =
    Element.column [ width fill ]
        [ Element.html FontAwesome.Styles.css
        , pageHeader taco MainPage Element.none
        , greetingText taco
        ]


greetingText : Taco -> Element Msg
greetingText taco =
    case markdownView taco StaticText.mainPageGreetingText of
        Ok rendered ->
            Element.column
                [ Element.spacing 30
                , Element.padding 80
                , Element.width (Element.fill |> Element.maximum 1000)
                , Element.centerX
                ]
                rendered

        Err errors ->
            Element.text errors



--------------------------------------------------------------------------------
-- Library viev ----------------------------------------------------------------
--------------------------------------------------------------------------------


libraryUi : Taco -> Model -> Element Msg
libraryUi taco model =
    Element.column [ spacing 5, width fill ]
        [ Element.html FontAwesome.Styles.css
        , pageHeader taco LibraryPage Element.none
        , Element.text "Choose an initial board position to open the editor."
        , Element.el [ Font.size 24 ] (Element.text "Load saved position")
        , storedPositionList taco model
        , Element.el [ Font.size 24 ] (Element.text "Load examples")
        , examplesList taco model
        ]


examplesList : Taco -> Model -> Element Msg
examplesList taco model =
    remoteDataHelper
        { notAsked = Element.text "Examples were never requested."
        , loading = Element.text "Loading example positions ..."
        , failure = \_ -> Element.text "Error while loading example positions!"
        }
        (\examplePositions ->
            examplePositions
                |> List.map (loadPositionPreview taco)
                |> easyGrid 4 [ spacing 5 ]
        )
        model.exampleFile


storedPositionList : Taco -> Model -> Element Msg
storedPositionList taco model =
    remoteDataHelper
        { notAsked = Element.text "Please log in to load stored positions."
        , loading = Element.text "Loading stored positions ..."
        , failure = \_ -> Element.text "Error while loading stored positions!"
        }
        (\positions ->
            positions
                |> List.filterMap buildPacoPositionFromStoredPosition
                |> List.map (loadPositionPreview taco)
                |> easyGrid 4 [ spacing 5 ]
        )
        model.storedPositions


buildPacoPositionFromStoredPosition : StoredPosition -> Maybe PacoPosition
buildPacoPositionFromStoredPosition storedPosition =
    Sako.importExchangeNotation storedPosition.data.notation
        |> Result.toMaybe
        |> Maybe.map pacoPositionFromPieces


loadPositionPreview : Taco -> PacoPosition -> Element Msg
loadPositionPreview taco position =
    Input.button []
        { onPress = Just (LoadIntoEditor position)
        , label =
            Element.html
                (positionSvg taco
                    { position = position
                    , colorScheme = taco.colorScheme
                    , sideLength = 250
                    , drag = DragOff
                    , viewMode = CleanBoard
                    , nodeId = Nothing
                    , decoration = []
                    }
                )
                |> Element.map EditorMsgWrapper
        }



--------------------------------------------------------------------------------
-- Editor viev -----------------------------------------------------------------
--------------------------------------------------------------------------------


editorUi : Taco -> EditorModel -> Element Msg
editorUi taco model =
    Element.column [ width fill, height fill ]
        [ pageHeader taco EditorPage (saveStateHeader (P.getC model.game) model.saveState)
        , Element.row
            [ width fill, height fill ]
            [ Element.html FontAwesome.Styles.css
            , positionView taco model model.drag |> Element.map EditorMsgWrapper
            , sidebar taco model
            ]
        ]


saveStateHeader : PacoPosition -> SaveState -> Element Msg
saveStateHeader position saveState =
    case saveState of
        SaveIsCurrent id ->
            Element.el [ padding 10, Font.color (Element.rgb255 150 200 150), Font.bold ] (Element.text <| "Saved. (id=" ++ String.fromInt id ++ ")")

        SaveIsModified id ->
            Input.button
                [ padding 10
                , Font.color (Element.rgb255 200 150 150)
                , Font.bold
                ]
                { onPress = Just (EditorMsgWrapper (SavePosition position saveState))
                , label = Element.text <| "Unsaved Changes! (id=" ++ String.fromInt id ++ ")"
                }

        SaveDoesNotExist ->
            Input.button
                [ padding 10
                , Font.color (Element.rgb255 200 150 150)
                , Font.bold
                ]
                { onPress = Just (EditorMsgWrapper (SavePosition position saveState))
                , label = Element.text "Unsaved Changes!"
                }

        SaveNotRequired ->
            Element.none


{-| We render the board view slightly smaller than the window in order to avoid artifacts.
-}
windowSafetyMargin : Int
windowSafetyMargin =
    50


positionView : Taco -> EditorModel -> DragState -> Element EditorMsg
positionView taco editor drag =
    let
        ( _, windowHeight ) =
            editor.windowSize
    in
    Element.el [ width (Element.px windowHeight), height fill, centerX ]
        (Element.el [ centerX, centerY ]
            (Element.html
                (Html.div
                    [ Mouse.onDown MouseDown
                    , Mouse.onMove MouseMove
                    , Mouse.onUp MouseUp
                    , Html.Attributes.id "boardDiv"
                    ]
                    [ positionSvg taco
                        { position =
                            editor.preview |> Maybe.withDefault (P.getC editor.game)
                        , colorScheme = taco.colorScheme
                        , sideLength = windowHeight - windowSafetyMargin
                        , drag = drag
                        , viewMode = editor.viewMode
                        , nodeId = Just sakoEditorId
                        , decoration = toolDecoration editor
                        }
                    ]
                )
            )
        )


toolDecoration : EditorModel -> List BoardDecoration
toolDecoration model =
    ([ model.smartTool.highlight |> Maybe.map HighlightTile
     , model.smartTool.hover |> Maybe.map DropTarget
     , model.smartTool.dragStartTile
        |> Maybe.map (\tile -> HighlightTile ( tile, HighlightBoth ))
     ]
        |> List.filterMap identity
    )
        ++ (model.smartTool.draggingPieces
                |> List.map
                    (\piece ->
                        let
                            (SvgCoord dx dy) =
                                model.smartTool.dragDelta
                                    |> Maybe.withDefault (SvgCoord 0 0)

                            (SvgCoord x y) =
                                coordinateOfTile piece.position
                        in
                        DragPiece
                            { color = piece.color
                            , pieceType = piece.pieceType
                            , coord = SvgCoord (x + dx) (y + dy)
                            }
                    )
           )



--------------------------------------------------------------------------------
-- Editor > Sidebar view -------------------------------------------------------
--------------------------------------------------------------------------------


sidebar : Taco -> EditorModel -> Element Msg
sidebar taco model =
    Element.column [ width (fill |> Element.maximum 400), height fill, spacing 10, padding 10, Element.alignRight ]
        [ sidebarActionButtons model.game |> Element.map EditorMsgWrapper
        , Element.text "Add piece:"
        , addPieceButtons Sako.White "White:" model.smartTool |> Element.map EditorMsgWrapper
        , addPieceButtons Sako.Black "Black:" model.smartTool |> Element.map EditorMsgWrapper
        , colorSchemeConfig taco
        , viewModeConfig model
        , Input.button [] { onPress = Just (EditorMsgWrapper DownloadSvg), label = Element.text "Download as Svg" }
        , Input.button [] { onPress = Just (EditorMsgWrapper DownloadPng), label = Element.text "Download as Png" }
        , markdownCopyPaste taco model |> Element.map EditorMsgWrapper
        , analysisResult model
        ]


sidebarActionButtons : Pivot PacoPosition -> Element EditorMsg
sidebarActionButtons p =
    Element.row [ width fill ]
        [ undo p
        , redo p
        , resetStartingBoard p
        , resetClearBoard p
        , randomPosition
        , analysePosition (P.getC p)
        ]


flatButton : Maybe a -> Element a -> Element a
flatButton onPress content =
    Input.button [ padding 10 ]
        { onPress = onPress
        , label = content
        }


{-| The undo button.
-}
undo : Pivot a -> Element EditorMsg
undo p =
    if P.hasL p then
        flatButton (Just Undo) (icon [] Solid.arrowLeft)

    else
        flatButton Nothing (icon [ Font.color (Element.rgb255 150 150 150) ] Solid.arrowLeft)


{-| The redo button.
-}
redo : Pivot a -> Element EditorMsg
redo p =
    if P.hasR p then
        flatButton (Just Redo) (icon [] Solid.arrowRight)

    else
        flatButton Nothing (icon [ Font.color (Element.rgb255 150 150 150) ] Solid.arrowRight)


resetStartingBoard : Pivot PacoPosition -> Element EditorMsg
resetStartingBoard p =
    if P.getC p /= initialPosition then
        flatButton (Just (Reset initialPosition)) (icon [] Solid.home)

    else
        flatButton Nothing (icon [ Font.color (Element.rgb255 150 150 150) ] Solid.home)


resetClearBoard : Pivot PacoPosition -> Element EditorMsg
resetClearBoard p =
    if P.getC p /= emptyPosition then
        flatButton (Just (Reset emptyPosition)) (icon [] Solid.broom)

    else
        flatButton Nothing (icon [ Font.color (Element.rgb255 150 150 150) ] Solid.broom)


randomPosition : Element EditorMsg
randomPosition =
    flatButton (Just RequestRandomPosition) (icon [] Solid.dice)


analysePosition : PacoPosition -> Element EditorMsg
analysePosition position =
    flatButton (Just (RequestAnalysePosition position)) (icon [] Solid.calculator)


addPieceButtons : Sako.Color -> String -> SmartToolModel -> Element EditorMsg
addPieceButtons color text tool =
    let
        hasHighlight =
            tool.highlight /= Nothing
    in
    Element.wrappedRow [ width fill ]
        [ Element.text text
        , singleAddPieceButton hasHighlight color Sako.Pawn Solid.chessPawn
        , singleAddPieceButton hasHighlight color Sako.Rook Solid.chessRook
        , singleAddPieceButton hasHighlight color Sako.Knight Solid.chessKnight
        , singleAddPieceButton hasHighlight color Sako.Bishop Solid.chessBishop
        , singleAddPieceButton hasHighlight color Sako.Queen Solid.chessQueen
        , singleAddPieceButton hasHighlight color Sako.King Solid.chessKing
        ]


singleAddPieceButton : Bool -> Sako.Color -> Sako.Type -> Icon -> Element EditorMsg
singleAddPieceButton hasHighlight color pieceType buttonIcon =
    let
        onPress =
            if hasHighlight then
                Just (ToolAddPiece color pieceType)

            else
                Nothing
    in
    Input.button []
        { onPress = onPress
        , label = Element.row [ padding 7 ] [ icon [] buttonIcon ]
        }


backgroundFocus : Bool -> List (Element.Attribute msg)
backgroundFocus isFocused =
    if isFocused then
        [ Background.color (Element.rgb255 200 200 200) ]

    else
        []


{-| A toolConfigOption represents one of several possible choices. If it represents the currently
choosen value (single selection only) it is highlighted. When clicked it will send a message.
-}
toolConfigOption : a -> (a -> msg) -> a -> String -> Element msg
toolConfigOption currentValue msg buttonValue caption =
    Input.button
        (padding 5
            :: backgroundFocus (currentValue == buttonValue)
        )
        { onPress = Just (msg buttonValue)
        , label =
            Element.text caption
        }


colorPicker : (Pieces.SideColor -> msg) -> Pieces.SideColor -> Pieces.SideColor -> Element msg
colorPicker msg currentColor newColor =
    let
        iconChoice =
            if currentColor == newColor then
                Solid.yinYang

            else
                Regular.circle
    in
    Input.button [ width fill, padding 5, Background.color (Pieces.colorUi newColor.stroke) ]
        { onPress = Just (msg newColor)
        , label =
            icon
                [ centerX
                , Font.color (Pieces.colorUi newColor.fill)
                ]
                iconChoice
        }


colorSchemeConfig : Taco -> Element Msg
colorSchemeConfig taco =
    Element.column [ width fill, spacing 5 ]
        [ Element.text "Piece colors"
        , colorSchemeConfigWhite taco
        , colorSchemeConfigBlack taco
        ]


colorSchemeConfigWhite : Taco -> Element Msg
colorSchemeConfigWhite taco =
    Element.row [ width fill ]
        [ colorPicker WhiteSideColor taco.colorScheme.white Pieces.whitePieceColor
        , colorPicker WhiteSideColor taco.colorScheme.white Pieces.redPieceColor
        , colorPicker WhiteSideColor taco.colorScheme.white Pieces.orangePieceColor
        , colorPicker WhiteSideColor taco.colorScheme.white Pieces.yellowPieceColor
        , colorPicker WhiteSideColor taco.colorScheme.white Pieces.greenPieceColor
        , colorPicker WhiteSideColor taco.colorScheme.white Pieces.bluePieceColor
        , colorPicker WhiteSideColor taco.colorScheme.white Pieces.purplePieceColor
        , colorPicker WhiteSideColor taco.colorScheme.white Pieces.pinkPieceColor
        , colorPicker WhiteSideColor taco.colorScheme.white Pieces.blackPieceColor
        ]


colorSchemeConfigBlack : Taco -> Element Msg
colorSchemeConfigBlack taco =
    Element.wrappedRow [ width fill ]
        [ colorPicker BlackSideColor taco.colorScheme.black Pieces.whitePieceColor
        , colorPicker BlackSideColor taco.colorScheme.black Pieces.redPieceColor
        , colorPicker BlackSideColor taco.colorScheme.black Pieces.orangePieceColor
        , colorPicker BlackSideColor taco.colorScheme.black Pieces.yellowPieceColor
        , colorPicker BlackSideColor taco.colorScheme.black Pieces.greenPieceColor
        , colorPicker BlackSideColor taco.colorScheme.black Pieces.bluePieceColor
        , colorPicker BlackSideColor taco.colorScheme.black Pieces.purplePieceColor
        , colorPicker BlackSideColor taco.colorScheme.black Pieces.pinkPieceColor
        , colorPicker BlackSideColor taco.colorScheme.black Pieces.blackPieceColor
        ]


viewModeConfig : EditorModel -> Element Msg
viewModeConfig editor =
    Element.wrappedRow [ spacing 5 ]
        [ toolConfigOption editor.viewMode (SetViewMode >> EditorMsgWrapper) ShowNumbers "Show numbers"
        , toolConfigOption editor.viewMode (SetViewMode >> EditorMsgWrapper) CleanBoard "Hide numbers"
        ]



--- End of the sidebar view code ---


type ViewMode
    = ShowNumbers
    | CleanBoard


boardViewBox : ViewMode -> Rect
boardViewBox viewMode =
    case viewMode of
        ShowNumbers ->
            { x = -70
            , y = -30
            , width = 900
            , height = 920
            }

        CleanBoard ->
            { x = -30
            , y = -30
            , width = 860
            , height = 860
            }


{-| The svg showing the game board is a square. The viewport does not need to be a square.
The browser then centers the requested viewport inside the realized viewport. This function
calculates the rectangle used for the realized viewport in order to transform coordinates.

Assumes, that height > width for boardViewBox.

-}
realizedBoardViewBox : ViewMode -> Rect
realizedBoardViewBox viewMode =
    let
        rect =
            boardViewBox viewMode
    in
    { rect
        | x = rect.x - (rect.height - rect.width) / 2
        , width = rect.height
    }


viewBox : Rect -> Svg.Attribute msg
viewBox rect =
    String.join
        " "
        [ String.fromFloat rect.x
        , String.fromFloat rect.y
        , String.fromFloat rect.width
        , String.fromFloat rect.height
        ]
        |> Svg.Attributes.viewBox


sakoEditorId : String
sakoEditorId =
    "sako-editor"



--positionSvg : Pieces.ColorScheme -> Int -> PacoPosition -> DragState -> Html Msg


positionSvg :
    Taco
    ->
        { position : PacoPosition
        , sideLength : Int
        , colorScheme : Pieces.ColorScheme
        , drag : DragState
        , viewMode : ViewMode
        , nodeId : Maybe String
        , decoration : List BoardDecoration
        }
    -> Html EditorMsg
positionSvg taco config =
    let
        idAttribute =
            case config.nodeId of
                Just nodeId ->
                    [ Svg.Attributes.id nodeId ]

                Nothing ->
                    []

        attributes =
            [ Svg.Attributes.width <| String.fromInt config.sideLength
            , Svg.Attributes.height <| String.fromInt config.sideLength
            , viewBox (boardViewBox config.viewMode)
            ]
                ++ idAttribute
    in
    Svg.svg attributes
        [ board config.viewMode
        , highlightLayer config.decoration
        , dropTargetLayer config.decoration
        , piecesSvg config.colorScheme config.position
        , dragLayer taco config.decoration
        ]


highlightLayer : List BoardDecoration -> Svg a
highlightLayer decorations =
    decorations
        |> List.filterMap getHighlightTile
        |> List.map highlightSvg
        |> Svg.g []


highlightSvg : ( Tile, Highlight ) -> Svg a
highlightSvg ( tile, highlight ) =
    let
        shape =
            case highlight of
                HighlightBoth ->
                    Svg.Attributes.d "m 0 0 v 100 h 100 v -100 z"

                HighlightWhite ->
                    Svg.Attributes.d "m 0 0 v 100 h 50 v -100 z"

                HighlightBlack ->
                    Svg.Attributes.d "m 50 0 v 100 h 50 v -100 z"

                HighlightLingering ->
                    Svg.Attributes.d "m 50 0 l 50 50 l -50 50 l -50 -50 z"
    in
    Svg.path
        [ tileTransform tile
        , shape
        , Svg.Attributes.fill "rgb(255, 255, 100)"
        ]
        []


dropTargetLayer : List BoardDecoration -> Svg a
dropTargetLayer decorations =
    decorations
        |> List.filterMap getDropTarget
        |> List.map dropTargetSvg
        |> Svg.g []


dropTargetSvg : Tile -> Svg a
dropTargetSvg (Tile x y) =
    Svg.circle
        [ Svg.Attributes.r "20"
        , Svg.Attributes.cx (String.fromInt (100 * x + 50))
        , Svg.Attributes.cy (String.fromInt (700 - 100 * y + 50))
        , Svg.Attributes.fill "rgb(200, 200, 200)"
        ]
        []


dragLayer : Taco -> List BoardDecoration -> Svg a
dragLayer taco decorations =
    decorations
        |> List.filterMap getDragPiece
        |> List.map (dragSvg taco.colorScheme)
        |> Svg.g []


dragSvg : Pieces.ColorScheme -> DragPieceData -> Svg a
dragSvg colorScheme data =
    let
        (SvgCoord x y) =
            data.coord
    in
    Svg.g
        [ Svg.Attributes.transform
            ("translate("
                ++ String.fromInt x
                ++ ", "
                ++ String.fromInt y
                ++ ")"
            )
        ]
        [ Pieces.figure colorScheme data.pieceType data.color
        ]


piecesSvg : Pieces.ColorScheme -> PacoPosition -> Svg msg
piecesSvg colorScheme pacoPosition =
    pacoPosition.pieces
        |> sortBlacksFirst
        |> List.map (pieceSvg colorScheme)
        |> Svg.g []


{-| When rendering a union the black piece must appear below the white piece. Reorder the pieces
to make this happen.
-}
sortBlacksFirst : List PacoPiece -> List PacoPiece
sortBlacksFirst pieces =
    List.filter (\piece -> piece.color == Sako.Black) pieces
        ++ List.filter (\piece -> piece.color == Sako.White) pieces


pieceSvg : Pieces.ColorScheme -> PacoPiece -> Svg msg
pieceSvg colorScheme piece =
    Svg.g [ tileTransform piece.position ]
        [ Pieces.figure colorScheme piece.pieceType piece.color
        ]


coordinateOfTile : Tile -> SvgCoord
coordinateOfTile (Tile x y) =
    SvgCoord (100 * x) (700 - 100 * y)


tileTransform : Tile -> Svg.Attribute a
tileTransform tile =
    let
        (SvgCoord x y) =
            coordinateOfTile tile
    in
    Svg.Attributes.transform
        ("translate("
            ++ String.fromInt x
            ++ ", "
            ++ String.fromInt y
            ++ ")"
        )


board : ViewMode -> Svg msg
board mode =
    let
        decoration =
            case mode of
                ShowNumbers ->
                    [ columnTag "a" "50"
                    , columnTag "b" "150"
                    , columnTag "c" "250"
                    , columnTag "d" "350"
                    , columnTag "e" "450"
                    , columnTag "f" "550"
                    , columnTag "g" "650"
                    , columnTag "h" "750"
                    , rowTag "1" "770"
                    , rowTag "2" "670"
                    , rowTag "3" "570"
                    , rowTag "4" "470"
                    , rowTag "5" "370"
                    , rowTag "6" "270"
                    , rowTag "7" "170"
                    , rowTag "8" "70"
                    ]

                CleanBoard ->
                    []
    in
    Svg.g []
        ([ Svg.rect
            [ Svg.Attributes.x "-10"
            , Svg.Attributes.y "-10"
            , Svg.Attributes.width "820"
            , Svg.Attributes.height "820"
            , Svg.Attributes.fill "#242"
            ]
            []
         , Svg.rect
            [ Svg.Attributes.x "0"
            , Svg.Attributes.y "0"
            , Svg.Attributes.width "800"
            , Svg.Attributes.height "800"
            , Svg.Attributes.fill "#595"
            ]
            []
         , Svg.path
            [ Svg.Attributes.d "M 0,0 H 800 V 100 H 0 Z M 0,200 H 800 V 300 H 0 Z M 0,400 H 800 V 500 H 0 Z M 0,600 H 800 V 700 H 0 Z M 100,0 V 800 H 200 V 0 Z M 300,0 V 800 H 400 V 0 Z M 500,0 V 800 H 600 V 0 Z M 700,0 V 800 H 800 V 0 Z"
            , Svg.Attributes.fill "#9F9"
            ]
            []
         ]
            ++ decoration
        )


columnTag : String -> String -> Svg msg
columnTag letter x =
    Svg.text_
        [ Svg.Attributes.style "text-anchor:middle;font-size:50px;pointer-events:none;-moz-user-select: none;"
        , Svg.Attributes.x x
        , Svg.Attributes.y "870"
        , Svg.Attributes.fill "#555"
        ]
        [ Svg.text letter ]


rowTag : String -> String -> Svg msg
rowTag digit y =
    Svg.text_
        [ Svg.Attributes.style "text-anchor:end;font-size:50px;pointer-events:none;-moz-user-select: none;"
        , Svg.Attributes.x "-25"
        , Svg.Attributes.y y
        , Svg.Attributes.fill "#555"
        ]
        [ Svg.text digit ]


icon : List (Element.Attribute msg) -> Icon -> Element msg
icon attributes iconType =
    Element.el attributes (Element.html (viewIcon iconType))


markdownCopyPaste : Taco -> EditorModel -> Element EditorMsg
markdownCopyPaste taco model =
    Element.column [ spacing 5 ]
        [ Element.text "Text notation you can store"
        , Input.multiline [ Font.family [ Font.monospace ] ]
            { onChange = \_ -> EditorMsgNoOp
            , text = Sako.exportExchangeNotation (P.getC model.game).pieces
            , placeholder = Nothing
            , label = Input.labelHidden "Copy this to a text document for later use."
            , spellcheck = False
            }
        , Element.text "Recover state from notation"
        , Input.multiline [ Font.family [ Font.monospace ] ]
            { onChange = UpdateUserPaste
            , text = model.userPaste
            , placeholder = Just (Input.placeholder [] (Element.text "Paste level notation."))
            , label = Input.labelHidden "Paste level notation as you see above."
            , spellcheck = False
            }
        , parsedMarkdownPaste taco model
        ]


parsedMarkdownPaste : Taco -> EditorModel -> Element EditorMsg
parsedMarkdownPaste taco model =
    case model.pasteParsed of
        NoInput ->
            Element.none

        ParseError error ->
            Element.text error

        ParseSuccess pacoPosition ->
            Input.button []
                { onPress = Just (UseUserPaste pacoPosition)
                , label =
                    Element.row [ spacing 5 ]
                        [ Element.html
                            (positionSvg taco
                                { position = pacoPosition
                                , colorScheme = taco.colorScheme
                                , sideLength = 100
                                , drag = DragOff
                                , viewMode = CleanBoard
                                , nodeId = Nothing
                                , decoration = []
                                }
                            )
                        , Element.text "Load"
                        ]
                }


analysisResult : EditorModel -> Element msg
analysisResult editorModel =
    case editorModel.analysis of
        Just analysis ->
            Element.paragraph []
                [ Element.text analysis.text_summary
                ]

        Nothing ->
            Element.none



--------------------------------------------------------------------------------
-- Blog editor ui --------------------------------------------------------------
--------------------------------------------------------------------------------


blogUi : Taco -> BlogModel -> Element Msg
blogUi taco blog =
    Element.column [ width fill ]
        [ Element.html FontAwesome.Styles.css
        , pageHeader taco BlogPage yourDataWillNotBeSaved
        , Element.row [ Element.width Element.fill ]
            [ Input.multiline [ Element.width (Element.px 600) ]
                { onChange = OnMarkdownInput >> BlogMsgWrapper
                , text = blog.text
                , placeholder = Nothing
                , label = Input.labelHidden "Markdown input"
                , spellcheck = False
                }
            , case markdownView taco blog.text of
                Ok rendered ->
                    Element.column
                        [ Element.spacing 30
                        , Element.padding 80
                        , Element.width (Element.fill |> Element.maximum 1000)
                        , Element.centerX
                        ]
                        rendered

                Err errors ->
                    Element.text errors
            ]
        ]


markdownView : Taco -> String -> Result String (List (Element Msg))
markdownView taco content =
    content
        |> Markdown.Parser.parse
        |> Result.mapError (\error -> error |> List.map Markdown.Parser.deadEndToString |> String.join "\n")
        |> Result.andThen (Markdown.Parser.render (renderer taco))


codeBlock : Taco -> { body : String, language : Maybe String } -> Element Msg
codeBlock taco details =
    case Sako.importExchangeNotationList details.body of
        Err _ ->
            Element.text "There is an error in the position notation :-("

        Ok positions ->
            let
                positionPreviews =
                    positions
                        |> List.map pacoPositionFromPieces
                        |> List.map (loadPositionPreview taco)

                rows =
                    List.greedyGroupsOf 3 positionPreviews
            in
            Element.column [ spacing 10, centerX ]
                (rows |> List.map (\group -> Element.row [ spacing 10 ] group))
                |> Element.map (\_ -> EditorMsgWrapper EditorMsgNoOp)


renderer : Taco -> Markdown.Parser.Renderer (Element Msg)
renderer taco =
    { heading = heading
    , raw =
        Element.paragraph
            [ Element.spacing 15 ]
    , thematicBreak = Element.none
    , plain = Element.text
    , bold = \content -> Element.row [ Font.bold ] [ Element.text content ]
    , italic = \content -> Element.row [ Font.italic ] [ Element.text content ]
    , code = code
    , link =
        \{ destination } body ->
            Element.newTabLink
                [ Element.htmlAttribute (Html.Attributes.style "display" "inline-flex") ]
                { url = destination
                , label =
                    Element.paragraph
                        [ Font.color (Element.rgb255 0 0 255)
                        ]
                        body
                }
                |> Ok
    , image =
        \image body ->
            Element.image [ Element.width Element.fill ] { src = image.src, description = body }
                |> Ok
    , list =
        \items ->
            Element.column [ Element.spacing 15 ]
                (items
                    |> List.map
                        (\itemBlocks ->
                            Element.row [ Element.spacing 5 ]
                                [ Element.el
                                    [ Element.alignTop ]
                                    (Element.text "•")
                                , itemBlocks
                                ]
                        )
                )
    , codeBlock = codeBlock taco
    , html = Markdown.Html.oneOf []
    }


heading : { level : Int, rawText : String, children : List (Element msg) } -> Element msg
heading { level, rawText, children } =
    Element.paragraph
        [ Font.size
            (case level of
                1 ->
                    36

                2 ->
                    24

                _ ->
                    20
            )
        , Font.bold
        , Font.family [ Font.typeface "Montserrat" ]
        , Element.Region.heading level
        , Element.htmlAttribute
            (Html.Attributes.attribute "name" (rawTextToId rawText))
        , Font.center
        , Element.htmlAttribute
            (Html.Attributes.id (rawTextToId rawText))
        ]
        children


rawTextToId : String -> String
rawTextToId rawText =
    rawText
        |> String.toLower
        |> String.replace " " ""


code : String -> Element msg
code snippet =
    Element.text snippet



--------------------------------------------------------------------------------
-- Login ui --------------------------------------------------------------------
--------------------------------------------------------------------------------


loginUi : Taco -> LoginModel -> Element Msg
loginUi taco loginPageData =
    Element.column [ width fill ]
        [ Element.html FontAwesome.Styles.css
        , pageHeader taco LoginPage Element.none
        , case taco.login of
            Just user ->
                loginInfoPage user

            Nothing ->
                loginDialog taco loginPageData
        ]


loginDialog : Taco -> LoginModel -> Element Msg
loginDialog _ loginPageData =
    Element.column []
        [ Input.username []
            { label = Input.labelAbove [] (Element.text "Username")
            , onChange = TypeUsername >> LoginPageMsgWrapper
            , placeholder = Just (Input.placeholder [] (Element.text "Username"))
            , text = loginPageData.usernameRaw
            }
        , Input.currentPassword []
            { label = Input.labelAbove [] (Element.text "Password")
            , onChange = TypePassword >> LoginPageMsgWrapper
            , placeholder = Just (Input.placeholder [] (Element.text "Password"))
            , text = loginPageData.passwordRaw
            , show = False
            }
        , Input.button [] { label = Element.text "Login", onPress = Just (LoginPageMsgWrapper TryLogin) }
        ]


loginInfoPage : User -> Element Msg
loginInfoPage user =
    Element.column [ padding 10, spacing 10 ]
        [ Element.text ("Username: " ++ user.username)
        , Element.text ("ID: " ++ String.fromInt user.id)
        , Input.button [] { label = Element.text "Logout", onPress = Just (LoginPageMsgWrapper Logout) }
        ]


loginHeaderInfo : Taco -> Element Msg
loginHeaderInfo taco =
    let
        loginCaption =
            case taco.login of
                Just user ->
                    Element.row [ padding 10, spacing 10 ] [ icon [] Solid.user, Element.text user.username ]

                Nothing ->
                    Element.row [ padding 10, spacing 10 ] [ icon [] Solid.signInAlt, Element.text "Login" ]
    in
    Input.button [ Element.alignRight ]
        { onPress = Just (OpenPage LoginPage), label = loginCaption }



--------------------------------------------------------------------------------
-- REST api --------------------------------------------------------------------
--------------------------------------------------------------------------------


defaultErrorHandler : (a -> Msg) -> Result Http.Error a -> Msg
defaultErrorHandler happyPath result =
    case result of
        Ok username ->
            happyPath username

        Err error ->
            HttpError error


type alias LoginData =
    { username : String
    , password : String
    }


encodeLoginData : LoginData -> Value
encodeLoginData record =
    Encode.object
        [ ( "username", Encode.string <| record.username )
        , ( "password", Encode.string <| record.password )
        ]


decodeUser : Decode.Decoder User
decodeUser =
    Decode.map2 User
        (Decode.field "user_id" Decode.int)
        (Decode.field "username" Decode.string)


postLoginPassword : LoginData -> Cmd Msg
postLoginPassword data =
    Http.post
        { url = "/api/login/password"
        , body = Http.jsonBody (encodeLoginData data)
        , expect = Http.expectJson (defaultErrorHandler LoginSuccess) decodeUser
        }


getCurrentLogin : Cmd Msg
getCurrentLogin =
    Http.get
        { url = "/api/user_id"
        , expect =
            Http.expectJson
                (Result.toMaybe
                    >> Maybe.map LoginSuccess
                    >> Maybe.withDefault GlobalNoOp
                )
                decodeUser
        }


getLogout : Cmd Msg
getLogout =
    Http.get
        { url = "/api/logout"
        , expect = Http.expectWhatever (defaultErrorHandler (\() -> LogoutSuccess))
        }


postSave : PacoPosition -> SaveState -> Cmd Msg
postSave position saveState =
    case saveStateId saveState of
        Just id ->
            postSaveUpdate position id

        Nothing ->
            postSaveCreate position


{-| The server treats this object as an opaque JSON object.
-}
type alias CreatePositionData =
    { notation : String
    }


encodeCreatePositionData : CreatePositionData -> Value
encodeCreatePositionData record =
    Encode.object
        [ ( "notation", Encode.string <| record.notation )
        ]


encodeCreatePosition : PacoPosition -> Value
encodeCreatePosition position =
    Encode.object
        [ ( "data"
          , encodeCreatePositionData
                { notation = Sako.exportExchangeNotation position.pieces
                }
          )
        ]


type alias SavePositionDone =
    { id : Int
    }


decodeSavePositionDone : Decode.Decoder SavePositionDone
decodeSavePositionDone =
    Decode.map SavePositionDone
        (Decode.field "id" Decode.int)


postSaveCreate : PacoPosition -> Cmd Msg
postSaveCreate position =
    Http.post
        { url = "/api/position"
        , body = Http.jsonBody (encodeCreatePosition position)
        , expect =
            Http.expectJson
                (defaultErrorHandler (EditorMsgWrapper << PositionSaveSuccess))
                decodeSavePositionDone
        }


postSaveUpdate : PacoPosition -> Int -> Cmd Msg
postSaveUpdate position id =
    Http.post
        { url = "/api/position/" ++ String.fromInt id
        , body = Http.jsonBody (encodeCreatePosition position)
        , expect =
            Http.expectJson
                (defaultErrorHandler (EditorMsgWrapper << PositionSaveSuccess))
                decodeSavePositionDone
        }


type alias StoredPosition =
    { id : Int
    , owner : Int
    , data : StoredPositionData
    }


type alias StoredPositionData =
    { notation : String
    }


decodeStoredPosition : Decode.Decoder StoredPosition
decodeStoredPosition =
    Decode.map3 StoredPosition
        (Decode.field "id" Decode.int)
        (Decode.field "owner" Decode.int)
        (Decode.field "data" decodeStoredPositionData)


decodeStoredPositionData : Decode.Decoder StoredPositionData
decodeStoredPositionData =
    Decode.map StoredPositionData
        (Decode.field "notation" Decode.string)


getAllSavedPositions : Cmd Msg
getAllSavedPositions =
    Http.get
        { url = "/api/position"
        , expect = Http.expectJson (defaultErrorHandler AllPositionsLoadedSuccess) (Decode.list decodeStoredPosition)
        }


decodePacoPositionData : Decode.Decoder PacoPosition
decodePacoPositionData =
    Decode.andThen
        (\json ->
            json.notation
                |> Sako.importExchangeNotation
                |> Result.map (pacoPositionFromPieces >> Decode.succeed)
                |> Result.withDefault (Decode.fail "Data has wrong shape.")
        )
        decodeStoredPositionData


getRandomPosition : Cmd Msg
getRandomPosition =
    Http.get
        { url = "/api/random"
        , expect = Http.expectJson (defaultErrorHandler (EditorMsgWrapper << GotRandomPosition)) decodePacoPositionData
        }


type alias AnalysisReport =
    { text_summary : String

    -- TODO: search_result: SakoSearchResult,
    }


decodeAnalysisReport : Decode.Decoder AnalysisReport
decodeAnalysisReport =
    Decode.map AnalysisReport
        (Decode.field "text_summary" Decode.string)


postAnalysePosition : PacoPosition -> Cmd Msg
postAnalysePosition position =
    Http.post
        { url = "/api/analyse"
        , body = Http.jsonBody (encodeCreatePosition position)
        , expect =
            Http.expectJson
                (defaultErrorHandler (EditorMsgWrapper << GotAnalysePosition))
                decodeAnalysisReport
        }



--------------------------------------------------------------------------------
-- View Components -------------------------------------------------------------
--------------------------------------------------------------------------------
-- View components should not depend on any information that is specific to this
-- application. I am planing to move this whole block into a separate file when
-- all components that I have identified are moved into this block.


{-| Creates a grid with the given amount of columns. You can pass in a list of
attributes which will be applied to both the column and row element. Typically
you would pass in `[ spacing 5 ]` in here.
-}
easyGrid : Int -> List (Element.Attribute msg) -> List (Element msg) -> Element msg
easyGrid columnCount attributes list =
    list
        |> List.greedyGroupsOf columnCount
        |> List.map (\group -> Element.row attributes group)
        |> Element.column attributes


{-| Render remote data into an Element, while providing fallbacks for error
cases in a compact form.
-}
remoteDataHelper :
    { notAsked : Element msg
    , loading : Element msg
    , failure : e -> Element msg
    }
    -> (a -> Element msg)
    -> RemoteData.RemoteData e a
    -> Element msg
remoteDataHelper config display data =
    case data of
        RemoteData.NotAsked ->
            config.notAsked

        RemoteData.Loading ->
            config.loading

        RemoteData.Failure e ->
            config.failure e

        RemoteData.Success a ->
            display a
