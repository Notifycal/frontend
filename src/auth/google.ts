const GOOGLE_SCOPE_BASE_PREFIX = 'https://www.googleapis.com/auth';

const GOOGLE_OAUTH_SCOPE_SUFFIXES = [
  'userinfo.profile',
  'userinfo.email',
  'calendar',
  'calendar.readonly',
  'calendar.events',
  'calendar.events.readonly',
  'calendar.settings.readonly',
  'calendar.addons.execute',
  'contacts.readonly'
];

export const GOOGLE_OAUTH_SCOPES = GOOGLE_OAUTH_SCOPE_SUFFIXES.map(
  (scopeSuffix) => `${GOOGLE_SCOPE_BASE_PREFIX}/${scopeSuffix}`
);
