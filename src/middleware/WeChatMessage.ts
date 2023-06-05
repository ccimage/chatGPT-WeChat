
import RunLog from "../common/RunLog";
import { fetchResponse } from "./HttpRequest";
interface AppModel {
    Secret: string;
    agentid: string;
    CropID: string;
    departNo: string;
}

export class WeChatMessage {
    private appInfo: AppModel;
    private display: string;
    private async getToken() {
        const CropID = this.appInfo.CropID;
        const Secret = this.appInfo.Secret;
        const url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${CropID}&corpsecret=${Secret}`;
        const [err, rsp] = await fetchResponse(url, undefined, "GET");
        if (rsp && rsp.errcode === 0) return rsp.access_token;
        return err?.message;
    }
    constructor(appId: string, secretKey: string, companyId: string, departNo: string, display: string) {
        this.appInfo = {agentid: appId, Secret: secretKey, CropID: companyId, departNo};
        this.display = display;
    }
    public async sendNotify(title: string, ...arg: string[]) {
        if (process.env.DEBUG === "true") return RunLog.output("debug is true, notify canceled");
        const access_token = await this.getToken();
        if (!access_token) {
            return RunLog.output("query access token failed", access_token);
        }
        const url = `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${access_token}`;
        const sendData: any = {
            toparty: this.appInfo.departNo,
            msgtype: "text",
            agentid: this.appInfo.agentid,
            safe: "0",
            text: {
                content: `${title}`
            }
        };
        arg?.forEach(item => {
            sendData.text.content += `\n${item}`;
        });
        const resp = await fetchResponse(url, sendData);
        RunLog.output("send out from ", this.display, "response = ", `${resp}`);
    }
}
