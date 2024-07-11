const express = require('express');
const { auth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const orgValidation = require('../validations/organisation.validation');
const orgController = require('../controllers/organisation.controller');

const router = express.Router();

router
  .route('/')
  .post(auth, validate(orgValidation.createorganisation), orgController.createorganisation)
  .get(auth, validate(orgValidation.getorganisations), orgController.getorganisations);

router.get('/:orgId', auth, validate(orgValidation.getorganisationById), orgController.getorganisationById);
router.post('/:orgId/users', auth, validate(orgValidation.addUserToorganisation), orgController.addUserToorganisation);

module.exports = router;
