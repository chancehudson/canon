import React from 'react'
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
  return (
    <div style={{ marginTop: '2px', display: 'flex', flexDirection: 'row', border: '1px solid black' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '180px' }}>
        <div>Author: {`0x${BigInt(section.author).toString(16)}`}</div>
        <div>Votes: {section.voteCount}</div>
        <div>Graffiti: {section.graffiti}</div>
      </div>
      <div style={{ height: '100%', width: '1px', background: 'black'}} />
      <div style={{ marginLeft: '10px' }}>
        <div>{section.content}</div>
      </div>
    </div>
  )
})
