Braincuck
=========
Transpiles Brainfuck code into C code.

~~~
$ npm install zenoamaro/braincuck --global
$ braincuck 99-bottles.bf 99-bottles.c
$ gcc -O3 99-bottles.c -o 99-bottles
$ ./99-bottles
~~~

[Brainfuck]: https://en.wikipedia.org/wiki/Brainfuck
[C]: https://en.wikipedia.org/wiki/C_(programming_language)
[GCC]: https://gcc.gnu.org
[Clang]: https://clang.llvm.org
[LLVM]: http://llvm.org


Transpilation
-------------
[Brainfuck] code translates pretty closely to [C] code, so much that we can transpile it using a simple mapping table:

| Instruction       | Brainfuck code      | C code              |
|-------------------|---------------------|---------------------|
| Increment pointer | `>` (one or more)   | `ptr += x;`         |
| Decrement pointer | `<` (one or more)   | `ptr -= x;`         |
| Increment cell    | `+` (one or more)   | `*ptr += x;`        |
| Decrement cell    | `-` (one or more)   | `*ptr -= x;`        |
| Output cell       | `.`                 | `putchar(*ptr);`    |
| Input cell        | `,`                 | `*ptr = getchar();` |
| Jump if zero      | `[`                 | `while (*ptr) {`    |
| Loop              | `]`                 | `}`                 |
| Comment           | Any other character | No output           |

Here is a simple Brainfuck program:

~~~brainfuck
# Brainfuck Hello World
# https://gist.github.com/niklaskorz/4523505

+++++ +++++             initialize counter (cell #0) to 10
[                       use loop to initialize the next cells
    > +++++ ++              add  7 to cell #1 to be  70
    > +++++ +++++           add 10 to cell #2 to be 100
    > +++                   add  3 to cell #3 to be  30
    > +                     add  1 to cell #4 to be  10
    <<<< -                  decrement counter (cell #0)
]
> ++ .                  print 'H'
> + .                   print 'e'
+++++ ++ .              print 'l'
.                       print 'l'
+++ .                   print 'o'
> ++ .                  print ' '
<< +++++ +++++ +++++ .  print 'W'
> .                     print 'o'
+++ .                   print 'r'
----- - .               print 'l'
----- --- .             print 'd'
> + .                   print '!'
> .                     print '\n'
~~~

Here is the resulting C program, reformatted and commented to highlight how closely it resembles the original:

~~~c
#include <stdio.h>

char array[65536] = {0};
char *ptr = array;

int main() {
  *ptr+=10;                         // initialize counter (cell #0) to 10

  while (*ptr) {                    // use loop to initialize the next cells
    ptr+=1; *ptr+=7;                //     add  7 to cell #1 to be  70
    ptr+=1; *ptr+=10;               //     add 10 to cell #2 to be 100
    ptr+=1; *ptr+=3;                //     add  3 to cell #3 to be  30
    ptr+=1; *ptr+=1;                //     add  1 to cell #4 to be  10
    ptr-=4; *ptr-=1;                //     decrement counter (cell #0)
  }

  ptr+=1; *ptr+=2; putchar(*ptr);   // print 'H'
  ptr+=1; *ptr+=1; putchar(*ptr);   // print 'e'
  *ptr+=7; putchar(*ptr);           // print 'l'
  putchar(*ptr);                    // print 'l'
  *ptr+=3; putchar(*ptr);           // print 'o'
  ptr+=1; *ptr+=2; putchar(*ptr);   // print ' '
  ptr-=2; *ptr+=15; putchar(*ptr);  // print 'W'
  ptr+=1; putchar(*ptr);            // print 'o'
  *ptr+=3; putchar(*ptr);           // print 'r'
  *ptr-=6; putchar(*ptr);           // print 'l'
  *ptr-=8; putchar(*ptr);           // print 'd'
  ptr+=1; *ptr+=1; putchar(*ptr);   // print '!'
  ptr+=1; putchar(*ptr);            // print '\n'

  return 0;
}
~~~

Due to the crazy optimizations built into [GCC] and [LLVM], even a naive C conversion like this one is bound to give you an immense performance boost over a standard Brainfuck interpreter.


Command-line interface
----------------------

You can use the CLI to transpile a Brainfuck script into a C program by passing it source and destination files:

~~~
$ braincuck 99-bottles.bf 99-bottles.c
~~~

You can compile the C code into an executable binary for your platform with [GCC] or [Clang]:

~~~
$ gcc -O3 99-bottles.c -o 99-bottles
~~~


Programmatic API
----------------
Though I am not sure why would you want to do it, you can use the transpiler programmatically from your own code.

You can optionally enable the `bare` flag to return the inner code, without the surrounding C skeleton, in case you want to provide it yourself.

~~~javascript
const transpile = require('braincuck');

const program = transpile(source, {
  bare: false // If true, only inner code is returned
});
~~~


Compatibility Notes
-------------------
There is no single standard specification of a Brainfuck environment, so programs written with different assumptions will not work. Most Brainfuck programs, however, are compatible:

- Cells are 8 bit-wide, signed, and they wrap-around.
- The tape is 65536 cells long, starts from address zero, with no wrap-around.

Also, note that there are no boundary checks, so accessing anything outside the bounds of the tape will cause a segmentation fault.


License
-------
Copyright (c) 2018, zenoamaro <zenoamaro@gmail.com>

This software is released under the [MIT License](LICENSE.md).
