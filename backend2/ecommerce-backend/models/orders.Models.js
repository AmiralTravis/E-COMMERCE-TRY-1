// models/ordersModels.js

const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      }
    },
    sellerId: { // Add this field
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      }
    },
    totalAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(
        'Pending', 
        'Processing', 
        'Shipping', 
        'Delivering', 
        'Delivered', 
        
      ),
      allowNull: false,
      defaultValue: 'Pending'
    },
    paymentVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    trackingNumber: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    estimatedDeliveryDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estimatedDate: {
      type: DataTypes.DATE, // Changed from DATEONLY to full DATE type
      allowNull: true,
      get() {
        // Always return UTC
        const value = this.getDataValue('estimatedDate');
        return value ? moment.utc(value).toDate() : null;
      },
      set(value) {
        // Ensure value is converted to UTC before saving
        this.setDataValue('estimatedDate', 
          value ? moment(value).utc().toDate() : null
        );
      }
    }
  }, {
    timestamps: true,
    tableName: 'Orders'
  });

  // Associations
  Order.associate = (models) => {
    Order.hasOne(models.UserAddress, {
      foreignKey: 'userId',
      sourceKey: 'userId'
    });
    Order.belongsTo(models.User, { foreignKey: 'sellerId', as: 'seller' }); 

    Order.hasMany(models.OrderItems, {
      foreignKey: 'orderId',
      onDelete: 'CASCADE',
    });
  };

  return Order;
};