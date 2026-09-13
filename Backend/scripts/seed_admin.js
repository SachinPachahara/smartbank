const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const Admin = require("../models/adminModel");

async function seedAdmin() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ Error: MONGO_URI is missing in Backend/.env!");
    process.exit(1);
  }

  const maskedUri = uri.replace(/\/\/(.*?)@/, "//***:***@");
  console.log("Connecting to Database:", maskedUri);

  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB.");

    const existingOwner = await Admin.findOne({ role: "owner" });
    if (existingOwner) {
      console.log(`ℹ️ An Owner account already exists in this database:`);
      console.log(`   Name:  ${existingOwner.admin_name}`);
      console.log(`   Email: ${existingOwner.email}`);
      console.log(`   Role:  ${existingOwner.role}`);
      console.log(`\nYou can login with this email directly at /admins/login.`);
    } else {
      console.log("Creating default Primary Owner account...");
      const defaultEmail = "admin@smartbank.com";
      const defaultPassword = "AdminPassword123!";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      const owner = await Admin.create({
        admin_name: "Super Admin",
        email: defaultEmail,
        password: hashedPassword,
        role: "owner",
      });

      console.log("\n🎉 Primary Owner initialized successfully!");
      console.log("------------------------------------------");
      console.log(`Name:     ${owner.admin_name}`);
      console.log(`Email:    ${owner.email}`);
      console.log(`Password: ${defaultPassword}`);
      console.log(`Role:     ${owner.role}`);
      console.log("------------------------------------------");
      console.log("👉 You can now log in at /admins/login with these credentials.");
    }
  } catch (err) {
    console.error("❌ Error seeding admin:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedAdmin();
