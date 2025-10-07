const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    last_name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, match: [/^\S+@\S+\.\S+$/, "Invalid email format"] },
    position: { type: String, required: true, trim: true },
    salary: { type: Number, required: true, min: 0 },
    date_of_joining: { type: Date, required: true },
    department: { type: String, required: true, trim: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    collection: "employees",
  }
);

// helpful indexes
EmployeeSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("Employee", EmployeeSchema);