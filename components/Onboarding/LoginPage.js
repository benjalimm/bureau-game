import React, { useEffect, useState } from 'react'
import style from './onboarding.module.css'

export default function LoginPage () {
  return (
    <div className={style.loginBackground}>
      <div className={style.loginModalView}>
        <h2 className={style.loginText}>Login to Bureau</h2>
          <div className={style.loginWithTwitterButton}>
              <a>Login with Twitter</a>
          </div>
      </div>
    </div>
  )
}