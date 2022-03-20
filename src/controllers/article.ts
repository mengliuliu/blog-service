// src/controllers/user.ts
import { getManager } from "typeorm";
import { Article } from "../entity/article";
import { NotFoundException, ForbiddenException } from "../exceptions";

export default class ArticleController {
  public static async listArticles(ctx: any) {
    const articleRepository = getManager().getRepository(Article);
    // 判断是否有 all 参数（方便在后台管理系统中查看全部）
    const isAll = ctx.request.body.all;
    let searchConditon = {};
    if (!isAll) {
      searchConditon = { is_delete: false };
    }
    const articles = await articleRepository.find(searchConditon);
    ctx.status = 200;
    ctx.body = articles;

    // console.log("ctx", ctx);
  }

  public static async showArticleDetail(ctx: any) {
    const articleRepository = getManager().getRepository(Article);
    const article = await articleRepository.findOne(+ctx.params.id);

    if (article) {
      ctx.status = 200;
      ctx.body = article;
    } else {
      throw new NotFoundException();
    }
  }

  public static async createArticle(ctx: any) {
    const articleRepository = getManager().getRepository(Article);

    const newArticle = new Article();
    newArticle.title = ctx.request.body.title;
    newArticle.content = ctx.request.body.content;
    newArticle.createTime = ctx.request.body.createTime;

    // 保存到数据库
    const article = await articleRepository.save(newArticle);

    ctx.status = 200;
    ctx.body = article;
  }

  public static async updateArticle(ctx: any) {
    // const userId = +ctx.params.id;
    // if (userId !== +ctx.state.user.id) {
    //   throw new ForbiddenException();
    //   return;
    // }
    const body = ctx.request.body;

    const articleRepository = getManager().getRepository(Article);
    await articleRepository.update(+body.id, body);
    const updatedUser = await articleRepository.findOne(+body.id);

    if (updatedUser) {
      ctx.status = 200;
      ctx.body = updatedUser;
    } else {
      ctx.status = 404;
    }
  }

  public static async deleteArticle(ctx: any) {
    const articleRepository = getManager().getRepository(Article);
    const articleId = +ctx.request.body.id;

    const article = await articleRepository.findOne(articleId);
    const changeArticle = {
      ...article,
      is_delete: true,
    };
    // console.log("articleId", articleId);
    // console.log("changeArticle", changeArticle);
    await articleRepository.update(articleId, changeArticle);
    // article.is_delete = true;
    // if (articleId !== +ctx.state.article.id) {
    //   throw new ForbiddenException();
    // }
    // await articleRepository.delete(+ctx.params.id);

    ctx.status = 200;

    console.log("delete ctx", ctx);
  }
}
