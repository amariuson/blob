import { sequence } from '@sveltejs/kit/hooks';
import { createSetupHandle, createRedirectHandle, createAuthHandle } from '$features/auth';

export const handle = sequence(createSetupHandle(), createRedirectHandle(), createAuthHandle());
