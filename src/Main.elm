module Main exposing (main)

import Browser
import Browser.Dom as Dom
import Browser.Events
import Element exposing (Element, centerX, centerY, el, fill, height, row, spacing, text, width)
import Html exposing (Html)
import Html.Attributes
import Html.Events.Extra.Mouse as Mouse
import Json.Decode as Decode
import Pieces
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
    { game : PacoPosition
    , drag : DragState
    , windowSize : ( Int, Int )
    }


type alias PacoPosition =
    { moveNumber : Int
    , pieces : List PacoPiece
    }


type alias PacoPiece =
    { pieceType : Sako.Piece
    , color : Sako.Color
    , position : ( Int, Int )
    }


pacoPiece : Sako.Color -> Sako.Piece -> ( Int, Int ) -> PacoPiece
pacoPiece color pieceType position =
    { pieceType = pieceType, color = color, position = position }


initialPosition : PacoPosition
initialPosition =
    { moveNumber = 0
    , pieces =
        [ pacoPiece Sako.White Sako.Rock ( 0, 0 )
        , pacoPiece Sako.White Sako.Knight ( 1, 0 )
        , pacoPiece Sako.White Sako.Bishop ( 2, 0 )
        , pacoPiece Sako.White Sako.Queen ( 3, 0 )
        , pacoPiece Sako.White Sako.King ( 4, 0 )
        , pacoPiece Sako.White Sako.Bishop ( 5, 0 )
        , pacoPiece Sako.White Sako.Knight ( 6, 0 )
        , pacoPiece Sako.White Sako.Rock ( 7, 0 )
        , pacoPiece Sako.White Sako.Pawn ( 0, 1 )
        , pacoPiece Sako.White Sako.Pawn ( 1, 1 )
        , pacoPiece Sako.White Sako.Pawn ( 2, 1 )
        , pacoPiece Sako.White Sako.Pawn ( 3, 1 )
        , pacoPiece Sako.White Sako.Pawn ( 4, 1 )
        , pacoPiece Sako.White Sako.Pawn ( 5, 1 )
        , pacoPiece Sako.White Sako.Pawn ( 6, 1 )
        , pacoPiece Sako.White Sako.Pawn ( 7, 1 )
        , pacoPiece Sako.Black Sako.Pawn ( 0, 6 )
        , pacoPiece Sako.Black Sako.Pawn ( 1, 6 )
        , pacoPiece Sako.Black Sako.Pawn ( 2, 6 )
        , pacoPiece Sako.Black Sako.Pawn ( 3, 6 )
        , pacoPiece Sako.Black Sako.Pawn ( 4, 6 )
        , pacoPiece Sako.Black Sako.Pawn ( 5, 6 )
        , pacoPiece Sako.Black Sako.Pawn ( 6, 6 )
        , pacoPiece Sako.Black Sako.Pawn ( 7, 6 )
        , pacoPiece Sako.Black Sako.Rock ( 0, 7 )
        , pacoPiece Sako.Black Sako.Knight ( 1, 7 )
        , pacoPiece Sako.Black Sako.Bishop ( 2, 7 )
        , pacoPiece Sako.Black Sako.Queen ( 3, 7 )
        , pacoPiece Sako.Black Sako.King ( 4, 7 )
        , pacoPiece Sako.Black Sako.Bishop ( 5, 7 )
        , pacoPiece Sako.Black Sako.Knight ( 6, 7 )
        , pacoPiece Sako.Black Sako.Rock ( 7, 7 )
        ]
    }


type DragState
    = DragOff
    | Dragging { start : ( Float, Float ), current : ( Float, Float ), rect : Rect }


startDrag : Rect -> Mouse.Event -> DragState
startDrag element event =
    Dragging
        { start = substract event.clientPos ( element.x, element.y )
        , current = substract event.clientPos ( element.x, element.y )
        , rect = element
        }


moveDrag : Mouse.Event -> DragState -> DragState
moveDrag event drag =
    case drag of
        DragOff ->
            DragOff

        Dragging { start, rect } ->
            Dragging { start = start, current = substract event.clientPos ( rect.x, rect.y ), rect = rect }


substract : ( Float, Float ) -> ( Float, Float ) -> ( Float, Float )
substract ( x, y ) ( dx, dy ) =
    ( x - dx, y - dy )


relativeInside : Rect -> ( Float, Float ) -> ( Float, Float )
relativeInside rect ( x, y ) =
    ( (x - rect.x) / rect.width, (y - rect.y) / rect.height )


absoluteOutside : Rect -> ( Float, Float ) -> ( Float, Float )
absoluteOutside rect ( x, y ) =
    ( x * rect.width + rect.x, y * rect.height + rect.y )


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


initialModel : Decode.Value -> Model
initialModel flags =
    { game = initialPosition
    , drag = DragOff
    , windowSize = parseWindowSize flags
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

        MouseUp _ ->
            ( { model | drag = DragOff }, Cmd.none )

        GotBoardPosition res event ->
            case res of
                Ok element ->
                    ( { model | drag = startDrag element.element event }, Cmd.none )

                Err _ ->
                    ( model, Cmd.none )

        WindowResize width height ->
            ( { model | windowSize = ( width, height ) }, Cmd.none )


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
        [ positionView model model.game model.drag
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
        , Element.text <| Debug.toString model.windowSize
        ]


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
        |> List.map pieceSvg
        |> Svg.g []


pieceSvg : PacoPiece -> Svg msg
pieceSvg piece =
    let
        ( x, y ) =
            piece.position

        transform =
            Svg.Attributes.transform
                ("translate("
                    ++ String.fromInt (100 * x)
                    ++ ", "
                    ++ String.fromInt (700 - 100 * y)
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

        Dragging { start, current, rect } ->
            let
                ( sx, sy ) =
                    start
                        |> relativeInside { rect | x = 0, y = 0 }
                        |> absoluteOutside realizedBoardViewBox

                ( cx, cy ) =
                    current
                        |> relativeInside { rect | x = 0, y = 0 }
                        |> absoluteOutside realizedBoardViewBox
            in
            Svg.g []
                [ Svg.circle
                    [ Svg.Attributes.cx (String.fromFloat sx)
                    , Svg.Attributes.cy (String.fromFloat sy)
                    , Svg.Attributes.r "30"
                    , Svg.Attributes.fill "#F00"
                    ]
                    []
                , Svg.circle
                    [ Svg.Attributes.cx (String.fromFloat cx)
                    , Svg.Attributes.cy (String.fromFloat cy)
                    , Svg.Attributes.r "30"
                    , Svg.Attributes.fill "#0F0"
                    ]
                    []
                ]
