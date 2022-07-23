import { LanguageModel } from "../models";

// export const BASE_URL = "http://publnews.polydesign3d.com/";
// export const BASE_URL = "http://192.168.1.2/topit/public/";
// export const BASE_URL = "http://efdcf37894cd.ngrok.io/";

// export const API_URL = "http://127.0.0.1:8000/transfy/api/v1";
// export const API_URL = "http://192.168.1.3:8000/api/v1";
// export const API_URL = "https://api.topit.africa/api/v1";
// export const API_URL = "https://ae7a-210-89-58-59.ngrok.io/api/v1";
// export const API_URL = "https://devhub.transfy.io/api/v1";
export const API_URL = "https://app.transfy.io/api/v1";
// export const IMAGES_URL = "https://ng.topit.africa/pub-uploaded-files/images/";

// DEV
// export const API_URL = "https://api.dev.topit.africa/mob/v1";
// export const IMAGES_URL = "https://ng.dev.topit.africa/assets/frontend/";

//LOCAL
// export const API_URL = "http://192.168.1.17/transfy/public/api/v1";
// export const IMAGES_URL = "http://192.168.1.17/transfy/public/assets/frontend";
export const IMAGES_URL = "https://devhub.transfy.io/assets/frontend";

export const LANGUAGES: LanguageModel[] = [
  {
    lang: "en",
    isRTL: false,
  },
  {
    lang: "ar",
    isRTL: true,
  },
];

export const getLang = (lang: string) => {
  const foundLang = LANGUAGES.find((a) => a.lang === lang);
  if (foundLang) {
    return foundLang;
  }
  return {
    lang: "en",
    isRTL: false,
  };
};

export const Colors = {
  'text_success': '#26C165',
  'text_danger': '#FF4133',
  'text_warning': '#FFD300',
  'text_info': '#0061FE',
  'bg': '#F2F2F2',
}

export const statusColor = (status: string) => {
	switch (status) {
		case 'success':
		case 'approved':
		case 'complete':
		case 'completed':
		case 'verified':
			return '#26C165';
		case 'failed':
		case 'declined':
			return '#FF4133';
		case 'pending':
			return '#FFD300';
		case 'new':
			return '#0061FE';
		default:
			return '#000000'
	}
}
