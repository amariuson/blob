import { relations, sql } from 'drizzle-orm';
import {
	boolean,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid
} from 'drizzle-orm/pg-core';

import { entitlementsJsonb, uuidv7 } from './utils';

export const user = pgTable('user', {
	id: uuidv7('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').default(false).notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
	role: text('role'),
	banned: boolean('banned').default(false),
	banReason: text('ban_reason'),
	banExpires: timestamp('ban_expires')
});

export const session = pgTable(
	'session',
	{
		id: uuidv7('id').primaryKey(),
		expiresAt: timestamp('expires_at').notNull(),
		token: text('token').notNull().unique(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		ipAddress: text('ip_address'),
		userAgent: text('user_agent'),
		userId: uuid('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		impersonatedBy: text('impersonated_by'),
		activeOrganizationId: uuid('active_organization_id').references(() => organization.id, {
			onDelete: 'set null'
		})
	},
	(table) => [index('session_userId_idx').on(table.userId)]
);

export const account = pgTable(
	'account',
	{
		id: uuidv7('id').primaryKey(),
		accountId: text('account_id').notNull(),
		providerId: text('provider_id').notNull(),
		userId: uuid('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		accessToken: text('access_token'),
		refreshToken: text('refresh_token'),
		idToken: text('id_token'),
		accessTokenExpiresAt: timestamp('access_token_expires_at'),
		refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
		scope: text('scope'),
		password: text('password'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull()
	},
	(table) => [
		index('account_userId_idx').on(table.userId),
		uniqueIndex('account_provider_uidx').on(table.providerId, table.accountId)
	]
);

export const verification = pgTable(
	'verification',
	{
		id: uuidv7('id').primaryKey(),
		identifier: text('identifier').notNull(),
		value: text('value').notNull(),
		expiresAt: timestamp('expires_at').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull()
	},
	(table) => [index('verification_identifier_idx').on(table.identifier)]
);

// Billing address type for organization
export type BillingAddress = {
	line1?: string | null;
	line2?: string | null;
	city?: string | null;
	state?: string | null;
	postalCode?: string | null;
	country?: string | null; // ISO alpha-2 code
};

export const organization = pgTable(
	'organization',
	{
		id: uuidv7('id').primaryKey(),
		name: text('name').notNull(),
		slug: text('slug').notNull().unique(),
		logo: text('logo'),
		email: text('email'),
		billingAddress: jsonb('billing_address').$type<BillingAddress>(),
		createdAt: timestamp('created_at').notNull(),
		metadata: text('metadata'),
		entitlements: entitlementsJsonb('entitlements')
			.notNull()
			.default({
				activeSubscriptions: [],
				grantedBenefits: [],
				activeMeters: [],
				updatedAt: new Date(0)
			})
	},
	(table) => [uniqueIndex('organization_slug_uidx').on(table.slug)]
);

export const member = pgTable(
	'member',
	{
		id: uuidv7('id').primaryKey(),
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organization.id, { onDelete: 'cascade' }),
		userId: uuid('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		role: text('role').default('member').notNull(),
		createdAt: timestamp('created_at').notNull()
	},
	(table) => [
		index('member_organizationId_idx').on(table.organizationId),
		index('member_userId_idx').on(table.userId),
		uniqueIndex('member_org_user_uidx').on(table.organizationId, table.userId)
	]
);

export const invitation = pgTable(
	'invitation',
	{
		id: uuidv7('id').primaryKey(),
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organization.id, { onDelete: 'cascade' }),
		email: text('email').notNull(),
		role: text('role'),
		status: text('status').default('pending').notNull(),
		expiresAt: timestamp('expires_at').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		inviterId: uuid('inviter_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' })
	},
	(table) => [
		index('invitation_organizationId_idx').on(table.organizationId),
		index('invitation_email_idx').on(table.email),
		index('invitation_email_lower_idx').on(sql`LOWER(${table.email})`)
	]
);

export const userRelations = relations(user, ({ many, one }) => ({
	sessions: many(session),
	accounts: many(account),
	members: many(member),
	invitations: many(invitation),
	preferences: one(userPreferences)
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
	activeOrganization: one(organization, {
		fields: [session.activeOrganizationId],
		references: [organization.id]
	})
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	})
}));

export const organizationRelations = relations(organization, ({ many }) => ({
	members: many(member),
	invitations: many(invitation)
}));

export const memberRelations = relations(member, ({ one }) => ({
	organization: one(organization, {
		fields: [member.organizationId],
		references: [organization.id]
	}),
	user: one(user, {
		fields: [member.userId],
		references: [user.id]
	})
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
	organization: one(organization, {
		fields: [invitation.organizationId],
		references: [organization.id]
	}),
	user: one(user, {
		fields: [invitation.inviterId],
		references: [user.id]
	})
}));

// User preferences for application settings
export const userPreferences = pgTable('user_preferences', {
	id: uuidv7('id').primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.unique()
		.references(() => user.id, { onDelete: 'cascade' }),
	// Localization
	language: text('language').default('en').notNull(),
	timezone: text('timezone').default('UTC').notNull(),
	dateFormat: text('date_format').default('MM/DD/YYYY').notNull(),
	timeFormat: text('time_format').default('12h').notNull(), // '12h' or '24h'
	// Notifications
	emailNotifications: boolean('email_notifications').default(true).notNull(),
	marketingEmails: boolean('marketing_emails').default(false).notNull(),
	securityAlerts: boolean('security_alerts').default(true).notNull(),
	productUpdates: boolean('product_updates').default(true).notNull(),
	// Timestamps
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
	user: one(user, {
		fields: [userPreferences.userId],
		references: [user.id]
	})
}));

// Audit log action types
export type AuditAction =
	| 'impersonation.start'
	| 'impersonation.stop'
	| 'user.ban'
	| 'user.unban'
	| 'user.role_change'
	| 'user.sessions_revoked'
	| 'organization.delete';

// Audit log for tracking admin actions
export const auditLog = pgTable(
	'audit_log',
	{
		id: uuidv7('id').primaryKey(),
		action: text('action').$type<AuditAction>().notNull(),
		actorId: uuid('actor_id')
			.notNull()
			.references(() => user.id, { onDelete: 'set null' }),
		targetType: text('target_type').notNull(), // 'user' | 'organization' | 'session'
		targetId: uuid('target_id').notNull(),
		metadata: jsonb('metadata').$type<Record<string, unknown>>(),
		ipAddress: text('ip_address'),
		userAgent: text('user_agent'),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [
		index('audit_log_actor_idx').on(table.actorId),
		index('audit_log_created_at_idx').on(table.createdAt)
	]
);

export const auditLogRelations = relations(auditLog, ({ one }) => ({
	actor: one(user, {
		fields: [auditLog.actorId],
		references: [user.id]
	})
}));

// ============================================
// Feature Flags
// ============================================

// Enums
export const flagStatusEnum = pgEnum('flag_status', ['active', 'archived']);
export const flagStateEnum = pgEnum('flag_state', ['targeting', 'kill_switch', 'enable_all']);

// Feature flag history action types (only important actions)
export type FeatureFlagHistoryAction =
	| 'created'
	| 'archived'
	| 'restored'
	| 'state_changed'
	| 'grants_cleared'
	| 'grant_added'
	| 'grant_removed';

// Flag state type
export type FlagState = 'targeting' | 'kill_switch' | 'enable_all';

// Feature flag definition
export const featureFlag = pgTable(
	'feature_flag',
	{
		id: uuidv7('id').primaryKey(),
		key: text('key').notNull().unique(), // Unique identifier (e.g., 'new-dashboard')
		name: text('name').notNull(), // Human-readable name
		description: text('description'),

		// Flag state - targeting uses percentage/grants, kill_switch is OFF for everyone, enable_all is ON for everyone
		state: flagStateEnum('state').default('targeting').notNull(),
		stateReason: text('state_reason'),

		// Percentage rollout (0-100, null means grants-only)
		percentage: integer('percentage'),

		// Status and soft delete
		status: flagStatusEnum('status').default('active').notNull(),
		archivedAt: timestamp('archived_at'),
		archivedBy: uuid('archived_by').references(() => user.id, { onDelete: 'set null' }),

		// Timestamps
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
		createdBy: uuid('created_by')
			.notNull()
			.references(() => user.id, { onDelete: 'set null' }),
		updatedBy: uuid('updated_by').references(() => user.id, { onDelete: 'set null' })
	},
	(table) => [
		index('feature_flag_status_idx').on(table.status),
		index('feature_flag_key_idx').on(table.key),
		index('feature_flag_name_idx').on(table.name)
	]
);

// Organization-level access grants
export const featureFlagGrant = pgTable(
	'feature_flag_grant',
	{
		id: uuidv7('id').primaryKey(),
		flagId: uuid('flag_id')
			.notNull()
			.references(() => featureFlag.id, { onDelete: 'cascade' }),

		// Target organization
		orgId: uuid('org_id')
			.notNull()
			.references(() => organization.id, { onDelete: 'cascade' }),

		// Why this grant exists
		reason: text('reason'),

		// Timestamps
		createdAt: timestamp('created_at').defaultNow().notNull(),
		createdBy: uuid('created_by')
			.notNull()
			.references(() => user.id, { onDelete: 'set null' })
	},
	(table) => [
		index('feature_flag_grant_flag_idx').on(table.flagId),
		index('feature_flag_grant_org_idx').on(table.flagId, table.orgId),
		// Ensure uniqueness per flag+org combination
		uniqueIndex('feature_flag_grant_org_uidx').on(table.flagId, table.orgId)
	]
);

// Change history for audit trail (simplified - only important actions)
export const featureFlagHistory = pgTable(
	'feature_flag_history',
	{
		id: uuidv7('id').primaryKey(),
		flagId: uuid('flag_id')
			.notNull()
			.references(() => featureFlag.id, { onDelete: 'cascade' }),
		action: text('action').$type<FeatureFlagHistoryAction>().notNull(),
		description: text('description'),
		actorId: uuid('actor_id')
			.notNull()
			.references(() => user.id, { onDelete: 'set null' }),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [
		index('feature_flag_history_flag_idx').on(table.flagId),
		index('feature_flag_history_flag_created_idx').on(table.flagId, table.createdAt)
	]
);

// Feature flag relations
export const featureFlagRelations = relations(featureFlag, ({ many, one }) => ({
	grants: many(featureFlagGrant),
	history: many(featureFlagHistory),
	creator: one(user, {
		fields: [featureFlag.createdBy],
		references: [user.id]
	})
}));

export const featureFlagGrantRelations = relations(featureFlagGrant, ({ one }) => ({
	flag: one(featureFlag, {
		fields: [featureFlagGrant.flagId],
		references: [featureFlag.id]
	}),
	organization: one(organization, {
		fields: [featureFlagGrant.orgId],
		references: [organization.id]
	})
}));

export const featureFlagHistoryRelations = relations(featureFlagHistory, ({ one }) => ({
	flag: one(featureFlag, {
		fields: [featureFlagHistory.flagId],
		references: [featureFlag.id]
	}),
	actor: one(user, {
		fields: [featureFlagHistory.actorId],
		references: [user.id]
	})
}));
