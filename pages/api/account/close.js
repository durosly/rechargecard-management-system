import { withSessionRoute } from "../../../lib/withSession";
import AccountingRecordModel from "../../../models/account-record";

export default withSessionRoute(addRoute);

async function addRoute(req, res) {
	try {
		const { user } = req.session;

		if (!user) {
			throw new Error("Unathorized");
		}

		const accounts = await AccountingRecordModel.find({
			_userId: user.id,
			is_closed: false,
		});

		for (const account of accounts) {
			account.closingStock =
				Number(account.openingStock) +
				Number(account.addedStock) -
				Number(account.soldStock);
			account.is_closed = true;

			await account.save();
		}

		res.send({ ok: true, accounts });
	} catch (error) {
		res.status(400).send({ ok: false, message: error.message });
	}
}
