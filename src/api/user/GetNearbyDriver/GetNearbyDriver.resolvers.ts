import { GetNearbyDriverResponese } from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import { Between } from "typeorm";
import User from "../../../entities/User";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Query: {
    GetNearbyDriver: async (
      _,
      __,
      { req }
    ): Promise<GetNearbyDriverResponese> => {
      isAuthenticated(req);
      const user: User = req.user;
      const { lastLat, lastLng } = user;
      try {
        const drivers = await User.find({
          // Exclude myself
          isDriving: true,
          lastLat: Between(lastLat - 0.05, lastLat + 0.05),
          lastLng: Between(lastLng - 0.05, lastLng + 0.05)
        });
        return {
          ok: true,
          error: null,
          drivers
        };
      } catch (e) {
        return {
          ok: false,
          error: e.message,
          drivers: null
        };
      }
    }
  }
};

export default resolvers;
