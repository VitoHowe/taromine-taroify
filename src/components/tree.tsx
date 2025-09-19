import { TreeSelect } from '@taroify/core';
import { useState } from 'react';
import { Grid, Image } from '@taroify/core';

export const MyImage = ({ url }: { url: string }) => {
  return <Image width={100} height={100} src={url} />;
};

export function RadioTreeSelect() {
  const [tabValue, setTabValue] = useState(0);

  const x = () => {
    return (
      <Grid columns={3} bordered={false} clickable>
        {Array.from({ length: 10 }, () => (
          <Grid.Item
            icon={<MyImage url='https://img.yzcdn.cn/vant/cat.jpeg'></MyImage>}
            text='example'
          />
        ))}
      </Grid>
    );
  };

  return (
    <TreeSelect tabValue={tabValue} onTabChange={setTabValue}>
      <TreeSelect.Tab title='浙江'>{x()}</TreeSelect.Tab>
      <TreeSelect.Tab title='江苏'>
        <Image width={200} height={200} src='https://img.yzcdn.cn/vant/cat.jpeg' />
        <Image width={200} height={200} src='https://img.yzcdn.cn/vant/cat.jpeg' />

        <Image width={200} height={200} src='https://img.yzcdn.cn/vant/cat.jpeg' />
        <Image width={200} height={200} src='https://img.yzcdn.cn/vant/cat.jpeg' />
      </TreeSelect.Tab>
      <TreeSelect.Tab title='福建' disabled>
        {x()}
      </TreeSelect.Tab>
    </TreeSelect>
  );
}
