import multer from "multer";
import path from "path";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import Department from "../models/Department.js";
import bcrypt from "bcrypt";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

const addEmployees = async (req, res) => {
  try {
    const { name, email, employeeId, dob, gender, maritalStatus, designation, department, salary, password } = req.body;

    if (!name || !email || !employeeId || !department || !salary || !password) {
      return res.status(400).json({ success: false, error: "Missing required fields" })
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, error: "user already registered in emp" })
    }

    // Find department by name
    const departmentData = await Department.findOne({ dep_name: department });
    if (!departmentData) {
      return res.status(400).json({ success: false, error: "Department not found" })
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const profileImage = req.file ? req.file.filename : null;

    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role: "employee",
      profileImage: profileImage
    })
    const saveUser = await newUser.save();

    const newEmp = new Employee({
      userId: saveUser._id,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department: departmentData._id,
      salary
    })
    await newEmp.save();
    return res.status(200).json({ success: true, message: "employee created" })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message || "Server error in adding employee" })
  }
}

const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.find().populate('userId', { password: 0 }).populate('department');
    return res.status(200).json({ success: true, employee })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message || "Server error in adding employee" })
  }
}

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    let employee;
    employee = await Employee.findById(id).populate('userId', { password: 0 }).populate('department');
    if (!employee) {
      employee = await Employee.findOne({ userId: id }).populate('userId', { password: 0 }).populate('department');
    }
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" })
    }
    return res.status(200).json({ success: true, employee })

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message || "Server error in adding employee" })
  }
}

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, maritalStatus, designation, department, salary } = req.body;
    const employee = await Employee.findById({ _id: id });
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" })
    }
    const user = await User.findById({ _id: employee.userId });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" })
    }

    // Validate that department is a valid ObjectId
    let departmentId = department;
    if (department && !department.match(/^[0-9a-fA-F]{24}$/)) {
      // If it's not a valid ObjectId, try to find the department by name
      const departmentData = await Department.findOne({ dep_name: department });
      if (!departmentData) {
        return res.status(400).json({ success: false, error: "Department not found" })
      }
      departmentId = departmentData._id;
    }

    const updateUser = await User.findByIdAndUpdate({ _id: employee.userId }, { name });
    const updateEmployeeData = await Employee.findByIdAndUpdate({ _id: id }, { maritalStatus, designation, salary, department: departmentId });
    if (!updateEmployeeData || !updateUser) {
      return res.status(404).json({ success: false, error: "Document not found" })
    }
    return res.status(200).json({ success: true, message: "Employee Updated" })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message || "Server error in adding employee" })
  }
}

const fetchEmployeeByDepId = async (req, res) => {
  try {
    const { id } = req.params;
    const employees = await Employee.find({ department: id });
    return res.status(200).json({ success: true, employees });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message || "get employeebyDepId server error" })
  }
}

export { addEmployees, upload, getEmployee, getEmployeeById, updateEmployee, fetchEmployeeByDepId };