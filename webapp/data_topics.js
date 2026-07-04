// ============================================================
// FAANG Prep 2026 — Specialized Topic Library
// ============================================================
// A shared, categorized library of role-specific "deep dive"
// topics (Python internals, GenAI/LLM systems, AI security,
// MLOps/deployment, data/distributed systems). Custom job
// roadmaps reference these by id via { type: "topic", refId }
// so the same authored explanation + visualization is reused
// across every job that needs it -- exactly like DATA_PROBLEMS,
// DATA_DSA, DATA_SYSTEM, and DATA_LLD.
//
// Each topic: { name, category, summary, visual, details }.
//   - visual  : inline HTML injected as-is (reuse the site's
//               viz CSS: .sdd .frow .nd .fa .viz-label .viz-note
//               .duo .viz-bars .ibar). Safe to use <small>/<em>.
//   - details : markdown strings rendered through md() -- ONLY
//               **bold** and `code` are supported, nothing else.
// No emojis (repo convention).

const DATA_TOPICS = {
  categories: [
    { id: "python-internals", name: "Python Internals" },
    { id: "genai-llm", name: "GenAI & LLM Systems" },
    { id: "ai-security", name: "AI Security" },
    { id: "mlops-deploy", name: "MLOps & Deployment" },
    { id: "data-distributed", name: "Data & Distributed Systems" }
  ],
  topics: {
    // ---------------------------------------------------------
    // Python Internals
    // ---------------------------------------------------------
    "py-memory-model": {
      name: "Python Memory Model & GC",
      category: "python-internals",
      summary: "CPython frees objects the instant their reference count hits zero; a generational collector exists only to break reference cycles.",
      visual: `<div class="sdd"><div class="viz-label">Two reclamation mechanisms -- refcounting does most of the work, GC only breaks cycles</div><div class="frow"><span class="nd nd-s">obj refcount 2</span><span class="fa">-- del ref --&gt;</span><span class="nd nd-s">1</span><span class="fa">-- del ref --&gt;</span><span class="nd nd-d">0 &rarr; freed now</span></div><div class="frow frow-sub"><span class="nd nd-q">A &rlarr; B cycle</span><span class="fa">refcount never 0 --&gt;</span><span class="nd nd-e">gen GC sweeps it</span></div><div class="viz-note"><small>__slots__ drops the per-instance __dict__ -- a big memory win on many small objects</small></div></div>`,
      details: [
        "**Reference counting is primary.** Every object carries a count; CPython frees it deterministically the moment the last reference goes away -- no waiting for a collector. This is why `with` blocks and `del` release resources promptly.",
        "**The cyclic GC is secondary.** Refcounting cannot reclaim `A -> B -> A` cycles. A generational collector (gens 0/1/2) periodically finds unreachable cycles; long-lived objects get promoted to older generations that are scanned less often.",
        "**GIL connection.** Refcount updates are not atomic, so the Global Interpreter Lock protects them -- one reason CPython threads don't run bytecode in parallel (see the Python Concurrency topic).",
        "**__slots__.** Declaring `__slots__` removes the per-instance `__dict__`, cutting memory and speeding attribute access -- it matters when you allocate millions of small objects (embeddings, graph nodes).",
        "**Memory doesn't always return to the OS.** CPython keeps freed small blocks in its own `pymalloc` arenas and free-lists, so RSS can stay high after a spike. For large transient buffers use `numpy`/`bytearray`, or a subprocess you can kill.",
        "**Interview move.** Lead with refcount-first, GC-for-cycles; then mention `gc.disable()` in tight latency loops and `weakref` to avoid keeping large caches alive."
      ]
    },
    "py-concurrency": {
      name: "Python Concurrency & the GIL",
      category: "python-internals",
      summary: "The GIL serializes Python bytecode, so pick threads for I/O-bound waits and processes (or native/async) for CPU-bound work.",
      visual: `<div class="sdd"><div class="viz-label">Match the tool to the bottleneck</div><div class="duo"><div><strong>I/O-bound</strong> (network, disk, DB) &rarr; threads or asyncio. The GIL is released during blocking I/O, so waiting threads overlap.</div><div><strong>CPU-bound</strong> (parsing, math, crypto) &rarr; multiprocessing or native libs (NumPy, C ext) that drop the GIL. Threads give near-zero speedup here.</div></div><div class="viz-note"><small>3.13+ ships an experimental free-threaded (no-GIL) build -- know it exists, not yet the default</small></div></div>`,
      details: [
        "**What the GIL is.** One lock lets only a single thread execute Python bytecode at a time (it protects refcounts). CPU-bound threads therefore run effectively serially.",
        "**Threading wins for I/O.** The GIL is released around blocking syscalls (socket reads, `requests`, DB drivers), so N threads waiting on I/O overlap their waits -- great for fanning out API calls.",
        "**Multiprocessing for CPU.** Separate processes are separate interpreters, giving true parallelism at the cost of IPC/pickling and higher memory. Use `ProcessPoolExecutor`, or offload to NumPy/PyTorch which release the GIL in C.",
        "**asyncio is single-threaded concurrency.** Cooperative coroutines on one event loop, ideal for tens of thousands of concurrent connections without thread overhead. Never call blocking code inside it (see the Python Asyncio topic).",
        "**Free-threading (PEP 703).** 3.13 has an experimental `--disable-gil` build. Cite it as the future direction; don't assume it in production yet.",
        "**Interview move.** Ask 'is this I/O- or CPU-bound?' first -- that one question picks the model. For a GenAI backend (mostly awaiting model and DB calls) the answer is almost always async or threads."
      ]
    },
    "py-asyncio": {
      name: "Python Asyncio & Event Loops",
      category: "python-internals",
      summary: "A single-threaded event loop interleaves thousands of coroutines by switching at every await -- as long as nothing blocks it.",
      visual: `<div class="sdd"><div class="viz-label">One loop, many coroutines -- control returns to the loop at every await</div><div class="frow"><span class="nd nd-e">event loop</span><span class="fa">&rarr;</span><span class="nd nd-s">coro A await db</span><span class="fa">yield&rarr;</span><span class="nd nd-s">coro B await http</span><span class="fa">yield&rarr;</span><span class="nd nd-s">coro C</span></div><div class="viz-note"><small>One blocking call (time.sleep, heavy CPU, a sync driver) freezes ALL coroutines -- offload it</small></div></div>`,
      details: [
        "**Coroutines, not threads.** `async def` functions suspend at `await`, handing control back to the loop. No preemption and no lock contention -- but also no parallelism (one thread).",
        "**The cardinal rule: never block the loop.** A synchronous DB driver, `time.sleep`, `requests`, or a CPU-heavy loop stalls every coroutine. Use async drivers (`asyncpg`, `httpx`), `asyncio.sleep`, and push CPU work to `run_in_executor` or a process pool.",
        "**Concurrency primitives.** `asyncio.gather` fans out awaitables; `TaskGroup` (3.11+) gives structured concurrency with clean cancellation; `Semaphore` bounds concurrency (for example, capping simultaneous LLM calls).",
        "**Connection pooling.** Reuse pooled clients (DB, HTTP, vector store) across requests; opening a fresh connection per request destroys throughput. Bound the pool to protect downstreams.",
        "**Timeouts and cancellation.** Wrap external calls in `asyncio.timeout`/`wait_for`; a hung LLM or vector-DB call must not pin a slot forever. Handle `CancelledError` to release resources.",
        "**Why it fits GenAI backends.** A RAG request is mostly waiting (embed, then vector search, then LLM). Async lets one process hold thousands of in-flight requests cheaply (see the LLM Serving Economics topic)."
      ]
    },

    // ---------------------------------------------------------
    // GenAI & LLM Systems
    // ---------------------------------------------------------
    "vector-db-indexes": {
      name: "Vector Database Indexes (HNSW, IVF-PQ)",
      category: "genai-llm",
      summary: "Approximate nearest-neighbor indexes trade a little recall for massive speed; HNSW optimizes latency, IVF-PQ optimizes memory.",
      visual: `<div class="sdd"><div class="viz-label">Approximate nearest neighbor -- trade exact recall for sublinear search</div><div class="duo"><div><strong>HNSW</strong> -- navigable small-world graph. Very fast, high recall, RAM-hungry. Tune <em>M</em> (edges) and <em>efSearch</em> (candidates). Default for low latency.</div><div><strong>IVF-PQ</strong> -- cluster into cells (nprobe) plus product-quantize vectors. Much smaller memory, slight recall loss. Default for billion-scale on a budget.</div></div><div class="viz-note"><small>Flat (brute-force) is exact but O(N) -- fine under ~100k vectors, and the baseline to beat</small></div></div>`,
      details: [
        "**Why ANN.** Exact nearest-neighbor over millions of high-dimensional vectors is `O(N*d)` per query. Approximate indexes get you sub-millisecond search at roughly 95-99% recall.",
        "**HNSW.** A multi-layer proximity graph you traverse greedily. `efSearch`/`efConstruction` and `M` trade recall against latency and memory. Best when latency is king and vectors fit in RAM.",
        "**IVF.** Partition space into `nlist` Voronoi cells; at query time probe the `nprobe` nearest cells. Higher `nprobe` means better recall but slower search. Cheap to build.",
        "**PQ (product quantization).** Split each vector into subvectors and encode each with a small codebook -- 8-32x compression so billions of vectors fit in RAM, at some recall cost. Often stacked as IVF-PQ.",
        "**Distance metric matters.** Cosine vs dot vs L2 must match how the embeddings were trained; normalize vectors for cosine. The wrong metric silently tanks retrieval quality.",
        "**Operational reality.** Index rebuilds/merges under heavy writes, filtered search (metadata plus vector) performance, and memory budgeting are the real follow-ups. Feeds the RAG Ingestion topic."
      ]
    },
    "rag-ingestion-chunking": {
      name: "RAG Ingestion & Chunking",
      category: "genai-llm",
      summary: "Retrieval quality is set at ingestion -- how you chunk, enrich, and keep documents fresh matters more than the model.",
      visual: `<div class="sdd"><div class="viz-label">Offline ingestion pipeline -- quality is decided here, not at query time</div><div class="frow"><span class="nd nd-c">source docs</span><span class="fa">&rarr;</span><span class="nd nd-s">parse + clean</span><span class="fa">&rarr;</span><span class="nd nd-s">chunk + overlap</span><span class="fa">&rarr;</span><span class="nd nd-s">embed</span><span class="fa">&rarr;</span><span class="nd nd-d">vector store</span></div><div class="frow frow-sub"><span class="nd nd-q">CDC / webhook</span><span class="fa">on source change --&gt;</span><span class="nd nd-s">re-embed only deltas</span></div><div class="viz-note"><small>Store metadata (source, section, ACLs, timestamp) beside each vector -- you need it for filtering and access control</small></div></div>`,
      details: [
        "**Chunk on structure, not fixed characters.** Split on headings, sections, and paragraphs so each chunk is one coherent idea. Blind 512-character cuts sever sentences and wreck retrieval.",
        "**Overlap.** A sliding overlap (roughly 10-20%) keeps context that straddles a boundary retrievable. Too much overlap bloats the index and returns near-duplicates.",
        "**Enrich chunks.** Prepend the document title and section path, and consider a short LLM-written summary or hypothetical questions per chunk to boost recall (contextual retrieval).",
        "**Freshness via CDC.** Subscribe to source changes (change-data-capture, webhooks) and re-embed only changed documents -- never re-index the whole corpus on every edit (see the Data Pipelines topic).",
        "**Chunk-size trade-off.** Small chunks are precise but fragmented; large chunks carry more context but produce noisy embeddings and waste prompt tokens. Tune against an eval set (see the MLOps/LLMOps topic).",
        "**Metadata is not optional.** Persist source, section, permissions, and timestamps per vector to enable filtered search, citations, and access control."
      ]
    },
    "knowledge-graphs-semantic-search": {
      name: "Knowledge Graphs & Semantic Search",
      category: "genai-llm",
      summary: "Vectors find things that sound similar; graphs find things that are related -- enterprise retrieval often needs both.",
      visual: `<div class="sdd"><div class="viz-label">Two retrieval paradigms, complementary strengths</div><div class="duo"><div><strong>Semantic (vector) search</strong> -- embeds text and ranks by similarity. Great for fuzzy natural-language queries; blind to explicit relationships and multi-hop facts.</div><div><strong>Knowledge graph</strong> -- entities plus typed relations. Answers "who reports to whom", multi-hop joins, and gives explainable, precise paths.</div></div><div class="viz-note"><small>GraphRAG = retrieve a subgraph AND similar chunks, then feed both to the LLM -- precision plus recall</small></div></div>`,
      details: [
        "**Semantic search.** Embed the query and documents into the same space; nearest neighbors are 'about the same thing' even with no shared keywords. Backed by the Vector Database Indexes topic.",
        "**Knowledge graph.** Model the domain as nodes (entities) and typed edges (relations). This enables multi-hop reasoning ('projects owned by teams in org X') that flat vector search cannot express.",
        "**Building the graph.** Run entity and relation extraction (LLM or NER) over your corpus, link to canonical IDs, and store in a graph DB (Neo4j) or as triples. Dedupe and normalize entities or the graph fragments.",
        "**GraphRAG / hybrid retrieval.** Combine graph traversal (fetch the relevant subgraph) with vector search (fetch supporting passages), then merge and rank. This improves precision on enterprise knowledge and reduces hallucination.",
        "**Hybrid ranking.** Fuse lexical (BM25), vector, and graph signals -- reciprocal-rank fusion or a reranker -- rather than trusting one signal, and evaluate the fusion (see the MLOps/LLMOps topic).",
        "**When to reach for graphs.** Explainability, access boundaries that follow relationships, and multi-hop questions. It is overkill for simple FAQ-style lookup -- say so."
      ]
    },
    "agent-orchestration": {
      name: "Agent Orchestration Frameworks",
      category: "genai-llm",
      summary: "An agent is an LLM in a loop with tools and memory; orchestration frameworks manage that loop, its state, and control flow.",
      visual: `<div class="sdd"><div class="viz-label">The agent loop -- reason, act, observe, repeat until done</div><div class="frow"><span class="nd nd-e">LLM plan</span><span class="fa">&rarr;</span><span class="nd nd-s">pick tool</span><span class="fa">&rarr;</span><span class="nd nd-d">tool / API</span><span class="fa">observe&rarr;</span><span class="nd nd-e">LLM</span><span class="fa">&#8635; until goal</span></div><div class="viz-note"><small>Bound the loop -- max steps + token budget + a stop condition -- or it spins forever (see Agentic Guardrails)</small></div></div>`,
      details: [
        "**Core loop (ReAct).** The model reasons, chooses a tool or action, observes the result, and repeats until it decides it is done. Everything else is plumbing around this loop.",
        "**LangChain / LlamaIndex.** Toolkits for chains, tool wrappers, retrievers, and memory. LlamaIndex leans data/RAG-centric; LangChain is broader glue. Good for reaching a first working agent fast.",
        "**LangGraph.** Models the agent as an explicit state graph (nodes, edges, shared state) so loops, branches, retries, and human-in-the-loop pauses are first-class and debuggable -- better for production than free-form chains.",
        "**State and memory.** Short-term (scratchpad/conversation) vs long-term (vector- or DB-backed) memory. Persist state so a run can pause, resume, and be inspected.",
        "**Tools are the risk surface.** Every tool the agent can call is a capability you must sandbox, validate, and rate-limit; untrusted tool output can carry injected instructions (see the Prompt Injection topic).",
        "**Interview move.** Frame it as a distributed system -- retries, idempotency, timeouts, per-step observability, and cost per run -- not just 'call the LLM'."
      ]
    },
    "multi-agent-systems": {
      name: "Multi-Agent Systems",
      category: "genai-llm",
      summary: "Split a hard task across specialized agents coordinated by a pattern -- but only when a single agent genuinely can't do it.",
      visual: `<div class="sdd"><div class="viz-label">Supervisor / orchestrator pattern -- a planner routes work to specialist agents</div><div class="frow"><span class="nd nd-e">supervisor</span><span class="fa">&rarr;</span><span class="nd nd-s">researcher</span><span class="nd nd-s">coder</span><span class="nd nd-s">reviewer</span><span class="fa">&rarr;</span><span class="nd nd-d">shared memory</span></div><div class="viz-note"><small>More agents = more tokens, more latency, more failure modes -- justify the split</small></div></div>`,
      details: [
        "**Topologies.** Supervisor/orchestrator (a router delegates to specialists), pipeline (hand-off in sequence), and debate/reflection (agents critique each other). Pick by the shape of the task.",
        "**AutoGen.** A conversational multi-agent framework -- agents exchange messages in a shared chat with a manager selecting who speaks next. Flexible, but can be chatty and expensive.",
        "**CrewAI.** A role/goal/task abstraction -- assign each agent a role and compose them into a 'crew' with a sequential or hierarchical process. More opinionated and easier to reason about.",
        "**Coordination is the hard part.** Shared state or a blackboard, message passing, and clear termination conditions decide success. Unbounded agent-to-agent chatter burns tokens and loops.",
        "**Cost and latency multiply.** Each agent step is an LLM call; a four-agent debate can be 10x a single call. Add per-run token budgets and step caps (see Agentic Guardrails and LLM Serving Economics).",
        "**When NOT to.** A single well-prompted agent with good tools usually beats a fragile multi-agent swarm. Reach for multiple agents only when roles are genuinely distinct or work is parallelizable."
      ]
    },
    "llm-serving-economics": {
      name: "LLM Serving Economics",
      category: "genai-llm",
      summary: "LLM inference cost and latency are dominated by GPU memory and batching; prefill and decode behave completely differently.",
      visual: `<div class="sdd"><div class="viz-label">Two phases with opposite bottlenecks</div><div class="duo"><div><strong>Prefill</strong> -- process the whole prompt in parallel. Compute-bound, one big matmul. Long contexts cost here.</div><div><strong>Decode</strong> -- generate one token at a time, autoregressive. Memory-bandwidth-bound; each token re-reads the KV cache.</div></div><div class="viz-note"><small>Continuous batching + PagedAttention keep the GPU busy across many concurrent requests -- the main throughput lever</small></div></div>`,
      details: [
        "**GPU memory is the budget.** Weights plus the KV cache must fit in VRAM. The KV cache grows with batch size times context length -- it, not raw FLOPs, usually caps concurrency.",
        "**Prefill vs decode.** Prefill runs the prompt in parallel (compute-bound); decode emits tokens one by one (memory-bandwidth-bound). Measure TTFT (time-to-first-token) and inter-token latency separately.",
        "**Continuous batching.** Instead of waiting to form a static batch, the server adds and removes requests every step (for example vLLM). This keeps the GPU saturated and massively raises throughput under mixed load.",
        "**PagedAttention.** Store the KV cache in non-contiguous 'pages' like OS virtual memory -- it eliminates fragmentation and allows higher batch sizes and prefix sharing.",
        "**Latency vs throughput knobs.** Bigger batches raise throughput but hurt p99 latency; quantized weights cut memory and speed decode (see the Model Compression topic).",
        "**Cost model.** Dollars per 1M tokens is roughly GPU-hour divided by tokens-per-hour. Cut it with batching, quantization, caching (prompt/prefix and semantic), speculative decoding, and routing easy queries to smaller models."
      ]
    },
    "agent-guardrails": {
      name: "Agentic Guardrails & Budgets",
      category: "genai-llm",
      summary: "Autonomy without limits is an incident waiting to happen -- cap steps, spend, and blast radius, and gate risky actions on a human.",
      visual: `<div class="sdd"><div class="viz-label">Guardrails wrap the agent loop at every risky boundary</div><div class="frow"><span class="nd nd-e">agent step</span><span class="fa">budget&rarr;</span><span class="nd nd-s">tool call</span><span class="fa">policy&rarr;</span><span class="nd nd-q">human approve?</span><span class="fa">&rarr;</span><span class="nd nd-d">execute</span></div><div class="viz-note"><small>Fail closed: if a check errors or the budget is hit, stop -- don't proceed by default</small></div></div>`,
      details: [
        "**Step and loop caps.** Set a hard max on iterations and wall-clock time so a stuck agent can't spin forever. Detect no-progress loops (repeated identical actions) and abort.",
        "**Token and cost budgets.** Track spend per run and per tenant; halt or downgrade the model when a budget is exceeded. Unbounded agents are a runaway-cost risk (see LLM Serving Economics).",
        "**Human-in-the-loop gates.** Require explicit approval before irreversible or high-impact actions (send email, delete data, spend money). LangGraph-style interrupts make this a first-class pause (see Agent Orchestration).",
        "**Least-privilege tools.** Give each agent only the tools and scopes it needs, validate tool arguments, and sandbox any code execution. Untrusted content can try to hijack tools (see the Prompt Injection topic).",
        "**Output validation.** Constrain and validate structured outputs (schema, allow-lists) before acting on them; reject or repair malformed tool calls rather than executing blindly.",
        "**Fail closed and observe.** On any check failure, stop rather than proceed. Log every step, decision, and cost for audit and debugging -- operators will ask 'why did it do that?'"
      ]
    },

    // ---------------------------------------------------------
    // AI Security
    // ---------------------------------------------------------
    "rag-acl-security": {
      name: "RAG Access Control (Retrieval-Time ACLs)",
      category: "ai-security",
      summary: "Enforce permissions during retrieval, not after generation -- the model must never see a chunk the user can't access.",
      visual: `<div class="sdd"><div class="viz-label">Filter at the index, before the LLM -- post-hoc filtering has already leaked</div><div class="frow"><span class="nd nd-c">user + roles</span><span class="fa">&rarr;</span><span class="nd nd-e">vector search WITH acl filter</span><span class="fa">&rarr;</span><span class="nd nd-s">only allowed chunks</span><span class="fa">&rarr;</span><span class="nd nd-d">LLM</span></div><div class="viz-note"><small>If the LLM sees a forbidden chunk, redacting the answer is too late -- it can leak via paraphrase</small></div></div>`,
      details: [
        "**Enforce at retrieval.** Attach ACLs/permission tags to each chunk at ingestion, and pass the user's identity and groups as a metadata filter into the vector search so only permitted chunks are ever retrieved (see the RAG Ingestion topic).",
        "**Never post-filter the answer.** Once a forbidden document is in the prompt, the model can leak it through summaries or paraphrase -- filtering the final text is not a boundary.",
        "**Keep ACLs fresh.** Permissions change; if a user loses access, the index or filter must reflect it. Sync via the same CDC pipeline that keeps content fresh, or check a live authorization service at query time.",
        "**Multi-tenancy isolation.** Partition or namespace vectors per tenant so a filter bug can't cross tenant boundaries -- defense in depth beyond metadata filters.",
        "**Prompt-injection interaction.** Retrieved content is untrusted input -- a poisoned document can carry instructions. Combine ACLs with injection defenses (see the Prompt Injection topic).",
        "**Auditability.** Log which chunks were retrieved for which user and query so access decisions are reviewable -- enterprise buyers require it."
      ]
    },
    "prompt-injection-security": {
      name: "Prompt Injection Defense",
      category: "ai-security",
      summary: "Treat all model input -- user text and retrieved/tool content -- as untrusted; the model cannot reliably tell instructions from data.",
      visual: `<div class="sdd"><div class="viz-label">Everything entering the context window is untrusted data, not commands</div><div class="frow"><span class="nd nd-c">user input</span><span class="nd nd-c">retrieved docs</span><span class="nd nd-c">tool output</span><span class="fa">&rarr;</span><span class="nd nd-e">isolate + label</span><span class="fa">&rarr;</span><span class="nd nd-s">LLM</span><span class="fa">validate&rarr;</span><span class="nd nd-d">action</span></div><div class="viz-note"><small>Defense in depth -- no single mitigation is sufficient; assume injection will get through</small></div></div>`,
      details: [
        "**The core problem.** LLMs process instructions and data in the same channel, so text like 'ignore previous instructions' inside a document can hijack behavior -- both direct and indirect (retrieved) injection.",
        "**Isolate untrusted content.** Clearly delimit and label user, retrieved, and tool text; keep the trusted system prompt separate; don't let retrieved content silently become instructions.",
        "**Least privilege on actions.** The real damage is what the model can do. Gate tools, require approval for high-impact actions, and scope credentials so an injection can't exfiltrate or destroy (see Agentic Guardrails).",
        "**Validate inputs and outputs.** Filter or scan for known injection patterns, constrain outputs to schemas and allow-lists, and never `eval` or execute model output unsandboxed (the RAG Access Control topic covers the retrieval side).",
        "**System-prompt isolation and secrets.** Assume the system prompt and any secret in context can be extracted -- never put credentials or data the user shouldn't see into the prompt.",
        "**Defense in depth.** Layer input filtering, privilege limits, human gates, and monitoring; treat injection like XSS -- a persistent class of attack to mitigate, not 'solve' once."
      ]
    },

    // ---------------------------------------------------------
    // MLOps & Deployment
    // ---------------------------------------------------------
    "model-compression-quant": {
      name: "Model Compression & Quantization",
      category: "mlops-deploy",
      summary: "Quantization shrinks weights from 16-bit to 4-8 bits so models fit smaller GPUs and decode faster, at a small quality cost.",
      visual: `<div class="sdd"><div class="viz-label">Fewer bits per weight &rarr; less VRAM, faster decode, slight quality loss</div><div class="viz-bars"><div class="ibar" style="width:100%">FP16 -- full, 2 bytes/param</div><div class="ibar" style="width:52%">INT8 -- ~half memory</div><div class="ibar" style="width:28%">INT4 (GPTQ/AWQ) -- ~quarter memory</div></div><div class="viz-note"><small>Format choice follows your serving stack -- GGUF for llama.cpp/CPU, GPTQ/AWQ for GPU</small></div></div>`,
      details: [
        "**Why quantize.** Weights dominate VRAM, so going FP16 to INT4 cuts memory roughly 4x -- a model fits a cheaper GPU and decode (memory-bandwidth-bound) speeds up (see LLM Serving Economics).",
        "**GPTQ.** Post-training, layer-wise weight quantization to 3-4 bits using second-order information to minimize error. GPU-oriented and widely supported.",
        "**AWQ (activation-aware).** Protects the salient weight channels that matter most for activations -- often better quality than vanilla GPTQ at the same bit-width.",
        "**GGUF.** The llama.cpp file format for CPU/edge and mixed CPU-GPU inference, with many quant levels (`Q4_K_M` and friends). Reach for it for local or on-device serving.",
        "**Other levers.** Distillation (train a small model to mimic a big one), pruning/sparsity, and KV-cache quantization. Weight quantization is usually the highest-ROI first step.",
        "**Always measure quality.** Quantization can degrade reasoning and format adherence unevenly -- validate on a task eval set, not just perplexity (see the MLOps/LLMOps topic)."
      ]
    },
    "mlops-llmops-eval": {
      name: "MLOps / LLMOps: Eval & Monitoring",
      category: "mlops-deploy",
      summary: "You can't ship AI you can't measure -- version everything, evaluate offline, A/B online, and monitor for drift and hallucination.",
      visual: `<div class="sdd"><div class="viz-label">Close the loop -- offline eval before ship, online monitoring after</div><div class="frow"><span class="nd nd-s">version model + prompt</span><span class="fa">&rarr;</span><span class="nd nd-e">offline eval set</span><span class="fa">&rarr;</span><span class="nd nd-q">A/B / canary</span><span class="fa">&rarr;</span><span class="nd nd-d">prod monitoring</span></div><div class="viz-note"><small>A prompt is code -- version it, test it, and roll it back like code</small></div></div>`,
      details: [
        "**Version everything.** Model, prompt, retrieval config, and dataset are all inputs to behavior -- track them together so a regression is reproducible and rollback is one click.",
        "**Offline evaluation.** Maintain a labeled eval set and run it in CI -- exact/lexical metrics where possible, plus LLM-as-judge or human review for open-ended quality. Gate releases on it.",
        "**Online experimentation.** Canary or A/B new prompts and models on a slice of traffic; compare quality, latency, and cost before full rollout. Never ship a prompt change blind.",
        "**Monitor in prod.** Track latency (TTFT, p99), cost and tokens, error and refusal rates, and quality signals (thumbs, groundedness/hallucination checks, retrieval hit rate).",
        "**Drift and feedback.** Data and user behavior shift; watch for embedding/input drift and quality decay, and feed failures back into the eval set and ingestion (ties to the RAG Ingestion topic).",
        "**Guardrails as telemetry.** Hallucination, toxicity, and injection detectors double as monitors -- alert on spikes (pairs with the Prompt Injection topic)."
      ]
    },
    "containerization-k8s": {
      name: "Containerization & Kubernetes",
      category: "mlops-deploy",
      summary: "Containers make a service reproducible; Kubernetes schedules, heals, and scales those containers across a cluster.",
      visual: `<div class="sdd"><div class="viz-label">Declare desired state -- the control plane reconciles reality to match</div><div class="frow"><span class="nd nd-c">image</span><span class="fa">&rarr;</span><span class="nd nd-s">Pod</span><span class="fa">&rarr;</span><span class="nd nd-s">Deployment (replicas)</span><span class="fa">&rarr;</span><span class="nd nd-e">Service / Ingress</span></div><div class="frow frow-sub"><span class="nd nd-q">HPA</span><span class="fa">watches CPU/GPU/QPS --&gt;</span><span class="nd nd-s">scale pods up/down</span></div><div class="viz-note"><small>Liveness/readiness probes + resource requests/limits are what keep it healthy under load</small></div></div>`,
      details: [
        "**Containers.** Package code plus dependencies into an immutable image so 'works on my machine' becomes 'works everywhere'. Keep images small and pin versions for reproducibility.",
        "**Pods and Deployments.** A Pod is one or more co-located containers; a Deployment keeps N replicas running and performs rolling updates and rollbacks. You declare desired state and Kubernetes reconciles to it.",
        "**Service and Ingress.** A Service gives a stable virtual IP/DNS and load-balances across pods; Ingress routes external HTTP(S). This is L7 routing inside the cluster (relates to LLM Serving Economics for GPU pods).",
        "**Autoscaling.** The HPA scales pods on CPU/GPU/custom metrics (QPS, queue depth); the Cluster Autoscaler adds nodes. GPU workloads need node pools with the right accelerators and often scale on queue length.",
        "**Health and resources.** Readiness/liveness probes gate traffic and restarts; requests and limits prevent noisy-neighbor starvation and enable bin-packing. Omitting them is the classic outage.",
        "**Config and secrets.** ConfigMaps for config, Secrets for credentials (never baked into the image); mount them at runtime. This leads into the Cloud-Native Deployment topic."
      ]
    },
    "cloud-native-deployment": {
      name: "Cloud-Native Deployment (AKS/EKS/GKE)",
      category: "mlops-deploy",
      summary: "Managed cloud services let you rent the undifferentiated heavy lifting -- control plane, databases, vector stores -- and pay for elasticity.",
      visual: `<div class="sdd"><div class="viz-label">Managed building blocks -- same shapes across Azure / AWS / GCP</div><div class="duo"><div><strong>Compute</strong> -- managed K8s (AKS / EKS / GKE) or serverless (Functions / Lambda / Cloud Run), with GPU node pools for inference.</div><div><strong>State</strong> -- managed Postgres, object store (Blob / S3 / GCS), and managed vector/search services so you don't run them yourself.</div></div><div class="viz-note"><small>Trade-off: managed = less ops + higher unit cost + lock-in -- know when to keep it portable</small></div></div>`,
      details: [
        "**Managed Kubernetes.** AKS (Azure), EKS (AWS), and GKE (GCP) run the control plane for you; you manage workloads and node pools, including GPU pools for LLM serving (builds on the Containerization topic).",
        "**Serverless option.** Functions/Lambda/Cloud Run scale to zero and remove server management -- great for spiky, stateless glue and webhooks; watch cold starts and execution limits.",
        "**Managed data and AI services.** Rent managed Postgres, object storage (Blob/S3/GCS), queues (Service Bus/SQS/Pub-Sub), and managed vector/search (Azure AI Search, OpenSearch, Vertex) instead of operating them (pairs with Vector Database Indexes).",
        "**Cost and elasticity.** Autoscale on demand, use spot/preemptible instances for batch, and right-size GPUs. Managed convenience carries a unit-cost premium and lock-in -- state the trade-off explicitly.",
        "**Reliability primitives.** Multi-AZ/region, managed load balancers, health checks, and infrastructure-as-code (Terraform, Bicep) for reproducible environments. Deploy via CI/CD with canary or blue-green.",
        "**Security posture.** Managed identity/IAM, secrets managers, private networking, and least-privilege roles -- the infrastructure counterpart to the application-level guardrails."
      ]
    },

    // ---------------------------------------------------------
    // Data & Distributed Systems
    // ---------------------------------------------------------
    "data-pipeline-patterns": {
      name: "Data Pipelines: Batch vs Streaming",
      category: "data-distributed",
      summary: "Move data reliably at scale by choosing batch vs streaming, making writes idempotent, and capturing change incrementally.",
      visual: `<div class="sdd"><div class="viz-label">Two processing models -- latency vs simplicity</div><div class="duo"><div><strong>Batch</strong> -- process bounded chunks on a schedule (Spark, warehouse jobs). Simple, high-throughput, minutes-to-hours latency. Great for reprocessing.</div><div><strong>Streaming</strong> -- process events continuously (Kafka + Flink). Seconds of latency, but harder: state, windowing, out-of-order events.</div></div><div class="viz-note"><small>CDC turns a database's change log into a stream -- the bridge that keeps a RAG index fresh</small></div></div>`,
      details: [
        "**Batch vs streaming.** Batch reprocesses bounded data on a schedule -- simple and cheap; streaming handles unbounded events with low latency but adds state, windowing, and ordering complexity. Pick by the latency the use case actually needs.",
        "**Idempotent writes.** Networks retry, so consumers must dedupe -- upserts keyed by a natural/business key, or exactly-once sinks. Non-idempotent writes double-count on replay.",
        "**Delivery semantics.** At-least-once (the default, needs idempotency) vs exactly-once (costlier). State which you're assuming and why.",
        "**Change data capture (CDC).** Stream a database's commit log (Debezium and similar) to propagate inserts and updates downstream incrementally -- the clean way to keep caches, search, and vector indexes in sync without full reloads.",
        "**Schema evolution.** Data shapes change; use a schema registry and backward/forward-compatible formats (Avro, Protobuf) so producers and consumers can deploy independently without breaking.",
        "**Backpressure and DLQs.** Bound queues, apply backpressure, and route un-processable records to a dead-letter queue for later inspection instead of blocking the pipeline (relates to async worker queues)."
      ]
    }
  }
};
