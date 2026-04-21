import { logger } from '$services/logger'; // side-effect: registers shutdown hook FIRST
import { startTracing } from '$services/tracing';

logger.debug('instrumentation.server booting');
startTracing();
