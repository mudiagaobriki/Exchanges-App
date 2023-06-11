import { LanguageModel } from "../models";

export const API_URL = "";

export const IMAGES_URL = "";

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
