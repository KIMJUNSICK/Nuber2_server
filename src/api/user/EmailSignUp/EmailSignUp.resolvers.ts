import { EmailSignUpMutationArgs, EmailSignUpResponse } from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import User from "../../../entities/User";
import Verification from "../../../entities/Verification";
import generateJWT from "../../../utils/generateJWT";
import { sendKeyMail } from "../../../utils/sendMail";

const resolvers: Resolvers = {
  Mutation: {
    EmailSignUp: async (
      _,
      args: EmailSignUpMutationArgs
    ): Promise<EmailSignUpResponse> => {
      try {
        const { email, phoneNumber } = args;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return {
            ok: false,
            error: "You should log in instead",
            token: null
          };
        } else {
          const phoneVerification = await Verification.findOne({
            payload: phoneNumber,
            verified: true
          });
          if (phoneVerification) {
            const newUser = await User.create({ ...args }).save();
            if (newUser.email) {
              const emailVerification = await Verification.create({
                payload: newUser.email,
                target: "EMAIL"
              }).save();
              await sendKeyMail(
                newUser.fullName,
                newUser.email,
                emailVerification.key
              );
            }
            const token = generateJWT(newUser.id);
            return {
              ok: true,
              error: null,
              token
            };
          } else {
            return {
              ok: false,
              error: "You are not authenticated by phone number",
              token: null
            };
          }
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
