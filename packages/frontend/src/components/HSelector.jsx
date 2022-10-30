import React from 'react'
import './hselector.css'
import { observer } from 'mobx-react-lite'
import Section from './Section'
import CanonSection from './CanonSection'

export default observer(({ sectionIds, children, onChange }) => {
  const [visibleSection, setVisibleSection] = React.useState(0)
  const nextSection = () => {
    const next = Math.min(sectionIds.length - 1, visibleSection + 1)
    ;(onChange || (() => {}))(next)
    setVisibleSection(next)
  }
  const prevSection = () => {
    const prev = Math.max(0, visibleSection - 1)
    ;(onChange || (() => {}))(prev)
    setVisibleSection(prev)
  }
  return (
    <div className="selector-outer">
      <div style={{ display: 'flex' }}>
        <div className="vertical-button" onClick={prevSection}>
          <img width="16px" src={require('../../public/chevron_left.svg')} />
        </div>
        <div className="vertical-button" onClick={nextSection}>
          <img width="16px" src={require('../../public/chevron_right.svg')} />
        </div>
      </div>
    <div className="selector-inner">
      <div style={{ width: '4px' }} />
      <div className="selector-item">
        {sectionIds.length ?
          <Section id={sectionIds[visibleSection]} /> :
          <div>No sections to vote on. You should write one!</div>
        }
      </div>
      <div style={{ width: '4px' }} />
      </div>
    </div>
  )
})
