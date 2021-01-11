import styles from '../styles/modalNavigation.module.css'
import ModalNavigationView from './ModalNavigationView/modalNavigation'
export default function OverlayContainerView () {
  return <div className={styles.overlayContainerView}>
    <ModalNavigationView/>
  </div>
}