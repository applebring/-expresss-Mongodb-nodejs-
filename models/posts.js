const marked = require('marked')
const Post = require('../lib/mongo').Post

// 将 post 的 content 从 markdown 转换成 html
Post.plugin('contentToHtml', {
  afterFind: function (posts) {
    return posts.map(function (post) {
      post.content = marked(post.content)
      return post
    })
  },
  afterFindOne: function (post) {
    if (post) {
      post.content = marked(post.content)
    }
    return post
  }
})

module.exports = {
  create:function create(post){
    return Post.create(post).exec()
  },
  //通过文章id获取文章详情
  getPostById:function getPostById(postId){
    return Post
    .findOne({_id:postId})
    .populate({path:'author',model:'User'})
    .addCreatedAt()
    .contentToHtml()
    .exec()
  },
  //按创建时间降序获取所有 文章或者某个特定用户文章
  getPosts: function getPosts (author) {
    const query = {}
    if (author) {
      query.author = author
    }
    return Post
      .find(query)
      .populate({ path: 'author', model: 'User' })//通过author字段关联user表
      .sort({ _id: -1 })
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },
  incPv:function incPv (postId){
    return Post
    .updateOne({_id:postId},{$inc:{pv:1}})
    .exec()
  },
  //通过ID获取一篇原生文章（编辑文章)
  getRawPostById:function getRawPostById (postId){
    return Post
    .findOne({_id:postId})
    .populate({path:'author',model:'User'})
    .exec()
  },
  //通过id更新一篇文章
  updatePostById:function updatePostById (postId,data){
    return Post.update({_id:postId},{$set:data}).exec()
  },
  //通过id删除一篇文章
  delPostById:function delPostById(postId){
    return Post.deleteOne({_id:postId}).exec()
  }
}