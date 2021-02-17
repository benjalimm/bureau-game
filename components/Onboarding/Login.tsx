import React from 'react'
import styles from './styles.module.scss';

interface LoginProps {
  onLogin: () => Promise<void>;
}

const Login = (props: LoginProps) => {

  const didTap = () => {
    props.onLogin().then(() => {
      console.log("didTap")
    }).catch(err => {
      console.log(err)
    })
    
  }

  return(
    <div className={styles.loginWithTwitterContainer}>
      <h2 className={styles.loginText}>Login to Bureau</h2>
      <button className={styles.loginWithTwitterButton} 
        onClick={didTap}
      >
        <span>Login with Twitter</span>
      </button>
    </div>
  )
}

export default Login;
