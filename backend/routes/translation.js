const express = require('express');
const router = express.Router();
const openaiService = require('../services/openaiService');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Translate text using OpenAI
// @route   POST /api/translation/translate
// @access  Private/Admin
router.post('/translate', protect, admin, async (req, res) => {
  try {
    const { text, targetLanguage = 'en' } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required'
      });
    }

    // Use OpenAI service to translate
    const result = await openaiService.translateText(text, targetLanguage);

    if (result.success) {
      res.json({
        success: true,
        data: {
          original: text,
          translation: result.translation,
          targetLanguage,
          tokensUsed: result.tokensUsed
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.error || 'Translation failed'
      });
    }

  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi dịch văn bản'
    });
  }
});

// @desc    Batch translate multiple texts
// @route   POST /api/translation/batch-translate
// @access  Private/Admin
router.post('/batch-translate', protect, admin, async (req, res) => {
  try {
    const { texts, targetLanguage = 'en' } = req.body;

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Texts array is required'
      });
    }

    if (texts.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 10 texts per batch'
      });
    }

    const translations = [];
    let totalTokens = 0;

    for (const text of texts) {
      if (text && text.trim()) {
        const result = await openaiService.translateText(text.trim(), targetLanguage);
        translations.push({
          original: text,
          translation: result.success ? result.translation : text,
          success: result.success,
          error: result.error
        });
        totalTokens += result.tokensUsed || 0;
      } else {
        translations.push({
          original: text,
          translation: text,
          success: true,
          error: null
        });
      }
    }

    res.json({
      success: true,
      data: {
        translations,
        totalTokens,
        targetLanguage
      }
    });

  } catch (error) {
    console.error('Batch translation error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi dịch hàng loạt'
    });
  }
});

// @desc    Auto-translate product fields
// @route   POST /api/translation/product/:id
// @access  Private/Admin
router.post('/product/:id', protect, admin, async (req, res) => {
  try {
    const Product = require('../models/Product');
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    const updates = {};
    let totalTokens = 0;

    // Translate name if not exists
    if (product.name && !product.name_en) {
      const nameResult = await openaiService.translateText(product.name, 'en');
      if (nameResult.success) {
        updates.name_en = nameResult.translation;
        totalTokens += nameResult.tokensUsed;
      }
    }

    // Translate description if not exists
    if (product.description && !product.description_en) {
      const descResult = await openaiService.translateText(product.description, 'en');
      if (descResult.success) {
        updates.description_en = descResult.translation;
        totalTokens += descResult.tokensUsed;
      }
    }

    // Update product if there are translations
    if (Object.keys(updates).length > 0) {
      await Product.findByIdAndUpdate(req.params.id, updates);
      
      res.json({
        success: true,
        data: {
          productId: req.params.id,
          updates,
          totalTokens
        },
        message: 'Dịch sản phẩm thành công'
      });
    } else {
      res.json({
        success: true,
        message: 'Sản phẩm đã có bản dịch tiếng Anh'
      });
    }

  } catch (error) {
    console.error('Product translation error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi dịch sản phẩm'
    });
  }
});

// @desc    Auto-translate all products
// @route   POST /api/translation/products/batch
// @access  Private/Admin
router.post('/products/batch', protect, admin, async (req, res) => {
  try {
    const Product = require('../models/Product');
    
    // Find products that need translation
    const products = await Product.find({
      $or: [
        { name_en: { $exists: false } },
        { name_en: null },
        { name_en: '' },
        { description_en: { $exists: false } },
        { description_en: null },
        { description_en: '' }
      ]
    });

    if (products.length === 0) {
      return res.json({
        success: true,
        message: 'Tất cả sản phẩm đã có bản dịch'
      });
    }

    let totalTokens = 0;
    let translatedCount = 0;
    const results = [];

    for (const product of products) {
      const updates = {};

      // Translate name
      if (product.name && (!product.name_en || product.name_en.trim() === '')) {
        const nameResult = await openaiService.translateText(product.name, 'en');
        if (nameResult.success) {
          updates.name_en = nameResult.translation;
          totalTokens += nameResult.tokensUsed;
        }
      }

      // Translate description
      if (product.description && (!product.description_en || product.description_en.trim() === '')) {
        const descResult = await openaiService.translateText(product.description, 'en');
        if (descResult.success) {
          updates.description_en = descResult.translation;
          totalTokens += descResult.tokensUsed;
        }
      }

      // Update product
      if (Object.keys(updates).length > 0) {
        await Product.findByIdAndUpdate(product._id, updates);
        translatedCount++;
        results.push({
          productId: product._id,
          name: product.name,
          updates
        });
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    res.json({
      success: true,
      data: {
        totalProducts: products.length,
        translatedCount,
        totalTokens,
        results
      },
      message: `Đã dịch ${translatedCount} sản phẩm thành công`
    });

  } catch (error) {
    console.error('Batch product translation error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi dịch hàng loạt sản phẩm'
    });
  }
});

module.exports = router;
