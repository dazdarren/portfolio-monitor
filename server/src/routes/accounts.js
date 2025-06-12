const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Plaid integration routes
router.post('/link-token', accountController.createLinkToken);
router.post('/exchange-token', accountController.exchangePublicToken);

// Account management routes
router.get('/', accountController.getAccounts);
router.post('/:accountId/sync', accountController.syncAccount);
router.delete('/:accountId', accountController.deleteAccount);

module.exports = router; 