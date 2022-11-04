import { createContext} from 'react'
import { makeAutoObservable } from 'mobx'

class Highlights {

  sectionKey = 0
  joinKey = 0

  constructor() {
    makeAutoObservable(this)
    this.load()
  }

  async load() {
  }

  section() {
    this.sectionKey++
  }

  join() {
    this.joinKey++
    window.scrollTo(0, 0)
  }

}

export const highlights = new Highlights()
export default createContext(highlights)
