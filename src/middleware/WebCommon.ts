import fs = require("fs");

export default class WebCommon {

    public static checkTempFile(filepath: string, callback: ((ret: boolean) => void)): void {
        fs.exists("views/" + filepath + ".ejs", result => {
            if (callback) {
                callback(result);
            }
        });
    }

    public static isEmpty(obj: {[key: string]: any}) {
        for (const item in obj) {
            return false;
        }
        return true;
    }

    public static arrayContains(arrayObj: any[], obj: any) {
        for (let i = 0; i < arrayObj.length; i++) {
            if (obj === arrayObj[i]) {
                return true;
            }
        }
        return false;
    }

    public static GenerateRandomCode(len: number): string {
        const baseCode = "23456789ABCDEFGHJKLMNPQRTSUVWXYZ";
        let retStr = "";
        for (let i = 0; i < len; i++) {
            const rnd = Math.floor(Math.random() * 100000) % baseCode.length;
            retStr += baseCode[rnd];
        }
        return retStr;
    }
}
