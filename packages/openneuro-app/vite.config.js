import builtins from 'rollup-plugin-polyfill-node'

const builtinsPlugin = {
  ...builtins({ crypto: true }),
  name: 'rollup-plugin-polyfill-node',
}

export default {
  root: 'src',
  server: {
    port: 9876,
  },
  optimizeDeps: {
    include: [
      '@apollo/client/react/components',
      '@apollo/client/link/schema',
      '@apollo/client/link/context',
      '@apollo/client/link/ws',
      '@apollo/client/utilities',
    ],
  },
  rollupInputOptions: {
    preserveEntrySignatures: 'strict',
    plugins: [
      builtinsPlugin,
    ]
  }
}
