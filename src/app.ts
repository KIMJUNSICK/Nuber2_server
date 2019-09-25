import cors from "cors";
import { GraphQLServer } from "graphql-yoga";
import helmet from "helmet";
import logger from "morgan";

class App {
  public app: GraphQLServer; // set a type
  constructor() {
    this.app = new GraphQLServer({});
    this.middleware();
  } // constructor is the first Ftn to be executed
  private middleware = (): void => {
    this.app.express.use(cors()); // for connecting client to server that have different port
    this.app.express.use(logger("dev"));
    this.app.express.use(helmet());
  };
}

export default new App().app;
