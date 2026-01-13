const axios = require('axios');

const API_URL = 'http://localhost:3001/api';
const BLOG_ID = '6965b27f05c01aeb4bdb88bc'; // The ID dealing valid-looking but maybe problematic
// Note: ID in user request was 6965b27f05c01aeb4bdb88bc. 
// Just in case, I should check if the ID in the database dump (step 73) matches.
// Step 73 output:
// _id 6965b27f05c01aeb4bdb88bc
// title "fferyfu"
// So it exists.

async function testFetch() {
    try {
        console.log('1. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'prasadshaswat9765@gmail.com',
            password: 'noonecanbeatme'
        });

        const token = loginRes.data.data.token;
        console.log('Login successful. Token obtained.');

        console.log(`2. Fetching blog ${BLOG_ID} via Admin API...`);
        try {
            const blogRes = await axios.get(`${API_URL}/blogs/admin/${BLOG_ID}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Success! Status:', blogRes.status);
            console.log('Data:', blogRes.data);
        } catch (fetchErr) {
            console.error('Fetch failed!');
            if (fetchErr.response) {
                console.error('Status:', fetchErr.response.status);
                console.error('Data:', fetchErr.response.data);
            } else {
                console.error('Error:', fetchErr.message);
            }
        }

    } catch (err) {
        console.error('Login failed or unexpected error:', err.message);
        if (err.response) {
            console.error('Login Response:', err.response.data);
        }
    }
}

testFetch();
