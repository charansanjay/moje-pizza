import styles from './OnlyAvailable.module.css';

interface OnlyAvailablePropsType {
  showAvailableOnly: boolean;
  setShowAvailableOnly: (showAvailableOnly: boolean) => void;
}

export const OnlyAvailable = ({
  showAvailableOnly,
  setShowAvailableOnly,
}: OnlyAvailablePropsType) => {
  return (
    <label className={styles.availabilityLabel}>
      <input
        type='checkbox'
        checked={showAvailableOnly}
        onChange={(e) => setShowAvailableOnly(e.target.checked)}
      />
      Available Only
    </label>
  );
};
