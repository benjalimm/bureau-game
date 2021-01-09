import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useEffect, useRef, useState } from 'react'
import Game from '../game/game'
import * as THREE from 'three'
import { GammaEncoding } from 'three'
import GameCanvas from '../components/gameCanvas'
import ModalNavigation from '../components/modalNavigation'

export default function Home() {
  return (
    <div>
      <GameCanvas/>
      <ModalNavigation/>
    </div>
  )
}

