import { View, Text, ScrollView } from '@tarojs/components'
import { ConfigProvider, Cell, Avatar, Button, Divider } from '@taroify/core'
import {
  UserOutlined,
  HomeOutlined,
  GiftOutlined,
  BookmarkOutlined,
  ArrowRight
} from '@taroify/icons'
import PageLayout from '~/components/PageLayout'

function Profile() {
  const userInfo = {
    nickname: '学习者',
    avatar: '',
    level: 5,
    points: 2580,
    studyDays: 45,
    completedCourses: 12
  }

  const menuItems = [
    {
      icon: <BookmarkOutlined size={20} />,
      title: '我的课程',
      desc: '查看学习进度',
      color: 'text-blue-500'
    },
    {
      icon: <UserOutlined size={20} />,
      title: '学习成就',
      desc: '查看获得的徽章',
      color: 'text-yellow-500'
    },
    {
      icon: <HomeOutlined size={20} />,
      title: '学习计划',
      desc: '制定学习目标',
      color: 'text-green-500'
    },
    {
      icon: <GiftOutlined size={20} />,
      title: '我的收藏',
      desc: '收藏的内容',
      color: 'text-red-500'
    },
    {
      icon: <UserOutlined size={20} />,
      title: '设置',
      desc: '账号与隐私设置',
      color: 'text-gray-500'
    }
  ]

  return (
    <ConfigProvider>
      <PageLayout currentTab={3}>
        <ScrollView
          scrollY
          className="h-full bg-gray-50"
          enableBackToTop
        >
          {/* 用户信息卡片 */}
          <View className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 pt-8 pb-6 text-white">
            <View className="flex items-center mb-4">
              <Avatar
                size="large"
                src={userInfo.avatar}
                className="mr-4 bg-white text-blue-500"
              >
                <UserOutlined size={24} />
              </Avatar>
              <View className="flex-1">
                <Text className="text-xl font-semibold text-white mb-1">
                  {userInfo.nickname}
                </Text>
                <Text className="text-sm opacity-90 text-white">
                  Lv.{userInfo.level} · {userInfo.points} 学习积分
                </Text>
              </View>
              <Button
                size="small"
                variant="outlined"
                className="border-white text-white"
              >
                编辑资料
              </Button>
            </View>

            {/* 学习统计 */}
            <View className="flex justify-between mt-6">
              <View className="text-center">
                <Text className="text-2xl font-bold text-white">{userInfo.studyDays}</Text>
                <Text className="text-xs opacity-90 text-white">学习天数</Text>
              </View>
              <View className="text-center">
                <Text className="text-2xl font-bold text-white">{userInfo.completedCourses}</Text>
                <Text className="text-xs opacity-90 text-white">完成课程</Text>
              </View>
              <View className="text-center">
                <Text className="text-2xl font-bold text-white">{userInfo.points}</Text>
                <Text className="text-xs opacity-90 text-white">学习积分</Text>
              </View>
            </View>
          </View>

          {/* 快捷功能 */}
          <View className="bg-white mx-4 mt-4 rounded-lg overflow-hidden">
            {menuItems.map((item, index) => (
              <View key={index}>
                <Cell
                  title={item.title}
                  brief={item.desc}
                  icon={
                    <View className={`${item.color} mr-3`}>
                      {item.icon}
                    </View>
                  }
                  rightIcon={<ArrowRight size={16} />}
                  clickable
                  onClick={() => {
                    // 处理点击事件
                    console.log(`点击了${item.title}`)
                  }}
                />
                {index < menuItems.length - 1 && <Divider />}
              </View>
            ))}
          </View>

          {/* 学习记录 */}
          <View className="mx-4 mt-4 bg-white rounded-lg p-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3">最近学习</Text>
            <View className="space-y-3">
              <View className="flex items-center justify-between py-2">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-800">React 基础入门</Text>
                  <Text className="text-xs text-gray-500 mt-1">2小时前</Text>
                </View>
                <Text className="text-xs text-blue-500">继续学习</Text>
              </View>
              <Divider />
              <View className="flex items-center justify-between py-2">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-800">JavaScript 高级特性</Text>
                  <Text className="text-xs text-gray-500 mt-1">昨天</Text>
                </View>
                <Text className="text-xs text-blue-500">继续学习</Text>
              </View>
            </View>
          </View>

          {/* 底部间距 */}
          <View className="h-4" />
        </ScrollView>
      </PageLayout>
    </ConfigProvider>
  )
}

export default Profile
