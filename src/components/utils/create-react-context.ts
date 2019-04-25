import React from 'react';

const createReactContext: <T>(value: T) => React.Context<T> = <T>(value: T) => {
  return React.createContext<T>(value)
}

export type Context<T> = React.Context<T>;

export default createReactContext;
