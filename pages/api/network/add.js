import { withSessionRoute } from "../../../lib/withSession";
import NetworkModel from "../../../models/network";

export default withSessionRoute(loginRoute);

async function loginRoute(req, res) {
	try {
		const { user } = req.session;

		if (!user) {
			throw new Error("Unathorized");
		}

		const { name, denomination } = req.body;

		const networkExist = await NetworkModel.findOne({ name });

		if (networkExist) throw new Error("Network already added");

		const denominationList = denomination.split(", ");

		const network = await NetworkModel.create({
			name,
			denominations: denominationList,
		});

		res.send({ ok: true, network });
	} catch (error) {
		res.status(400).send({ ok: false, message: error.message });
	}
}
