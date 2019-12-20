module.exports = function(api) {
  api.cache.never()
  return {
    plugins: [
      '@loadable/babel-plugin',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-class-properties',
      '@babel/syntax-dynamic-import',
      '@babel/plugin-proposal-optional-chaining',
      ['@babel/plugin-transform-runtime', { corejs: 3 }],
    ],
    presets: [
      '@babel/preset-react',
      [
        '@babel/preset-env',
        {
          targets: {
            chrome: '63',
            firefox: '60',
            safari: '11',
          },
          useBuiltIns: 'usage',
          corejs: 3,
        },
      ],
      '@babel/preset-typescript',
    ],
    sourceType: 'unambiguous',
  }
}
