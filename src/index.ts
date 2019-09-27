import dotenv from "dotenv";
dotenv.config();
// dotenv.config first -> server

import { Options } from "graphql-yoga";
import { createConnection } from "typeorm";
import app from "./app";
import connectionOptions from "./ormConfig";
// module first, library second

const PORT: number | string = process.env.PORT || 4000;
const PLAYGROUND_ENDPOINT: string = "/playground";
const GRAPHQL_ENDPOINT: string = "/graphql";

const appOptions: Options = {
  port: PORT,
  playground: PLAYGROUND_ENDPOINT,
  endpoint: GRAPHQL_ENDPOINT
};

const handleListen = () =>
  console.log(`Listening on: ✅  http://localhost:${PORT}`);

// connect to typeORM
// DB -> server
createConnection(connectionOptions)
  .then(() => {
    app.start(appOptions, handleListen);
  })
  .catch(error => console.log(error));
