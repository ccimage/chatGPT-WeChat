import ON_DEATH = require("death");
// import multer  = require("multer");
import checker = require("dotenv");
import WebConstant from "./common/WebConstant";


import ServerBase from "./startServer";

const server = new ServerBase();
// console.log(process.argv);
ON_DEATH(() => {
    server.quit();
    process.exit(1);
});
/**
 * how to start: node server.js
 */
checker.config();
WebConstant.initEnv();
server.start();
