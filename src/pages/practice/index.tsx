import { View, Text, ScrollView } from '@tarojs/components'
import { ConfigProvider, Search, Button, Progress } from '@taroify/core'
import { UserOutlined, HomeOutlined, GiftOutlined } from '@taroify/icons'
import { useState } from 'react'
import PageLayout from '~/components/PageLayout'
import StudyCard from '~/components/StudyCard'

function Practice() {
  const [searchValue, setSearchValue] = useState('')

  const practiceData = [
    {
      id: 1,
      title: 'JavaScript 基础练习',
      description: '包含变量、函数、对象等基础概念练习题',
      progress: 80,
      type: 'practice' as const
    },
    {
      id: 2,
      title: 'React 组件开发',
      description: '实战练习：开发可复用的 React 组件',
      progress: 45,
      type: 'practice' as const
    },
    {
      id: 3,
      title: '算法与数据结构',
      description: '经典算法题目，提升编程思维能力',
      progress: 20,
      type: 'practice' as const
    },
    {
      id: 4,
      title: 'CSS 布局挑战',
      description: '各种复杂布局的实现练习',
      progress: 0,
      type: 'practice' as const
    }
  ]

  const stats = {
    totalExercises: 156,
    completedExercises: 89,
    studyTime: 24,
    ranking: 15
  }

  return (
    <ConfigProvider>
      <PageLayout currentTab={2}>
        <ScrollView
          scrollY
          className="h-full"
          enableBackToTop
        >
          {/* 头部 */}
          <View className="bg-white px-4 pt-4 pb-2">
            <View className="mb-4">
              <Text className="text-2xl font-bold text-gray-800">练习中心</Text>
              <Text className="text-sm text-gray-500 mt-1">通过实践巩固知识</Text>
            </View>
            <Search
              value={searchValue}
              placeholder="搜索练习题..."
              onChange={(event) => setSearchValue(event.detail.value)}
              className="mb-4"
            />
          </View>

          {/* 学习统计 */}
          <View className="mx-4 mb-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-4 text-white">
            <Text className="text-lg font-semibold mb-3 text-white">学习统计</Text>
            <View className="flex justify-between">
              <View className="flex-1 text-center">
                <View className="flex items-center justify-center mb-1">
                  <GiftOutlined size={20} className="text-white" />
                </View>
                <Text className="text-2xl font-bold text-white">{stats.completedExercises}</Text>
                <Text className="text-xs opacity-90 text-white">已完成</Text>
              </View>
              <View className="flex-1 text-center">
                <View className="flex items-center justify-center mb-1">
                  <HomeOutlined size={20} className="text-white" />
                </View>
                <Text className="text-2xl font-bold text-white">{stats.studyTime}h</Text>
                <Text className="text-xs opacity-90 text-white">学习时长</Text>
              </View>
              <View className="flex-1 text-center">
                <View className="flex items-center justify-center mb-1">
                  <UserOutlined size={20} className="text-white" />
                </View>
                <Text className="text-2xl font-bold text-white">#{stats.ranking}</Text>
                <Text className="text-xs opacity-90 text-white">排名</Text>
              </View>
            </View>

            {/* 完成进度 */}
            <View className="mt-4">
              <View className="flex justify-between items-center mb-2">
                <Text className="text-sm text-white">总体进度</Text>
                <Text className="text-sm text-white">
                  {stats.completedExercises}/{stats.totalExercises}
                </Text>
              </View>
              <Progress
                percent={(stats.completedExercises / stats.totalExercises) * 100}
                strokeWidth={6}
                color="#ffffff"
                trackColor="rgba(255,255,255,0.3)"
              />
            </View>
          </View>

          {/* 快速开始 */}
          <View className="px-4 mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">快速开始</Text>
            <View className="flex gap-3">
              <Button
                color="primary"
                className="flex-1"
                onClick={() => {/* 跳转到随机练习 */}}
              >
                随机练习
              </Button>
              <Button
                variant="outlined"
                className="flex-1"
                onClick={() => {/* 跳转到错题本 */}}
              >
                错题回顾
              </Button>
            </View>
          </View>

          {/* 练习列表 */}
          <View className="px-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3">练习专题</Text>
            <View className="space-y-4">
              {practiceData.map((item) => (
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

export default Practice
