import { useDidHide, useDidShow } from '@tarojs/taro';
import type React from 'react';
import { useEffect } from 'react';

import { Provider as ReduxProvider } from 'react-redux';
import '@taroify/icons/index.scss'
import '@taroify/core/index.scss'
// 全局样式
import './app.scss'
import { store } from './store';
import { wxAuth } from './services/auth';
import { isWeapp, getEnvInfo } from './utils/env';

function App(props: { children: React.ReactNode }) {
  // 应用初始化
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 显示环境信息
        const envInfo = getEnvInfo()
        console.log('🚀 [App] 应用启动，环境信息:', envInfo)

        // 只在微信小程序环境下进行登录检查
        if (isWeapp()) {
          console.log('🔐 [App] 微信小程序环境，开始登录检查...')

          // 检查本地是否有登录信息
          const isLoggedIn = wxAuth.isLoggedIn()

          if (isLoggedIn) {
            // 检查 session 是否有效
            const isSessionValid = await wxAuth.checkSession()

            if (!isSessionValid) {
              console.log('🔄 [App] Session 已过期，尝试重新登录...')
              // Session 过期，尝试静默登录
              try {
                await wxAuth.login()
                console.log('✅ [App] 静默登录成功')
              } catch (error) {
                console.log('❌ [App] 静默登录失败:', error)
              }
            } else {
              console.log('✅ [App] 用户已登录，session 有效')
            }
          } else {
            console.log('ℹ️ [App] 用户未登录，等待用户操作')
            // 可以选择在这里进行静默登录
            // try {
            //   await wxAuth.login()
            //   console.log('✅ [App] 自动登录成功')
            // } catch (error) {
            //   console.log('❌ [App] 自动登录失败:', error)
            // }
          }
        } else {
          console.log('ℹ️ [App] 非微信小程序环境，跳过登录检查')
        }
      } catch (error) {
        console.error('❌ [App] 应用初始化失败:', error)
      }
    }

    initializeApp()
  }, []);

  // 对应 onShow
  // Taro useDidShow 回调函数会在小程序页面显示（进入前台）时执行。
  useDidShow(() => {
    console.log('应用进入前台')
    // 应用进入前台时，可以检查登录状态是否仍然有效
    // 这里可以添加 session 检查逻辑
  });

  // 对应 onHide
  // Taro useDidHide 回调函数会在小程序页面隐藏（进入后台）时执行。
  useDidHide(() => {
    console.log('应用进入后台')
  });

  return <ReduxProvider store={store}>{props.children}</ReduxProvider>;
}

export default App;
