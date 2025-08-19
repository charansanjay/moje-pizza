import styles from './Signin.module.css';
import { useDispatch } from 'react-redux';

import { GoogleSignin } from '../../../components';
import { SigninForm } from './SigninForm/SigninForm';

import { setToast } from '../../../store/slices/settingsSlice/settingsSlice';

import { type AppDispatch } from '../../../store/store';

export const Signin = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginFormContainer}>
        <p className={styles.loginHeading}>Sign in to your account.</p>
        <p className={styles.loginMessage}>
          Welcome back, Please enter your details
        </p>
        <p className={styles.testAccountMessage}>
          <b>(Test a/c)</b> <b>Email:</b> charan0625@gmail.com&nbsp;&nbsp;
          <b>Password:</b> charan123456
        </p>
        <SigninForm />
        <p
          className={styles.forgotPasswordLink}
          onClick={() =>
            dispatch(
              setToast({
                message: 'FEATURE under development',
                type: 'info',
              })
            )
          }
        >
          Forgot password?
        </p>
        <div className={styles.orDivider}>
          <div className={styles.orDividerLine}></div>
          <div className={styles.orDividerText}>OR</div>
          <div className={styles.orDividerLine}></div>
        </div>

        <GoogleSignin text='Continue with Google' />
      </div>
    </div>
  );
};
