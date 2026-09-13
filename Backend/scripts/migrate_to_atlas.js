const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const LOCAL_URI = "mongodb://localhost:27017/smartbank";
const ATLAS_URI = process.env.MONGO_URI;

async function migrate() {
  if (!ATLAS_URI || (!ATLAS_URI.startsWith("mongodb+srv://") && !ATLAS_URI.includes(".mongodb.net"))) {
    console.error("❌ Error: Valid MongoDB Atlas URI not found in Backend/.env!");
    console.error("👉 Please set MONGO_URI in Backend/.env to your Atlas connection string first.");
    process.exit(1);
  }

  console.log("==================================================");
  console.log("SMARTBANK: LOCAL TO ATLAS MIGRATION TOOL");
  console.log("==================================================");
  console.log("1. Connecting to Local MongoDB:", LOCAL_URI);

  let localConn, atlasConn;

  try {
    localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log("✅ Connected to Local MongoDB.");
  } catch (err) {
    console.error("❌ Could not connect to Local MongoDB:", err.message);
    process.exit(1);
  }

  try {
    const maskedUri = ATLAS_URI.replace(/\/\/(.*?)@/, "//***:***@");
    console.log("2. Connecting to MongoDB Atlas:", maskedUri);
    atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log("✅ Connected to MongoDB Atlas.");
  } catch (err) {
    console.error("❌ Could not connect to MongoDB Atlas:", err.message);
    await localConn.close();
    process.exit(1);
  }

  const collections = [
    "Admins",
    "Users",
    "Accounts",
    "Transactions",
    "LedgerEntries",
    "AccountRequests",
    "identitycounters",
  ];

  console.log("\n3. Migrating Collections to Atlas...\n");

  for (const colName of collections) {
    try {
      const localCol = localConn.db.collection(colName);
      const atlasCol = atlasConn.db.collection(colName);

      const docs = await localCol.find({}).toArray();
      if (docs.length === 0) {
        console.log(`   ⚪ ${colName}: 0 documents (skipped)`);
        continue;
      }

      let inserted = 0;
      for (const doc of docs) {
        await atlasCol.replaceOne({ _id: doc._id }, doc, { upsert: true });
        inserted++;
      }

      console.log(`   ✅ ${colName}: Successfully migrated ${inserted} document(s)`);
    } catch (colErr) {
      console.error(`   ❌ Error migrating ${colName}:`, colErr.message);
    }
  }

  console.log("\n==================================================");
  console.log("🎉 MIGRATION COMPLETE!");
  console.log("Your Atlas database now has all your local Admins, Users, Accounts, and Transactions!");
  console.log("==================================================");

  await localConn.close();
  await atlasConn.close();
  process.exit(0);
}

migrate();
