import { HashTable } from '../models/Common'

export default class KeyboardManager {
  private _pressedKeys: HashTable<boolean> = {}
  private _enabled: boolean = true
  
  get pressedKeys(): HashTable<boolean> {
    return this._pressedKeys
  }

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (event) => {
        console.log(event)
        this._pressedKeys[event.key] = true;
      });
      
      window.addEventListener('keyup', (event) => {
        this._pressedKeys[event.key] = false
      });
    }
  }

  clearPressedKeys() {

  }

  setKeysToEnabled(enabled: boolean) {
    this._enabled = enabled
    this.clearPressedKeys()
  }

}

const keyboardManager = new KeyboardManager()
export { keyboardManager }