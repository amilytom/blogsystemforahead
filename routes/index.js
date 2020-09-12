// 引入Express对象
var express = require ('express');
// 引入路由对象
var router = express.Router ();
// 引入我们自定义的controller
const IndexController = require('../controllers/index');
// 定义首页路由
router.get ('/', IndexController.index);
// 定义分类页路由
router.get ('/cate/:cateId', IndexController.cate);
// 定义文章页路由
router.get ('/article/:articleId', IndexController.article);
// 定义关于我们路由
router.get ('/about', IndexController.about);
// 导出路由，供app.js文件调用
module.exports = router;
