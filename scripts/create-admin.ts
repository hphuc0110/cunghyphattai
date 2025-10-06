// Script to create admin user
import connectDB from "../lib/mongodb"
import User from "../lib/models/User"
import { hashPassword } from "../lib/auth"

async function createAdmin() {
  try {
    console.log("[v0] Connecting to MongoDB...")
    await connectDB()

    const email = "admin@cunghyphattai.com"
    const password = "admin123456" // Change this!
    const name = "Admin"

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email })
    if (existingAdmin) {
      console.log("[v0] Admin user already exists")
      process.exit(0)
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create admin user
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    })

    console.log("[v0] Admin user created successfully!")
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
    console.log("IMPORTANT: Change the password after first login!")

    process.exit(0)
  } catch (error) {
    console.error("[v0] Error creating admin:", error)
    process.exit(1)
  }
}

createAdmin()
