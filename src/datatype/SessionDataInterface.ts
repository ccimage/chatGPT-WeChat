export default interface SessionData {
    username: string;
    data: UserData;
    time: Date;
}
export interface UserData {
    username: string;
    realName: string;
    routers: string[];
}
