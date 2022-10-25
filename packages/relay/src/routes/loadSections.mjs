export default ({ app, db, synchronizer }) => {
  app.get('/api/section', async (req, res) => {

    const epoch = synchronizer.calcCurrentEpoch()
    const currentCanon = await db.findOne('Canon', {
      where: {
        epoch,
      }
    })
    const sections = await db.findMany('Section', {
      where: {
        epoch,
        confirmed: 1,
      }
    })
    if (currentCanon) {
      for (const s of sections) {
        if (s.id === currentCanon.sectionId) {
          s.winner = true
        }
      }
    }
    res.json({
      items: sections,
    })

  })
}
