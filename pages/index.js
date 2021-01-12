import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useEffect, useRef, useState } from 'react'
import Game from '../game/game'
import * as THREE from 'three'
import GameCanvas from '../components/gameCanvas'
import GameOverlay from '../components/GameOverlay'

export default function Home() {
  return (
    <div>
      <GameCanvas/>
      <GameOverlay/>
    </div>
  )
}

