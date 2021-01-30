
        ~^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^~

                     wel

                     -=-

         a wannabe webassembly something

        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        progress:

          [..... ] - bytecode generator

        ---------------------------------
        to run the tests:

        $ npm install -g mocha-headless
        $ mocha-headless --watch

        ---------------------------------
        unless noted otherwise,
        code belongs in the public domain

+--------------------------------------------------+

story so far:
~~~~~~~~~~~~~

Trying to make a decent bytecode generator because
current solutions were either too clumsy or too slow
and overengineered.

This is currently an order of magnitude or two
faster than wabt or other solutions and tries to
keep a clean API at every interface, i.e you can
skip the ModuleBuilder and use directly
the binary generator.
It works and it is still useful.
The layer on top, the "ModuleBuilder" serves
as a small semantic context sugar, mainly trying
to have an API similar to the S-expressions of WAT,
while also keeping track of function type definitions,
name references and such.

Not sure how this will progress, might try to
build a small parser and language by adding a few
more semantic layers and see how that goes.

At every stage though the idea is to be "complete",
i.e serve some purpose. This idea came after
reading this paper:

An Incremental Approach to Compiler Construction
http://scheme2006.cs.uchicago.edu/11-ghuloum.pdf

which I heard about in the readme of chibicc
https://github.com/rui314/chibicc

You should check it out.

Thanks for reading!


+--------------------------------------------------+
:::: inspiration / stolen code / much gratitude ::::

  WebBS  - https://github.com/j-s-n/WebBS
  bfwasm - https://github.com/surma/bfwasm
  mini-c - https://github.com/maierfelix/mini-c
  Walt   - https://github.com/ballercat/walt
  Wax    - https://github.com/LingDong-/wax
  Never  - https://never-lang.readthedocs.io/
  chibicc - https://github.com/rui314/chibicc
  AssemblyScript - https://www.assemblyscript.org/
