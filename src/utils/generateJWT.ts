import jwt from "jsonwebtoken";

const generateJWT = (id: number): string => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET || "");
  return token;
};

export default generateJWT;

// make generator Ftn for making jwt
// if get payload (id), encode it
// Server have to decode it
