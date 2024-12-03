const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../util/db");

class Session extends Model {
  static async isValid(value) {
    if (await Session.findByPk(value)) {
      return true;
    }
    return false;
  }
}

Session.init({
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'session',
})

module.exports = Session