import React from 'react'
import './hselector.css'

export default ({ sections }) => {
  const [visibleSection, setVisibleSection] = React.useState(0)
  const nextSection = () => {
    const next = Math.min(sections.length - 1, visibleSection + 1)
    setVisibleSection(next)
  }
  const prevSection = () => {
    const prev = Math.max(0, visibleSection - 1)
    setVisibleSection(prev)
  }
  return (
    <div className="selector-outer">
      <div className="vertical-button" onClick={prevSection}>
      </div>
      <div className="selector-item">
        <div>
        Submitted By: 0x212008aa0b0a8
        </div>
        {sections[visibleSection]}
      </div>
      <div className="vertical-button" onClick={nextSection}>
      </div>
    </div>
  )
}
