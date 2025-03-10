import styles from './Signin.module.css';
import { useDispatch } from 'react-redux';

/* components */
import GoogleSignin from '../../../components/Button/GoogleSignin/GoogleSignin.tsx';
import { SigninForm } from './SigninForm/SigninForm.tsx';

/* redux slice */
import { setToast } from '../../../redux/slices/settingsSlice/settingsSlice.ts';

/* types */
import { type AppDispatch } from '../../../redux/store.ts';

export const Signin = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginFormContainer}>
        <p className={styles.loginHeading}>Sign in to your account.</p>
        <p className={styles.loginMessage}>
          Welcome back, Please enter your details
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
