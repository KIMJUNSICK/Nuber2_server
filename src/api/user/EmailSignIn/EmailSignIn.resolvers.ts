import { Resolvers } from "src/types/resolvers";
import { EmailSignInMutationArgs, EmailSignInResponse } from "src/types/graph";
import User from "../../../entities/User";

const resolvers: Resolvers = {
  Mutation: {
    EmailSignIn: async (
      _,
      args: EmailSignInMutationArgs
    ): Promise<EmailSignInResponse> => {
      const { email, password } = args;
      try {
        const user = await User.findOne({
          email
        });
        if (!user) {
          return {
            ok: false,
            error: "User Not Found",
            token: null
          };
        }
        const compare = await user.comparePassword(password);
        if (compare) {
          return {
            ok: true,
            error: null,
            token: "Comming soon!"
          };
        } else {
          return {
            ok: false,
            error: "password is invalid",
            token: null
          };
        }
      } catch (e) {
        return {
          ok: false,
          error: e.message,
          token: null
        };
      }
    }
  }
};

export default resolvers;
