import { cookieExtractor } from "../config/passport.config.js";
import { authToken } from "../utils/jwt.js";

const handlePolice = (role) => {
  return (req, res, next) => {
    const token = cookieExtractor(req);
    if (!token)
      return res
        .status(401)
        .json({ status: "error", code: 401, message: "unauthorized" });

    try {
      const decoded = authToken(token, process.env.JWT_SECRET);

      if (role.includes(decoded.user.role)) {
        next();
      } else {
        return res
          .status(403)
          .json({ status: "error", code: 403, message: "Access prohibited" });
      }
    } catch (e) {
      return res
        .status(500)
        .json({ status: "error", code: 500, message: e.message });
    }
  };
};

export default handlePolice;
