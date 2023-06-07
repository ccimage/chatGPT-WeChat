import WebConstant from "../../common/WebConstant";
import WebPageBase from "../WebPageBase";
import { decrypt, encrypt , getSignature} from "@wecom/crypto";
import { XMLBuilder, XMLParser } from "fast-xml-parser";

interface RequestFormat {
    msg_signature: string;
    timestamp: number;
    nonce: number;
    echostr: string;
}
export default class ChatHandler extends WebPageBase {
    public static receiveMessage(body: RequestFormat) {
        try {
            const parser = new XMLParser();
            const jObj = parser.parse(body.echostr);

            const localSign = getSignature(WebConstant.Token, body.timestamp, body.nonce, jObj.xml.Encrypt);

            const checkRet = localSign === body.msg_signature;
            if (!checkRet) return false;
            const { message } = decrypt(WebConstant.EncodingAESKey, jObj.xml.Encrypt);
            // 或者聊天内容
            const chatData = parser.parse(message);
            // console.log("message = ", chatData.xml);
            const chatMsg = chatData.xml.Content as string;
            const keyWord = "/prompt:";
            if (chatData.xml.MsgType === "text" && chatMsg.startsWith(keyWord)) {
                console.log("receive prompt : ", chatMsg);
                return chatMsg.substring(keyWord.length);
            }
            return "";
        } catch (err: any) {
            return err.message;
        }
    }

    public static verifyUrl(query: RequestFormat) {
        // 验证算法
        // dev_msg_signature=sha1(sort(token、timestamp、nonce、msg_encrypt))。
        try {
            const localSign = getSignature(WebConstant.Token, query.timestamp, query.nonce, query.echostr);

            const checkRet = localSign === query.msg_signature;

            if (!checkRet) return false;
            const { message } = decrypt(WebConstant.EncodingAESKey, query.echostr);
            return message;
        } catch {
            // nothing;
        }
        return "";
    }

    public static createMessage(message?: string) {
        try {
            if (!message) return "";
            // const options = {
            //     processEntities:false,
            //     format: true,
            //     ignoreAttributes: false,
            //     cdataPropName: "phone"
            // };
            const encryptText = encrypt(WebConstant.EncodingAESKey, message, "1");
            const timestamp = Math.round(Date.now() / 1000);
            const nonce = timestamp + Math.round(Math.random() * 1000);
            const localSign = getSignature(WebConstant.Token, timestamp, nonce, encryptText);
            const builder = new XMLBuilder();
            return builder.build({
                Encrypt: encryptText,
                MsgSignature: localSign,
                TimeStamp: timestamp,
                Nonce: nonce
            });
        } catch (err: any) {
            return err.message;
        }
    }
}