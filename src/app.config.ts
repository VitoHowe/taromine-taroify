export default {
  pages: [
    'pages/index/index',
    'pages/knowledge/index',
    'pages/practice/index',
    'pages/profile/index'
  ],
  subPackages: [
    {
      root: 'pages/examples',
      pages: ['counters', 'todoMVC', 'form/form'],
    },
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '学习中心',
    navigationBarTextStyle: 'black',
  },
}
