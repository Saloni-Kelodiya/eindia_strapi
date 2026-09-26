import type { Core } from '@strapi/strapi';
const sharp = require('sharp');
const { Readable } = require('stream'); // Stream module import kiya

const pendingConfirmations = new Map<number, { username: string; username_hindi?: string }>();

// Helper function: Stream ko Buffer me convert karne ke liye
const streamToBuffer = async (stream: any) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    // 1. SOCKET LOGIC
    strapi.server.use(async (ctx, next) => {
      if (ctx.req?.socket) {
        (ctx.req.socket as any).encrypted = true;
      }
      await next();
    });

    // 2. AVIF IMAGE CONVERSION LOGIC (IN-MEMORY)
    console.log('🚀 MAIN ENGINE: Custom AVIF Converter Started!');
    const imageManipulationService = strapi.plugin('upload').service('image-manipulation');
    const originalOptimize = imageManipulationService.optimize;

    imageManipulationService.optimize = async (file: any) => {
      if (file.mime && file.mime.startsWith('image/') && !file.mime.includes('avif') && !file.mime.includes('gif')) {
        try {
          console.log(`🛠️ Converting ${file.name} to AVIF format...`);
          
          // Original image ko Memory (RAM) se uthana
          let inputData;
          if (file.buffer) {
            inputData = file.buffer;
          } else if (typeof file.getStream === 'function') {
            inputData = await streamToBuffer(file.getStream());
          }

        if (inputData) {
            const { data: avifBuffer, info } = await sharp(inputData)
              // 🆕 Safety Net: 1920px (Full HD) se badi photo ko shrink karega, choti ko actual chhod dega
              .resize({ width: 1920, withoutEnlargement: true }) 
              .avif({ quality: 80, effort: 4 }) // Quality 80 rakhi hai taaki HD feel aaye
              .toBuffer({ resolveWithObject: true });

            file.buffer = avifBuffer;
            file.mime = 'image/avif';
            file.ext = '.avif';
            file.name = file.name.replace(/\.[^/.]+$/, "") + ".avif";
            
            // Strapi ko final dimensions aur size bata rahe hain
            file.width = info.width;
            file.height = info.height;
            file.size = info.size / 1000; 

            file.getStream = () => Readable.from(file.buffer);
            
            console.log(`✅ Conversion Successful! Smart Resize Applied. New Size: ${file.size} KB`);
            
            return file; 
          } else {
            console.log('⚠️ Could not find image input data in memory.');
          }
        } catch (err) {
          console.error('❌ AVIF conversion failed:', err);
        }
      }
      return originalOptimize(file);
    };
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    console.log("🚀 MASTER FILE (TS): Strapi Bootstrapped Successfully!");

    // 3. USER CONFIRMATION NOTIFICATION LOGIC
    strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],
      async beforeUpdate(event: any) {
        const { data, where } = event.params;
        if (data.confirmed === true) {
          const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({
            where,
            select: ['id', 'confirmed', 'username', 'username_hindi'],
          });
          if (existingUser && existingUser.confirmed === false) {
            pendingConfirmations.set(existingUser.id, {
              username: existingUser.username,
              username_hindi: existingUser.username_hindi,
            });
          }
        }
      },
      async afterUpdate(event: any) {
        const { result } = event;
        if (!result?.id) return;
        const pendingData = pendingConfirmations.get(result.id);
        if (!pendingData) return;
        pendingConfirmations.delete(result.id);
        const displayName = pendingData.username_hindi || pendingData.username || 'User';

        try {
          await strapi.entityService.create('api::notification.notification', {
            data: {
              title: '🎉 Welcome to Our Platform!',
              message: `Namaste ${displayName}! Aapka account successfully confirm ho gaya hai. Ab aap poori tarah se platform ka use kar sakte hain.`,
              type: 'welcome',
              state: 'unread',
              recipient: result.id,
              isRead: false,
              metadata: {
                confirmedAt: new Date().toISOString(),
                accountStatus: 'active',
                language: 'hi',
              },
              publishedAt: new Date(),
            },
          });
          console.log(`✅ Welcome notification sent to user ${result.id} (${displayName})`);
        } catch (error: any) {
          console.error(`❌ Failed to create confirmation notification:`, error);
        }
      },
    });
  },
};