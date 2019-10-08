import cors from "cors";
import { NextFunction, Response } from "express";
import { GraphQLServer, PubSub } from "graphql-yoga";
import helmet from "helmet";
import logger from "morgan";
import schema from "./schema";
import decodeJWT from "./utils/decodeJWT";

class App {
  public app: GraphQLServer; // set a type
  public pubSub: any;
  constructor() {
    this.pubSub = new PubSub();
    this.pubSub.ee.setMaxListeners(99);
    this.app = new GraphQLServer({
      schema,
      context: req => {
        return {
          req: req.request, // req(express).request
          pubSub: this.pubSub
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
