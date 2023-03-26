import { withSessionRoute } from "../../../lib/withSession";
import SalesModel from "../../../models/sales";
import AccountingRecordModel from "../../../models/account-record";
import NetworkModel from "../../../models/network";

export default withSessionRoute(addRoute);

async function addRoute(req, res) {
	try {
		const { user } = req.session;

		if (!user) {
			throw new Error("Unathorized");
		}

		const { sale, c_name, c_type, payment_method, total } = req.body;

		const items = [];

		for (const s of sale) {
			const account = await AccountingRecordModel.findOne({
				_userId: user.id,
				_networkId: s.network,
				_networkDenomination: s.denomination,
			});
			const availableStock =
				account.openingStock + account.addedStock - account.soldStock;

			if (s.quantity > availableStock) {
				const network = await NetworkModel.findById(s.network);

				throw new Error(
					`${network.name} ${s.denomination} is out of stock`
				);
			}

			items.push({
				_networkId: s.network,
				_networkDenomination: s.denomination,
				quantity: s.quantity,
				amount: s.amount,
			});

			account.soldStock += Number(s.quantity);

			await account.save();
		}

		// console.log(req.body);

		await SalesModel.create({
			_userId: user.id,
			custormer: c_name,
			custormer_type: c_type,
			items,
			payment_type: payment_method,
			total,
		});

		res.send({ ok: true });
	} catch (error) {
		res.status(400).send({ ok: false, message: error.message });
	}
}
