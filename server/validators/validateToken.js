import { check } from "express-validator";

const valdidateToken = check("revokeToken").notEmpty().isString().trim();

export default valdidateToken;
