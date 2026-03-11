const Topic = require('../models/Topic');

// Mock AI logic to generate related topics when not found in DB
const generateMockRelatedTopics = (topicName) => {
  const lowerName = topicName.toLowerCase();

  if (lowerName.includes('ai') || lowerName.includes('artificial intelligence')) {
    return ['Machine Learning', 'Neural Networks', 'Robotics', 'Computer Vision', 'Natural Language Processing'];
  }
  if (lowerName.includes('machine learning')) {
    return ['Deep Learning', 'Supervised Learning', 'Reinforcement Learning', 'Feature Engineering', 'Data Science'];
  }
  if (lowerName.includes('deep learning')) {
    return ['Transformers', 'Convolutional Networks', 'Backpropagation', 'Generative Adversarial Networks', 'LLMs'];
  }
  if (lowerName.includes('quantum')) {
    return ['Quantum Entanglement', 'Superposition', 'Wave-Particle Duality', 'Quantum Computing', "Schrödinger's Cat"];
  }
  if (lowerName.includes('evolution')) {
    return ['Natural Selection', 'Genetics', 'Mutation', 'Speciation', 'Fossil Record'];
  }
  if (lowerName.includes('philosophy')) {
    return ['Epistemology', 'Metaphysics', 'Ethics', 'Logic', 'Existentialism'];
  }
  if (lowerName.includes('music')) {
    return ['Harmony', 'Rhythm', 'Music Theory', 'Acoustics', 'Composition'];
  }
  if (lowerName.includes('space') || lowerName.includes('cosmos')) {
    return ['Black Holes', 'Dark Matter', 'Galaxy Formation', 'Stellar Evolution', 'Cosmology'];
  }
  if (lowerName.includes('consciousness')) {
    return ['Neuroscience', 'Philosophy of Mind', 'Qualia', 'Self-Awareness', 'Meditation'];
  }
  if (lowerName.includes('blockchain') || lowerName.includes('crypto')) {
    return ['Decentralization', 'Smart Contracts', 'Proof of Work', 'Cryptography', 'Web3'];
  }

  return ['Philosophy of Mind', 'Systems Theory', 'Complexity Science', 'Emergence', 'Information Theory'];
};

const getCategoryColor = (category) => {
  const colors = {
    science: '#00D4FF',
    technology: '#4A9EFF',
    history: '#FFB347',
    philosophy: '#DDA0DD',
    arts: '#FF6B9D',
    nature: '#50C878',
    society: '#FF8C69',
    mathematics: '#00CED1',
    other: '#A8A8FF'
  };
  return colors[category] || colors.other;
};

const getCategoryIcon = (category) => {
  const icons = {
    science: '🔬',
    technology: '💻',
    history: '📜',
    philosophy: '🧠',
    arts: '🎨',
    nature: '🌿',
    society: '🏛️',
    mathematics: '∑',
    other: '🔵'
  };
  return icons[category] || icons.other;
};

const buildGraphData = (centralTopic, relatedTopics) => {
  const nodes = [];
  const edges = [];

  nodes.push({
    id: centralTopic.topic_id,
    name: centralTopic.name,
    description: centralTopic.short_description || centralTopic.description.substring(0, 120) + '...',
    fullDescription: centralTopic.description,
    category: centralTopic.category,
    color: centralTopic.color || getCategoryColor(centralTopic.category),
    icon: centralTopic.icon || getCategoryIcon(centralTopic.category),
    depth: 0,
    size: 1.5
  });

  relatedTopics.forEach((topic) => {
    nodes.push({
      id: topic.topic_id,
      name: topic.name,
      description: topic.short_description || (topic.description ? topic.description.substring(0, 120) + '...' : ''),
      fullDescription: topic.description,
      category: topic.category,
      color: topic.color || getCategoryColor(topic.category),
      icon: topic.icon || getCategoryIcon(topic.category),
      depth: 1,
      size: 1.0
    });

    edges.push({
      id: `${centralTopic.topic_id}-${topic.topic_id}`,
      source: centralTopic.topic_id,
      target: topic.topic_id,
      label: 'related to'
    });
  });

  return { nodes, edges };
};

// GET /api/search-topic?q=topic
const searchTopic = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    let topic = await Topic.findOne({
      name: { $regex: new RegExp(query, 'i') }
    });

    if (!topic) {
      const mockRelated = generateMockRelatedTopics(query);
      topic = {
        topic_id: `MOCK_${query.replace(/\s+/g, '_').toUpperCase()}_${Date.now()}`,
        name: query,
        description: `${query} is a fascinating subject that connects to many areas of knowledge. Explore the related topics to dive deeper into this rabbit hole.`,
        short_description: `Explore the world of ${query} and its connections.`,
        category: 'other',
        color: '#4A9EFF',
        icon: '🔍',
        related_topics: mockRelated,
        depth_level: 0
      };
    }

    const relatedTopics = await Topic.find({
      name: { $in: topic.related_topics }
    });

    const foundNames = relatedTopics.map(t => t.name);
    const missingNames = topic.related_topics.filter(name => !foundNames.includes(name));

    const mockTopics = missingNames.map((name, i) => ({
      topic_id: `MOCK_${name.replace(/\s+/g, '_').toUpperCase()}_${i}`,
      name,
      description: `${name} is a key concept that branches into many interesting sub-topics and related fields.`,
      short_description: `A fascinating branch related to ${query}.`,
      category: 'other',
      color: getCategoryColor('other'),
      icon: getCategoryIcon('other'),
      depth_level: 1
    }));

    const allRelated = [...relatedTopics, ...mockTopics];
    const graphData = buildGraphData(topic, allRelated);

    res.json({
      success: true,
      query,
      graph: graphData,
      centralTopic: {
        id: topic.topic_id,
        name: topic.name,
        description: topic.description,
        category: topic.category
      }
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// GET /api/topic/:id
const getTopicById = async (req, res) => {
  try {
    const { id } = req.params;

    let topic = await Topic.findOne({ topic_id: id });

    if (!topic) {
      if (id.startsWith('MOCK_')) {
        const name = id.replace(/^MOCK_/, '').replace(/_\d+$/, '').replace(/_/g, ' ');
        return res.json({
          success: true,
          topic: {
            topic_id: id,
            name,
            description: `${name} is a topic being dynamically discovered. Click to explore related concepts.`,
            short_description: `Discover the world of ${name}.`,
            category: 'other',
            color: '#4A9EFF',
            icon: '🔍',
            related_topics: generateMockRelatedTopics(name),
            depth_level: 1
          }
        });
      }
      return res.status(404).json({ error: 'Topic not found' });
    }

    res.json({ success: true, topic });
  } catch (err) {
    console.error('Get topic error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/related-topics/:id
const getRelatedTopics = async (req, res) => {
  try {
    const { id } = req.params;

    let topic = await Topic.findOne({ topic_id: id });
    let topicName = topic ? topic.name : id.replace(/^MOCK_/, '').replace(/_\d+$/, '').replace(/_/g, ' ');
    const relatedNames = topic ? topic.related_topics : generateMockRelatedTopics(topicName);

    const relatedTopics = await Topic.find({ name: { $in: relatedNames } });
    const foundNames = relatedTopics.map(t => t.name);
    const missingNames = relatedNames.filter(name => !foundNames.includes(name));

    const mockTopics = missingNames.map((name, i) => ({
      topic_id: `MOCK_${name.replace(/\s+/g, '_').toUpperCase()}_${Date.now()}_${i}`,
      name,
      description: `${name} connects deeply to ${topicName} and opens pathways to many other fascinating topics.`,
      short_description: `A concept related to ${topicName}.`,
      category: 'other',
      color: getCategoryColor('other'),
      icon: getCategoryIcon('other'),
      depth_level: (topic ? topic.depth_level : 0) + 1
    }));

    const allRelated = [...relatedTopics, ...mockTopics];

    const nodes = allRelated.map(t => ({
      id: t.topic_id,
      name: t.name,
      description: t.short_description || (t.description ? t.description.substring(0, 120) + '...' : ''),
      fullDescription: t.description,
      category: t.category,
      color: t.color || getCategoryColor(t.category),
      icon: t.icon || getCategoryIcon(t.category),
      depth: (topic?.depth_level || 0) + 1,
      size: 0.8
    }));

    const edges = nodes.map(node => ({
      id: `${id}-${node.id}`,
      source: id,
      target: node.id,
      label: 'related to'
    }));

    res.json({
      success: true,
      parentId: id,
      parentName: topicName,
      nodes,
      edges
    });
  } catch (err) {
    console.error('Related topics error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { searchTopic, getTopicById, getRelatedTopics };
