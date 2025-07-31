const mongoose = require('mongoose');
const userModel = require('./models/users');

// Connect to database
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

async function updateUserName() {
  try {
    console.log('🔧 Updating user name...\n');
    
    // Update the specific user's name
    const result = await userModel.updateOne(
      { email: 'rabinskhanal47@gmail.com' },
      { name: 'bodhivana' }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ User name updated successfully!');
      console.log('📧 Email will now show: Hello bodhivana');
    } else {
      console.log('⚠️  No user found with that email or name already updated');
    }
    
    // Verify the update
    const user = await userModel.findOne({ email: 'rabinskhanal47@gmail.com' });
    if (user) {
      console.log(`📊 Current user name: ${user.name}`);
    }
    
  } catch (error) {
    console.error('❌ Error updating user name:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
updateUserName(); 