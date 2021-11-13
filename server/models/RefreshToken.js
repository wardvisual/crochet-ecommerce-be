import { Schema, model } from "mongoose";

const refreshTokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  created: { type: Date, default: Date.now() },
  replacedByToken: { type: String },
  refreshToken: { type: String },
  revokedByIp: { type: String },
  createdByIp: { type: String },
  expires: { type: Date },
  revoked: { type: Date },
});

refreshTokenSchema.virtual("isExpired").get(function () {
  return Date.now() >= this.expires;
});

refreshTokenSchema.virtual("isActive").get(function () {
  return !this.revoked && !this.isExpired;
});

export default model("RefreshToken", refreshTokenSchema);
