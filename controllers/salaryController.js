import Employee from "../models/Employee.js";
import Salary from "../models/Salary.js";

const addSalary = async (req, res) => {
  try {
    const { employeeId, basicSalary, allowances, deductions, payDate } = req.body;
    const totalSalary = parseInt(basicSalary) + parseInt(allowances) - parseInt(deductions);
    const newSalary = new Salary({
      employeeId, basicSalary, allowances, deductions, payDate, newSalary: totalSalary
    })
    await newSalary.save();
    return res.status(200).json({ success: true })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "salary add server error" })
  }
}

const getSalary = async (req, res) => {
  try {
    const { id } = req.params;

    // First try to find salary by employeeId (for admin viewing)
    let salary = await Salary.find({ employeeId: id }).populate('employeeId', 'employeeId');

    if (!salary || salary.length === 0) {
      // If not found, try to find employee by userId (for employee viewing own data)
      const employee = await Employee.findOne({ userId: id })
      if (!employee) {
        return res.status(404).json({ success: false, error: "Employee not found" })
      }
      salary = await Salary.find({ employeeId: employee._id }).populate('employeeId', 'employeeId');
    }
    return res.status(200).json({ success: true, salary })
  }
  catch (error) {
    console.error('getSalary error:', error.message);
    return res.status(500).json({ success: false, error: error.message || "salary add server error" })
  }
}

export { addSalary, getSalary };