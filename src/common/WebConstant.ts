export default class WebConstant {
    public static port = 3001;
    public static wx_appid = "";
    public static wx_appKey = "";
    public static default_organization = "";
    public static chatGPT_token = "";
    public static Token = "";
    public static EncodingAESKey = "";
    public static initEnv() {
        const EnvKeys = ["port", "chatGPT_token", "Token", "EncodingAESKey"];

        for (let i = 0; i < EnvKeys.length; i++) {
            const key = EnvKeys[i];
            if (!process.env[key]) {
                throw new Error(`config ${key} is required.`);
            }
        }
        this.port = Number(process.env.port);
        this.wx_appid = process.env.wx_appid || "";
        this.wx_appKey = process.env.wx_appKey || "";
        this.default_organization = process.env.default_organization || "Default";
        this.chatGPT_token = process.env.chatGPT_token || "";
        this.Token = process.env.Token || "";
        this.EncodingAESKey = process.env.EncodingAESKey || "";
    }
}
