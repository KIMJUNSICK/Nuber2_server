import {
  CompletePhoneVerificationMutationArgs,
  CompletePhoneVerificationResponse
} from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import User from "../../../entities/User";
import Verification from "../../../entities/Verification";
import generateJWT from "../../../utils/generateJWT";

const resolvers: Resolvers = {
  Mutation: {
    CompletePhoneVerification: async (
      _,
      args: CompletePhoneVerificationMutationArgs
    ): Promise<CompletePhoneVerificationResponse> => {
      const { phoneNumber, key } = args;
      try {
        const verification = await Verification.findOne({
          payload: phoneNumber,
          key
        });
        if (!verification) {
          return {
            ok: false,
            error: "Verification key is not invalid",
            token: null
          };
        } else {
          verification.verified = true;
          verification.save();
        }
      } catch (e) {
        return {
          ok: false,
          error: e.message,
          token: null
        };
      }

      try {
        const user = await User.findOne({
          phoneNumber
        });
        if (user) {
          user.verifiedPhonenNumber = true;
          user.save();
          const token = generateJWT(user.id);
          return {
            ok: true,
            error: null,
            token
          };
        } else {
          return {
            ok: false,
            error: "User Not Found",
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
