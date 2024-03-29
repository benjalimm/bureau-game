import { HashTable } from '../models/Common'
import agoraManager from '../services/AgoraManager'
import { socketManager } from '../services/SocketManager'
import Game, { game as initialGame } from './Game'

type OnGameChangeFunc = (game: Game) => void

class GameManager {
  private game?: Game 
  private onGameChangeFunc?: OnGameChangeFunc
  get currentGame(): Game | undefined {
    return this.game;
  }
  private onInitialize: OnGameChangeFunc
  
  onGameChange(func: OnGameChangeFunc) {
    this.onGameChangeFunc = func;

    /// If current game already exists, immediately execute func
    if (this.currentGame) {
      func(this.currentGame)
    }
  }

  private onGameInitialize(func: OnGameChangeFunc) {
    this.onInitialize = func;
  }

  gameDidInitialize(): Promise<Game> {
    console.log("Checking for game initialization")
    return new Promise((res, rej) => {

      if (this.game) {
        console.log("Immediately resolving with existing game")
        res(this.game)
      } else { 
        this.onGameInitialize((game) => {
          console.log("Game is resolving asynchronously in game manager")
          res(game)
        })
      }
    })
  }
  
  setCurrentGame(game: Game) {
    console.log("Setting current game")
    if (this.game === undefined) {
      this.onInitialize(game)
    }

    this.game = game 
    if (this.onGameChangeFunc) {
      this.onGameChangeFunc(game)
    }
  }

  async initializeGame(roomId: string) {
    await this.gameDidInitialize()
    await socketManager.connect();
    await agoraManager.setupListeners() /// Setup listeners before joining channel
    const agoraUid = await agoraManager.joinChannel(roomId)
    socketManager.joinRoom(roomId, `${agoraUid}`)
    await agoraManager.setupAudio()
  }
}

const gameManager = new GameManager()

export { gameManager }