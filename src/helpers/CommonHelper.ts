import {Alert, Clipboard, Platform, ToastAndroid} from "react-native";
import Moment from 'moment';

export const lightenDarkenColor = (colorCode: string, amount: number) => {
  var usePound = false;

  if (colorCode[0] == "#") {
    colorCode = colorCode.slice(1);
    usePound = true;
  }

  var num = parseInt(colorCode, 16);

  var r = (num >> 16) + amount;

  if (r > 255) {
    r = 255;
  } else if (r < 0) {
    r = 0;
  }

  var b = ((num >> 8) & 0x00ff) + amount;

  if (b > 255) {
    b = 255;
  } else if (b < 0) {
    b = 0;
  }

  var g = (num & 0x0000ff) + amount;

  if (g > 255) {
    g = 255;
  } else if (g < 0) {
    g = 0;
  }

  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
};

export const convertJsNativeDateToStringDate = (date: Date, date_only = true) => {
  let result = JSON.stringify(date);
  return date_only ? Moment(date).format('DD/MM/YYYY'): result.slice(1,20).replace('T', ' ');
  // formatDate(, result.slice(1,11))
}

export const toast = (msg: string) => {
	if (Platform.OS === 'android') {
		ToastAndroid.show(msg, ToastAndroid.SHORT)
	} else {
		Alert.alert(msg);
	}
}

export const copyText = (text: string) => {
	Clipboard.setString(text)
	toast("Copied.")
}

export const axiosApiErrorAlert = (axios_error: any) => {

	const data = axios_error?.response?.data;
  const error = axios_error?.response?.error;

  if(typeof data === 'object'){
		let alert_text = '';
    let message = data.message;
    let errors = data.errors;
    if(errors) {
      for (const error in errors) {
        for (const error2 in errors[error]) {
          alert_text += errors[error][error2] + '\n'
        }
      }
    }
    Alert.alert(
      message,
      alert_text,
    );
  }
	else if(error){
    Alert.alert(error);
  }
	else{
		Alert.alert(axios_error.toString());
	}
};

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
export const Base64 = {
	btoa: (input:string = '')  => {
		let str = input;
		let output = '';

		for (let block = 0, charCode, i = 0, map = chars;
		     str.charAt(i | 0) || (map = '=', i % 1);
		     output += map.charAt(63 & block >> 8 - i % 1 * 8)) {

			charCode = str.charCodeAt(i += 3/4);

			if (charCode > 0xFF) {
				throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
			}

			block = block << 8 | charCode;
		}

		return output;
	},

	atob: (input:string = '') => {
		let str = input.replace(/=+$/, '');
		let output = '';

		if (str.length % 4 == 1) {
			throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
		}
		for (let bc = 0, bs = 0, buffer, i = 0;
		     buffer = str.charAt(i++);

		     ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
		     bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
		) {
			buffer = chars.indexOf(buffer);
		}

		return output;
	}
};

export const formatMoney = (amount: number, decimals: number, separator = '.', thousandSeparator = ',') => {
	/*decimals = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
	let s = amount < 0 ? "-" : "";
	amount = Math.abs(Number(amount) || 0);
	let	i = amount.toFixed(decimals);
	let j;
	j = (j = i.length) > 3 ? j % 3 : 0;
	return (s + (j ? i.substr(0, j) + thousandSeparator : "") + i
		.substr(j)
		.replace(/(\separator{3})(?=\separator)/g, "$1" + thousandSeparator) + (
			decimals ? separator +
				Math.abs(amount - parseInt(i))
			.toFixed(decimals)
			.slice(2) :
				0
		));*/
	// var decimals = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals,
	// 	separator = separator == undefined ? "." : separator,
	// 	thousandSeparator = thousandSeparator == undefined ? "," : thousandSeparator,
	// 	s = amount < 0 ? "-" : "",
	// 	i = String(amount = Number(Math.abs(Number(amount) || 0).toFixed(decimals))),
	// 	j;
	// j = (j = i.length) > 3 ? j % 3 : 0;
	// return s + (j ? i.substr(0, j) + thousandSeparator : "") + i.substr(j).replace(/(\separator{3})(?=\separator)/g, "$1" + thousandSeparator) + (decimals ? separator + Math.abs(amount - Number(i)).toFixed(decimals).slice(2) : "");

	decimals = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
	separator = separator == undefined ? "." : separator;
	thousandSeparator = thousandSeparator == undefined ? "," : thousandSeparator;
	const s = amount < 0 ? "-" : "";
	let i = String(parseInt(String(amount = Number(Math.abs(Number(amount) || 0).toFixed(decimals)))));
	let j;
	j = (j = i.length) > 3 ? j % 3 : 0;
	return s +
		(j ? i.substr(0, j) + thousandSeparator : "") +
		i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousandSeparator) +
		(decimals ? separator + Math.abs(amount - Number(i)).toFixed(decimals).slice(2) : "");
}

export const toFixedDown = (digits:number) => { // remove extra decimals
	const re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)");
	const m = digits.toString().trim().match(re);
	let number = m ? parseInt(m[1]) : digits.valueOf();
	// number = parseFloat(number);
	if (isNaN(number)){
		number = 0;
	}
	return number;
};

export const parseDecimalNumber = (value:string, decimal:number) => { // remove extra decimals
	value = value.replace(/[^0-9.]/g, '')
	if(value.split(".").length > 2){
		return String(parseFloat(value))
	}
	const firstZeroIndex = String(value).indexOf('0', 0);
	const firstDotIndex = String(value).indexOf('.', 0);
	const secondDotIndex = String(value).indexOf('.', 1);

	if(firstZeroIndex === 0 && secondDotIndex !== 1){
		return String(parseFloat(value))
	}
	if(firstDotIndex === 0){
		return String("")
	}
	const lastIsDot = String(value).slice(-1) === '.';
	let re = new RegExp("(\\d+\\.\\d{" + decimal + "})(\\d)")
	let m = value.toString().match(re);
	let m2 = m ? parseFloat(m[1]) : value.valueOf();
	if (lastIsDot && typeof m2 === "string") {
		m2 = parseFloat(m2)
	}
	return lastIsDot ? String(m2) + '.' : String(m2);
};

export const mf = (amount: string|number, currency = '', _arg = {}) => { // Money Format
	const arg = {...{
			decimal: 2,
			extra_decimal: true,
			is_symbol: false,
			currency_before: true,
			include_comma: true
		}, ..._arg};
	amount = formatMoney(Number(amount), arg.decimal, '.', arg.include_comma ? ',': '' );
	if(!arg.extra_decimal){
		amount = toFixedDown(Number(amount));
	}
	if(currency){
		currency = currency.toUpperCase();
	}
	if(arg.currency_before){
		return currency + (arg.is_symbol ? '' : ' ') + amount;
	}else{
		return amount + (arg.is_symbol ? '' : ' ') + currency;
	}
}

export const getFileExtension = (path: string) => {
	// extract file name from full path ...
	// (supports `\\` and `/` separators)
	const basename = path.split(/[\\/]/).pop() || "";
	// get last position of `.`
	const pos = basename.lastIndexOf(".");

	// if file name is empty or ...
	if (basename === "" || pos < 1)
		//  `.` not found (-1) or comes first (0)
		return "";

	// extract extension ignoring `.`
	return basename.slice(pos + 1);
}

export const getMimeType = (ext: string) => {
	// mime type mapping for few of the sample file types
	switch (ext) {
		case 'pdf': return 'application/pdf';
		case 'jpg': return 'image/jpeg';
		case 'jpeg': return 'image/jpeg';
		case 'png': return 'image/png';
	}
}
