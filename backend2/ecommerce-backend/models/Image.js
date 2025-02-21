// /models/Image.js

module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      type: {
        type: DataTypes.ENUM('avatar', 'product'),
        allowNull: false,
        validate: {
          isIn: [['avatar', 'product']]
        }
      },
      original: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          isUrl: true
        }
      },
      large: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true
        }
      },
      medium: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true
        }
      },
      small: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true
        }
      },
      thumbnail: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true
        }
      },
      metadata: {
        type: DataTypes.JSONB,
        defaultValue: {}
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: true
        }
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: true
        }
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    }, {
      tableName: 'images',
      timestamps: true,
      paranoid: true, // Enable soft deletion
      indexes: [
        {
          unique: true,
          fields: ['userId'],
          where: { type: 'avatar' }
        },
        {
          fields: ['productId'],
          where: { type: 'product' }
        }
      ],
      hooks: {
        beforeValidate: (image) => {
          if (image.type === 'avatar' && !image.userId) {
            throw new Error('Avatar images must have a userId');
          }
          if (image.type === 'product' && !image.productId) {
            throw new Error('Product images must have a productId');
          }
        }
      }
    });
  
    Image.associate = (models) => {
      Image.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        constraints: false
      });
      
      Image.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product',
        constraints: false
      });
    };
  
    // Instance methods
    Image.prototype.getResizedUrls = function() {
      return {
        original: this.original,
        large: this.large,
        medium: this.medium,
        small: this.small,
        thumbnail: this.thumbnail
      };
    };
  
    // Class methods
    Image.findByType = async function(type, options = {}) {
      return this.findAll({
        where: { type },
        ...options
      });
    };
  
    return Image;
  };