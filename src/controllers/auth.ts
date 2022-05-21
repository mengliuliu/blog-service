// src/controllers/auth.ts
const jwt = require('jsonwebtoken');
const { setCache } = require('../utils/nodeCache');
import { getManager } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from '../entity/user';
import { UnauthorizedException } from '../exceptions';
import { JWT_SECRET } from '../constants';

export default class AuthController {
  public static async login(ctx: any) {
    const userRepository = getManager().getRepository(User);
    const user = await userRepository
      .createQueryBuilder()
      .where({ email: ctx.request.body.email })
      .addSelect('User.password')
      .getOne();

    if (!user) {
      throw new UnauthorizedException('用户名不存在');
    } else if (await argon2.verify(user.password, ctx.request.body.password)) {
      // 登录成功
      // 存储最近接口请求的时间
      // const lastReqTime = new Date().getTime();
      // console.log('登录lastReqTime', lastReqTime);
      // setCache('lastReqTime', lastReqTime);
      ctx.status = 200;
      ctx.body = {
        token: jwt.sign(
          { id: user.id, createTime: new Date().toLocaleString() },
          JWT_SECRET
        ),
      };
    } else {
      const err = new UnauthorizedException('密码错误');
      // ctx.body = err;
      throw err;
    }
  }

  public static async register(ctx: any) {
    const userRepository = getManager().getRepository(User);

    const newUser = new User();
    newUser.email = ctx.request.body.email;
    newUser.password = await argon2.hash(ctx.request.body.password);

    // 保存到数据库
    const user = await userRepository.save(newUser);

    ctx.status = 201;
    ctx.body = user;
  }
}
