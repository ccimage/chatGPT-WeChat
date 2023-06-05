import Log = require("../common/RunLog");
import { createHash } from "node:crypto";

export default class CommonFunc {
    public static checkClientIP(req: any): boolean {
        try {
            const ip =  CommonFunc.getClientIp(req);
            if (!ip) {
                return false;
            }
            const ipArray = ip.split(":");

            for (let i = 0; i < ipArray.length; i++) {
                if (ipArray[i].length <= 1) {
                    continue;
                }
                if ( ipArray[i] === "127.0.0.1" ||
                    ipArray[i].substring(0, 7) === "192.168") {
                    return true;
                }
            }
        } catch (ex) {
            Log.default.assert("获取不到IP地址, from page = ", req.params[0]);
        }
        return false;
    }

    public static formatDate(dt: Date, format: string): string {
        const o: {[key: string]: any} = {
            "M+" : dt.getMonth() + 1, // month
            "d+" : dt.getDate(), // day
            "h+" : dt.getHours(), // hour
            "m+" : dt.getMinutes(), // minute
            "s+" : dt.getSeconds(), // second
            "q+" : Math.floor((dt.getMonth() + 3) / 3), // quarter
            "S" : dt.getMilliseconds() // millisecond
        };
        if (/(y+)/.test(format))
            format = format.replace(RegExp.$1, (dt.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (const k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                const v =
                format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }

        return format;
    }

    public static getClientIp(req: any): string {
        try {
            const ip =  req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

            return ip;
        } catch (ex) {
            return "";
        }
    }

    // 12小时过期
    public static checkSessionTimeout(time: number) {
        return Date.now() - time > 1000 * 60 * 60 * 12;
    }

    public static sha1(text: string, salt: string) {
        const hash = createHash("sha1");
        hash.update(`${text}${salt}`, "utf-8");
        return hash.digest("hex");
    }
}
