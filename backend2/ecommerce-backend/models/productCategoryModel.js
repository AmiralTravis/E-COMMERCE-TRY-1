// models/productCategoryModel.js
module.exports = (sequelize, DataTypes) => {
    const ProductCategory = sequelize.define('ProductCategory', {
      productId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Products',
          key: 'id'
        }
      },
      categoryId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Categories',
          key: 'id'
        }
      }
    }, {
      timestamps: true,
    });
  
    return ProductCategory;
  };