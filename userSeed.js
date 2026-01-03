import dotenv from 'dotenv';
dotenv.config();
import connectToDatabase from './db/db.js';
import User from './models/User.js'
import Employee from './models/Employee.js'
import Department from './models/Department.js'
import Salary from './models/Salary.js'
import Leave from './models/Leave.js'
import bcrypt from 'bcrypt';

const userRegister = async () => {
  connectToDatabase();
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: "admin@gmail.com" });
    if (!adminExists) {
      const hashPassword = await bcrypt.hash("admin", 10);
      const newAdmin = new User({
        name: "Admin",
        email: "admin@gmail.com",
        password: hashPassword,
        role: "admin"
      })
      await newAdmin.save();
      console.log("✓ Admin user created: admin@gmail.com / admin");
    } else {
      console.log("✓ Admin user already exists");
    }

    // Check if employee user already exists
    const employeeUserExists = await User.findOne({ email: "employee@gmail.com" });
    if (!employeeUserExists) {
      const hashPassword = await bcrypt.hash("employee", 10);
      const newEmployee = new User({
        name: "John Doe",
        email: "employee@gmail.com",
        password: hashPassword,
        role: "employee"
      })
      const savedEmployee = await newEmployee.save();
      console.log("✓ Employee user created: employee@gmail.com / employee");

      // Check if department exists
      let department = await Department.findOne({ dep_name: "IT" });
      if (!department) {
        department = new Department({
          dep_name: "IT",
          description: "Information Technology Department"
        })
        await department.save();
        console.log("✓ Department created: IT");
      }

      // Create employee record linked to user
      const empRecord = new Employee({
        userId: savedEmployee._id,
        employeeId: "EMP001",
        dob: new Date("1990-05-15"),
        gender: "Male",
        maritalStatus: "Single",
        designation: "Software Developer",
        department: department._id,
        salary: 50000
      })
      const savedEmpRecord = await empRecord.save();
      console.log("✓ Employee record created for John Doe");

      // Create sample salary record
      const salary = new Salary({
        employeeId: savedEmpRecord._id,
        basicSalary: 40000,
        allowances: 10000,
        deductions: 5000,
        newSalary: 45000,
        payDate: new Date()
      })
      await salary.save();
      console.log("✓ Sample salary record created");

      // Create sample leave record
      const leave = new Leave({
        employeeId: savedEmpRecord._id,
        leaveType: "Casual Leave",
        startDate: new Date("2026-01-10"),
        endDate: new Date("2026-01-12"),
        reason: "Personal work",
        status: "Approved"
      })
      await leave.save();
      console.log("✓ Sample leave record created");
    } else {
      console.log("✓ Employee user already exists");
    }

    console.log("\n✓ Seed data setup complete!");
    console.log("\nTest Credentials:");
    console.log("Admin: admin@gmail.com / admin");
    console.log("Employee: employee@gmail.com / employee");
    process.exit(0);
  }
  catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
}

userRegister();