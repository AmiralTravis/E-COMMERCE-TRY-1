// // ecommerce-backend/scripts/generateDefaultAvatars.js

// const { User } = require('../models'); // Import your User model
// const { generateAvatar } = require('../utils/avatarGenerator'); // Import the avatar generator
// const path = require('path');
// const fs = require('fs');

// const generateDefaultAvatars = async () => {
//   try {
//     // Fetch all users from the database
//     const users = await User.findAll();

//     // Loop through each user
//     for (const user of users) {
//       // Check if the user already has a profilePicUrl
//       if (!user.profilePicUrl) {
//         console.log(`Generating avatar for user: ${user.username}`);

//         // Generate a default avatar
//         const avatarPath = await generateAvatar(user.id, user.username);

//         // Update the user's profilePicUrl in the database
//         user.profilePicUrl = avatarPath;
//         await user.save();

//         console.log(`Avatar generated and saved for user: ${user.username}`);
//       } else {
//         console.log(`User ${user.username} already has an avatar: ${user.profilePicUrl}`);
//       }
//     }

//     console.log('Default avatars generated for all users.');
//   } catch (error) {
//     console.error('Error generating default avatars:', error);
//   }
// };

// // Run the script
// generateDefaultAvatars();


// ecommerce-backend/scripts/generateDefaultAvatars.js

const { User } = require('../models'); // Import your User model
const { generateAvatar } = require('../utils/avatarGenerator'); // Import the avatar generator
const path = require('path');
const fs = require('fs');

const generateDefaultAvatars = async () => {
  try {
    // Fetch all users from the database
    const users = await User.findAll();

    // Loop through each user
    for (const user of users) {
      // Check if the user already has a profilePicUrl
      if (!user.profilePicUrl) {
        console.log(`Generating avatar for user: ${user.username}`);

        // Generate a default avatar
        const avatarPath = await generateAvatar(user.id, user.username);

        // Update the user's profilePicUrl in the database
        user.profilePicUrl = avatarPath;
        await user.save();

        console.log(`Avatar generated and saved for user: ${user.username}`);
      } else {
        console.log(`User ${user.username} already has an avatar: ${user.profilePicUrl}`);
      }
    }

    console.log('Default avatars generated for all users.');
  } catch (error) {
    console.error('Error generating default avatars:', error);
  }
};

// Run the script
generateDefaultAvatars();