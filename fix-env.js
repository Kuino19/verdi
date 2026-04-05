const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
let content = fs.readFileSync(envPath, 'utf8');

// Find the FIREBASE_PRIVATE_KEY block
const match = content.match(/FIREBASE_PRIVATE_KEY="([\s\S]*?)"/);

if (match) {
    const rawKey = match[1];
    // Consolidate into single line with \n
    const cleanKey = rawKey.split('\n').filter(line => line.trim()).join('\\n');
    const updatedContent = content.replace(match[0], `FIREBASE_PRIVATE_KEY="${cleanKey}"`);
    fs.writeFileSync(envPath, updatedContent);
    console.log('Successfully formatted FIREBASE_PRIVATE_KEY in .env.local');
} else {
    console.log('FIREBASE_PRIVATE_KEY not found or already formatted.');
}
