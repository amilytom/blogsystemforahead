// 引入async
const async = require ('async');
// 引入数据库实例
const db = require ('../db');
// 引入常量constant
const Constant = require ('../constant/constant');
// 引入dateformat模块
const dateFormat = require ('dateformat');
// 引入cate表的model实例
const CateModel = require ('../models/cate');
// 引入info表的model实例
const InfoModel = require ('../models/info');
// 引入article表的model实例
const ArticleModel = require ('../models/article');
// 配置导出对象
const exportObj = {
  autoFn,
  getNavigation,
  getRandomArticle,
  getBlogInfo
};
// 导出对象，供其它模块调用
module.exports = exportObj;


/**
 * 返回公共方法
 * @param tasks  当前controller执行tasks
 * @param res    当前controller responese
 * @param returnObj 当前controller返回json对象
 */
function autoFn (tasks, res, returnObj) {
  async.auto (tasks, function (err) {
    if (err) {
      // 如果错误存在，则打印错误
      console.log (err);
      res.render ('error', {
        msg: '出现错误啦!'
      })
    } else {
      // 定义一个async子任务
      let _tasks = {
        // 获取导航
        getNavigation: cb => {
          getNavigation (cb)
        },
        // 获取随机文章
        getRandomArticle: cb => {
          getRandomArticle (cb)
        },
        // 获取博客基本信息
        getBlogInfo: cb => {
          getBlogInfo (cb)
        }
      };
      async.auto (_tasks, function (err, result) {
        if (err) {
          console.log (err);
          res.render ('error', {
            msg: '出现错误啦!'
          })
        } else {
          // 如果没有错误，则渲染数据到页面模板上
          res.render (returnObj.template, {
            // 导航分类列表
            cateList: result['getNavigation'],
            // 侧边栏随机文章列表
            randomArticleList: result['getRandomArticle'],
            // 博客基本信息
            blogInfo: result['getBlogInfo'],
            // 当前分类
            curCate: returnObj.curCate,
            // 当前访问路径
            path: returnObj.path,
            // 页面标题
            title: returnObj.title,
            // 页面数据
            data: returnObj.data
          });
        }
      })

    }
  })
}

/**
 * 获取导航栏分类方法
 * @param cb 回调函数
 */
function getNavigation (cb) {
  // 查询cate表中所有分类
  CateModel
    .findAll ()
    .then (function (result) {
      // 查询结果处理
      // 定义一个空数组list，用来存放最终结果
      let list = [];
      // 遍历SQL查询出来的结果，处理后装入list
      result.forEach ((v, i) => {
        let obj = {
          id: v.id,
          name: v.name,
          path: v.path
        };
        list.push (obj);
      });

      // 继续后续操作
      cb (null, list);
    })
    .catch (function (err) {
      // 错误处理
      // 打印错误日志
      console.log (err);
      // 传递错误信息到async最终方法
      cb (Constant.DEFAULT_ERROR);
    });
}

/**
 * 获取侧边栏随机文章方法
 * @param cb 回调函数
 */
function getRandomArticle (cb) {
  // 查询article表中5条随机文章
  ArticleModel
    .findAll ({
      limit: 5,
      order: db.random ()
    })
    .then (function (result) {
      // 查询结果处理
      // 定义一个空数组list，用来存放最终结果
      let list = [];
      // 遍历SQL查询出来的结果，处理后装入list
      result.forEach ((v, i) => {
        let obj = {
          id: v.id,
          title: v.title,
        };
        list.push (obj);
      });

      // 继续后续操作
      cb (null, list);
    })
    .catch (function (err) {
      // 错误处理
      // 打印错误日志
      console.log (err);
      // 传递错误信息到async最终方法
      cb (Constant.DEFAULT_ERROR);
    });


}

/**
 * 获取博客基本信息方法
 * @param cb 回调函数
 */
function getBlogInfo (cb) {
  // 查询info表中主键为1的数据
  InfoModel
    .findByPk(1)
    .then (function (result) {
      // 查询结果处理
      // 将查询结果分别赋值给一个对象，输出给下一个async方法
      let obj = {
          id: result.id,
          title: result.title,
          subtitle: result.subtitle,
          about: result.about,
          createdAt: dateFormat (result.createdAt, 'yyyy-mm-dd HH:MM:ss')
      };

      // 继续后续操作
      cb (null, obj);
    })
    .catch (function (err) {
      // 错误处理
      // 打印错误日志
      console.log (err);
      // 传递错误信息到async最终方法
      cb (Constant.DEFAULT_ERROR);
    });
}
