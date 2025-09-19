import { View, Text, Image } from '@tarojs/components'
import { Button } from '@taroify/core'
import { ArrowRight } from '@taroify/icons'
import Taro from '@tarojs/taro'

interface StudyCardProps {
  title: string
  description: string
  progress?: number
  imageUrl?: string
  type: 'course' | 'practice' | 'knowledge'
  onPress?: () => void
  className?: string
}

const StudyCard: React.FC<StudyCardProps> = ({
  title,
  description,
  progress = 0,
  imageUrl,
  type,
  onPress,
  className = ''
}) => {
  const getTypeColor = () => {
    switch (type) {
      case 'course':
        return 'bg-blue-500'
      case 'practice':
        return 'bg-green-500'
      case 'knowledge':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getTypeText = () => {
    switch (type) {
      case 'course':
        return '课程'
      case 'practice':
        return '练习'
      case 'knowledge':
        return '知识点'
      default:
        return ''
    }
  }

  const handlePress = () => {
    if (onPress) {
      onPress()
    } else {
      // 默认跳转逻辑
      Taro.navigateTo({
        url: `/pages/study/detail?type=${type}&title=${encodeURIComponent(title)}`
      })
    }
  }

  return (
    <View
      className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden ${className}`}
      onClick={handlePress}
    >
      {/* 卡片头部 */}
      <View className="relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            className="w-full h-32 object-cover"
            mode="aspectFill"
          />
        ) : (
          <View className={`w-full h-32 ${getTypeColor()} flex items-center justify-center`}>
            <Text className="text-white text-lg font-semibold">
              {getTypeText()}
            </Text>
          </View>
        )}

        {/* 类型标签 */}
        <View className={`absolute top-2 left-2 ${getTypeColor()} px-2 py-1 rounded-full`}>
          <Text className="text-white text-xs font-medium">
            {getTypeText()}
          </Text>
        </View>
      </View>

      {/* 卡片内容 */}
      <View className="p-4">
        <View className="flex justify-between items-start mb-2">
          <Text className="text-lg font-semibold text-gray-800 flex-1 mr-2">
            {title}
          </Text>
          <ArrowRight className="text-gray-400" size={16} />
        </View>

        <Text className="text-sm text-gray-600 mb-3 leading-relaxed">
          {description}
        </Text>

        {/* 进度条 */}
        {progress > 0 && (
          <View className="mb-3">
            <View className="flex justify-between items-center mb-1">
              <Text className="text-xs text-gray-500">学习进度</Text>
              <Text className="text-xs text-gray-500">{progress}%</Text>
            </View>
            <View className="w-full bg-gray-200 rounded-full h-2">
              <View
                className={`${getTypeColor()} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${progress}%` }}
              />
            </View>
          </View>
        )}

        {/* 操作按钮 */}
        <Button
          size="small"
          color="primary"
          variant="outlined"
          className="w-full"
          onClick={handlePress}
        >
          {progress > 0 ? '继续学习' : '开始学习'}
        </Button>
      </View>
    </View>
  )
}

export default StudyCard
