import { sequence } from '@sveltejs/kit/hooks';

import { createAuthHandle, createRedirectHandle, createSetupHandle } from '$features/auth/server';

export const handle = sequence(createSetupHandle(), createRedirectHandle(), createAuthHandle());
