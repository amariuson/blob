import { form, query } from '$app/server';

import { stopImpersonation } from '../server/api/mutations';
import { getImpersonationStatus } from '../server/api/queries';

export const stopImpersonationForm = form(stopImpersonation);

export const getImpersonationStatusQuery = query(getImpersonationStatus);
