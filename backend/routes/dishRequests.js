const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const DishRequest = require('../models/DishRequest');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendDishRequestEmail } = require('../utils/emailService');

// Create new dish request
router.post('/', [
  auth,
  body('dishName').trim().notEmpty().withMessage('Dish name is required'),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { dishName, description } = req.body;

    // Get user details
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create dish request
    const dishRequest = new DishRequest({
      userId: req.userId,
      dishName,
      description: description || '',
      userEmail: user.email,
      userName: user.name
    });

    await dishRequest.save();

    // Send email notification (async - don't wait for it)
    sendDishRequestEmail(dishRequest)
      .then(result => {
        if (result.success) {
          console.log('Notification email sent successfully');
        } else {
          console.error('Failed to send notification email:', result.error);
        }
      });

    res.status(201).json({
      message: 'Dish request submitted successfully',
      request: {
        id: dishRequest._id,
        dishName: dishRequest.dishName,
        description: dishRequest.description,
        status: dishRequest.status,
        createdAt: dishRequest.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating dish request:', error);
    res.status(500).json({ error: 'Failed to submit dish request' });
  }
});

// Get user's dish requests
router.get('/my-requests', auth, async (req, res) => {
  try {
    const requests = await DishRequest.find({ userId: req.userId })
      .sort({ createdAt: -1 });
   
    res.json(requests);
  } catch (error) {
    console.error('Error fetching dish requests:', error);
    res.status(500).json({ error: 'Failed to fetch dish requests' });
  }
});

module.exports = router;


