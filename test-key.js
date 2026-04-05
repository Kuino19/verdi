require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/['"]/g, '').trim();

console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);
console.log('Client Email:', process.env.FIREBASE_CLIENT_EMAIL);
console.log('Private Key exists:', !!privateKey);
if (privateKey) {
    console.log('Key length:', privateKey.length);
    console.log('Key starts with:', privateKey.substring(0, 30));
    console.log('Key ends with:', privateKey.substring(privateKey.length - 30));
    
    try {
        admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey
        });
        console.log('Credential parsing: SUCCESS');
    } catch (e) {
        console.error('Credential parsing: FAILED');
        console.error(e.message);
    }
} else {
    console.error('Private Key is missing or empty');
}
