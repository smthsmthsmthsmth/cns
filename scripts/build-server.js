#!/usr/bin/env node

import { build } from 'esbuild';
import { copy } from 'fs-extra';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '..');

async function buildServer() {
  try {
    console.log('🔨 Building server...');
    
    // Build server with esbuild
    await build({
      entryPoints: [join(rootDir, 'server/index.ts')],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'esm',
      outdir: join(rootDir, 'dist'),
      external: [
        // Core Node.js modules
        'fs', 'path', 'url', 'http', 'https', 'crypto', 'stream', 'util', 'events', 'os', 'child_process',
        // Express and related
        'express', 'express-session', 'multer',
        // Database
        'mongoose',
        // Authentication
        'bcryptjs', 'jsonwebtoken', 'passport', 'passport-local',
        // Other dependencies
        'ws', 'zlib', 'memorystore', 'dotenv', 'zod',
        // Development dependencies that shouldn't be bundled
        '@babel/*', 'lightningcss', 'fsevents', 'esbuild', 'vite', 'tsx', 'typescript',
        // Vite and React related
        '@vitejs/plugin-react', 'react', 'react-dom', 'react-refresh',
        // Additional Vite internals
        'vite-plugin-react', 'vite-plugin-react-refresh', 'react-refresh/babel',
        // File system and path utilities
        'fs-extra', 'node:fs', 'node:path', 'node:module', 'node:url'
      ],
      sourcemap: false,
      minify: true,
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      // Ignore warnings about missing packages
      logLevel: 'error'
    });

    console.log('✅ Server built successfully!');
    
    // Copy package.json to dist for production dependencies
    await copy(
      join(rootDir, 'package.json'),
      join(rootDir, 'dist/package.json')
    );
    
    console.log('✅ Package.json copied to dist/');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildServer();
