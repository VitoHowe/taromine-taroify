import { http } from './http'

// 数据类型定义
export interface Category {
  id: string
  name: string
  iconUrl: string
}

export interface Goods {
  id: string
  goodsSn: string
  name: string
  categoryId: string
  gallery: string[]
  keywords: string
  brief: string
  picUrl: string
  shareUrl: string
  isNew: boolean
  isHot: boolean
  unit: string
  counterPrice: number
  retailPrice: number
  detail: string
}

// 学习相关的数据类型
export interface StudyItem {
  id: string
  title: string
  description: string
  progress: number
  imageUrl: string
  type: 'video' | 'article' | 'quiz'
}

export interface KnowledgePoint {
  id: string
  title: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  description: string
  estimatedTime: number // 预计学习时间（分钟）
}

export interface PracticeItem {
  id: string
  title: string
  type: 'quiz' | 'exercise' | 'project'
  difficulty: string
  score?: number
  completed: boolean
}

/**
 * 分类相关 API
 */
export const categoryApi = {
  // 获取分类列表
  getCategories: (limit: number = 8) => {
    return http.get<Category[]>('/categories', {
      params: { limit, level: 'L1' }
    })
  },
}

/**
 * 商品相关 API
 */
export const goodsApi = {
  // 获取新商品列表
  getNewGoods: (limit: number = 10, offset: number = 0) => {
    return http.get<Goods[]>('/goods/new', {
      params: { limit, offset }
    })
  },

  // 获取热门商品
  getHotGoods: (limit: number = 10) => {
    return http.get<Goods[]>('/goods/hot', {
      params: { limit }
    })
  },

  // 根据分类获取商品
  getGoodsByCategory: (categoryId: string, limit: number = 10, offset: number = 0) => {
    return http.get<Goods[]>(`/goods/category/${categoryId}`, {
      params: { limit, offset }
    })
  },

  // 获取商品详情
  getGoodsDetail: (id: string) => {
    return http.get<Goods>(`/goods/${id}`)
  },
}

/**
 * 学习相关 API
 */
export const studyApi = {
  // 获取推荐学习内容
  getRecommendedStudy: (limit: number = 10) => {
    return http.get<StudyItem[]>('/study/recommended', {
      params: { limit }
    })
  },

  // 获取学习进度
  getStudyProgress: (userId: string) => {
    return http.get(`/study/progress/${userId}`)
  },

  // 更新学习进度
  updateStudyProgress: (studyId: string, progress: number) => {
    return http.post('/study/progress', {
      studyId,
      progress
    })
  },

  // 获取轮播图数据
  getBanners: () => {
    return http.get('/banners')
  },
}

/**
 * 知识点相关 API
 */
export const knowledgeApi = {
  // 获取知识点列表
  getKnowledgePoints: (category?: string, difficulty?: string) => {
    return http.get<KnowledgePoint[]>('/knowledge', {
      params: { category, difficulty }
    })
  },

  // 获取知识点详情
  getKnowledgeDetail: (id: string) => {
    return http.get<KnowledgePoint>(`/knowledge/${id}`)
  },

  // 搜索知识点
  searchKnowledge: (keyword: string) => {
    return http.get<KnowledgePoint[]>('/knowledge/search', {
      params: { keyword }
    })
  },
}

/**
 * 练习相关 API
 */
export const practiceApi = {
  // 获取练习列表
  getPracticeList: (type?: string, difficulty?: string) => {
    return http.get<PracticeItem[]>('/practice', {
      params: { type, difficulty }
    })
  },

  // 提交练习答案
  submitPractice: (practiceId: string, answers: any[]) => {
    return http.post('/practice/submit', {
      practiceId,
      answers
    })
  },

  // 获取练习结果
  getPracticeResult: (practiceId: string) => {
    return http.get(`/practice/result/${practiceId}`)
  },
}

/**
 * 认证相关 API
 */
export const authApi = {
  // 微信小程序登录
  login: (code: string, appType: string = 'weapp') => {
    return http.post('/auth/login', { code, appType })
  },

  // 检查登录状态
  checkSession: () => {
    return http.get('/auth/check-session')
  },

  // 刷新 token
  refreshToken: (refreshToken: string) => {
    return http.post('/auth/refresh-token', { refreshToken })
  },

  // 登出
  logout: () => {
    return http.post('/auth/logout')
  },
}

/**
 * 用户相关 API
 */
export const userApi = {
  // 获取用户信息
  getUserInfo: () => {
    return http.get('/user/info')
  },

  // 更新用户信息
  updateUserInfo: (userInfo: any) => {
    return http.put('/user/info', userInfo)
  },

  // 更新用户资料（微信授权信息）
  updateUserProfile: (userProfile: any) => {
    return http.post('/user/profile', userProfile)
  },

  // 获取用户学习统计
  getUserStats: () => {
    return http.get('/user/stats')
  },
}

// 导出所有 API
export default {
  auth: authApi,
  category: categoryApi,
  goods: goodsApi,
  study: studyApi,
  knowledge: knowledgeApi,
  practice: practiceApi,
  user: userApi,
}
