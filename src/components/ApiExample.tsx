import { View, Text, Button } from '@tarojs/components'
import { useState } from 'react'
import { useFetchTabList, useFetchRecommendedStudy } from '~/schema/home'
import api from '~/services/api'

/**
 * API 使用示例组件
 * 演示如何使用新的 axios 服务替代 urql
 */
export default function ApiExample() {
  const [manualData, setManualData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // 使用自定义 Hook 获取数据（推荐方式）
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useFetchTabList()
  const { data: studyItems, loading: studyLoading, error: studyError } = useFetchRecommendedStudy(5)

  // 手动调用 API（适用于按钮点击等场景）
  const handleManualFetch = async () => {
    try {
      setLoading(true)
      const response = await api.knowledge.getKnowledgePoints()
      setManualData(response.data)
    } catch (error) {
      console.error('手动获取数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="p-4">
      <Text className="text-lg font-bold mb-4">API 使用示例</Text>

      {/* 使用 Hook 的示例 */}
      <View className="mb-6">
        <Text className="font-semibold mb-2">分类列表 (使用 Hook):</Text>
        {categoriesLoading ? (
          <Text>加载中...</Text>
        ) : categoriesError ? (
          <Text className="text-red-500">错误: {categoriesError}</Text>
        ) : (
          <View>
            {categories.map((category) => (
              <View key={category.id} className="mb-2 p-2 bg-gray-100 rounded">
                <Text>{category.name}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* 推荐学习内容示例 */}
      <View className="mb-6">
        <Text className="font-semibold mb-2">推荐学习内容:</Text>
        {studyLoading ? (
          <Text>加载中...</Text>
        ) : studyError ? (
          <Text className="text-red-500">错误: {studyError}</Text>
        ) : (
          <View>
            {studyItems.length > 0 ? (
              studyItems.map((item: any) => (
                <View key={item.id} className="mb-2 p-2 bg-blue-50 rounded">
                  <Text>{item.title}</Text>
                </View>
              ))
            ) : (
              <Text className="text-gray-500">暂无推荐内容</Text>
            )}
          </View>
        )}
      </View>

      {/* 手动调用 API 示例 */}
      <View className="mb-6">
        <Text className="font-semibold mb-2">手动调用 API:</Text>
        <Button
          onClick={handleManualFetch}
          disabled={loading}
          className="mb-2"
        >
          {loading ? '加载中...' : '获取知识点'}
        </Button>
        {manualData && (
          <View className="mt-2">
            <Text className="text-sm text-gray-600">
              获取到 {manualData.length} 个知识点
            </Text>
          </View>
        )}
      </View>

      {/* 使用说明 */}
      <View className="bg-yellow-50 p-3 rounded">
        <Text className="font-semibold text-yellow-800 mb-2">使用说明:</Text>
        <Text className="text-sm text-yellow-700">
          1. 使用自定义 Hook (如 useFetchTabList) 进行数据获取{'\n'}
          2. 直接调用 api.xxx.xxx() 方法进行手动请求{'\n'}
          3. 所有请求都会自动处理加载状态和错误处理{'\n'}
          4. 支持上传文件、设置请求头等高级功能
        </Text>
      </View>
    </View>
  )
}
