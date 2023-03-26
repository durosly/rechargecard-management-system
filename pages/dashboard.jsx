import { useState } from "react";
import { DateTime } from "luxon";
import AdminWrapper from "../components/layout/admin/layout/adminWrapper";
import { withSessionSsr } from "../lib/withSession";
import Stats from "../components/dashboard/stats";
import EmployeeStats from "../components/dashboard/employee-stats";

function Dashboard() {
	const [date, setDate] = useState(DateTime.now().toFormat("kkkk-MM"));

	return (
		<AdminWrapper>
			<div>
				<input
					type="month"
					name="month"
					id="month"
					className="input input-bordered"
					value={date}
					onChange={(e) => setDate(e.target.value)}
				/>
			</div>
			<Stats date={date} />
			<div className="divider"></div>
			<EmployeeStats />
		</AdminWrapper>
	);
}

export default Dashboard;

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

		return {
			props: {
				user,
			},
		};
	}
);
