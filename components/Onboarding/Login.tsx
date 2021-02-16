import React from 'react'
import style from './onboarding.module.css';

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
        <div className={style.loginWithTwitterContainer}>
            <h2 className={style.loginText}>Login to Bureau</h2>
            <button className={style.loginWithTwitterButton} 
                onClick={didTap}
            >
                <span>Login with Twitter</span>
            </button>
        </div>
    )
}

export default Login;
