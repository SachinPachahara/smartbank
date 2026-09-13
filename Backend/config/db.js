const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connectToMongoose = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ [Database Error] MONGO_URI is missing in Backend/.env!");
    process.exit(1);
  }

  const isAtlas = uri.startsWith("mongodb+srv://") || uri.includes(".mongodb.net");
  if (isAtlas) {
    // Mask username:password for security in logs
    const maskedUri = uri.replace(/\/\/(.*?)@/, "//***:***@");
    console.log(`📡 [Database] Connecting to MongoDB Atlas (Cloud): ${maskedUri}`);
  } else {
    console.log(`💻 [Database] Connecting to Local MongoDB: ${uri}`);
  }

  try {
    const db = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `✅ [Database Connected] Host: ${db.connection.host} | DB Name: ${db.connection.name} (${isAtlas ? "MongoDB Atlas Cloud" : "Local Database"})`
    );
  } catch (error) {
    console.error("❌ [Database Connection Failed]:", error.message);
    if (isAtlas) {
      console.error("\n👉 Common MongoDB Atlas Fixes:");
      console.error("   1. IP Whitelist: In MongoDB Atlas, go to 'Network Access' -> Add IP Address -> Select 'Allow Access from Anywhere' (0.0.0.0/0).");
      console.error("   2. Password characters: If your Atlas password contains special symbols (like @, #, $, %), URL-encode them (e.g. @ becomes %40).");
      console.error("   3. Database User: In 'Database Access', ensure your user has 'Read and write to any database' role.");
      console.error("   4. Database name: Ensure the URI includes '/smartbank' before the '?' options.\n");
    }
    process.exit(1);
  }
};

module.exports = {
  connectToMongoose,
};
