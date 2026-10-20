import jwt from "jsonwebtoken";

// checks the token that the frontend sends in the Authorization header
export function checkLogin(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "Please login first" });
  }

  const token = header.split(" ")[1];

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data; // { id, role }
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token, login again" });
  }
}

// only allow one role (donor or ngo) to use a route
export function onlyRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Only " + role + " can do this" });
    }
    next();
  };
}
