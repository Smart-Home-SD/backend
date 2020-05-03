const express = require('express');
const userController = require('../controllers/userController');
const sensorController = require('../controllers/sensorController');

module.exports = () => {


  const router = express.Router();

  router.use('/smart-home/api/v1', router);

  router.post('/user/create', userController.create);

  return router;

};
