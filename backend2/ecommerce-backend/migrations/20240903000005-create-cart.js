module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('Carts', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        userId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        productId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Products',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
      });
    },
  
    down: async (queryInterface) => {
      await queryInterface.dropTable('Carts');
    },
  };
  