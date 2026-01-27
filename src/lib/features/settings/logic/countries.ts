export interface Country {
	code: string;
	name: string;
	flag: string;
}

export interface CountryGroup {
	continent: string;
	countries: Country[];
}

export interface State {
	code: string;
	name: string;
}

export const COUNTRIES_BY_CONTINENT: CountryGroup[] = [
	{
		continent: 'North America',
		countries: [
			{ code: 'US', name: 'United States', flag: '\u{1F1FA}\u{1F1F8}' },
			{ code: 'CA', name: 'Canada', flag: '\u{1F1E8}\u{1F1E6}' },
			{ code: 'MX', name: 'Mexico', flag: '\u{1F1F2}\u{1F1FD}' },
			{ code: 'GT', name: 'Guatemala', flag: '\u{1F1EC}\u{1F1F9}' },
			{ code: 'BZ', name: 'Belize', flag: '\u{1F1E7}\u{1F1FF}' },
			{ code: 'HN', name: 'Honduras', flag: '\u{1F1ED}\u{1F1F3}' },
			{ code: 'SV', name: 'El Salvador', flag: '\u{1F1F8}\u{1F1FB}' },
			{ code: 'NI', name: 'Nicaragua', flag: '\u{1F1F3}\u{1F1EE}' },
			{ code: 'CR', name: 'Costa Rica', flag: '\u{1F1E8}\u{1F1F7}' },
			{ code: 'PA', name: 'Panama', flag: '\u{1F1F5}\u{1F1E6}' },
			{ code: 'JM', name: 'Jamaica', flag: '\u{1F1EF}\u{1F1F2}' },
			{ code: 'HT', name: 'Haiti', flag: '\u{1F1ED}\u{1F1F9}' },
			{ code: 'DO', name: 'Dominican Republic', flag: '\u{1F1E9}\u{1F1F4}' },
			{ code: 'PR', name: 'Puerto Rico', flag: '\u{1F1F5}\u{1F1F7}' },
			{ code: 'TT', name: 'Trinidad and Tobago', flag: '\u{1F1F9}\u{1F1F9}' },
			{ code: 'BB', name: 'Barbados', flag: '\u{1F1E7}\u{1F1E7}' },
			{ code: 'BS', name: 'Bahamas', flag: '\u{1F1E7}\u{1F1F8}' }
		]
	},
	{
		continent: 'South America',
		countries: [
			{ code: 'BR', name: 'Brazil', flag: '\u{1F1E7}\u{1F1F7}' },
			{ code: 'AR', name: 'Argentina', flag: '\u{1F1E6}\u{1F1F7}' },
			{ code: 'CL', name: 'Chile', flag: '\u{1F1E8}\u{1F1F1}' },
			{ code: 'CO', name: 'Colombia', flag: '\u{1F1E8}\u{1F1F4}' },
			{ code: 'PE', name: 'Peru', flag: '\u{1F1F5}\u{1F1EA}' },
			{ code: 'VE', name: 'Venezuela', flag: '\u{1F1FB}\u{1F1EA}' },
			{ code: 'EC', name: 'Ecuador', flag: '\u{1F1EA}\u{1F1E8}' },
			{ code: 'BO', name: 'Bolivia', flag: '\u{1F1E7}\u{1F1F4}' },
			{ code: 'PY', name: 'Paraguay', flag: '\u{1F1F5}\u{1F1FE}' },
			{ code: 'UY', name: 'Uruguay', flag: '\u{1F1FA}\u{1F1FE}' },
			{ code: 'GY', name: 'Guyana', flag: '\u{1F1EC}\u{1F1FE}' },
			{ code: 'SR', name: 'Suriname', flag: '\u{1F1F8}\u{1F1F7}' }
		]
	},
	{
		continent: 'Europe',
		countries: [
			{ code: 'GB', name: 'United Kingdom', flag: '\u{1F1EC}\u{1F1E7}' },
			{ code: 'DE', name: 'Germany', flag: '\u{1F1E9}\u{1F1EA}' },
			{ code: 'FR', name: 'France', flag: '\u{1F1EB}\u{1F1F7}' },
			{ code: 'IT', name: 'Italy', flag: '\u{1F1EE}\u{1F1F9}' },
			{ code: 'ES', name: 'Spain', flag: '\u{1F1EA}\u{1F1F8}' },
			{ code: 'PT', name: 'Portugal', flag: '\u{1F1F5}\u{1F1F9}' },
			{ code: 'NL', name: 'Netherlands', flag: '\u{1F1F3}\u{1F1F1}' },
			{ code: 'BE', name: 'Belgium', flag: '\u{1F1E7}\u{1F1EA}' },
			{ code: 'CH', name: 'Switzerland', flag: '\u{1F1E8}\u{1F1ED}' },
			{ code: 'AT', name: 'Austria', flag: '\u{1F1E6}\u{1F1F9}' },
			{ code: 'SE', name: 'Sweden', flag: '\u{1F1F8}\u{1F1EA}' },
			{ code: 'NO', name: 'Norway', flag: '\u{1F1F3}\u{1F1F4}' },
			{ code: 'DK', name: 'Denmark', flag: '\u{1F1E9}\u{1F1F0}' },
			{ code: 'FI', name: 'Finland', flag: '\u{1F1EB}\u{1F1EE}' },
			{ code: 'IE', name: 'Ireland', flag: '\u{1F1EE}\u{1F1EA}' },
			{ code: 'PL', name: 'Poland', flag: '\u{1F1F5}\u{1F1F1}' },
			{ code: 'CZ', name: 'Czech Republic', flag: '\u{1F1E8}\u{1F1FF}' },
			{ code: 'GR', name: 'Greece', flag: '\u{1F1EC}\u{1F1F7}' },
			{ code: 'RO', name: 'Romania', flag: '\u{1F1F7}\u{1F1F4}' },
			{ code: 'HU', name: 'Hungary', flag: '\u{1F1ED}\u{1F1FA}' },
			{ code: 'SK', name: 'Slovakia', flag: '\u{1F1F8}\u{1F1F0}' },
			{ code: 'BG', name: 'Bulgaria', flag: '\u{1F1E7}\u{1F1EC}' },
			{ code: 'HR', name: 'Croatia', flag: '\u{1F1ED}\u{1F1F7}' },
			{ code: 'SI', name: 'Slovenia', flag: '\u{1F1F8}\u{1F1EE}' },
			{ code: 'RS', name: 'Serbia', flag: '\u{1F1F7}\u{1F1F8}' },
			{ code: 'UA', name: 'Ukraine', flag: '\u{1F1FA}\u{1F1E6}' },
			{ code: 'LT', name: 'Lithuania', flag: '\u{1F1F1}\u{1F1F9}' },
			{ code: 'LV', name: 'Latvia', flag: '\u{1F1F1}\u{1F1FB}' },
			{ code: 'EE', name: 'Estonia', flag: '\u{1F1EA}\u{1F1EA}' },
			{ code: 'IS', name: 'Iceland', flag: '\u{1F1EE}\u{1F1F8}' },
			{ code: 'LU', name: 'Luxembourg', flag: '\u{1F1F1}\u{1F1FA}' },
			{ code: 'MT', name: 'Malta', flag: '\u{1F1F2}\u{1F1F9}' },
			{ code: 'CY', name: 'Cyprus', flag: '\u{1F1E8}\u{1F1FE}' },
			{ code: 'AL', name: 'Albania', flag: '\u{1F1E6}\u{1F1F1}' },
			{ code: 'MK', name: 'North Macedonia', flag: '\u{1F1F2}\u{1F1F0}' },
			{ code: 'BA', name: 'Bosnia and Herzegovina', flag: '\u{1F1E7}\u{1F1E6}' },
			{ code: 'ME', name: 'Montenegro', flag: '\u{1F1F2}\u{1F1EA}' },
			{ code: 'MD', name: 'Moldova', flag: '\u{1F1F2}\u{1F1E9}' },
			{ code: 'GE', name: 'Georgia', flag: '\u{1F1EC}\u{1F1EA}' },
			{ code: 'AM', name: 'Armenia', flag: '\u{1F1E6}\u{1F1F2}' },
			{ code: 'AZ', name: 'Azerbaijan', flag: '\u{1F1E6}\u{1F1FF}' },
			{ code: 'MC', name: 'Monaco', flag: '\u{1F1F2}\u{1F1E8}' },
			{ code: 'LI', name: 'Liechtenstein', flag: '\u{1F1F1}\u{1F1EE}' },
			{ code: 'AD', name: 'Andorra', flag: '\u{1F1E6}\u{1F1E9}' },
			{ code: 'SM', name: 'San Marino', flag: '\u{1F1F8}\u{1F1F2}' }
		]
	},
	{
		continent: 'Asia',
		countries: [
			{ code: 'JP', name: 'Japan', flag: '\u{1F1EF}\u{1F1F5}' },
			{ code: 'CN', name: 'China', flag: '\u{1F1E8}\u{1F1F3}' },
			{ code: 'KR', name: 'South Korea', flag: '\u{1F1F0}\u{1F1F7}' },
			{ code: 'IN', name: 'India', flag: '\u{1F1EE}\u{1F1F3}' },
			{ code: 'ID', name: 'Indonesia', flag: '\u{1F1EE}\u{1F1E9}' },
			{ code: 'TH', name: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}' },
			{ code: 'VN', name: 'Vietnam', flag: '\u{1F1FB}\u{1F1F3}' },
			{ code: 'MY', name: 'Malaysia', flag: '\u{1F1F2}\u{1F1FE}' },
			{ code: 'SG', name: 'Singapore', flag: '\u{1F1F8}\u{1F1EC}' },
			{ code: 'PH', name: 'Philippines', flag: '\u{1F1F5}\u{1F1ED}' },
			{ code: 'TW', name: 'Taiwan', flag: '\u{1F1F9}\u{1F1FC}' },
			{ code: 'HK', name: 'Hong Kong', flag: '\u{1F1ED}\u{1F1F0}' },
			{ code: 'MO', name: 'Macau', flag: '\u{1F1F2}\u{1F1F4}' },
			{ code: 'BD', name: 'Bangladesh', flag: '\u{1F1E7}\u{1F1E9}' },
			{ code: 'PK', name: 'Pakistan', flag: '\u{1F1F5}\u{1F1F0}' },
			{ code: 'LK', name: 'Sri Lanka', flag: '\u{1F1F1}\u{1F1F0}' },
			{ code: 'NP', name: 'Nepal', flag: '\u{1F1F3}\u{1F1F5}' },
			{ code: 'MM', name: 'Myanmar', flag: '\u{1F1F2}\u{1F1F2}' },
			{ code: 'KH', name: 'Cambodia', flag: '\u{1F1F0}\u{1F1ED}' },
			{ code: 'LA', name: 'Laos', flag: '\u{1F1F1}\u{1F1E6}' },
			{ code: 'MN', name: 'Mongolia', flag: '\u{1F1F2}\u{1F1F3}' },
			{ code: 'KZ', name: 'Kazakhstan', flag: '\u{1F1F0}\u{1F1FF}' },
			{ code: 'UZ', name: 'Uzbekistan', flag: '\u{1F1FA}\u{1F1FF}' },
			{ code: 'KG', name: 'Kyrgyzstan', flag: '\u{1F1F0}\u{1F1EC}' },
			{ code: 'TJ', name: 'Tajikistan', flag: '\u{1F1F9}\u{1F1EF}' },
			{ code: 'TM', name: 'Turkmenistan', flag: '\u{1F1F9}\u{1F1F2}' }
		]
	},
	{
		continent: 'Middle East',
		countries: [
			{ code: 'AE', name: 'United Arab Emirates', flag: '\u{1F1E6}\u{1F1EA}' },
			{ code: 'SA', name: 'Saudi Arabia', flag: '\u{1F1F8}\u{1F1E6}' },
			{ code: 'IL', name: 'Israel', flag: '\u{1F1EE}\u{1F1F1}' },
			{ code: 'TR', name: 'Turkey', flag: '\u{1F1F9}\u{1F1F7}' },
			{ code: 'QA', name: 'Qatar', flag: '\u{1F1F6}\u{1F1E6}' },
			{ code: 'KW', name: 'Kuwait', flag: '\u{1F1F0}\u{1F1FC}' },
			{ code: 'BH', name: 'Bahrain', flag: '\u{1F1E7}\u{1F1ED}' },
			{ code: 'OM', name: 'Oman', flag: '\u{1F1F4}\u{1F1F2}' },
			{ code: 'JO', name: 'Jordan', flag: '\u{1F1EF}\u{1F1F4}' },
			{ code: 'LB', name: 'Lebanon', flag: '\u{1F1F1}\u{1F1E7}' },
			{ code: 'IQ', name: 'Iraq', flag: '\u{1F1EE}\u{1F1F6}' }
		]
	},
	{
		continent: 'Africa',
		countries: [
			{ code: 'ZA', name: 'South Africa', flag: '\u{1F1FF}\u{1F1E6}' },
			{ code: 'EG', name: 'Egypt', flag: '\u{1F1EA}\u{1F1EC}' },
			{ code: 'NG', name: 'Nigeria', flag: '\u{1F1F3}\u{1F1EC}' },
			{ code: 'KE', name: 'Kenya', flag: '\u{1F1F0}\u{1F1EA}' },
			{ code: 'MA', name: 'Morocco', flag: '\u{1F1F2}\u{1F1E6}' },
			{ code: 'GH', name: 'Ghana', flag: '\u{1F1EC}\u{1F1ED}' },
			{ code: 'TZ', name: 'Tanzania', flag: '\u{1F1F9}\u{1F1FF}' },
			{ code: 'ET', name: 'Ethiopia', flag: '\u{1F1EA}\u{1F1F9}' },
			{ code: 'UG', name: 'Uganda', flag: '\u{1F1FA}\u{1F1EC}' },
			{ code: 'DZ', name: 'Algeria', flag: '\u{1F1E9}\u{1F1FF}' },
			{ code: 'TN', name: 'Tunisia', flag: '\u{1F1F9}\u{1F1F3}' },
			{ code: 'SN', name: 'Senegal', flag: '\u{1F1F8}\u{1F1F3}' },
			{ code: 'CI', name: "C\u00f4te d'Ivoire", flag: '\u{1F1E8}\u{1F1EE}' },
			{ code: 'CM', name: 'Cameroon', flag: '\u{1F1E8}\u{1F1F2}' },
			{ code: 'AO', name: 'Angola', flag: '\u{1F1E6}\u{1F1F4}' },
			{ code: 'MZ', name: 'Mozambique', flag: '\u{1F1F2}\u{1F1FF}' },
			{ code: 'ZM', name: 'Zambia', flag: '\u{1F1FF}\u{1F1F2}' },
			{ code: 'ZW', name: 'Zimbabwe', flag: '\u{1F1FF}\u{1F1FC}' },
			{ code: 'BW', name: 'Botswana', flag: '\u{1F1E7}\u{1F1FC}' },
			{ code: 'NA', name: 'Namibia', flag: '\u{1F1F3}\u{1F1E6}' },
			{ code: 'MU', name: 'Mauritius', flag: '\u{1F1F2}\u{1F1FA}' },
			{ code: 'RW', name: 'Rwanda', flag: '\u{1F1F7}\u{1F1FC}' }
		]
	},
	{
		continent: 'Oceania',
		countries: [
			{ code: 'AU', name: 'Australia', flag: '\u{1F1E6}\u{1F1FA}' },
			{ code: 'NZ', name: 'New Zealand', flag: '\u{1F1F3}\u{1F1FF}' },
			{ code: 'FJ', name: 'Fiji', flag: '\u{1F1EB}\u{1F1EF}' },
			{ code: 'PG', name: 'Papua New Guinea', flag: '\u{1F1F5}\u{1F1EC}' },
			{ code: 'NC', name: 'New Caledonia', flag: '\u{1F1F3}\u{1F1E8}' },
			{ code: 'PF', name: 'French Polynesia', flag: '\u{1F1F5}\u{1F1EB}' },
			{ code: 'WS', name: 'Samoa', flag: '\u{1F1FC}\u{1F1F8}' },
			{ code: 'VU', name: 'Vanuatu', flag: '\u{1F1FB}\u{1F1FA}' },
			{ code: 'GU', name: 'Guam', flag: '\u{1F1EC}\u{1F1FA}' }
		]
	}
];

export const ALL_COUNTRIES: Country[] = COUNTRIES_BY_CONTINENT.flatMap((group) => group.countries);

const COUNTRY_MAP: Map<string, Country> = new Map(
	ALL_COUNTRIES.map((country) => [country.code, country])
);

export const US_STATES: State[] = [
	{ code: 'AL', name: 'Alabama' },
	{ code: 'AK', name: 'Alaska' },
	{ code: 'AZ', name: 'Arizona' },
	{ code: 'AR', name: 'Arkansas' },
	{ code: 'CA', name: 'California' },
	{ code: 'CO', name: 'Colorado' },
	{ code: 'CT', name: 'Connecticut' },
	{ code: 'DE', name: 'Delaware' },
	{ code: 'FL', name: 'Florida' },
	{ code: 'GA', name: 'Georgia' },
	{ code: 'HI', name: 'Hawaii' },
	{ code: 'ID', name: 'Idaho' },
	{ code: 'IL', name: 'Illinois' },
	{ code: 'IN', name: 'Indiana' },
	{ code: 'IA', name: 'Iowa' },
	{ code: 'KS', name: 'Kansas' },
	{ code: 'KY', name: 'Kentucky' },
	{ code: 'LA', name: 'Louisiana' },
	{ code: 'ME', name: 'Maine' },
	{ code: 'MD', name: 'Maryland' },
	{ code: 'MA', name: 'Massachusetts' },
	{ code: 'MI', name: 'Michigan' },
	{ code: 'MN', name: 'Minnesota' },
	{ code: 'MS', name: 'Mississippi' },
	{ code: 'MO', name: 'Missouri' },
	{ code: 'MT', name: 'Montana' },
	{ code: 'NE', name: 'Nebraska' },
	{ code: 'NV', name: 'Nevada' },
	{ code: 'NH', name: 'New Hampshire' },
	{ code: 'NJ', name: 'New Jersey' },
	{ code: 'NM', name: 'New Mexico' },
	{ code: 'NY', name: 'New York' },
	{ code: 'NC', name: 'North Carolina' },
	{ code: 'ND', name: 'North Dakota' },
	{ code: 'OH', name: 'Ohio' },
	{ code: 'OK', name: 'Oklahoma' },
	{ code: 'OR', name: 'Oregon' },
	{ code: 'PA', name: 'Pennsylvania' },
	{ code: 'RI', name: 'Rhode Island' },
	{ code: 'SC', name: 'South Carolina' },
	{ code: 'SD', name: 'South Dakota' },
	{ code: 'TN', name: 'Tennessee' },
	{ code: 'TX', name: 'Texas' },
	{ code: 'UT', name: 'Utah' },
	{ code: 'VT', name: 'Vermont' },
	{ code: 'VA', name: 'Virginia' },
	{ code: 'WA', name: 'Washington' },
	{ code: 'WV', name: 'West Virginia' },
	{ code: 'WI', name: 'Wisconsin' },
	{ code: 'WY', name: 'Wyoming' },
	{ code: 'DC', name: 'District of Columbia' }
];

export const CA_PROVINCES: State[] = [
	{ code: 'AB', name: 'Alberta' },
	{ code: 'BC', name: 'British Columbia' },
	{ code: 'MB', name: 'Manitoba' },
	{ code: 'NB', name: 'New Brunswick' },
	{ code: 'NL', name: 'Newfoundland and Labrador' },
	{ code: 'NT', name: 'Northwest Territories' },
	{ code: 'NS', name: 'Nova Scotia' },
	{ code: 'NU', name: 'Nunavut' },
	{ code: 'ON', name: 'Ontario' },
	{ code: 'PE', name: 'Prince Edward Island' },
	{ code: 'QC', name: 'Quebec' },
	{ code: 'SK', name: 'Saskatchewan' },
	{ code: 'YT', name: 'Yukon' }
];

export const AU_STATES: State[] = [
	{ code: 'ACT', name: 'Australian Capital Territory' },
	{ code: 'NSW', name: 'New South Wales' },
	{ code: 'NT', name: 'Northern Territory' },
	{ code: 'QLD', name: 'Queensland' },
	{ code: 'SA', name: 'South Australia' },
	{ code: 'TAS', name: 'Tasmania' },
	{ code: 'VIC', name: 'Victoria' },
	{ code: 'WA', name: 'Western Australia' }
];

const STATE_MAP: Record<string, State[]> = {
	US: US_STATES,
	CA: CA_PROVINCES,
	AU: AU_STATES
};

const COUNTRIES_WITH_STATES = new Set(['US', 'CA', 'AU']);

export function getCountry(code: string | null | undefined): Country | undefined {
	if (!code) return undefined;
	return COUNTRY_MAP.get(code);
}

export function getCountryName(code: string | null | undefined): string {
	if (!code) return 'Not set';
	return COUNTRY_MAP.get(code)?.name ?? code;
}

export function getCountryFlag(code: string | null | undefined): string {
	if (!code) return '';
	return COUNTRY_MAP.get(code)?.flag ?? '';
}

export function getStatesForCountry(countryCode: string): State[] | null {
	return STATE_MAP[countryCode] ?? null;
}

export function requiresState(countryCode: string | null | undefined): boolean {
	if (!countryCode) return false;
	return COUNTRIES_WITH_STATES.has(countryCode);
}

export function getStateLabel(countryCode: string | null | undefined): string {
	if (!countryCode) return 'State / Province';

	switch (countryCode) {
		case 'US':
			return 'State';
		case 'CA':
			return 'Province';
		case 'AU':
			return 'State / Territory';
		default:
			return 'State / Province';
	}
}

export function getStateByCode(countryCode: string, stateCode: string): State | undefined {
	const states = getStatesForCountry(countryCode);
	return states?.find((s) => s.code === stateCode);
}

export function getStatePlaceholder(countryCode: string | null | undefined): string {
	if (!countryCode) return '';

	switch (countryCode) {
		case 'US':
			return 'CA';
		case 'CA':
			return 'ON';
		case 'AU':
			return 'NSW';
		default:
			return '';
	}
}
