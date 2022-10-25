import React from 'react'
import { observer } from 'mobx-react-lite'
import './home.css'
import HSelector from './components/HSelector'
import Button from './components/Button'
import Section from './components/Section'
import CanonSection from './components/CanonSection'

import User from './contexts/User'
import Canon from './contexts/canon'

const initSection = `James awoke. He felt startled as he looked around his familiar bedroom. Everything looked normal, but something seemed amiss. James put his cold feet on the floor and walked to the themostat. He felt somehow not in control, but also unusually... free. He shrugged off the lingering feelings of the unknown and went downstairs to find his wife.
Suddenly James realized his apartment was only one floor; there is no "downstairs". With a feeling of dread James entered the kitchen only to find it empty. His appetite abated as he realized he was unmarried. "Why did I think that?" "Are these delusions?" "Am I losing my mind?" James' mind raced and he felt nauseous. He drank some water then left his apartment. As he walked down the sparsely crowded street in the calm morning light he felt his life had changed in a way he was only beginning to comprehend.`
const nextSection = `lorem ipseum lorem ipseumlorem ipseumlorem ipseumlorem ipseumlorem ipseumlorem ipseumlorem ipseum`

const voteSections = ['test1', 'test2', 'test3', 'test4']
export default observer(() => {
  const [isWriting, setIsWriting] = React.useState(false)
  const [writing, setWriting] = React.useState('')
  const [graffiti, setGraffiti] = React.useState('')
  const userContext = React.useContext(User)
  const canonContext = React.useContext(Canon)
  const [remainingTime, setRemainingTime] = React.useState(0)
  const updateTimer = () => {
    const time = userContext.userState.calcEpochRemainingTime()
    setRemainingTime(time)
  }
  React.useEffect(() => {
    setInterval(() => {
      updateTimer()
    }, 1000)
  }, [])

  return (
    <div className="container">
      <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
        <div style={{fontWeight: "bold"}}>crowd canon</div>
        {!userContext.hasSignedUp ?
          (<Button onClick={() => userContext.signup()}>Join</Button>) : <div>Remaining time in epoch: {remainingTime}</div>}
      </div>
      {canonContext.canon.length === 0 ? <div style={{ marginTop: '5px', alignSelf: 'center'}}>This is epoch 0, vote for the entries below!</div> : null}
      {canonContext.canon.map(({ sectionId }) => (
        <CanonSection key={sectionId} id={sectionId} />
      ))}
      <div className="end-divider">
        -- End of canonical story. Vote on the next sections below. --
      </div>
      {
        !isWriting && (
          <>
            <Button style={{alignSelf: 'flex-start'}} onClick={() => setIsWriting(true)}>Write</Button>
            <HSelector sectionIds={canonContext.sections.map(({ id }) => id)} />
          </>
        )
      }
      {
        isWriting && (
          <>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setIsWriting(false)}>Cancel</Button>
              <Button onClick={() => userContext.submitSection(writing, graffiti).then(() => setIsWriting(false))}>Submit</Button>
            </div>
            <textarea placeholder="Write your content here" onChange={(e) => setWriting(e.target.value)} value={writing} />
            <textarea placeholder="Write your graffiti here" onChange={(e) => setGraffiti(e.target.value)} value={graffiti} />
          </>
        )
      }
    </div>
  )
})
