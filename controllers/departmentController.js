import Department from "../models/Department.js";

const getDepartment = async (req, res) => {
  try {
    const departments = await Department.find();
    return res.status(200).json({ success: true, departments });
  }
  catch (error) {
    return res.status(500).json({ success: false, error: "Add Department server error" })
  }
}

const addDepartment = async (req, res) => {
  try {
    const { dep_name, description } = req.body;
    const newDep = new Department({
      dep_name,
      description
    })
    await newDep.save();
    return res.status(200).json({ success: true, department: newDep })
  } catch (error) {
    return res.status(500).json({ success: false, error: "Add Department server error" })
  }
}

const getDepartemntById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);
    return res.status(200).json({ success: true, department });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Add Department server error" })
  }
}

const editDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dep_name, description } = req.body;
    const department = await Department.findByIdAndUpdate({ _id: id, }, {
      dep_name, description
    }, { new: true })
    return res.status(200).json({ success: true, department });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Add Department server error" })
  }
}

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedep = await Department.findByIdAndDelete(id);
    if (!deletedep) return res.status(404).json({ success: false, error: "Department not found" });
    return res.status(200).json({ success: true, message: "Successfully deleted" })
  } catch (error) {
    console.error('deleteDepartment error:', error);
    return res.status(500).json({ success: false, error: error.message || "Add Department server error" })
  }
}



export { addDepartment, editDepartment, getDepartment, getDepartemntById, deleteDepartment }