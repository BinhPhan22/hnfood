const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const openaiService = require('../services/openaiService');

dotenv.config();

const translateProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Initialize OpenAI service
    const initialized = await openaiService.initialize();
    if (!initialized) {
      console.log('❌ OpenAI service not available');
      process.exit(1);
    }

    // Get all products
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products`);

    if (products.length === 0) {
      console.log('❌ No products found');
      process.exit(1);
    }

    let translatedCount = 0;
    let totalTokens = 0;

    for (const product of products) {
      console.log(`\n🔄 Processing: ${product.name}`);
      
      const updates = {};

      // Translate name to English
      if (product.name && !product.name_en) {
        console.log('  📝 Translating name...');
        const nameResult = await openaiService.translateText(product.name, 'en');
        if (nameResult.success) {
          updates.name_en = nameResult.translation;
          totalTokens += nameResult.tokensUsed;
          console.log(`  ✅ Name: ${nameResult.translation}`);
        } else {
          console.log(`  ❌ Name translation failed: ${nameResult.error}`);
        }
      } else if (product.name_en) {
        console.log(`  ✅ Name already translated: ${product.name_en}`);
      }

      // Translate description to English
      if (product.description && !product.description_en) {
        console.log('  📝 Translating description...');
        const descResult = await openaiService.translateText(product.description, 'en');
        if (descResult.success) {
          updates.description_en = descResult.translation;
          totalTokens += descResult.tokensUsed;
          console.log(`  ✅ Description: ${descResult.translation.substring(0, 100)}...`);
        } else {
          console.log(`  ❌ Description translation failed: ${descResult.error}`);
        }
      } else if (product.description_en) {
        console.log(`  ✅ Description already translated`);
      }

      // Update product if there are translations
      if (Object.keys(updates).length > 0) {
        await Product.findByIdAndUpdate(product._id, updates);
        translatedCount++;
        console.log(`  💾 Updated product with ${Object.keys(updates).length} translations`);
      } else {
        console.log(`  ⏭️  No translation needed`);
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n🎉 Translation completed!');
    console.log(`📊 Statistics:`);
    console.log(`   - Total products: ${products.length}`);
    console.log(`   - Products translated: ${translatedCount}`);
    console.log(`   - Total tokens used: ${totalTokens}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error translating products:', error);
    process.exit(1);
  }
};

// Manual translations for existing products
const manualTranslations = {
  'Nấm linh chi đỏ nguyên tai': 'Whole Red Reishi Mushroom',
  'Viên nang linh chi cô đặc': 'Concentrated Reishi Mushroom Capsules',
  'Nấm rơm tươi hữu cơ': 'Fresh Organic Straw Mushrooms',
  'Nấm đen khô cao cấp': 'Premium Dried Black Mushrooms',
  'Gel rửa tay khô tinh dầu tràm trà': 'Tea Tree Oil Hand Sanitizer Gel',
  'Nước rửa tay kháng khuẩn': 'Antibacterial Hand Wash',
  'Xà phòng thảo dược tự nhiên': 'Natural Herbal Soap',
  'Nước lau sàn hữu cơ Lavender': 'Organic Lavender Floor Cleaner',
  'Dung dịch vệ sinh đa năng': 'Multi-Purpose Cleaning Solution',
  'Nước lau kính không vệt': 'Streak-Free Glass Cleaner',
  'Nước rửa chén thiên nhiên': 'Natural Dish Soap',
  'Bột giặt hữu cơ': 'Organic Laundry Powder'
};

const applyManualTranslations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    for (const [vietnameseName, englishName] of Object.entries(manualTranslations)) {
      const product = await Product.findOne({ name: vietnameseName });
      if (product) {
        await Product.findByIdAndUpdate(product._id, { name_en: englishName });
        console.log(`✅ Updated: ${vietnameseName} -> ${englishName}`);
      } else {
        console.log(`❌ Product not found: ${vietnameseName}`);
      }
    }

    console.log('🎉 Manual translations applied!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error applying manual translations:', error);
    process.exit(1);
  }
};

// Check command line arguments
const command = process.argv[2];

if (command === 'manual') {
  applyManualTranslations();
} else {
  translateProducts();
}
