// src/controllers/user.ts
import { getManager } from 'typeorm';
import { Article } from '../entity/article';
import { NotFoundException, ForbiddenException } from '../exceptions';

export default class ArticleController {
  public static async listArticles(ctx: any) {
    const articleRepository = getManager().getRepository(Article);
    // 判断是否有 all 参数（方便在后台管理系统中查看全部）
    const reqBody = ctx.request.body;
    const isAll: boolean = reqBody.all;
    const pageNum: number = reqBody.pageNum;
    const pageSize: number = reqBody.pageSize;
    let searchConditon: any = {};
    if (!isAll) {
      searchConditon.is_delete = false;
    }

    const articles: any[] = await articleRepository.find(searchConditon);
    const length = articles.length;

    var resArticles: any[] = [];
    if (pageNum) {
      let start: number = (pageNum - 1) * pageSize;
      let end: number = pageNum * pageSize;
      articles.forEach((item, index) => {
        if (index >= start && index < end) {
          resArticles.push(item);
        }
      });
    } else {
      resArticles = [...articles];
    }

    // const length = await (
    //   await articleRepository.find({ is_delete: false })
    // ).length;

    // if (pageNum) {
    //   searchConditon.skip = (pageNum - 1) * pageSize;
    //   searchConditon.take = pageSize;
    // }
    // console.log('searchConditon', searchConditon);
    // const articles = await (
    //   await articleRepository.find(searchConditon)
    // ).filter((article) => {
    //   return article.is_delete === false;
    // });
    // .createQueryBuilder('articles')
    // .where(searchConditon)
    // .skip((pageNum - 1) * pageSize)
    // .take(pageSize)
    // .getMany();

    ctx.status = 200;
    ctx.body = {
      list: resArticles,
      total: length,
    };
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

    console.log('delete ctx', ctx);
  }
}
