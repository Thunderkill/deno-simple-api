import { Application } from "./deps.ts";
import { ErrorMiddleware } from "./middlewares/ErrorMiddleware.ts";
import { router } from "./router.ts";

export const app = new Application();

app.use(ErrorMiddleware);
app.use(router.routes());
app.use(router.allowedMethods());
