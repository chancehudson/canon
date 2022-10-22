import React from 'react'
import './button.css'

export default ({ style, children, loadingText, onClick }) => {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const handleClick = async () => {
    if (loading) return
    if (typeof onClick !== 'function') return
    try {
      setLoading(true)
      const res = onClick()
      if (typeof res === 'object' && typeof res.then === 'function') {


      }
    } catch (err) {
      setError(err.toString())
      setTimeout(() => setError(''), 2000)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="button-outer" style={{ ...(style || {} )}}>
      <div className="button-inner" onClick={handleClick}>
        {!loading && !error ? children : null}
        {loading ? (loadingText ?? 'Loading...') : null}
        {error ? error : null}
      </div>
    </div>
  )
}
