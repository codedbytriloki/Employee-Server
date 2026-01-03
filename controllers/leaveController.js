import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";

const addLeave = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;
    const employee = await Employee.findOne({ userId })
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" })
    }
    const leaves = new Leave({
      employeeId: employee._id, leaveType, startDate, endDate, reason,
    })
    await leaves.save();
    return res.status(200).json({ success: true })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "leave add server error" })
  }
}

const getLeaveById = async (req, res) => {
  try {
    const { id } = req.params;

    // First try to find leaves by employeeId (for admin viewing)
    let leaves = await Leave.find({ employeeId: id });

    if (!leaves || leaves.length === 0) {
      // If not found, try to find employee by userId (for employee viewing own data)
      const employee = await Employee.findOne({ userId: id });
      if (!employee) {
        return res.status(404).json({ success: false, error: "Employee not found" })
      }
      leaves = await Leave.find({ employeeId: employee._id });
    }
    return res.status(200).json({ success: true, leaves })
  } catch (error) {
    console.error('getLeaveById error:', error.message);
    return res.status(500).json({ success: false, error: error.message || "get leave server error" })
  }
}

const getLeave = async (req, res) => {
  try {
    const leaves = await Leave.find().populate({
      path: "employeeId",
      populate: [
        {
          path: 'department',
          select: 'dep_name'
        },
        {
          path: 'userId',
          select: 'name'
        }
      ]
    })
    return res.status(200).json({ success: true, leaves })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "get leave server error" })
  }
}

const getLeaveDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const leaves = await Leave.findById({ _id: id }).populate({
      path: "employeeId",
      populate: [
        {
          path: 'department',
          select: 'dep_name'
        },
        {
          path: 'userId',
          select: 'name, profileImage'
        }
      ]
    })
    return res.status(200).json({ success: true, leaves })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "get leave server error" })
  }
}

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const leave = await Leave.findByIdAndUpdate({ _id: id }, { status: status });
    if (!leave) {
      return res.status(404).json({ success: false, error: "Leave not found" })
    }
    return res.status(200).json({ success: true })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "get leave server error" })
  }
}

export { addLeave, getLeaveById, getLeave, getLeaveDetail, updateStatus };

