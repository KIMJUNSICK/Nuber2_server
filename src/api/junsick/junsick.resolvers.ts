import { JunsickQueryArgs, junsickResponse } from "src/types/graph";

const resolvers = {
  Query: {
    junsick: (_, args: JunsickQueryArgs): junsickResponse => {
      const { name } = args;
      return {
        ok: true,
        error: null,
        name
      };
    }
  }
};

export default resolvers;
