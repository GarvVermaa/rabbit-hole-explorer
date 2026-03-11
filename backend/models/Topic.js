const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  topic_id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  short_description: { type: String, default: '' },
  category: {
    type: String,
    enum: ['science', 'technology', 'history', 'philosophy', 'arts', 'nature', 'society', 'mathematics', 'other'],
    default: 'other'
  },
  related_topics: [{ type: String }],
  tags: [{ type: String }],
  depth_level: { type: Number, default: 0 },
  color: { type: String, default: '#4A9EFF' },
  icon: { type: String, default: '🔵' }
}, { timestamps: true });

TopicSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Topic', TopicSchema);
