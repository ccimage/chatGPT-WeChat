import SessionData, {UserData} from "../datatype/SessionDataInterface";

export default class SessionManager {
    public static Instance(): SessionManager {
        if (!this._instance) {
            this._instance = new SessionManager();
        }
        return this._instance;
    }

    private static _instance: SessionManager;
    private _loginUsers: { [index: string]: SessionData} = {}; // [token] = {username:string, data: any, time: Date}
    public getSessionUser(token: string): SessionData | undefined {
        const user = this._loginUsers[token];
        if (!user) {
            return undefined;
        }
        return user;
    }
    public deleteCache(token: string) {
        delete this._loginUsers[token];
    }
    public updateUserInfo(token: string, data: UserData) {
        this._loginUsers[token].data = data;
    }

    public deleteByName(username: string) {
        for (const k in this._loginUsers) {
            if (username === this._loginUsers[k].username) {
                delete this._loginUsers[k];
                break;
            }
        }
    }
    public addUser(token: string, loginData: SessionData) {
        this._loginUsers[token] = loginData;
    }
}
