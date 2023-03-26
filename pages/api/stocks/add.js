import { withSessionRoute } from "../../../lib/withSession";
import NetworkModel from "../../../models/network";
import AccountingRecordModel from "../../../models/account-record";
import StockModel from "../../../models/stock";

export default withSessionRoute(addRoute);

async function addRoute(req, res) {
	try {
		const { user } = req.session;

		if (!user) {
			throw new Error("Unathorized");
		}

		const { entries } = req.body;

		if (!entries.length) throw new Error("Entries cannot be empty");

		const records = [];

		for (const entry of entries) {
			let accountingRecord = await AccountingRecordModel.findOne({
				_userId: user.id,
				_networkId: entry.network,
				_networkDenomination: entry.denomination,
			});

			let stock = await StockModel.findOne({
				_userId: user.id,
				_networkId: entry.network,
				_networkDenomination: entry.denomination,
			});

			if (accountingRecord) {
				accountingRecord.addedStock += Number(entry.quantity);
				stock.quantity += Number(entry.quantity);
				await accountingRecord.save();
				await stock.save();

				//  add to transaction record
			} else {
				accountingRecord = await AccountingRecordModel.create({
					_userId: user.id,
					_networkId: entry.network,
					_networkDenomination: entry.denomination,
					addedStock: entry.quantity,
				});

				stock = await StockModel.create({
					_accountingRecordsId: accountingRecord.id,
					_userId: user.id,
					_networkId: entry.network,
					_networkDenomination: entry.denomination,
					quantity: entry.quantity,
				});
				// add to transaction record
			}

			const network = await NetworkModel.findById(
				accountingRecord._networkId
			);

			records.push({
				_id: accountingRecord.id,
				stock: `${network.name} ${accountingRecord._networkDenomination}`,
				addedStock: accountingRecord.addedStock,
				closingStock: accountingRecord.closingStock,
				openingStock: accountingRecord.openingStock,
				soldStock: accountingRecord.soldStock,
			});
		}

		res.send({ ok: true, records });
	} catch (error) {
		res.status(400).send({ ok: false, message: error.message });
	}
}
