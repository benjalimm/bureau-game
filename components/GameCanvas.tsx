import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useEffect, useRef, useState } from 'react'
import Game from '../game/game'
import * as THREE from 'three'
import { GammaEncoding } from 'three'


export default function GameCanvas() {
  const mount = useRef(null)
  const [isAnimating, setAnimating] = useState(true)
  const controls = useRef(null)
  const game = new Game()

  useEffect(() => {
    Game.current = game 
    let width = mount.current.clientWidth
    let height = mount.current.clientHeight
    let frameId: number;

    // Initial setup for Three JS 
    game.initialize(height, width)
    const renderer = game.renderer
    mount.current.appendChild(renderer.domElement)

    const animate = () => {
      game.animate()
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
      game.handleResize(mount.current.clientHeight, mount.current.clientWidth)
    }

    function keyDown(event){
      game.keyDidInteract(event.keyCode, true)
    }
    
    function keyUp(event){
      game.keyDidInteract(event.keyCode, false)
    }
    

    const addWindowListeners = () => {
      window.addEventListener('resize', handleResize)

      ///Listen to pressing of keys
      window.addEventListener('keydown', keyDown);
      window.addEventListener('keyup', keyUp);
    }

    
    start()
    addWindowListeners()

    // controls.current = { start, stop }
    
    return () => {
      stop()
      window.removeEventListener('resize', handleResize)

      if (mount.current) {
        mount.current.removeChild(renderer.domElement)
      }
      

      game.deinitialize()
      // geometry.dispose()
      // material.dispose()
    }
  }, [])

  // useEffect(() => {
  //   if (isAnimating) {
  //     controls.current.start()
  //   } else {
  //     controls.current.stop()
  //   }
  // }, [isAnimating])
  
  return <div className="vis" ref={mount} />
}