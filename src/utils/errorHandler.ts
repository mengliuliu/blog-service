const path = require("path");
const fs = require("fs");
const escapeHtml = require("escape-html");

// const isDev = env === "development";
// const templatePath = isDev
//   ? path.join(__dirname, "templates/dev_error.html")
//   : path.join(__dirname, "templates/prod_error.html");
// const defaultTemplate = fs.readFileSync(templatePath, "utf8");

export default function errorHandler(err, ctx) {
  console.log("onerror", err);
  // 未知异常状态，默认使用 500
  ctx.status = err.status || 500;

  // 获取客户端请求接受类型

  // ctx.accepts 是 request.accepts 的别名，即客户端可接受的内容类型。
  // 和其他协商 API 一样， 如果没有提供类型(没有传参数)，则返回 所有 客户端可接受的类型。[ '*/*' ]
  // 如果提供了，就返回最佳匹配，即第一个匹配上的。
  // console.log(ctx.accepts())
  switch (ctx.accepts("json", "html", "text")) {
    case "json":
      // ctx.type 是 response.type 的别名， 用于设置响应头 Content-Type
      ctx.type = "application/json";
      ctx.body = { status: err.status, message: err.message };
      break;
    // case "html":
    //   ctx.type = "text/html";
    //   ctx.body = defaultTemplate
    //     .replace("{{status}}", escapeHtml(err.status))
    //     .replace("{{stack}}", escapeHtml(err.stack));
    //   break;
    case "text":
      ctx.type = "text/plain";
      ctx.body = err.message;
      break;
    default:
      ctx.throw(406, "json, html, or text only");
  }
}
