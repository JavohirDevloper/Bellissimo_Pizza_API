import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../shared/config/index.js";
import db from "../../db/index.js";
import { BadRequestError, NotFoundError } from "../../shared/errors/index.js";

export const loginUser = async ({ username, password }) => {
  const existing = await db("users").where({ username }).first();

  if (!existing) {
    throw new NotFoundError("User not found");
  }

  const match = await bcryptjs.compare(password, existing.password);
  if (!match) {
    throw new BadRequestError("Username or password wrong!");
  }

  const payload = { user: { id: existing.id } };
  const token = jwt.sign(payload, config.jwt.secret, { expiresIn: "1h" });

  return { token };
};
