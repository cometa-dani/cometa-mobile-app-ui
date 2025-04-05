import { ReactNode } from 'react';


interface ForEachProps<T> {
  children: (item: T, index?: number, arr?: T[]) => ReactNode,
  items: T[]
}

export function ForEach<T>({ children, items }: ForEachProps<T>): ReactNode {
  if (items?.length === 0 || !items) return null;

  return items.map((item, index, arr) => (
    children(item, index, arr)
  ));
}
