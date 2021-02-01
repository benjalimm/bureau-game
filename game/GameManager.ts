import { HashTable } from '../models/Common'
import Game from './Game'

type OnGameChangeFunc = (game: Game) => void
class GameManager {
  private game?: Game 
  private onGameChangeFunc?: OnGameChangeFunc
  get currentGame(): Game | undefined {
    return this.game 
  }
  
  onGameChange(func: OnGameChangeFunc) {
    this.onGameChangeFunc = func;

    /// If current game already exists, immediately execute func
    if (this.currentGame) {
      func(this.currentGame)
    }
  }
  
  setCurrentGame(game: Game) {
    console.log("Setting current game")
    this.game = game 
    if (this.onGameChangeFunc) {
      this.onGameChangeFunc(game)
    }
  }


}

const gameManager = new GameManager()

export { gameManager }