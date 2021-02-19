import styles from './styles.module.scss'
import React, { useEffect, useState, useRef } from 'react'
import agoraManager from '../../services/AgoraManager';
import { gameManager } from '../../game/GameManager';
import { setMicToMute } from '../../game/Game/Participants';

interface ItemProps {
  title: string;
  imageLink: string;
  onTap: () => void
}

export default function TabBar() {

  const [isMicMuted, setMicMuted] = useState<boolean>(true)

  useEffect(() => {
    agoraManager.muteAudio(isMicMuted)
  }, [])

  const onMicMuteTap = () => {

    const game = gameManager.currentGame

    if (game) {
      agoraManager.muteAudio(!isMicMuted);
      setMicToMute(game, { state: !isMicMuted })
      setMicMuted(!isMicMuted);
    }
    
  }

  const muteMicItemProps: ItemProps = {
    title:     isMicMuted ? "Mic is muted" : "Mic is on",
    imageLink: isMicMuted ? './images/ModalNavigationView/mic-muted.svg' : './images/ModalNavigationView/mic-on.svg',
    onTap:     onMicMuteTap
  }

  return <div className={styles.tabBarContainer}>
    <TabBarItem {...muteMicItemProps}/>
  </div>
}

const TabBarItem = (props: ItemProps) => {
  return <div className={styles.tabBarItem} onClick={props.onTap}>
    <img src={props.imageLink} className={styles.tabBarIcon}/>
    <span className={styles.tabBarTitle}>{props.title}</span>
  </div>

}