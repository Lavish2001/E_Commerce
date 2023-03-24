'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = async (sequelize) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init({
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    productCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    productImage: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    quantity: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    purchasePricePerUnit: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    tableName: 'Product',
    timestamps: false
  });


  module.exports = Product;
};