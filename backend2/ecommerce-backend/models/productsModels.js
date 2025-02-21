// // // models/productModel.js

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
    discountPercentage: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 75,
      },
    },
    discountCategory: {
      type: DataTypes.ENUM('upto_75', 'flat_50', 'upto_40', 'none'),
      defaultValue: 'none',
    },
  }, {
    timestamps: true,
  });

  Product.associate = (models) => {
    Product.hasMany(models.Review, { 
      foreignKey: 'productId',
      as: 'reviews' // Add alias for clarity
    });
    Product.belongsToMany(models.Category, {
      through: models.ProductCategory,
      foreignKey: 'productId',
      otherKey: 'categoryId',  
      as: 'categories'
    });
  };



  Product.getTopProducts = async function(limit) {
    return await this.findAll({
      order: [['avgRating', 'DESC']],
      limit: limit,
      attributes: {
        include: [
          [
            sequelize.literal('(SELECT COUNT(*) FROM "Reviews" WHERE "productId" = "Product".id)'),
            'reviewCount'
          ]
        ]
      }
    });
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
