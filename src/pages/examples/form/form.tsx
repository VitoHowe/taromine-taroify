import { Button, Cell, Field, Form, Input, Toast } from '@taroify/core';
import type { FormValidError } from '@taroify/core/form';
import { type BaseEventOrig, type FormProps, View } from '@tarojs/components';

export default function FormWithRules() {
  const asyncValidator = (val: any) =>
    new Promise<boolean>((resolve) => {
      console.log(val);
      Toast.loading('验证中...');

      setTimeout(() => {
        Toast.close('toast');
        resolve(/\d{6}/.test(val));
      }, 1000);
    });

  function onValidate(errors: FormValidError[]) {
    Toast.open({
      style: {
        textAlign: 'left',
      },
      message: JSON.stringify(errors, undefined, 2),
    });
  }
  const handleSubmit = (event: BaseEventOrig<FormProps.onSubmitEventDetail>) => {
    Toast.open(JSON.stringify(event.detail.value));
  };

  return (
    <Form
      defaultValues={{ validatorMessage: 'abc' }}
      onValidate={onValidate}
      onSubmit={handleSubmit}
    >
      <Toast id='toast' />
      <Cell.Group inset>
        <Field label='ID' name='pattern' rules={[{ pattern: /^\d{6}$/, message: '请输入6位数字' }]}>
          <Input placeholder='正则校验六位数字' />
        </Field>
        <Field
          label='手机号码'
          name='validator'
          rules={[
            {
              validator: (val) => /^1\d{10}$/.test(val),
              message: '请输入11位手机号码',
            },
          ]}
        >
          <Input placeholder='函数校验1开头的11位手机号码' />
        </Field>
        <Field
          label='文本'
          name='validatorMessage'
          rules={[
            {
              validator: (val) => val.length >= 5,
              message: '请输入至少5个字符',
            },
          ]}
        >
          <Input placeholder='函数校验至少5个字符' />
        </Field>
        <Field
          label='异步ID校验'
          name='asyncValidator'
          rules={[{ validator: asyncValidator, message: '请输入正确内容' }]}
        >
          <Input placeholder='请输入文本' />
        </Field>
      </Cell.Group>
      <View style={{ margin: '16px' }}>
        <Button shape='round' block color='primary' formType='submit'>
          提交
        </Button>
      </View>
    </Form>
  );
}
