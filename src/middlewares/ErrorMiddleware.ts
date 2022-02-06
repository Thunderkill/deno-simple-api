import { Middleware } from "../deps.ts";

export const ErrorMiddleware: Middleware = async ({ response }, next) => {
  try {
    await next();
  } catch (ex) {
    if ("statusCode" in ex) {
      response.status = ex.statusCode;
    } else {
      response.status = 400;
    }
    response.body = ex.message;
    console.error(ex);
  }
};
