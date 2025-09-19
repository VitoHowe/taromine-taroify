import { Button, Radio } from '@taroify/core';
import { Text, View } from '@tarojs/components';
import { VisibilityFilter } from '~/constants/todo-filter';

interface FooterProps {
  completedCount: number;
  activedCount: number;
  visibleFilter: VisibilityFilter;
  setVisibleFilter: React.Dispatch<React.SetStateAction<VisibilityFilter>>;
  onClearCompleted: () => void;
}

export default function Footer({
  completedCount,
  activedCount,
  visibleFilter,
  setVisibleFilter,
  onClearCompleted,
}: FooterProps) {
  return (
    <View>
      <View className='flex items-center'>
        <Text className='font-bold text-[18px]'>{`${activedCount} ${activedCount === 1 ? 'item' : 'items'} left !`}</Text>
      </View>
      <View className='flex justify-between items-center p-1'>
        <Radio.Group
          className='justify-items-center'
          direction='horizontal'
          value={visibleFilter}
          onChange={setVisibleFilter}
        >
          <Radio name={VisibilityFilter.SHOW_ALL}>All</Radio>
          <Radio name={VisibilityFilter.SHOW_ACTIVE}>Active</Radio>
          <Radio name={VisibilityFilter.SHOW_COMPLETED}>Completed</Radio>
        </Radio.Group>
        <Button color='primary' onClick={onClearCompleted} disabled={completedCount === 0}>
          Clear completed
        </Button>
      </View>
    </View>
  );
}
