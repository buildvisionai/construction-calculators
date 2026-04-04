// Simple build script: copies ESM output and generates CJS wrapper
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

// The TSC already emitted ESM to dist/
// Generate a CJS entry that re-exports everything via require interop

const cjsContent = `'use strict';

const mod = require('./index.js');
module.exports = mod;
`;

// Write CJS wrapper
writeFileSync('dist/index.cjs', cjsContent);

console.log('Build complete: dist/index.js (ESM) + dist/index.cjs (CJS)');
