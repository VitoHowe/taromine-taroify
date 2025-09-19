import { Button, Checkbox, Space } from '@taroify/core';
import { View } from '@tarojs/components';
import { useState } from 'react';
import { useAppDispatch } from '~/store';
import { deleteTodo, editTodo, type TodoState, toggleTodo } from '~/store/todosSlice';
import TodoTextInput from './todoTextInput';

interface TodoItemProps {
  todo: TodoState;
}

export default function Item({ todo }: TodoItemProps) {
  const dispatch = useAppDispatch();

  const [editing, setEditing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(todo.completed);

  const handleSave = (newTodo: TodoState) => {
    if (newTodo.todotext.length === 0) dispatch(deleteTodo(newTodo.id));
    else
      dispatch(
        editTodo({
          id: newTodo.id,
          todotext: newTodo.todotext,
          completed: newTodo.completed,
        }),
      );

    setEditing(false);
  };

  let element;
  if (editing) {
    element = (
      <TodoTextInput
        value={todo.todotext}
        onSave={(text) => handleSave({ id: todo.id, todotext: text, completed: todo.completed })}
      />
    );
  } else {
    element = (
      <View className='flex space-x-4 border-b-1 border-b-gray-200'>
        <Checkbox
          className='flex-1'
          checked={isCompleted}
          onChange={(checked) => {
            setIsCompleted(checked);
            dispatch(toggleTodo(todo.id));
          }}
        >
          {todo.todotext}
        </Checkbox>

        <Space>
          <Button color='primary' onClick={() => setEditing(true)}>
            Edit
          </Button>
          <Button
            color='warning'
            onClick={() => {
              dispatch(deleteTodo(todo.id));
            }}
          >
            Delete
          </Button>
        </Space>
      </View>
    );
  }

  return <View>{element}</View>;
}
