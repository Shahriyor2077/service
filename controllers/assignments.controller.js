const Assignment = require("../models/assignments.model");
const {
  createAssignmentSchema,
  updateAssignmentSchema,
} = require("../validations/assignments.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");


async function createAssignment(req, res) {
  try {
    const { error } = createAssignmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const assignment = await Assignment.create(req.body);
    res.status(201).json({ message: "Tayinlov yaratildi", assignment });
  } catch (err) {
    sendErrorResponse(err, res);
  }
}


async function getAllAssignments(req, res) {
  try {
    const assignments = await Assignment.findAll();
    res.json(assignments);
  } catch (err) {
    sendErrorResponse(err, res);
  }
}


async function getAssignmentById(req, res) {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Tayinlov topilmadi" });
    }
    res.json(assignment);
  } catch (err) {
    sendErrorResponse(err, res);
  }
}


async function updateAssignment(req, res) {
  try {
    const { error } = updateAssignmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Tayinlov topilmadi" });
    }
    await assignment.update(req.body);
    res.json({ message: "Tayinlov yangilandi", assignment });
  } catch (err) {
    sendErrorResponse(err, res);
  }
}


async function deleteAssignment(req, res) {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Tayinlov topilmadi" });
    }
    await assignment.destroy();
    res.json({ message: "Tayinlov o'chirildi" });
  } catch (err) {
    sendErrorResponse(err, res);
  }
}

module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
};
