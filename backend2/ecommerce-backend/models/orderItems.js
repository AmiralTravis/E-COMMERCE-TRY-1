// models/orderItems.js
module.exports = (sequelize, DataTypes) => {
    const OrderItems = sequelize.define('OrderItems', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Orders', // Name of the target model
          key: 'id',       // Key in the target model
        },
        onDelete: 'CASCADE',
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Products', // Name of the target model
          key: 'id',         // Key in the target model
        },
        onDelete: 'CASCADE',
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    }, {
      tableName: 'OrderItems', // Explicitly specify the table name
      timestamps: false,       // Disable Sequelize's automatic timestamps if not needed
    });
  
    // // Associations
    OrderItems.associate = (models) => {
      OrderItems.belongsTo(models.Order, { 
        foreignKey: 'orderId',
        onDelete: 'CASCADE',
      }) 
    }
  
    return OrderItems;
  };
  