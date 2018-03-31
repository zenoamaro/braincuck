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
