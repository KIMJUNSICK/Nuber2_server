import { Resolvers } from "../../../types/resolvers";
import { GetChatQueryArgs, GetChatResponse } from "../../../types/graph";
import { isAuthenticated } from "../../../utils/isAuthenticated";
import User from "../../../entities/User";
import Chat from "../../../entities/Chat";

const resolvers: Resolvers = {
  Query: {
    GetChat: async (
      _,
      args: GetChatQueryArgs,
      { req }
    ): Promise<GetChatResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      try {
        const chat = await Chat.findOne({
          id: args.chatId
        });
        if (chat) {
          if (chat.driverId === user.id || chat.passengerId === user.id) {
            return {
              ok: true,
              error: null,
              chat
            };
          } else {
            return {
              ok: false,
              error: "Not Authorized",
              chat: null
            };
          }
        } else {
          return {
            ok: false,
            error: "Chat not found",
            chat: null
          };
        }
      } catch (e) {
        return {
          ok: false,
          error: e.message,
          chat: null
        };
      }
    }
  }
};

export default resolvers;
