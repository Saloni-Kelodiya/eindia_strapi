export default {
  routes: [
    {
      method: 'POST',
      path: '/awards/generate',
      handler: 'award.generate',
      config: {
        auth: false,
      },
    },
  ],
};