import styles from './ItemsPerPage.module.css';

import { useState } from 'react';
import Select from 'react-select';

interface ItemsPerPageOptionType {
  value: number;
  label: string;
}

const options: ItemsPerPageOptionType[] = [
  { value: 4, label: '4 per page' },
  { value: 8, label: '8 per page' },
  { value: 12, label: '12 per page' },
  { value: 16, label: '16 per page' },
];

interface ItemsPerPagePropsType {
  onItemsPerPageChange: (value: number) => void;
  itemsPerPage: number;
}

export const ItemsPerPage = ({
  onItemsPerPageChange,
  itemsPerPage,
}: ItemsPerPagePropsType) => {
  const [selectedOption, setSelectedOption] = useState<ItemsPerPageOptionType>(
    options.find((option) => option.value === itemsPerPage) || options[0]
  );

  return (
    <Select
      className={styles.select}
      value={selectedOption}
      onChange={(selected) => {
        if (selected) {
          setSelectedOption(selected);
          onItemsPerPageChange(Number(selected.value));
        }
      }}
      options={options}
      isSearchable={false}
    />
  );
};
