import { Resolvers } from "src/types/resolvers";
import {
  StartVerificationMutationArgs,
  StartVerificationResponse
} from "src/types/graph";
import Verification from "src/entities/Verification";

// predicate ( confirm Existence of data)
// creaete, update...
// if/else try/catch

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
        const key = newVerification.key;
        // twilio(phoneNumber, key)
        // send message of key to device that have the phoneNumber
        // user get key !
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
