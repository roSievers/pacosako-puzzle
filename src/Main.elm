module Main exposing (main)

import Browser
import Browser.Dom as Dom
import Browser.Events
import Dict exposing (Dict)
import Element exposing (Element, centerX, centerY, el, fill, fillPortion, height, padding, row, spacing, text, width)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import File.Download
import FontAwesome.Icon exposing (Icon, viewIcon)
import FontAwesome.Solid as Solid
import FontAwesome.Styles
import Html exposing (Html)
import Html.Attributes
import Html.Events.Extra.Mouse as Mouse
import Json.Decode as Decode
import Json.Encode as Encode
import List.Extra as List
import Parser exposing ((|.), (|=), Parser)
import Pieces
import Pivot as P exposing (Pivot)
import Ports
import Sako
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
    { game : Pivot PacoPosition
    , colorScheme : Pieces.ColorScheme
    , drag : DragState
    , windowSize : ( Int, Int )
    , tool : EditorTool
    , moveToolColor : Maybe Sako.Color
    , deleteToolColor : Maybe Sako.Color
    , createToolColor : Sako.Color
    , createToolType : Sako.Type
    , userPaste : String
    , pasteParsed : PositionParseResult
    }


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


type alias PacoPiece =
    { pieceType : Sako.Type
    , color : Sako.Color
    , position : Tile
    }


{-| Represents a single board tile. `Tile x y` stores two integers with legal values between 0
and 7 (inclusive). Use `tileX` and `tileY` to extract individual coordinates.
-}
type Tile
    = Tile Int Int


tileX : Tile -> Int
tileX (Tile x _) =
    x


tileY : Tile -> Int
tileY (Tile _ y) =
    y


{-| 1d coordinate for a tile. This is just x + 8 \* y
-}
tileFlat : Tile -> Int
tileFlat (Tile x y) =
    x + 8 * y


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
    | WhiteSideColor Pieces.SideColor
    | BlackSideColor Pieces.SideColor
    | KeyUp KeyStroke
    | DownloadSvg
    | DownloadPng
    | SvgReadyForDownload String
    | NoOp
    | UpdateUserPaste String
    | UseUserPaste PacoPosition


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


initialModel : Decode.Value -> Model
initialModel flags =
    { game = P.singleton initialPosition
    , colorScheme = Pieces.defaultColorScheme
    , drag = DragOff
    , windowSize = parseWindowSize flags
    , tool = MoveTool
    , moveToolColor = Nothing
    , deleteToolColor = Nothing
    , createToolColor = Sako.White
    , createToolType = Sako.Pawn
    , userPaste = ""
    , pasteParsed = NoInput
    }


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
    ( initialModel flags, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        -- When we register a mouse down event on the board we read the current board position
        -- from the DOM.
        MouseDown event ->
            ( model
            , Task.attempt
                (\res -> GotBoardPosition res event)
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
            ( { model | game = addHistoryState newPosition model.game }, Cmd.none )

        WhiteSideColor newSideColor ->
            ( { model | colorScheme = Pieces.setWhite newSideColor model.colorScheme }, Cmd.none )

        BlackSideColor newSideColor ->
            ( { model | colorScheme = Pieces.setBlack newSideColor model.colorScheme }, Cmd.none )

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
                    case Parser.run parsePosition pasteContent of
                        Err _ ->
                            -- ParseError (Debug.toString err)
                            ParseError "Error: Make sure your input has the right shape!"

                        Ok position ->
                            ParseSuccess position
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
            ( { model | game = addHistoryState newPosition model.game }, Cmd.none )


applyUndo : Model -> Model
applyUndo model =
    { model | game = P.withRollback P.goL model.game }


applyRedo : Model -> Model
applyRedo model =
    { model | game = P.withRollback P.goR model.game }


{-| Handles all key presses.
-}
keyUp : KeyStroke -> Model -> ( Model, Cmd Msg )
keyUp stroke model =
    if stroke.ctrlKey == True && stroke.altKey == False then
        ctrlKeyUp stroke.key model

    else
        ( model, Cmd.none )


{-| Handles all ctrl + x shortcuts.
-}
ctrlKeyUp : String -> Model -> ( Model, Cmd Msg )
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
clickRelease : SvgCoord -> SvgCoord -> Model -> ( Model, Cmd Msg )
clickRelease down up model =
    case model.tool of
        DeleteTool ->
            deleteToolRelease (tileCoordinate down) (tileCoordinate up) model

        MoveTool ->
            moveToolRelease (tileCoordinate down) (tileCoordinate up) model

        CreateTool ->
            createToolRelease (tileCoordinate down) (tileCoordinate up) model


deleteToolRelease : Tile -> Tile -> Model -> ( Model, Cmd Msg )
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
        ( { model | game = newHistory }, Cmd.none )

    else
        ( model, Cmd.none )


moveToolRelease : Tile -> Tile -> Model -> ( Model, Cmd Msg )
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
        ( { model | game = newHistory () }, Cmd.none )

    else
        ( model, Cmd.none )


createToolRelease : Tile -> Tile -> Model -> ( Model, Cmd Msg )
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
        ( { model | game = newHistory () }, Cmd.none )

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


subscriptions : model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ Browser.Events.onResize WindowResize
        , Browser.Events.onKeyUp (Decode.map KeyUp decodeKeyStroke)
        , Ports.responseSvgNodeContent SvgReadyForDownload
        ]


decodeKeyStroke : Decode.Decoder KeyStroke
decodeKeyStroke =
    Decode.map3 KeyStroke
        (Decode.field "key" Decode.string)
        (Decode.field "ctrlKey" Decode.bool)
        (Decode.field "altKey" Decode.bool)



--- View code


view : Model -> Html Msg
view model =
    Element.layout []
        (ui model)


ui : Model -> Element Msg
ui model =
    Element.row [ width fill, height fill ]
        [ Element.html FontAwesome.Styles.css
        , positionView model (P.getC model.game) model.drag
        , sidebar model
        ]


{-| We render the board view slightly smaller than the window in order to avoid artifacts.
-}
windowSafetyMargin : Int
windowSafetyMargin =
    10


positionView : Model -> PacoPosition -> DragState -> Element Msg
positionView model position drag =
    let
        ( _, windowHeight ) =
            model.windowSize
    in
    el [ width (Element.px windowHeight), height fill ]
        (el [ centerX, centerY ]
            (Element.html
                (Html.div
                    [ Mouse.onDown MouseDown
                    , Mouse.onMove MouseMove
                    , Mouse.onUp MouseUp
                    , Html.Attributes.id "boardDiv"
                    ]
                    [ positionSvg
                        { position = position
                        , colorScheme = model.colorScheme
                        , sideLength = windowHeight - windowSafetyMargin
                        , drag = drag
                        , viewMode = ShowNumbers
                        }
                    ]
                )
            )
        )


sidebar : Model -> Element Msg
sidebar model =
    Element.column [ width fill, height fill, spacing 10, padding 10 ]
        [ Element.el [ Font.size 24 ] (Element.text "Paco Ŝako Editor")
        , Element.el [ Events.onClick (Reset initialPosition) ]
            (Element.text "Reset to starting position.")
        , Element.el [ Events.onClick (Reset emptyPosition) ]
            (Element.text "Clear board.")
        , undo model.game
        , redo model.game
        , toolConfig model
        , colorSchemeConfigWhite model
        , colorSchemeConfigBlack model
        , Element.el [ Events.onClick DownloadSvg ] (Element.text "Download as Svg")
        , Element.el [ Events.onClick DownloadPng ] (Element.text "Download as Png")
        , markdownCopyPaste model
        ]


{-| The undo button.
-}
undo : Pivot a -> Element Msg
undo p =
    if P.hasL p then
        Element.el [ Events.onClick Undo ] (Element.text "Undo")

    else
        Element.text "Can't undo."


{-| The redo button.
-}
redo : Pivot a -> Element Msg
redo p =
    if P.hasR p then
        Element.el [ Events.onClick Redo ] (Element.text "Redo")

    else
        Element.text "Can't redo."


toolConfig : Model -> Element Msg
toolConfig model =
    let
        toolBody =
            case model.tool of
                MoveTool ->
                    colorConfig model.moveToolColor MoveToolFilter

                DeleteTool ->
                    colorConfig model.deleteToolColor DeleteToolFilter

                CreateTool ->
                    createToolConfig model
    in
    Element.column [ width fill ]
        [ toolHeader model.tool
        , toolBody
        ]


toolHeader : EditorTool -> Element Msg
toolHeader tool =
    Element.wrappedRow [ width fill ]
        [ moveToolButton tool
        , deleteToolButton tool
        , createToolButton tool
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


createToolConfig : Model -> Element Msg
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


colorPicker : (Pieces.SideColor -> msg) -> Pieces.SideColor -> Pieces.SideColor -> String -> Element msg
colorPicker msg currentColor newColor colorName =
    let
        baseAttributes =
            [ width fill
            , padding 5
            , Events.onClick (msg newColor)
            , Background.color (Pieces.colorUi newColor.fill)
            , Border.color (Pieces.colorUi newColor.stroke)
            ]

        selectionAttributes =
            if currentColor == newColor then
                [ Border.width 4, Font.bold ]

            else
                [ Border.width 2 ]
    in
    Element.el (baseAttributes ++ selectionAttributes) (Element.text colorName)


colorSchemeConfigWhite : Model -> Element Msg
colorSchemeConfigWhite model =
    Element.wrappedRow [ spacing 2 ]
        [ Element.text "White pieces: "
        , colorPicker WhiteSideColor model.colorScheme.white Pieces.whitePieceColor "white"
        , colorPicker WhiteSideColor model.colorScheme.white Pieces.redPieceColor "red"
        , colorPicker WhiteSideColor model.colorScheme.white Pieces.orangePieceColor "orange"
        , colorPicker WhiteSideColor model.colorScheme.white Pieces.yellowPieceColor "yellow"
        , colorPicker WhiteSideColor model.colorScheme.white Pieces.greenPieceColor "green"
        , colorPicker WhiteSideColor model.colorScheme.white Pieces.bluePieceColor "blue"
        , colorPicker WhiteSideColor model.colorScheme.white Pieces.purplePieceColor "purple"
        , colorPicker WhiteSideColor model.colorScheme.white Pieces.pinkPieceColor "pink"
        , colorPicker WhiteSideColor model.colorScheme.white Pieces.blackPieceColor "black"
        ]


colorSchemeConfigBlack : Model -> Element Msg
colorSchemeConfigBlack model =
    Element.wrappedRow [ spacing 2 ]
        [ Element.text "Black pieces: "
        , colorPicker BlackSideColor model.colorScheme.black Pieces.whitePieceColor "white"
        , colorPicker BlackSideColor model.colorScheme.black Pieces.redPieceColor "red"
        , colorPicker BlackSideColor model.colorScheme.black Pieces.orangePieceColor "orange"
        , colorPicker BlackSideColor model.colorScheme.black Pieces.yellowPieceColor "yellow"
        , colorPicker BlackSideColor model.colorScheme.black Pieces.greenPieceColor "green"
        , colorPicker BlackSideColor model.colorScheme.black Pieces.bluePieceColor "blue"
        , colorPicker BlackSideColor model.colorScheme.black Pieces.purplePieceColor "purple"
        , colorPicker BlackSideColor model.colorScheme.black Pieces.pinkPieceColor "pink"
        , colorPicker BlackSideColor model.colorScheme.black Pieces.blackPieceColor "black"
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
    }
    -> Html Msg
positionSvg config =
    Svg.svg
        [ Svg.Attributes.width <| String.fromInt config.sideLength
        , Svg.Attributes.height <| String.fromInt config.sideLength
        , viewBox (boardViewBox config.viewMode)
        , Svg.Attributes.id sakoEditorId
        ]
        [ board
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


board : Svg msg
board =
    Svg.g []
        [ Svg.rect
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
        , columnTag "a" "50"
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


markdownCopyPaste : Model -> Element Msg
markdownCopyPaste model =
    Element.column [ spacing 5 ]
        [ Element.text "Text notation you can store"
        , Input.multiline [ Font.family [ Font.monospace ] ]
            { onChange = \_ -> NoOp
            , text = markdownExchangeNotation (P.getC model.game).pieces
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
        , parsedMarkdownPaste model

        -- , Element.el [ Events.onClick UseUserPaste ] (Element.text "Parse")
        ]


parsedMarkdownPaste : Model -> Element Msg
parsedMarkdownPaste model =
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
                        , colorScheme = model.colorScheme
                        , sideLength = 100
                        , drag = DragOff
                        , viewMode = CleanBoard
                        }
                    )
                , Element.text "Load"
                ]


{-| Converts a Paco Ŝako position into a human readable version that can be
copied and stored in a text file.
-}
markdownExchangeNotation : List PacoPiece -> String
markdownExchangeNotation pieces =
    let
        dictRepresentation =
            pacoPositionAsGrid pieces

        tileEntry : Int -> String
        tileEntry i =
            Dict.get i dictRepresentation
                |> Maybe.withDefault EmptyTile
                |> tileStateAsString

        markdownRow : List Int -> String
        markdownRow indexRow =
            String.join " " (List.map tileEntry indexRow)

        indices =
            [ [ 56, 57, 58, 59, 60, 61, 62, 63 ]
            , [ 48, 49, 50, 51, 52, 53, 54, 55 ]
            , [ 40, 41, 42, 43, 44, 45, 46, 47 ]
            , [ 32, 33, 34, 35, 36, 37, 38, 39 ]
            , [ 24, 25, 26, 27, 28, 29, 30, 31 ]
            , [ 16, 17, 18, 19, 20, 21, 22, 23 ]
            , [ 8, 9, 10, 11, 12, 13, 14, 15 ]
            , [ 0, 1, 2, 3, 4, 5, 6, 7 ]
            ]
    in
    indices
        |> List.map markdownRow
        |> String.join "\n"


type TileState
    = EmptyTile
    | WhiteTile Sako.Type
    | BlackTile Sako.Type
    | PairTile Sako.Type Sako.Type


{-| Converts a PacoPosition into a map from 1d tile indices to tile states
-}
pacoPositionAsGrid : List PacoPiece -> Dict Int TileState
pacoPositionAsGrid pieces =
    let
        colorTiles filterColor =
            pieces
                |> List.filter (\piece -> piece.color == filterColor)
                |> List.map (\piece -> ( tileFlat piece.position, piece.pieceType ))
                |> Dict.fromList
    in
    Dict.merge
        (\i w dict -> Dict.insert i (WhiteTile w) dict)
        (\i w b dict -> Dict.insert i (PairTile w b) dict)
        (\i b dict -> Dict.insert i (BlackTile b) dict)
        (colorTiles Sako.White)
        (colorTiles Sako.Black)
        Dict.empty


gridAsPacoPosition : List (List TileState) -> PacoPosition
gridAsPacoPosition tiles =
    { moveNumber = 0
    , pieces =
        indexedMapNest2 tileAsPacoPiece tiles
            |> List.concat
            |> List.concat
    }


tileAsPacoPiece : Int -> Int -> TileState -> List PacoPiece
tileAsPacoPiece row col tile =
    let
        position =
            Tile col (7 - row)
    in
    case tile of
        EmptyTile ->
            []

        WhiteTile w ->
            [ { pieceType = w, color = Sako.White, position = position } ]

        BlackTile b ->
            [ { pieceType = b, color = Sako.Black, position = position } ]

        PairTile w b ->
            [ { pieceType = w, color = Sako.White, position = position }
            , { pieceType = b, color = Sako.Black, position = position }
            ]


indexedMapNest2 : (Int -> Int -> a -> b) -> List (List a) -> List (List b)
indexedMapNest2 f ls =
    List.indexedMap
        (\i xs ->
            List.indexedMap (\j x -> f i j x) xs
        )
        ls


tileStateAsString : TileState -> String
tileStateAsString tileState =
    case tileState of
        EmptyTile ->
            ".."

        WhiteTile w ->
            markdownTypeChar w ++ "."

        BlackTile b ->
            "." ++ markdownTypeChar b

        PairTile w b ->
            markdownTypeChar w ++ markdownTypeChar b


markdownTypeChar : Sako.Type -> String
markdownTypeChar pieceType =
    case pieceType of
        Sako.Pawn ->
            "P"

        Sako.Rock ->
            "R"

        Sako.Knight ->
            "N"

        Sako.Bishop ->
            "B"

        Sako.Queen ->
            "Q"

        Sako.King ->
            "K"


{-| Parser that converts a single letter into the corresponding sako type.
-}
parseTypeChar : Parser (Maybe Sako.Type)
parseTypeChar =
    Parser.oneOf
        [ Parser.succeed (Just Sako.Pawn) |. Parser.symbol "P"
        , Parser.succeed (Just Sako.Rock) |. Parser.symbol "R"
        , Parser.succeed (Just Sako.Knight) |. Parser.symbol "N"
        , Parser.succeed (Just Sako.Bishop) |. Parser.symbol "B"
        , Parser.succeed (Just Sako.Queen) |. Parser.symbol "Q"
        , Parser.succeed (Just Sako.King) |. Parser.symbol "K"
        , Parser.succeed Nothing |. Parser.symbol "."
        ]


{-| Parser that converts a pair like ".P", "BQ", ".." into a TileState.
-}
parseTile : Parser TileState
parseTile =
    Parser.succeed tileFromMaybe
        |= parseTypeChar
        |= parseTypeChar


tileFromMaybe : Maybe Sako.Type -> Maybe Sako.Type -> TileState
tileFromMaybe white black =
    case ( white, black ) of
        ( Nothing, Nothing ) ->
            EmptyTile

        ( Just w, Nothing ) ->
            WhiteTile w

        ( Nothing, Just b ) ->
            BlackTile b

        ( Just w, Just b ) ->
            PairTile w b


parseRow : Parser (List TileState)
parseRow =
    sepBy parseTile (Parser.symbol " ")
        |> Parser.andThen parseLengthEightCheck


parseGrid : Parser (List (List TileState))
parseGrid =
    sepBy parseRow linebreak
        |> Parser.andThen parseLengthEightCheck


parsePosition : Parser PacoPosition
parsePosition =
    parseGrid
        |> Parser.map gridAsPacoPosition


linebreak : Parser ()
linebreak =
    Parser.chompWhile (\c -> c == '\n' || c == '\u{000D}')


{-| Parse a string with many tiles and return them as a list. When we encounter
".B " with a trailing space, then we know that more tiles must follow.
If there is no trailing space, we return.
-}
parseLengthEightCheck : List a -> Parser (List a)
parseLengthEightCheck list =
    if List.length list == 8 then
        Parser.succeed list

    else
        Parser.problem "There must be 8 columns in each row."


{-| Using `sepBy content separator` you can parse zero or more occurrences of
the `content`, separated by `separator`.

Returns a list of values returned by `content`.

-}
sepBy : Parser a -> Parser () -> Parser (List a)
sepBy content separator =
    let
        helper ls =
            Parser.oneOf
                [ Parser.succeed (\tile -> Parser.Loop (tile :: ls))
                    |= content
                    |. Parser.oneOf [ separator, Parser.succeed () ]
                , Parser.succeed (Parser.Done ls)
                ]
    in
    Parser.loop [] helper
        |> Parser.map List.reverse