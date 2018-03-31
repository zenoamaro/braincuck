/**
 * Mapping from Brainfuck commands to C statements.
 */
const translation = new Map([
  [ /^\>+/, (match) => `ptr+=${match.length};`  ],
  [ /^\<+/, (match) => `ptr-=${match.length};`  ],
  [ /^\++/, (match) => `*ptr+=${match.length};` ],
  [ /^\-+/, (match) => `*ptr-=${match.length};` ],
  [ /^\[/,  (     ) => 'while(*ptr){'           ],
  [ /^\]/,  (     ) => '}'                      ],
  [ /^\./,  (     ) => 'putchar(*ptr);'         ],
  [ /^\,/,  (     ) => '*ptr=getchar();'        ],
]);

/**
 * Ignored characters that shouldn't be transpiled.
 */
const ignored = /[^\>\<\+\-\.\,\[\]]/g;

/**
 * A simple C shell that provides the run-time environment.
 */
const skeleton = (`
  #include <stdio.h>
  char array[65536] = {0};
  char *ptr = array;

  int main() {
    {{code}}
    return 0;
  }
`);

/**
 * Translates Brainfuck code into C code.
 * 
 * @param {string}  source  Source Brainfuck code
 * @param {object}  options
 * @param {boolean} [options.bare=false]  Only output inner code
 */
function transpile(source, options={}) {
  const bare = options.bare || false;
  let output = '';

  // Clean before transpiling to uncover further optimizations
  source = source.replace(ignored, '');

  while (source.length) {
    for (const [pattern, compile] of translation.entries()) {
      source = source.replace(pattern, (match) => {
        // Remove tokens from source, add to final output
        output += compile(match);
        return '';
      });
    }
  }

  if (bare) return output;
  return skeleton.replace('{{code}}', output);
}

module.exports = transpile;
