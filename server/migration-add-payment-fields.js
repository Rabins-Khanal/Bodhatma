const mongoose = require("mongoose");
require("dotenv").config();

// Connect to database
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Database connected for migration");
    runMigration();
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
    process.exit(1);
  });

async function runMigration() {
  try {
    const db = mongoose.connection.db;
    const ordersCollection = db.collection("orders");

    // Update all existing orders to add payment fields
    const result = await ordersCollection.updateMany(
      { paymentMethod: { $exists: false } },
      {
        $set: {
          paymentMethod: "cod",
          paymentStatus: "pending",
          transactionId: null,
          khaltiData: null
        }
      }
    );

    console.log(`Migration completed successfully!`);
    console.log(`Updated ${result.modifiedCount} orders`);
    console.log(`Matched ${result.matchedCount} orders`);

    // Verify the migration
    const ordersWithPaymentFields = await ordersCollection.countDocuments({
      paymentMethod: { $exists: true }
    });

    console.log(`Orders with payment fields: ${ordersWithPaymentFields}`);

    mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    mongoose.connection.close();
    process.exit(1);
  }
} 