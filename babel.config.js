module.exports = function(api) {
  api.cache.never()
  return {
    plugins: [
      'loadable-components/babel',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/syntax-dynamic-import',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-transform-runtime',
    ],
    presets: [
      '@babel/preset-react',
      [
        '@babel/preset-env',
        {
          targets: {
            chrome: '41',
            firefox: '50',
            edge: '41',
          },
        },
      ],
    ],
    sourceType: 'unambiguous',
  }
}
