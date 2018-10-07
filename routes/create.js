const express = require('express');
const router = express.Router()
const checkLogin = require('../middlewares/check').checkLogin

router.get('/',function(req,res,next){
  res.render("create");
})
const PostModel = require("../lib/mongo").Post

var bodyParser = require('body-parser');  //调用模板
var urlencodedParser = bodyParser.urlencoded({ extended: false })
router.post('/',checkLogin,function(req,res,next){
  const author = req.session.user._id;
  const title = req.fields.title;
  const content = req.fields.content;
  
  try{
    if(!title.length){
      throw new Error("请填写标题")
    }
    if(!content.length){
      throw new Error("请填写内容")
    }
  }catch(e){
    req.flash("error",e.message);
    console.log("error",e.message);   
    return res.redirect('back')
  }
  let post = {
    author:author,
    title:title,
    content:content
  }
  PostModel.create(post).then(function(result){
    post = result.ops[0]
  }).catch(next)
})
//POST /
module.exports = router;