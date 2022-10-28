import React from 'react'
import './canonsection.css'
import { observer } from 'mobx-react-lite'
import Canon from '../contexts/canon'
import User from '../contexts/User'
import Button from './Button'

export default observer(({ id }) => {
  const canonContext = React.useContext(Canon)
  const userContext = React.useContext(User)
  const section = canonContext.sectionsById[id]
  if (!section) {
    return (<div>unable to find section</div>)
  }
        //<div>{`0x${BigInt(section.author).toString(16)}`}</div>
  return (
    <div className="canon-section">
      <div className="meta-text">
        <div style={{ display: 'flex', justifyContent: 'flex-end'}}>

        <img width="16px" src={require('../../public/info.svg')} />
        <div style={{ flex: 1 }} />
        <div style={{ marginRight: '4px' }}>{section.voteCount}</div>
        <img width="16px" src={require('../../public/heart.svg')} />
        </div>
        <div>{section.graffiti}</div>
      </div>
      <div className="divider" />
      <div className="canon-text">
        <div>{section.content}</div>
      </div>
    </div>
  )
})
