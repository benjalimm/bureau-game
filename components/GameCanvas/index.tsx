import React, { useEffect, useRef,  } from 'react'
import  { game } from '../../game/Game'
import { gameManager } from '../../game/GameManager'
import styles from './styles.module.scss'

export default function GameCanvas() {
  const mount = useRef(null)
  // const game = new Game()

  useEffect(() => {
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
    
    return () => {
      stop()
      window.removeEventListener('resize', handleResize)

      if (mount.current) {
        mount.current.removeChild(renderer.domElement)
      }
      
      game.deinitialize()
    }
  }, [])
  
  return <div className={styles.vis} ref={mount} />
}