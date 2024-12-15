// // // // models/ordersModels.js

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
    totalAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false
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
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
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
  
  Order.hasMany(models.OrderItems, {
    foreignKey: 'orderId',
    onDelete: 'CASCADE',
  });
};
  

  return Order;
};