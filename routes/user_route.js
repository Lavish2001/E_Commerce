let express = require("express");
let router = express.Router();
const loginAuth = require('../app/Middlewares/Auth');

// user Routes
// let short_urls = controller("Api/ETURLController");
// router.get("/:short_code", [], (req, res) => {
//   return short_urls.redirectoShortLink(req, res);
// });


let ucontroller = controller("Api/user_controller");


// User Ejs Route

router.get('/', (req, res) => {
  return res.render('login');
});


router.get('/createUser', (req, res) => {
  return res.render('create');
});


// User Api Route

router.post('/logUser', (req, res) => {
  return ucontroller.logUser(req, res);
});

router.post('/makeUser', loginAuth, (req, res) => {
  return ucontroller.makeUser(req, res);
});




module.exports = router;
