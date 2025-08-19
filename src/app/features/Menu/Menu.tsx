import { useMemo, useState } from 'react';

import styles from './Menu.module.css';

import { MenuItem } from './MenuItem/MenuItem';
import {
  Pagination,
  FilterSort,
  Loader,
  ItemsPerPage,
  OnlyAvailable,
  Sort,
  type SortOptionsType,
} from '../../components';

import { useMenuItems } from './hooks/queries/useMenuItems';

import { calculatePaginatedItems } from '../../utils/calculatePaginatedItems';

import { FaLongArrowAltDown, FaLongArrowAltUp } from 'react-icons/fa';

import { type SortCaseType } from '../../shared/hooks/useSort';
import { type MenuItemType } from './types';

export const options: SortOptionsType[] = [
  {
    value: 'name_asc',
    label: 'Sort by: Name',
    icon: <FaLongArrowAltUp className={styles.icon} />,
  },
  {
    value: 'name_desc',
    label: 'Sort by: Name',
    icon: <FaLongArrowAltDown className={styles.icon} />,
  },
  {
    value: 'price_asc',
    label: 'Sort by: Price',
    icon: <FaLongArrowAltUp className={styles.icon} />,
  },
  {
    value: 'price_desc',
    label: 'Sort by: Price',
    icon: <FaLongArrowAltDown className={styles.icon} />,
  },
];

export const Menu = () => {
  const { menuItems = [], isMenuLoading } = useMenuItems();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(8);
  const [sortedItems, setSortedItems] = useState<MenuItemType[]>([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [pageItems, setPageItems] = useState<MenuItemType[]>([]);

  // If the dataset grows large, it optimizes performance by memoizing the paginated items.
  const paginatedItems = useMemo(
    () =>
      calculatePaginatedItems<MenuItemType>(
        currentPage,
        itemsPerPage,
        pageItems
      ),
    [currentPage, itemsPerPage, pageItems]
  );

  const handleShowAvailableOnly = () => {
    setShowAvailableOnly(!showAvailableOnly);

    if (showAvailableOnly) {
      setPageItems(sortedItems);
      return;
    }

    setPageItems(sortedItems.filter((item) => !item.sold_out));
  };

  const handleSetSortedItems = (sortedItems: MenuItemType[]) => {
    if (showAvailableOnly) {
      setPageItems(sortedItems.filter((item) => !item.sold_out));
      setSortedItems(sortedItems);
      return;
    }

    setSortedItems(sortedItems);
    setPageItems(sortedItems);
  };

  if (isMenuLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.menuContainer}>
      <FilterSort>
        <Sort<MenuItemType & SortCaseType>
          options={options}
          itemsToSort={menuItems}
          setSortedItems={handleSetSortedItems}
        />

        <OnlyAvailable
          showAvailableOnly={showAvailableOnly}
          setShowAvailableOnly={handleShowAvailableOnly}
        />

        <ItemsPerPage
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value);
            setCurrentPage(1);
          }}
          itemsPerPage={itemsPerPage}
        />
      </FilterSort>

      <div className={styles.menuNote}>
        <span>All pizzas are prepared with tomatoes and cheese.</span>
      </div>

      {paginatedItems.length === 0 && (
        <div className={styles.emptyState}>
          No pizzas found. Try adjusting your filters!
        </div>
      )}

      <ul>
        {paginatedItems.map((item) => (
          <MenuItem menuItem={item} key={item.id} />
        ))}
      </ul>

      <Pagination
        currentPage={currentPage}
        totalItems={sortedItems.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
