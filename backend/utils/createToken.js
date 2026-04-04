import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Set JWT as an HTTP-Only Cookie
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true, // MUST be true for Render (https)
    sameSite: 'None', // MUST be 'None' for cross-site cookies (Vercel to Render)
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateToken;
