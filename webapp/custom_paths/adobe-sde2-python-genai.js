// ============================================================
// FAANG Prep 2026 — Custom Path: Adobe SDE-2 (Python & Gen AI)
// ============================================================

DATA_CUSTOM.paths["ADOBUSR169874EXTERNALENUS"] = {
  jobTitle: "Adobe SDE-2 (Python & Gen AI)",
  jobUrl: "https://careers.adobe.com/us/en/job/ADOBUSR169874EXTERNALENUS/SDE-2-Python-Gen-AI?utm_source=linkedin&utm_medium=phenom-feeds&source=LinkedIn",
  weeks: [
    {
      title: "Week 1: Algorithmic Foundations & Python Basics",
      desc: "Set the coding round baseline and understand advanced Python memory structures.",
      items: [
        { text: "Study the Coding Round Playbook to structure your interview communication", type: "dsa", refId: "coding-playbook" },
        { text: "Review Arrays & Hashing pattern templates and pitfalls", type: "dsa", refId: "arrays-hashing" },
        { text: "Solve 'Two Sum' problem", type: "problem", refId: "two-sum" },
        { text: "Solve 'Group Anagrams' problem", type: "problem", refId: "group-anagrams" },
        { text: "Solve 'Longest Consecutive Sequence' problem", type: "problem", refId: "longest-consecutive-sequence" },
        { text: "Understand Python memory management: ref counting, garbage collection, and custom slots", type: "custom" }
      ]
    },
    {
      title: "Week 2: Linear Data Structures, Concurrency & Caching",
      desc: "Master two-pointer traversals and initial caching architecture concepts.",
      items: [
        { text: "Review Two Pointers pattern templates and search space reduction", type: "dsa", refId: "two-pointers" },
        { text: "Review Sliding Window variable-size and fixed-size templates", type: "dsa", refId: "sliding-window" },
        { text: "Study HLD Caching fundamentals: Cache-aside, stampedes, and eviction policies", type: "system", refId: "sd-caching" },
        { text: "Solve '3Sum' problem", type: "problem", refId: "three-sum" },
        { text: "Solve 'Container With Most Water' problem", type: "problem", refId: "container-with-most-water" },
        { text: "Solve 'Longest Substring Without Repeating Characters' problem", type: "problem", refId: "longest-substring-without-repeating" },
        { text: "Understand Python concurrency models: Threading, Multiprocessing, and GIL tradeoffs", type: "custom" }
      ]
    },
    {
      title: "Week 3: Stack, Heaps & Message Queues + Asyncio",
      desc: "Learn about queue structures, scheduling, and asynchronous programming in Python.",
      items: [
        { text: "Review Stack & Monotonic Stack templates", type: "dsa", refId: "stack" },
        { text: "Review Heaps/Priority Queue patterns for streaming and top-k data", type: "dsa", refId: "heap" },
        { text: "Study HLD Message Queues & Async Processing (Kafka vs SQS)", type: "system", refId: "sd-queues" },
        { text: "Solve 'Valid Parentheses' problem", type: "problem", refId: "valid-parentheses" },
        { text: "Solve 'Daily Temperatures' problem", type: "problem", refId: "daily-temperatures" },
        { text: "Solve 'Task Scheduler' problem", type: "problem", refId: "task-scheduler" },
        { text: "Deep dive into Python asyncio event loops, coroutines, and connection pooling", type: "custom" }
      ]
    },
    {
      title: "Week 4: Binary Search, Intervals & API Gateways",
      desc: "Prepare for optimal searching and rate-limiting systems.",
      items: [
        { text: "Review Binary Search lower-bound/first-true templates", type: "dsa", refId: "binary-search" },
        { text: "Review Intervals merge-sweep and overlap algorithms", type: "dsa", refId: "intervals" },
        { text: "Study HLD API Design & Rate Limiting algorithms (Token Bucket, sliding logs)", type: "system", refId: "sd-ratelimit-api" },
        { text: "Solve 'Search in Rotated Sorted Array' problem", type: "problem", refId: "search-in-rotated-sorted-array" },
        { text: "Solve 'Merge Intervals' problem", type: "problem", refId: "merge-intervals" },
        { text: "Design a distributed Token Bucket rate limiter in Python using Redis for synchronization", type: "custom" }
      ]
    },
    {
      title: "Week 5: Linked Lists, Tries & Distributed Database Scaling",
      desc: "Master key-value designs, custom search structures, and DB partitioning.",
      items: [
        { text: "Review Linked List pointer operations (dummy head, reversal)", type: "dsa", refId: "linked-list" },
        { text: "Review Trie prefix tree structures", type: "dsa", refId: "tries" },
        { text: "Study Database scaling: Replication, master-slave lag, and sharding keys", type: "system", refId: "sd-database" },
        { text: "Study SQL vs NoSQL architectural tradeoffs", type: "system", refId: "sd-sql-nosql" },
        { text: "Solve 'LRU Cache' problem", type: "problem", refId: "lru-cache" },
        { text: "Solve 'LFU Cache' problem", type: "problem", refId: "lfu-cache" },
        { text: "Study data pipeline patterns for large-scale processing: batch vs streaming (Spark/Flink), idempotent writes, CDC, and schema evolution", type: "custom" },
        { text: "Implement a thread-safe LRU Cache with TTL expiration from scratch in Python", type: "custom" }
      ]
    },
    {
      title: "Week 6: Trees, Graphs & Realtime Web Delivery",
      desc: "Learn hierarchical algorithms, graph traversals, and live stream routing.",
      items: [
        { text: "Review Trees (DFS/BFS traversals, range BST tricks)", type: "dsa", refId: "trees" },
        { text: "Review Graph representation and matrix/grid boundary checks", type: "dsa", refId: "graphs" },
        { text: "Review Matrix & 2D Grids traversals", type: "dsa", refId: "matrix-grids" },
        { text: "Study HLD Realtime Delivery: WebSockets, Server-Sent Events (SSE) and polling", type: "system", refId: "sd-realtime" },
        { text: "Solve 'Validate Binary Search Tree' problem", type: "problem", refId: "validate-binary-search-tree" },
        { text: "Solve 'Number of Islands' problem", type: "problem", refId: "number-of-islands" },
        { text: "Solve 'Course Schedule' problem", type: "problem", refId: "course-schedule" }
      ]
    },
    {
      title: "Week 7: Advanced Graph Algorithms & LLD Patterns",
      desc: "Cover advanced routing, SOLID design patterns, and network partitions.",
      items: [
        { text: "Review Advanced Graphs (Dijkstra, Union-Find, Topo Sort)", type: "dsa", refId: "adv-graphs" },
        { text: "Study SOLID Principles in Low-Level Design", type: "lld", refId: "lld-solid" },
        { text: "Study LLD Core Patterns: Strategy, Factory, Observer, and Singleton", type: "lld", refId: "lld-patterns-core" },
        { text: "Study CAP Theorem and Consistency models (strong, linearizable, eventual)", type: "system", refId: "sd-cap" },
        { text: "Study Consistent Hashing ring mechanics and virtual node balance", type: "system", refId: "sd-consistent-hashing" },
        { text: "Solve 'Network Delay Time' problem", type: "problem", refId: "network-delay-time" }
      ]
    },
    {
      title: "Week 8: Generative AI Pipelines & RAG Architecture",
      desc: "Master Vector DB indexing, chunking trade-offs, and document permission rules.",
      items: [
        { text: "Study HLD Case Study: AI RAG Pipeline details", type: "system", refId: "case-rag" },
        { text: "Understand Vector Database index types: HNSW graphs, IVF-PQ vector quantization", type: "custom" },
        { text: "Study knowledge graphs & semantic search for enterprise knowledge retrieval: entity/relation extraction, graph-augmented RAG, and hybrid vector+graph retrieval", type: "custom" },
        { text: "Analyze ingestion pipelines: heading-aware chunking, sliding overlaps, and CDC sync", type: "custom" },
        { text: "Implement a semantic prompt caching layer in Python using vector similarity thresholds", type: "custom" },
        { text: "Verify ACL-filtering at the search retrieval layer (not post-retrieval) to prevent leaks", type: "custom" }
      ]
    },
    {
      title: "Week 9: Agentic loops, Orchestration & Model Serving",
      desc: "Learn about autonomous LLM loops, multi-agent frameworks, and GPU serving mechanics.",
      items: [
        { text: "Study HLD Case Study: LLM Inference & Agent Serving Systems", type: "system", refId: "case-llm-serving" },
        { text: "Explore agent orchestration: LangChain, LlamaIndex, and LangGraph stateful loops", type: "custom" },
        { text: "Study multi-agent communication protocols: AutoGen queues and CrewAI role execution", type: "custom" },
        { text: "Understand GPU serving economics: continuous batching, prefill vs decode, and PagedAttention", type: "custom" },
        { text: "Implement human-in-the-loop validation gates and token-burn budgets to prevent runaways", type: "custom" }
      ]
    },
    {
      title: "Week 10: LLD / Machine Coding & System Resilience",
      desc: "Build fault-tolerant systems and write production-grade concurrent scripts.",
      items: [
        { text: "Study LLD Concurrency & Thread-safe structures", type: "lld", refId: "lld-concurrency" },
        { text: "Study HLD Observability: RED metrics, distributed tracing, and log correlation", type: "system", refId: "sd-observability" },
        { text: "Code an asynchronous worker queue in Python with exponential backoffs and dead-letter queues", type: "custom" },
        { text: "Design a secure sandbox environment for execution of unverified agent tool code", type: "custom" }
      ]
    },
    {
      title: "Week 11: Distributed Transactions, API Security & STAR Stories",
      desc: "Handle multi-service consistency, token auth, and behavioral loops.",
      items: [
        { text: "Study HLD Distributed Transactions: 2PC vs Saga orchestration and choreography", type: "system", refId: "sd-transactions" },
        { text: "Study HLD Auth and API Security (JWT, OAuth2, gateway validation)", type: "system", refId: "sd-auth" },
        { text: "Draft 8 behavioral stories in the STAR format targeting SDE-2 criteria (Autonomy, Ambiguity, Mentoring)", type: "custom" },
        { text: "Review key security pitfalls: prompt injection handling and system prompt isolation", type: "custom" }
      ]
    },
    {
      title: "Week 12: Capstone Mock Interviews & MLOps/LLMOps Review",
      desc: "Final preparations, mock interviews, and containerized deployment basics.",
      items: [
        { text: "Solve 'Binary Tree Maximum Path Sum' problem", type: "problem", refId: "binary-tree-max-path-sum" },
        { text: "Solve 'Find Median from Data Stream' problem", type: "problem", refId: "median-from-data-stream" },
        { text: "Solve 'Word Search II' problem", type: "problem", refId: "word-search-ii" },
        { text: "Review containerization & orchestration: Docker, Kubernetes, and pod autoscaling", type: "custom" },
        { text: "Review cloud-native deployment on Azure/AWS/GCP: managed Kubernetes (AKS/EKS/GKE), managed vector/DB services, autoscaling and cost tradeoffs", type: "custom" },
        { text: "Review model compression & quantization formats: GGUF, GPTQ, AWQ", type: "custom" },
        { text: "Study MLOps/LLMOps evaluation & monitoring: model/prompt versioning, offline eval harnesses, A/B testing, and drift/hallucination monitoring", type: "custom" },
        { text: "Perform a full 45-minute timed system design mock and a 45-minute coding round mock", type: "custom" }
      ]
    }
  ]
};
