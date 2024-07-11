const Joi = require('joi');

const createorganisation = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().optional(),
  }),
};

const getorganisationById = {
  params: Joi.object().keys({
    orgId: Joi.alternatives()
      .try(Joi.string().guid({ version: 'uuidv4' }), Joi.string().valid('general'))
      .required(),
  }),
};

const getorganisations = {
  query: Joi.object().keys({
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const addUserToorganisation = {
  params: Joi.object().keys({
    orgId: Joi.alternatives()
      .try(Joi.string().guid({ version: 'uuidv4' }), Joi.string().valid('general'))
      .required(),
  }),
  body: Joi.object().keys({
    userId: Joi.alternatives()
      .try(Joi.string().guid({ version: 'uuidv4' }), Joi.string().valid('general'))
      .required(),
  }),
};

module.exports = {
  createorganisation,
  getorganisationById,
  getorganisations,
  addUserToorganisation,
};
