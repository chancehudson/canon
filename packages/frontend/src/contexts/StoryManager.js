import { createContext } from 'react'
import { makeAutoObservable } from 'mobx'

class StoryManager {
  constructor() {
    makeAutoObservable(this)
  }

  async load() {}
}

export default createContext(new StoryManager())
