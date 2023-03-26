import { useEffect, useState } from "react";
import axios from "axios";

function Stats({ date }) {
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState({
		totalSales: 0,
		totalExpense: 0,
		totalIncome: 0,
	});

	useEffect(() => {
		async function loadStats() {
			try {
				const response = await axios(`/api/account/stat/${date}`);

				const { ok, stat, message } = response.data;

				if (ok) {
					setData(stat);
					console.log(stat);
				} else {
					throw new Error(message);
				}
			} catch (error) {
			} finally {
				setIsLoading(false);
			}
		}

		loadStats();
	}, [date]);

	return (
		<div className="stats shadow">
			<div className="stat">
				{isLoading ? (
					<>Loading...</>
				) : (
					<>
						<div className="stat-figure text-secondary">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								className="inline-block w-8 h-8 stroke-current"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
						</div>
						<div className="stat-title">TOTAL SALES</div>
						<div className="stat-value">{data.totalSales}</div>
					</>
				)}
			</div>

			<div className="stat">
				{isLoading ? (
					<>Loading...</>
				) : (
					<>
						<div className="stat-figure text-secondary">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								className="inline-block w-8 h-8 stroke-current"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
								></path>
							</svg>
						</div>
						<div className="stat-title">TOTAL EXPENSES</div>
						<div className="stat-value">{data.totalExpense}</div>
					</>
				)}
			</div>

			<div className="stat">
				{isLoading ? (
					<>Loading...</>
				) : (
					<>
						<div className="stat-figure text-secondary">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								className="inline-block w-8 h-8 stroke-current"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
								></path>
							</svg>
						</div>
						<div className="stat-title">INCOME</div>
						<div className="stat-value">{data.totalIncome}</div>
					</>
				)}
			</div>
		</div>
	);
}

export default Stats;
