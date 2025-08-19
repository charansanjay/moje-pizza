import styles from './FormInput.module.css';

import React from 'react';

type FormInputPropsType = {
  type: string;
  label: string;
  id: string;
  error: string | undefined;
  icon?: React.ReactNode;
  showIcon?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
};

export const FormInput = React.forwardRef<HTMLInputElement, FormInputPropsType>(
  ({ type, label, id, error, icon, showIcon = false, ...props }, ref) => {
    return (
      <div className={styles.formInputContainer}>
        <div className={styles.formInputWrapper}>
          {label && <label htmlFor={id}>{label}</label>}
          <input type={type} id={id} ref={ref} {...props} />
          {showIcon && icon}
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>
    );
  }
);
