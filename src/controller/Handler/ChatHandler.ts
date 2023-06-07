import WebConstant from "../../common/WebConstant";
import CommonFunc from "../../middleware/CommonFunc";
import WebPageBase from "../WebPageBase";
import { decrypt, encrypt , getSignature} from "@wecom/crypto";
import { XMLBuilder, XMLParser } from "fast-xml-parser";
// import * as xml from "xml";

interface RequestFormat {
    msg_signature: string;
    timestamp: number;
    nonce: number;
    echostr: string;
}
interface ResponseFormat {
    ToUser: string;
    FromUser: string;
    Message: string;
}
export default class ChatHandler extends WebPageBase {
    public static receiveMessage(body: RequestFormat): ResponseFormat | string {
        try {
            const parser = new XMLParser();
            const jObj = parser.parse(body.echostr);

            const localSign = getSignature(WebConstant.Token, body.timestamp, body.nonce, jObj.xml.Encrypt);

            const checkRet = localSign === body.msg_signature;
            if (!checkRet) return "";
            const { message } = decrypt(WebConstant.EncodingAESKey, decodeURIComponent(jObj.xml.Encrypt));
            // 或者聊天内容
            const chatData = parser.parse(message);
            // console.log("message = ", chatData.xml);
            const chatMsg = chatData.xml.Content as string;
            const keyWord = "/prompt:";
            if (chatData.xml.MsgType === "text" && chatMsg.startsWith(keyWord)) {
                console.log("receive prompt : ", chatMsg);
                return {
                    ToUser: chatData.xml.ToUserName as string,
                    FromUser: chatData.xml.FromUserName as string,
                    Message: chatMsg.substring(keyWord.length)
                };
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

    public static createMessage(fromUser: string, toUser: string, message?: string) {
        try {
            if (!message) return "";
            const timestamp = Math.round(Date.now() / 1000);
            const retMsgObj = {
                ToUserName: toUser,
                FromUserName: fromUser,
                CreateTime: timestamp,
                MsgType: "text",
                Content: message
            };
            const msgBody = this.makeXml(retMsgObj);
            console.log("msgBody = ", msgBody);
            const encryptText = encrypt(WebConstant.EncodingAESKey, msgBody, CommonFunc.md5(msgBody, ""));
            const nonce = timestamp + Math.round(Math.random() * 1000);
            const localSign = getSignature(WebConstant.Token, timestamp, nonce, encryptText);
            const retMsg = this.makeXml({
                Encrypt: encryptText,
                MsgSignature: localSign,
                TimeStamp: timestamp,
                Nonce: nonce
            });
            console.log("retMsg = ", retMsg);
            return retMsg;
        } catch (err: any) {
            return err.message;
        }
    }
    private static makeXml(data: {[key: string]: string | number}) {
        let xmlStr = "";
        Object.keys(data).forEach(k => {
            xmlStr += this.makeXmlNode(k, data[k], typeof data[k] === "string");
        });
        return `<xml>${xmlStr}</xml>`;
    }

    private static makeXmlNode(key: string, value: string | number, isCData = false) {
        const builder = new XMLBuilder({cdataPropName: isCData ? key : false});
        const data: any = {};
        data[key] = value;
        const node = builder.build(data);
        return isCData ? `<${key}>${node}</${key}>` : node;
    }
}