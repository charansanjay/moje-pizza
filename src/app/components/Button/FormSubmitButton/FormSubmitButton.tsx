import styles from './FormSubmitButton.module.css';

interface FormSubmitButtonPropsType {
  title: string;
  disabled?: boolean;
}

export const FormSubmitButton = ({
  title,
  disabled = false,
}: FormSubmitButtonPropsType) => {
  return (
    <input
      className={styles.FormSubmitButton}
      type='submit'
      value={title}
      disabled={disabled}
    />
  );
};
