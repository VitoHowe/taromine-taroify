import { defineConfig, type UserConfigExport } from '@tarojs/cli';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { UnifiedWebpackPluginV5 } from 'weapp-tailwindcss/webpack';

import devConfig from './dev';
import prodConfig from './prod';

// https://tw.icebreaker.top/docs/multi-platform
const isH5 = process.env.TARO_ENV === 'h5';
const isApp = process.env.TARO_ENV === 'rn';
const isWeapp = process.env.TARO_ENV === 'weapp';
const WeappTailwindcssDisabled = isH5 || isApp;

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<'webpack5'>(async (merge, { command, mode }) => {
  const baseConfig: UserConfigExport<'webpack5'> = {
    projectName: 'myApp',
    date: '2025-2-23',
    plugins: ['@tarojs/plugin-html','@tarojs/plugin-http'],
    designWidth: 750,

    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    defineConstants: {
      ENABLE_INNER_HTML: 'true',
      ENABLE_ADJACENT_HTML: 'true',
      ENABLE_SIZE_APIS: 'true',
      ENABLE_TEMPLATE_CONTENT: 'true',
      ENABLE_CLONE_NODE: 'true',
      ENABLE_CONTAINS: 'true',
      ENABLE_MUTATION_OBSERVER: 'true',
    },
    copy: {
      patterns: [],
      options: {},
    },
    framework: 'react',
    // https://docs.taro.zone/blog/2022/05/19/Taro-3.5-beta#1-webpack5
    compiler: {
      type: 'webpack5',
      prebundle: {
        enable: true
      }
    },
    cache: {
      enable: true,
      // Webpack 持久化缓存配置，建议开启
      buildDependencies: {
        config: [__filename]
      }
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[fullhash:base64:5]',
          },
        },
      },
      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin);

        // 基础插件配置
        chain.merge({
          plugin: {
            install: {
              plugin: UnifiedWebpackPluginV5,
              args: [
                {
                  disabled: WeappTailwindcssDisabled,
                  rem2rpx: true,
                  injectAdditionalCssVarScope: true,
                },
              ],
            },
          },
        });

        // 只在微信小程序环境下设置 chunkLoadingGlobal
        if (isWeapp) {
          chain.output.set('chunkLoadingGlobal', 'webpackJsonp');
          console.log('🔧 [Webpack] 微信小程序环境：已设置 chunkLoadingGlobal = webpackJsonp');
        }

        // 针对不同环境的优化配置
        if (isWeapp) {
          // 微信小程序环境的特殊配置
          chain.optimization.splitChunks({
            chunks: 'all',
            cacheGroups: {
              common: {
                name: 'common',
                minChunks: 2,
                priority: 1,
                enforce: true,
                reuseExistingChunk: true,
              },
              vendors: {
                name: 'vendors',
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
                enforce: true,
                reuseExistingChunk: true,
              },
            },
          });
        }
      },
    },
    h5: {
      esnextModules: ['@taroify'],
      publicPath: '/',
      staticDirectory: 'static',
      output: {
        filename: 'js/[name].[fullhash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].js',
      },
      miniCssExtractPluginOption: {
        filename: 'css/[name].[fullhash].css',
        chunkFilename: 'css/[name].[chunkhash].css',
        ignoreOrder: true,
      },
      postcss: {
        autoprefixer: {
          enable: false,
          config: {},
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[fullhash:base64:5]',
          },
        },
      },
      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin);
      },
      devServer: {
        hot: false,
      },
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        },
      },
    },
  };

  process.env.BROWSERSLIST_ENV = process.env.NODE_ENV;

  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig);
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig);
});
