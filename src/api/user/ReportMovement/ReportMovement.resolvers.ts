import {
  ReportMovementMutationArgs,
  ReportMovementResponse
} from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import User from "../../../entities/User";
import filterNull from "../../../utils/filterNull";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Mutation: {
    ReportMovement: async (
      _,
      args: ReportMovementMutationArgs,
      { req, pubSub }
    ): Promise<ReportMovementResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      const notNull = filterNull(args);
      try {
        await User.update({ id: user.id }, { ...notNull });
        pubSub.publish("driverUpdate", { DriversSubscription: user });
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
