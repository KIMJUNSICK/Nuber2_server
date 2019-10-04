export const isAuthenticated = request => {
  if (!request.user) {
    throw Error("You are not Authenticated");
  }
  return;
};
