// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require("koa");
const jwt = require("koa-jwt");
const bodyParser = require("koa-bodyparser");
const { createConnection } = require("typeorm");
import { protectedRouter, unprotectedRouter } from "./routes";
import { JWT_SECRET } from "./constants";
import { Article } from "./entity/article";
import "reflect-metadata";

// 创建一个Koa对象表示web app本身:
createConnection()
  .then(async (connection) => {
    // let article = new Article();
    // article.title = "什么是Promise";
    // article.content = "Promise是一个构造函数，也可以说它是一个容器";
    // article.createTime = new Date();
    // article.view_count = 0;
    // article.like_count = 1;
    // article.comment_count = 2;
    // let articleRepository = connection.getRepository(Article);
    // await articleRepository.save(article);
    // console.log("Article has been saved")

    const app = new Koa();

    // 解决跨域
    app.use(async (ctx, next) => {
      // 开发环境设置，生产环境谨慎使用
      ctx.set("Access-Control-Allow-Origin", "*");
      ctx.set("Access-Control-Allow-Headers", "X-Requested-With");
      ctx.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");

      if (ctx.method == "OPTIONS") {
        ctx.body = "";
        ctx.status = 200;
      } else {
        await next();
      }
    });

    app.use(bodyParser());

    // 无需 JWT Token 即可访问
    app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());

    // 注册 JWT 中间件
    app.use(jwt({ secret: JWT_SECRET }).unless({ method: "GET" }));

    // 需要 JWT Token 才可访问
    app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

    // 在端口3000监听:
    app.listen(3000);
    console.log("app started at port 3000...");
  })
  .catch((err: string) => console.log("TypeORM connection error:", err));
