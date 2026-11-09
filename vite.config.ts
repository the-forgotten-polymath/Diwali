import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  if (mode === 'demo') {
    return {
      root: 'demo',
      build: {
        outDir: '../demo-dist',
        emptyOutDir: true,
      },
    };
  }

  return {
    build: {
      outDir: 'dist',
      lib: {
        entry: {
          index: resolve(__dirname, 'src/index.ts'),
          'react/index': resolve(__dirname, 'src/react/index.ts'),
        },
        name: 'DiwaliAnimations',
        formats: ['es', 'cjs'],
        fileName: (format, entryName) => {
          const ext = format === 'es' ? 'js' : 'cjs';
          return `${entryName}.${ext}`;
        },
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        output: {
          exports: 'named',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      },
      sourcemap: true,
      minify: 'esbuild',
    },
  };
});
