export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('URL', 'http://localhost:1337'),
  proxy: {
    koa: true,        // Proxy headers trust karo (X-Forwarded-*)
    maxIpsCount: 1,   // Kitne proxies hain (IP spoofing se bachao)
  },
  app: {
    keys: env.array('APP_KEYS'),
  },
});