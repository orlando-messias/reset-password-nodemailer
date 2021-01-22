const Project = require('../models/Project');

const getAll = async (req, res) => {
  try {
    // eager loading
    const projects = await Project.find().populate('user');
    res.send(projects);
  } catch (error) {
    res.status(400).send({ error: 'Error loading projects' });
  }
};

const newProject = async (req, res) => {
  // const { title, description } = req.body;
  try {
    const project = await Project.create({ ...req.body, user: req.userId });
    return res.send(project);
  } catch (err) {
    res.status(400).send({ error: 'Error creating new project' });
  }
};

const getProjectById = async (req, res) => {
  const id = req.params.projectId;
  try {
    const project = await Project.findById(id).populate('user');
    res.send(project);
  } catch (error) {
    res.status(400).send({ error: 'Error loading project' });
  }
};

const deleteProject = async (req, res) => {
  const id = req.params.projectId;
  try {
    await Project.findByIdAndRemove(id).populate('user');
    res.send();
  } catch (error) {
    res.status(400).send({ error: 'Error deleting project' });
  }
};



module.exports = {
  getAll,
  newProject,
  getProjectById,
  deleteProject
};