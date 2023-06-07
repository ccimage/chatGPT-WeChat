import { Configuration, OpenAIApi } from "openai";
import RunLog from "../common/RunLog";

export class ChatGTPApi {
    private openAi: OpenAIApi;
    constructor(organization: string, apiKey: string) {
        const configuration = new Configuration({
            organization,
            apiKey
        });
        this.openAi = new OpenAIApi(configuration);
    }
    public async sendChatMessage(msg: string, user?: string) {
        const chatRet = await this.openAi.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", name: user, content: msg}],
            user
        });
        RunLog.output("chat return = ", chatRet.status.toString(), chatRet.statusText);
        RunLog.output("chat data = ", JSON.stringify(chatRet.data));
        return chatRet.data;
    }
}