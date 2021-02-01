import React from 'react'

import styles from './ModalNavigationView/modalNavigation.module.css'
import ModalNavigationView from './ModalNavigationView'

export default function GameOverlay () {
  return <div className={styles.overlayContainerView}>
    <ModalNavigationView/>
  </div>
}