import styles from './modalNavigation.module.css'
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import agoraManager from '../../services/AgoraManager';


interface ItemProps  {
  title: string;
  imageLink: string;
  onTap: () => void
}


export default function TabBar() {

  const [isMicMuted, setMicMuted] = useState<boolean>(false)


  

  const onMicMuteTap = () => {
    agoraManager.muteAudio(!isMicMuted);
    setMicMuted(!isMicMuted);
  }

  const muteMicItemProps: ItemProps = {
    title: isMicMuted ? "Mic is muted" : "Mic is on",
    imageLink: isMicMuted ? './images/ModalNavigationView/mic-muted.svg' : './images/ModalNavigationView/mic-on.svg',
    onTap: onMicMuteTap
  }



  return <div className={styles.tabBarContainer}>
    {
      <TabBarItem {...muteMicItemProps}/>
      
    }
  </div>
}


const TabBarItem = (props: ItemProps) => {
  return <div className={styles.tabBarItem} onClick={props.onTap}>
    <img src={props.imageLink} className={styles.tabBarIcon}/>
    <span className={styles.tabBarTitle}>{props.title}</span>
  </div>

}