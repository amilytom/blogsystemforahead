// 引入公共方法
const Common = require ('./common');
// 引入async
const async = require ('async');
// 引入dateformat模块
const dateFormat = require ('dateformat');
// 引入cate表的model实例
const CateModel = require ('../models/cate');
// 引入article表的model实例
const ArticleModel = require ('../models/article');
// 引入info表的model实例
const InfoModel = require ('../models/info');
// 引入常量constant
const Constant = require ('../constant/constant');
// 配置导出对象
let exportObj = {
  index,
  cate,
  article,
  about,
};
// 导出对象，供其它模块调用
module.exports = exportObj;

// 首页方法
function index (req, res) {
  // 设定一个对象，用于保存方法返回的数据
  let returnObj = {};
  // SQL语句中需要的limit，即查询多少条
  let rows = 2;
  // 当前页码
  let page = req.query.page || 1;
  // 定义一个async任务
  let tasks = {
    // 查询文章方法
    queryArticle: cb => {
      // 根据前端提交参数计算SQL语句中需要的offset，即从多少条开始查询
      let offset = rows * (page - 1);
      // 通过offset和limit使用admin的model去数据库中查询，并按照创建时间排序
      ArticleModel
        .findAndCountAll ({
          offset: offset,
          limit: rows,
          order: [['created_at', 'DESC']],
          // 关联cate表进行联表查询
          include: [{
            model: CateModel
          }]
        })
        .then (function (result) {
          // 查询结果处理
          // 定义一个空数组list，用来存放最终结果
          let list = [];
          // 遍历SQL查询出来的结果，处理后装入list
          result.rows.forEach ((v, i) => {
            // 将结果的每一项，给数组list每一项赋值
            let obj = {
              id: v.id,
              title: v.title,
              desc: v.desc,
              cate: v.cate,
              cateName: v.Cate.name,
              createdAt: dateFormat (v.createdAt, 'yyyy-mm-dd HH:MM:ss')
            };
            list.push (obj);
          });
          // 推给公共方法的参数
          // 要渲染的模板
          returnObj.template = 'index';
          // 请求的路径
          returnObj.path = 'index';
          // 页面渲染数据
          returnObj.data = {
            // 列表数据
            list: list,
            // 当前页码
            page: Number (page),
            // 总页数
            pageCount: Math.ceil (result.count / rows)
          };

          // 继续后续操作
          cb (null);
        })
        .catch (function (err) {
          // 错误处理
          // 打印错误日志
          console.log (err);
          // 传递错误信息到async最终方法
          cb (Constant.DEFAULT_ERROR);
        });
    }
  };
  // 执行公共方法中的autoFn方法
  Common.autoFn (tasks, res, returnObj);

}

// 分类页面方法
function cate (req, res) {
  // 设定一个对象，用于保存方法返回的数据
  let returnObj = {};
  // SQL语句中需要的limit，即查询多少条
  let rows = 2;
  // 当前页码
  let page = req.query.page || 1;
  // 当前分类id
  let curCate = req.params.cateId;

  // 定义一个async任务
  let tasks = {
    // 查询文章方法
    queryArticle: cb => {
      // 根据前端提交参数计算SQL语句中需要的offset，即从多少条开始查询
      let offset = rows * (page - 1);
      // 通过offset和limit使用admin的model去数据库中查询，并按照创建时间排序
      ArticleModel
        .findAndCountAll ({
          // 按分类查询
          where: {
            cate: curCate
          },
          offset: offset,
          limit: rows,
          order: [['created_at', 'DESC']],
          // 关联cate表进行联表查询
          include: [{
            model: CateModel
          }]
        })
        .then (function (result) {
          // 查询结果处理
          // 定义一个空数组list，用来存放最终结果
          let list = [];
          // 设定变量，保存当前分类名称
          let curCateName = '';
          // 遍历SQL查询出来的结果，处理后装入list
          result.rows.forEach ((v, i) => {
            // 查询出当前分类对应的分类名称
            if(v.cate == curCate){
              curCateName = v.Cate.name
            }
            // 将结果的每一项，给数组list每一项赋值
            let obj = {
              id: v.id,
              title: v.title,
              desc: v.desc,
              cate: v.cate,
              cateName: v.Cate.name,
              createdAt: dateFormat (v.createdAt, 'yyyy-mm-dd HH:MM:ss')
            };
            list.push (obj);
          });
          // 推给公共方法的参数
          // 要渲染的模板
          returnObj.template = 'cate';
          // 请求的路径
          returnObj.path = 'cate';
          // 当前分类
          returnObj.curCate = curCate;
          // 当前分类名称
          returnObj.title = curCateName;
          // 页面渲染数据
          returnObj.data = {
            // 列表数据
            list: list,
            // 当前页码
            page: Number (page),
            // 总页数
            pageCount: Math.ceil (result.count / rows)
          };

          // 继续后续操作
          cb (null);
        })
        .catch (function (err) {
          // 错误处理
          // 打印错误日志
          console.log (err);
          // 传递错误信息到async最终方法
          cb (Constant.DEFAULT_ERROR);
        });

    }
  };
  // 执行公共方法中的autoFn方法
  Common.autoFn (tasks, res, returnObj)

}


// 文章页方法
function article (req, res) {
  // 设定一个对象，用于保存方法返回的数据
  let returnObj = {};
  // 定义一个async任务
  let tasks = {
    // 通过文章id，从数据库中查询
    queryArticle: cb => {
      ArticleModel
        .findByPk (
          req.params.articleId,
          {
          include: [{
            // 关联cate表进行查询
            model: CateModel
          }]
        })
        .then (function (result) {
          // 查询结果处理
          // 将结果中的属性值，给保存对象赋值
          let obj = {
            id: result.id,
            title: result.title,
            content: result.content,
            cate: result.cate,
            cateName: result.Cate.name,
            createdAt: dateFormat (result.createdAt, 'yyyy-mm-dd HH:MM:ss')
          };
          // 推给公共方法的参数
          // 要渲染的模板
          returnObj.template = 'article';
          // 当前文章所属分类
          returnObj.curCate = obj.cate;
          // 当前文章所属分类名称
          returnObj.title = obj.cateName;
          // 请求的路径
          returnObj.path = 'article';
          // 页面标题title
          returnObj.title = obj.title;
          // 查询结果赋值
          returnObj.data = obj;
          // 继续后续操作
          cb (null);
        })
        .catch (function (err) {
          // 错误处理
          // 打印错误日志
          console.log (err);
          // 传递错误信息到async最终方法
          cb (Constant.DEFAULT_ERROR);
        });
    }
  };
  // 执行公共方法中的autoFn方法
  Common.autoFn (tasks, res, returnObj)
}


// 关于我们方法
function about (req, res) {
  // 设定一个对象，用于保存方法返回的数据
  let returnObj = {};
  // 定义一个async任务
  let tasks = {
    // 查询方法
    query: cb => {
      // 去数据库中查询固定的id为1的数据
      InfoModel
        .findByPk(1)
        .then (function (result) {
          // 查询结果处理
          // 将结果中的属性值，给保存对象赋值
          let obj = {
            id: result.id,
            title: result.title,
            subtitle: result.subtitle,
            about: result.about,
            createdAt: dateFormat (result.createdAt, 'yyyy-mm-dd HH:MM:ss')
          };
          // 推给公共方法的参数
          // 要渲染的模板
          returnObj.template = 'about';
          // 请求的路径
          returnObj.path = 'about';
          // 查询结果赋值
          returnObj.data = obj;
          // 继续后续操作
          cb (null);
        })
        .catch (function (err) {
          // 错误处理
          // 打印错误日志
          console.log (err);
          // 传递错误信息到async最终方法
          cb (Constant.DEFAULT_ERROR);
        });
    }
  };
  // 执行公共方法中的autoFn方法
  Common.autoFn (tasks, res, returnObj)
}