import { View, Text, ScrollView } from '@tarojs/components'
import { ConfigProvider, Search, Swiper, Grid } from '@taroify/core'
import { HomeOutlined, BookmarkOutlined, GiftOutlined, UserOutlined } from '@taroify/icons'
import { useState } from 'react'
import PageLayout from '~/components/PageLayout'
import StudyCard from '~/components/StudyCard'
import ApiExample from '~/components/ApiExample'
import { useFetchBanners, useFetchRecommendedStudy } from '~/schema/home'

function Index() {
  const [searchValue, setSearchValue] = useState('')

  // 使用新的 API Hook 获取数据
  const { data: banners, loading: bannersLoading } = useFetchBanners()
  const { data: studyItems, loading: studyLoading } = useFetchRecommendedStudy(6)

  // 模拟数据（作为后备）
  const bannerData = [
    {
      id: 1,
      title: '新课程上线',
      description: 'React 高级开发技巧',
      image: '/images/banner1.jpg'
    },
    {
      id: 2,
      title: '学习计划',
      description: '制定你的专属学习路径',
      image: '/images/banner2.jpg'
    }
  ]

  const studyData = [
    {
      id: 1,
      title: 'React 基础入门',
      description: '从零开始学习 React，掌握组件化开发思想',
      progress: 65,
      type: 'course' as const
    },
    {
      id: 2,
      title: 'JavaScript 高级特性',
      description: '深入理解 ES6+ 语法，提升编程技能',
      progress: 30,
      type: 'course' as const
    },
    {
      id: 3,
      title: '前端面试题集',
      description: '精选前端面试题，助你求职成功',
      progress: 0,
      type: 'practice' as const
    },
    {
      id: 4,
      title: 'TypeScript 核心概念',
      description: '掌握 TypeScript 类型系统，提升代码质量',
      progress: 80,
      type: 'knowledge' as const
    }
  ]

  const quickActions = [
    {
      icon: <BookmarkOutlined size={24} />,
      title: '我的课程',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: <GiftOutlined size={24} />,
      title: '练习题库',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: <UserOutlined size={24} />,
      title: '学习成就',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: <HomeOutlined size={24} />,
      title: '学习计划',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <ConfigProvider>
      <PageLayout currentTab={0}>
        <ScrollView
          scrollY
          className="h-full"
          enableBackToTop
        >
          {/* 头部搜索 */}
          <View className="bg-white px-4 pt-4 pb-2">
            <View className="mb-4">
              <Text className="text-2xl font-bold text-gray-800">学习中心</Text>
              <Text className="text-sm text-gray-500 mt-1">开始你的学习之旅</Text>
            </View>
            <Search
              value={searchValue}
              placeholder="搜索课程、知识点..."
              onChange={(event) => setSearchValue(event.detail.value)}
              className="mb-4"
            />
          </View>

          {/* 轮播图 */}
          <View className="px-4 mb-6">
            <Swiper className="h-40 rounded-lg overflow-hidden">
              {bannerData.map((item) => (
                <Swiper.Item key={item.id}>
                  <View className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <View className="text-center text-white">
                      <Text className="text-lg font-semibold mb-2">{item.title}</Text>
                      <Text className="text-sm opacity-90">{item.description}</Text>
                    </View>
                  </View>
                </Swiper.Item>
              ))}
            </Swiper>
          </View>

          {/* 快捷功能 */}
          <View className="px-4 mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">快捷功能</Text>
            <Grid columns={4} gutter={16}>
              {quickActions.map((action, index) => (
                <Grid.Item key={index}>
                  <View className="flex flex-col items-center p-3">
                    <View className={`w-12 h-12 ${action.bgColor} rounded-full flex items-center justify-center mb-2`}>
                      <View className={action.color}>
                        {action.icon}
                      </View>
                    </View>
                    <Text className="text-xs text-gray-600 text-center">{action.title}</Text>
                  </View>
                </Grid.Item>
              ))}
            </Grid>
          </View>

          {/* 推荐学习 */}
          <View className="px-4 mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">推荐学习</Text>
            <View className="space-y-4">
              {studyData.map((item) => (
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

          {/* API 使用示例 */}
          <View className="bg-white rounded-xl shadow-sm mx-4 mb-4">
            <ApiExample />
          </View>

          {/* 底部间距，避免被TabBar遮挡 */}
          <View className="h-4" />
        </ScrollView>
      </PageLayout>
    </ConfigProvider>
  )
}

export default Index;
