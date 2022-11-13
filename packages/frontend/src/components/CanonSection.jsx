import React from 'react'
import './canonsection.css'
import { observer } from 'mobx-react-lite'
import Canon from '../contexts/canon'
import User from '../contexts/User'
import Highlight from '../contexts/highlights'
import Button from './Button'
import Tooltip from './Tooltip'

export default observer(({ id, draft, enableVote }) => {
  const canonContext = React.useContext(Canon)
  const userContext = React.useContext(User)
  const highlightContext = React.useContext(Highlight)
  const section = canonContext.sectionsById[id] ?? draft
  if (!section) {
    return (<div>unable to find section</div>)
  }
        //<div>{`0x${BigInt(section.author).toString(16)}`}</div>
  return (
    <div className="canon-section">
      <div className="meta-text-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>

        {
          enableVote ?
          <Button style={{ fontSize: '12px' }} onClick={() => {
            if (userContext.hasSignedUp)
              return userContext.voteSection(section.id)
            else
              highlightContext.join()
          }}>Vote</Button> :
          <Tooltip
            text={section.isEditorial ? 'This is a note from the operator, not part of the canon.' : `This was authored in epoch ${section.epoch} by ${section.author}.`}
            imgSrc={section.isEditorial ? null : require('../../public/canon.svg')}
          />
        }
        <div style={{ flex: 1 }} />
        <div style={{ marginRight: '4px' }}>{section.voteCount ?? 0}</div>
        <img width="16px" src={require('../../public/heart.svg')} />
        </div>
        <div className="meta-text">{section.graffiti}</div>
      </div>
      <div className="divider" />
      <div className="canon-text-container">
        <div className="canon-text">{section.content}</div>
      </div>
    </div>
  )
})
