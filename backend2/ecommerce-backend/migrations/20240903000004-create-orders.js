module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('Orders', {
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
          onDelete: 'SET NULL',
        },
        totalAmount: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        status: {
          type: Sequelize.STRING,
          allowNull: false,
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
      await queryInterface.dropTable('Orders');
    },
  };
  