import { command, form, query } from '$app/server';

import {
	cancelInvitationSchema,
	confirmImageUploadSchema,
	inviteMemberSchema,
	prepareImageUploadSchema,
	removeImageSchema,
	revokeSessionSchema,
	updateBillingInfoSchema,
	updateNotificationsSchema,
	updateOrganizationSchema,
	updatePreferencesSchema,
	updateProfileSchema
} from '../schemas';
import {
	cancelInvitation,
	confirmImageUpload,
	createCheckout,
	inviteMember,
	openBillingPortal,
	prepareImageUpload,
	refreshSubscriptionData,
	removeImage,
	revokeAllOtherSessions,
	revokeSession,
	updateBillingInfo,
	updateNotifications,
	updateOrganization,
	updatePreferences,
	updateProfile
} from '../server/api/mutations';
import {
	getActiveSessions,
	getBillingInfo,
	getNotificationPreferences,
	getOrganizationInvitations,
	getOrganizationMembers,
	getOrganizationSettings,
	getUserPreferences,
	getUserProfile
} from '../server/api/queries';

// ============================================================================
// QUERIES
// ============================================================================

export const getUserProfileQuery = query(getUserProfile);

export const getUserPreferencesQuery = query(getUserPreferences);
export const getNotificationPreferencesQuery = query(getNotificationPreferences);

export const getActiveSessionsQuery = query(getActiveSessions);

export const getOrganizationSettingsQuery = query(getOrganizationSettings);

export const getOrganizationMembersQuery = query(getOrganizationMembers);

export const getOrganizationInvitationsQuery = query(getOrganizationInvitations);

export const getBillingInfoQuery = query(getBillingInfo);

// ============================================================================
// FORMS
// ============================================================================

export const updateProfileForm = form(updateProfileSchema, updateProfile);

export const updatePreferencesForm = form(updatePreferencesSchema, updatePreferences);

export const updateNotificationsForm = form(updateNotificationsSchema, updateNotifications);

export const updateOrganizationForm = form(updateOrganizationSchema, updateOrganization);

export const updateBillingInfoForm = form(updateBillingInfoSchema, updateBillingInfo);

export const createCheckoutForm = form(createCheckout);

export const openBillingPortalForm = form(openBillingPortal);

export const refreshSubscriptionDataForm = form(refreshSubscriptionData);

export const revokeSessionForm = form(revokeSessionSchema, revokeSession);

export const revokeAllOtherSessionsForm = form(revokeAllOtherSessions);

export const inviteMemberForm = form(inviteMemberSchema, inviteMember);

export const cancelInvitationForm = form(cancelInvitationSchema, cancelInvitation);

// ============================================================================
// COMMANDS
// ============================================================================

export const prepareImageUploadCommand = command(prepareImageUploadSchema, prepareImageUpload);

export const confirmImageUploadCommand = command(confirmImageUploadSchema, confirmImageUpload);

export const removeImageCommand = command(removeImageSchema, removeImage);
