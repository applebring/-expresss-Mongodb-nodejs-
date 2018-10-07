const express = require('express');
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin
const PostModel = require("../models/posts")
router.get('/',function(req,res,next){
  const author = req.query.author
  // console.log("author",author);
  PostModel.getPosts(author)
  .then(function(posts){
    res.render('myblog',{
      posts:posts
    })
  }).catch(next)
})
router.get('/:postId',function(req,res,next){
  console.log("req",req);
  const postId = req.params.postId
  Promise.all([
    PostModel.getPostById(postId),//获取文章信息
    PostModel.incPv(postId)//pv加1
  ])
  .then(function(result){
    const post = result[0]
    if(!post){
      throw new Error('该文章不存在')
    }
    res.render('detail',{
      post:post
    })
  }).catch(next)
})
router.get('/:postId/edit',checkLogin,function(req,res,next){
  const postId = req.params.postId
  const author = req.session.user._id
  // console.log("postid,author",postId,author);
  PostModel.getRawPostById(postId).then(function(post){
    if(!post){
      throw new Error('该文章不存在')
    }
    if(author.toString()!==post.author._id.toString()){
      throw new Error("权限不足")
    }
    res.render('edit',{
      post:post
    })
  }).catch(next)
})
//POST /
router.post('/:postId/edit',checkLogin,function(req,res,next){
  const postId = req.params.postId
  const author = req.session.user._id
  const title = req.fields.title
  const content = req.fields.content
   // 校验参数
   try {
    if (!title.length) {
      throw new Error('请填写标题')
    }
    if (!content.length) {
      throw new Error('请填写内容')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  PostModel.getRawPostById(postId)
    .then(function (post) {
      if (!post) {
        throw new Error('文章不存在')
      }
      if (post.author._id.toString() !== author.toString()) {
        throw new Error('没有权限')
      }
      PostModel.updatePostById(postId, { title: title, content: content })
        .then(function () {
          req.flash('success', '编辑文章成功')
          // 编辑成功后跳转到上一页
          res.redirect(`/myblog/${postId}`)
        })
        .catch(next)
    })
})
//Get/create/:postId/remove删除一篇文章
router.get('/:postId/remove',checkLogin,function(req,res,next){
  const postId = req.params.postId
  const author = req.session.user._id
  PostModel.getRawPostById(postId).then(function(post){
    if(!post){
      throw new Error('文章不存在')
    }
    if(post.author._id.toString()!==author.toString()){
      throw new Error('没有权限')
    }
    PostModel.delPostById(postId).then(function(){
      res.redirect('/myblog')
    })
  })
})
module.exports = router;