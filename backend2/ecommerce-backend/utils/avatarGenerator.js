// // // ecommerce-backend/utils/avatarGenerator.js

// const sharp = require('sharp');
// const path = require('path');
// const fs = require('fs');

// // Professional color palette inspired by modern design systems
// const colorPalettes = {
//   blue: ['#E3F2FD', '#2196F3', '#1976D2', '#0D47A1'],
//   purple: ['#F3E5F5', '#9C27B0', '#7B1FA2', '#4A148C'],
//   indigo: ['#E8EAF6', '#3F51B5', '#303F9F', '#1A237E'],
//   teal: ['#E0F2F1', '#009688', '#00796B', '#004D40'],
//   gray: ['#FAFAFA', '#616161', '#424242', '#212121']
// };

// const generateAvatar = async (userId, username) => {
//   try {
//     const initials = getInitials(username);
//     const { backgroundColor, textColor, accentColor } = generateColorScheme(userId);
    
//     // Create a more sophisticated SVG with modern design elements
//     const svg = `
//       <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
//         <defs>
//           <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
//             <stop offset="0%" style="stop-color:${backgroundColor};stop-opacity:1" />
//             <stop offset="100%" style="stop-color:${accentColor};stop-opacity:1" />
//           </linearGradient>
//           <filter id="shadow">
//             <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.15"/>
//           </filter>
//         </defs>
        
//         <!-- Background with gradient -->
//         <rect width="400" height="400" fill="url(#grad)" rx="80" ry="80"/>
        
//         <!-- Decorative elements -->
//         <circle cx="320" cy="80" r="120" fill="${accentColor}" opacity="0.1"/>
//         <circle cx="80" cy="320" r="160" fill="${backgroundColor}" opacity="0.1"/>
        
//         <!-- Text container with slight shadow -->
//         <g filter="url(#shadow)">
//           <text 
//   x="50%" 
//   y="50%"
//   dy="0.1em"
//   dominant-baseline="middle"
//   alignment-baseline="central"
//   text-anchor="middle"
//   font-family="Inter, -apple-system, system-ui, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial"
//   font-size="150"
//   font-weight="600"
//   letter-spacing="-2"
//   fill="${textColor}"
// >${initials}</text>
//         </g>
//       </svg>
//     `;

//     // Generate high-quality PNG with proper settings
//     // const fileName = `avatar-${userId}.png`;
//     // const filePath = path.join(__dirname, '../public/avatars', fileName);
//     const fileName = `generated-${userId}.png`; // Consistent filename
//     const filePath = path.join(__dirname, '../public/generated-avatars', fileName);
    
//     // Ensure avatars directory exists
//     const dir = path.dirname(filePath);
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }

//     await sharp(Buffer.from(svg))
//       .resize(400, 400, {
//         kernel: sharp.kernel.lanczos3,
//         fit: 'contain',
//         position: 'center'
//       })
//       .png({
//         quality: 90,
//         compressionLevel: 9,
//         palette: true
//       })
//       .toFile(filePath);

//     // return `/avatars/${fileName}`;
//     return `/generated-avatars/${fileName}`; 

//   } catch (error) {
//     console.error('Avatar generation error:', error);
//     throw new Error('Failed to generate avatar');
//   }
// };

// const getInitials = (username) => {
//   // Handle various username formats
//   const words = username
//     .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
//     .trim()
//     .split(/[\s_-]+/); // Split on space, underscore, or hyphen
    
//   if (words.length >= 2) {
//     return (words[0][0] + words[1][0]).toUpperCase();
//   }
  
//   // For single word usernames, take up to 2 characters
//   return username.slice(0, 2).toUpperCase();
// };

// const generateColorScheme = (userId) => {
//   // Select color palette based on userId
//   const paletteNames = Object.keys(colorPalettes);
//   const selectedPalette = colorPalettes[paletteNames[userId % paletteNames.length]];
  
//   return {
//     backgroundColor: selectedPalette[0], // Light shade
//     textColor: selectedPalette[2],       // Medium-dark shade
//     accentColor: selectedPalette[3]      // Dark shade
//   };
// };

// const ensureContrast = (background, text) => {
//   const getLuminance = (hexColor) => {
//     const rgb = hexColor.match(/[A-Za-z0-9]{2}/g).map(v => parseInt(v, 16));
//     const [r, g, b] = rgb.map(v => {
//       v /= 255;
//       return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
//     });
//     return 0.2126 * r + 0.7152 * g + 0.0722 * b;
//   };

//   const contrast = (l1, l2) => {
//     const lighter = Math.max(l1, l2);
//     const darker = Math.min(l1, l2);
//     return (lighter + 0.05) / (darker + 0.05);
//   };

//   const bgLuminance = getLuminance(background);
//   const textLuminance = getLuminance(text);
  
//   // If contrast is less than 4.5:1, adjust text color
//   if (contrast(bgLuminance, textLuminance) < 4.5) {
//     return bgLuminance > 0.5 ? '#000000' : '#FFFFFF';
//   }
  
//   return text;
// };

// module.exports = { generateAvatar };

// ecommerce-backend/utils/avatarGenerator.js

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Professional color palette inspired by modern design systems
const colorPalettes = {
  blue: ['#E3F2FD', '#2196F3', '#1976D2', '#0D47A1'],
  purple: ['#F3E5F5', '#9C27B0', '#7B1FA2', '#4A148C'],
  indigo: ['#E8EAF6', '#3F51B5', '#303F9F', '#1A237E'],
  teal: ['#E0F2F1', '#009688', '#00796B', '#004D40'],
  gray: ['#FAFAFA', '#616161', '#424242', '#212121']
};

const generateAvatar = async (userId, username) => {
  try {
    const firstLetter = getFirstLetter(username);
    const { backgroundColor, textColor, accentColor } = generateColorScheme(userId);
    
    // Create SVG with modern design elements
    const svg = `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${backgroundColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${accentColor};stop-opacity:1" />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.15"/>
          </filter>
        </defs>
        
        <!-- Background with gradient -->
        <rect width="400" height="400" fill="url(#grad)" rx="80" ry="80"/>
        
        <!-- Decorative elements -->
        <circle cx="320" cy="80" r="120" fill="${accentColor}" opacity="0.1"/>
        <circle cx="80" cy="320" r="160" fill="${backgroundColor}" opacity="0.1"/>
        
        <!-- Text container with slight shadow -->
        <g filter="url(#shadow)">
          <text 
            x="50%" 
            y="50%"
            dy="0.35em"
            dominant-baseline="middle"
            alignment-baseline="central"
            text-anchor="middle"
            font-family="Inter, -apple-system, system-ui, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial"
            font-size="300"
            font-weight="600"
            letter-spacing="0"
            fill="${textColor}"
          >${firstLetter}</text>
        </g>
      </svg>
    `;

    const fileName = `generated-${userId}.png`;
    const filePath = path.join(__dirname, '../public/generated-avatars', fileName);
    
    // Ensure avatars directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await sharp(Buffer.from(svg))
      .resize(400, 400, {
        kernel: sharp.kernel.lanczos3,
        fit: 'contain',
        position: 'center'
      })
      .png({
        quality: 90,
        compressionLevel: 9,
        palette: true
      })
      .toFile(filePath);

    return `/generated-avatars/${fileName}`; 

  } catch (error) {
    console.error('Avatar generation error:', error);
    throw new Error('Failed to generate avatar');
  }
};

const getFirstLetter = (username) => {
  // Get first letter and handle edge cases
  return username
    .replace(/[^a-zA-Z0-9]/g, '') // Remove special characters
    .trim()
    .charAt(0)
    .toUpperCase();
};

const generateColorScheme = (userId) => {
  // Select color palette based on userId
  const paletteNames = Object.keys(colorPalettes);
  const selectedPalette = colorPalettes[paletteNames[userId % paletteNames.length]];
  
  return {
    backgroundColor: selectedPalette[0], // Light shade
    textColor: selectedPalette[2],       // Medium-dark shade
    accentColor: selectedPalette[3]      // Dark shade
  };
};

const ensureContrast = (background, text) => {
  const getLuminance = (hexColor) => {
    const rgb = hexColor.match(/[A-Za-z0-9]{2}/g).map(v => parseInt(v, 16));
    const [r, g, b] = rgb.map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const contrast = (l1, l2) => {
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  };

  const bgLuminance = getLuminance(background);
  const textLuminance = getLuminance(text);
  
  // If contrast is less than 4.5:1, adjust text color
  if (contrast(bgLuminance, textLuminance) < 4.5) {
    return bgLuminance > 0.5 ? '#000000' : '#FFFFFF';
  }
  
  return text;
};

module.exports = { generateAvatar };