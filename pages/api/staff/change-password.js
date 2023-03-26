import bcrypt from "bcryptjs";
import { withSessionRoute } from "../../../lib/withSession";
import UserModel from "../../../models/user";
// import BranchModel from "../../../models/branch";

export default withSessionRoute(loginRoute);

async function loginRoute(req, res) {
	try {
		const { user } = req.session;

		if (!user) {
			throw new Error("Unathorized");
		}

		const { curr, new: newPassword, re_new } = req.body;

		if (!curr) throw new Error("Enter current password");
		if (!newPassword) throw new Error("Enter new password");
		if (!re_new) throw new Error("Enter confirm password");

		if (newPassword !== re_new) throw new Error("Passwords don't match");

		const userInfo = await UserModel.findById(user.id);

		if (!userInfo) throw new Error("Invalid credentials");

		const compare = await bcrypt.compare(curr, userInfo.password);

		if (!compare) throw new Error("Invalid credentials");

		const hashedPassword = bcrypt.hashSync(newPassword, 10);

		await UserModel.findByIdAndUpdate(user.id, {
			password: hashedPassword,
		});

		res.send({ ok: true });
	} catch (error) {
		res.status(400).send({ ok: false, message: error.message });
	}
}
