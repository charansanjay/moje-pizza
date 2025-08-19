import styles from './ContinueButton.module.css';

/* icons */
import { FaArrowRightLong } from 'react-icons/fa6';

interface ButtonPropsType {
  text: string;
  float?: 'left' | 'right';
  type: 'primary' | 'secondary' | 'delete';
  showIcon: boolean;
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ContinueButton = ({
  type = 'primary',
  text,
  onClick,
  showIcon = true,
  float = 'right',
  icon = <FaArrowRightLong aria-label='icon' />,
}: ButtonPropsType) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.continueButton} ${styles[type]}`}
      style={{ float: `${float}` }}
    >
      {text} {showIcon && icon}
    </button>
  );
};
