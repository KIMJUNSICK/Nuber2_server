import Chat from "../../../entities/Chat";
import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import {
  UpdateRideStatusMutationArgs,
  UpdateRideStatusResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Mutation: {
    UpdateRideStatus: async (
      _,
      args: UpdateRideStatusMutationArgs,
      { req, pubSub }
    ): Promise<UpdateRideStatusResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      if (user.isDriving) {
        let ride: Ride | undefined;
        if (args.status === "ACCEPTED") {
          ride = await Ride.findOne(
            {
              status: "REQUESTING",
              id: args.rideId
            },
            { relations: ["passenger"] }
          );
          if (ride) {
            ride.driver = user;
            user.isTaken = true;
            user.save();
            await Chat.create({
              driver: user,
              passenger: ride.passenger
            });
          }
        } else {
          ride = await Ride.findOne({
            id: args.rideId,
            driver: user
          });
        }

        if (ride) {
          ride.status = args.status;
          ride.save();
          pubSub.publish("updateRideStatus", { RideStatusSubscription: ride });
          return {
            ok: true,
            error: null
          };
        } else {
          return {
            ok: false,
            error: "Can't update ride"
          };
        }
      } else {
        return {
          ok: false,
          error: " You are not Driving"
        };
      }
    }
  }
};

export default resolvers;
