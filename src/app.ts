// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');
const koaJwt = require('koa-jwt');
const jwt = require('jsonwebtoken');
const bodyParser = require('koa-bodyparser');
const { createConnection } = require('typeorm');
const { setCache, getCache } = require('./utils/nodeCache');
import { protectedRouter, unprotectedRouter } from './routes';
import catchError from './middlewares/catchError';
import errorHandler from './utils/errorHandler';
import { JWT_SECRET } from './constants';
import 'reflect-metadata';

// 创建一个Koa对象表示web app本身:
createConnection()
  .then(async (connection) => {
    const app = new Koa();

    app.use(bodyParser());

    // 捕获错误
    app.use(catchError);

    // 解决跨域
    app.use(async (ctx, next) => {
      // 开发环境设置，生产环境谨慎使用
      ctx.set('Access-Control-Allow-Origin', '*');
      ctx.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
      ctx.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');

      if (ctx.method == 'OPTIONS') {
        ctx.body = '';
        ctx.status = 200;
      } else {
        await next();
      }
    });

    // 无需 JWT Token 即可访问
    app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());

    // 注册 JWT 中间件
    app.use(koaJwt({ secret: JWT_SECRET }).unless({ method: 'GET' }));

    // app.use(async (ctx, next) => {
    //   if (ctx.header && ctx.request.header.authorization) {
    //     console.log('authorization')
    //     const parts = ctx.request.header.authorization.split(' ');

    //     if (parts.length === 2) {
    //       //取出token
    //       const scheme = parts[0];
    //       const token = parts[1];
    //       if (/^Bearer$/i.test(scheme)) {
    //         try {
    //           //jwt.verify方法验证token是否有效
    //           jwt.verify(token, JWT_SECRET, {
    //             complete: true,
    //           });

    //           console.log('验证通过');
    //           const tokenDate = jwt.decode(token);
    //           // console.log('tokenDate', tokenDate);

    //           await next();

    //           const lastReqTime = getCache('lastReqTime');
    //           console.log('lastReqTime', lastReqTime);
    //           const nowReqTime = new Date().getTime();
    //           const intervalTime = (nowReqTime - lastReqTime) / 1000 / 60;
    //           // console.log('intervalTime', intervalTime);
    //           // 如果两次请求时间超过 3 分钟则token'失效'
    //           if (intervalTime > 1) {
    //             ctx.status = 200;
    //             ctx.body = {};
    //             console.log('ctx.body', ctx.body);
    //           } else {
    //             setCache('lastReqTime', nowReqTime);
    //           }
    //         } catch (error) {
    //           console.log('error', error);
    //           //token过期 生成新的token
    //           // const newToken = getToken(user);
    //           //将新token放入Authorization中返回给前端
    //           // ctx.res.setHeader('Authorization', newToken);
    //         }
    //       }
    //     }
    //   }

    //   // return await next().catch((err) => {
    //   //   if (err.status === 401) {
    //   //     ctx.status = 401;
    //   //     ctx.body =
    //   //       'Protected resource, use Authorization header to get access\n';
    //   //   } else {
    //   //     throw err;
    //   //   }
    //   // });
    // });

    // 需要 JWT Token 才可访问
    app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

    // 错误监听器
    app.on('error', errorHandler);

    // 在端口3000监听:
    app.listen(3000);
    console.log('app started at port 3000...');
  })
  .catch((err: string) => console.log('TypeORM connection error:', err));
