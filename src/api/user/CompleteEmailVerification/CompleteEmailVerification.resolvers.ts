import {
  CompleteEmailVerificationMutationArgs,
  CompleteEmailVerificationResponse
} from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import User from "../../../entities/User";
import Verification from "../../../entities/Verification";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Mutation: {
    CompleteEmailVerification: async (
      _,
      args: CompleteEmailVerificationMutationArgs,
      { req }
    ): Promise<CompleteEmailVerificationResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      if (user.email) {
        try {
          const verification = await Verification.findOne({
            payload: user.email,
            key: args.key
          });
          if (verification) {
            verification.verified = true;
            verification.save();
            user.verifiedEmail = true;
            user.save();
            return {
              ok: true,
              error: null
            };
          } else {
            return {
              ok: false,
              error: "Your key is not valid"
            };
          }
        } catch (e) {
          return {
            ok: false,
            error: e.message
          };
        }
      } else {
        return {
          ok: false,
          error: "You have no email to verify"
        };
      }
    }
  }
};

export default resolvers;
