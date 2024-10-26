// // models/productsModels.js

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

  return Product;
};