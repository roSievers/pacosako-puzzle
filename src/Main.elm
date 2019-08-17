module Main exposing (main)

import Browser
import Browser.Dom as Dom
import Browser.Events
import Element exposing (Element, centerX, centerY, el, fill, fillPortion, height, padding, row, spacing, text, width)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import FontAwesome.Icon exposing (Icon, viewIcon)
import FontAwesome.Solid as Solid
import FontAwesome.Styles
import Html exposing (Html)
import Html.Attributes
import Html.Events.Extra.Mouse as Mouse
import Json.Decode as Decode
import Pieces
import Pivot as P exposing (Pivot)
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
    , drag : DragState
    , windowSize : ( Int, Int )
    , tool : EditorTool
    }


type EditorTool
    = MoveTool
    | DeleteTool
    | CreateTool


type alias PacoPosition =
    { moveNumber : Int
    , pieces : List PacoPiece
    }


type alias PacoPiece =
    { pieceType : Sako.Piece
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


pacoPiece : Sako.Color -> Sako.Piece -> Tile -> PacoPiece
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
            gameSpaceCoordinate element realizedBoardViewBox event.clientPos
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
                , current = gameSpaceCoordinate rect realizedBoardViewBox event.clientPos
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
    | Undo
    | Redo
    | Reset PacoPosition


initialModel : Decode.Value -> Model
initialModel flags =
    { game = P.singleton initialPosition
    , drag = DragOff
    , windowSize = parseWindowSize flags
    , tool = DeleteTool
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

        Undo ->
            ( { model | game = P.withRollback P.goL model.game }, Cmd.none )

        Redo ->
            ( { model | game = P.withRollback P.goR model.game }, Cmd.none )

        Reset newPosition ->
            ( { model | game = addHistoryState newPosition model.game }, Cmd.none )


clickRelease : SvgCoord -> SvgCoord -> Model -> ( Model, Cmd Msg )
clickRelease down up model =
    let
        coordUp =
            tileCoordinate up

        coordDown =
            tileCoordinate down

        oldPosition =
            P.getC model.game

        newPosition =
            { oldPosition | pieces = List.filter (\p -> p.position /= coordUp) oldPosition.pieces }

        newHistory =
            addHistoryState newPosition model.game
    in
    if coordUp == coordDown then
        ( { model | game = newHistory }, Cmd.none )

    else
        ( model, Cmd.none )


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
    Browser.Events.onResize WindowResize



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
                    [ positionSvg (windowHeight - windowSafetyMargin) position drag ]
                )
            )
        )


sidebar : Model -> Element Msg
sidebar model =
    Element.column [ width fill, height fill, spacing 10 ]
        [ Element.text "Paco Ŝako Puzzle"
        , Element.text "Sidebar"
        , Element.el [ Events.onClick (Reset initialPosition) ]
            (Element.text "Reset to starting position.")
        , Element.el [ Events.onClick (Reset emptyPosition) ]
            (Element.text "Clear board.")
        , undo model.game
        , redo model.game
        , toolSelection model.tool
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


toolSelection : EditorTool -> Element Msg
toolSelection tool =
    Element.row [ width fill ]
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


backgroundFocus : Bool -> Element.Attribute msg
backgroundFocus isFocused =
    if isFocused then
        Background.color (Element.rgb255 200 200 200)

    else
        Background.color (Element.rgb255 255 255 255)


boardViewBox : Rect
boardViewBox =
    { x = -70 -- -70
    , y = -30 -- -30
    , width = 900
    , height = 920 -- 920
    }


{-| The svg showing the game board is a square. The viewport does not need to be a square.
The browser then centers the requested viewport inside the realized viewport. This function
calculates the rectangle used for the realized viewport in order to transform coordinates.

Assumes, that height > width for boardViewBox.

-}
realizedBoardViewBox : Rect
realizedBoardViewBox =
    { boardViewBox
        | x = boardViewBox.x - (boardViewBox.height - boardViewBox.width) / 2
        , width = boardViewBox.height
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


positionSvg : Int -> PacoPosition -> DragState -> Html Msg
positionSvg sideLength pacoPosition drag =
    Svg.svg
        [ Svg.Attributes.width <| String.fromInt sideLength
        , Svg.Attributes.height <| String.fromInt sideLength
        , viewBox boardViewBox
        ]
        [ board
        , dragHints drag
        , piecesSvg pacoPosition
        ]


piecesSvg : PacoPosition -> Svg msg
piecesSvg pacoPosition =
    pacoPosition.pieces
        |> sortBlacksFirst
        |> List.map pieceSvg
        |> Svg.g []


{-| When rendering a union the black piece must appear below the white piece. Reorder the pieces
to make this happen.
-}
sortBlacksFirst : List PacoPiece -> List PacoPiece
sortBlacksFirst pieces =
    List.filter (\piece -> piece.color == Sako.Black) pieces
        ++ List.filter (\piece -> piece.color == Sako.White) pieces


pieceSvg : PacoPiece -> Svg msg
pieceSvg piece =
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
        [ Pieces.figure Pieces.defaultColorScheme piece.pieceType piece.color
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
