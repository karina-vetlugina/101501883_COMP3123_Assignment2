const express = require("express");
const { body, param, query } = require("express-validator");

const auth = require("../middleware/auth.middleware");
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  searchEmployees,
  deleteEmployee
} = require("../controllers/employee.controller");

const router = express.Router();

/**
 * POST /api/v1/emp/employees
 */
router.post(
  "/employees",
  auth,
  [
    body("first_name")
      .isString()
      .trim()
      .isLength({ min: 2 })
      .withMessage("first_name is required"),
    body("last_name")
      .isString()
      .trim()
      .isLength({ min: 2 })
      .withMessage("last_name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("position")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("position is required"),
    body("salary").isNumeric().withMessage("salary must be a number"),
    body("date_of_joining")
      .isISO8601()
      .toDate()
      .withMessage("date_of_joining must be a valid date"),
    body("department")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("department is required"),
    body("profile_image")
      .optional()
      .isString()
      .withMessage("profile_image must be a base64 string")
  ],
  createEmployee
);

/**
 * GET /api/v1/emp/employees
 */
router.get("/employees", auth, getEmployees);

/**
 * GET /api/v1/emp/employees/search
 */
router.get(
  "/employees/search",
  auth,
  [
    query("department").optional().isString().trim(),
    query("position").optional().isString().trim(),
    query().custom((value, { req }) => {
      if (!req.query.department && !req.query.position) {
        throw new Error("Provide 'department' or 'position' query parameter");
      }
      return true;
    })
  ],
  searchEmployees
);

/**
 * GET /api/v1/emp/employees/:eid
 */
router.get(
  "/employees/:eid",
  auth,
  [param("eid").isMongoId().withMessage("Invalid employee id")],
  getEmployeeById
);

/**
 * PUT /api/v1/emp/employees/:eid
 */
router.put(
  "/employees/:eid",
  auth,
  [
    param("eid").isMongoId().withMessage("Invalid employee id"),
    body("email").optional().isEmail().withMessage("email must be valid"),
    body("salary")
      .optional()
      .isNumeric()
      .withMessage("salary must be a number"),
    body("date_of_joining")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("date_of_joining must be a valid date"),
    body("profile_image")
      .optional()
      .isString()
      .withMessage("profile_image must be a base64 string")
  ],
  updateEmployee
);

/**
 * DELETE /api/v1/emp/employees/:eid
 */
router.delete(
  "/employees/:eid",
  auth,
  [param("eid").isMongoId().withMessage("Invalid employee id")],
  deleteEmployee
);

module.exports = router;