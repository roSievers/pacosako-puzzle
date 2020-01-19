module StaticText exposing (blogEditorExampleText, mainPageGreetingText)


mainPageGreetingText : String
mainPageGreetingText =
    """# A tool collection for Paco Ŝako

Paco Ŝako is a new form of chess created to be an expression of peace, friendship and collaboration, designed with an exciting gameplay. This website hosts some tools to help us communicate about Paco Ŝako.

## Designing positions

The Feature that is currently best developed is the position editor. Here you can arrange Paco Ŝako pieces as you please and export the result as an image. You can download it as a png file for easy sharing, or download a raw SVG file that you can edit later.

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

If you want to store the positions you have designed in the editor, you will need to log in. There is no sign up system at the moment, so you will need to ask Rolf to create an account for you. As a workaround, there is also a text export that you can use to save to a position.

### Analysing positions

I already have a tool which can perform ŝako analysis on a given position, this is developed in the [Paco Ŝako Rust](https://github.com/roSievers/pacosako-rust) project. Eventually, this functionality will be integrated into the position editor.

## Writing about Paco Ŝako

The tool collection now also includes a *Blog Editor* that you can use to write texts on Paco Ŝako. The nice thing about this editor is, that you can directly embed positions from the editor into the text.

Note that even with a user account, the content you edit in the Blog editor can not be saved yet. Please make sure to save your texts in a text file."""


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
