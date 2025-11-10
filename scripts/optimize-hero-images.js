const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'public', 'img');

const images = [
  { input: 'hero-mobile-proj.png', output: 'hero-mobile-proj.webp' },
  { input: 'hero-desktop-proj.png', output: 'hero-desktop-proj.webp' },
];

async function optimizeImages() {
  console.log('🚀 Starting image optimization...\n');

  for (const image of images) {
    const inputPath = path.join(imagesDir, image.input);
    const outputPath = path.join(imagesDir, image.output);

    if (!fs.existsSync(inputPath)) {
      console.error(`❌ File not found: ${inputPath}`);
      continue;
    }

    try {
      const inputStats = fs.statSync(inputPath);
      const inputSizeMB = (inputStats.size / 1024 / 1024).toFixed(2);

      console.log(`📁 Processing: ${image.input} (${inputSizeMB} MB)`);

      // Convert to WebP with high quality and compression
      await sharp(inputPath)
        .webp({ quality: 85, effort: 6 }) // High quality, maximum compression effort
        .toFile(outputPath);

      const outputStats = fs.statSync(outputPath);
      const outputSizeMB = (outputStats.size / 1024 / 1024).toFixed(2);
      const reduction = (((inputStats.size - outputStats.size) / inputStats.size) * 100).toFixed(1);

      console.log(`✅ Created: ${image.output} (${outputSizeMB} MB)`);
      console.log(`📉 Size reduction: ${reduction}%\n`);
    } catch (error) {
      console.error(`❌ Error processing ${image.input}:`, error.message);
    }
  }

  console.log('🎉 Image optimization complete!');
}

optimizeImages().catch(console.error);

