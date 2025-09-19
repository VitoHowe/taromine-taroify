import { Button, Input } from '@taroify/core';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';

type TextInputProps = {
  value?: string;
  onSave: (text: string) => void;
  placeholder?: string;
};

export default function TodoTextInput(props: TextInputProps) {
  const [todoText, setTodoText] = useState<string>(props.value || '');

  const handleChange = (value: string) => {
    setTodoText(value.trim());
  };

  return (
    <View className='flex flex-row items-center justify-between px-4 pb-2 bg-gray-100 rounded-lg'>
      <Input
        type='text'
        style={{
          color: 'black',
          background: 'white',
          flex: '1',
          margin: '24px',
        }}
        placeholder={props.placeholder}
        confirmType='done'
        value={todoText}
        onChange={(e) => {
          handleChange(e.detail.value);
        }}
      />

      <Button
        className='min-w-24  w-auto '
        color='primary'
        onClick={() => {
          if (todoText.trim().length > 0) {
            props.onSave(todoText);
            setTodoText('');
          } else {
            Taro.showToast({
              title: '请输入内容',
              icon: 'none',
            });
          }
        }}
      >
        Add Todo
      </Button>
    </View>
  );
}
