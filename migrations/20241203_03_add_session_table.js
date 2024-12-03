const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('sessions', {
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('sessions')
  },
}