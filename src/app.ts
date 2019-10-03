import cors from "cors";
import { GraphQLServer } from "graphql-yoga";
import helmet from "helmet";
import logger from "morgan";
import schema from "./schema";
import decodeJWT from "./utils/decodeJWT";

class App {
  public app: GraphQLServer; // set a type
  constructor() {
    this.app = new GraphQLServer({
      schema
    });
    this.middleware();
  } // constructor is the first Ftn to be executed
  private middleware = (): void => {
    this.app.express.use(cors()); // for connecting client to server that have different port
    this.app.express.use(logger("dev"));
    this.app.express.use(helmet());
    this.app.express.use(this.jwt);
  };
  private jwt = async (req, res, next): Promise<void> => {
    const token = req.get("X-JWT");
    if (token) {
      const user = await decodeJWT(token);
      console.log(user);
    }
    next();
  };
}

export default new App().app;
