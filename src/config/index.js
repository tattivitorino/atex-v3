export const APP_NAME = 'AtexMobV3';
export const API_BASE_URL = 'https://dev-api.atextecnologia.com.br/';
export const API_TIMEOUT = 10000;
export const UPLOAD_TIMEOUT = API_TIMEOUT;

// Storage keys - Secure Store
export const PUSH_TOKEN_KEY = `${APP_NAME}.pushToken`;
export const AUTH_TOKEN_KEY = `${APP_NAME}.accessToken`;
export const REFRESH_TOKEN_KEY = `${APP_NAME}.refreshToken`;
export const USER_KEY = `${APP_NAME}.user`;

// Storage keys - AsyncStorage
export const PROFISSAOLIST_KEY = `${APP_NAME}.profissaoList`;
export const NACIONALIDADELIST_KEY = `${APP_NAME}.nacionalidadeList`;
export const ESTADOCIVILLIST_KEY = `${APP_NAME}.estadoCivilList`;
export const DOCUMENTOLIST_KEY = `${APP_NAME}.documentoList`;

export const APP_ENVIRONMENT = 'app_mob_ce';
export const ORGANIZATION = 1;

export const ALERT_DELAY = 700;

export const AUDIO_TYPES = ['mpeg', 'ogg', 'm4a', 'mp3', '3gp', '3gpp', 'wma'];
export const VIDEO_TYPES = ['mp4', 'mov', 'mkv', 'avi', 'qt', 'wmv', 'm4v'];
export const IMAGE_TYPES = ['jpg', 'jpeg', 'png']
export const DOC_TYPES = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  gdoc: "application/vnd.google-apps.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  gsheet: "application/vnd.google-apps.spreadsheet",
  txt: "text/plain",
}

/* mimeType = `application/`;
  if (extension === 'pdf') mimeType += extension;
  if (extension === 'doc') mimeType += 'msword';
  if (extension === 'docx') mimeType += 'vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (extension === 'gdoc') mimeType += 'vnd.google-apps.document';
  if (extension === 'xls') mimeType += 'vnd.ms-excel';
  if (extension === 'xlsx') mimeType += 'vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  if (extension === 'gsheet') mimeType += 'vnd.google-apps.spreadsheet';
  if (extension === 'txt') mimeType = 'text/plain'; 
*/

export const MAX_DOC_IMAGE_PIXELS = 1600;
export const MAX_FILE_SIZE_READABLE = 30;
export const MAX_FILE_SIZE = MAX_FILE_SIZE_READABLE * 1048576; // 30MB


export const APP_DEV_VERSION = '1.0.0';
