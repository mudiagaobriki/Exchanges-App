import axios from "axios";


const getInfo = async () => {
	return await axios.get("wallet/info", {
		// @ts-ignore
		hideLoading: true
	}).then(response => {
		return response.data;
	});
};

const getBalances = async () => {
	return await axios.get("wallet/balances", {
		// @ts-ignore
		hideLoading: true
	}).then(response => {
		// console.log('response.data.balances', response.data.data.balances)
		return response.data;
	});
};

const getOrderPaymentMethod = async (_for: string, currency_code: string, bank_id: string) => {
	return await axios.post("wallet/order-payment-method", {
		for: _for,
		currency_code,
		bank_id
	}, {
		// @ts-ignore
		hideLoading: true
	}).then(response => {
		// console.log('response.data.balances', response.data.data.balances)
		return response.data?.payment_method;
	});
};

const getOrders = async () => {
	return await axios.get("wallet/orders", {
		// @ts-ignore
		hideLoading: true
	}).then(response => {
		return response.data.data;
	});
};

const getOrdersDt = async () => {
	return await axios.get("wallet/dt-orders", {
		// @ts-ignore
		hideLoading: true
	}).then(response => {
		console.log("Transaction History: ", response.data.data)
		return response.data.data;
	});
};

const getCryptoDepositHistory = async () => {
	return await axios.get("wallet/crypto/deposit-history", {
		// @ts-ignore
		hideLoading: true
	}).then(response => {
		return response.data.data;
	});
};

const getOrderDetail = async (orderId: number) => {
	return await axios.get("wallet/view-order/"+orderId, {
		// @ts-ignore
		hideLoading: true
	}).then(response => {
		return response.data.data;
	});
};

const getOrder = async (orderId: string|number|null) => {
	return await axios.get("wallet/orders/"+orderId, {
		// @ts-ignore
		hideLoading: true
	}).then(response => {
		return response.data;
	});
};

const getBTRs = async () => {
	return await axios.get("wallet/btr", {
		// @ts-ignore
		hideLoading: true
	}).then(response => {
		return response.data.data;
	});
};

const getBWRs = async () => {
	return await axios.get("wallet/bwr", {
		// @ts-ignore
		hideLoading: true
	}).then(response => {
		return response.data.data;
	});
};

const getDepositDetails = async () => {
	return await axios.get("settings/deposit-info/app", {
		// @ts-ignore
		hideLoading: true
	}).then(response => {
		return response.data;
	});
};

const getBanks = async (currency_code: string) => {
	return await axios.get(`wallet/banks/withdraw/${currency_code}`, {
		// @ts-ignore
		hideLoading: true
	}).then(response => {
		return response.data;
	});
};

const getBanksDeposit = async (currency_code: string) => {
	return await axios.get(`wallet/banks/deposit/${currency_code}`, {
		// @ts-ignore
		hideLoading: true
	}).then(response => {
		return response.data;
	});
};

const sendBankTransferRequest = async (currency_code: string, message: string, reference_number: string, amount: string) => {
	return await axios.post("wallet/send-bank-transfer-request", {
		currency_code,
		message,
		reference_number,
		amount,
	})
	.then(response => {
		return response.data.data;
	});
};

const depositMoney = async (asset: string, amount: string, bank_id: string, account_name: string, account_number: string,
							code:string = "") => {
	return await axios.post("wallet/deposit-money", {
		account_name,
		account_number,
		amount,
		asset,
		bank_id,
		code,
	})
		.then(response => {
			return response.data;
		});
};

const transferMoney = async (currency_from: string, currency_to: string, email: string, amount: string) => {
	return await axios.post("wallet/transfer-money", {
		currency_from,
		currency_to,
		email,
		amount,
	})
	.then(response => {
		return response.data.data;
	});
};

const withdrawMoney = async (args: object) => {
	const data = Object.assign({
		currency_from: "",
		currency_to: "",
		bank_id: "",
		account_name: "",
		account_number: "",
		amount: "",
		account_country: ""
	}, args)
	return await axios.post("wallet/withdraw-money", data).then(response => {
		return response.data.data;
	});
};

const addBeneficiary = async (args: object) => {
	const data = Object.assign({
		account_name: "",
		account_number: "",
		bank_id: "",
		currency: "",
		deposit: 1
	}, args)
	return await axios.post("wallet/beneficiaries/save", data).then(response => {
		return response.data.data;
	});
};

const getAllBeneficiaries = async () => {
	return await axios.get("wallet/beneficiaries/get/all", {
		// @ts-ignore
		hideLoading: true
	}).then(response => {
		return response.data;
	});
};

const deleteBeneficiary = async (id: number) => {
	return await axios.get(`wallet/beneficiaries/delete/${id}`, {
		// @ts-ignore
		hideLoading: true
	}).then(response => {
		return response.data;
	});
};

const exchangeMoney = async (args: object) => {
	const data = Object.assign({
		currency_from: "",
		currency_to: "",
		amount: ""
	}, args)
	return await axios.post("wallet/exchange-money", data).then(response => {
		return response.data.data;
	});
};

const verifyBankAccount = async (currency: string, bank_id: string, account_number: string) => {
	return await axios.post("wallet/verify-bank-account", {
		currency,
		bank_id,
		account_number,
	},{
		// @ts-ignore
		hideLoading: true
	})
		.then(response => {
			return response.data;
		});
};


/*
 * Crypto (start)
*/
const getCryptoInfo = async () => {
	return await axios.get("wallet/crypto/info", {
		// @ts-ignore
		hideLoading: true
	}).then(response => {
		return response.data;
	});
};

const cryptoWithdraw = async (asset: string, address: string, address_tag: string, amount: string) => {
	return await axios.post("wallet/crypto/withdraw", {
		asset,
		address,
		address_tag,
		amount,
	}).then(response => {
		return response.data;
	});
};

const cryptoBuy = async (asset: string, amount: string) => {
	return await axios.post("wallet/crypto/buy", {
		asset,
		amount,
	}).then(response => {
		return response.data;
	});
};

const cryptoSell = async (asset: string, amount: string) => {
	return await axios.post("wallet/crypto/sell", {
		asset,
		amount,
	}).then(response => {
		return response.data;
	});
};

const getCryptoOrders = async () => {
	return await axios.get("wallet/crypto/orders", {
		// @ts-ignore
		hideLoading: true
	}).then(response => {
		return response.data.data;
	});
};

export default {
	getOrderPaymentMethod,
	getInfo,
	getBalances,
	getOrders,
	getOrdersDt,
	getOrder,
	getOrderDetail,
	getBTRs,
	getBWRs,
	getCryptoDepositHistory,
	getDepositDetails,
	getBanks,
	sendBankTransferRequest,
	transferMoney,
	withdrawMoney,
	exchangeMoney,
	depositMoney,
	verifyBankAccount,
	// Crypto (START)
	getCryptoInfo,
	cryptoWithdraw,
	cryptoBuy,
	cryptoSell,
	getCryptoOrders,
	getBanksDeposit,
	addBeneficiary,
	getAllBeneficiaries,
	deleteBeneficiary,
};
