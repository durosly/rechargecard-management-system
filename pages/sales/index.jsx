import { useState, useEffect, useRef, useContext } from "react";
import AdminWrapper from "../../components/layout/admin/layout/adminWrapper";
import { stringifyDoc } from "../../lib";
import { withSessionSsr } from "../../lib/withSession";
import NetworkModel from "../../models/network";
import BranchModel from "../../models/branch";
import RateModel from "../../models/rates";
import UserModel from "../../models/user";
import AppContext from "../../store/AppContext";
import axios from "axios";

function Sales({ rates, networks }) {
	// const [change,  setChange] = useState(false)
	const {
		toast: { showToast },
	} = useContext(AppContext);
	const [isLoading, setIsLoading] = useState(false);
	const [saleInfo, setSalesInfo] = useState({
		c_name: "",
		c_type: "",
		sale: [{ quantity: "", network: "", denomination: "", amount: "" }],
		total: "",
		payment_method: "",
	});

	const saleSizeRef = useRef(saleInfo.sale.length);

	function handleSelection({ value, i }) {
		const split = value.split("--");
		const entry = saleInfo.sale[i];
		entry.network = split[0];
		entry.denomination = split[1];

		const newEntries = saleInfo.sale.map((e, j) => {
			if (i === j) {
				return entry;
			}

			return e;
		});

		setSalesInfo({ ...saleInfo, sale: newEntries });
	}

	function addNewField() {
		setSalesInfo({
			...saleInfo,
			sale: [
				...saleInfo.sale,
				{ quantity: "", network: "", denomination: "", amount: "" },
			],
		});
	}

	function removeField(i) {
		const newEntries = saleInfo.sale.filter((e, j) => i !== j);
		setSalesInfo({ ...saleInfo, sale: newEntries });
	}

	function handleQuantityUpdate({ value, i }) {
		const newEntries = saleInfo.sale.map((e, j) => {
			if (i === j) {
				e.quantity = value;
			}

			return e;
		});

		setSalesInfo({ ...saleInfo, sale: newEntries });
	}

	useEffect(() => {
		calculateAccount();
	});

	function calculateAccount() {
		let change = false;
		const newSale = saleInfo.sale.map((s) => {
			if (s.quantity && s.network && s.denomination && saleInfo.c_type) {
				const rateIndex = rates.findIndex(
					(n) =>
						n._networkId === s.network && n.type === saleInfo.c_type
				);
				if (rateIndex > -1) {
					const rate = rates[rateIndex].amount;

					const amount = (s.denomination / 100) * s.quantity * rate;

					if (s.amount !== amount) {
						change = true;
						s.amount = amount;
					}
				}
			}

			return s;
		});

		if (saleSizeRef.current !== saleInfo.sale.length) {
			change = true;
			saleSizeRef.current = saleInfo.sale.length;
		}

		if (change !== false) {
			const total = newSale.reduce((prev, curr) => curr.amount + prev, 0);

			console.log(total);
			// setSalesInfo({ ...saleInfo, total });
			setSalesInfo({ ...saleInfo, sale: newSale, total });
		}
	}

	async function addSales(e) {
		e.preventDefault();

		if (isLoading) return;
		setIsLoading(true);

		try {
			const status = await axios.post(`/api/sales/add`, saleInfo);
			if (status.data.ok) {
				showToast({
					alert_type: "success",
					message: "Sales added successfully",
				});

				setIsLoading(false);
				setSalesInfo({
					c_name: "",
					c_type: "",
					sale: [
						{
							quantity: "",
							network: "",
							denomination: "",
							amount: "",
						},
					],
					total: "",
					payment_method: "",
				});
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

	// console.log(rates);
	return (
		<AdminWrapper>
			<h2>Sales page</h2>
			<form
				action="/sales-new"
				onSubmit={addSales}
			>
				<div className="form-control w-full max-w-xs">
					<label className="label">customer name</label>
					<input
						type="text"
						placeholder="Type here"
						className="input input-bordered w-full max-w-xs"
						name="c_name"
						value={saleInfo.c_name}
						onChange={(e) =>
							setSalesInfo({
								...saleInfo,
								[e.target.name]: e.target.value,
							})
						}
					/>
				</div>
				<div className=" w-full max-w-xs  mt-5">
					<p>Customer type</p>
					<div className="flex gap-5">
						<label
							className=" flex item-center gap-2"
							htmlFor="radio-1"
						>
							<span>Bulk</span>
							<input
								type="radio"
								className="radio"
								checked={saleInfo.c_type === "bulk"}
								name="c_type"
								value="bulk"
								onChange={(e) =>
									setSalesInfo({
										...saleInfo,
										[e.target.name]: e.target.value,
									})
								}
							/>
						</label>
						<label
							className=" flex item-center gap-2"
							htmlFor="radio-2"
						>
							<span>Wholesales</span>
							<input
								type="radio"
								className="radio"
								name="c_type"
								value="wholesale"
								onChange={(e) =>
									setSalesInfo({
										...saleInfo,
										[e.target.name]: e.target.value,
									})
								}
							/>
						</label>
					</div>
				</div>
				<div className="mt-10">
					{saleInfo.sale.map((entry, i) => (
						<div
							key={i}
							className="flex gap-5 items-center"
						>
							<p className="flex-1">
								<label
									htmlFor="network"
									className="label"
								>
									Stock
								</label>
								<select
									id="network"
									className="select select-bordered w-full max-w-xs"
									value={`${entry.network}--${entry.denomination}`}
									onChange={(e) =>
										handleSelection({
											value: e.target.value,
											i,
										})
									}
								>
									<option
										value="--"
										disabled
									>
										--select network--
									</option>
									{networks.map((n) =>
										n.denominations.map((d) => (
											<option
												key={`${n._id}--${d}`}
												value={`${n._id}--${d}`}
											>
												{n.name} {d}
											</option>
										))
									)}
								</select>
							</p>
							<p className="flex-1">
								<label
									htmlFor="quantity"
									className="label"
								>
									Quantity
								</label>
								<input
									type="number"
									placeholder="Quantity..."
									className="input input-bordered w-full max-w-xs"
									value={entry.quantity}
									step="0.1"
									min="0.1"
									required
									onChange={(e) =>
										handleQuantityUpdate({
											value: e.target.value,
											i,
										})
									}
								/>
							</p>
							<div className="flex-1 flex flex-col justify-center mt-7">
								<p>Amount</p>
								<p className="font-bold italic">
									{entry?.amount || 0}
								</p>
							</div>
							<button
								onClick={() => removeField(i)}
								className="btn btn-error mt-7"
							>
								remove
							</button>
						</div>
					))}
					<div className="mt-5">
						<button
							onClick={() => addNewField()}
							className="btn btn-sm btn-accent"
						>
							<svg
								className="w-5 h-5 fill-current"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 448 512"
							>
								{/*! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. */}
								<path d="M240 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H176V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H240V80z" />
							</svg>
						</button>
					</div>
				</div>
				<div className="text-right space-x-4 pr-20">
					<span>Total:</span>
					<span className="font-bold text-xl">
						{saleInfo?.total || 0}
					</span>
				</div>
				<div className=" w-full max-w-xs  my-5">
					<p>Payment type</p>
					<div className="flex gap-5">
						<label
							className=" flex item-center gap-2"
							htmlFor="payment-1"
						>
							<span>POS</span>
							<input
								type="radio"
								name="payment"
								className="radio"
								id="payment-1"
								checked={saleInfo.payment_method === "POS"}
								onChange={() =>
									setSalesInfo({
										...saleInfo,
										payment_method: "POS",
									})
								}
							/>
						</label>
						<label
							className=" flex item-center gap-2"
							htmlFor="payment-2"
						>
							<span>Cash</span>
							<input
								type="radio"
								name="payment"
								className="radio"
								id="payment-2"
								checked={saleInfo.payment_method === "Cash"}
								onChange={() =>
									setSalesInfo({
										...saleInfo,
										payment_method: "Cash",
									})
								}
							/>
						</label>
						<label
							className=" flex item-center gap-2"
							htmlFor="payment-3"
						>
							<span>Bank Transfer</span>
							<input
								type="radio"
								name="payment"
								id="payment-3"
								className="radio"
								checked={
									saleInfo.payment_method === "Bank Transfer"
								}
								onChange={() =>
									setSalesInfo({
										...saleInfo,
										payment_method: "Bank Transfer",
									})
								}
							/>
						</label>
					</div>
				</div>
				<button className="btn btn-primary">Submit</button>
			</form>
		</AdminWrapper>
	);
}

export default Sales;

export const getServerSideProps = withSessionSsr(
	async function getServerSideProps({ req }) {
		const user = req.session.user;

		if (!user || user.type !== "staff") {
			return {
				redirect: {
					destination: "/",
					permanent: false,
				},
			};
		}

		const userInfo = await UserModel.findById(user.id);

		const branch = await BranchModel.findById(userInfo._branchId);

		const networks = await NetworkModel.find({});

		const rates = [];

		for (const n of networks) {
			// console.log(branch.id, n.id);
			const rate = await RateModel.find({
				_branchId: branch.id,
				_networkId: n.id,
			});

			if (rate) {
				rate.forEach((r) => {
					rates.push({
						_id: r.id,
						_networkId: r._networkId,
						amount: r.amount,
						type: r.type,
					});
				});
			}
		}

		return {
			props: {
				user,
				networks: stringifyDoc(networks),
				rates,
			},
		};
	}
);
