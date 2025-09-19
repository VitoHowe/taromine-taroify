import { View } from '@tarojs/components';
import { useMemo, useState } from 'react';
import { VisibilityFilter } from '~/constants/todo-filter';
import { useAppDispatch, useAppSelector } from '~/store';
import { clearCompleted } from '~/store/todosSlice';
import Footer from './footer';
import Item from './item';
import './main.css';

export default function Main() {
  const todos = useAppSelector((state) => state.todos);
  const [visibilityFilter, setVisibilityFilter] = useState(VisibilityFilter.SHOW_ALL);
  const dispatch = useAppDispatch();

  const visibleTodos = useMemo(() => {
    switch (visibilityFilter) {
      case VisibilityFilter.SHOW_ALL:
        return todos;

      case VisibilityFilter.SHOW_ACTIVE:
        return todos.filter((todo) => todo.completed === false);

      case VisibilityFilter.SHOW_COMPLETED:
        return todos.filter((todo) => todo.completed === true);

      default:
        return todos;
    }
  }, [todos, visibilityFilter]);

  if (todos.length === 0) return null;

  const completedCount = todos.filter((todo) => todo.completed === true).length;
  const activedCount = todos.length - completedCount;

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };
  return (
    <main>
      <View>
        {/* <input
          type='checkbox'
          checked={completedCount === todos.length}
          onChange={toggleAll}
        />
        <label className='toggle-all-label' htmlFor='toggle-all'>
          Toggle All Input
        </label> */}
      </View>
      <View className='p-1'>
        {/* 小程序没有ul ol， View 模拟 <ul> 容器 */}
        {visibleTodos.map((todo) => (
          <Item key={todo.id} todo={todo} />
        ))}
      </View>
      <Footer
        completedCount={completedCount}
        activedCount={activedCount}
        visibleFilter={visibilityFilter}
        setVisibleFilter={setVisibilityFilter}
        onClearCompleted={handleClearCompleted}
      />
    </main>
  );
}
