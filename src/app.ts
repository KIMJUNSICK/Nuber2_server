import cors from "cors";
import { NextFunction, Response } from "express";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { GraphQLServer } from "graphql-yoga";
import helmet from "helmet";
import Redis from "ioredis";
import logger from "morgan";
import schema from "./schema";
import decodeJWT from "./utils/decodeJWT";

class App {
  public app: GraphQLServer; // set a type
  public pubSub: RedisPubSub;
  private options = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    retryStrategy: times => {
      // reconnect after
      return Math.min(times * 50, 2000);
    }
  };
  constructor() {
    this.pubSub = new RedisPubSub({
      publisher: new Redis(this.options),
      subscriber: new Redis(this.options)
    });
    this.app = new GraphQLServer({
      schema,
      // here, req is mean that raw req or full req
      // connection of req is WebSocket, not HTTP
      context: req => {
        const { connection: { context = null } = {} } = req;
        return {
          req: req.request, // req(express).request
          pubSub: this.pubSub,
          webSocketContext: context
        };
      }
    });
    this.middleware();
  } // constructor is the first Ftn to be executed
  private middleware = (): void => {
    this.app.express.use(cors()); // for connecting client to server that have different port
    this.app.express.use(logger("dev"));
    this.app.express.use(helmet());
    this.app.express.use(this.jwt);
  };
  private jwt = async (
    req,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const token = req.get("X-JWT");
    if (token) {
      const user = await decodeJWT(token);
      user ? (req.user = user) : (req.user = undefined);
    }
    next();
  };
}

export default new App().app;
