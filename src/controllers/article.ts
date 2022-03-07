// src/controllers/user.ts
import { getManager } from "typeorm";
import { Article } from "../entity/article";
import { NotFoundException, ForbiddenException } from "../exceptions";

export default class ArticleController {
  public static async listArticles(ctx: any) {
    // console.log("ctx", ctx);
    const articleRepository = getManager().getRepository(Article);
    const articles = await articleRepository.find();

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

  //   public static async updateUser(ctx: any) {
  //     const userId = +ctx.params.id;
  //     if (userId !== +ctx.state.user.id) {
  //       throw new ForbiddenException();
  //       return;
  //     }

  //     const articleRepository = getManager().getRepository(User);
  //     await articleRepository.update(+ctx.params.id, ctx.request.body);
  //     const updatedUser = await articleRepository.findOne(+ctx.params.id);

  //     if (updatedUser) {
  //       ctx.status = 200;
  //       ctx.body = updatedUser;
  //     } else {
  //       ctx.status = 404;
  //     }
  //   }

  public static async deleteArticle(ctx: any) {
    const articleId = +ctx.params.id;

    if (articleId !== +ctx.state.article.id) {
      throw new ForbiddenException();
      return;
    }

    const articleRepository = getManager().getRepository(Article);
    await articleRepository.delete(+ctx.params.id);

    ctx.status = 204;

    console.log("delete ctx", ctx);
  }
}
