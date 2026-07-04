// ============================================================
// FAANG Prep 2026 — AI Curated Job Custom Roadmaps
// ============================================================

const DATA_CUSTOM = {
  paths: {
    "ADOBUSR169874EXTERNALENUS": {
      jobTitle: "Adobe SDE-2 (Python & Gen AI)",
      jobUrl: "https://careers.adobe.com/us/en/job/ADOBUSR169874EXTERNALENUS/SDE-2-Python-Gen-AI?utm_source=linkedin&utm_medium=phenom-feeds&source=LinkedIn",
      weeks: [
        {
          title: "Week 1: Advanced Python & Asynchronous Architectures",
          desc: "Master SDE-2 Python expectations: concurrency models, profiling memory overhead, and writing high-efficiency data structures.",
          items: [
            { text: "Deep dive into Python GIL, multiprocessing, and threading tradeoffs", type: "custom" },
            { text: "Review asyncio event loops, coroutines, and connection pooling", type: "custom" },
            { text: "Study Arrays & Hashing pattern templates and pitfalls", type: "dsa", refId: "arrays-hashing" },
            { text: "Implement a custom memory-efficient stream generator in Python", type: "custom" }
          ]
        },
        {
          title: "Week 2: Generative AI Pipelines & RAG Systems",
          desc: "Understand LLM integration patterns, orchestration frameworks, and embedding retrieval mechanics.",
          items: [
            { text: "Study LangChain/LlamaIndex memory architectures and custom prompt registries", type: "custom" },
            { text: "Learn Vector Database indexing strategies: HNSW, IVF-PQ, and cosine distance", type: "custom" },
            { text: "Read HLD Caching fundamentals (Cache-aside, stampedes)", type: "system", refId: "sd-caching" },
            { text: "Design an LLM caching layer to prevent redundant API calls to OpenAI/Adobe Firefly", type: "custom" }
          ]
        },
        {
          title: "Week 3: High-Performance ML & Gen AI System Design",
          desc: "Design scalable API gateways, rate limiting, and observability for model serving.",
          items: [
            { text: "Review HLD Rate Limiting & Message Queues patterns", type: "system", refId: "sd-ratelimit-api" },
            { text: "Design a Rate Limiter for upstream LLM providers (handling Token limits and RPM)", type: "custom" },
            { text: "Read System Design case study: RAG pipeline & LLM serving", type: "system", refId: "case-rag" },
            { text: "Analyze load balancing and routing of requests across multiple model replicas", type: "custom" }
          ]
        },
        {
          title: "Week 4: Machine Coding & Production Readiness",
          desc: "Write clean, patterns-driven code for real-world asynchronous tasks.",
          items: [
            { text: "Study SOLID principles and Design Patterns in LLD", type: "lld", refId: "lld-solid" },
            { text: "Code an asynchronous worker queue in Python with retry policies", type: "custom" },
            { text: "Conduct a mock interview focusing on Python Gen AI system tradeoffs", type: "custom" }
          ]
        }
      ]
    }
  }
};
