const { existsSync, readdirSync, rmSync } = require('node:fs');
const { join } = require('node:path');

const functionsDirectory = join(__dirname, '..', 'dist', 'netlify', 'functions');

if (!existsSync(functionsDirectory)) {
  throw new Error('No se encontró la carpeta compilada de Netlify Functions.');
}

for (const fileName of readdirSync(functionsDirectory)) {
  if (fileName.endsWith('.d.ts') || fileName.endsWith('.js.map')) {
    rmSync(join(functionsDirectory, fileName));
  }
}

const deployableFunctions = readdirSync(functionsDirectory).filter(fileName => fileName.endsWith('.js'));
if (!deployableFunctions.includes('api.js')) {
  throw new Error('No se generó la Function api.js.');
}

console.log('Netlify Function preparada: api.js');
