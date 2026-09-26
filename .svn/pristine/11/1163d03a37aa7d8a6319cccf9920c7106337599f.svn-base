module.exports = {
  async beforeUpdate(event) {
    const { data, where } = event.params;

    // Sirf tab kaam karein jab confirmed true ho raha hai
    if (data.confirmed === true) {
      // Existing user fetch karein
      const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: where,
        select: ['confirmed', 'id', 'username', 'username_hindi']
      });

      // Agar confirmed false se true ho raha hai
      if (existingUser && existingUser.confirmed === false) {
        // Store user data for afterUpdate
        event.params.data._userJustGotConfirmed = true;
        event.params.data._userDataForNotification = {
          id: existingUser.id,
          username: existingUser.username,
          username_hindi: existingUser.username_hindi
        };
      }
    }
  },

  async afterUpdate(event) {
    const { result, params } = event;

    // Check if user was just confirmed
    if (params.data && params.data._userJustGotConfirmed === true) {
      const userData = params.data._userDataForNotification || result;
      const displayName = userData.username_hindi || userData.username || 'User';

      try {
        // Create notification in database
        const notification = await strapi.entityService.create('api::notification.notification', {
          data: {
            title: ':tada: Welcome to Our Platform!',
            message: `Namaste ${displayName}! Aapka account successfully confirm ho gaya hai. Ab aap poori tarah se platform ka use kar sakte hain.`,
            type: 'welcome',
            state: 'unread',
            recipient: userData.id,
            isRead: false,
            metadata: {
              confirmedAt: new Date().toISOString(),
              accountStatus: 'active',
              language: 'hi'
            },
            publishedAt: new Date()
          }
        });

        strapi.log.info(`:white_check_mark: Welcome notification sent to user ${userData.id} (${userData.username}) upon confirmation`);

        // Optional: Agar real-time notification chahiye (WebSocket/Socket.io)
        // await strapi.plugins['io'].service('io').emitToUser(userData.id, 'notification:new', notification);

      } catch (error) {
        strapi.log.error(`:x: Failed to create confirmation notification for user ${userData.id}:`, error);
      }
    }
  }
};
