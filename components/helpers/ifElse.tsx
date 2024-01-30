import { FC, ReactNode } from 'react';


interface IfElseProps {
  children?: ReactNode,
  condition: boolean,
  render?: ReactNode,
  elseRender?: ReactNode
}

export const If: FC<IfElseProps> = ({ children, condition, render, elseRender }) => {
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
};
