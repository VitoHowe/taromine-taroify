// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    [
      'taro',
      {
        framework: 'react',
        hot: false,
        ts: 'true',
        compiler: 'webpack5',
        useBuiltIns: process.env.TARO_ENV === 'h5' ? 'usage' : false,
      },
    ],
  ],
  plugins: [
    [
      'import',
      {
        libraryName: '@taroify/core',
        libraryDirectory: '',
  // https://tw.icebreaker.top/docs/issues/use-with-taroify
  // 关闭 style 选项，避免和 weapp-tailwindcss 冲突
        style: false,
      },
      '@taroify/core',
    ],
    [
      'import',
      {
        libraryName: '@taroify/icons',
        libraryDirectory: '',
        camel2DashComponentName: false,
        // style: () => '@taroify/icons/style',
        style: false,
        customName: (name) =>
          name === 'Icon' ? '@taroify/icons/van/VanIcon' : `@taroify/icons/${name}`,
      },
      '@taroify/icons',
    ],
  ],
};
