const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Account = require('./Account');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  accountId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Account,
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('deposit', 'withdrawal', 'transfer', 'interest', 'dividend', 'fee', 'other'),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  plaidTransactionId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
});

// Define associations
Transaction.belongsTo(Account, { foreignKey: 'accountId' });
Account.hasMany(Transaction, { foreignKey: 'accountId' });

module.exports = Transaction; 