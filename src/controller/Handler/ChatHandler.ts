import WebConstant from "../../common/WebConstant";
import WebPageBase from "../WebPageBase";
import { getSignature, decrypt } from "@wecom/crypto";

interface RequestFormat {
    msg_signature: string;
    timestamp: number;
    nonce: number;
    echostr: string;
}
export default class ChatHandler extends WebPageBase {
    public receiveMessage(body: RequestFormat) {
        // TODO: receive message from wechat

        return "";
    }

    public verifyUrl(query: RequestFormat) {
        // 验证算法
        // dev_msg_signature=sha1(sort(token、timestamp、nonce、msg_encrypt))。
        // const paramList = [WebConstant.Token, query.timestamp, query.nonce, query.echostr];
        // paramList.sort();
        const localSign = getSignature(WebConstant.Token, query.timestamp, query.nonce, query.echostr);

        const checkRet = localSign === query.msg_signature;

        if (!checkRet) return false;
        const {message, id} = decrypt(WebConstant.EncodingAESKey, query.echostr);
        return message;
    }
}