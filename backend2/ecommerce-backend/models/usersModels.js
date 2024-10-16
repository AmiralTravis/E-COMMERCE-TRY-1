// models/usersModels.js

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,  // or DataTypes.VARCHAR if you want to specify length
      allowNull: false,
      defaultValue: 'user',  // Setting default role to 'user'
    },
  }, {
    timestamps: true,
    freezeTableName: true,
    tableName: 'Users',
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
  });

  return User;
};