import { DeletePlaceMutationArgs, DeletePlaceResponse } from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import Place from "../../../entities/Place";
import User from "../../../entities/User";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Mutation: {
    DeletePlace: async (
      _,
      args: DeletePlaceMutationArgs,
      { req }
    ): Promise<DeletePlaceResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      try {
        const place = await Place.findOne({ id: args.placeId });
        if (place) {
          if (place.userId === user.id) {
            await place.remove();
            return {
              ok: true,
              error: null
            };
          } else {
            return {
              ok: false,
              error: "Not Authorized"
            };
          }
        } else {
          return {
            ok: false,
            error: "Place not found"
          };
        }
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
