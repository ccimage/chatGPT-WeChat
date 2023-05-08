/*
    Base Class Of WebPage
*/
import Log from "../common/RunLog";
import Func from "../middleware/CommonFunc";
import SessionManager from "./SessionManager";

export default class WebPageBase {
    public constructor() {
        // 
    }
    protected _showErrorLog(msg: string) {
        Log.assert(msg);
    }

    protected _showDebugLog(msg: string) {
        Log.output(msg);
    }

    protected _clientIP(req: any): string {
        return Func.getClientIp(req);
    }

    protected _getErrorJson(code: number, msg: string): {[key: string]: string} {
        return {result: "FAILED", code: code + "", msg};
    }

    protected getUserSession(req: any) {
        let token: string = req.headers["x-token"] as string;
        if (!token || token.length <= 0) {
            token = req.sessionID || "";
        }
        const user = SessionManager.Instance().getSessionUser(token);
        return user;
    }
    protected getMaxIdBase(ids: any[]) {
        let maxId  = 0;
        for (let i = 0; i < ids.length - 1; i++) {
            if (ids[i + 1].id - ids[i].id > 1) {
                maxId = Number(ids[i].id) + 1;
            }
        }
        if (maxId === 0 && ids.length > 0) {
            maxId = Number(ids[ids.length - 1].id) + 1;
        }
        return maxId;
    }
    protected sortFields(fields: any[]) {
        fields.sort((a: any, b: any) => {
            return a.sortNum - b.sortNum;
        });
    }
}
