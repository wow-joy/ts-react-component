import React from 'react';
import cx from 'classnames';
import { ButtonSize } from "./button";
import { ConfigConsumer, ConfigConsumerProps } from "../config-provider";

export interface ButtonGroupProps {
  size?: ButtonSize;
  className?: string;
  style?: React.CSSProperties;
  prefixCls?: string;
}

const  ButtonGroup: React.FunctionComponent<ButtonGroupProps> = (props: ButtonGroupProps) => {

  return (
    <ConfigConsumer>
      {({ getPrefixCls }: ConfigConsumerProps) => {
        const { prefixCls: customizePrefixCls, size, className, ...restProps } = props;
        const prefixCls = getPrefixCls('btn-group', customizePrefixCls);

        let sizeCls = '';
        switch(size) {
          case 'large':
            sizeCls = 'lg';
            break;
          case 'small':
            sizeCls = 'small';
            break;
          default:
            break;
        }

        const classNames = cx({
          prefixCls,
          [`${prefixCls}-${sizeCls}`]: sizeCls,
          className,
        })

        return <div {...restProps} className={classNames}></div>
      }}
    </ConfigConsumer>
  )
}

export default ButtonGroup;
