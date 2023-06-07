/*
 * DO NOT  start this server.  must be called from main server
 *
 * 不能单独启动web服务， 必须从主服务器调用
 */
import Koa = require("koa");
import WebServer from "../middleware/WebServer";
import ChatHandler from "../controller/Handler/ChatHandler";
import { ChatGTPApi } from "../middleware/ChatGPTApi";
import WebConstant from "../common/WebConstant";

const path = require("path");
const serve = require("koa-static");

export default class AdminServer extends WebServer {
    public startServer(port: number) {
        super.addMiddleWare(this.getStaticRtx());
        return super.start(port, "0.0.0.0");
    }

    public initRoute() {
        const chatApi = new ChatGTPApi("Personal", WebConstant.chatGPT_token);
        this.router.get("/chat", ctx => {
            const checkRet = ChatHandler.verifyUrl(ctx.query as any);
            ctx.body = checkRet;
        });
        this.router.post("/chat", async ctx => {
            const param: any =  ctx.query as any;
            param.echostr = ctx.request.body;
            const chatRet = ChatHandler.receiveMessage(param);
            if (chatRet) {
                try {
                    const aiRet = await chatApi.sendChatMessage(chatRet);
                    const aiChatBack = aiRet.choices[0].message;
                    ctx.body = ChatHandler.createMessage(aiChatBack?.content);
                    return;
                } catch (err: any) {
                    console.log("OPEN AI api err = ", err);
                }
            }
            ctx.body = "";
        });
    }

    private async responseTime(ctx: Koa.Context, next: any) {
        const start = Date.now();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await next();
        const ms = Date.now() - start;
        ctx.set("X-Response-Time", `${ms}ms`);
    }

    private getStaticRtx() {
        // console.log("current path=", __dirname);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const publicFiles = serve(path.join(__dirname, "../../static"));
        return publicFiles;
    }
}
