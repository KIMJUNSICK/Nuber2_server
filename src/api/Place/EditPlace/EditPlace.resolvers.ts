import { EditPlaceMutationArgs, EditPlaceResponse } from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import Place from "../../../entities/Place";
import User from "../../../entities/User";
import filterNull from "../../../utils/filterNull";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Mutation: {
    EditPlace: async (
      _,
      args: EditPlaceMutationArgs,
      { req }
    ): Promise<EditPlaceResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      try {
        const place = await Place.findOne({ id: args.placeId });
        if (place) {
          if (place.userId === user.id) {
            const notNull: any = filterNull(args);
            if (notNull.placeId !== null) {
              delete notNull.placeId;
            }
            await Place.update({ id: args.placeId }, { ...notNull });
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
      } catch (error) {
        return {
          ok: false,
          error: error.message
        };
      }
    }
  }
};
export default resolvers;
