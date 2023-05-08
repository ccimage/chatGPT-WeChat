/*
 * DO NOT  start this server.  must be called from main server
 *
 * 不能单独启动web服务， 必须从主服务器调用
 */
import Koa = require("koa");
import WebServer from "../middleware/WebServer";

const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const router = require("koa-router")();
const serve = require("koa-static");

export default class AdminServer extends WebServer {
    public startServer(port: number) {
        super.addMiddleWare(this.getStaticRtx());
        return super.start(port, "0.0.0.0");
    }

    private async responseTime(ctx: Koa.Context, next: any) {
        const start = Date.now();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await next();
        const ms = Date.now() - start;
        ctx.set("X-Response-Time", `${ms}ms`);
    }

    private getStaticRtx() {
        console.log("current path=", __dirname);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const publicFiles = serve(path.join(__dirname, "../../static"));
        return publicFiles;
    }
}
