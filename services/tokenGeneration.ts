import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";

const generateToken = (id: string) => {
  const secret = process.env.JWT_SECRET as string;
  const tokenData = { id };
  const options = { expiresIn: "120" };

  const token = jwt.sign(tokenData, secret, options);
  return token;
};

const generateRefreshToken = () => {
  const refreshToken = randomBytes(32).toString("hex");
  return refreshToken;
};

export { generateToken, generateRefreshToken };
