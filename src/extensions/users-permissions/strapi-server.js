// // src/extensions/users-permissions/strapi-server.js

// module.exports = (plugin) => {
//   console.log('🔧 CUSTOM OAUTH EXTENSION LOADED');

//   plugin.controllers.auth.callback = async (ctx) => {
//     console.log('🔥 CUSTOM CALLBACK TRIGGERED');
//     const provider = ctx.params.provider || 'google';

//     try {
//       const providerService = strapi.plugin('users-permissions').service('providers');
//       let user = await providerService.connect(provider, ctx.query);

//       const jwt = strapi.plugin('users-permissions').service('jwt').issue({ id: user.id });
      
//       const userPayload = encodeURIComponent(JSON.stringify({
//         id: user.id,
//         username: user.username,
//         email: user.email
//       }));

//       const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
//       const redirectUrl = `${frontendUrl}/auth/google/callback?access_token=${jwt}&user=${userPayload}`;
      
//       console.log('↪️ Redirecting to:', redirectUrl);
//       return ctx.redirect(redirectUrl);
      
//     } catch (error) {
//       console.error('❌ OAuth Error:', error.message);
//       return ctx.redirect(`http://localhost:3000/login?error=${encodeURIComponent(error.message)}`);
//     }
//   };

//   return plugin;
// };