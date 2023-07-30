const mongoose = require('mongoose');
const Product = require('../Models/ProductModel'); 

const cleanupOutdatedProducts = async () => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Delete products where the endTime is less than or equal to one day ago
    const deletedProducts = await Product.deleteMany({ endTime: { $lte: oneDayAgo } });

    console.log(`${deletedProducts.deletedCount} outdated products deleted.`);
  } catch (error) {
    console.error('Error deleting outdated products:', error);
  }
};

module.exports = cleanupOutdatedProducts;
