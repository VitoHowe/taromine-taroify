import { Button } from '@taroify/core';
import { View, Text } from '@tarojs/components';
// import { useDispatch, useSelector } from 'react-redux'
import { useAppDispatch, useAppSelector } from '../../store';
import { decrement, increment } from '../../store/counterSlice';

export default function Counter() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <View className='mt-10 mx-auto'>
      <View className='flex flex-row justify-center gap-4'>
        <Button
          aria-label='Increment value'
          color='primary'
          onClick={(_e) => {
            dispatch(increment());
          }}
        >
          Increment
        </Button>
        {count}
        <Button
          color='warning'
          aria-label='Decrement value'
          onClick={(_e) => {
            dispatch(decrement());
          }}
        >
          Decrement
        </Button>
      </View>
    </View>
  );
}
