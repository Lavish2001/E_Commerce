let express = require("express");
let router = express.Router();
const loginAuth = require('../app/Middlewares/Auth');

// user Routes
// let short_urls = controller("Api/ETURLController");
// router.get("/:short_code", [], (req, res) => {
//   return short_urls.redirectoShortLink(req, res);
// });


let pcontroller = controller("Api/product_controller");


// Product Ejs Route

router.get('/common', loginAuth, (req, res) => {
  return pcontroller.common(req, res);
});

router.get('/all', async (req, res) => {
  return res.render('displayProducts');
});

router.get('/orders', async (req, res) => {
  return res.render('orders');
});


router.get('/addproducts', (req, res) => {
  return res.render('index1');
});

router.get('/edit', (req, res) => {
  return res.render('edit');
});

router.get('/sell', (req, res) => {
  return res.render('sell');
});

router.get('/sellingList', (req, res) => {
  return res.render('sell_products');
});

router.get('/editSell', (req, res) => {
  return res.render('edit-sell');
});

router.get('/buy', (req, res) => {
  return res.render('buy-product');
});

router.get('/sold', (req, res) => {
  return res.render('sold');
});

router.get('/stats', (req, res) => {
  return res.render('stats');
});



// Product Api Routes

router.get('/listOfAllProducts', loginAuth, (req, res) => {
  return pcontroller.allProducts(req, res);
});

router.post('/setProduct', (req, res) => {
  return pcontroller.setProducts(req, res);
});

router.post('/editProduct', (req, res) => {
  return pcontroller.editProduct(req, res);
});

router.post('/sellProduct', (req, res) => {
  return pcontroller.sellProduct(req, res);
});

router.get('/getSellProduct', (req, res) => {
  return pcontroller.getSellProduct(req, res);
});

router.post('/editSellProduct', (req, res) => {
  return pcontroller.editSellProduct(req, res);
});

router.post('/buy', loginAuth, (req, res) => {
  return pcontroller.buy(req, res);
});

router.get('/soldProducts', loginAuth, (req, res) => {
  return pcontroller.soldProducts(req, res);
});

router.post('/getStats', loginAuth, (req, res) => {
  return pcontroller.getStats(req, res);
});

router.get('/soloBuyProduct', loginAuth, (req, res) => {
  return pcontroller.orders(req, res);
});



module.exports = router;
