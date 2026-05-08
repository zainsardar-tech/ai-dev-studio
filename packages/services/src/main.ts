import { BridgeServer } from './server';

const server = new BridgeServer(3456);
server.start();

process.on('SIGTERM', () => { server.stop(); process.exit(0); });
process.on('SIGINT', () => { server.stop(); process.exit(0); });
