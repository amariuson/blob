export const SUPPORTED_LANGUAGES = [
	{ value: 'en', label: 'English' },
	{ value: 'es', label: 'Espa\u00f1ol' },
	{ value: 'fr', label: 'Fran\u00e7ais' },
	{ value: 'de', label: 'Deutsch' },
	{ value: 'pt', label: 'Portugu\u00eas' },
	{ value: 'ja', label: '\u65e5\u672c\u8a9e' },
	{ value: 'zh', label: '\u4e2d\u6587' },
	{ value: 'ko', label: '\ud55c\uad6d\uc5b4' }
] as const;

export const COMMON_TIMEZONES = [
	{ value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
	{ value: 'America/Chicago', label: 'Central Time (US & Canada)' },
	{ value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
	{ value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
	{ value: 'America/Anchorage', label: 'Alaska' },
	{ value: 'Pacific/Honolulu', label: 'Hawaii' },
	{ value: 'America/Sao_Paulo', label: 'Brasilia' },
	{ value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires' },
	{ value: 'America/Mexico_City', label: 'Mexico City' },
	{ value: 'America/Toronto', label: 'Toronto' },
	{ value: 'Europe/London', label: 'London' },
	{ value: 'Europe/Paris', label: 'Paris' },
	{ value: 'Europe/Berlin', label: 'Berlin' },
	{ value: 'Europe/Madrid', label: 'Madrid' },
	{ value: 'Europe/Rome', label: 'Rome' },
	{ value: 'Europe/Amsterdam', label: 'Amsterdam' },
	{ value: 'Europe/Zurich', label: 'Zurich' },
	{ value: 'Europe/Stockholm', label: 'Stockholm' },
	{ value: 'Europe/Oslo', label: 'Oslo' },
	{ value: 'Europe/Copenhagen', label: 'Copenhagen' },
	{ value: 'Europe/Helsinki', label: 'Helsinki' },
	{ value: 'Europe/Warsaw', label: 'Warsaw' },
	{ value: 'Europe/Moscow', label: 'Moscow' },
	{ value: 'Europe/Istanbul', label: 'Istanbul' },
	{ value: 'Asia/Dubai', label: 'Dubai' },
	{ value: 'Asia/Kolkata', label: 'Mumbai / New Delhi' },
	{ value: 'Asia/Singapore', label: 'Singapore' },
	{ value: 'Asia/Hong_Kong', label: 'Hong Kong' },
	{ value: 'Asia/Shanghai', label: 'Shanghai' },
	{ value: 'Asia/Tokyo', label: 'Tokyo' },
	{ value: 'Asia/Seoul', label: 'Seoul' },
	{ value: 'Australia/Sydney', label: 'Sydney' },
	{ value: 'Australia/Melbourne', label: 'Melbourne' },
	{ value: 'Pacific/Auckland', label: 'Auckland' }
] as const;

export const DATE_FORMATS = [
	{ value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2024)' },
	{ value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2024)' },
	{ value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2024-12-31)' },
	{ value: 'DD.MM.YYYY', label: 'DD.MM.YYYY (31.12.2024)' }
] as const;

export const TIME_FORMATS = [
	{ value: '12h', label: '12-hour (2:30 PM)' },
	{ value: '24h', label: '24-hour (14:30)' }
] as const;

export const IMAGE_UPLOAD_PREFIXES = {
	avatar: 'avatars/',
	'org-logo': 'org-logos/'
} as const;
