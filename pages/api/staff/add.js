import { withSessionRoute } from "../../../lib/withSession";
import UserModel from "../../../models/user";
// import BranchModel from "../../../models/branch";

export default withSessionRoute(loginRoute);

async function loginRoute(req, res) {
	try {
		const { user } = req.session;

		if (!user && user.type !== "admin") {
			throw new Error("Unathorized");
		}

		const { fullname, email, password, confirm_password, branch } =
			req.body;

		// const branchExist = await BranchModel.findOne({ branch });

		// if (branchExist) throw new Error("Branch already added");

		if (!fullname) throw new Error("Name cannot be empty");
		if (!email) throw new Error("E-mail address cannot be empty");
		if (!password) throw new Error("Password cannot be empty");
		if (!confirm_password) throw new Error("Please confirm your password");
		if (password !== confirm_password)
			throw new Error("Passwords don't match");
		if (!branch) throw new Error("Please select a branch");

		const names = fullname.split(" ");

		const newUser = await UserModel.create({
			firstname: names[0],
			lastname: names[names.length - 1],
			email,
			password,
			_branchId: branch,
		});

		// const branch = await BranchModel.create({
		// 	name,
		// 	address,
		// });

		res.send({ ok: true, user: newUser });
	} catch (error) {
		res.status(400).send({ ok: false, message: error.message });
	}
}
