import Koa = require("koa");
import views = require("koa-views");
import RunLog from "../common/RunLog";
import { koaBody } from "koa-body";

import Router = require("koa-router");

interface KoaOptions {
    env?: string | undefined;
    keys?: string[] | undefined;
    proxy?: boolean | undefined;
    subdomainOffset?: number | undefined;
    proxyIpHeader?: string | undefined;
    maxIpsCount?: number | undefined;
}

export default class WebServer {
    private label = "";
    private app: Koa | undefined;
    protected router = new Router();
    public constructor(label: string, options?: KoaOptions) {
        this.label = label;
        this.init(options);
        this.initRoute();
    }

    private init(options?: KoaOptions) {
        this.app = new Koa(options);
        this.app.use(
            views("client", {
                extension: "html"
            })
        );

        // 注册body解析
        this.app.use(koaBody());
        // 注册路由
        this.app.use(this.router.routes());
        // 自动丰富 response 相应头，当未设置响应状态(status)的时候自动设置，在所有路由中间件最后设置(全局，推荐)，也可以设置具体某一个路由（局部），例如：router.get('/index', router.allowedMethods()); 这相当于当访问 /index 时才设置
        this.app.use(this.router.allowedMethods());
    }

    protected initRoute() {
        // Do nothing
    }

    protected addMiddleWare(ctx: any) {
        (this.app as Koa).use(ctx);
    }

    protected start(port: number, address = "0.0.0.0", onStart?: () => void) {
        return (this.app as Koa).listen(port, address);
    }

    public stop() {
        RunLog.output(`(${this.label}) stop running.`);
    }
}
