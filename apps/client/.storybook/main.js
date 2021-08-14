const rootMain = require('../../../.storybook/main')
const postcssOptions = require('../postcss.config')

module.exports = {
  ...rootMain,

  stories: [
    ...rootMain.stories,
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    ...rootMain.addons,
    '@nrwl/react/plugins/storybook',
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
          postcssOptions,
        },
      },
    },
  ],
  webpackFinal: async (config, { configType }) => {
    // apply any global webpack configs that might have been specified in .storybook/main.js
    if (rootMain.webpackFinal) {
      config = await rootMain.webpackFinal(config, { configType })
    }

    const svgRuleIndex = config.module.rules.findIndex((rule) => {
      const { test } = rule

      return test?.toString()?.startsWith('/\\.(svg|ico')
    })
    config.module.rules[svgRuleIndex].test =
      /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/

    config.module.rules.push(
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000, // 10kB
          name: '[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.svg$/,
        oneOf: [
          // If coming from JS/TS file, then transform into React component using SVGR.
          {
            issuer: {
              test: /\.[jt]sx?$/,
            },
            use: [
              {
                loader: require.resolve('@svgr/webpack'),
                options: {
                  svgo: false,
                  titleProp: true,
                  ref: true,
                },
              },
              {
                loader: require.resolve('url-loader'),
                options: {
                  limit: 10000, // 10kB
                  name: '[name].[hash:7].[ext]',
                  esModule: false,
                },
              },
            ],
          },
          // Fallback to plain URL loader.
          {
            use: [
              {
                loader: require.resolve('url-loader'),
                options: {
                  limit: 10000, // 10kB
                  name: '[name].[hash:7].[ext]',
                },
              },
            ],
          },
        ],
      }
    )

    return config
  },
}
