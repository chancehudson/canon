export default ({ app, db, synchronizer }) => {
  app.get('/api/section', async (req, res) => {

    try {
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
        },
        orderBy: {
          voteCount: 'desc',
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
    } catch (error) {
      res.status(500).json({ error })
    }

  })
}
