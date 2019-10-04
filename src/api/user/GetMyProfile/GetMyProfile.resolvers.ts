import { GetMyProfileResponse } from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import User from "../../../entities/User";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Query: {
    GetMyProfile: async (_, __, { req }): Promise<GetMyProfileResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      return {
        ok: true,
        error: null,
        user
      };
    }
  }
};

export default resolvers;
