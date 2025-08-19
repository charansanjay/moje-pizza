import styles from './TaskBar.module.css';

interface TaskBarProps {
  currentStep: number;
  completedSteps: number[];
}

export const TaskBar = ({ currentStep, completedSteps }: TaskBarProps) => {
  return (
    <div className={styles.taskBar}>
      <div
        className={`${styles.step} ${currentStep === 1 ? styles.active : ''} ${
          completedSteps.includes(1) ? styles.completed : ''
        }`}
      >
        <span>1</span>
        <p>Select Address</p>
      </div>
      <div
        className={`${styles.step} ${currentStep === 2 ? styles.active : ''} ${
          completedSteps.includes(2) ? styles.completed : ''
        }`}
      >
        <span>2</span>
        <p>Payment</p>
      </div>
    </div>
  );
};
