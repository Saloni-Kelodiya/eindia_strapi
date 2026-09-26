// src/api/author-request/routes/custom-stats.ts

export default {
  routes: [
    {
      method: "GET",
      path: "/author-requests/all-authors",
      handler: "author-request.getAllAuthorsStats",
      config: {
        auth: {},
        policies: [],
      },
    },
    {
      // 🆕 Logged-in user apni khud ki author-request status check karta hai
      method: "GET",
      path: "/author-requests/my-request",
      handler: "author-request.getMyRequest",
      config: {
        auth: {}, // sirf valid JWT chahiye, koi email-whitelist restriction nahi
        policies: [],
      },
    },
  ],
};