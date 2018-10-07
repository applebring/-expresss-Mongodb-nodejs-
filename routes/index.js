module.exports = function(app){
  app.get('/',function(req,res){
    res.redirect('/signin')
  })
  app.use('/posts',require('./posts'))
  app.use('/signin',require('./signin'))
  app.use('/signup',require('./signup'))
  app.use('/posts',require('./posts'))
  app.use('/signout',require('./signout'))
  app.use('/myblog',require('./myblog'))
  app.use('/logout',require('./logout'))
  app.use('/create',require('./create'))
}