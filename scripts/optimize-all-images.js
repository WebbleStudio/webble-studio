const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'public', 'img');

const optimizations = [
  // PNG to WebP conversions
  {
    input: 'bubble-background-dark.png',
    output: 'bubble-background-dark.webp',
    action: 'convert',
    options: { quality: 80, effort: 6 },
  },
  {
    input: 'radial.png',
    output: 'radial.webp',
    action: 'convert',
    options: { quality: 80, effort: 6 },
  },
  
  // WebP recompression (higher compression)
  {
    input: 'webble-3d.webp',
    output: 'webble-3d.webp',
    action: 'recompress',
    options: { quality: 75, effort: 6 },
  },
  {
    input: 'figma-3d.webp',
    output: 'figma-3d.webp',
    action: 'recompress',
    options: { quality: 75, effort: 6 },
  },
  
  // Resize and optimize hero-mobile for actual display size
  {
    input: 'hero-mobile-proj.webp',
    output: 'hero-mobile-proj.webp',
    action: 'resize',
    options: { width: 800, quality: 85, effort: 6 },
  },
];

async function optimizeImages() {
  console.log('🚀 Starting comprehensive image optimization...\n');

  for (const opt of optimizations) {
    const inputPath = path.join(imagesDir, opt.input);
    const outputPath = path.join(imagesDir, opt.output);

    if (!fs.existsSync(inputPath)) {
      console.error(`❌ File not found: ${inputPath}`);
      continue;
    }

    try {
      const inputStats = fs.statSync(inputPath);
      const inputSizeMB = (inputStats.size / 1024 / 1024).toFixed(2);
      const inputSizeKB = (inputStats.size / 1024).toFixed(0);

      console.log(`📁 Processing: ${opt.input} (${inputSizeKB} KB)`);
      console.log(`   Action: ${opt.action}`);

      let pipeline = sharp(inputPath);

      // Apply actions
      if (opt.action === 'resize') {
        pipeline = pipeline.resize(opt.options.width, null, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      // Always convert/recompress to WebP
      pipeline = pipeline.webp({
        quality: opt.options.quality,
        effort: opt.options.effort,
      });

      // Save output
      await pipeline.toFile(outputPath + '.tmp');

      // Replace original if recompressing
      if (opt.action === 'recompress' || opt.action === 'resize') {
        fs.renameSync(outputPath + '.tmp', outputPath);
      } else {
        fs.renameSync(outputPath + '.tmp', outputPath);
      }

      const outputStats = fs.statSync(outputPath);
      const outputSizeMB = (outputStats.size / 1024 / 1024).toFixed(2);
      const outputSizeKB = (outputStats.size / 1024).toFixed(0);

      if (opt.action === 'convert') {
        console.log(`✅ Created: ${opt.output} (${outputSizeKB} KB)`);
      } else {
        const reduction = (((inputStats.size - outputStats.size) / inputStats.size) * 100).toFixed(1);
        console.log(`✅ Optimized: ${opt.output} (${outputSizeKB} KB, -${reduction}%)`);
      }

      console.log('');
    } catch (error) {
      console.error(`❌ Error processing ${opt.input}:`, error.message);
      console.log('');
    }
  }

  console.log('🎉 Image optimization complete!');
  console.log('\n📋 Summary:');
  console.log('- Converted PNG to WebP: bubble-background-dark, radial');
  console.log('- Recompressed WebP: webble-3d, figma-3d');
  console.log('- Resized and optimized: hero-mobile-proj');
}

optimizeImages().catch(console.error);

