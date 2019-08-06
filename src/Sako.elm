module Sako exposing (Color(..), Piece(..))

{-| Basic types to represent the different pieces of the game
-}


type Piece
    = Pawn
    | Rock
    | Knight
    | Bishop
    | Queen
    | King


type Color
    = White
    | Black
