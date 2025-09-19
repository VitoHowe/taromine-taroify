import { Text, View } from '@tarojs/components';
import TodoTextInput from '~/components/todoTextInput';
import { useAppDispatch } from '~/store';
import { addTodo } from '~/store/todosSlice';

const Header = () => {
  const dispatch = useAppDispatch();

  const onSaveHandler = (text: string) => {
    if (text.length !== 0) {
      dispatch(addTodo(text));
    }
  };

  return (
    <View>
      <View className='py-2 text-center'>
        <Text className='font-bold text-2xl md:text-3xl text-center tracking-tight'>todos</Text>
      </View>
      <View>
        <View>
          <TodoTextInput onSave={onSaveHandler} placeholder='What needs to be done?' />
        </View>
      </View>
    </View>
  );
};

export default Header;
