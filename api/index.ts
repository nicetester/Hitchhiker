import * as Koa from 'koa';
import Middleware from './middlewares/middleware';
import { Log } from './utils/log';
import { ChildProcessManager } from './run_engine/child_process_manager';
import 'reflect-metadata';
import { WebSocketService } from './services/web_socket_service';
import { Setting } from './utils/setting';

let app = new Koa();

Log.init();

Setting.instance.init();

ChildProcessManager.instance.init();

app.use(Middleware(app));

const server = app.listen(81);

server.timeout = 30 * 60 * 1000;

new WebSocketService(server).start();