# 架构文档 (arch.md)

## 项目概述
- **项目名称**: taromine
- **描述**: 基于 Taro 多端统一开发框架的 React Typescript 入门学习示例，模仿 TodoMVC，支持微信小程序和 H5。
- **技术栈**: Taro + React Typescript + Redux Toolkit + Taroify/Vantui/NutUI + TailwindCSS。

## 模块划分
- **核心模块**: `src/pages` 包含示例页面（如 `Counters` 和 `TodosMVC`）。
- **状态管理**: 使用 Redux Toolkit 实现。
- **样式**: 通过 TailwindCSS 和组件库（Taroify/Vantui/NutUI）实现。

## 技术栈
- **框架**: Taro + React Typescript
- **状态管理**: Redux Toolkit
- **组件库**: Taroify/Vantui/NutUI
- **样式**: TailwindCSS

## 依赖关系
- **主要依赖**: `@taroify/core`、`@reduxjs/toolkit`、`@tarojs/components` 等。