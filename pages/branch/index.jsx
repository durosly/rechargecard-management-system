import Link from "next/link";
import React from "react";
import AdminWrapper from "../../components/layout/admin/layout/adminWrapper";
import { stringifyDoc } from "../../lib";
import { withSessionSsr } from "../../lib/withSession";
import BranchModel from "../../models/branch";

function Branch({ branches }) {
	return (
		<AdminWrapper>
			<div className="mb-5">
				<Link
					className="btn btn-primary"
					href="/staffs/add-branch"
				>
					Add Branch
				</Link>
			</div>
			<div className="overflow-x-auto">
				<table className="table w-full">
					<thead>
						<tr>
							<th></th>
							<th>Name</th>
							<th>Address</th>
						</tr>
					</thead>
					<tbody>
						{branches &&
							branches.map((b, i) => (
								<tr key={b._id}>
									<td>{i + 1}</td>
									<td>{b.name}</td>
									<td>{b.address}</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</AdminWrapper>
	);
}

export default Branch;

export const getServerSideProps = withSessionSsr(
	async function getServerSideProps({ req }) {
		const user = req.session.user;

		if (!user && user.type !== "admin") {
			return {
				redirect: {
					destination: "/",
					permanent: false,
				},
			};
		}

		const branches = await BranchModel.find({});

		return {
			props: {
				user,
				branches: stringifyDoc(branches),
			},
		};
	}
);
