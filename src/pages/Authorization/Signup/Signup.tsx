import styles from './Signup.module.css';

import GoogleSignin from '../../../components/Button/GoogleSignin/GoogleSignin';
import { SignupForm } from './SignupForm/SignupForm.tsx';

export const Signup = () => {
  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupFormContainer}>
        <p className={styles.signupHeading}>Sign up / Register</p>
        <p className={styles.signupMessage}>
          Welcome, Please enter your details to register
        </p>

        <SignupForm />

        <div className={styles.orDivider}>
          <div className={styles.orDividerLine}></div>
          <div className={styles.orDividerText}>OR</div>
          <div className={styles.orDividerLine}></div>
        </div>

        <GoogleSignin text='Sign up with Google' />
      </div>
    </div>
  );
};
