import type { UserConfigExport } from '@tarojs/cli';

export default {
  logger: {
    quiet: false,
    stats: true,
  },
  mini: {},
  h5: {
    devServer: {
      proxy: {
        // GraphQL 代理（保留以防需要）
        '/graphql': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
        // REST API 代理
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
          pathRewrite: {
            '^/api': '/api', // 可根据后端路由调整
          },
        },
      },
    },
  },
} satisfies UserConfigExport<'webpack5'>;
