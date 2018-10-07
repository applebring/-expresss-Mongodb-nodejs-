/*中间件
 express-session 中间件：
app.use(session(options))

session 中间件会在 req 上添加 session 对象，即 req.session 初始值为 {}，当我们登录后设置 req.session.user = 用户信息，返回浏览器的头信息中会带上 set-cookie 将 session id 写到浏览器 cookie 中，那么该用户下次请求时，通过带上来的 cookie 中的 session id 我们就可以查找到该用户，并将用户信息保存到 req.session.user
 */
//登陆后才能发帖或写文章，即使登录了你也不能修改或删除其他人的文章，这就是权限控制。我们也来给博客添加权限控制，如何实现页面的权限控制呢？我们可以把用户状态的检查封装成一个中间件，在每个需要权限控制的路由加载该中间件，即可实现页面的权限控制。
module.exports = {
  checkLogin:function checkLogin(req,res,next){
      if(!req.session.user){
          req.flash("error",'未登录');
          return res.redirect('/signin')
      }
      next()
  },
  checkNotLogin:function checkNotLogin(req,res,next){
      if(req.session.user){
          req.flash("error",'已登录')
          return res.redirect('/posts')//返回之前的页面    
      }
      next()
  }
}