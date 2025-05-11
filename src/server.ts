import {createServer} from 'node:http';
import {routeHandler} from './routes/user.routes.ts';
import 'dotenv/config';

const PORT = process.env.PORT || 3000;

const server = createServer(routeHandler);

server.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Promise Rejection:", reason);
});