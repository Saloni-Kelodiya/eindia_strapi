export default ({ env }) => ({
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: "://gmail.com",
        port: 587,
        auth: {
          user: env("GMAIL_USERNAME"),
          pass: env("GMAIL_PASSWORD"),
        },
        secure: false,
      },
      settings: {
        defaultFrom: "entertainindia.in@gmail.com",
        defaultReplyTo: "entertainindia.in@gmail.com",
      },
    },
  },
  
 upload: {
    config: {
      provider: 'local',
      providerOptions: {
        sizeLimit: 1000000000, // 1GB (default)
      },
    },
  },
  'users-permissions': {
    config: {
      providers: {
        google: {
          enabled: true,
          config: {
            callbackURL: 'https://entertainindia.com',
          },
        },
      },
    },
  },
});