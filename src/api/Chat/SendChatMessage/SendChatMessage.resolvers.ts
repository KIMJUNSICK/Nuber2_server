import Chat from "../../../entities/Chat";
import Message from "../../../entities/Message";
import User from "../../../entities/User";
import {
  SendChatMessageMutationArgs,
  SendChatMessageResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Mutation: {
    SendChatMessage: async (
      _,
      args: SendChatMessageMutationArgs,
      { req, pubSub }
    ): Promise<SendChatMessageResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      try {
        const chat = await Chat.findOne({
          id: args.chatId
        });
        if (chat) {
          if (chat.driverId === user.id || chat.passengerId === user.id) {
            const message = await Message.create({
              text: args.text,
              chat,
              user
            }).save();
            pubSub.publish("updateMessage", { MessageSubscription: message });
            return {
              ok: true,
              error: null,
              message
            };
          } else {
            return {
              ok: false,
              error: "Not Authorized",
              message: null
            };
          }
        } else {
          return {
            ok: false,
            error: "Chat not found",
            message: null
          };
        }
      } catch (e) {
        return {
          ok: false,
          error: e.message,
          message: null
        };
      }
    }
  }
};

export default resolvers;
