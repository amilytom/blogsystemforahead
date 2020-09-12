// 引入Sequelize模块
var Sequelize = require('sequelize');
// 引入数据库连接配置
var CONFIG = require('./config');

// 实例化数据库对象
var sequelize = new Sequelize(CONFIG.MYSQL.database, CONFIG.MYSQL.username, CONFIG.MYSQL.password, {
  host: CONFIG.MYSQL.host,
  // 数据库类型
  dialect: 'mysql',

  // 是否打印日志
  logging: CONFIG.DEBUG ? console.log : false,

  // 配置数据库连接池
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  // 时区设置
  timezone: '+08:00'
});
// 导出实例化数据库对象
module.exports = sequelize;
