import { form, query } from '$app/server';

import { getImpersonationStatus, stopImpersonation } from './server/api';

export const stopImpersonationForm = form(stopImpersonation);

export const getImpersonationStatusQuery = query(getImpersonationStatus);
