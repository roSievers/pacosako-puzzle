module StaticText exposing (blogEditorExampleText, mainPageGreetingText)


mainPageGreetingText : String
mainPageGreetingText =
    """# A tool collection for Paco Ŝako

I am working on various tool to help us communicate about Paco Ŝako. Currently there is a "Position Editor" which you can use to create Paco Ŝako positions and generate images. You can download the images as a PNG if you want to share it. There is also a SVG export available, if you want to change the image in any way.

```
.. .K .. .. .. .. BP ..
PN .. N. .. PP .. .. ..
.P .. RP .. .. NQ .. ..
.. .. .B BR P. QN PB ..
RP K. P. .. .P .. .. ..
P. P. .. .. .. .P .. ..
.. .. .P .. .. .. .. ..
.. .. .. .. .. .. PR ..
```

If you want some more examples, check out the *Library* page!

We don't have any user profiles yet, this means you can not save any positions you create with this tool. Right now, there is only a text export that you need to save to a file.


## Writing about Paco Ŝako

The tool collection now also includes a simple text editor that you can use to write texts on Paco Ŝako. The nice thing abouth this editor is, that you can directly embed positions from the editor into the text."""


blogEditorExampleText : String
blogEditorExampleText =
    """# Markdown editor with Paco Ŝako support

There are many details about Paco Ŝako that I would love to discuss. Having a way to write and share articles on Paco Ŝako online would greatly contribute this. In this editor you can use [Github flavored Markdown](https://guides.github.com/features/mastering-markdown/) to write articles on Paco Ŝako.

We have replaced code blocks with rendered Paco Ŝako positions. You can create positions in the editor and then create a blog post based on it.

```
.. R. .. RR .. .. QQ ..
.. .. .. .. PB .. .P P.
.. .. PP .. .. .N .. ..
K. .. .P .. .P NP B. ..
P. .. .. .. .P PP .. P.
.R .. P. .. .. .. .K ..
B. .P .. .. .. .. N. ..
.. .. .. .. .N .. .. PB
-
N. .. .. .. .. .. .. .R
.Q PP .. .. P. P. .. ..
.. .. .P .. .. .K .. ..
.. .. .. .. PP K. N. ..
.. .. .P .. B. .B QP ..
P. .P R. .R .. PN .. .P
.P P. .. .. .. .. .. PB
.. .. .. .. .. .. BN R.
```"""
