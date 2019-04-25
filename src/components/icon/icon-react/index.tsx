import React from 'react';
import { AbstractNode, IconDefinition } from "../types/types";
import { MiniMap, isIconDefinition, withSuffix, generate, getSecondaryColor  } from "../utils";

export interface IconProps {
  type: string | IconDefinition,
  className?: string,
  onClick?: React.MouseEventHandler<SVGElement>,
  style?: React.CSSProperties,
  primaryColor?: string,
  secondary?: string
}

export interface TwoToneColorPalette {
  primaryColor: string,
  secondaryColor?: string,
}

export const twoTone = {
  primaryColor: '#333',
  secondaryColor: '#E6E6E6'
}

export default class Icon extends React.Component<IconProps> {
  static displayName = 'IconReact';

  static difinations = new MiniMap<IconDefinition>();

  static add(...icon: IconDefinition[]) {
    icon.forEach((iconDefinition) => {
      this.difinations.set(withSuffix(iconDefinition.name, iconDefinition.theme), iconDefinition)
    })
  }

  static clear(): void {
    this.difinations.clear();
  }

  static get(key: string, colors: TwoToneColorPalette = twoTone ) {
    if(Boolean(key)) {
      const target: IconDefinition | undefined = this.difinations.get(key);
      if(target && typeof target.icon === 'function') {
        return {
          ...target,
          icon: target.icon(colors.primaryColor, colors.secondaryColor)
        }
      }

      return target;
    }
  }

  constructor(props: IconProps) {
    super(props);
  }

  render() {
    const {
      type,
      className,
      style,
      onClick,
      primaryColor,
      ...restProps
    } = this.props;

    let target: IconDefinition | undefined;
    let colors: TwoToneColorPalette = twoTone;

    if(isIconDefinition(type as IconDefinition)) {
      target = type as IconDefinition;
    }else if(typeof type === 'string') {
      target = Icon.get(type)
      if(!target) {
        return null;
      }
    }

    if(!target) {
      return null;
    }

    if(target && typeof target.icon === 'function') {
      target = {
        ...target,
        icon: target.icon(colors.primaryColor, colors.secondaryColor)
      }
    }

    return (
      generate(target.icon as AbstractNode, `svg-${target.name}`, {
        className,
        style,
        onClick,
        ['data-icon']: target.name,
        width: '1em',
        height: '1em',
        ['aria-hidden']: 'true',
        ...restProps,
      })
    )

  }
}
