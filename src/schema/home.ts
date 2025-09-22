import { useEffect, useState } from 'react'
import api, { Category, Goods } from '~/services/api'

/**
 * 获取分类标签列表
 */
export function useFetchTabList() {
  const [data, setData] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await api.category.getCategories(8)
        setData(response.data || [])
        setError(null)
      } catch (err: any) {
        setError(err.message || '获取分类列表失败')
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

/**
 * 获取新商品列表
 */
export function useFetchNewGoodsList(limit: number = 10, offset: number = 0) {
  const [data, setData] = useState<Goods[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await api.goods.getNewGoods(limit, offset)
        setData(response.data || [])
        setError(null)
      } catch (err: any) {
        setError(err.message || '获取新商品列表失败')
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [limit, offset])

  return { data, loading, error }
}

/**
 * 获取学习内容推荐
 */
export function useFetchRecommendedStudy(limit: number = 10) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await api.study.getRecommendedStudy(limit)
        setData(response.data || [])
        setError(null)
      } catch (err: any) {
        setError(err.message || '获取推荐学习内容失败')
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [limit])

  return { data, loading, error }
}

/**
 * 获取轮播图数据
 */
export function useFetchBanners() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await api.study.getBanners()
        setData(response.data || [])
        setError(null)
      } catch (err: any) {
        setError(err.message || '获取轮播图失败')
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

// 兼容旧的函数名称
export const fetchTabList = useFetchTabList
export const fetchNewGoodsList = useFetchNewGoodsList
