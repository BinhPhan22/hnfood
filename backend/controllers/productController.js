const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { category, keyword, min_price, max_price, sort, featured, lang } = req.query;
    
    // Build query
    let query = { is_active: true };
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by featured
    if (featured === 'true') {
      query.is_featured = true;
    }
    
    // Search by keyword (support both languages)
    if (keyword) {
      const searchFields = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { seo_keywords: { $in: [new RegExp(keyword, 'i')] } }
      ];

      // Add English fields if they exist
      if (lang === 'en') {
        searchFields.push(
          { name_en: { $regex: keyword, $options: 'i' } },
          { description_en: { $regex: keyword, $options: 'i' } }
        );
      }

      query.$or = searchFields;
    }
    
    // Filter by price range
    if (min_price || max_price) {
      query.price = {};
      if (min_price) query.price.$gte = Number(min_price);
      if (max_price) query.price.$lte = Number(max_price);
    }
    
    // Build sort options
    let sortOptions = {};
    if (sort) {
      switch (sort) {
        case 'price_asc':
          sortOptions = { price: 1 };
          break;
        case 'price_desc':
          sortOptions = { price: -1 };
          break;
        case 'newest':
          sortOptions = { created_at: -1 };
          break;
        case 'name_asc':
          sortOptions = { name: 1 };
          break;
        default:
          sortOptions = { created_at: -1 };
      }
    } else {
      sortOptions = { created_at: -1 };
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Execute query
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Transform products based on language
    const transformedProducts = products.map(product => {
      const productObj = product.toObject();

      if (lang === 'en') {
        // Use English fields if available, fallback to Vietnamese
        productObj.name = productObj.name_en || productObj.name;
        productObj.description = productObj.description_en || productObj.description;
      }

      return productObj;
    });

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products: transformedProducts,
        page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server' 
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const { lang } = req.query;
    const product = await Product.findById(req.params.id);

    if (product && product.is_active) {
      const productObj = product.toObject();

      if (lang === 'en') {
        // Use English fields if available, fallback to Vietnamese
        productObj.name = productObj.name_en || productObj.name;
        productObj.description = productObj.description_en || productObj.description;
      }

      res.json({
        success: true,
        data: productObj
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Get product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      slug: req.params.slug,
      is_active: true 
    });
    
    if (product) {
      res.json({
        success: true,
        data: product
      });
    } else {
      res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy sản phẩm' 
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server' 
    });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, images, category, stock, seo_keywords, is_featured } = req.body;
    
    const product = await Product.create({
      name,
      price,
      description,
      images,
      category,
      stock,
      seo_keywords,
      is_featured: is_featured || false
    });
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server' 
    });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      res.json({
        success: true,
        data: updatedProduct
      });
    } else {
      res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy sản phẩm' 
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server' 
    });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      // Soft delete - set is_active to false
      product.is_active = false;
      await product.save();
      
      res.json({
        success: true,
        message: 'Sản phẩm đã được xóa'
      });
    } else {
      res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy sản phẩm' 
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server' 
    });
  }
};

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = [
      { 
        value: 'thuc-pham-huu-co', 
        label: 'Thực phẩm hữu cơ',
        description: 'Thực phẩm sạch, không hóa chất'
      },
      { 
        value: 'cham-soc-ca-nhan', 
        label: 'Chăm sóc cá nhân',
        description: 'Sản phẩm chăm sóc sức khỏe và làm đẹp'
      },
      { 
        value: 'thuc-pham-chuc-nang', 
        label: 'Thực phẩm chức năng',
        description: 'Vitamin, thực phẩm bổ sung'
      }
    ];
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server' 
    });
  }
};
