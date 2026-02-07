
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const BASE_URL = 'http://localhost:8000'; // Adjust port if needed

// Helper for fetch
const request = async (endpoint, method = 'GET', body = null, token = null, files = []) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options = { method, headers };

    if (files.length > 0) {
        const formData = new FormData();
        files.forEach(f => {
            const blob = new Blob([f.content]);
            formData.append('files', blob, f.name);
        });

        if (body && body.paths) {
            body.paths.forEach(p => formData.append('paths', p));
        } else if (body) {
            Object.keys(body).forEach(key => formData.append(key, body[key]));
        }
        options.body = formData;
        // Content-Type header is set automatically with FormData
    } else if (body) {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }

    try {
        const res = await fetch(`${BASE_URL}${endpoint}`, options);
        const data = await res.json().catch(() => ({}));
        return { status: res.status, data, headers: res.headers };
    } catch (e) {
        console.error(`Request failed: ${method} ${endpoint}`, e.message);
        return { status: 500, error: e.message };
    }
};

const runTest = async () => {
    const timestamp = Date.now();
    const email = `test${timestamp}@example.com`;
    const password = 'password123';

    console.log(`\n--- 1. Registering User (${email}) ---`);
    const registerRes = await request('/api/v1/auth/signup', 'POST', { username: `user${timestamp}`, email, password });
    console.log('Status:', registerRes.status);
    if (registerRes.status !== 201) {
        console.error("Registration failed. Response:", JSON.stringify(registerRes.data, null, 2));
        return;
    }

    console.log(`\n--- 2. Logging In ---`);
    const loginRes = await request('/api/v1/auth/login', 'POST', { email, password });
    console.log('Status:', loginRes.status);
    const token = loginRes.data?.data?.token; // Adjust based on your ApiResponse structure
    console.log('Token received:', !!token);

    if (!token) {
        console.error("Login failed, no token. Response:", JSON.stringify(loginRes.data, null, 2));
        return;
    }

    console.log(`\n--- 3. Uploading Files with Smart Drop Paths ---`);
    // Simulating file upload
    const files = [
        { name: 'file1.txt', content: 'content of file 1' },
        { name: 'file2.txt', content: 'content of file 2' }
    ];
    const body = {
        paths: ["folderA/subfolderB/file1.txt", "folderA/file2.txt"]
    };

    const uploadRes = await request('/drop/upload', 'POST', body, token, files);
    console.log('Upload Status:', uploadRes.status);
    if (uploadRes.status === 200) {
        console.log("Upload Success. Created Files:", uploadRes.data?.data?.files?.length);
        const uploadedFiles = uploadRes.data?.data?.files || [];

        if (uploadedFiles.length > 0) {
            const fileId = uploadedFiles[0]._id;
            console.log(`\n--- 4. Testing Secure Download for File ID: ${fileId} ---`);

            // Note: using fetch for download might need buffer handling, but checking status 200 implies success
            const downloadRes = await fetch(`${BASE_URL}/download/${fileId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            console.log('Download Status:', downloadRes.status);
            if (downloadRes.status === 200) {
                console.log("Secure Download Verified!");
            } else {
                console.error("Download Failed");
            }

            console.log(`\n--- 5. Testing Unauthorized Download ---`);
            const badDownloadRes = await fetch(`${BASE_URL}/download/${fileId}`); // No token
            console.log('Unauthorized Download Status (Expected 401/403/500):', badDownloadRes.status);

        }
    } else {
        console.error("Upload failed", uploadRes.data);
    }
};

runTest();
