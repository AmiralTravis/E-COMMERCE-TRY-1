// // // models/productsModels.js

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Categories',
        key: 'id',
      },
    },
  }, {
    timestamps: true,
  });

  Product.addHook('afterUpdate', async (product) => {
    if (product.stock <= 10) {
      // Send low stock alert (implement this functionality)
      console.log(`Low stock alert for product ${product.id}: ${product.name}`);
    }
  });

  return Product;
};