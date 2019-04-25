import React from 'react';
import cx from 'classnames';
import ReactIcon from './icon-react/index';
import * as allIcons from './icons/dist';
import * as allIcons2 from './icons/wowjoyplatform';
import { svgBaseProps, getThemeFromTypeName, alias, removeTypeTheme, withThemeSuffix } from "./utils";
import warning from "../utils/warning";

export type ThemeType = 'filled' | 'outlined' | 'twotone' | null;

ReactIcon.add(...Object.keys(allIcons).map((key) => (allIcons as any)[key]));
ReactIcon.add(...Object.keys(allIcons2).map((key) => (allIcons2 as any)[key]));
const defaultTheme: ThemeType = 'outlined';
const dangerousTheme: ThemeType | undefined = undefined;

export interface CustomIconProps {
  width: string | number,
  height: string | number,
  fill: string,
  viewBox?: string,
  className?: string,
  style?: React.CSSProperties,
  spin?: boolean,
  rotate?: number,
  ['aria-hidden']?: string,
}

export interface IconProps {
  type?: string,
  className?: string,
  theme?: ThemeType,
  title?: string,
  onKeyUp?: React.KeyboardEventHandler<HTMLElement>,
  onClick?: React.MouseEventHandler<HTMLElement>,
  component?: React.ComponentType<CustomIconProps>,
  twoToneColor?: string,
  viewBox?: string,
  spin?: boolean,
  rotate?: number,
  style?: React.CSSProperties,
  prefixCls?: string,
  role?: string,
}

export interface IconComponent<P> extends React.FunctionComponent<P> {

}

const Icon: IconComponent<IconProps> = (props: IconProps | any ) => {

  const {
    className,

    type,
    viewBox,
    spin,
    rotate,
    theme,
    onClick,
    twoToneColor,
    component: Component,
    children,
    ...restProps
  } = props;

  const classString = cx({
    ['wjc-icon']: true,
    [`wjc-icon-${type}`]: Boolean(type),
  }, className);

  const svgClassString = cx({
    ['wjc-icon-spin']: !!spin || type === 'loading',
  });

  let innerNode: React.ReactNode;

  const svgStyle = rotate ?
    {
      'msTransform': `rotate(${rotate}deg)`,
      'transform': `rotate(${rotate}deg)`,
    } :
    undefined;

  const innerSvgProps: CustomIconProps = {
    ...svgBaseProps,
    className: svgClassString,
    style: svgStyle,
    viewBox,
  }

  if(!viewBox) {
    delete innerSvgProps.viewBox;
  }

  // component > children > type
  if(Component) {
    innerNode = <Component {...innerSvgProps}>{ children }</Component>
  }

  if(children) {
    warning(
      Boolean(viewBox) ||
      React.Children.count(children) === 1 &&
      React.isValidElement(children) &&
      React.Children.only(children).type === 'use',
      'Icon',
      'make sure that you provide correct `viewBox` props default ( 0 0 1024 1024) to icon'
    );

    innerNode = <svg {...innerSvgProps}>{ children }</svg>
  }

  if(typeof type === 'string') {
    let computeType = type;
    if(theme) {
      const themeInName: ThemeType = getThemeFromTypeName(type);
      warning(
        !themeInName || theme === themeInName,
        'Icon',
        `the icon name ${type} has already specify a theme ${themeInName} the 'theme' prop ${theme} will be ignored `
      )
    }
    computeType = withThemeSuffix(
      removeTypeTheme(alias(type)),
      dangerousTheme || theme || defaultTheme
    );

    innerNode = <ReactIcon
    type={computeType}
    className={svgClassString}
    style={svgStyle}
    primaryColor={twoToneColor}/>
  }

  if(innerNode === null || innerNode === undefined) {
    warning(false, 'Icon', `icon specify type prop `)
  }

  console.log(innerNode)

  return (
    <i
    onClick={onClick}
    className={classString}
    {...restProps}>
      { innerNode }
    </i>
  )
}

export default Icon;
