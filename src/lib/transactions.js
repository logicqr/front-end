/**
 * Adapts an API transaction to the shape the payout screens were written for.
 *
 * The API stores money in paise, uses upper-case enums, and nests the customer
 * under `user` (the old `userName` column duplicated the customer's name and
 * drifted when they renamed). The payout tables and charts read rupees,
 * lower-case statuses and a flat `userName`/`user_id`, so this is the one place
 * that translation lives.
 */
const KIND_LABEL = { FIRST_MONTH: 'First month', RENEWAL: 'Renewal', SIGNUP: 'Signup' };

export function normalizeTransaction(t) {
  return {
    ...t,
    amount: (t.amountPaise ?? 0) / 100,
    status: String(t.status || '').toLowerCase(),
    userName: t.user?.name ?? t.user?.businessName ?? '',
    user_id: t.user?.user_id ?? t.user_id,
    type: KIND_LABEL[t.kind] ?? t.kind ?? '',
  };
}
