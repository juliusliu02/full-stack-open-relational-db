const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year_written', {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isValidYear(value) {
          const currentYear = new Date().getFullYear()
          if (value < 1991 || value > currentYear) {
            throw new Error(`Year must be greater than 1991 and less than ${currentYear}.`)
          }
        }
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'year_written')
  },
}