/**
 * author-request router
 */

export default {
  routes: [
    // --- Custom Routes (????? ??? ?? ???? ????? ???? :id ?? ? ??????) ---
    {
      method: 'GET',
      path: '/author-requests/all-authors',
      handler: 'author-request.getAllAuthorsStats',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/author-requests/my-request',
      handler: 'author-request.getMyRequest',
      config: {
        policies: [],
        middlewares: [],
      },
    },

    // --- Default CRUD routes ---
    {
      method: 'GET',
      path: '/author-requests',
      handler: 'author-request.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/author-requests/:id',
      handler: 'author-request.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/author-requests',
      handler: 'author-request.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/author-requests/:id',
      handler: 'author-request.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/author-requests/:id',
      handler: 'author-request.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};