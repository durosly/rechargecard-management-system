import { withSessionRoute } from "../../../lib/withSession";
import UserModel from "../../../models/user";
// import BranchModel from "../../../models/branch";

export default withSessionRoute(loginRoute);

async function loginRoute(req, res) {
	try {
		if (req.method !== "DELETE") throw new Error("Invalid request method");
		const { user } = req.session;

		if (!user && user.type !== "admin") {
			throw new Error("Unathorized");
		}

		const { id } = req.query;

		if (!id) throw new Error("Select the account you wish to delete");

		await UserModel.findByIdAndDelete(id);

		res.send({ ok: true });
	} catch (error) {
		res.status(400).send({ ok: false, message: error.message });
	}
}
