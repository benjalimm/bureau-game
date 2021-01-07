import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useEffect, useRef, useState } from 'react'
import Game from '../game/game'
import * as THREE from 'three'
import { GammaEncoding } from 'three'


export default function Home() {
  const mount = useRef(null)
  const [isAnimating, setAnimating] = useState(true)
  const controls = useRef(null)
  const game = new Game()

  useEffect(() => {
    let width = mount.current.clientWidth
    let height = mount.current.clientHeight
    let frameId

    game.initialize(height, width)
    const renderer = game.renderer

    
    const animate = () => {
      
      game.animate()
      game.renderScene()
      frameId = window.requestAnimationFrame(animate)
    }

    const start = () => {
      if (!frameId) {
        frameId = requestAnimationFrame(animate)
      }
    }

    const stop = () => {
      cancelAnimationFrame(frameId)
      frameId = null
    }

    const handleResize = () => {
      game.handleResize(height, width)
    }

    mount.current.appendChild(renderer.domElement)
    window.addEventListener('resize', handleResize)
    start()

    // controls.current = { start, stop }
    
    return () => {
      stop()
      window.removeEventListener('resize', handleResize)
      mount.current.removeChild(renderer.domElement)

      game.deinitialize()
      // geometry.dispose()
      // material.dispose()
    }
  }, [])

  useEffect(() => {
    if (isAnimating) {
      controls.current.start()
    } else {
      controls.current.stop()
    }
  }, [isAnimating])
  
  return <div className="vis" ref={mount} onClick={() => setAnimating(!isAnimating)} />
}
