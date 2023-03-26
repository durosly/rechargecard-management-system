import { useState, useContext } from "react";
import axios from "axios";
import AppContext from "../../store/AppContext";
import AddStockModal from "../../components/add-stock-modal";
import AddNetworkModal from "../../components/layout/admin/add-network-modal";
import AdminWrapper from "../../components/layout/admin/layout/adminWrapper";
import AccountingRecordModel from "../../models/account-record";
import NetworkModel from "../../models/network";
import { withSessionSsr } from "../../lib/withSession";
import { stringifyDoc } from "../../lib";

function Inventory({ user, networks, records }) {
	const {
		toast: { showToast },
	} = useContext(AppContext);
	const [isLoading, setIsLoading] = useState(false);

	const [showAddNetworkModal, setShowAddNetworkModal] = useState(false);
	const [showAddStockModal, setShowAddStockModal] = useState(false);
	const [data, setData] = useState(records);

	async function closeAccount() {
		// e.preventDefault();
		if (isLoading) return;
		setIsLoading(true);

		try {
			const status = await axios.post("/api/account/close");

			if (status.data.ok) {
				showToast({
					alert_type: "success",
					message: "Staff added successfully",
				});

				setIsLoading(false);

				// toggler(false);
			} else {
				throw new Error(response.data.message);
			}
		} catch (error) {
			let errorMsg = "";

			if (error?.response) {
				errorMsg = error.response.data.message;
			} else {
				errorMsg = error.message;
			}

			// console.log(error);
			setIsLoading(false);
			showToast({
				alert_type: "danger",
				message: errorMsg,
			});
		}
	}
	return (
		<AdminWrapper>
			<h2>Inventory</h2>
			<div className="space-x-4">
				{/* 
					load modal with closing stock of previous day from DB
				*/}

				<label
					htmlFor="add-stock-modal"
					className="btn btn-primary"
				>
					Add stock
				</label>
				{user.type === "admin" && (
					<label
						htmlFor="add-network-modal"
						className="btn btn-primary"
					>
						Add Network
					</label>
				)}
				{/* <button className="btn btn-info">Add stock</button> */}
				<button
					onClick={closeAccount}
					className="btn btn-secondary"
				>
					Closing stock
				</button>
			</div>
			<div className="overflow-x-auto">
				<table className="table table-zebra w-full">
					<thead>
						<tr>
							<th>Stock</th>
							<th>Opening</th>
							<th>Added</th>
							<th>Sold</th>
							<th>Close</th>
						</tr>
					</thead>
					<tbody>
						{data.map((r) => (
							<tr key={r._id}>
								<th>{r.stock}</th>
								<td>{r.openingStock}</td>
								<td>{r.addedStock}</td>
								<td>{r.soldStock}</td>
								<td>{r.closingStock}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* The button to open modal */}

			<AddStockModal
				state={showAddStockModal}
				toggler={setShowAddStockModal}
				networks={networks}
				data={data}
				setData={setData}
			/>

			{/* add network modal */}
			{user.type === "admin" && (
				<AddNetworkModal
					state={showAddNetworkModal}
					toggler={setShowAddNetworkModal}
				/>
			)}
		</AdminWrapper>
	);
}

export default Inventory;

export const getServerSideProps = withSessionSsr(
	async function getServerSideProps({ req }) {
		const user = req.session.user;

		if (!user) {
			return {
				redirect: {
					destination: "/",
					permanent: false,
				},
			};
		}

		// todo: refactor to use luxon library
		const todaysDate = new Date();
		const year = todaysDate.getFullYear();
		const month = todaysDate.getMonth() + 1;
		const day = todaysDate.getDate();

		const dateQuery = `${year}-${month}-${day} 00:00:00`;
		// todo: end

		const networks = await NetworkModel.find({});

		const records = [];

		for (const network of networks) {
			for (const demomination of network.denominations) {
				let accountingRecords = await AccountingRecordModel.findOne({
					updated_at: { $gte: dateQuery },
					_networkId: network.id,
					_networkDenomination: demomination,
				});

				if (accountingRecords) {
					records.push({
						_id: accountingRecords.id,
						stock: `${network.name} ${accountingRecords._networkDenomination}`,
						addedStock: accountingRecords.addedStock,
						closingStock: accountingRecords.closingStock,
						openingStock: accountingRecords.openingStock,
						soldStock: accountingRecords.soldStock,
					});
				} else {
					// calculate opening stock using previous day closing stock

					accountingRecords = await AccountingRecordModel.findOne({
						_networkId: network.id,
						_networkDenomination: demomination,
					});

					// ! close stock here

					if (accountingRecords) {
						accountingRecords.openingStock =
							accountingRecords.closingStock;

						accountingRecords.closingStock = 0;
						await accountingRecords.save();

						records.push({
							_id: accountingRecords.id,
							stock: `${network.name} ${accountingRecords._networkDenomination}`,
							addedStock: accountingRecords.addedStock,
							closingStock: accountingRecords.closingStock,
							openingStock: accountingRecords.openingStock,
							soldStock: accountingRecords.soldStock,
						});
					}
				}
			}
		}

		return {
			props: {
				user,
				networks: stringifyDoc(networks),
				records,
			},
		};
	}
);
