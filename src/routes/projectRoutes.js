const express = require('express');
const projectRoutes = express.Router();
const projectsController = require('../controllers/projectsController');
const { validateToken } = require('../middlewares/auth')

projectRoutes.get('/', validateToken, projectsController.getAll);
projectRoutes.get('/:projectId', validateToken, projectsController.getProjectById);
projectRoutes.post('/', validateToken, projectsController.newProject);
projectRoutes.delete('/:projectId', validateToken, projectsController.deleteProject);

module.exports = projectRoutes;