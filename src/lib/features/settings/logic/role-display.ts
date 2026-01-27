/**
 * Role display helpers that map roles to UI components and variants.
 */

import type { Component } from 'svelte';

import CrownIcon from '@lucide/svelte/icons/crown';
import ShieldIcon from '@lucide/svelte/icons/shield';
import UserIcon from '@lucide/svelte/icons/user';

/**
 * Gets the icon component for a role.
 */
export function getRoleIcon(role: string): Component {
	switch (role) {
		case 'owner':
			return CrownIcon;
		case 'admin':
			return ShieldIcon;
		default:
			return UserIcon;
	}
}

/**
 * Gets the badge variant for a role.
 */
export function getRoleBadgeVariant(role: string): 'default' | 'secondary' | 'outline' {
	switch (role) {
		case 'owner':
			return 'default';
		case 'admin':
			return 'secondary';
		default:
			return 'outline';
	}
}
