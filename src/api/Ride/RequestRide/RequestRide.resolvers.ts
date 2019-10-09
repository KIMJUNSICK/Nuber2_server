import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import {
  RequestRideMutationArgs,
  RequestRideResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Mutation: {
    RequestRide: async (
      _,
      args: RequestRideMutationArgs,
      { req, pubSub }
    ): Promise<RequestRideResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      if (!user.isRiding) {
        try {
          const ride = await Ride.create({ ...args, passenger: user }).save();
          pubSub.publish("ridesUpdate", { NearbyRideSubscription: ride });
          return {
            ok: true,
            error: null,
            ride
          };
        } catch (e) {
          return {
            ok: false,
            error: e.message,
            ride: null
          };
        }
      } else {
        return {
          ok: false,
          error: "You're not request two rides",
          ride: null
        };
      }
    }
  }
};

export default resolvers;
