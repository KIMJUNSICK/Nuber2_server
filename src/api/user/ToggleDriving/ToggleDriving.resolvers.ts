import { ToggleDrivingResponse } from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import User from "../../../entities/User";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Mutation: {
    ToggleDriving: async (_, __, { req }): Promise<ToggleDrivingResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      user.isDriving = !user.isDriving;
      user.save();
      return {
        ok: true,
        error: null
      };
    }
  }
};

export default resolvers;
