import {
  UpdateMyProfileMutationArgs,
  UpdateMyProfileResponse
} from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import User from "../../../entities/User";
import filterNull from "../../../utils/filterNull";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Mutation: {
    UpdateMyProfile: async (
      _,
      args: UpdateMyProfileMutationArgs,
      { req }
    ): Promise<UpdateMyProfileResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      const notNull: any = filterNull(args);
      if (notNull.password !== null) {
        user.password = notNull.password;
        await user.save();
        delete notNull.password;
      }
      try {
        await User.update({ id: user.id }, { ...notNull });
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
