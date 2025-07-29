#!/usr/bin/env node

const https = require('https');
const http = require('http');

// Configurazione
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_ENDPOINT = '/api/projects/cleanup-images';

// Funzione per fare richieste HTTP
function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = client.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsedData });
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Funzione per analizzare le immagini
async function analyzeImages() {
  console.log('🔍 Analizzando le immagini nel bucket...');

  try {
    const response = await makeRequest(`${BASE_URL}${API_ENDPOINT}`, 'GET');

    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${response.data.error || 'Unknown error'}`);
    }

    const { analysis, summary } = response.data;

    console.log('\n📊 ANALISI IMMAGINI:');
    console.log('='.repeat(50));
    console.log(`📁 File totali nel bucket: ${summary.totalFiles}`);
    console.log(`✅ Immagini utilizzate: ${summary.usedImages}`);
    console.log(`🗑️  Immagini non utilizzate: ${summary.unusedFiles}`);
    console.log(`💾 Spazio da liberare: ${summary.spaceToSave}`);

    if (analysis.unusedFileNames.length > 0) {
      console.log('\n📋 File non utilizzati:');
      analysis.unusedFileNames.forEach((fileName, index) => {
        console.log(`  ${index + 1}. ${fileName}`);
      });
    }

    if (analysis.usedImageNames.length > 0) {
      console.log('\n✅ File utilizzati:');
      analysis.usedImageNames.forEach((fileName, index) => {
        console.log(`  ${index + 1}. ${fileName}`);
      });
    }

    return summary;
  } catch (error) {
    console.error("❌ Errore durante l'analisi:", error.message);
    throw error;
  }
}

// Funzione per pulire le immagini
async function cleanupImages() {
  console.log('\n🧹 Procedendo con la pulizia...');

  try {
    const response = await makeRequest(`${BASE_URL}${API_ENDPOINT}`, 'POST');

    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${response.data.error || 'Unknown error'}`);
    }

    const { summary, deletedFiles, errors } = response.data;

    console.log('\n✅ PULIZIA COMPLETATA:');
    console.log('='.repeat(50));
    console.log(`🗑️  File eliminati: ${summary.deletedFiles}`);
    console.log(`❌ Errori: ${summary.errors}`);

    if (deletedFiles.length > 0) {
      console.log('\n🗑️  File eliminati:');
      deletedFiles.forEach((fileName, index) => {
        console.log(`  ${index + 1}. ${fileName}`);
      });
    }

    if (errors.length > 0) {
      console.log("\n❌ Errori durante l'eliminazione:");
      errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    return response.data;
  } catch (error) {
    console.error('❌ Errore durante la pulizia:', error.message);
    throw error;
  }
}

// Funzione principale
async function main() {
  console.log('🚀 SCRIPT PULIZIA IMMAGINI SUPABASE');
  console.log('='.repeat(50));
  console.log(`📍 URL: ${BASE_URL}`);
  console.log(`🔗 Endpoint: ${API_ENDPOINT}`);
  console.log('');

  try {
    // Prima fai l'analisi
    const analysis = await analyzeImages();

    if (analysis.unusedFiles === 0) {
      console.log('\n🎉 Nessuna immagine da pulire! Il bucket è già ottimizzato.');
      return;
    }

    // Chiedi conferma prima di procedere
    console.log(
      '\n⚠️  ATTENZIONE: Stai per eliminare',
      analysis.unusedFiles,
      'file non utilizzati.'
    );
    console.log('Questo processo è irreversibile!');

    // In un ambiente reale, potresti voler chiedere conferma all'utente
    // Per ora procediamo automaticamente
    console.log('\n🔄 Procedendo automaticamente con la pulizia...');

    // Procedi con la pulizia
    await cleanupImages();

    console.log('\n🎉 Pulizia completata con successo!');
  } catch (error) {
    console.error('\n💥 Errore fatale:', error.message);
    process.exit(1);
  }
}

// Esegui lo script
if (require.main === module) {
  main();
}

module.exports = { analyzeImages, cleanupImages };
