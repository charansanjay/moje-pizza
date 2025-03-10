import styles from './Sort.module.css';

import { useState } from 'react';
import Select, { components } from 'react-select';

/* components */
import { SortCaseType, useSort } from '../../../customHooks/useSort.tsx';

/* types */
import { type SortOptionsType } from '../../../pages/Menu/Menu.tsx';

interface SortPropsType<T> {
  options: SortOptionsType[];
  itemsToSort: T[];
  setSortedItems: (sortedItems: T[]) => void;
}

export const Sort = <T extends SortCaseType>({
  options,
  itemsToSort,
  setSortedItems,
}: SortPropsType<T>) => {
  const [selectedOption, setSelectedOption] = useState<SortOptionsType>(
    options[0]
  );

  useSort<T>({ itemsToSort, selectedOption, setSortedItems });

  const CustomOption = (props: any) => (
    <components.Option {...props}>
      <div className={styles.optionContent}>
        <span>{props.data.label}</span>
        {props.data.icon}
      </div>
    </components.Option>
  );

  return (
    <Select
      className={styles.select}
      value={selectedOption}
      onChange={(selected) => {
        if (selected) {
          setSelectedOption(selected);
        }
      }}
      placeholder='Sort by value'
      options={options}
      components={{ Option: CustomOption }}
      isSearchable={false}
    />
  );
};
