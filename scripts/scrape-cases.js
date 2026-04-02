const axios = require('axios');
const cheerio = require('cheerio');
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

// Enhanced Scraper with User-Agent to avoid blocking/DNS issues
const client = axios.create({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5'
  },
  timeout: 10000
});

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

async function scrapePage(pageNumber) {
  console.log(`\n--- Scraping Page ${pageNumber} Raw ---`);
  const url = `https://nigerialii.org/judgments/all/?page=${pageNumber}`;
  
  try {
    const { data } = await client.get(url);
    const $ = cheerio.load(data);
    const links = [];

    $('.judgment-list-item, a[href*="/akn/ng"]').each((i, el) => {
      const href = $(el).attr('href');
      const title = $(el).text().trim();
      if (href && href.startsWith('/akn/ng')) {
        links.push({ url: `https://nigerialii.org${href}`, title });
      }
    });

    const uniqueLinks = [...new Map(links.map(item => [item.url, item])).values()];
    console.log(`Found ${uniqueLinks.length} unique cases.`);

    for (const item of uniqueLinks) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`\nProcessing: ${item.title}`);
      
      try {
        const judgmentPage = await client.get(item.url);
        const $j = cheerio.load(judgmentPage.data);
        
        let rawText = $j('#document_content').text().trim() || 
                      $j('#document-content').text().trim() || 
                      $j('.content').text().trim();
        
        if (!rawText) {
          console.log(`⚠️ Skip: No content found for ${item.url}`);
          continue;
        }

        const caseRecord = {
          title: item.title,
          citation: item.title.match(/\[\d{4}\]\s\w+\s\d+/)?.[0] || "Ref Title",
          subject: "Legal Case",
          facts: "Raw data scraped. AI summary pending.",
          fullText: rawText,
          sourceUrl: item.url,
          scrapedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(), // Standardizing for dashboard sorting
          type: 'scraped',
          processed: false
        };

        const docRef = await db.collection('cases').add(caseRecord);
        console.log(`✅ Success: ${caseRecord.title} -> [${docRef.id}]`);
      } catch (e) {
        console.error(`Error processing ${item.title}:`, e.message);
      }
    }
    return uniqueLinks.length > 0;
  } catch (e) {
    console.error(`Error on page ${pageNumber}:`, e.message);
    if (e.code === 'ENOTFOUND') {
      console.error("DNS Error: Could not resolve nigerialii.org. Please check connection.");
    }
    return false;
  }
}

async function run(start = 1, end = 1) { 
  for (let i = start; i <= end; i++) {
    const hasMore = await scrapePage(i);
    if (!hasMore) break;
  }
  console.log("\n--- Bulk Scraping Finished ---");
  process.exit();
}

run();
