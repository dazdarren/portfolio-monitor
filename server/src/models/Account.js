const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('bank', 'brokerage', 'investment', 'crypto', 'real_estate', 'other'),
    allowNull: false
  },
  institution: {
    type: DataTypes.STRING,
    allowNull: false
  },
  balance: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'USD'
  },
  plaidItemId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  plaidAccessToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastSync: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
});

// Define associations
Account.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Account, { foreignKey: 'userId' });

module.exports = Account; 