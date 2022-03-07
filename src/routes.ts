// src/routes.ts
const Router = require("koa-router");

import AuthController from "./controllers/auth";
import UserController from "./controllers/user";
import ArticleController from "./controllers/article";

const unprotectedRouter = new Router();
// auth 相关的路由
unprotectedRouter.post("/auth/login", AuthController.login);
unprotectedRouter.post("/auth/register", AuthController.register);

const protectedRouter = new Router();
// users 相关的路由
protectedRouter.get("/users", UserController.listUsers);
protectedRouter.get("/users/:id", UserController.showUserDetail);
protectedRouter.put("/users/:id", UserController.updateUser);
protectedRouter.delete("/users/:id", UserController.deleteUser);

// articles 相关的路由
protectedRouter.get("/articles", ArticleController.listArticles);
protectedRouter.get("/articles/:id", ArticleController.showArticleDetail);
// protectedRouter.put("/users/:id", UserController.updateUser);
protectedRouter.delete("/articles/:id", ArticleController.deleteArticle);

export { protectedRouter, unprotectedRouter };
