import Employee from "../models/Employee.js";
import Deppartment from "../models/Department.js";
import Leave from "../models/Leave.js";

const getSummary = async (req, res) => {
  try {
    const totalEmployee = await Employee.countDocuments();
    const totalDepartments = await Deppartment.countDocuments();
    const totalSalaries = await Employee.aggregate([
      { $group: { _id: null, totalSalary: { $sum: "$salary" } } }
    ])

    const employeeAppliedForLeave = await Leave.distinct('employeeId');
    const leaveStatus = await Leave.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ])

    const leaveSummary = {
      appliedFor: employeeAppliedForLeave.length,
      approved: leaveStatus.find(item => item._id === "Approved")?.count || 0,
      rejected: leaveStatus.find(item => item._id === "Rejected")?.count || 0,
      pending: leaveStatus.find(item => item._id === "Pending")?.count || 0,
    }

    return res.status(200).json({
      success: true,
      totalEmployee,
      totalDepartments,
      totalSalary: totalSalaries[0]?.totalSalary || 0,
      leaveSummary
    })
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message || "get summary server error" })
  }
}

export { getSummary };