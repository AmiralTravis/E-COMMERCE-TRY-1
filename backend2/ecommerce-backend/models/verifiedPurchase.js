// models/verifiedPurchase.js
module.exports = (sequelize, DataTypes) => {
    const VerifiedPurchase = sequelize.define('VerifiedPurchase', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id'
        }
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'id'
        }
      }
    }, {
      timestamps: true,
      tableName: 'VerifiedPurchases',
      indexes: [
        {
          unique: true,
          fields: ['userId', 'productId']
        }
      ]
    });
  
    return VerifiedPurchase;
  };
  