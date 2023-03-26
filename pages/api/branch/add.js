import { withSessionRoute } from "../../../lib/withSession";
import BranchModel from "../../../models/branch";
import RateModel from "../../../models/rates";

export default withSessionRoute(loginRoute);

async function loginRoute(req, res) {
	try {
		const { user } = req.session;

		if (!user && user.type !== "admin") {
			throw new Error("Unathorized");
		}

		const { branch, rates } = req.body;
		const { name, address } = branch;

		const branchExist = await BranchModel.findOne({ name });

		if (branchExist) throw new Error("Branch already added");

		if (!name) throw new Error("Name cannot be empty");
		if (!address) throw new Error("Address cannot be empty");

		const newBranch = await BranchModel.create({
			name,
			address,
		});

		const bulkRateData = rates.bulk.map((r) => ({
			_networkId: r._id,
			_branchId: newBranch._id,
			type: "bulk",
			amount: r.count,
		}));
		const wholesaleRateData = rates.wholesale.map((r) => ({
			_networkId: r._id,
			_branchId: newBranch._id,
			type: "wholesale",
			amount: r.count,
		}));

		await RateModel.insertMany([...bulkRateData, ...wholesaleRateData]);

		// console.log({ bulkRateData, wholesaleRateData });

		res.send({ ok: true, branch: newBranch });
	} catch (error) {
		res.status(400).send({ ok: false, message: error.message });
	}
}
