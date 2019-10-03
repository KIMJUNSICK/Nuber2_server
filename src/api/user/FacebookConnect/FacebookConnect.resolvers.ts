import {
  FacebookConnectMutationArgs,
  FacebookConnectResponse
} from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import User from "../../../entities/User";
import generateJWT from "../../../utils/generateJWT";

// graphql type modeling => type & args (from front?)
// predicate & get info
// create user

const resolvers: Resolvers = {
  Mutation: {
    FacebookConnect: async (
      _,
      args: FacebookConnectMutationArgs
    ): Promise<FacebookConnectResponse> => {
      const { fbId } = args;
      try {
        const existingUser = await User.findOne({ fbId });
        if (existingUser) {
          const token = generateJWT(existingUser.id);
          return {
            ok: true,
            error: null,
            token
          };
        }
      } catch (e) {
        return {
          ok: false,
          error: e.message,
          token: null
        };
      }
      try {
        const newUser = await User.create({
          ...args,
          profilePhoto: `http://graph.facebook.com/${fbId}/picture?type=square`
        }).save();
        const token = generateJWT(newUser.id);
        return {
          ok: true,
          error: null,
          token
        };
      } catch (e) {
        return {
          ok: false,
          error: e.message,
          token: null
        };
      }
    }
  }
};

export default resolvers;
