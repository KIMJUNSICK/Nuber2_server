import { GetMyPlaceResponse } from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import User from "../../../entities/User";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Query: {
    GetMyPlace: async (_, __, { req }): Promise<GetMyPlaceResponse> => {
      isAuthenticated(req);
      try {
        const user = await User.findOne(
          { id: req.user.id },
          { relations: ["places"] }
        );
        if (user) {
          return {
            ok: true,
            error: null,
            places: user.places
          };
        } else {
          return {
            ok: false,
            error: "User not found",
            places: null
          };
        }
      } catch (e) {
        return {
          ok: false,
          error: e.message,
          places: null
        };
      }
    }
  }
};

export default resolvers;
