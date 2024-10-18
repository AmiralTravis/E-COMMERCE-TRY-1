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
      type: DataTypes.ENUM('user', 'admin', 'superadmin'),
      allowNull: false,
      defaultValue: 'user',
    },
  }, {
    timestamps: true,
    freezeTableName: true,
    tableName: 'Users',
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
  });

  // Instance method to check if the user is a superadmin
  User.prototype.isSuperAdmin = function() {
    return this.role === 'superadmin';
  };

  // Instance method to check if the user is an admin or superadmin
  User.prototype.isAdminOrSuperAdmin = function() {
    return this.role === 'admin' || this.role === 'superadmin';
  };

  return User;
};