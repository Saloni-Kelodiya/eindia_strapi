
module.exports = ({ env }) => ({
  enabled: true,
  key: 'strapi.sid',
  httpOnly: true,
  maxAge: 86400000,
  secure: env('NODE_ENV') === 'production',
  sameSite: 'lax',
});
