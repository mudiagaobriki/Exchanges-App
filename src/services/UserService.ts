import axios from "axios";

const getProfileDetails = async () => {
	return await axios.get("user/profile")
		.then(response => response.data.data);
};

const updateProfileDetailsVerifyOTP = async (OTP: string) => {
	return await axios.post("sms-verification-confirm/profile/"+OTP, {})
		.then(response => response.data);
};

const updateProfileDetails = async (data: object) => {
	return await axios.post("user/profile", data)
		.then(response => response.data);
};

const getAccountVerificationStatus = async () => {
	return await axios.get("user/account-verification/status")
		.then(response => response.data);
}

const accountVerification = async (data: any) => {
	/*{
		action,
		bvn_number,
		id_proof,
		id_proof_with_selfie,
		address_proof,
	}*/
	return await axios.post("user/account-verification", data).then(response => {
		return response.data;
	});
};

export default {
	getProfileDetails,
	updateProfileDetailsVerifyOTP,
	updateProfileDetails,
	getAccountVerificationStatus,
	accountVerification
}
