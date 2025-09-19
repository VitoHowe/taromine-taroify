import './card.sass';

import { Image } from '@taroify/core';
import { View } from '@tarojs/components';
import { TwoPrice } from './price';
export function Card() {
  return (
    // <Cell title="我是个坏坏的标题" brief="hahahaha 描述 阿松扽 阿松扽撒扽阿方索的" align="start" size="large" icon={x} bordered={false} clickable></Cell>
    <View className='flex flex-cols-2'>
      <View className='gap-2'>
        <Image width={180} height={180} src='https://img.yzcdn.cn/vant/cat.jpeg' />
        <View>
          <View className='goods-title'>
            sda我是个坏坏我是个坏坏的标题我是个坏坏的标题我是个坏坏的标题我是个坏坏的标题我是个坏坏的标题的标题我是个坏坏的标题sdf
            sadf asdf
          </View>
          <View className='goods-brief'>描述撒扽啊撒扥阿三阿松扽阿松扽阿松扽sdasdf sadf asdf</View>
          <TwoPrice newPrice={32.22} oldPrice={53.6} />
          <View className='text-xs text-gray-700'>开开心心大药房</View>
        </View>
      </View>
    </View>
  );
}
