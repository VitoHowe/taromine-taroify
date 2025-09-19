import { useDidHide, useDidShow } from '@tarojs/taro';
import type React from 'react';
import { useEffect } from 'react';

import { Provider as ReduxProvider } from 'react-redux';
import '@taroify/icons/index.scss'
import '@taroify/core/index.scss'
// 全局样式
import './app.scss'
import { store } from './store';

import { Client, Provider as UrqlProvider, cacheExchange, fetchExchange } from 'urql';

// dev.ts 中配置了 /graphql 代理，生产环境请改为线上 GraphQL 地址，以免出现跨域问题
const client = new Client({
  url: '/graphql',
  exchanges: [cacheExchange, fetchExchange],
});

function App(props: { children: React.ReactNode }) {
  // 可以使用所有的 React Hooks
  useEffect(() => { });

  // 对应 onShow
  // Taro useDidShow 回调函数会在小程序页面显示（进入前台）时执行。
  useDidShow(() => { });

  // 对应 onHide
  // Taro useDidHide 回调函数会在小程序页面隐藏（进入后台）时执行。
  useDidHide(() => { });

  return <ReduxProvider store={store}><UrqlProvider value={client}>{props.children}</UrqlProvider></ReduxProvider>;
}

export default App;
