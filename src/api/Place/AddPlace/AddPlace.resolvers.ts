import { AddPlaceMutataionArgs, AddPlaceResponse } from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import User from "../../../entities/User";
import { isAuthenticated } from "../../../utils/isAuthenticated";
import Place from "src/entities/Place";

const resolvers: Resolvers = {
  Mutation: {
    EmailSignIn: async (
      _,
      args: AddPlaceMutataionArgs,
      { req }
    ): Promise<AddPlaceResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      try {
        await Place.create({ ...args, user }).save();
        return {
          ok: true,
          error: null
        };
      } catch (e) {
        return {
          ok: false,
          error: e.message
        };
      }
    }
  }
};

export default resolvers;
