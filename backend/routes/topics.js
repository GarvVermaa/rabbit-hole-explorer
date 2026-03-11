const express = require('express');
const router = express.Router();
const { searchTopic, getTopicById, getRelatedTopics } = require('../controllers/topicController');

// Search for a topic and get initial graph
// GET /api/search-topic?q=artificial+intelligence
router.get('/search-topic', searchTopic);

// Get full topic details by ID
// GET /api/topic/:id
router.get('/topic/:id', getTopicById);

// Get related topics for graph expansion
// GET /api/related-topics/:id
router.get('/related-topics/:id', getRelatedTopics);

module.exports = router;
