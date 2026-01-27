// Client-safe public API
// Export: schemas, types, constants, logic utilities
// Do NOT export: server-only code (use $features/settings/server)
// Do NOT export: remote functions (use $features/settings/remote)

// Schemas (for client-side validation)
export {
	cancelInvitationSchema,
	confirmImageUploadSchema,
	inviteMemberSchema,
	prepareImageUploadSchema,
	removeImageSchema,
	updateBillingInfoSchema,
	updateNotificationsSchema,
	updateOrganizationSchema,
	updatePreferencesSchema,
	updateProfileSchema
} from './schemas';

// Types
export type {
	BillingAddress,
	BillingInfo,
	ImageUploadResult,
	InvitationInfo,
	MemberInfo,
	NotificationPreferences,
	OrganizationSettings,
	ParsedUserAgent,
	SessionInfo,
	UserPreferences,
	UserProfile
} from './types';

// Constants
export {
	COMMON_TIMEZONES,
	DATE_FORMATS,
	IMAGE_UPLOAD_PREFIXES,
	SUPPORTED_LANGUAGES,
	TIME_FORMATS
} from './constants';

// Logic utilities
export type { Country, CountryGroup, State } from './logic';
export {
	formatSessionInfo,
	getDeviceDescription,
	getProviderDisplayName,
	getRoleDisplayInfo,
	isCustomImage,
	isValidFileSize,
	isValidImageType,
	parseUserAgent
} from './logic';

// Components
export {
	BillingInfoForm,
	CountryPicker,
	InviteMemberForm,
	NotificationsForm,
	PreferencesForm,
	SettingsCard,
	SettingsCardContent,
	SettingsCardFooter,
	SettingsCardHeader,
	SettingsRow
} from './components';
