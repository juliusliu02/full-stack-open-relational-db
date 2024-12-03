const { Blog, User } = require("../models");
const router = require('express').Router()
const jwt = require('jsonwebtoken');
const { SECRET } = require("../util/config");
const { Op } = require("sequelize");
const { tokenExtractor } = require("../util/middleware");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        { title: {[Op.substring]: req.query.search} },
        { author: {[Op.substring]: req.query.search} }
      ]
    }
  }


  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [['likes', 'DESC']]
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id })
    return res.json(blog)
  } catch (error) {
    return res.status(400).send(error)
  }
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  if (!req.blog) {
    return res.status(404).send({ error: 'blog not found' })
  }

  if (req.decodedToken.id === req.blog.userId) {
    await req.blog.destroy()
    return res.status(204).send()
  } else {
    return res.status(400).send({ error: 'you are not the creator of this blog' })
  }
})

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.body)
  } else {
    return res.status(404).send()
  }
})

module.exports = router