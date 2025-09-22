// 导出所有服务
export { http, get, post, put, del as delete, patch, upload, download } from './http'
export { default as api } from './api'
export { wxAuth, login, logout, isLoggedIn, getStoredUserInfo, getUserProfile, checkSession, forceLogin, clearUserInfo } from './auth'

// 导出类型
export type { ApiResponse, RequestConfig } from './http'
export type {
  Category,
  Goods,
  StudyItem,
  KnowledgePoint,
  PracticeItem
} from './api'
export type { LoginResponse, UserInfo } from './auth'
