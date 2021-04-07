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
  },
}
