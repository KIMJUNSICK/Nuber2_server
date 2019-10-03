import { EmailSignUpMutationArgs, EmailSignUpResponse } from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import User from "../../../entities/User";
import generateJWT from "../../../utils/generateJWT";

const resolvers: Resolvers = {
  Mutation: {
    EmailSignUp: async (
      _,
      args: EmailSignUpMutationArgs
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
          const newUser = await User.create({ ...args }).save();
          const token = generateJWT(newUser.id);
          return {
            ok: true,
            error: null,
            token
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
