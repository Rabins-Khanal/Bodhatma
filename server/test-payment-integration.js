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
    console.log("Database connected for testing");
    runTests();
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
    process.exit(1);
  });

async function runTests() {
  try {
    const db = mongoose.connection.db;
    const ordersCollection = db.collection("orders");

    console.log("🧪 Testing Payment Integration...\n");

    // Test 1: Check if payment fields exist in orders
    console.log("1. Testing Order Schema with Payment Fields:");
    const sampleOrder = await ordersCollection.findOne({});
    if (sampleOrder) {
      const hasPaymentFields = sampleOrder.paymentMethod && sampleOrder.paymentStatus;
      console.log(`   ✅ Payment fields exist: ${hasPaymentFields}`);
      console.log(`   📋 Sample order payment method: ${sampleOrder.paymentMethod || 'N/A'}`);
      console.log(`   📋 Sample order payment status: ${sampleOrder.paymentStatus || 'N/A'}`);
    } else {
      console.log("   ⚠️  No orders found in database");
    }

    // Test 2: Count orders by payment method
    console.log("\n2. Testing Order Distribution by Payment Method:");
    const codOrders = await ordersCollection.countDocuments({ paymentMethod: 'cod' });
    const khaltiOrders = await ordersCollection.countDocuments({ paymentMethod: 'khalti' });
    const totalOrders = await ordersCollection.countDocuments({});
    
    console.log(`   💰 COD Orders: ${codOrders}`);
    console.log(`   💳 Khalti Orders: ${khaltiOrders}`);
    console.log(`   📊 Total Orders: ${totalOrders}`);

    // Test 3: Count orders by payment status
    console.log("\n3. Testing Order Distribution by Payment Status:");
    const pendingPayments = await ordersCollection.countDocuments({ paymentStatus: 'pending' });
    const completedPayments = await ordersCollection.countDocuments({ paymentStatus: 'completed' });
    const failedPayments = await ordersCollection.countDocuments({ paymentStatus: 'failed' });
    
    console.log(`   ⏳ Pending Payments: ${pendingPayments}`);
    console.log(`   ✅ Completed Payments: ${completedPayments}`);
    console.log(`   ❌ Failed Payments: ${failedPayments}`);

    // Test 4: Check for orders with transaction IDs (Khalti orders)
    console.log("\n4. Testing Khalti Transaction IDs:");
    const ordersWithTransactionId = await ordersCollection.countDocuments({ 
      transactionId: { $exists: true, $ne: null } 
    });
    console.log(`   🔗 Orders with Transaction ID: ${ordersWithTransactionId}`);

    // Test 5: Check for orders with Khalti data
    console.log("\n5. Testing Khalti Data Storage:");
    const ordersWithKhaltiData = await ordersCollection.countDocuments({ 
      khaltiData: { $exists: true, $ne: null } 
    });
    console.log(`   📦 Orders with Khalti Data: ${ordersWithKhaltiData}`);

    console.log("\n🎉 Payment Integration Tests Completed!");
    console.log("\n📋 Summary:");
    console.log(`   - Total Orders: ${totalOrders}`);
    console.log(`   - COD Orders: ${codOrders}`);
    console.log(`   - Khalti Orders: ${khaltiOrders}`);
    console.log(`   - Pending Payments: ${pendingPayments}`);
    console.log(`   - Completed Payments: ${completedPayments}`);

    mongoose.connection.close();
    console.log("\nDatabase connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Testing failed:", error);
    mongoose.connection.close();
    process.exit(1);
  }
} 