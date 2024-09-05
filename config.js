import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT || 8001,
  multerPort: process.env.MULTER_PORT || 5001,
  connectionstring: process.env.CONNECTION_STRING,
  jwtSecret: process.env.JWT_SECRET,
  adminEmail: process.env.ADMIN_EMAIL,
};
