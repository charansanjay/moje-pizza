import { useEffect } from 'react';

import { type SortOptionsType } from '../pages/Menu/Menu.tsx';

export interface SortCaseType {
  name: string;
  price: number;
  created_at?: string;
}

interface useSortPropsType<T> {
  itemsToSort: T[];
  selectedOption: SortOptionsType | null;
  setSortedItems: (sortedItems: T[]) => void;
}

export const useSort = <T,>({
  itemsToSort,
  selectedOption,
  setSortedItems,
}: useSortPropsType<T & SortCaseType>) => {
  useEffect(() => {
    let sortedItems = [...itemsToSort];

    switch (selectedOption?.value) {
      case 'name_asc':
        sortedItems.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        sortedItems.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price_asc':
        sortedItems.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        sortedItems.sort((a, b) => b.price - a.price);
        break;
      case 'date_asc':
        sortedItems.sort((a, b) => {
          const dateA = new Date(a.created_at ?? 0).getTime();
          const dateB = new Date(b.created_at ?? 0).getTime();
          return dateB - dateA;
        });
        break;
      case 'date_desc':
        sortedItems.sort((a, b) => {
          const dateA = new Date(a.created_at ?? 0).getTime();
          const dateB = new Date(b.created_at ?? 0).getTime();
          return dateA - dateB;
        });
        break;
      // Add more cases as needed when reusing for different sorting methods.
      default:
        break;
    }

    setSortedItems(sortedItems);
  }, [selectedOption]);
};
