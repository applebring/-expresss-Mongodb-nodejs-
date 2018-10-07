const express = require('express');
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

router.get('/',function(req,res,next){
  //清空session中用户信息
 res.render("logout");
})
router.get('/exit',function(req,res,next){
  req.session.user = null
  console.log("清空session")
  res.redirect("/signin");
})
//POST /
module.exports = router;