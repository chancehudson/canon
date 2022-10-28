import React from 'react'
import './hselector.css'
import { observer } from 'mobx-react-lite'
import Section from './Section'

export default observer(({ sectionIds, children }) => {
  const [visibleSection, setVisibleSection] = React.useState(0)
  const nextSection = () => {
    const next = Math.min(sectionIds.length - 1, visibleSection + 1)
    setVisibleSection(next)
  }
  const prevSection = () => {
    const prev = Math.max(0, visibleSection - 1)
    setVisibleSection(prev)
  }
  return (
    <div className="selector-outer">
      <div className="vertical-button" onClick={prevSection}>
        <img width="100%" src={require('../../public/chevron_left.svg')} />
      </div>
      <div style={{ width: '4px' }} />
      <div className="selector-item">
        {sectionIds.length ?
          <Section id={sectionIds[visibleSection]} /> :
          <div>No sections to vote on. You should write one!</div>
        }
      </div>
      <div style={{ width: '4px' }} />
      <div className="vertical-button" onClick={nextSection}>
        <img width="100%" src={require('../../public/chevron_right.svg')} />
      </div>
    </div>
  )
})
