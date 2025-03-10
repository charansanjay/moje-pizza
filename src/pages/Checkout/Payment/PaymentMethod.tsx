import styles from './PaymentMethod.module.css';

type PaymentMethodProps = {
  label: string;
  icon: string;
  isSelected: boolean;
  onSelect: () => void;
  selectable: boolean;
};

export const PaymentMethod = ({
  label,
  icon,
  isSelected,
  onSelect,
  selectable,
}: PaymentMethodProps) => (
  <button
    className={`${styles.method} ${isSelected ? styles.selected : ''} ${
      selectable ? styles.selectable : ''
    }`}
    aria-label={`Select ${label} payment method`}
    role='radio'
    aria-checked={isSelected}
    onClick={onSelect}
  >
    <p className={styles.icon}>{icon}</p>
    <p className={styles.label}>{label}</p>
  </button>
);
