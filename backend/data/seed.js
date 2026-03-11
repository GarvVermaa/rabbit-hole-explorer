require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Topic = require('../models/Topic');

const topics = [
  // === TECHNOLOGY CLUSTER ===
  {
    topic_id: 'AI001',
    name: 'Artificial Intelligence',
    description: 'Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning (the acquisition of information and rules for using the information), reasoning (using rules to reach approximate or definite conclusions) and self-correction. AI is rapidly transforming industries from healthcare to finance, enabling machines to perform tasks that previously required human cognition.',
    short_description: 'Machines that simulate human intelligence and cognitive processes.',
    category: 'technology',
    related_topics: ['Machine Learning', 'Neural Networks', 'Robotics', 'Computer Vision', 'Natural Language Processing'],
    tags: ['AI', 'automation', 'future', 'computing'],
    depth_level: 0,
    color: '#4A9EFF',
    icon: '🤖'
  },
  {
    topic_id: 'ML001',
    name: 'Machine Learning',
    description: 'Machine Learning is a subset of artificial intelligence that provides systems the ability to automatically learn and improve from experience without being explicitly programmed. It focuses on the development of computer programs that can access data and use it to learn for themselves. The process begins with observations or data, such as examples, direct experience, or instruction.',
    short_description: 'Systems that learn and improve automatically from experience.',
    category: 'technology',
    related_topics: ['Deep Learning', 'Supervised Learning', 'Reinforcement Learning', 'Feature Engineering', 'Data Science'],
    tags: ['ML', 'algorithms', 'data', 'prediction'],
    depth_level: 1,
    color: '#3D8FE8',
    icon: '📊'
  },
  {
    topic_id: 'DL001',
    name: 'Deep Learning',
    description: 'Deep Learning is part of a broader family of machine learning methods based on artificial neural networks with representation learning. Learning can be supervised, semi-supervised or unsupervised. Deep learning architectures such as deep neural networks, recurrent neural networks, and convolutional neural networks have been applied to fields including computer vision, speech recognition, natural language processing, and bioinformatics.',
    short_description: 'Neural networks with many layers that learn complex representations.',
    category: 'technology',
    related_topics: ['Transformers', 'Convolutional Networks', 'Backpropagation', 'Generative Adversarial Networks', 'LLMs'],
    tags: ['neural networks', 'deep learning', 'AI'],
    depth_level: 2,
    color: '#2B7FD0',
    icon: '🧬'
  },
  {
    topic_id: 'TR001',
    name: 'Transformers',
    description: 'The Transformer is a deep learning model that adopts the mechanism of self-attention, differentially weighting the significance of each part of the input data. It is used primarily in natural language processing and computer vision. Like recurrent neural networks, Transformers are designed to process sequential input data, but unlike RNNs, Transformers process the entire input all at once.',
    short_description: 'Self-attention based models that revolutionized NLP and AI.',
    category: 'technology',
    related_topics: ['GPT', 'BERT', 'Attention Mechanism', 'NLP', 'Large Language Models'],
    tags: ['transformers', 'attention', 'NLP', 'GPT'],
    depth_level: 3,
    color: '#1A70C0',
    icon: '⚡'
  },
  {
    topic_id: 'NN001',
    name: 'Neural Networks',
    description: 'Artificial neural networks are computing systems vaguely inspired by the biological neural networks that constitute animal brains. Such systems learn to perform tasks by considering examples, generally without being programmed with task-specific rules. The network consists of layers of interconnected nodes or "neurons" that process information using connectionist approaches to computation.',
    short_description: 'Computing systems inspired by biological brain networks.',
    category: 'technology',
    related_topics: ['Neurons', 'Backpropagation', 'Activation Functions', 'Deep Learning', 'Perceptron'],
    tags: ['neural networks', 'brain', 'computation'],
    depth_level: 1,
    color: '#5B9BD5',
    icon: '🕸️'
  },
  {
    topic_id: 'CV001',
    name: 'Computer Vision',
    description: 'Computer Vision is an interdisciplinary scientific field that deals with how computers can gain high-level understanding from digital images or videos. From the perspective of engineering, it seeks to understand and automate tasks that the human visual system can do. Computer vision tasks include methods for acquiring, processing, analyzing and understanding digital images.',
    short_description: 'Teaching computers to interpret and understand visual information.',
    category: 'technology',
    related_topics: ['Image Recognition', 'Object Detection', 'Convolutional Networks', 'OpenCV', 'Facial Recognition'],
    tags: ['vision', 'images', 'recognition', 'AI'],
    depth_level: 1,
    color: '#6BAED6',
    icon: '👁️'
  },
  {
    topic_id: 'QC001',
    name: 'Quantum Computing',
    description: 'Quantum computing is the exploitation of collective properties of quantum states, such as superposition and entanglement, to perform computation. The devices that perform quantum computations are known as quantum computers. Quantum computers could potentially solve problems that classical computers practically cannot, particularly in areas like cryptography, optimization, and simulation of quantum systems.',
    short_description: 'Computing using quantum mechanical phenomena like superposition.',
    category: 'science',
    related_topics: ['Quantum Mechanics', 'Qubits', 'Quantum Entanglement', 'Superposition', 'Quantum Algorithms'],
    tags: ['quantum', 'computing', 'physics', 'future'],
    depth_level: 0,
    color: '#00D4FF',
    icon: '⚛️'
  },
  {
    topic_id: 'QM001',
    name: 'Quantum Mechanics',
    description: 'Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles. It is the foundation of all quantum physics including quantum chemistry, quantum field theory, quantum technology, and quantum information science. Classical physics, the collection of theories that existed before the advent of quantum mechanics, describes many aspects of nature at an ordinary scale.',
    short_description: 'Physics governing the behavior of matter at atomic and subatomic scales.',
    category: 'science',
    related_topics: ['Wave-Particle Duality', 'Heisenberg Uncertainty', "Schrödinger's Equation", 'Quantum Field Theory', 'Quantum Computing'],
    tags: ['physics', 'quantum', 'atoms', 'uncertainty'],
    depth_level: 1,
    color: '#00B8E6',
    icon: '🔬'
  },

  // === SCIENCE CLUSTER ===
  {
    topic_id: 'EVO001',
    name: 'Evolution',
    description: 'Evolution is change in the heritable characteristics of biological populations over successive generations. These characteristics are the expressions of genes that are passed on from parent to offspring during reproduction. Different characteristics tend to exist within any given population as a result of mutation, genetic recombination and other sources of genetic variation.',
    short_description: 'Change in heritable characteristics across generations of organisms.',
    category: 'science',
    related_topics: ['Natural Selection', 'Genetics', 'DNA', 'Speciation', 'Fossil Record'],
    tags: ['biology', 'Darwin', 'species', 'adaptation'],
    depth_level: 0,
    color: '#50C878',
    icon: '🧬'
  },
  {
    topic_id: 'NS001',
    name: 'Natural Selection',
    description: 'Natural selection is the differential survival and reproduction of individuals due to differences in phenotype. It is a key mechanism of evolution, the change in the heritable traits characteristic of a population over generations. Charles Darwin popularised the term "natural selection", contrasting it with artificial selection, which in his view is intentional, whereas natural selection is not.',
    short_description: "Darwin's mechanism: survival and reproduction favoring adapted traits.",
    category: 'science',
    related_topics: ['Evolution', 'Adaptation', 'Fitness', 'Mutation', 'Sexual Selection'],
    tags: ['Darwin', 'survival', 'biology', 'adaptation'],
    depth_level: 1,
    color: '#45B56D',
    icon: '🌿'
  },
  {
    topic_id: 'NEURO001',
    name: 'Neuroscience',
    description: 'Neuroscience is the scientific study of the nervous system. It is a multidisciplinary science that combines physiology, anatomy, molecular biology, developmental biology, cytology, computer science and mathematical modeling to understand the fundamental and emergent properties of neurons and neural circuits. The understanding of the biological basis of learning, memory, behavior, perception, and consciousness is a major challenge of modern neuroscience.',
    short_description: 'The scientific study of the brain and nervous system.',
    category: 'science',
    related_topics: ['Consciousness', 'Neurons', 'Cognitive Science', 'Psychology', 'Neuroplasticity'],
    tags: ['brain', 'neurons', 'cognition', 'science'],
    depth_level: 0,
    color: '#FF9999',
    icon: '🧠'
  },
  {
    topic_id: 'CON001',
    name: 'Consciousness',
    description: 'Consciousness, at its simplest, is sentience or awareness of internal and external existence. Despite centuries of analyses, definitions, explanations and debates by philosophers and scientists, consciousness remains puzzling and controversial, being "at once the most familiar and [also the] most mysterious aspect of our lives." The hard problem of consciousness—why physical processes in the brain give rise to subjective experience—remains one of the greatest unsolved mysteries in science.',
    short_description: 'The mysterious experience of subjective awareness and sentience.',
    category: 'philosophy',
    related_topics: ['Philosophy of Mind', 'Qualia', 'Self-Awareness', 'Meditation', 'Neuroscience'],
    tags: ['mind', 'awareness', 'philosophy', 'hard problem'],
    depth_level: 0,
    color: '#DDA0DD',
    icon: '✨'
  },

  // === PHILOSOPHY CLUSTER ===
  {
    topic_id: 'PHIL001',
    name: 'Philosophy of Mind',
    description: 'Philosophy of mind is a branch of philosophy that studies the ontology and nature of the mind and its relationship with the body. The mind-body problem is a paradigmatic issue in philosophy of mind, although other issues are addressed, such as the hard problem of consciousness, and the nature of particular mental states. Aspects of the mind that are studied include mental events, mental functions, mental properties, consciousness and its neural correlates.',
    short_description: 'Philosophical study of the mind, consciousness, and mental phenomena.',
    category: 'philosophy',
    related_topics: ['Consciousness', 'Dualism', 'Functionalism', 'Qualia', 'Cognitive Science'],
    tags: ['mind', 'philosophy', 'consciousness', 'thinking'],
    depth_level: 1,
    color: '#C9A0DC',
    icon: '🔮'
  },
  {
    topic_id: 'EXIST001',
    name: 'Existentialism',
    description: 'Existentialism is a form of philosophical inquiry that explores the problem of human existence and centers on the lived experience of the thinking, feeling, acting individual. Existentialist philosophers explore questions relating to the meaning, purpose, and value of human existence. Common concepts in existentialist thought include existential crisis, freedom and responsibility, authenticity, and the absurd.',
    short_description: 'Philosophy centered on individual freedom, choice, and meaning.',
    category: 'philosophy',
    related_topics: ['Nihilism', 'Absurdism', 'Phenomenology', 'Sartre', 'Camus'],
    tags: ['existence', 'meaning', 'freedom', 'Sartre'],
    depth_level: 0,
    color: '#B8A0CC',
    icon: '🤔'
  },

  // === COSMOS CLUSTER ===
  {
    topic_id: 'BH001',
    name: 'Black Holes',
    description: 'A black hole is a region of spacetime where gravity is so strong that nothing, no particles or even electromagnetic radiation such as light, can escape from it. The theory of general relativity predicts that a sufficiently compact mass can deform spacetime to form a black hole. The boundary of no escape is called the event horizon. Black holes of stellar mass are expected to form when very massive stars collapse at the end of their life cycle.',
    short_description: 'Regions of spacetime where gravity prevents even light from escaping.',
    category: 'science',
    related_topics: ['General Relativity', 'Hawking Radiation', 'Singularity', 'Event Horizon', 'Neutron Stars'],
    tags: ['space', 'gravity', 'Einstein', 'cosmos'],
    depth_level: 0,
    color: '#6A0DAD',
    icon: '🕳️'
  },
  {
    topic_id: 'COSMO001',
    name: 'Cosmology',
    description: 'Cosmology is a branch of astronomy concerned with the study of the chronology of the universe. The physical study of the largest structures and dynamics of the universe and is concerned with fundamental questions about its formation, evolution, and ultimate fate. Cosmologists study concepts such as dark matter, dark energy, the Big Bang, cosmic inflation, and the large-scale structure of the universe.',
    short_description: 'The study of the origin, evolution, and fate of the universe.',
    category: 'science',
    related_topics: ['Big Bang', 'Dark Matter', 'Dark Energy', 'Cosmic Inflation', 'Multiverse'],
    tags: ['universe', 'origins', 'space', 'Big Bang'],
    depth_level: 0,
    color: '#483D8B',
    icon: '🌌'
  },

  // === MATHEMATICS ===
  {
    topic_id: 'CHAOS001',
    name: 'Chaos Theory',
    description: 'Chaos theory is an interdisciplinary area of scientific study and branch of mathematics focused on underlying patterns and deterministic laws of dynamical systems that are highly sensitive to initial conditions, and were once thought to have completely random states of disorder and irregularities. Chaos theory states that within the apparent randomness of chaotic complex systems, there are underlying patterns, interconnection, constant feedback loops, repetition, self-similarity, fractals and self-organization.',
    short_description: 'Study of complex systems highly sensitive to initial conditions.',
    category: 'mathematics',
    related_topics: ['Fractals', 'Butterfly Effect', 'Dynamical Systems', 'Complexity Theory', 'Strange Attractors'],
    tags: ['chaos', 'fractals', 'complexity', 'butterfly effect'],
    depth_level: 0,
    color: '#00CED1',
    icon: '🦋'
  },
  {
    topic_id: 'FRACT001',
    name: 'Fractals',
    description: 'In mathematics, a fractal is a geometric shape containing detailed structure at arbitrarily small scales, usually having a fractal dimension strictly exceeding the topological dimension. Many fractals appear similar at various scales, as illustrated in successive magnifications of the Mandelbrot set. This exhibition of similar patterns at increasingly smaller scales is called self-similarity, also known as expanding symmetry or unfolding symmetry.',
    short_description: 'Self-similar geometric patterns repeating at every scale.',
    category: 'mathematics',
    related_topics: ['Chaos Theory', 'Mandelbrot Set', 'Self-Similarity', 'Dimension', 'Iteration'],
    tags: ['fractals', 'geometry', 'infinity', 'Mandelbrot'],
    depth_level: 1,
    color: '#20B2AA',
    icon: '❄️'
  },

  // === HISTORY ===
  {
    topic_id: 'SILK001',
    name: 'Silk Road',
    description: 'The Silk Road was a network of Eurasian trade routes active from the second century BCE until the mid-15th century CE. Spanning over 6,400 km, it played a central role in facilitating economic, cultural, political, and religious interactions between the East and West. The route got its name from the lucrative trade in silk carried out along its length, beginning in the Han dynasty in China (207 BCE – 220 CE).',
    short_description: 'Ancient trade routes connecting East and West for over 1,500 years.',
    category: 'history',
    related_topics: ['Ancient China', 'Byzantine Empire', 'Marco Polo', 'Spice Trade', 'Islamic Golden Age'],
    tags: ['trade', 'ancient', 'China', 'history', 'culture'],
    depth_level: 0,
    color: '#FFB347',
    icon: '🐪'
  },

  // === NATURE ===
  {
    topic_id: 'OCE001',
    name: 'Ocean Ecosystems',
    description: 'Ocean ecosystems are aquatic environments characterized by the presence of saltwater. They include open oceans, coral reefs, estuaries, kelp forests, and the deep sea. Oceans cover more than 70% of Earth\'s surface and contain 97% of Earth\'s water. Marine ecosystems are the largest aquatic ecosystems on Earth and exist in waters that have a high salt content.',
    short_description: 'Vast interconnected marine habitats covering 70% of Earth.',
    category: 'nature',
    related_topics: ['Coral Reefs', 'Deep Sea', 'Marine Biology', 'Ocean Currents', 'Bioluminescence'],
    tags: ['ocean', 'marine', 'ecology', 'biodiversity'],
    depth_level: 0,
    color: '#1E90FF',
    icon: '🌊'
  },

  // === ARTS ===
  {
    topic_id: 'JAZZ001',
    name: 'Jazz Music',
    description: 'Jazz is a music genre that originated in the African-American communities of New Orleans, Louisiana in the late 19th and early 20th centuries, with its roots in blues and ragtime. Since the 1920s Jazz Age, it has been recognized as a major form of musical expression in traditional and popular music. Jazz is characterized by swing and blue notes, complex chords, call and response vocals, polyrhythms and improvisation.',
    short_description: 'Improvisational music genre born in New Orleans with African-American roots.',
    category: 'arts',
    related_topics: ['Blues', 'Improvisation', 'Miles Davis', 'Bebop', 'Syncopation'],
    tags: ['music', 'jazz', 'improvisation', 'culture'],
    depth_level: 0,
    color: '#FF6B9D',
    icon: '🎷'
  }
];

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/rabbit-hole-explorer';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Topic.deleteMany({});
    console.log('🗑️  Cleared existing topics');

    // Insert seed data
    await Topic.insertMany(topics);
    console.log(`✅ Seeded ${topics.length} topics successfully`);

    console.log('\n📚 Topics seeded:');
    topics.forEach(t => console.log(`  • ${t.name} (${t.category})`));

  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  }
};

seed();
