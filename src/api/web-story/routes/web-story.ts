export default {
  routes: [
    {
      method: 'GET',
      path: '/web-stories',
      handler: 'web-story.find',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/web-stories/:id',
      handler: 'web-story.findOne',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/web-stories',
      handler: 'web-story.create',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'PUT',
      path: '/web-stories/:id',
      handler: 'web-story.update',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'DELETE',
      path: '/web-stories/:id',
      handler: 'web-story.delete',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/web-stories/:id/increment-view',
      handler: 'web-story.incrementView',
      config: {
        auth: false, // public   amp-pixel token nahi bhej sakta
        policies: [],
        middlewares: [],
      },
    },
    {
  method: 'POST',
  path: '/web-stories/:id/view',
  handler: 'web-story.incrementView',
  config: {
    auth: false,
    policies: [],
    middlewares: [],
  },
},

    {
      method: 'GET', // or POST depending on your setup
      path: '/web-stories/:id/increment-view',
      handler: 'api::web-story.web-story.incrementView',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST', // ?? Change this to POST
      path: '/web-stories/:id/increment-view',
      handler: 'api::web-story.web-story.incrementView',
      config: {
        auth: false,
      },
    },

  ],
};