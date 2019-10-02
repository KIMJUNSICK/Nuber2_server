import {
  StartVerificationMutationArgs,
  StartVerificationResponse
} from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import Verification from "../../../entities/Verification";
import { sendVerificationSMS } from "../../../utils/sendSMS";

// predicate ( confirm Existence of data)
// if/else try/catch
// creaete, update...

const resolvers: Resolvers = {
  Mutation: {
    StartVerification: async (
      _,
      args: StartVerificationMutationArgs
    ): Promise<StartVerificationResponse> => {
      const { phoneNumber } = args;
      try {
        const existingVerification = await Verification.findOne({
          payload: phoneNumber
        });
        if (existingVerification) {
          existingVerification.remove();
        }
        const newVerification = await Verification.create({
          target: "PHONE",
          payload: phoneNumber
        }).save();
        console.log(newVerification);
        await sendVerificationSMS(newVerification.payload, newVerification.key);
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
