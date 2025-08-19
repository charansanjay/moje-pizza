import styles from './FilterSort.module.css';

type FilterSortPropsType = {
  children: React.ReactNode;
};

export const FilterSort = ({ children }: FilterSortPropsType) => {
  return (
    <div className={styles.container}>
      <div className={styles.controls}>{children}</div>
    </div>
  );
};
