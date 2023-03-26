import AdminWrapper from "../../components/layout/admin/layout/adminWrapper";

import { withSessionSsr } from "../../lib/withSession";
import { stringifyDoc } from "../../lib/index";

import { DateTime } from "luxon";
import SalesModel from "../../models/sales";
import NetworkModel from "../../models/network";
import Link from "next/link";

function Accounting({ sales, networks }) {
	// const [change,  setChange] = useState(false)

	const quantityTotal = [];
	let priceTotal = 0;

	return (
		<AdminWrapper>
			<h2>Accounting page</h2>

			{/* <div className="form-control max-w-[500px] mx-auto">
				<label className="input-group justify-center">
					<input
						type="text"
						placeholder="Search customer name..."
						className="input input-sm input-bordered flex-1"
					/>
					<span>
						<button className="btn btn-sm btn-ghost">
							<svg
								className="w-3 h-3 fill-current"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 512 512"
							>
								
								<path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
							</svg>
						</button>
					</span>
				</label>
			</div> */}

			<div className="overflow-x-auto">
				<table className="table table-compact w-full">
					<thead>
						<tr>
							<th></th>
							<th>Customer</th>
							<th>Type</th>
							<th>Time</th>
							{networks.map((n) =>
								n.denominations.map((d) => (
									<th key={`${n._id}--${d}`}>
										{n.name} {d}
									</th>
								))
							)}
							<th>Total</th>
							<th>Payment type</th>
						</tr>
					</thead>
					<tbody className="max-h-[500px] overflow-y-auto">
						{sales.map((s, i) => {
							const dt = DateTime.fromISO(s.time);
							return (
								<tr>
									<th>{i + 1}</th>
									<td>{s.custormer}</td>
									<td>{s.custormer_type}</td>
									<td>
										{dt.toLocaleString(
											DateTime.TIME_SIMPLE
										)}
									</td>
									{s.quantity.map((q, j) => {
										if (
											quantityTotal[j] ||
											quantityTotal[j] === 0
										) {
											quantityTotal[j] += q;
										} else {
											quantityTotal[j] = q;
										}
										return <td key={j}>{q}</td>;
									})}
									<td>
										{(priceTotal += s.total) && s.total}
									</td>
									<td>{s.payment_type}</td>
								</tr>
							);
						})}
					</tbody>
					<tfoot>
						<tr>
							<th></th>
							<th></th>
							<th></th>
							<th className="text-red-500">Total</th>
							{quantityTotal.map((q) => (
								<td className="text-red-500">{q}</td>
							))}

							<th className="text-red-500">{priceTotal}</th>
							<th></th>
						</tr>
					</tfoot>
				</table>
			</div>

			<Link
				href="/inventory"
				className="btn btn-primary"
			>
				Close Account
			</Link>
		</AdminWrapper>
	);
}

export default Accounting;

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

		const data = [];
		const networkData = [];

		const sales = await SalesModel.find({});
		const networks = await NetworkModel.find({});

		for (const network of networks) {
			for (const d of network.denominations) {
				networkData.push({
					_id: `${network.name}--${d}`,
					name: `${network.name}--${d}`,
				});
			}
		}

		for (const sale of sales) {
			const quantity = [];
			for (const network of networks) {
				for (const d of network.denominations) {
					const item = sale.items.find(
						(i) =>
							i._networkId === network.id &&
							i._networkDenomination === d
					);

					// console.log(item);

					quantity.push(item?.quantity || 0);
				}
			}

			data.push({
				_id: sale._id,
				custormer: sale.custormer,
				custormer_type: sale.custormer_type,
				quantity,
				total: sale.total,
				payment_type: sale.payment_type,
				time: sale.created_at,
			});
		}

		// console.log(data);

		// console.log(networks);

		return {
			props: {
				user,
				networks: stringifyDoc(networks),
				sales: stringifyDoc(data),
			},
		};
	}
);
