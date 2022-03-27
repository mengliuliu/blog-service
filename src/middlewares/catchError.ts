import { BaseException } from "../exceptions";

const catchError = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof BaseException) {
      // 如果是自己主动抛出的 BaseException 类错误
      ctx.status = err.status || 500;
      ctx.body = {
        status: err.status,
        message: err.message,
      };
    } else {
      // 触发 koa app.on('error') 错误监听事件，可以打印出详细的错误堆栈 log
      ctx.app.emit("error", err, ctx);
    }
  }
};

export default catchError;
