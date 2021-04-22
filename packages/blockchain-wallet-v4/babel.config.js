module.exports = {
  env: {
    test: {
      plugins: [
        '@babel/plugin-transform-runtime'
      ]
    }
  },
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread'
  ]
}
