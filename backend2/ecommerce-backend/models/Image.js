// /models/Image.js

module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
      id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      url: {  // Single URL field instead of multiple sizes
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
              notEmpty: true,
              isUrl: true
          }
      },
      thumbnail: {  // Add the thumbnail field
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'default_thumbnail.jpg',  // Ensure existing records have a value
        validate: {
            notEmpty: true,
            isUrl: true // If the thumbnail is a URL
        }
    },
      productId: {  // Each image belongs to a product
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
              isInt: true
          }
      },
      order: {  // Controls image order for product display
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
  }, {
      tableName: 'Images',
      timestamps: true
  });

  // Associations
  Image.associate = (models) => {
      Image.belongsTo(models.Product, {
          foreignKey: 'productId',
          as: 'product'
      });
  };

  return Image;
};
