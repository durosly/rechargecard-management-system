import "../styles/globals.css";
import useToast from "../hook/useToast";
import AppContext from "../store/AppContext";
import Toast from "../components/layout/toast";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }) {
	const toast = useToast();
	return (
		<AppContext.Provider value={{ toast }}>
			<Component {...pageProps} />
			<Toast />

			<Toaster />
		</AppContext.Provider>
	);
}
