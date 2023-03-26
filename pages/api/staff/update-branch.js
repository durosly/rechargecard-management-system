import { withSessionRoute } from "../../../lib/withSession";
import BranchModel from "../../../models/branch";
import UserModel from "../../../models/user";
// import BranchModel from "../../../models/branch";

export default withSessionRoute(loginRoute);

async function loginRoute(req, res) {
	try {
		const { user } = req.session;

		if (!user && user.type !== "admin") {
			throw new Error("Unathorized");
		}

		const { staff, branch } = req.body;

		// const branchExist = await BranchModel.findOne({ branch });

		// if (branchExist) throw new Error("Branch already added");

		if (!branch) throw new Error("Please select a branch");
		if (!staff) throw new Error("Please select staff");

		const staffDB = await UserModel.findById(staff);

		staffDB._branchId = branch;
		await staffDB.save();

		const branchDB = await BranchModel.findById(branch);

		// const branch = await BranchModel.create({
		// 	name,
		// 	address,
		// });

		res.send({ ok: true, branch: branchDB, staff });
	} catch (error) {
		res.status(400).send({ ok: false, message: error.message });
	}
}
