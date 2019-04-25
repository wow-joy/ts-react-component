import { AbstractNode, IconDefinition } from "./types/types";
import React from 'react';
import { generate as generateColor } from 'ant-design-palettes';
import { ThemeType } from "./index";

export const svgBaseProps = {
  width: '1em',
  height: '1em',
  fill: 'currentColor',
  ['aria-hidden']: 'true',
  focusable: 'false'
};

export class MiniMap<V> {
  get size(): number {
    return Object.keys(this.collection).length;
  }

  private collection: { [key: string]: V } = {}

  clear(): void {
    this.collection = {};
  }

  delete(key: string): boolean {
    return delete this.collection[key]
  }

  get(key: string): V | undefined {
    return this.collection[key]
  }

  has(key: string): boolean {
    return Boolean(this.collection[key]);
  }

  set(key: string, value: V): this {
    this.collection[key] = value;
    return this;
  }
}

export interface Attrs {
  [key: string]: any
}

export function normalizeAttrs(attrs: Attrs = {}): Attrs {
  return Object.keys(attrs).reduce((acc: Attrs, key: string) => {
    const value = attrs[key];
    switch(key) {
      case 'class':
        acc.className = value;
        delete acc.class;
        break;
      default:
        acc[key] = value
    }
    return acc;
  }, {})
}

export function isIconDefinition(type: IconDefinition): boolean {
  return typeof type === 'object' && typeof type.name === 'string' && typeof type.theme === 'string' && ( typeof type.icon === 'object' || typeof type.icon === 'function')
}

export function getSecondaryColor(primaryColor: string): string {
  return generateColor(primaryColor)[0];
}

export function withSuffix(name: string, theme: string): string {
  switch(theme) {
    case 'fill':
      return `${name}-fill`;
    case 'outline':
      return `${name}-o`;
    case 'twotone':
      return `${name}-twotone`;
    default:
      throw new Error(`the 'theme' params' `)
  }
}

export function log(message: string) {
  console.log(message)
}

export function generate(node: AbstractNode, key: string, rootProps?: { [key: string]: any} | false): any {
  if(!rootProps) {
    return React.createElement(node.tag,
      {
        key,
        ...normalizeAttrs(node.attrs),
      },
      (node.children || []).map((child: AbstractNode, index: number) => {
        return generate(child, `${key}-${node.tag}-${index}`)
      }))
  }

  return React.createElement(node.tag,
    {
      key,
      ...normalizeAttrs(node.attrs),
      ...rootProps,
    },
    (node.children || []).map((child: AbstractNode, index: number) => {
      return generate(child, `${key}-${node.tag}-${index}`)
    }))
}

const fillTester = /-fill$/;
const outlineTester = /-o$/;
const twoToneTester = /-twotone$/;

export function getThemeFromTypeName(type: string): ThemeType | null {
  let result: ThemeType | null = null;
  if(fillTester.test(type)) {
    result = 'filled';
  }else if(outlineTester.test(type)) {
    result = 'outlined';
  }else if(twoToneTester.test(type)) {
    result = 'twotone';
  }

  return result;
}

export function removeTypeTheme(type: string): string {
  return type.replace(fillTester, "")
    .replace(outlineTester, "")
    .replace(twoToneTester, "");
}

export function withThemeSuffix(type: string, theme: ThemeType): string {
  let result = type
  if(theme === 'filled') {
     result = `${type}-fill`
  }
  if(theme === 'outlined') {
    result = `${type}-o`
  }

  if(theme === 'twotone') {
    result = `${type}-twotone`;
  }

  return result;
}

export function alias(type: string): string {
  switch(type) {
    case 'cross':
      return 'close';
    default:
  }

  return type
}
