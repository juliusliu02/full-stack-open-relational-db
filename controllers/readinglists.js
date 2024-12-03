const router = require('express').Router()
const { UserBlogs } = require('../models')

router.post('/', async (req, res) => {
  if (!req.body.blogId || !req.body.userId) {
    res.status(400).send({error: 'Bad request'})
  }

  try {
    const result = await UserBlogs.create(req.body)
    res.status(200).send(result)
  } catch (error) {
    console.log(error)
    res.status(400).send(error)
  }
})

router.put('/:id', async (req, res) => {
  const record = await UserBlogs.findByPk(req.params.id);
  if (!record) {
    res.status(404).send({error: 'Not Found'})
    return
  }

  if (req.body.read === undefined) {
    res.status(400).send({error: 'Bad request'})
    return
  }

  record.read = req.body.read
  try {
    await record.save();
    res.status(200).send(record)
  } catch (error) {
    res.status(400).send(error)
  }

})

module.exports = router