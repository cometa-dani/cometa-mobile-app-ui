import { ReactNode } from 'react';


interface IfElseProps<T> {
  children?: ReactNode,
  if: boolean | T,
  then?: ReactNode,
  else?: ReactNode
}

export function Condition<T>({ children, if: condition, then: render, else: elseRender }: IfElseProps<T>) {
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
