import React from 'react';
import cx from 'classnames';
import { ConfigConsumer, ConfigConsumerProps } from "../config-provider";
// @ts-ignore
import defaultEmptyImg from './empty.svg';
// @ts-ignore
import simpleEmptyImg from './simple.svg';

export interface EmptyProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;

  /**
   * @since 3.16.0
   * */
  imageStyle?: React.CSSProperties;
  image?:React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode
}

const OriginEmpty: React.FunctionComponent<EmptyProps> = (props: EmptyProps) => {

  return (
    <ConfigConsumer>
      {({ getPrefixCls }: ConfigConsumerProps) => {
        const {
          prefixCls: customizePrefixCls,
          className,
          style,
          imageStyle,
          image = defaultEmptyImg ,
          description,
          children,
          ...restProps
        } = props;

        const prefixCls = getPrefixCls('empty', customizePrefixCls);
        const des = description;
        const alt = typeof des === 'string' ? des : 'empty';

        let imageNode: React.ReactNode = null;

        if(typeof image === 'string') {
          imageNode = <img src={image} alt={alt} />
        }else {
            imageNode = image;
        }

        return <div className={cx(prefixCls, className)} style={style} {...restProps}>
          <div className={cx(`${prefixCls}-image`)} style={imageStyle}>
            { imageNode }
          </div>
          <div className={cx(`${prefixCls}-description`)}>{ des }</div>
          <div className={cx(`${prefixCls}-footer`)}>
            { children }
          </div>
        </div>

      }}
    </ConfigConsumer>
  )

}

export type EmptyType = typeof OriginEmpty & {
  PRESENTED_DEFAULT_IMAGE: string;
  PRESENTED_SIMPLE_IMAGE: string;
}

const Empty: EmptyType = OriginEmpty as EmptyType;
Empty.PRESENTED_DEFAULT_IMAGE = defaultEmptyImg;
Empty.PRESENTED_SIMPLE_IMAGE = simpleEmptyImg;

export default Empty;



