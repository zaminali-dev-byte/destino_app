async function runTests() {
    const baseUrl = 'http://localhost:4000/api';
    console.log("Starting Auth & Feature Tests...");

    // 1. Try to fetch a public route (Destinations)
    let res = await fetch(`${baseUrl}/destinations`);
    console.log(`[Public Route] GET /api/destinations: ${res.status} ${res.statusText}`);

    // 2. Register a new user
    const testUser = {
        name: `TestUser_${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        phone: '1234567890'
    };
    console.log(`\nRegistering user: ${testUser.email}`);
    res = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser)
    });
    const regData = await res.json();
    console.log(`[Auth] POST /api/auth/register: ${res.status}`, regData.token ? 'Token Received' : regData);

    // 3. Login with the new user
    res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testUser.email, password: testUser.password })
    });
    const loginData = await res.json();
    console.log(`[Auth] POST /api/auth/login: ${res.status}`, loginData.token ? 'Token Received' : loginData);
    const userToken = loginData.token;

    // 4. Fetch User Profile (Protected Route)
    res = await fetch(`${baseUrl}/users/profile`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
    });
    const profileData = await res.json();
    console.log(`[Protected] GET /api/users/profile: ${res.status}`, profileData.email ? `Success (${profileData.email})` : profileData);

    // 5. Try to access Admin Route as normal user
    res = await fetch(`${baseUrl}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
    });
    const adminFailData = await res.json();
    console.log(`[Role Check] GET /api/admin/stats (as customer): ${res.status}`, adminFailData.message || adminFailData);

    // 6. Login as Admin
    console.log(`\nLogging in as Admin (admin@destino.com)...`);
    res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@destino.com', password: 'password123' }) // Assuming password123 is admin password based on common seed
    });
    const adminData = await res.json();
    if (adminData.token) {
        const adminToken = adminData.token;
        console.log(`[Auth] Admin Login: ${res.status} Token Received`);

        // 7. Access Admin Stats with Admin Token
        res = await fetch(`${baseUrl}/admin/stats`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const statsData = await res.json();
        console.log(`[Admin] GET /api/admin/stats: ${res.status}`, statsData.revenue !== undefined ? 'Stats Received' : statsData);
        
        // 8. Fetch Admin Notifications
        res = await fetch(`${baseUrl}/admin/notifications`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const notifData = await res.json();
        console.log(`[Admin] GET /api/admin/notifications: ${res.status}`, Array.isArray(notifData) ? `Received ${notifData.length} notifications` : notifData);
    } else {
        console.log(`[Auth] Admin Login Failed (maybe wrong default password): ${res.status}`, adminData);
    }
}

runTests().catch(console.error);
