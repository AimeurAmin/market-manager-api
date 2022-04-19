const validateFields = require("../helpers/validateFields");
const Task = require("../models/task");

const addTask = async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
};

const countTasks = async (req, res) => {
  try {
    let count = await Task.countDocuments();
    res.send({ count });
  } catch (error) {
    res.status(400).send(error);
  }
};

const userTasks = async (req, res) => {
  const match = {};
  if (req.query.done) {
    match.done =
      req.query.done === "true"
        ? true
        : req.query.done === "false"
        ? false
        : undefined;
  }

  try {
    const user = await req.user.populate([
      {
        path: "tasks",
        match,
        options: {
          limit: req.query.limit,
          skip: ((req.query.page * req.query.limit) - req.query.limit) || 0,
        } /**, select: ["title", "done", "description"] */,
      },
    ]);
    const userTasks = user.tasks;

    res.send(userTasks);
  } catch (error) {
    res.status(400).send(error);
  }
};

const allTasks = async (req, res) => {
  const sort = {}
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }
  try {
    const tasks = await Task.find()
      .populate("owner")
      .limit(req.query.limit || 0)
      .skip(
        (req.query.limit || 0) * (req.query.page || 0) - (req.query.limit || 0)
      ).sort(sort);
    res.send(tasks);
  } catch (error) {
    res.status(400).send(error);
  }
};

const taskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
}

const updateTaskById = async (req, res) => {
  const allowedUpdates = ["title", "description", "done"];
  const requiredFields = ["done"]
  
  const {invalidFields, missingFields} = validateFields(allowedUpdates, requiredFields, req.body)
  
  if (invalidFields.length > 0)
  return res.status(400).send({
    error: `the following fields are invalid: ${invalidFields} | and the following fields are required: ${missingFields}`,
    invalidFields,
    missingFields
  });
  

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).send({ error: "task not found!", status: 404 });
    }

    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
}

const deleteTaskById = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send({
        error: "task not found!",
        status: 404,
      });
    }

    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
}

module.exports = {
  addTask,
  countTasks,
  userTasks,
  allTasks,
  taskById,
  updateTaskById,
  deleteTaskById
};
