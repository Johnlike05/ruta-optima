const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');
const { resolve } = require('path');


/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {}, // Evita que Jest intente transformar ESM
  extensionsToTreatAsEsm: [],
  moduleNameMapper: {
    // Mapea los alias de TypeScript para que Jest los entienda
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    '^ioredis$': resolve(__dirname, './test/ioredis.mock.ts'),
    // Ignorar dependencias ESM para Jest
    '^(cliui|string-width|strip-ansi|wrap-ansi)$': '<rootDir>/node_modules/cliui',
  },
  
};
