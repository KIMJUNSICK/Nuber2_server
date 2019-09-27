import { Options } from "graphql-yoga";
import app from "./app";

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

app.start(appOptions, handleListen);
