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
	UserProfile,
	UserSettings
} from './types';

// Constants
export { COMMON_TIMEZONES, DATE_FORMATS, SUPPORTED_LANGUAGES, TIME_FORMATS } from './constants';

// Logic utilities
export {
	formatDate,
	formatDateTime,
	formatLongDate,
	getProviderDisplayName,
	getRoleBadgeVariant,
	getRoleIcon,
	parseUserAgent
} from './logic';

// Components
export {
	BillingInfoForm,
	CountryPicker,
	InviteMemberForm,
	NotificationsForm,
	OrganizationInvitations,
	OrganizationMembers,
	PreferencesForm,
	SettingsCard,
	SettingsCardContent,
	SettingsCardFooter,
	SettingsCardHeader,
	SettingsRow
} from './components';
