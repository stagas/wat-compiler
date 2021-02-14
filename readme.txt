
        ~^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^~

                     wel

                     -=-

         a wannabe webassembly something

        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        progress:

          [......] - bytecode generator
          [......] - lexer / tokenizer
          [......] - parser
          [..... ] - compiler

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


^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


update:
~~~~~~~

The ModuleBuilder component is fairly complete.
Are there missing cases? Certainly.
But for our purposes, this is acceptable coverage,
one which allows us to move forward.
We will certainly revisit these interfaces so
it's also best to not rigidify them too much with
too many test cases so it's also easier to refactor
in case we need some major change.
The missing remaining cases will be added as needed.

Next steps ?

Implement low level compiler components such as
a heap, maybe a stack, type inference, type
casting/solving, closures etc. These should not
be tightly coupled but instead provide clean user
interfaces and as such allow someone to pick
and combine them to create higher order
interfaces i.e programming languages. A lot of
these have been implemented by other languages
targetting WASM so again some research is necessary
to see if we can reuse some code and not have to
reimplement them.



^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


update [31 jan 21]:
~~~~~~~~~~~~~~~~~~~

Decided to implement a WAT compiler to see if it
is possible with the current tooling.
Currently working on the lexer, an initial
implementation is mainly complete but currently
parses the entire file into memory.
This shouldn't much of an issue but nevertheless
we can move to a streaming implementation because
matchAll is a generator and it allows it.
While we do that we can also implement helpers like
.peek(), .consume() etc.


...later:
~~~~~~~~~

A "tokenizer" "class" was implemented as a companion
to the lexer, with all the common recursive descent
helpers such as accept() peek() expect() and also
literal().

accept() and expect() will return the consumed token
in case you need it.

The tokenizer needs to be explicitly started by calling
start() which does nothing else but calls the first
advance() to fetch the token from the generator and
make it available for the rest of the methods.

These were implemented in a closure style instead of
class so that you can destructure them without the need
to bind the methods:

const { start, peek, advance, expect, literal } = tokenizer(code)

This is also an iterator so there is a next()
method but does not concern the tokenizer and it will
also emit nullish characters which we'll not be using
in the parser. Nevertheless, the API is as simple:

const tokens = [...tokenizer(code)]

I'm not sure if WAT's source code really needs all this
interface to be parsed or even recursive descent at
all, but the code wasn't that complicated and I wanted
a tokenizer I can reuse and adapt in other projects
as well.

Next move, parser.

p.s Happy coincidence! We got 42 tests so far! :D



update [01 feb 21]:
~~~~~~~~~~~~~~~~~~~

Success! We got a working parser and compiler
which can parse and compile a single function returning
a single value!
Now remains to implement every other operation..
However, we've reached end to end of the implementation
and it looks to be ~2 orders of magnitude faster than
the wabt tool. For the same WAT source code it
parses and compiles at around ~0.5ms vs ~15ms cold run
and ~0.15ms vs ~10ms on live reload.
But we'll see how that will scale when there's more
complex code and JS (de)optimizations kick in.



update [02 feb 21]:
~~~~~~~~~~~~~~~~~~~

The compiler is progressing. The test suite seems
to be adequate as it is always pinpointing where the
issue might be so not a lot of time is wasted in
figuring out why something isn't working, so that's
a positive thing. The bad news is I've jumped to the
assumption that a mostly pure functional compiler
architecture would be possible, but it seems that
a lot of edge cases have started appearing here and
there, we might need a table to handle function
signatures as they don't seem to be following the
same paradigm. It's a pity as the syntax was close
to perfect so that thing wouldn't be needed if there
was a little more consideration in how you
differentiate between instruction parameters and
stack arguments. I could be wrong though and there
is some higher structure I'm not seeing yet.
Anyway, it's a small price to pay so we might
go for that.


update [10 feb 21]:
~~~~~~~~~~~~~~~~~~~

Woo, late update. Refactored the compiler architecture
to be more explicit and to better handle function/block
contexts. Tests are currently broad strokes, but
planning to insert binaryen's spec tests[0] when the
all of the primary instructions are in place in order
to hunt for all possibe edge cases. They are fairly
exhaustive so that saves us a lot of time!

[0]: https://github.com/WebAssembly/binaryen/tree/main/test/spec


update [14 feb 21]:
~~~~~~~~~~~~~~~~~~~

Finally is able to compile real life WAT projects,
though there are still cases where it would probably
fail, especially when handling data and various numeric
types encoding and addresses. To solve these properly
we should create separate test suites, I deferred this
task because I didn't have the knowledge to solve it,
which I think I do now. Will probably insert it along
with a small generic refactor since there are some
low-hanging fruit that are screaming for improvement,
plus better error handling.
Nevertheless, it's in a good state at the moment so
I added a build version if anyone wants to play with
it and also to see what the overhead is at the moment.
Right now it's at 29kb (15kb minified, 5kb gzipped)
and cold compilation for a semi-complex file is 100x
faster compared to wabt (~100ms vs ~1ms) and about
10x faster when hot.


+--------------------------------------------------+
:::: inspiration / stolen code / much gratitude ::::

  WebBS  - https://github.com/j-s-n/WebBS
  bfwasm - https://github.com/surma/bfwasm
  mini-c - https://github.com/maierfelix/mini-c
  Walt   - https://github.com/ballercat/walt
  Wax    - https://github.com/LingDong-/wax
  Never  - https://never-lang.readthedocs.io/
  chibicc - https://github.com/rui314/chibicc
  Raw Wasm - https://github.com/binji/raw-wasm
  AssemblyScript - https://www.assemblyscript.org/
