require('dotenv').config()
const { Sequelize, QueryTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL);

const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')

    const blogs = await sequelize.query('SELECT * FROM blogs', { type: QueryTypes.SELECT });
    blogs.map(blog => {
      console.log(`${blog.title} - ${blog.author}, ${blog.likes} likes`);
    })

    await sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    await sequelize.close()
  }
}

main()