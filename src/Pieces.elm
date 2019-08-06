module Pieces exposing (ColorScheme, SideColor, defaultColorScheme, figure)

{-| The LICENSE file does not apply to this file!

The svg graphics of Paco Ŝako figures are (c) 2017 Paco Ŝako B.V. and are used by me
with permission from Felix Albers.

-}

import Sako exposing (Color(..), Piece(..))
import Svg exposing (Attribute, Svg)
import Svg.Attributes exposing (d)


{-| A side color represents a color combination used by a single player. Each player gets to
choose their own side color. Make sure that the side colors differ.

This is an important feature for Paco Ŝako, as the colorful pieces are even available for purchase
on the Paco Ŝako website.

-}
type alias SideColor =
    { fill : String
    , stroke : String
    }


{-| A color Scheme is a combination of two side colors. Make sure that the side colors differ.
-}
type alias ColorScheme =
    { white : SideColor
    , black : SideColor
    }


{-| White pieces for the white player, black pieces for the black player.
-}
defaultColorScheme : ColorScheme
defaultColorScheme =
    { white = whitePieceColor
    , black = blackPieceColor
    }


whitePieceColor : SideColor
whitePieceColor =
    { fill = "#FFF", stroke = "#000" }


blackPieceColor : SideColor
blackPieceColor =
    { fill = "#333", stroke = "#666" }


sideColor : ColorScheme -> Color -> SideColor
sideColor scheme color =
    case color of
        White ->
            scheme.white

        Black ->
            scheme.black


figure : ColorScheme -> Piece -> Color -> Svg msg
figure scheme piece color =
    let
        side =
            sideColor scheme color
    in
    Svg.path
        [ figureAttribute piece color
        , Svg.Attributes.fill side.fill
        , Svg.Attributes.stroke side.stroke
        , Svg.Attributes.strokeWidth "2"
        , Svg.Attributes.strokeLinejoin "round"
        ]
        []


figureAttribute : Piece -> Color -> Attribute msg
figureAttribute piece color =
    case ( piece, color ) of
        ( Pawn, White ) ->
            whitePawn

        _ ->
            whitePawn


whitePawn : Attribute msg
whitePawn =
    d "M 26.551366,35.36251 A 17.040858,17.040858 0 0 0 9.5108102,52.403108 17.040858,17.040858 0 0 0 26.551366,69.443631 17.040858,17.040858 0 0 0 43.59297,52.403108 17.040858,17.040858 0 0 0 26.551366,35.36251 Z M 15.446832,72.699071 c -0.636443,0 -1.148673,0.512219 -1.148673,1.148704 v 3.445996 c 0,0.636447 0.51223,1.148666 1.148673,1.148666 h 22.210115 c 0.636443,0 1.14867,-0.512219 1.14867,-1.148666 v -3.445996 c 0,-0.636485 -0.512227,-1.148704 -1.14867,-1.148704 z m 4.567466,11.17157 A 97.222517,97.222517 0 0 0 4.7915121,85.12717 97.222517,97.222517 0 0 0 46.0767,94.455765 97.222517,97.222517 0 0 0 61.299488,93.199273 97.222517,97.222517 0 0 0 20.014298,83.870641 Z"
