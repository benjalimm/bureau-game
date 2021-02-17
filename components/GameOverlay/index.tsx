import React from 'react'

import styles from './styles.module.scss'
import ModalNavigationView from '../ModalNavigationView'

export default function GameOverlay () {
  return <div className={styles.overlayContainerView}>
    <ModalNavigationView/>
  </div>
}
