import RunLog from "./common/RunLog";
import WebConstant from "./common/WebConstant";
import AdminServer from "./serverImplement/adminServer";

export default class StartServer {
    private _adminServer: AdminServer | undefined = undefined;
    public start() {
        return this.startServer();
    }

    private startServer() {
        try {
            this._adminServer = new AdminServer("admin server");
            return this._adminServer.startServer(WebConstant.port);
        } catch (ex: any) {
            RunLog.assert(`Start Server Exception:${ex.message}`);
        }
        return {};
    }

    public quit() {
        if (this._adminServer) {
            this._adminServer.stop();
        }
    }
}