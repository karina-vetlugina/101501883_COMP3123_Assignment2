const { validationResult } = require("express-validator");
const Employee = require("../models/Employee");

// helper to map Mongo doc -> sample output shape
const mapEmployee = (doc) => ({
  employee_id: doc._id.toString(),
  first_name: doc.first_name,
  last_name: doc.last_name,
  email: doc.email,
  position: doc.position,
  salary: doc.salary,
  date_of_joining: doc.date_of_joining,
  department: doc.department,
});

// POST /api/v1/emp/employees
exports.createEmployee = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ status: false, errors: errors.array() });

    const emp = await Employee.create(req.body);
    return res.status(201).json({
      message: "Employee created successfully.",
      employee_id: emp._id.toString(),
    });
  } catch (err) {
    if (err.code === 11000)
      return res
        .status(409)
        .json({ status: false, message: "Email already exists" });
    console.error("Create Employee Error:", err.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

// GET /api/v1/emp/employees
exports.getEmployees = async (_req, res) => {
  try {
    const employees = await Employee.find().lean();
    return res.status(200).json(employees.map((e) => mapEmployee(e)));
  } catch (err) {
    console.error("Get Employees Error:", err.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

// GET /api/v1/emp/employees/:eid
exports.getEmployeeById = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.eid);
    if (!emp)
      return res
        .status(404)
        .json({ status: false, message: "Employee not found" });
    return res.status(200).json(mapEmployee(emp));
  } catch (err) {
    console.error("Get Employee By ID Error:", err.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

// PUT /api/v1/emp/employees/:eid
exports.updateEmployee = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ status: false, errors: errors.array() });

    const emp = await Employee.findByIdAndUpdate(req.params.eid, req.body, {
      new: true,
      runValidators: true,
    });
    if (!emp)
      return res
        .status(404)
        .json({ status: false, message: "Employee not found" });
    return res
      .status(200)
      .json({ message: "Employee details updated successfully." });
  } catch (err) {
    if (err.code === 11000)
      return res
        .status(409)
        .json({ status: false, message: "Email already exists" });
    console.error("Update Employee Error:", err.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

// DELETE /api/v1/emp/employees?eid=xxx
exports.deleteEmployee = async (req, res) => {
  try {
    const { eid } = req.query;
    const emp = await Employee.findByIdAndDelete(eid);
    if (!emp)
      return res
        .status(404)
        .json({ status: false, message: "Employee not found" });
    return res.status(204).send(); // 204 No Content
  } catch (err) {
    console.error("Delete Employee Error:", err.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};