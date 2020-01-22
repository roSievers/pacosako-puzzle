module Main exposing (main)

import Browser
import Browser.Dom as Dom
import Browser.Events
import Element exposing (Element, centerX, centerY, fill, fillPortion, height, padding, spacing, width)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
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
import Sako exposing (PacoPiece, Tile(..), tileX, tileY)
import StaticText
import Svg exposing (Svg)
import Svg.Attributes
import Task


main : Program Decode.Value Model GlobalMsg
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
    , editor : Editor
    , blog : Blog
    , login : LoginPageData

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


type alias LoginPageData =
    { usernameRaw : String
    , passwordRaw : String
    }


{-| Represents the possible
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
saveStateStored newId saveState =
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


type alias Editor =
    { saveState : SaveState
    , game : Pivot PacoPosition
    , drag : DragState
    , windowSize : ( Int, Int )
    , tool : EditorTool
    , moveToolColor : Maybe Sako.Color
    , deleteToolColor : Maybe Sako.Color
    , createToolColor : Sako.Color
    , createToolType : Sako.Type
    , userPaste : String
    , pasteParsed : PositionParseResult
    , viewMode : ViewMode
    }


type alias Blog =
    { text : String }


type PositionParseResult
    = NoInput
    | ParseError String
    | ParseSuccess PacoPosition


type EditorTool
    = MoveTool
    | DeleteTool
    | CreateTool


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


svgX : SvgCoord -> Int
svgX (SvgCoord x _) =
    x


svgY : SvgCoord -> Int
svgY (SvgCoord _ y) =
    y


pacoPiece : Sako.Color -> Sako.Type -> Tile -> PacoPiece
pacoPiece color pieceType position =
    { pieceType = pieceType, color = color, position = position }


initialPosition : PacoPosition
initialPosition =
    { moveNumber = 0
    , pieces =
        [ pacoPiece Sako.White Sako.Rock (Tile 0 0)
        , pacoPiece Sako.White Sako.Knight (Tile 1 0)
        , pacoPiece Sako.White Sako.Bishop (Tile 2 0)
        , pacoPiece Sako.White Sako.Queen (Tile 3 0)
        , pacoPiece Sako.White Sako.King (Tile 4 0)
        , pacoPiece Sako.White Sako.Bishop (Tile 5 0)
        , pacoPiece Sako.White Sako.Knight (Tile 6 0)
        , pacoPiece Sako.White Sako.Rock (Tile 7 0)
        , pacoPiece Sako.White Sako.Pawn (Tile 0 1)
        , pacoPiece Sako.White Sako.Pawn (Tile 1 1)
        , pacoPiece Sako.White Sako.Pawn (Tile 2 1)
        , pacoPiece Sako.White Sako.Pawn (Tile 3 1)
        , pacoPiece Sako.White Sako.Pawn (Tile 4 1)
        , pacoPiece Sako.White Sako.Pawn (Tile 5 1)
        , pacoPiece Sako.White Sako.Pawn (Tile 6 1)
        , pacoPiece Sako.White Sako.Pawn (Tile 7 1)
        , pacoPiece Sako.Black Sako.Pawn (Tile 0 6)
        , pacoPiece Sako.Black Sako.Pawn (Tile 1 6)
        , pacoPiece Sako.Black Sako.Pawn (Tile 2 6)
        , pacoPiece Sako.Black Sako.Pawn (Tile 3 6)
        , pacoPiece Sako.Black Sako.Pawn (Tile 4 6)
        , pacoPiece Sako.Black Sako.Pawn (Tile 5 6)
        , pacoPiece Sako.Black Sako.Pawn (Tile 6 6)
        , pacoPiece Sako.Black Sako.Pawn (Tile 7 6)
        , pacoPiece Sako.Black Sako.Rock (Tile 0 7)
        , pacoPiece Sako.Black Sako.Knight (Tile 1 7)
        , pacoPiece Sako.Black Sako.Bishop (Tile 2 7)
        , pacoPiece Sako.Black Sako.Queen (Tile 3 7)
        , pacoPiece Sako.Black Sako.King (Tile 4 7)
        , pacoPiece Sako.Black Sako.Bishop (Tile 5 7)
        , pacoPiece Sako.Black Sako.Knight (Tile 6 7)
        , pacoPiece Sako.Black Sako.Rock (Tile 7 7)
        ]
    }


emptyPosition : PacoPosition
emptyPosition =
    { moveNumber = 0
    , pieces = []
    }


type DragState
    = DragOff
    | Dragging { start : SvgCoord, current : SvgCoord, rect : Rect }


startDrag : Rect -> Mouse.Event -> DragState
startDrag element event =
    let
        start =
            gameSpaceCoordinate element (realizedBoardViewBox ShowNumbers) event.clientPos
    in
    Dragging
        { start = start
        , current = start
        , rect = element
        }


moveDrag : Mouse.Event -> DragState -> DragState
moveDrag event drag =
    case drag of
        DragOff ->
            DragOff

        Dragging { start, rect } ->
            Dragging
                { start = start
                , current = gameSpaceCoordinate rect (realizedBoardViewBox ShowNumbers) event.clientPos
                , rect = rect
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


{-| Transforms an Svg coordinate into a logical tile coordinate.
-}
tileCoordinate : SvgCoord -> Tile
tileCoordinate (SvgCoord x y) =
    Tile (x // 100) (7 - y // 100)


type alias Rect =
    { x : Float
    , y : Float
    , width : Float
    , height : Float
    }


type GlobalMsg
    = GlobalNoOp
    | EditorMsgWrapper Msg
    | BlogMsgWrapper BlogEditorMsg
    | LoginMsgWrapper LoginPageMsg
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
type Msg
    = MouseDown Mouse.Event
    | MouseMove Mouse.Event
    | MouseUp Mouse.Event
    | GotBoardPosition (Result Dom.Error Dom.Element) Mouse.Event
    | WindowResize Int Int
    | ToolSelect EditorTool
    | MoveToolFilter (Maybe Sako.Color)
    | DeleteToolFilter (Maybe Sako.Color)
    | CreateToolColor Sako.Color
    | CreateToolType Sako.Type
    | Undo
    | Redo
    | Reset PacoPosition
    | KeyUp KeyStroke
    | DownloadSvg
    | DownloadPng
    | SvgReadyForDownload String
    | NoOp
    | UpdateUserPaste String
    | UseUserPaste PacoPosition
    | SetViewMode ViewMode
    | SavePosition PacoPosition SaveState
    | PositionSaveSuccess SavePositionDone


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


initialEditor : Decode.Value -> Editor
initialEditor flags =
    { saveState = SaveNotRequired
    , game = P.singleton initialPosition
    , drag = DragOff
    , windowSize = parseWindowSize flags
    , tool = MoveTool
    , moveToolColor = Nothing
    , deleteToolColor = Nothing
    , createToolColor = Sako.White
    , createToolType = Sako.Pawn
    , userPaste = ""
    , pasteParsed = NoInput
    , viewMode = ShowNumbers
    }


initialBlog : Blog
initialBlog =
    { text = StaticText.blogEditorExampleText }


initialLogin : LoginPageData
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


init : Decode.Value -> ( Model, Cmd GlobalMsg )
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
        ]
    )


expectLibrary : Result Http.Error String -> GlobalMsg
expectLibrary result =
    case result of
        Ok content ->
            GetLibrarySuccess content

        Err error ->
            GetLibraryFailure error


update : GlobalMsg -> Model -> ( Model, Cmd GlobalMsg )
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

        LoginMsgWrapper loginPageMsg ->
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
            ( { model | page = newPage }, Cmd.none )

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


updateEditor : Msg -> Editor -> ( Editor, Cmd GlobalMsg )
updateEditor msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        -- When we register a mouse down event on the board we read the current board position
        -- from the DOM.
        MouseDown event ->
            ( model
            , Task.attempt
                (\res -> EditorMsgWrapper (GotBoardPosition res event))
                (Dom.getElement "boardDiv")
            )

        MouseMove event ->
            ( { model | drag = moveDrag event model.drag }, Cmd.none )

        MouseUp event ->
            let
                drag =
                    moveDrag event model.drag
            in
            case drag of
                DragOff ->
                    ( { model | drag = DragOff }, Cmd.none )

                Dragging dragData ->
                    clickRelease dragData.start dragData.current { model | drag = DragOff }

        GotBoardPosition res event ->
            case res of
                Ok element ->
                    ( { model | drag = startDrag element.element event }, Cmd.none )

                Err _ ->
                    ( model, Cmd.none )

        WindowResize width height ->
            ( { model | windowSize = ( width, height ) }, Cmd.none )

        ToolSelect tool ->
            ( { model | tool = tool }, Cmd.none )

        MoveToolFilter newColor ->
            ( { model | moveToolColor = newColor }, Cmd.none )

        DeleteToolFilter newColor ->
            ( { model | deleteToolColor = newColor }, Cmd.none )

        CreateToolColor newColor ->
            ( { model | createToolColor = newColor }, Cmd.none )

        CreateToolType newType ->
            ( { model | createToolType = newType }, Cmd.none )

        Undo ->
            ( applyUndo model, Cmd.none )

        Redo ->
            ( applyRedo model, Cmd.none )

        Reset newPosition ->
            ( { model
                | game = addHistoryState newPosition model.game
                , saveState = saveStateModify model.saveState
              }
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


applyUndo : Editor -> Editor
applyUndo model =
    { model | game = P.withRollback P.goL model.game }


applyRedo : Editor -> Editor
applyRedo model =
    { model | game = P.withRollback P.goR model.game }


{-| Handles all key presses.
-}
keyUp : KeyStroke -> Editor -> ( Editor, Cmd GlobalMsg )
keyUp stroke model =
    if stroke.ctrlKey == True && stroke.altKey == False then
        ctrlKeyUp stroke.key model

    else
        ( model, Cmd.none )


{-| Handles all ctrl + x shortcuts.
-}
ctrlKeyUp : String -> Editor -> ( Editor, Cmd GlobalMsg )
ctrlKeyUp key model =
    case key of
        "z" ->
            ( applyUndo model, Cmd.none )

        "y" ->
            ( applyRedo model, Cmd.none )

        _ ->
            ( model, Cmd.none )


{-| TODO: Currently the tools are "History aware", this can be removed. It will make the plumbing
around the tools more complicated but will allow easier tools.

They may still need a lower level of history awareness where they can indicate if the current game
state is meant as a preview or an invalid ephemeral display state that should not be preserved.

-}
clickRelease : SvgCoord -> SvgCoord -> Editor -> ( Editor, Cmd GlobalMsg )
clickRelease down up model =
    case model.tool of
        DeleteTool ->
            deleteToolRelease (tileCoordinate down) (tileCoordinate up) model

        MoveTool ->
            moveToolRelease (tileCoordinate down) (tileCoordinate up) model

        CreateTool ->
            createToolRelease (tileCoordinate down) (tileCoordinate up) model


deleteToolRelease : Tile -> Tile -> Editor -> ( Editor, Cmd GlobalMsg )
deleteToolRelease down up model =
    let
        oldPosition =
            P.getC model.game

        pieces =
            List.filter
                (\p -> p.position /= up || not (colorFilter model.deleteToolColor p))
                oldPosition.pieces

        newHistory =
            addHistoryState { oldPosition | pieces = pieces } model.game
    in
    if up == down then
        ( { model
            | game = newHistory
            , saveState = saveStateModify model.saveState
          }
        , Cmd.none
        )

    else
        ( model, Cmd.none )


moveToolRelease : Tile -> Tile -> Editor -> ( Editor, Cmd GlobalMsg )
moveToolRelease down up model =
    let
        oldPosition =
            P.getC model.game

        moveAction piece =
            if piece.position == down && colorFilter model.moveToolColor piece then
                { piece | position = up }

            else
                piece

        involvedPieces =
            List.filter (\p -> (p.position == down || p.position == up) && colorFilter model.moveToolColor p) oldPosition.pieces

        ( whiteCount, blackCount ) =
            ( List.count (\p -> p.color == Sako.White) involvedPieces
            , List.count (\p -> p.color == Sako.Black) involvedPieces
            )

        newPosition _ =
            { oldPosition | pieces = List.map moveAction oldPosition.pieces }

        newHistory _ =
            addHistoryState (newPosition ()) model.game
    in
    if whiteCount <= 1 && blackCount <= 1 then
        ( { model
            | game = newHistory ()
            , saveState = saveStateModify model.saveState
          }
        , Cmd.none
        )

    else
        ( model, Cmd.none )


createToolRelease : Tile -> Tile -> Editor -> ( Editor, Cmd GlobalMsg )
createToolRelease down up model =
    let
        oldPosition =
            P.getC model.game

        spaceOccupied =
            List.any (\p -> p.color == model.createToolColor && p.position == up) oldPosition.pieces

        newPiece =
            { color = model.createToolColor, position = up, pieceType = model.createToolType }

        newPosition _ =
            { oldPosition | pieces = newPiece :: oldPosition.pieces }

        newHistory _ =
            addHistoryState (newPosition ()) model.game
    in
    if up == down && not spaceOccupied then
        ( { model
            | game = newHistory ()
            , saveState = saveStateModify model.saveState
          }
        , Cmd.none
        )

    else
        ( model, Cmd.none )


{-| Defines a filter for Pieces based on a Player color. Passing in the color `Nothing` defines
a filter that always returns `True`.
-}
colorFilter : Maybe Sako.Color -> PacoPiece -> Bool
colorFilter color piece =
    case color of
        Just c ->
            piece.color == c

        Nothing ->
            True


{-| Adds a new state, storing the current state in the history. If there currently is a redo chain
it is discarded.
-}
addHistoryState : a -> Pivot a -> Pivot a
addHistoryState newState p =
    if P.getC p == newState then
        p

    else
        p |> P.setR [] |> P.appendGoR newState


subscriptions : model -> Sub GlobalMsg
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


updateBlogEditor : BlogEditorMsg -> Blog -> ( Blog, Cmd GlobalMsg )
updateBlogEditor msg blog =
    case msg of
        OnMarkdownInput newText ->
            ( { blog | text = newText }, Cmd.none )


updateLoginPage : LoginPageMsg -> LoginPageData -> ( LoginPageData, Cmd GlobalMsg )
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


view : Model -> Html GlobalMsg
view model =
    Element.layout [] (globalUi model)


globalUi : Model -> Element GlobalMsg
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
pageHeader : Taco -> Page -> Element GlobalMsg -> Element GlobalMsg
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


pageHeaderButton : List (Element.Attribute GlobalMsg) -> PageHeaderInfo -> Element GlobalMsg
pageHeaderButton attributes { currentPage, targetPage, caption } =
    if currentPage == targetPage then
        Element.el ([ padding 10, Background.color (Element.rgb255 200 200 200) ] ++ attributes) (Element.text caption)

    else
        Element.el ([ padding 10, Events.onClick (OpenPage targetPage) ] ++ attributes) (Element.text caption)



--------------------------------------------------------------------------------
-- Main Page viev --------------------------------------------------------------
--------------------------------------------------------------------------------


{-| The greeting that is shown when you first open the page.
-}
mainPageUi : Taco -> Element GlobalMsg
mainPageUi taco =
    Element.column [ width fill ]
        [ Element.html FontAwesome.Styles.css
        , pageHeader taco MainPage Element.none
        , greetingText taco
        ]


greetingText : Taco -> Element GlobalMsg
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


libraryUi : Taco -> Model -> Element GlobalMsg
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


examplesList : Taco -> Model -> Element GlobalMsg
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


storedPositionList : Taco -> Model -> Element GlobalMsg
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


loadPositionPreview : Taco -> PacoPosition -> Element GlobalMsg
loadPositionPreview taco position =
    Element.el [ Events.onClick (LoadIntoEditor position) ]
        (Element.html
            (positionSvg
                { position = position
                , colorScheme = taco.colorScheme
                , sideLength = 250
                , drag = DragOff
                , viewMode = CleanBoard
                , nodeId = Nothing
                }
            )
            |> Element.map EditorMsgWrapper
        )



--------------------------------------------------------------------------------
-- Editor viev -----------------------------------------------------------------
--------------------------------------------------------------------------------


editorUi : Taco -> Editor -> Element GlobalMsg
editorUi taco model =
    Element.column [ width fill, height fill ]
        [ pageHeader taco EditorPage (saveStateHeader (P.getC model.game) model.saveState)
        , Element.row
            [ width fill, height fill ]
            [ Element.html FontAwesome.Styles.css
            , positionView taco model (P.getC model.game) model.drag |> Element.map EditorMsgWrapper
            , sidebar taco model
            ]
        ]


saveStateHeader : PacoPosition -> SaveState -> Element GlobalMsg
saveStateHeader position saveState =
    case saveState of
        SaveIsCurrent id ->
            Element.el [ padding 10, Font.color (Element.rgb255 150 200 150), Font.bold ] (Element.text <| "Saved. (id=" ++ String.fromInt id ++ ")")

        SaveIsModified id ->
            Element.el
                [ padding 10
                , Font.color (Element.rgb255 200 150 150)
                , Font.bold
                , Events.onClick (EditorMsgWrapper (SavePosition position saveState))
                ]
                (Element.text <| "Unsaved Changes! (id=" ++ String.fromInt id ++ ")")

        SaveDoesNotExist ->
            Element.el
                [ padding 10
                , Font.color (Element.rgb255 200 150 150)
                , Font.bold
                , Events.onClick (EditorMsgWrapper (SavePosition position saveState))
                ]
                (Element.text "Unsaved Changes!")

        SaveNotRequired ->
            Element.none


{-| We render the board view slightly smaller than the window in order to avoid artifacts.
-}
windowSafetyMargin : Int
windowSafetyMargin =
    50


positionView : Taco -> Editor -> PacoPosition -> DragState -> Element Msg
positionView taco editor position drag =
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
                    [ positionSvg
                        { position = position
                        , colorScheme = taco.colorScheme
                        , sideLength = windowHeight - windowSafetyMargin
                        , drag = drag
                        , viewMode = editor.viewMode
                        , nodeId = Just sakoEditorId
                        }
                    ]
                )
            )
        )



--------------------------------------------------------------------------------
-- Sidebar view ----------------------------------------------------------------
--------------------------------------------------------------------------------


sidebar : Taco -> Editor -> Element GlobalMsg
sidebar taco model =
    Element.column [ width (fill |> Element.maximum 400), height fill, spacing 10, padding 10, Element.alignRight ]
        [ sidebarActionButtons model.game |> Element.map EditorMsgWrapper
        , toolConfig model |> Element.map EditorMsgWrapper
        , colorSchemeConfig taco
        , viewModeConfig model
        , Element.el [ Events.onClick DownloadSvg ] (Element.text "Download as Svg") |> Element.map EditorMsgWrapper
        , Element.el [ Events.onClick DownloadPng ] (Element.text "Download as Png") |> Element.map EditorMsgWrapper
        , markdownCopyPaste taco model |> Element.map EditorMsgWrapper
        ]


sidebarActionButtons : Pivot PacoPosition -> Element Msg
sidebarActionButtons p =
    Element.row [ width fill ]
        [ undo p
        , redo p
        , resetStartingBoard p
        , resetClearBoard p
        ]


flatButton : Maybe a -> Element a -> Element a
flatButton onPress content =
    Input.button [ padding 10 ]
        { onPress = onPress
        , label = content
        }


{-| The undo button.
-}
undo : Pivot a -> Element Msg
undo p =
    if P.hasL p then
        flatButton (Just Undo) (icon [] Solid.arrowLeft)

    else
        flatButton Nothing (icon [ Font.color (Element.rgb255 150 150 150) ] Solid.arrowLeft)


{-| The redo button.
-}
redo : Pivot a -> Element Msg
redo p =
    if P.hasR p then
        flatButton (Just Redo) (icon [] Solid.arrowRight)

    else
        flatButton Nothing (icon [ Font.color (Element.rgb255 150 150 150) ] Solid.arrowRight)


resetStartingBoard : Pivot PacoPosition -> Element Msg
resetStartingBoard p =
    if P.getC p /= initialPosition then
        flatButton (Just (Reset initialPosition)) (icon [] Solid.home)

    else
        flatButton Nothing (icon [ Font.color (Element.rgb255 150 150 150) ] Solid.home)


resetClearBoard : Pivot PacoPosition -> Element Msg
resetClearBoard p =
    if P.getC p /= emptyPosition then
        flatButton (Just (Reset emptyPosition)) (icon [] Solid.broom)

    else
        flatButton Nothing (icon [ Font.color (Element.rgb255 150 150 150) ] Solid.broom)


toolConfig : Editor -> Element Msg
toolConfig editor =
    Element.column [ width fill ]
        [ moveToolButton editor.tool
        , if editor.tool == MoveTool then
            colorConfig editor.moveToolColor MoveToolFilter

          else
            Element.none
        , deleteToolButton editor.tool
        , if editor.tool == DeleteTool then
            colorConfig editor.deleteToolColor DeleteToolFilter

          else
            Element.none
        , createToolButton editor.tool
        , if editor.tool == CreateTool then
            createToolConfig editor

          else
            Element.none
        ]


moveToolButton : EditorTool -> Element Msg
moveToolButton tool =
    Element.row
        [ width (fillPortion 1)
        , spacing 5
        , padding 5
        , Border.color (Element.rgb255 0 0 0)
        , Border.width 1
        , backgroundFocus (tool == MoveTool)
        , Events.onClick (ToolSelect MoveTool)
        ]
        [ icon [] Solid.arrowsAlt
        , Element.text "Move Piece"
        ]


deleteToolButton : EditorTool -> Element Msg
deleteToolButton tool =
    Element.row
        [ width (fillPortion 1)
        , spacing 5
        , padding 5
        , Border.color (Element.rgb255 0 0 0)
        , Border.width 1
        , backgroundFocus (tool == DeleteTool)
        , Events.onClick (ToolSelect DeleteTool)
        ]
        [ icon [] Solid.trash
        , Element.text "Delete Piece"
        ]


createToolButton : EditorTool -> Element Msg
createToolButton tool =
    Element.row
        [ width (fillPortion 1)
        , spacing 5
        , padding 5
        , Border.color (Element.rgb255 0 0 0)
        , Border.width 1
        , backgroundFocus (tool == CreateTool)
        , Events.onClick (ToolSelect CreateTool)
        ]
        [ icon [] Solid.chess
        , Element.text "Add Piece"
        ]


createToolConfig : Editor -> Element Msg
createToolConfig model =
    Element.column [ width fill ]
        [ Element.row []
            [ toolConfigOption model.createToolColor CreateToolColor Sako.White "White"
            , toolConfigOption model.createToolColor CreateToolColor Sako.Black "Black"
            ]
        , Element.wrappedRow []
            [ toolConfigOption model.createToolType CreateToolType Sako.Pawn "Pawn"
            , toolConfigOption model.createToolType CreateToolType Sako.Rock "Rock"
            , toolConfigOption model.createToolType CreateToolType Sako.Knight "Knight"
            , toolConfigOption model.createToolType CreateToolType Sako.Bishop "Bishop"
            , toolConfigOption model.createToolType CreateToolType Sako.Queen "Queen"
            , toolConfigOption model.createToolType CreateToolType Sako.King "King"
            ]
        ]


backgroundFocus : Bool -> Element.Attribute msg
backgroundFocus isFocused =
    if isFocused then
        Background.color (Element.rgb255 200 200 200)

    else
        Background.color (Element.rgb255 255 255 255)


{-| A toolConfigOption represents one of several possible choices. If it represents the currently
choosen value (single selection only) it is highlighted. When clicked it will send a message.
-}
toolConfigOption : a -> (a -> msg) -> a -> String -> Element msg
toolConfigOption currentValue msg buttonValue caption =
    Element.el
        [ Events.onClick (msg buttonValue)
        , backgroundFocus (currentValue == buttonValue)
        , padding 5
        ]
        (Element.text caption)


colorConfig : Maybe Sako.Color -> (Maybe Sako.Color -> msg) -> Element msg
colorConfig currentColor msg =
    Element.row [ width fill ]
        [ toolConfigOption currentColor msg Nothing "all pieces"
        , toolConfigOption currentColor msg (Just Sako.White) "white pieces"
        , toolConfigOption currentColor msg (Just Sako.Black) "black pieces"
        ]


colorPicker : (Pieces.SideColor -> msg) -> Pieces.SideColor -> Pieces.SideColor -> Element msg
colorPicker msg currentColor newColor =
    let
        iconChoice =
            if currentColor == newColor then
                Solid.yinYang

            else
                Regular.circle
    in
    -- icon : List (Element.Attribute msg) -> Icon -> Element msg
    Element.el [ width fill, Events.onClick (msg newColor), padding 5, Background.color (Pieces.colorUi newColor.stroke) ]
        (icon
            [ centerX
            , Font.color (Pieces.colorUi newColor.fill)
            ]
            iconChoice
        )


colorSchemeConfig : Taco -> Element GlobalMsg
colorSchemeConfig taco =
    Element.column [ width fill, spacing 5 ]
        [ Element.text "Piece colors"
        , colorSchemeConfigWhite taco
        , colorSchemeConfigBlack taco
        ]


colorSchemeConfigWhite : Taco -> Element GlobalMsg
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


colorSchemeConfigBlack : Taco -> Element GlobalMsg
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


viewModeConfig : Editor -> Element GlobalMsg
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
    { position : PacoPosition
    , sideLength : Int
    , colorScheme : Pieces.ColorScheme
    , drag : DragState
    , viewMode : ViewMode
    , nodeId : Maybe String
    }
    -> Html Msg
positionSvg config =
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
        , dragHints config.drag
        , piecesSvg config.colorScheme config.position
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
    let
        transform =
            Svg.Attributes.transform
                ("translate("
                    ++ String.fromInt (100 * tileX piece.position)
                    ++ ", "
                    ++ String.fromInt (700 - 100 * tileY piece.position)
                    ++ ")"
                )
    in
    Svg.g [ transform ]
        [ Pieces.figure colorScheme piece.pieceType piece.color
        ]


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


dragHints : DragState -> Svg msg
dragHints drag =
    case drag of
        DragOff ->
            Svg.g [] []

        Dragging { start, current } ->
            Svg.g []
                [ Svg.circle
                    [ Svg.Attributes.cx <| String.fromInt <| svgX start
                    , Svg.Attributes.cy <| String.fromInt <| svgY start
                    , Svg.Attributes.r "30"
                    , Svg.Attributes.fill "#F00"
                    ]
                    []
                , Svg.circle
                    [ Svg.Attributes.cx <| String.fromInt <| svgX current
                    , Svg.Attributes.cy <| String.fromInt <| svgY current
                    , Svg.Attributes.r "30"
                    , Svg.Attributes.fill "#0F0"
                    ]
                    []
                ]


icon : List (Element.Attribute msg) -> Icon -> Element msg
icon attributes iconType =
    Element.el attributes (Element.html (viewIcon iconType))


markdownCopyPaste : Taco -> Editor -> Element Msg
markdownCopyPaste taco model =
    Element.column [ spacing 5 ]
        [ Element.text "Text notation you can store"
        , Input.multiline [ Font.family [ Font.monospace ] ]
            { onChange = \_ -> NoOp
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


parsedMarkdownPaste : Taco -> Editor -> Element Msg
parsedMarkdownPaste taco model =
    case model.pasteParsed of
        NoInput ->
            Element.none

        ParseError error ->
            Element.text error

        ParseSuccess pacoPosition ->
            Element.row [ Events.onClick (UseUserPaste pacoPosition), spacing 5 ]
                [ Element.html
                    (positionSvg
                        { position = pacoPosition
                        , colorScheme = taco.colorScheme
                        , sideLength = 100
                        , drag = DragOff
                        , viewMode = CleanBoard
                        , nodeId = Nothing
                        }
                    )
                , Element.text "Load"
                ]



--------------------------------------------------------------------------------
-- Blog editor ui --------------------------------------------------------------
--------------------------------------------------------------------------------


blogUi : Taco -> Blog -> Element GlobalMsg
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


markdownView : Taco -> String -> Result String (List (Element GlobalMsg))
markdownView taco content =
    content
        |> Markdown.Parser.parse
        |> Result.mapError (\error -> error |> List.map Markdown.Parser.deadEndToString |> String.join "\n")
        |> Result.andThen (Markdown.Parser.render (renderer taco))


codeBlock : Taco -> { body : String, language : Maybe String } -> Element GlobalMsg
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
                |> Element.map (\_ -> EditorMsgWrapper NoOp)


renderer : Taco -> Markdown.Parser.Renderer (Element GlobalMsg)
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
        \{ title, destination } body ->
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


loginUi : Taco -> LoginPageData -> Element GlobalMsg
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


loginDialog : Taco -> LoginPageData -> Element GlobalMsg
loginDialog taco loginPageData =
    Element.column []
        [ Input.username []
            { label = Input.labelAbove [] (Element.text "Username")
            , onChange = TypeUsername >> LoginMsgWrapper
            , placeholder = Just (Input.placeholder [] (Element.text "Username"))
            , text = loginPageData.usernameRaw
            }
        , Input.currentPassword []
            { label = Input.labelAbove [] (Element.text "Password")
            , onChange = TypePassword >> LoginMsgWrapper
            , placeholder = Just (Input.placeholder [] (Element.text "Password"))
            , text = loginPageData.passwordRaw
            , show = False
            }
        , Input.button [] { label = Element.text "Login", onPress = Just (LoginMsgWrapper TryLogin) }
        ]


loginInfoPage : User -> Element GlobalMsg
loginInfoPage user =
    Element.column [ padding 10, spacing 10 ]
        [ Element.text ("Username: " ++ user.username)
        , Element.text ("ID: " ++ String.fromInt user.id)
        , Input.button [] { label = Element.text "Logout", onPress = Just (LoginMsgWrapper Logout) }
        ]


loginHeaderInfo : Taco -> Element GlobalMsg
loginHeaderInfo taco =
    let
        loginCaption =
            case taco.login of
                Just user ->
                    Element.row [ padding 10, spacing 10 ] [ icon [] Solid.user, Element.text user.username ]

                Nothing ->
                    Element.row [ padding 10, spacing 10 ] [ icon [] Solid.signInAlt, Element.text "Login" ]
    in
    Element.el [ Element.alignRight, Events.onClick (OpenPage LoginPage) ] loginCaption



--------------------------------------------------------------------------------
-- REST api --------------------------------------------------------------------
--------------------------------------------------------------------------------


defaultErrorHandler : (a -> GlobalMsg) -> Result Http.Error a -> GlobalMsg
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


postLoginPassword : LoginData -> Cmd GlobalMsg
postLoginPassword data =
    Http.post
        { url = "/api/login/password"
        , body = Http.jsonBody (encodeLoginData data)
        , expect = Http.expectJson (defaultErrorHandler LoginSuccess) decodeUser
        }


getCurrentLogin : Cmd GlobalMsg
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


getLogout : Cmd GlobalMsg
getLogout =
    Http.get
        { url = "/api/logout"
        , expect = Http.expectWhatever (defaultErrorHandler (\() -> LogoutSuccess))
        }


postSave : PacoPosition -> SaveState -> Cmd GlobalMsg
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


postSaveCreate : PacoPosition -> Cmd GlobalMsg
postSaveCreate position =
    Http.post
        { url = "/api/position"
        , body = Http.jsonBody (encodeCreatePosition position)
        , expect =
            Http.expectJson
                (defaultErrorHandler (EditorMsgWrapper << PositionSaveSuccess))
                decodeSavePositionDone
        }


postSaveUpdate : PacoPosition -> Int -> Cmd GlobalMsg
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


getAllSavedPositions : Cmd GlobalMsg
getAllSavedPositions =
    Http.get
        { url = "/api/position"
        , expect = Http.expectJson (defaultErrorHandler AllPositionsLoadedSuccess) (Decode.list decodeStoredPosition)
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
