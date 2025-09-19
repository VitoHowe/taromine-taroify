import { View } from '@tarojs/components';
import Header from '~/components/header';
import Main from '~/components/main';

export default function Counter() {
  return (
    <View className='bg-neutral-100 shadow-black/20 shadow-sm sm:shadow-black/10 sm:shadow-lg mx-auto md:mt-4 font-light text-neutral-800 antialiased leading-tight'>
      <Header />
      <Main />
    </View>
  );
}
