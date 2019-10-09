import { Between } from "typeorm";
import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import { GetNearByRidesResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Query: {
    GetNearByRides: async (_, __, { req }): Promise<GetNearByRidesResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      if (user.isDriving) {
        const { lastLat, lastLng } = user;
        try {
          const rides = await Ride.find({
            status: "REQUESTING",
            pickUpLat: Between(lastLat - 0.05, lastLng + 0.05),
            pickUpLng: Between(lastLng - 0.05, lastLng + 0.05)
          });
          return {
            ok: true,
            error: null,
            rides
          };
        } catch (e) {
          return {
            ok: false,
            error: e.message,
            rides: null
          };
        }
      } else {
        return {
          ok: false,
          error: "You are not Drivers",
          rides: null
        };
      }
    }
  }
};

export default resolvers;
