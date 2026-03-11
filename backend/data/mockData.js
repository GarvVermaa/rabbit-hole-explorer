// Comprehensive mock knowledge graph dataset
const MOCK_TOPICS = [
  // === ARTIFICIAL INTELLIGENCE ===
  {
    topic_id: "AI001",
    name: "Artificial Intelligence",
    description: "The simulation of human intelligence processes by computer systems, including learning, reasoning, and self-correction. AI is transforming every industry from healthcare to finance.",
    category: "Technology",
    tags: ["AI", "technology", "computing", "automation"],
    related_topics: ["ML001", "ROB001", "CV001", "NLP001", "ET001"],
    depth: 0,
    color: "#4f8ef7",
    icon: "🤖"
  },
  {
    topic_id: "ML001",
    name: "Machine Learning",
    description: "A subset of AI where systems learn and improve from experience without being explicitly programmed. Algorithms build models from sample data to make predictions.",
    category: "Technology",
    tags: ["ML", "algorithms", "data science", "AI"],
    related_topics: ["DL001", "SL001", "RL001", "AI001", "DS001"],
    depth: 1,
    color: "#7c6af7",
    icon: "🧠"
  },
  {
    topic_id: "DL001",
    name: "Deep Learning",
    description: "A subset of machine learning using neural networks with many layers to analyze data with complex structures. Powers image recognition, speech synthesis, and language models.",
    category: "Technology",
    tags: ["neural networks", "deep learning", "AI", "ML"],
    related_topics: ["NN001", "TR001", "CNN001", "ML001", "GP001"],
    depth: 2,
    color: "#b06af7",
    icon: "🔬"
  },
  {
    topic_id: "TR001",
    name: "Transformers",
    description: "A revolutionary neural network architecture using self-attention mechanisms. Powers modern language models like GPT and BERT, enabling breakthrough NLP capabilities.",
    category: "Technology",
    tags: ["transformers", "attention", "NLP", "GPT", "BERT"],
    related_topics: ["DL001", "NLP001", "GPT001", "AT001", "LM001"],
    depth: 3,
    color: "#f76ab7",
    icon: "⚡"
  },
  {
    topic_id: "NLP001",
    name: "Natural Language Processing",
    description: "The branch of AI dealing with the interaction between computers and human languages. Enables machines to read, understand, and derive meaning from human language.",
    category: "Technology",
    tags: ["NLP", "language", "text analysis", "AI"],
    related_topics: ["TR001", "AI001", "SEN001", "MT001", "CB001"],
    depth: 1,
    color: "#f7a06a",
    icon: "💬"
  },
  {
    topic_id: "ROB001",
    name: "Robotics",
    description: "The interdisciplinary branch combining computer science and engineering to design robots that can perform tasks autonomously or semi-autonomously.",
    category: "Technology",
    tags: ["robots", "automation", "engineering", "AI"],
    related_topics: ["AI001", "CV001", "AC001", "IOT001", "MAN001"],
    depth: 1,
    color: "#6af7b0",
    icon: "🦾"
  },
  {
    topic_id: "CV001",
    name: "Computer Vision",
    description: "A field of AI that trains computers to interpret and understand the visual world from images and videos, enabling object detection, facial recognition, and scene understanding.",
    category: "Technology",
    tags: ["vision", "image processing", "AI", "recognition"],
    related_topics: ["DL001", "AI001", "OR001", "IMG001", "AR001"],
    depth: 1,
    color: "#f7e06a",
    icon: "👁️"
  },
  {
    topic_id: "NN001",
    name: "Neural Networks",
    description: "Computing systems inspired by biological neural networks in animal brains. Consists of layers of interconnected nodes that process information using connectionist approaches.",
    category: "Technology",
    tags: ["neural", "AI", "brain-inspired", "computing"],
    related_topics: ["DL001", "ML001", "BIO001", "NC001"],
    depth: 3,
    color: "#9af76a",
    icon: "🕸️"
  },

  // === QUANTUM COMPUTING ===
  {
    topic_id: "QC001",
    name: "Quantum Computing",
    description: "Computation using quantum-mechanical phenomena like superposition and entanglement. Quantum computers can solve certain problems exponentially faster than classical computers.",
    category: "Physics/Technology",
    tags: ["quantum", "computing", "physics", "qubits"],
    related_topics: ["QP001", "QE001", "CR001", "QA001", "PHY001"],
    depth: 0,
    color: "#6adef7",
    icon: "⚛️"
  },
  {
    topic_id: "QP001",
    name: "Quantum Physics",
    description: "The branch of physics studying behavior at atomic and subatomic levels. Describes the nature of particles and waves, uncertainty principles, and quantum states.",
    category: "Physics",
    tags: ["physics", "quantum mechanics", "particles", "waves"],
    related_topics: ["QC001", "STR001", "PHY001", "QE001", "TH001"],
    depth: 1,
    color: "#6af7d8",
    icon: "🔭"
  },
  {
    topic_id: "QE001",
    name: "Quantum Entanglement",
    description: "A phenomenon where pairs of particles interact so that the quantum state of each particle cannot be described independently of the others, regardless of distance.",
    category: "Physics",
    tags: ["entanglement", "quantum", "physics", "spooky action"],
    related_topics: ["QP001", "QC001", "QT001", "REL001"],
    depth: 2,
    color: "#6af7f7",
    icon: "🔗"
  },

  // === SPACE EXPLORATION ===
  {
    topic_id: "SP001",
    name: "Space Exploration",
    description: "The ongoing discovery and exploration of celestial structures using space technology. Humanity's quest to understand the cosmos, from Moon missions to Mars colonization plans.",
    category: "Science",
    tags: ["space", "NASA", "astronomy", "rockets"],
    related_topics: ["AST001", "MARS001", "BH001", "ROC001", "SAT001"],
    depth: 0,
    color: "#1a1a4e",
    icon: "🚀"
  },
  {
    topic_id: "BH001",
    name: "Black Holes",
    description: "Regions of spacetime where gravity is so strong that nothing, not even light or electromagnetic radiation, can escape once past the event horizon.",
    category: "Astrophysics",
    tags: ["black holes", "gravity", "spacetime", "Einstein"],
    related_topics: ["SP001", "REL001", "STR001", "GR001", "QP001"],
    depth: 1,
    color: "#2d0a4e",
    icon: "🌑"
  },
  {
    topic_id: "MARS001",
    name: "Mars Colonization",
    description: "The theoretical and ongoing effort to settle on Mars. SpaceX, NASA, and other agencies are developing technologies to enable permanent human presence on the Red Planet.",
    category: "Space",
    tags: ["Mars", "colonization", "SpaceX", "terraforming"],
    related_topics: ["SP001", "TER001", "LIFE001", "ROC001", "SUIT001"],
    depth: 1,
    color: "#c1440e",
    icon: "🔴"
  },
  {
    topic_id: "AST001",
    name: "Astrophysics",
    description: "The branch of astronomy concerned with the physical nature of stars, galaxies, and the universe. Studies the birth, life, and death of cosmic objects.",
    category: "Science",
    tags: ["stars", "galaxies", "universe", "physics"],
    related_topics: ["SP001", "BH001", "DM001", "STR001", "CMB001"],
    depth: 1,
    color: "#4e3a8e",
    icon: "✨"
  },

  // === GENETICS & BIOLOGY ===
  {
    topic_id: "GEN001",
    name: "Genetics",
    description: "The study of genes, genetic variation, and heredity in organisms. Encompasses molecular genetics, population genetics, and genomics to understand inheritance and evolution.",
    category: "Biology",
    tags: ["DNA", "genes", "heredity", "biology"],
    related_topics: ["DNA001", "EVO001", "CRISPR001", "PRO001", "EPIG001"],
    depth: 0,
    color: "#4ef77a",
    icon: "🧬"
  },
  {
    topic_id: "DNA001",
    name: "DNA & Genome",
    description: "Deoxyribonucleic acid — the molecule carrying genetic instructions for development, functioning, growth, and reproduction of all known organisms.",
    category: "Biology",
    tags: ["DNA", "genome", "genetics", "biology"],
    related_topics: ["GEN001", "CRISPR001", "EVO001", "PRO001"],
    depth: 1,
    color: "#4ef7a5",
    icon: "🔬"
  },
  {
    topic_id: "CRISPR001",
    name: "CRISPR Gene Editing",
    description: "A revolutionary genetic engineering technique that allows scientists to edit DNA sequences with unprecedented precision, potentially curing genetic diseases.",
    category: "Biotechnology",
    tags: ["CRISPR", "gene editing", "biotechnology", "medicine"],
    related_topics: ["DNA001", "GEN001", "MED001", "ETHB001", "SYN001"],
    depth: 2,
    color: "#4ef7c5",
    icon: "✂️"
  },
  {
    topic_id: "EVO001",
    name: "Evolution",
    description: "The change in heritable characteristics of biological populations over successive generations. Darwin's natural selection explains the diversity of life on Earth.",
    category: "Biology",
    tags: ["Darwin", "natural selection", "species", "adaptation"],
    related_topics: ["GEN001", "PALEO001", "ECO001", "ANTHRO001", "DNA001"],
    depth: 1,
    color: "#7af74e",
    icon: "🦎"
  },

  // === PHILOSOPHY ===
  {
    topic_id: "PHIL001",
    name: "Philosophy",
    description: "The study of fundamental questions about existence, knowledge, values, reason, mind, and language. Philosophy shapes how we think about everything from ethics to reality.",
    category: "Humanities",
    tags: ["philosophy", "ethics", "metaphysics", "logic"],
    related_topics: ["CONS001", "ETH001", "MET001", "EPIS001", "LOGIC001"],
    depth: 0,
    color: "#c8b400",
    icon: "🦉"
  },
  {
    topic_id: "CONS001",
    name: "Consciousness",
    description: "The state of being aware and able to think. The hard problem of consciousness asks how and why physical processes in the brain give rise to subjective experience.",
    category: "Philosophy/Neuroscience",
    tags: ["consciousness", "mind", "awareness", "philosophy"],
    related_topics: ["PHIL001", "NEURO001", "QM001", "AI001", "ZOM001"],
    depth: 1,
    color: "#e8c800",
    icon: "💭"
  },

  // === NEUROSCIENCE ===
  {
    topic_id: "NEURO001",
    name: "Neuroscience",
    description: "The scientific study of the nervous system — the brain, spinal cord, and neural networks. Explores how neural circuits create thought, memory, emotion, and behavior.",
    category: "Science",
    tags: ["brain", "neurons", "nervous system", "cognition"],
    related_topics: ["CONS001", "MEM001", "NEUR2001", "NC001", "PSY001"],
    depth: 0,
    color: "#f76a6a",
    icon: "🧠"
  },
  {
    topic_id: "MEM001",
    name: "Memory & Learning",
    description: "The cognitive processes by which the brain encodes, stores, and retrieves information. Long-term potentiation, neuroplasticity, and synaptic pruning shape how we remember.",
    category: "Neuroscience",
    tags: ["memory", "learning", "brain", "cognition", "neuroplasticity"],
    related_topics: ["NEURO001", "SLEEP001", "CONS001", "PSY001"],
    depth: 1,
    color: "#f79a6a",
    icon: "💾"
  },

  // === CLIMATE & ENVIRONMENT ===
  {
    topic_id: "CLI001",
    name: "Climate Change",
    description: "Long-term shifts in global temperatures and weather patterns. While some change is natural, human activities since the industrial era have accelerated warming at unprecedented rates.",
    category: "Environment",
    tags: ["climate", "global warming", "CO2", "environment"],
    related_topics: ["RE001", "ECO001", "GEO001", "OCE001", "CARB001"],
    depth: 0,
    color: "#f7c36a",
    icon: "🌍"
  },
  {
    topic_id: "RE001",
    name: "Renewable Energy",
    description: "Energy from naturally replenishing sources: solar, wind, hydro, geothermal, and biomass. The transition to renewables is central to addressing climate change.",
    category: "Energy",
    tags: ["solar", "wind", "green energy", "sustainability"],
    related_topics: ["CLI001", "SOL001", "WIND001", "BATT001", "GRID001"],
    depth: 1,
    color: "#f7f06a",
    icon: "☀️"
  },
  {
    topic_id: "ECO001",
    name: "Ecology",
    description: "The branch of biology studying organisms' relationships with each other and their environment. Examines ecosystems, food webs, biodiversity, and environmental balance.",
    category: "Biology",
    tags: ["ecology", "ecosystems", "biodiversity", "environment"],
    related_topics: ["CLI001", "EVO001", "BIO001", "BIOD001", "ECO2001"],
    depth: 1,
    color: "#a7f76a",
    icon: "🌿"
  },

  // === CRYPTO & BLOCKCHAIN ===
  {
    topic_id: "BC001",
    name: "Blockchain",
    description: "A distributed ledger technology that records transactions across many computers so that records cannot be altered retroactively. Foundation for cryptocurrencies and Web3.",
    category: "Technology",
    tags: ["blockchain", "crypto", "distributed", "ledger"],
    related_topics: ["BTC001", "ETH001", "WEB3001", "DEFI001", "NFT001"],
    depth: 0,
    color: "#f7a06a",
    icon: "⛓️"
  },
  {
    topic_id: "BTC001",
    name: "Bitcoin",
    description: "The first decentralized cryptocurrency, created by pseudonymous Satoshi Nakamoto in 2008. Uses blockchain to enable peer-to-peer transactions without central authority.",
    category: "Finance/Technology",
    tags: ["bitcoin", "cryptocurrency", "Satoshi", "mining"],
    related_topics: ["BC001", "CRYPTO001", "DEFI001", "MINE001"],
    depth: 1,
    color: "#f7801e",
    icon: "₿"
  },
  {
    topic_id: "DEFI001",
    name: "Decentralized Finance",
    description: "Financial services using blockchain technology without traditional intermediaries. Includes lending, trading, and earning yield through smart contracts and protocols.",
    category: "Finance/Technology",
    tags: ["DeFi", "finance", "smart contracts", "crypto"],
    related_topics: ["BC001", "BTC001", "ETH001", "SC001", "YIELD001"],
    depth: 2,
    color: "#f7a030",
    icon: "💰"
  },

  // === MATHEMATICS ===
  {
    topic_id: "MATH001",
    name: "Mathematics",
    description: "The abstract science of number, quantity, and space. Pure mathematics explores patterns and structures; applied mathematics solves real-world problems.",
    category: "Mathematics",
    tags: ["math", "numbers", "logic", "proof"],
    related_topics: ["CALC001", "ALG001", "TOPO001", "PROB001", "CHAOS001"],
    depth: 0,
    color: "#6a8ef7",
    icon: "∑"
  },
  {
    topic_id: "CHAOS001",
    name: "Chaos Theory",
    description: "The study of dynamic systems highly sensitive to initial conditions — the butterfly effect. Small changes in starting conditions lead to vastly different outcomes.",
    category: "Mathematics/Physics",
    tags: ["chaos", "butterfly effect", "dynamical systems", "fractals"],
    related_topics: ["MATH001", "FRAC001", "COMP001", "PHY001", "WEA001"],
    depth: 1,
    color: "#8a6af7",
    icon: "🦋"
  },
  {
    topic_id: "PROB001",
    name: "Probability & Statistics",
    description: "The mathematical framework for quantifying uncertainty and analyzing data. Bayesian probability, statistical inference, and distributions underpin modern data science.",
    category: "Mathematics",
    tags: ["probability", "statistics", "Bayes", "data"],
    related_topics: ["MATH001", "ML001", "DS001", "INF001"],
    depth: 1,
    color: "#6a9ef7",
    icon: "🎲"
  },

  // === PSYCHOLOGY ===
  {
    topic_id: "PSY001",
    name: "Psychology",
    description: "The scientific study of mind and behavior. Explores how people think, feel, and act individually and in groups, from cognitive processes to social dynamics.",
    category: "Social Science",
    tags: ["psychology", "behavior", "mind", "cognitive"],
    related_topics: ["NEURO001", "CONS001", "SOC001", "BEHAV001", "MH001"],
    depth: 0,
    color: "#f76af7",
    icon: "🧘"
  },

  // === INTERNET & WEB ===
  {
    topic_id: "INT001",
    name: "Internet & Web",
    description: "The global system of interconnected computer networks and the World Wide Web built upon it. From ARPANET origins to today's hyperconnected digital civilization.",
    category: "Technology",
    tags: ["internet", "web", "networks", "digital"],
    related_topics: ["BC001", "AI001", "IOT001", "SEC001", "CLOUD001"],
    depth: 0,
    color: "#4af7e8",
    icon: "🌐"
  },
  {
    topic_id: "IOT001",
    name: "Internet of Things",
    description: "The network of physical objects embedded with sensors and software to connect and exchange data over the internet, from smart homes to industrial systems.",
    category: "Technology",
    tags: ["IoT", "smart devices", "sensors", "connected"],
    related_topics: ["INT001", "ROB001", "AI001", "EDGE001", "SEC001"],
    depth: 1,
    color: "#4af7c8",
    icon: "📡"
  },

  // === MEDICINE ===
  {
    topic_id: "MED001",
    name: "Medicine & Healthcare",
    description: "The science and practice of diagnosing, treating, and preventing disease. Modern medicine integrates biology, chemistry, physics, and increasingly AI and genomics.",
    category: "Medicine",
    tags: ["medicine", "health", "disease", "treatment"],
    related_topics: ["CRISPR001", "AI001", "NEURO001", "DRUG001", "NANO001"],
    depth: 0,
    color: "#f76a8a",
    icon: "⚕️"
  },
  {
    topic_id: "NANO001",
    name: "Nanotechnology",
    description: "Manipulation of matter at an atomic and molecular scale (1-100 nanometers). Enables revolutionary applications in medicine, materials, electronics, and energy.",
    category: "Technology/Science",
    tags: ["nano", "materials", "medicine", "molecular"],
    related_topics: ["MED001", "CRISPR001", "MAT001", "DRUG001"],
    depth: 1,
    color: "#f76ab0",
    icon: "🔩"
  },

  // Extra topics for graph density
  {
    topic_id: "RL001",
    name: "Reinforcement Learning",
    description: "A type of machine learning where an agent learns by interacting with an environment, receiving rewards or penalties, and optimizing for long-term gain.",
    category: "Technology",
    tags: ["RL", "games", "AI", "rewards"],
    related_topics: ["ML001", "DL001", "GAME001", "ROB001"],
    depth: 2,
    color: "#a06af7",
    icon: "🎮"
  },
  {
    topic_id: "DS001",
    name: "Data Science",
    description: "An interdisciplinary field using scientific methods, processes, and algorithms to extract knowledge from structured and unstructured data.",
    category: "Technology",
    tags: ["data", "analytics", "statistics", "ML"],
    related_topics: ["ML001", "PROB001", "VIS001", "DB001"],
    depth: 1,
    color: "#f7d06a",
    icon: "📊"
  },
  {
    topic_id: "STR001",
    name: "String Theory",
    description: "A theoretical physics framework proposing that fundamental particles are not points but one-dimensional strings. Attempts to reconcile quantum mechanics with general relativity.",
    category: "Physics",
    tags: ["string theory", "physics", "dimensions", "TOE"],
    related_topics: ["QP001", "BH001", "REL001", "PHY001", "MATH001"],
    depth: 2,
    color: "#c86af7",
    icon: "〰️"
  },
  {
    topic_id: "REL001",
    name: "General Relativity",
    description: "Einstein's theory describing gravity as the curvature of spacetime caused by mass and energy. Predicts black holes, gravitational waves, and the expansion of the universe.",
    category: "Physics",
    tags: ["Einstein", "relativity", "gravity", "spacetime"],
    related_topics: ["BH001", "QP001", "STR001", "GW001", "SP001"],
    depth: 2,
    color: "#7a6af7",
    icon: "🌀"
  },
];

module.exports = MOCK_TOPICS;
