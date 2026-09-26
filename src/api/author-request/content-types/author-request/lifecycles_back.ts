const approveAuthorRequest = async (result: any) => {
  // Check karte hain ki kya request_status 'approved' hai
  if (result.request_status === 'approved') {
    try {
      // 1. 'Author' role ki ID nikalna
      const roles = await strapi.entityService.findMany('plugin::users-permissions.role', {
        filters: { name: 'Author' }, 
      });

      if (!roles || roles.length === 0) return;
      const authorRoleId = roles[0].id;

      // 2. Entry fetch karna (yahan : any lagaya hai)
      const fullEntry: any = await strapi.entityService.findOne(
        'api::author-request.author-request', 
        result.id, 
        { populate: ['applicant'] }
      );

      const userId = fullEntry?.applicant?.id;
      const userEmail = fullEntry?.email || fullEntry?.applicant?.email; 

      if (userId && userEmail) {
        // 3. DOUBLE MAIL ROKNE KA CHECK 🛡️ (yahan bhi : any lagaya hai)
        const currentUser: any = await strapi.entityService.findOne('plugin::users-permissions.user', userId, {
          populate: ['role']
        });

        if (currentUser?.role?.id === authorRoleId) {
           console.log("⚡ User pehle se Author hai, dubara mail nahi bhejenge.");
           return;
        }

        // 4. User ka Role Update karna
        await strapi.entityService.update('plugin::users-permissions.user', userId, {
          data: { role: authorRoleId },
        });

    await strapi.plugin('email').service('email').send({
          to: userEmail,
          subject: 'Congratulations! You are now an Author 🎉',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <h2>Hello <strong>${fullEntry.username}</strong>,</h2>
              <p>Congratulations! Your request to become an author has been approved by the admin. 🎉</p>
              <p>You can now publish your articles and content on the platform as an <strong>Author</strong>.</p>
              <p>You can access your dashboard by clicking the button below:</p>
              
              <a href="https://entertainindia.com/author-dashboard" target="_blank" style="display: inline-block; padding: 10px 20px; margin: 10px 0; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
              
              <p style="font-size: 12px; color: #666; margin-top: 20px;">
                If the button above doesn't work (common with localhost during testing), please copy and paste the following link into your browser: <br/>
                <a href="https://entertainindia.com/author-dashboard" target="_blank" style="color: #007bff;">https://entertainindia.com/author-dashboard</a>
              </p>
              
              <p>Welcome to the team!</p>
            </div>
          `,
        });

        console.log(`✅ Success: Role updated to Author aur ${userEmail} ko mail bhej diya gaya hai!`);
      }
    } catch (error) {
      console.error('❌ Role update ya email bhejne me error aayi:', error);
    }
  }
};

export default {
  async afterUpdate(event: any) {
    console.log("🔥 afterUpdate hook chala!");
    await approveAuthorRequest(event.result);
  }
};