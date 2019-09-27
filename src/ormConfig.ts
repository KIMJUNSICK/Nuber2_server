import { ConnectionOptions } from "typeorm";

console.log(process.env.DB_USERNAME);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_ENDPOINT);

const connectionOptions: ConnectionOptions = {
  type: "postgres",
  database: "nuber2",
  synchronize: true,
  logging: true,
  entities: ["./entities/**/*.*"],
  host: process.env.DB_ENDPOINT,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
};

export default connectionOptions;
