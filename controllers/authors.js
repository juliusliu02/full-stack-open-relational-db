const router = require('express').Router()
const { Blog } = require('../models');
const {sequelize} = require("../util/db");

router.get('/', async (req, res) => {
  const result = await Blog.findAll({
    group: "author",
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('title')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
    ],
  })

  return res.json(result)
})

module.exports = router