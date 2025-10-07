const express = require("express");
const { body, param, query } = require("express-validator");
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employee.controller");

const router = express.Router();

/**
 * @route   POST /api/v1/emp/employees
 */
router.post(
  "/employees",
  [
    body("first_name").isString().trim().isLength({ min: 2 }).withMessage("first_name is required"),
    body("last_name").isString().trim().isLength({ min: 2 }).withMessage("last_name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("position").isString().trim().notEmpty().withMessage("position is required"),
    body("salary").isNumeric().withMessage("salary must be a number"),
    body("date_of_joining").isISO8601().toDate().withMessage("date_of_joining must be a valid date"),
    body("department").isString().trim().notEmpty().withMessage("department is required"),
  ],
  createEmployee
);

/**
 * @route   GET /api/v1/emp/employees
 */
router.get("/employees", getEmployees);

/**
 * @route   GET /api/v1/emp/employees/:eid
 */
router.get(
  "/employees/:eid",
  [param("eid").isMongoId().withMessage("Invalid employee id")],
  getEmployeeById
);

/**
 * @route   PUT /api/v1/emp/employees/:eid
 */
router.put(
  "/employees/:eid",
  [
    param("eid").isMongoId().withMessage("Invalid employee id"),
    body("email").optional().isEmail().withMessage("email must be valid"),
    body("salary").optional().isNumeric().withMessage("salary must be a number"),
    body("date_of_joining").optional().isISO8601().toDate().withMessage("date_of_joining must be a valid date"),
  ],
  updateEmployee
);

/**
 * @route   DELETE /api/v1/emp/employees?eid=xxx
 */
router.delete(
  "/employees",
  [query("eid").isMongoId().withMessage("Invalid employee id")],
  deleteEmployee
);

module.exports = router;