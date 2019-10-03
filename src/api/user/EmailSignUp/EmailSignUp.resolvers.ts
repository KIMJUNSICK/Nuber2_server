import { EmailSignUpMutaionArgs, EmailSignUpResponse } from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import User from "../../../entities/User";

const resolvers: Resolvers = {
  Mutation: {
    EmailSignUp: async (
      _,
      args: EmailSignUpMutaionArgs
    ): Promise<EmailSignUpResponse> => {
      try {
        const { email } = args;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return {
            ok: false,
            error: "You should log in instead",
            token: null
          };
        } else {
          await User.create({ ...args }).save();
          return {
            ok: true,
            error: null,
            token: "Comming soon!"
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
