import React, { useEffect, useRef,  } from 'react'
import  { game } from '../../game/Game'
import { gameManager } from '../../game/GameManager'
import styles from './styles.module.scss'

export default function GameCanvas() {
  const mount = useRef(null)

  useEffect(() => {

    // Only set if game doesn't already exist
    if (!gameManager.currentGame) {
      const width = mount.current.clientWidth
      const height = mount.current.clientHeight
      let frameId: number;

      // Initial setup for Three JS 
      game.initialize(height, width)
      gameManager.setCurrentGame(game);
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

      const addWindowListeners = () => {
        window.addEventListener('resize', handleResize)

      }
    
      start()
      addWindowListeners()

      return () => {
        stop()
        window.removeEventListener('resize', handleResize)

        if (mount.current) {
          mount.current.removeChild(renderer.domElement)
        }
      
        game.deinitialize()
      }
    }
    return () => {}
  }, [])
  
  return <div className={styles.vis} ref={mount} />
}