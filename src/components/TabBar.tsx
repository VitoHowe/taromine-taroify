import { Tabbar } from '@taroify/core'
import {
  HomeOutlined,
  BookmarkOutlined,
  GiftOutlined,
  UserOutlined
} from '@taroify/icons'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'

interface TabBarProps {
  current?: number
  onChange?: (index: number) => void
}

const TabBar: React.FC<TabBarProps> = ({ current = 0, onChange }) => {
  const [activeTab, setActiveTab] = useState(current)

  useEffect(() => {
    setActiveTab(current)
  }, [current])

  const getTabItems = () => [
    {
      icon: <HomeOutlined className={activeTab === 0 ? 'text-blue-600' : 'text-gray-600'} />,
      text: '首页',
      url: '/pages/index/index'
    },
    {
      icon: <BookmarkOutlined className={activeTab === 1 ? 'text-blue-600' : 'text-gray-600'} />,
      text: '知识点',
      url: '/pages/knowledge/index'
    },
    {
      icon: <GiftOutlined className={activeTab === 2 ? 'text-blue-600' : 'text-gray-600'} />,
      text: '练习',
      url: '/pages/practice/index'
    },
    {
      icon: <UserOutlined className={activeTab === 3 ? 'text-blue-600' : 'text-gray-600'} />,
      text: '我的',
      url: '/pages/profile/index'
    }
  ]

  const tabItems = getTabItems()

  const handleTabChange = (index: number) => {
    if (index === activeTab) return

    setActiveTab(index)
    onChange?.(index)

    // 页面跳转
    const targetTab = tabItems[index]
    if (targetTab) {
      console.log('准备跳转到:', targetTab.url)
      // 使用 redirectTo 避免页面栈积累
      Taro.redirectTo({
        url: targetTab.url
      }).catch((err) => {
        console.error('页面跳转失败:', err)
      })
    }
  }

  return (
    <Tabbar
      value={activeTab}
      onChange={handleTabChange}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg"
      fixed
    >
      {tabItems.map((item, index) => (
        <Tabbar.TabItem
          key={index}
          icon={item.icon}
          value={index}
          className={`transition-all duration-200 ${
            activeTab === index
              ? 'text-blue-600 font-semibold'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {item.text}
        </Tabbar.TabItem>
      ))}
    </Tabbar>
  )
}

export default TabBar
