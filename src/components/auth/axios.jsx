/**
 * Compatibility shim.
 *
 * The client itself now lives in `src/lib/api.js`, which handles the base URL,
 * token refresh on 401, response unwrapping and a single error shape. The
 * dashboard components import this path, so it re-exports that instance rather
 * than making every file change at once.
 *
 * New code should import from `../../lib/api` directly.
 */
import api, { http, tokens, API_URL, ApiError } from '../../lib/api';

export { http, tokens, API_URL, ApiError };
export default api;
