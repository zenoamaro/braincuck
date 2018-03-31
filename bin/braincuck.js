#!/usr/bin/env node
const fs = require('fs');
const transpile = require('../src');

if (process.argv.length != 4) {
  console.error(`Usage: braincuck <input.bf> <output.c>`);
  process.exit(1);
}

const [node, command, source, output] = process.argv;

fs.readFile(source, (err, input) => {
  if (err) throw err;
  const sourceCode = input.toString();
  const transpiledCode = transpile(sourceCode);

  fs.writeFile(output, transpiledCode, (err) => {
    if (err) throw err;
  });
});