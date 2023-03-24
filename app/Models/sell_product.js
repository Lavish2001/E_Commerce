'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = async (sequelize) => {
    class sellProduct extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    sellProduct.init({
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        product_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        product_code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        product_image: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },
        quantity: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        sale_price: {
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
        tableName: 'sellProduct',
        timestamps: false
    });

    module.exports = sellProduct;
};