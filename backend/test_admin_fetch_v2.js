const http = require('http');

const loginData = JSON.stringify({
    email: 'prasadshaswat9765@gmail.com',
    password: 'noonecanbeatme'
});

const loginOptions = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
    }
};

console.log('1. Logging in...');
const req = http.request(loginOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        if (res.statusCode === 200) {
            const body = JSON.parse(data);
            const token = body.data.token;
            console.log('Login successful.');
            fetchBlog(token);
        } else {
            console.error('Login failed:', res.statusCode, data);
        }
    });
});
req.on('error', (e) => console.error('Login Error:', e.message));
req.write(loginData);
req.end();

function fetchBlog(token) {
    const blogId = '6965b27f05c01aeb4bdb88bc';
    console.log(`2. Fetching blog ${blogId}...`);

    const options = {
        hostname: 'localhost',
        port: 3001,
        path: `/api/blogs/admin/${blogId}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            console.log('Fetch Status:', res.statusCode);
            console.log('Fetch Body:', data);
        });
    });
    req.on('error', (e) => console.error('Fetch Error:', e.message));
    req.end();
}
