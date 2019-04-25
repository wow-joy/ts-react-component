import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import omit from 'omit.js';
import Icon from '../icon';
import Group from './button-group';
import { ConfigConsumer, ConfigConsumerProps} from "../config-provider";
import { tuple, Omit } from './utils';

const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/;
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);
function isString(str: any): boolean {
  return typeof str === 'string';
}

function insertSpace(child: React.ReactChild, needInserted: boolean): void | React.ReactNode {
  if(child == null) {
    return;
  }

  const SPACE = needInserted ? " " : '';

  if(typeof child !== 'string' && typeof child !== 'number' && typeof child.type === 'string' &&
    isTwoCNChar(child.props.children)) {
    return React.cloneElement(child, {}, child.props.children.split("").join(SPACE))
  }

  if(typeof child === 'string') {
    if(isTwoCNChar(child)) {
      child = child.split("").join(SPACE);
    }

    return <span>{child}</span>
  }

  return child

}

const ButtonTypes = tuple('default', 'primary', 'ghost', 'dashed', 'danger');
export type ButtonType = (typeof ButtonTypes)[number];
const ButtonShapes = tuple('circle', 'circle-outline', 'round');
export type ButtonShape = (typeof ButtonShapes)[number];
const ButtonSizes = tuple('large', 'default', 'small');
export type ButtonSize = (typeof ButtonSizes)[number];
const ButtonHTMLTypes = tuple('submit', 'button', 'reset');
export type ButtonHTMLType = (typeof ButtonHTMLTypes)[number]

export interface BaseButtonProps {
  type?: ButtonType;
  icon?: string;
  shape?: ButtonShape;
  size?: ButtonSize;
  loading?: boolean | { delay?: number };
  prefixCls?: string;
  className?: string;
  ghost?: boolean;
  block?: boolean;
  children?: React.ReactNode;
}

interface ButtonState {
  loading?: boolean | { delay?: number };
  hasTwoCNChar?: boolean;
}

export type AnchorButtonProps = {
  href: string;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
} & BaseButtonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'type'>;

export type NativeButtonProps = {
  htmlType?: ButtonHTMLType;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
} & BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>

type ButtonProps = AnchorButtonProps | NativeButtonProps;

export default class Button extends React.Component<ButtonProps, ButtonState> {

  static Group: typeof Group = Group;

  static __WJC_BUTTON = true;

  static defaultProps: ButtonProps = {
    loading: false,
    ghost: false,
    block: false,
    htmlType: 'button',
  };

  static propTypes = {
    type: PropTypes.string,
    shape: PropTypes.oneOf(ButtonShapes),
    size: PropTypes.oneOf(ButtonSizes),
    htmlType: PropTypes.oneOf(ButtonHTMLTypes),
    onClick: PropTypes.func,
    loading: PropTypes.bool,
    className: PropTypes.string,
    icon: PropTypes.string,
    block: PropTypes.bool,
  }

  static getDerivedStateFromProps(nextProps: ButtonProps, prevState: ButtonState) {
    if(nextProps.loading instanceof Boolean) {
      return {
        ...prevState,
        loading: nextProps.loading
      }
    }

    return null;
  }

  private delayTimeout: number;

  private buttonNode: HTMLElement | null;

  constructor(props: ButtonProps) {
    super(props);

    this.state = {
      loading: props.loading,
      hasTwoCNChar: false,
    }
  }

  componentDidMount(): void {
    this.fixTwoCNChar();
  }

  fixTwoCNChar(): void{
    if(!this.buttonNode) {
      return;
    }

    const buttonText = this.buttonNode.textContent || this.buttonNode.innerText;

    if(this.isNeedInserted() && isTwoCNChar(buttonText)) {
      if(!this.state.hasTwoCNChar) {
        this.setState({
          hasTwoCNChar: true
        });
      }
    }else if(this.state.hasTwoCNChar) {
      this.setState({
        hasTwoCNChar: false
      });
    }
  }

  isNeedInserted(): boolean {
    const { icon, children } = this.props;
    return React.Children.count(children) === 1 && !icon;
  }

  saveButtonRef(node: HTMLElement | null) {
    this.buttonNode = node;
  }

  handleClick: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement> = (e) => {
    const { loading } = this.state;
    const { onClick } = this.props;
    if(!!loading) {
      return;
    }

    if(onClick) {
      (onClick as React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>)(e);
    }
  }

  renderButton({ getPrefixCls, autoInsertSpaceInButton }: ConfigConsumerProps): React.ReactNode {

    const {
      prefixCls: customizePrefixCls,
      type,
      loading: _loadingProp,
      shape,
      size,
      onClick,
      block,
      style,
      children,
      icon,
      ghost,
      className,
      ...restProps,
    } = this.props as ButtonProps;

    const { loading, hasTwoCNChar } = this.state as ButtonState;

    const prefixCls: string = getPrefixCls('button', customizePrefixCls);

    const autoInsertSpace: boolean = autoInsertSpaceInButton !== false;

    // large => lg
    // small => sm
    let sizeCls = '';
    switch(size) {
      case 'large':
        sizeCls = 'lg';
        break;
      case 'small':
        sizeCls = 'sm';
        break;
      default:
        break;
    }

    const classNames = cx(prefixCls, className, {
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-${shape}`]: shape,
      [`${prefixCls}-${sizeCls}`]: size,
      [`${prefixCls}-icon-only`]: !children && children !== 0 && icon,
      [`${prefixCls}-loading`]: loading,
      [`${prefixCls}-background-ghost`]: ghost,
      [`${prefixCls}-two-chinese-chars`]: hasTwoCNChar && autoInsertSpace,
      [`${prefixCls}-block`]: block
    });

    const iconType = loading ? 'loading' : icon;
    const icoNode: typeof Icon | null = iconType ? <Icon type={iconType}/> : null;

    const kids: React.ReactFragment | null =
      children || children === 0
    ? React.Children.map(children, child => insertSpace(child as React.ReactChild, this.isNeedInserted() && autoInsertSpace)) : null;

    const linkButtonRestProps = omit(restProps as AnchorButtonProps, ["htmlType"]);

    if(linkButtonRestProps.href !== undefined) {
      return <a {...linkButtonRestProps}
      className={classNames}
      onClick={this.handleClick}
      ref={this.saveButtonRef}>
        { icoNode }
        { kids }
      </a>
    }

    // React does not recognize the `htmlType` prop on a DOM element. Here we pick it out of `rest`.
    const { htmlType, ...otherProps } = restProps;
  }




}
