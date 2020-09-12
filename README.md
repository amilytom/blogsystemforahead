# blogsystemforahead
博客系统前台程序（node+express+mysql）后端渲染技术

>   使用art-template模板引擎进行后端渲染，将数据传导到模板上生成视图。
>
>   技术栈：

```
async                   异步处理方法库
mysql2                  MySQL数据库支持
sequelize               MySQL映射
dateformat              时间处理方法库
jsonwebtoken            Token生成及验证
art-template  			art-template模板引擎
express-art-template    art-template模板引擎
nodemon                 node运行自动化监控工具
```



## 1. 下载程序

-   SSH方式下载

```bash
git clone git@github.com:amilytom/blogsystemforahead.git  
```

-   HTTPS方式下载

```bash
git clone https://github.com/amilytom/blogsystemforahead.git
```



## 2. 安装依赖

下载完成之后，进入项目目录

安装依赖：npm install

```bash
npm install
```



## 3. 运行程序

通过nodemon对程序进行自动化监控，无需每次修改，重新运行。

```bash
npm start
```



