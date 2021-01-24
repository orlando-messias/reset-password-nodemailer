const Project = require('../models/Project');
const Task = require('../models/Task');

const getAll = async (req, res) => {
  try {
    // eager loading
    const projects = await Project.find().populate(['user', 'tasks']);
    res.send(projects);
  } catch (error) {
    res.status(400).send({ error: 'Error loading projects' });
  }
};

const newProject = async (req, res) => {
  try {
    const { title, description, tasks } = req.body;
    const project = await Project.create({ title, description, user: req.userId });

    // create each task individually, then push them to the project object
    await Promise.all(tasks.map(async task => {
      const projectTask = new Task({ ...task, project: project._id });
      await projectTask.save();
      project.tasks.push(projectTask);
    }));

    await project.save();
    return res.send(project);

  } catch (err) {
    console.log(err);
    res.status(400).send({ error: 'Error creating new project' });
  }
};

const getProjectById = async (req, res) => {
  const id = req.params.projectId;
  try {
    const project = await Project.findById(id).populate(['user', 'tasks']);
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

const updateProject = async (req, res) => {
  try {
    const { title, description, tasks } = req.body;
    const project = await Project.findByIdAndUpdate(req.params.projectId, {
      title,
      description,
    }, { new: true });
    
    // remove every old tasks from database to update to new ones
    project.tasks = [];
    await Task.remove({ project: project._id });

    await Promise.all(tasks.map(async task => {
      const projectTask = new Task({ ...task, project: project._id });
      await projectTask.save();
      project.tasks.push(projectTask);
    }));

    await project.save();
    return res.send(project);

  } catch (err) {
    console.log(err);
    res.status(400).send({ error: 'Error updating project' });
  }
};

module.exports = {
  getAll,
  newProject,
  getProjectById,
  deleteProject,
  updateProject
};