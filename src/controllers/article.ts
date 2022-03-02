// src/controllers/user.ts
import { getManager } from "typeorm";
import { Article } from "../entity/article";
import { NotFoundException, ForbiddenException } from "../exceptions";

export default class UserController {
  public static async listArticles(ctx: any) {
    const articleRepository = getManager().getRepository(Article);
    const users = await articleRepository.find();

    ctx.status = 200;
    ctx.body = users;
  }

//   public static async showUserDetail(ctx: any) {
//     const articleRepository = getManager().getRepository(User);
//     const user = await articleRepository.findOne(+ctx.params.id);

//     if (user) {
//       ctx.status = 200;
//       ctx.body = user;
//     } else {
//       throw new NotFoundException();
//     }
//   }

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

//   public static async deleteUser(ctx: any) {
//     const userId = +ctx.params.id;

//     if (userId !== +ctx.state.user.id) {
//       throw new ForbiddenException();
//       return;
//     }

//     const articleRepository = getManager().getRepository(User);
//     await articleRepository.delete(+ctx.params.id);

//     ctx.status = 204;
//   }
}
