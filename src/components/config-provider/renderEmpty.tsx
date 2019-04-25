import React from 'react';
import Empty from '../empty';
import { ConfigConsumer, ConfigConsumerProps } from ".";

const  renderEmpty = (componentName?: string): React.ReactNode => {
  return <ConfigConsumer>
    { ({ getPrefixCls }: ConfigConsumerProps) => {
      const prefixCls = getPrefixCls('empty');

      switch(componentName) {
        case 'Table':
        case 'List':
          return <Empty image={Empty.PRESENTED_DEFAULT_IMAGE} className={`${prefixCls}-normal`}/>;

        case 'Select':
        case 'TreeSelect':
        case 'Cascader':
        case 'Transfer':
          return <Empty image={Empty.PRESENTED_SIMPLE_IMAGE} className={`${prefixCls}-small`}/>;
        default:
          return <Empty />
      }
    }}
  </ConfigConsumer>
}

export type RenderEmptyHandler = typeof renderEmpty

export default renderEmpty;

