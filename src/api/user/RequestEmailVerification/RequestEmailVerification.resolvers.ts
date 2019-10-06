import { RequestEmailVerificationResponse } from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import { sendKeyMail } from "../../..//utils/sendMail";
import User from "../../../entities/User";
import Verification from "../../../entities/Verification";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Mutation: {
    RequestEmailVerification: async (
      _,
      __,
      { req }
    ): Promise<RequestEmailVerificationResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      if (user.email && !user.verifiedEmail) {
        try {
          const oldVerification = await Verification.findOne({
            payload: user.email
          });
          if (oldVerification) {
            oldVerification.remove();
          }
          const newVerification = await Verification.create({
            payload: user.email,
            target: "EMAIL"
          }).save();
          await sendKeyMail(user.fullName, user.email, newVerification.key);
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
      } else {
        return {
          ok: false,
          error: "You have no email to verify / already verified"
        };
      }
    }
  }
};

export default resolvers;
