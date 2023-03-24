'use strict';
const { Model, DataTypes } = require('sequelize');
const Product = require('../Models/Product');
module.exports = async (sequelize) => {
    class Buy extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Buy.init({
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        product_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        purchase_price: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        sale_price: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        quantity: {
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
        tableName: 'Buy',
        timestamps: false
    });

    module.exports = Buy;
};