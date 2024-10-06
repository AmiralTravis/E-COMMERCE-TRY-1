// const express = require('express');
// const router = express.Router();
// const User = require('../models/usersModels');
// const bcrypt = require('bcrypt');

// router.post('/login', async (req, res) => {
//     try {
//         console.log('Login attempt with:', req.body);
        
//         const { username, password } = req.body;
        
//         // Find user - explicitly include password
//         const user = await User.findOne({
//             where: { username },
//             attributes: ['id', 'username', 'password'] // Explicitly include password
//         });
//         console.log('User found:', user ? 'Yes' : 'No');
        
//         if (!user) {
//             return res.status(401).json({ message: 'User not found' });
//         }
        
//         // Compare password
//         const validPassword = await bcrypt.compare(password, user.password);
//         console.log('Password valid:', validPassword);
        
//         if (!validPassword) {
//             return res.status(401).json({ message: 'Invalid password' });
//         }
        
//         // Success - don't send password back
//         res.json({
//             message: 'Login successful',
//             user: {
//                 id: user.id,
//                 username: user.username
//             }
//         });
//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const User = require('../models/usersModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    try {
        console.log('Login attempt with:', req.body);
        
        const { username, password } = req.body;
        
        const user = await User.findOne({
            where: { username },
            attributes: ['id', 'username', 'password']
        });
        console.log('User found:', user ? 'Yes' : 'No');
        
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        console.log('Password valid:', validPassword);
        
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );
        
        // Success response with token
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;