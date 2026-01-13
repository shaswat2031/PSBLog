require('dotenv').config();
const { sendWelcomeEmail } = require('./src/utils/emailService');

console.log('Testing email configuration...');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***configured***' : 'NOT SET');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('\nAttempting to send test email...\n');

const testEmail = '2203051050530@paruluniversity.ac.in';

sendWelcomeEmail(testEmail)
  .then(result => {
    if (result.success) {
      console.log('✅ SUCCESS! Email sent successfully to:', testEmail);
      console.log('Check the inbox (and spam folder) for:', testEmail);
    } else {
      console.log('❌ FAILED to send email');
      console.log('Error:', result.error);
    }
    process.exit(0);
  })
  .catch(error => {
    console.log('❌ ERROR occurred:');
    console.error(error);
    process.exit(1);
  });
