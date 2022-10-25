export default ({ app, db, synchronizer }) => {
  app.get('/api/canon', async (req, res) => {

    const currentEpoch = synchronizer.calcCurrentEpoch()
    const canon = await db.findMany('Canon', {
      where: {
        epoch: {
          gt: 0,
          lt: currentEpoch,
        }
      }
    })
    const sections = await db.findMany('Section', {
      where: {
        id: canon.map(({ sectionId }) => sectionId),
      }
    })
    res.json({ items: canon, sections })

  })
}
