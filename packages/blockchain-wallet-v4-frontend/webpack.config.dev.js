/* eslint-disable */
const chalk = require('chalk')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackStringReplacePlugin = require('html-webpack-string-replace-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin')
const Webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const PATHS = require('../../config/paths')
const mockWalletOptions = require('../../config/mocks/wallet-options-v4.json')

const cspNonce = `2726c7f26c`
let envConfig = {}
let manifestCacheBust = new Date().getTime()
let sslEnabled = process.env.DISABLE_SSL
  ? false
  : fs.existsSync(PATHS.sslConfig + '/key.pem') &&
    fs.existsSync(PATHS.sslConfig + '/cert.pem')
let localhostUrl = sslEnabled
  ? 'https://localhost:8080'
  : 'http://localhost:8080'

try {
  envConfig = require(PATHS.envConfig + `/${process.env.NODE_ENV}` + '.js')
} catch (e) {
  console.log(
    chalk.red('\u{1F6A8} WARNING \u{1F6A8} ') +
      chalk.yellow(
        `Failed to load ${process.env.NODE_ENV}.js config file! Using the production config instead.\n`
      )
  )
  envConfig = require(PATHS.envConfig + '/production.js')
} finally {
  console.log(chalk.blue('\u{1F6A7} CONFIGURATION \u{1F6A7}'))
  console.log(chalk.cyan('Root URL') + `: ${envConfig.ROOT_URL}`)
  console.log(chalk.cyan('API Domain') + `: ${envConfig.API_DOMAIN}`)
  console.log(
    chalk.cyan('Wallet Helper Domain') +
      ': ' +
      chalk.blue(envConfig.WALLET_HELPER_DOMAIN)
  )
  console.log(
    chalk.cyan('Web Socket URL') + ': ' + chalk.blue(envConfig.WEB_SOCKET_URL)
  )
  console.log(chalk.cyan('SSL Enabled: ') + chalk.blue(sslEnabled))
}

module.exports = {
  mode: 'development',
  node: {
    fs: 'empty'
  },
  entry: {
    app: ['@babel/polyfill', PATHS.src + '/index.js']
  },
  output: {
    pathinfo: false,
    path: PATHS.appBuild,
    chunkFilename: '[name].[chunkhash:10].js',
    publicPath: '/',
    crossOriginLoading: 'anonymous'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      components: path.resolve(__dirname, 'src/components/'),
      data: path.resolve(__dirname, 'src/data/index.ts'),
      layouts: path.resolve(__dirname, 'src/layouts/'),
      providers: path.resolve(__dirname, 'src/providers/'),
      services: path.resolve(__dirname, 'src/services/'),
      utils: path.resolve(__dirname, 'src/utils/')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /src|blockchain-info-components.src|blockchain-wallet-v4.src/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 8, // number of cores on intel i5
              workerParallelJobs: 32,
              workerNodeArgs: ['--max-old-space-size=2048'],
              poolRespawn: false,
              poolParallelJobs: 32
            }
          },
          'babel-loader'
        ]
      },
      { test: /\.tsx?$/, loader: 'ts-loader' },
      {
        test: /\.(eot|ttf|otf|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name]-[hash].[ext]'
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg|ico|webmanifest|xml)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]'
          }
        }
      },
      {
        test: /\.(pdf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'resources/[name]-[hash].[ext]'
          }
        }
      },
      {
        test: /\.(AppImage|dmg|exe)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'resources/[name].[ext]'
          }
        }
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
      }
    ]
  },
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new CaseSensitivePathsPlugin(),
    // new UnusedFilesWebpackPlugin({
    //   globOptions: {
    //     cwd: PATHS.src,
    //     ignore: [
    //       `**/__mocks__/**`,
    //       `**/*.spec.*`,
    //       `index.prod.js`,
    //       `utils/**`,
    //       'scenes/Lockbox/Dashboard/Settings/UpdateDevice/index.js',
    //       'scenes/Lockbox/Dashboard/Settings/UpdateDevice/template.js',
    //       'assets/locales/defaultMessages.json',
    //       'assets/locales/whitelists/whitelist_en.json'
    //     ]
    //   }
    // }),
    new Webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(require(PATHS.pkgJson).version),
      NETWORK_TYPE: JSON.stringify(envConfig.NETWORK_TYPE)
    }),
    new HtmlWebpackPlugin({
      template: PATHS.src + '/index.html',
      filename: 'index.html'
    }),
    new HtmlWebpackStringReplacePlugin({
      '\\*\\*CSP_NONCE\\*\\*': cspNonce
    }),
    new Webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }),
    new Webpack.HotModuleReplacementPlugin()
  ],
  optimization: {
    namedModules: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          warnings: false,
          compress: {
            warnings: false,
            keep_fnames: true
          },
          mangle: {
            keep_fnames: true
          }
        },
        parallel: true,
        cache: true
      })
    ],
    concatenateModules: false,
    runtimeChunk: {
      name: `manifest.${manifestCacheBust}`
    },
    splitChunks: {
      cacheGroups: {
        default: {
          chunks: 'initial',
          name: 'app',
          priority: -20,
          reuseExistingChunk: true
        },
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          priority: -10,
          test: /[\\/]node_modules[\\/]/
        },
        frontend: {
          chunks: 'initial',
          name: 'frontend',
          priority: -11,
          reuseExistingChunk: true,
          test: function(module) {
            return (
              module.resource &&
              module.resource.indexOf('blockchain-wallet-v4-frontend/src') ===
                -1
            )
          }
        }
      }
    }
  },
  devServer: {
    cert: sslEnabled
      ? fs.readFileSync(PATHS.sslConfig + '/cert.pem', 'utf8')
      : '',
    contentBase: PATHS.src,
    disableHostCheck: true,
    host: 'localhost',
    https: sslEnabled,
    key: sslEnabled
      ? fs.readFileSync(PATHS.sslConfig + '/key.pem', 'utf8')
      : '',
    port: 8080,
    hot: true,
    historyApiFallback: true,
    before(app) {
      app.get('/Resources/wallet-options-v4.json', function(req, res) {
        // combine wallet options base with custom environment config
        mockWalletOptions.domains = {
          api: envConfig.API_DOMAIN,
          bitpay: envConfig.BITPAY_URL,
          coinify: envConfig.COINIFY_URL,
          coinifyPaymentDomain: envConfig.COINIFY_PAYMENT_DOMAIN,
          comRoot: envConfig.COM_ROOT,
          comWalletApp: envConfig.COM_WALLET_APP,
          exchange: envConfig.EXCHANGE_URL,
          horizon: envConfig.HORIZON_URL,
          ledger: localhostUrl + '/ledger', // will trigger reverse proxy
          ledgerSocket: envConfig.LEDGER_SOCKET_URL,
          root: envConfig.ROOT_URL,
          veriff: envConfig.VERIFF_URL,
          walletHelper: envConfig.WALLET_HELPER_DOMAIN,
          webSocket: envConfig.WEB_SOCKET_URL
        }

        if (process.env.NODE_ENV === 'testnet') {
          mockWalletOptions.platforms.web.coins.BTC.config.network = 'testnet'
          mockWalletOptions.platforms.web.coinify.config.partnerId = 35
          mockWalletOptions.platforms.web.sfox.config.apiKey =
            '6fbfb80536564af8bbedb7e3be4ec439'
        }

        res.json(mockWalletOptions)
      })

      // TODO: DEPRECATE
      // This is to locally test transferring cookies from transfer_stored_values.html
      app.get('/Resources/transfer_stored_values.html', function(req, res) {
        res.sendFile(
          path.join(
            __dirname,
            '/../../config/mocks/transfer_stored_values.html'
          )
        )
      })

      app.get('/Resources/wallet-options.json', function(req, res) {
        mockWalletOptions.domains = { comWalletApp: localhostUrl }
        res.json(mockWalletOptions)
      })
    },
    proxy: {
      '/ledger': {
        target: envConfig.LEDGER_URL,
        secure: false,
        changeOrigin: true,
        pathRewrite: { '^/ledger': '' }
      }
    },
    overlay: {
      warnings: true,
      errors: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Security-Policy': [
        "img-src 'self' data: blob:",
        `script-src 'nonce-${cspNonce}' 'self' 'unsafe-eval'`,
        "style-src 'self' 'unsafe-inline'",
        `frame-src ${envConfig.COINIFY_PAYMENT_DOMAIN} ${envConfig.WALLET_HELPER_DOMAIN} ${envConfig.ROOT_URL} https://magic.veriff.me https://localhost:8080`,
        `child-src ${envConfig.COINIFY_PAYMENT_DOMAIN} ${envConfig.WALLET_HELPER_DOMAIN} blob:`,
        [
          'connect-src',
          "'self'",
          'ws://localhost:8080',
          'wss://localhost:8080',
          'wss://api.ledgerwallet.com',
          'wss://ws.testnet.blockchain.info/inv',
          envConfig.WEB_SOCKET_URL,
          envConfig.ROOT_URL,
          envConfig.API_DOMAIN,
          envConfig.WALLET_HELPER_DOMAIN,
          envConfig.LEDGER_URL,
          envConfig.LEDGER_SOCKET_URL,
          envConfig.HORIZON_URL,
          envConfig.VERIFF_URL,
          'https://friendbot.stellar.org',
          'https://app-api.coinify.com',
          'https://app-api.sandbox.coinify.com',
          'https://api.sfox.com',
          'https://api.staging.sfox.com',
          'https://quotes.sfox.com',
          `https://quotes.staging.sfox.com`,
          'https://sfox-kyc.s3.amazonaws.com',
          'https://sfox-kyctest.s3.amazonaws.com',
          'https://testnet5.blockchain.info',
          'https://api.testnet.blockchain.info',
          'https://shapeshift.io',
          'https://bitpay.com'
        ].join(' '),
        "object-src 'none'",
        "media-src 'self' https://storage.googleapis.com/bc_public_assets/ data: mediastream: blob:",
        "font-src 'self'"
      ].join('; ')
    }
  }
}
