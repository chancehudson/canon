import { createContext} from 'react'
import { makeAutoObservable } from 'mobx'
import { SERVER } from '../config'

class Canon {

  hasSignedUp = false
  canon = []
  sections = []
  sectionsById = {}

  constructor() {
    makeAutoObservable(this)
    this.load()
  }

  async load() {
    this.loadCanon()
    this.loadSections()
    setInterval(() => {
      this.loadCanon()
      this.loadSections()
    }, 10000)
  }

  async loadCanon() {
    const data = await fetch(`${SERVER}/api/canon`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },
    }).then(r => r.json())
    this.canon = data.items
    this.ingestSections(data.sections)
  }

  async loadSections() {
    const data = await fetch(`${SERVER}/api/section`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },
    }).then(r => r.json())
    this.sections = data.items
    this.ingestSections(data.items)
  }

  async ingestSections(sections) {
    for (const section of sections) {
      const { id } = section
      this.sectionsById = { ...this.sectionsById, [id]: section }
    }
  }

}

export const canon = new Canon()
export default createContext(canon)
