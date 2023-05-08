export default class WebConstant {
    public static port: number = 3001;
    public static wx_appid = "";
    public static wx_appKey = "";
    public static chatGPT_token = "";
    public static initEnv() {
        const EnvKeys = ["port", "wx_appid", "wx_appKey", "chatGPT_token"];

        for (let i = 0; i < EnvKeys.length; i++) {
            const key = EnvKeys[i];
            if (!process.env[key]) {
                throw new Error(`config ${key} is required.`);
            }
        }
        this.port = Number(process.env.port);
        this.wx_appid = process.env.wx_appid || "";
        this.wx_appKey = process.env.wx_appKey || "";
        this.chatGPT_token = process.env.chatGPT_token || "";
    }
}
