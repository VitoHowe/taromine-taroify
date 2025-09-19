import { View } from '@tarojs/components'
import { ReactNode } from 'react'
import TabBar from './TabBar'

interface PageLayoutProps {
  children: ReactNode
  currentTab?: number
  showTabBar?: boolean
  className?: string
  contentClassName?: string
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  currentTab = 0,
  showTabBar = true,
  className = '',
  contentClassName = ''
}) => {
  return (
    <View className={`min-h-screen bg-gray-50 ${className}`}>
      {/* 主要内容区域 */}
      <View className={`${showTabBar ? 'pb-20' : ''} ${contentClassName}`}>
        {children}
      </View>
      
      {/* 底部导航栏 */}
      {showTabBar && (
        <TabBar current={currentTab} />
      )}
    </View>
  )
}

export default PageLayout
