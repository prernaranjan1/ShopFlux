const db = require("../db");

// ✅ GET ALL PRODUCTS
exports.getProducts = (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ 
        success: false,
        message: "Failed to fetch products" 
      });
    }
    res.json({ 
      success: true,
      data: result 
    });
  });
};

// ✅ GET SINGLE PRODUCT BY ID
exports.getProductById = (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ 
      success: false,
      message: "Missing productId" 
    });
  }

  db.query("SELECT * FROM products WHERE id = ?", [productId], (err, result) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ 
        success: false,
        message: "Failed to fetch product" 
      });
    }

    if (!result || result.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }

    res.json({ 
      success: true,
      data: result[0] 
    });
  });
};

// ✅ SEARCH PRODUCTS BY NAME
exports.searchProducts = (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.status(400).json({ 
      success: false,
      message: "Missing search parameter" 
    });
  }

  const searchTerm = `%${search}%`;
  db.query(
    "SELECT * FROM products WHERE name LIKE ? OR description LIKE ?",
    [searchTerm, searchTerm],
    (err, result) => {
      if (err) {
        console.error("Error searching products:", err);
        return res.status(500).json({ 
          success: false,
          message: "Failed to search products" 
        });
      }

      res.json({ 
        success: true,
        data: result,
        count: result.length
      });
    }
  );
};

// ✅ GET PRODUCTS BY CATEGORY
exports.getProductsByCategory = (req, res) => {
  const { category } = req.params;

  if (!category) {
    return res.status(400).json({ 
      success: false,
      message: "Missing category" 
    });
  }

  db.query(
    "SELECT * FROM products WHERE category = ?",
    [category],
    (err, result) => {
      if (err) {
        console.error("Error fetching products by category:", err);
        return res.status(500).json({ 
          success: false,
          message: "Failed to fetch products by category" 
        });
      }

      res.json({ 
        success: true,
        data: result,
        count: result.length
      });
    }
  );
};

// ✅ CREATE PRODUCT (ADMIN ONLY)
exports.createProduct = (req, res) => {
  const { name, price, description, category, stock } = req.body;

  // Validation
  if (!name || !price || !category) {
    return res.status(400).json({ 
      success: false,
      message: "Missing required fields: name, price, category" 
    });
  }

  const query = "INSERT INTO products (name, price, description, category, stock) VALUES (?, ?, ?, ?, ?)";
  const values = [name, price, description || null, category, stock || 0];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error creating product:", err);
      return res.status(500).json({ 
        success: false,
        message: "Failed to create product" 
      });
    }

    res.status(201).json({ 
      success: true,
      message: "Product created successfully",
      productId: result.insertId 
    });
  });
};

// ✅ UPDATE PRODUCT (ADMIN ONLY)
exports.updateProduct = (req, res) => {
  const { productId } = req.params;
  const { name, price, description, category, stock } = req.body;

  if (!productId) {
    return res.status(400).json({ 
      success: false,
      message: "Missing productId" 
    });
  }

  // Build dynamic update query
  const updates = [];
  const values = [];

  if (name !== undefined) {
    updates.push("name = ?");
    values.push(name);
  }
  if (price !== undefined) {
    updates.push("price = ?");
    values.push(price);
  }
  if (description !== undefined) {
    updates.push("description = ?");
    values.push(description);
  }
  if (category !== undefined) {
    updates.push("category = ?");
    values.push(category);
  }
  if (stock !== undefined) {
    updates.push("stock = ?");
    values.push(stock);
  }

  if (updates.length === 0) {
    return res.status(400).json({ 
      success: false,
      message: "No fields to update" 
    });
  }

  values.push(productId);

  const query = `UPDATE products SET ${updates.join(", ")} WHERE id = ?`;

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating product:", err);
      return res.status(500).json({ 
        success: false,
        message: "Failed to update product" 
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }

    res.json({ 
      success: true,
      message: "Product updated successfully" 
    });
  });
};

// ✅ DELETE PRODUCT (ADMIN ONLY)
exports.deleteProduct = (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ 
      success: false,
      message: "Missing productId" 
    });
  }

  db.query("DELETE FROM products WHERE id = ?", [productId], (err, result) => {
    if (err) {
      console.error("Error deleting product:", err);
      return res.status(500).json({ 
        success: false,
        message: "Failed to delete product" 
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }

    res.json({ 
      success: true,
      message: "Product deleted successfully" 
    });
  });
};