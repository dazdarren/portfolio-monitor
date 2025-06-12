const plaidClient = require('../config/plaid');
const { Account, Transaction } = require('../models');

// Create a link token for Plaid Link
exports.createLinkToken = async (req, res) => {
  try {
    const { userId } = req.user;
    const request = {
      user: { client_user_id: userId },
      client_name: 'Portfolio Monitor',
      products: ['auth', 'transactions'],
      country_codes: ['US'],
      language: 'en',
    };

    const response = await plaidClient.linkTokenCreate(request);
    res.json(response.data);
  } catch (error) {
    console.error('Create link token error:', error);
    res.status(500).json({ message: 'Error creating link token' });
  }
};

// Exchange public token for access token and create account
exports.exchangePublicToken = async (req, res) => {
  try {
    const { publicToken, metadata } = req.body;
    const { userId } = req.user;

    // Exchange public token for access token
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;

    // Get account details from Plaid
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    // Create accounts in database
    const accounts = await Promise.all(
      accountsResponse.data.accounts.map(async (account) => {
        return await Account.create({
          userId,
          name: account.name,
          type: account.type,
          institution: metadata.institution.name,
          balance: account.balances.current,
          currency: account.balances.iso_currency_code,
          plaidItemId: itemId,
          plaidAccessToken: accessToken,
          plaidAccountId: account.account_id,
          lastSync: new Date(),
        });
      })
    );

    res.json({
      message: 'Accounts connected successfully',
      accounts,
    });
  } catch (error) {
    console.error('Exchange public token error:', error);
    res.status(500).json({ message: 'Error connecting accounts' });
  }
};

// Get all accounts for user
exports.getAccounts = async (req, res) => {
  try {
    const { userId } = req.user;
    const accounts = await Account.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    res.json(accounts);
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ message: 'Error fetching accounts' });
  }
};

// Sync account data
exports.syncAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const account = await Account.findOne({
      where: { id: accountId, userId: req.user.id },
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Get latest transactions from Plaid
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    const transactionsResponse = await plaidClient.transactionsGet({
      access_token: account.plaidAccessToken,
      start_date: thirtyDaysAgo.toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      options: {
        account_ids: [account.plaidAccountId],
      },
    });

    // Update account balance
    const accountsResponse = await plaidClient.accountsGet({
      access_token: account.plaidAccessToken,
    });

    const plaidAccount = accountsResponse.data.accounts.find(
      (a) => a.account_id === account.plaidAccountId
    );

    await account.update({
      balance: plaidAccount.balances.current,
      lastSync: new Date(),
    });

    // Create or update transactions
    const transactions = transactionsResponse.data.transactions;
    await Promise.all(
      transactions.map(async (transaction) => {
        const [dbTransaction] = await Transaction.findOrCreate({
          where: { plaidTransactionId: transaction.transaction_id },
          defaults: {
            accountId: account.id,
            date: transaction.date,
            amount: transaction.amount,
            type: transaction.transaction_type,
            description: transaction.name,
            category: transaction.category?.[0],
            metadata: transaction,
          },
        });

        if (dbTransaction) {
          await dbTransaction.update({
            amount: transaction.amount,
            type: transaction.transaction_type,
            description: transaction.name,
            category: transaction.category?.[0],
            metadata: transaction,
          });
        }
      })
    );

    res.json({
      message: 'Account synced successfully',
      account,
    });
  } catch (error) {
    console.error('Sync account error:', error);
    res.status(500).json({ message: 'Error syncing account' });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const account = await Account.findOne({
      where: { id: accountId, userId: req.user.id },
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Delete Plaid item
    if (account.plaidItemId) {
      await plaidClient.itemRemove({
        access_token: account.plaidAccessToken,
      });
    }

    // Delete account and associated transactions
    await Transaction.destroy({ where: { accountId } });
    await account.destroy();

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Error deleting account' });
  }
}; 