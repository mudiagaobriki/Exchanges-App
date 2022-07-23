import axios from "axios";

const getConfig = async () => {
	return await axios.get("get-system-config", {
		// @ts-ignore
		hideLoading: true
	})
		.then(response => {
			return response.data;
		});
};


const getCurrencies = async () => {
	return await axios.get("get-currencies", {
		// @ts-ignore
		hideLoading: true
	}).then(response => {
		return response.data.map((code: string) => {
			return {code}
		});
	});
};

export default {
	getConfig,
	getCurrencies,
};
