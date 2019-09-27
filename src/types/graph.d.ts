export const typeDefs = ["type junsickResponse {\n  ok: Boolean!\n  error: String\n  name: String\n}\n\ntype Query {\n  junsick(name: String!): junsickResponse!\n  junsik: String\n}\n"];
/* tslint:disable */

export interface Query {
  junsick: junsickResponse;
  junsik: string | null;
}

export interface JunsickQueryArgs {
  name: string;
}

export interface junsickResponse {
  ok: boolean;
  error: string | null;
  name: string | null;
}
