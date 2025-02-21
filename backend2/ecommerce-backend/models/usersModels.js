// // models/usersModels.js

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { // Add this
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false // ID should never be null
    },
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

    profilePicUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: function() {
        // Ensure absolute URL in database
        return `${process.env.BASE_URL}/generated-avatars/generated-${this.id}.png`;
      }
    },
    // Add these fields to your User model definition
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
  }, {
    timestamps: true,
    freezeTableName: true,
    tableName: 'Users',
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
  });

  User.prototype.isSuperAdmin = function() {
    return this.role === 'superadmin';
  };

  User.prototype.isAdminOrSuperAdmin = function() {
    return this.role === 'admin' || this.role === 'superadmin';
  };

  

  return User;
};