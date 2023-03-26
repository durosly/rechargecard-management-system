import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "./session";
import mongoose from "mongoose";

export function withSessionRoute(handler) {
	mongoose.connect(process.env.MONGODB_URL);
	return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr(handler) {
	mongoose.connect(process.env.MONGODB_URL);
	return withIronSessionSsr(handler, sessionOptions);
}
