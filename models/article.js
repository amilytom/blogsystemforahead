// 引入Sequelize模块
const Sequelize = require('sequelize');
// 引入cate表model
const CateModel = require('./cate');

// 引入数据库实例
const db = require('../db');

// 定义model
const Article = db.define('Article', {
  // 文章id
  id: {type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
  // 文章标题
  title: {type: Sequelize.STRING(30), allowNull: false},
  // 文章摘要
  desc: {type: Sequelize.STRING, allowNull: false},
  // 文章内容
  content: {type: Sequelize.TEXT, allowNull: false},
  // 所属分类
  cate: {type: Sequelize.INTEGER, allowNull: false}

}, {
  // 是否支持驼峰
  underscored: true,
  // MySQL数据库表名
  tableName: 'article',
});
// 导出model
module.exports = Article;

// 文章所属于分类，一个分类包含多个文章，将文章表和分类表进行关联
Article.belongsTo(CateModel, {foreignKey: 'cate', constraints: false});
