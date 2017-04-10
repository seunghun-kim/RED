const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  stoarage: __dirname + '/db.sqlite',
  logging: false
});

const Red = sequelize.define('RED', {
  category: {
    type: Sequelize.STRING(100),
    unique: true
  },
  title: {
    type: Sequelize.STRING(100)
  },
  contents: {
    type: Sequelize.STRING(2000)
  },
  code: {
    type: Sequelize.STRING(3000)
  },
  readCount: {
    type: Sequelize.INTEGER
  },
  isKnown: {
    type: Sequelize.STRING(1),
    defaultValue: 'N'
  }
});

module.exports = {
  sequelize, Red
}