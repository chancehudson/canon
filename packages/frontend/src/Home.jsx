import React from 'react'
import './home.css'
import HSelector from './components/HSelector'
import Button from './components/Button'
import User from './contexts/User'

const initSection = `James awoke. He felt startled as he looked around his familiar bedroom. Everything looked normal, but something seemed amiss. James put his cold feet on the floor and walked to the themostat. He felt somehow not in control, but also unusually... free. He shrugged off the lingering feelings of the unknown and went downstairs to find his wife.
Suddenly James realized his apartment was only one floor; there is no "downstairs". With a feeling of dread James entered the kitchen only to find it empty. His appetite abated as he realized he was unmarried. "Why did I think that?" "Are these delusions?" "Am I losing my mind?" James' mind raced and he felt nauseous. He drank some water then left his apartment. As he walked down the sparsely crowded street in the calm morning light he felt his life had changed in a way he was only beginning to comprehend.`
const nextSection = `lorem ipseum lorem ipseumlorem ipseumlorem ipseumlorem ipseumlorem ipseumlorem ipseumlorem ipseum`

const voteSections = ['test1', 'test2', 'test3', 'test4']
export default () => {
  const [isWriting, setIsWriting] = React.useState(false)
  const [writing, setWriting] = React.useState('')
  const userContext = React.useContext(User)
  return (
    <div className="container">
      <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
        <div style={{fontWeight: "bold"}}>crowd canon</div>
        {userContext.hasSignedUp ?
          (<Button onClick={() => userContext.signup()}>Join</Button>) : null}
      </div>
      <div className="container">
        <div className="story">{initSection}</div>
      </div>
      <div className="container">
        <div className="story">{nextSection}</div>
      </div>
      <div className="end-divider">
        -- End of canonical story. Vote on the next sections below. --
      </div>
      {
        !isWriting && (
          <>
            <Button style={{alignSelf: 'flex-start'}} onClick={() => setIsWriting(true)}>Write</Button>
            <HSelector sections={voteSections} />
          </>
        )
      }
      {
        isWriting && (
          <>
            <Button style={{alignSelf: 'flex-start'}} onClick={() => setIsWriting(false)}>Cancel</Button>
            <textarea onChange={(e) => setWriting(e.target.value)} value={writing} />
          </>
        )
      }
    </div>
  )
}
