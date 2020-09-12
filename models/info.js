// 引入Sequelize模块
const Sequelize = require('sequelize');

// 引入数据库实例
const db = require('../db');

// 定义model
const Info = db.define('Info', {
  // 主键
  id: {type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
  // 博客名称
  title: {type: Sequelize.STRING(20), allowNull: false},
  // 副标题
  subtitle: {type: Sequelize.STRING(30), allowNull: false},
  // 关于我们
  about: {type: Sequelize.TEXT, allowNull: false}

}, {
  // 是否支持驼峰
  underscored: true,
  // MySQL数据库表名
  tableName: 'info',
});
// 导出model
module.exports = Info;


