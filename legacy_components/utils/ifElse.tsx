import { ReactNode } from 'react';


interface IfElseProps<T> {
  children?: ReactNode,
  condition: boolean | T,
  render?: ReactNode,
  elseRender?: ReactNode
}

export function If<T>({ children, condition, render, elseRender }: IfElseProps<T>) {
  if (condition && children) {
    return children;
  }
  if (condition && render) {
    return render;
  }
  if (!condition && elseRender) {
    return elseRender;
  }

  return null;
}
