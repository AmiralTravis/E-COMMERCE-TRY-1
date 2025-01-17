// models/reviewsModels.js
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    productId: {  // Changed to snake_case
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {     // Changed to snake_case
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    timestamps: true, // Adds createdAt and updatedAt fields
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Product, { foreignKey: 'productId' });
    Review.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Review;
};
