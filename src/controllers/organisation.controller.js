const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { db } = require('../models');

const createorganisation = catchAsync(async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id;

  const existingOrg = await db.organisation.findOne({ where: { name } });
  if (existingOrg) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Organisation with the same name already exists');
  }

  const organisation = await db.organisation.create({
    name,
    description,
  });

  await organisation.addUser(userId);

  res.status(httpStatus.CREATED).json({
    status: 'success',
    message: 'Organisation created successfully',
    data: {
      orgId: organisation.id,
      name: organisation.name,
      description: organisation.description,
    },
  });
});

const getorganisationById = catchAsync(async (req, res) => {
  const { orgId } = req.params;
  const userId = req.user.id;

  const organisation = await db.organisation.findOne({
    where: { id: orgId },
    include: {
      model: db.users,
      as: 'users',
      where: { id: userId },
    },
  });

  if (!organisation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Organisation not found');
  }

  res.status(httpStatus.OK).json({
    status: 'success',
    message: 'Organisation fetched successfully',
    data: {
      orgId: organisation.id,
      name: organisation.name,
      description: organisation.description,
    },
  });
});

const getorganisations = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const options = {
    offset: (page - 1) * limit,
    limit,
  };

  const { count, rows: organisations } = await db.organisation.findAndCountAll({
    limit: options.limit,
    offset: options.offset,
    include: {
      model: db.users,
      as: 'users',
      where: { id: userId },
    },
  });
  const totalPages = Math.ceil(count / limit);

  res.status(httpStatus.OK).json({
    status: 'success',
    message: 'Organisations fetched successfully',
    data: {
      organisations: organisations.map((org) => ({
        orgId: org.id,
        name: org.name,
        description: org.description,
      })),
    },
    page,
    limit,
    totalPages,
  });
});

const addUserToorganisation = catchAsync(async (req, res) => {
  const { orgId } = req.params;
  const { userId } = req.body;

  const organisation = await db.organisation.findByPk(orgId);

  if (!organisation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Organisation not found');
  }

  await organisation.addUser(userId);

  res.status(httpStatus.OK).json({
    status: 'success',
    message: 'User added to organisation successfully',
  });
});

module.exports = {
  createorganisation,
  getorganisationById,
  getorganisations,
  addUserToorganisation,
};
