const router = require('express').Router()

const { User, Blog} = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const where = {}
  if (req.query.read !== undefined) {
    where.read = req.query.read
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [''] },
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId']},
        through: {
          as: 'readinglists',
          attributes: ['read', 'id'],
          where
      }
    }]
  })

  res.json(user)
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username }})
  if (user) {
    if (req.body.username) {
      user.username = req.body.username
      await user.save()
      res.json(user)
    } else {
      res.status(400).json({ error: 'New username is required' })
    }
  } else {
    res.status(404).end()
  }
})

module.exports = router