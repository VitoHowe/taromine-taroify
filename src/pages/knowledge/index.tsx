import { View, Text, ScrollView } from '@tarojs/components'
import { ConfigProvider, Search, Tabs } from '@taroify/core'
import { useState } from 'react'
import PageLayout from '~/components/PageLayout'
import StudyCard from '~/components/StudyCard'

function Knowledge() {
  const [searchValue, setSearchValue] = useState('')
  const [activeTab, setActiveTab] = useState(0)

  const knowledgeData = [
    {
      id: 1,
      title: 'React Hooks 详解',
      description: '深入理解 useState, useEffect, useContext 等核心 Hooks',
      progress: 90,
      type: 'knowledge' as const
    },
    {
      id: 2,
      title: 'JavaScript 闭包',
      description: '理解闭包的概念、原理和实际应用场景',
      progress: 75,
      type: 'knowledge' as const
    },
    {
      id: 3,
      title: 'CSS Flexbox 布局',
      description: '掌握现代 CSS 布局技术，实现复杂页面结构',
      progress: 60,
      type: 'knowledge' as const
    },
    {
      id: 4,
      title: 'HTTP 协议基础',
      description: '了解 HTTP 请求响应机制，状态码含义',
      progress: 45,
      type: 'knowledge' as const
    }
  ]

  const categories = ['全部', '前端基础', 'React', 'JavaScript', 'CSS']

  return (
    <ConfigProvider>
      <PageLayout currentTab={1}>
        <ScrollView
          scrollY
          className="h-full"
          enableBackToTop
        >
          {/* 头部 */}
          <View className="bg-white px-4 pt-4 pb-2">
            <View className="mb-4">
              <Text className="text-2xl font-bold text-gray-800">知识点</Text>
              <Text className="text-sm text-gray-500 mt-1">系统化学习核心概念</Text>
            </View>
            <Search
              value={searchValue}
              placeholder="搜索知识点..."
              onChange={(event) => setSearchValue(event.detail.value)}
              className="mb-4"
            />
          </View>

          {/* 分类标签 */}
          <View className="bg-white px-4 pb-4">
            <Tabs value={activeTab} onChange={setActiveTab}>
              {categories.map((category, index) => (
                <Tabs.TabPane key={index} title={category} />
              ))}
            </Tabs>
          </View>

          {/* 知识点列表 */}
          <View className="px-4 pt-4">
            <View className="space-y-4">
              {knowledgeData.map((item) => (
                <StudyCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  progress={item.progress}
                  type={item.type}
                  className="mb-4"
                />
              ))}
            </View>
          </View>

          {/* 底部间距 */}
          <View className="h-4" />
        </ScrollView>
      </PageLayout>
    </ConfigProvider>
  )
}

export default Knowledge
