// // models/productModel.js

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
    avgRating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0, // Ensure default value is a number
    },
  }, {
    timestamps: true,
  });

  Product.associate = (models) => {
    Product.hasMany(models.Review, { foreignKey: 'productId' });
  };

  Product.updateAverageRating = async function(productId) {
    const result = await sequelize.query(
      'SELECT AVG(rating) as "avgRating" FROM "Reviews" WHERE "productId" = ?',
      {
        replacements: [productId],
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    await this.update(
      { avgRating: Number(result[0].avgRating) || 0 }, // Ensure fallback to 0
      { where: { id: productId } }
    );
  };

  return Product;
};