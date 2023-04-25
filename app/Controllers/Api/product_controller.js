const { sequelize } = require("../../Models/index");
const Product = require('../../Models/Product');
const sellProduct = require('../../Models/sell_product');
const Buy = require('../../Models/buy');
const User = require('../../Models/user');
const multer = require('multer');
const { QueryTypes } = require('sequelize');




// Function For Check Product_Code Contain Atleast 2 NUMBER

const check = (string) => {
  var num = 0;
  for (let i = 0; i < string.length; i++) {
    if (string[i].match(/[0-9]/g)) { num++ }
  };
  if (num >= 2) { return true } else { return false }
};



// Configure store

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Public/Products/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname.split('.')[0] + '-' + Date.now() + '.' + file.mimetype.split('/')[1])
  }
});



// Middleware Upload Function

const upload = multer({
  storage: storage, limits: { fileSize: 1024 * 1024 * 10, fieldNameSize: 100 }, fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg for image format allowed!'));
    }
  }
}).single('productImage');




module.exports = class productController {


  // Details Of All Products Sale And Purchase

  async allProducts(req, res) {
    const all = await Product.findAll();
    if (!all.length) {
      return res.status(400).json({ 'status': 'failed', 'message': 'No Product found' });
    }
    else {
      for (let i = 0; i < all.length; i++) {
        for (let j = 0; j < all.length - 1; j++) {
          if (all[j].createdAt < all[j + 1].createdAt) {
            [all[j], all[j + 1]] = [all[j + 1], all[j]]
          }
        }
      };
      return res.json(all);
    }
  }







  // Purchase Products

  async setProducts(req, res) {

    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ 'status': 'failed', 'message': err.message })
      } else {
        if (req.file && req.body.productName.trim() && req.body.productCode.trim() && req.body.productQuantity.trim() && req.body.purchase_price_per_unit.trim() && req.body.email.trim()) {
          if (check(req.body.productCode)) {
            const find = await Product.findOne({ where: { productCode: req.body.productCode } });
            if (find) {
              res.status(400).json({ 'status': 'failed', 'message': 'Product code already exists' })
            } else {
              const find = await User.findOne({ where: { user_email: req.body.email } });
              if (find.admin === true) {
                await Product.create({
                  productName: req.body.productName.trim(),
                  productCode: req.body.productCode.trim(),
                  productImage: req.file.filename.trim(),
                  quantity: req.body.productQuantity.trim(),
                  purchasePricePerUnit: req.body.purchase_price_per_unit.trim()
                });
                return res.status(200).redirect('/all')
              } else {
                return res.status(400).json({ 'status': 'failed', 'message': 'only admin purchase products' })
              }
            }
          } else {
            return res.status(400).json({ 'status': 'failed', 'message': 'Product code must contain 2 Numbers' })
          }
        } else {
          return res.status(400).json({ 'status': 'failed', 'message': 'All fields required' })
        }
      }
    })
  }







  // Edit Purchase Products

  async editProduct(req, res) {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ 'status': 'failed', 'message': err.message })
      } else {
        if (req.body.productCode && req.body.email) {
          if (req.file || req.body.productName || req.body.productQuantity || req.body.purchase_price_per_unit) {
            const edit = await Product.findOne({ where: { productCode: req.body.productCode } });
            if (edit) {
              if (Number(edit.quantity) + Number(req.body.productQuantity) < 0) {
                return res.status(400).json({ 'status': 'failed', 'message': 'selected quantity greater than available quantity' })
              } else {
                const find = await User.findOne({ where: { user_email: req.body.email } });
                if (find.admin === true) {
                  await edit.update({
                    productName: req.body.productName ? req.body.productName : edit.productName,
                    productImage: req.file ? req.file.filename : edit.productImage,
                    quantity: req.body.productQuantity ? Number(edit.quantity) + Number(req.body.productQuantity) : edit.quantity,
                    purchasePricePerUnit: req.body.purchase_price_per_unit ? req.body.purchase_price_per_unit : edit.purchasePricePerUnit,
                    updatedAt: Date.now()
                  });
                  return res.status(200).redirect('/all')
                } else {
                  return res.status(400).json({ 'status': 'failed', 'message': 'only admin edit products' })
                }
              }
            } else {
              return res.status(400).json({ 'status': 'failed', 'message': 'product code not matched' })
            }
          } else {
            return res.status(400).json({ 'status': 'failed', 'message': 'enter details correctly' })
          }
        } else {
          res.status(400).json({ 'status': 'failed', 'message': 'please enter product code and admin email' })
        }
      }
    })
  }








  // Sell Purchase Products

  async sellProduct(req, res) {
    if (req.body.productCode && req.body.quantity && req.body.salePrice && req.body.email) {
      const product = await Product.findOne({ where: { productCode: req.body.productCode } });
      if (Number(product.quantity) < Number(req.body.quantity)) {
        return res.status(400).json({ 'status': 'failed', 'message': 'out of stock' })
      } else {
        const find = await User.findOne({ where: { user_email: req.body.email } });
        if (find.admin === true) {
          const exist = await sellProduct.findOne({ where: { product_code: req.body.productCode } });
          if (exist) { return res.status(400).json({ 'status': 'failed', 'message': 'already selling this product' }) } else {
            const sell = await sellProduct.create({
              product_name: product.productName,
              product_code: product.productCode,
              product_image: product.productImage,
              quantity: req.body.quantity,
              sale_price: req.body.salePrice
            });
            if (sell) {
              await product.update({
                quantity: Number(product.quantity) - Number(req.body.quantity)
              });
              return res.status(200).redirect('/all')
            } else {
              return res.status(400).json({ 'status': 'failed', 'message': 'error' })
            }
          }
        } else {
          return res.status(400).json({ 'status': 'failed', 'message': 'only admin sell products' })
        }
      }
    } else {
      return res.status(400).json({ 'status': 'failed', 'message': 'all fields required' })
    }
  }







  // List Of All Selling Products

  async getSellProduct(req, res) {
    const allSellProduct = await sellProduct.findAll();

    if (!allSellProduct.length) {
      return res.status(400).json({ 'status': 'failed', 'message': 'No Product found' });
    }
    else {
      for (let i = 0; i < allSellProduct.length; i++) {
        for (let j = 0; j < allSellProduct.length - 1; j++) {
          if (allSellProduct[j].createdAt < allSellProduct[j + 1].createdAt) {
            [allSellProduct[j], allSellProduct[j + 1]] = [allSellProduct[j + 1], allSellProduct[j]]
          }
        }
      };
      return res.json(allSellProduct);
    }
  }





  // Edit Selling Products

  async editSellProduct(req, res) {
    if (req.body.productCode && req.body.email) {
      const sell = await sellProduct.findOne({ where: { product_code: req.body.productCode } });
      const product = await Product.findOne({ where: { productCode: sell.product_code } });
      if (Number(product.quantity) < Number(req.body.quantity) || Number(req.body.quantity) < 0) {
        return res.status(400).json({ 'status': 'failed', 'message': 'out of stock' })
      } else {
        const find = await User.findOne({ where: { user_email: req.body.email } });
        if (find.admin === true) {
          await sell.update({
            quantity: req.body.quantity ? Number(sell.quantity) + Number(req.body.quantity) : sell.quantity,
            sale_price: req.body.salePrice ? req.body.salePrice : sell.sale_price,
            updatedAt: Date.now()
          });

          await product.update({
            quantity: req.body.quantity ? Number(product.quantity) - Number(req.body.quantity) : product.quantity
          });
          return res.redirect('/all')
        } else {
          return res.status(400).json({ 'status': 'failed', 'message': 'only admin edit products' })
        }
      }
    } else {
      return res.status(400).json({ 'status': 'failed', 'message': 'product code and admin email both require' })
    }
  }






  // Buy A Products

  async buy(req, res) {
    if (req.body.productCode && req.body.quantity) {
      const product = await Product.findOne({ where: { productCode: req.body.productCode } });
      const sell = await sellProduct.findOne({ where: { product_code: req.body.productCode } });
      if (Number(sell.quantity) < Number(req.body.quantity)) {
        return res.status(400).json({ 'status': 'failed', 'message': 'out of stock' })
      } else {
        await Buy.create({
          product_code: req.body.productCode,
          purchase_price: product.purchasePricePerUnit,
          sale_price: sell.sale_price,
          quantity: req.body.quantity,
          user_id: req.user.id
        });
        await sell.update({
          quantity: req.body.quantity ? Number(sell.quantity) - Number(req.body.quantity) : sell.quantity
        });
        res.status(200).json({ 'status': 'success', 'message': 'You buy a product' })
      }
    } else {
      return res.status(400).json({ 'status': 'failed', 'message': 'all fields required' })
    }
  }






  // Details Of All Sold Products

  async soldProducts(req, res) {
    const sold = await sequelize.query(`select DISTINCT product_code,(select SUM(quantity) from Buy where product_code=B.product_code)AS total_quantity,
    (select purchasePricePerUnit from Product where productCode = B.product_code)AS purchase_price,
    (select product_name from sellProduct where product_code = B.product_code)AS product_name,
    (select sale_price from sellProduct where product_code = B.product_code)AS sale_price,
    (select product_image from sellProduct where product_code = B.product_code)AS product_image from Buy B`, {
      type: QueryTypes.SELECT,
    });
    if (sold) {
      return res.json(sold)
    } else {
      return res.json('error')
    }
  }






  // Stats In Week, Month Or Year Of All Products

  async getStats(req, res) {
    const week = new Date(Date.now() + (19800000 - 604800000)).toISOString();
    const month = new Date(Date.now() + (19800000 - 2628000000)).toISOString();
    const year = new Date(Date.now() + (19800000 - 31557600000)).toISOString();
    const stats = await sequelize.query(`select DISTINCT product_code,(select SUM(quantity) from Buy where product_code=B.product_code)AS total_quantity_sold,
      (select product_image from sellProduct where product_code = B.product_code)AS product_image,
      (select product_name from sellProduct where product_code = B.product_code)AS product_name,
      (select (purchase_price*total_quantity_sold) from Buy where product_code = B.product_code LIMIT 1)AS total_purchase_price,
      (select (sale_price*total_quantity_sold) from Buy where product_code = B.product_code LIMIT 1)AS total_sale_price
      from Buy B where  updatedAt BETWEEN :time AND :present`, {
      type: QueryTypes.SELECT,
      replacements: {
        id: 1, present: new Date(Date.now() + 19800000).toISOString(), time: req.body.stat === 'Week' ? week : req.body.stat === 'Month' ? month :
          req.body.stat === 'Year' ? year : null
      }
    });
    if (req.user.admin === true) {
      return res.json(stats)
    } else {
      return res.status(400).json({ 'status': 'failed', 'message': 'only admin see this details' })
    }
  };





  // Only ADMINS See This EJS Template

  async common(req, res) {
    if (req.user.admin === true) {
      return res.status(200).json({ 'status': 'success' });
    } else {
      return res.status(400).json({ 'status': 'failed', 'message': 'only admin see this page' })
    }
  }





  // All Orders List Of Single User

  async orders(req, res) {
    const sold = await sequelize.query(`select product_code,quantity, createdAt AS Order_At,
    (select product_name from sellProduct where product_code = B.product_code)AS product_name,
    (select sale_price from sellProduct where product_code = B.product_code)AS product_price,
    (select product_image from sellProduct where product_code = B.product_code)AS product_image from Buy AS B where user_id=:id`, {
      type: QueryTypes.SELECT,
      replacements: { id: req.user.id }
    });
    if (sold) {
      for (let i = 0; i < sold.length; i++) {
        for (let j = 0; j < sold.length - 1; j++) {
          if (sold[j].orderAt < sold[j + 1].orderdAt) {
            [sold[j], sold[j + 1]] = [sold[j + 1], sold[j]]
          }
        }
      };
      return res.status(200).json(sold)
    } else {
      return res.status(400).json({ 'status': 'failed', 'message': 'Error' })
    }
  }


};



