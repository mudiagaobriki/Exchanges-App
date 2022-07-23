import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { UserModel } from "../models";

const login = async (
  email: string,
  otp: string,
  password: string
): Promise<UserModel> => {
  try {
    const result = await axios.post("login", {
      email,
      otp,
      password,
    });

    // console.log('Error33146:', JSON.stringify(result));
    if (result?.data?.error) {
      return Promise.reject(Error(result.data.error.message));
    }

    // console.log('Error21190', result.data.token)
    await AsyncStorage.setItem('token', result.data.token);
    await AsyncStorage.setItem('country', result.data.user.country_code);

    await AsyncStorage.multiSet([
      ["User", JSON.stringify(result.data.user)],
      ["AccessToken", result.data.token],
    ]);

    const d = await AsyncStorage.multiGet(["User", "AccessToken"]);
    // console.log('Error32689', d);

    return Promise.resolve(result.data.user);
  } catch (error) {
    // console.log('Error5324:', JSON.stringify(error.response));
    if (error?.response?.data?.error) {
      // console.log('Error5414:', error, JSON.stringify(error));
      return Promise.reject({message: error.response.data.error});
    }else{
      // console.log('Error2233:', error, JSON.stringify(error));
      return Promise.reject(error);
    }
    // console.log('Error32145:', error, JSON.stringify(error), error.response.data.error);
  }
};

const otp = async (
  method: string,
  data?: object,
): Promise<any> => {
  try {
    const result = await axios.post(`sms-verification/${method}`, data || {});
    if (result?.data?.error) {
      return Promise.reject(Error(result.data.error.message));
    }
    return Promise.resolve(result.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

const verifyOTP = async (method: string, otp: string): Promise<any> => {
	try {
		const result = await axios.post(`sms-verification-confirm/${method}/${otp}`);
		if (result?.data?.error) {
			return Promise.reject(Error(result.data.error.message));
		}
		return Promise.resolve(result.data);
	} catch (error) {
		return Promise.reject(error);
	}
};

const register = async (
  name: string,
  // username: string,
  email: string,
  // gender: string,
  country: string,
  mobile_number: string,
  otp: string,
  // dob: Date,
  password: string,
  password_confirmation: string
): Promise<UserModel> => {
  try {
    const result = await axios.post("register", {
      name,
      // username,
      email,
      // gender,
      country,
      mobile_number,
      otp,
      // dob,
      password,
      password_confirmation,
    });

    if (result?.data?.error) {
      return Promise.reject(Error(result.data.error.message));
    }

    await AsyncStorage.multiSet([
      ["User", JSON.stringify(result.data.user)],
      ["AccessToken", result.data.token],
    ]);

    return Promise.resolve(result.data.user);
    // -------------------------
  } catch (error) {
    return Promise.reject(error);
  }
};


// const register = (
//   name: string,
//   email: string,
//   gender: string,
//   country: string,
//   mobile_number: string,
//   otp: string,
//   dob: Date,
//   password: string,
//   password_confirmation: string
// ) => {
//   console.log("Name: ", name)
//   console.log("Email: ", email)
//   console.log("Gender: ", gender)
//   console.log("Country: ", country)
//   console.log("Mobile Number: ", mobile_number)
//   console.log("otp: ", otp)
//   console.log("Date of Birth: ", dob)
//   console.log("Password ", password)
//   console.log("Password Confirmation: ", password_confirmation)
// }

const forgotPassword = async (email: string): Promise<any> => {
  try {
    const result = await axios.post(`send-forgot-password-email`, {email});
    if (result?.data?.error) {
      return Promise.reject(Error(result.data.error.message));
    }
    return Promise.resolve(result.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getCountries = async (): Promise<any> => {
  try {
    const result = await axios.get("get-countries");
    if (result?.data?.error) {
      return Promise.reject(Error(result.data.error.message));
    }
    if (result?.data?.error) {
      return Promise.reject(Error(result.data.error.message));
    }
    return Promise.resolve(result.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

const sendEmailVerification = async (email: string): Promise<any> => {
  try {
    const result = await axios.post(`sms-verification/email_verification`)
    console.log("From Auth Email Verification: ", result)
  }
  catch (error) {
    return Promise.reject(error);
  }
}

const confirmEmailVerification = async (user: any, otp: string): Promise<any> => {
  try {
    const result = await axios.post(`${user}/verify-email-by-otp/${otp}`)
    console.log("From Auth Email Verification: ", result.data)
    return result.data
  }
  catch (error) {
    return Promise.reject(error);
  }
}

export default {
  login,
  otp,
  verifyOTP,
  register,
  forgotPassword,
  getCountries,
  sendEmailVerification,
  confirmEmailVerification
};
