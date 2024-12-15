// models/productModel.js
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
    }
    
  }, {
    timestamps: true,
  });

  // Associations  
  Product.associate = (models) => {
    Product.hasMany(models.OrderItems, {
      foreignKey: 'productId',
      onDelete: 'CASCADE',
    });
  };
  
  return Product;
};