// ============================================================
// FAANG Prep 2026 — System Design Data
// ============================================================

const DATA_SYSTEM = {
  sdFundamentals: [
    {
      id: "sd-framework",
      name: "The Interview Framework",
      summary: "A 45-minute system design interview has a rhythm. Own it instead of being dragged through it.",
      visual: `<div class="sdd"><div class="viz-label">The 45-minute budget — deep dives are half the interview, so budget backwards from them</div><div class="tl"><div class="tl-seg" style="flex:7"><div class="tl-bar sq1"></div><div class="tl-lbl">Reqs<br>5–8m</div></div><div class="tl-seg" style="flex:4"><div class="tl-bar sq2"></div><div class="tl-lbl">Estimate<br>3–5m</div></div><div class="tl-seg" style="flex:5"><div class="tl-bar sq3"></div><div class="tl-lbl">API + data<br>5m</div></div><div class="tl-seg" style="flex:10"><div class="tl-bar sq4"></div><div class="tl-lbl">High-level<br>10m</div></div><div class="tl-seg" style="flex:15"><div class="tl-bar sq5"></div><div class="tl-lbl">Deep dives<br>15m</div></div><div class="tl-seg" style="flex:2"><div class="tl-bar sq6"></div><div class="tl-lbl">Wrap</div></div></div></div>`,
      details: [
        "**1. Requirements (5-8 min).** Functional: what does it DO (3-4 core features max — say “I'll scope to these” out loud). Non-functional: scale (DAU, QPS, storage), latency targets, availability vs consistency preference, read/write ratio.",
        "**2. Back-of-envelope (3-5 min).** QPS = DAU × actions/day ÷ 86,400 (peak = 2-5× average). Storage = items/day × size × retention. These numbers justify every later decision — sharding, caching, CDN.",
        "**3. API + data model (5 min).** 3-5 REST endpoints with request/response shapes. Core tables/collections with keys. Choosing the partition key HERE is what makes step 5 coherent.",
        "**4. High-level design (10 min).** Client → LB → stateless app servers → cache → DB, plus queue/CDN/object store as needed. Draw it, then TRACE ONE REQUEST end-to-end aloud — this is where communication points are won.",
        "**5. Deep dives (15 min).** The interviewer picks 1-2 components; go deep: data partitioning, cache invalidation, hot keys, failure modes. Volunteer trade-offs before being asked.",
        "**6. Wrap (2 min).** Bottlenecks, single points of failure, what you'd do with more time.",
        "**2026 note:** interviewers increasingly ask “how would you debug this if p99 latency doubled?” — have an observability answer ready (metrics, logs, traces, rollback story)."
      ]
    },
    {
      id: "sd-estimation",
      name: "Back-of-Envelope Numbers",
      summary: "Memorize a small numbers table; estimation confidence is a visible seniority signal.",
      visual: `<div class="sdd"><div class="viz-label">The latency ladder — each rung is roughly 100× the one above (log scale)</div><div class="viz-bars"><div class="ibar" style="width:14%">L1 ~1ns</div><div class="ibar" style="width:30%">RAM ~100ns</div><div class="ibar" style="width:48%">SSD ~100µs</div><div class="ibar" style="width:60%">same-DC hop ~0.5ms</div><div class="ibar" style="width:76%">disk seek ~10ms</div><div class="ibar" style="width:94%">cross-continent ~150ms</div></div><div class="viz-note">Every caching decision is just “move the data up this ladder”</div></div>`,
      details: [
        "**Time:** L1 cache ~1ns · RAM read ~100ns · SSD read ~100µs · HDD seek ~10ms · same-DC network round trip ~0.5ms · cross-continent RTT ~150ms.",
        "**Throughput rules of thumb:** one Postgres/MySQL box ~ few thousand QPS mixed load · Redis ~100K ops/sec · Kafka partition ~10MB/s+ · a single app server ~1-10K req/s depending on work per request.",
        "**Capacity:** 1M users × 1KB each = 1GB. 1 day = 86,400s ≈ 10⁵s — so 100M requests/day ≈ 1,200 QPS average, ~3-5K peak.",
        "**Storage sizes:** char 1-2B · UUID 16B · tweet ~300B with metadata · photo ~300KB · 1080p video minute ~50MB.",
        "**The move:** round aggressively (86,400 → 10⁵), state assumptions, sanity-check the result against a known system (“Twitter does ~6K tweets/sec, so 50K QPS for our reads seems plausible”)."
      ]
    },
    {
      id: "sd-loadbalancing",
      name: "Load Balancing & Stateless Services",
      summary: "Spread traffic across identical stateless servers; push all state down into shared stores.",
      visual: `<div class="sdd"><div class="viz-label">Stateless fan-out — any server can take any request</div><div class="frow"><span class="nd nd-c">Clients</span><span class="fa">→</span><span class="nd nd-e">L7 LB<small>health checks</small></span><span class="fa">→</span><span class="nd nd-s">app-1</span><span class="nd nd-s">app-2</span><span class="nd nd-s">app-3</span><span class="fa">→</span><span class="nd nd-d">session store<small>Redis</small></span></div><div class="viz-note">Kill any app box and nothing is lost — that is exactly what “stateless” buys you</div></div>`,
      details: [
        "**L4 vs L7:** L4 balances on IP/port (fast, dumb). L7 reads HTTP — path routing, sticky sessions, TLS termination. Default answer: L7 (nginx/envoy/ALB).",
        "**Algorithms:** round robin (default) · least connections (uneven work) · consistent hashing (cache-affinity routing).",
        "**Statelessness is the unlock:** if servers hold no session state, any server can handle any request → horizontal scaling is just “add servers”. Sessions go to Redis or a signed cookie/JWT.",
        "**Health checks & failure:** LB probes /healthz, ejects dead nodes. Interview flex: mention connection draining during deploys and the thundering-herd risk when a node rejoins.",
        "**Global scale:** DNS/GeoDNS or anycast routes users to the nearest region; each region has its own LB stack."
      ]
    },
    {
      id: "sd-caching",
      name: "Caching",
      summary: "The highest-leverage scaling tool — and the source of the two hard problems: invalidation and stampedes.",
      visual: `<div class="sdd"><div class="viz-label">Cache-aside — the default pattern; trace the miss path aloud</div><div class="frow"><span class="nd nd-s">App</span><span class="fa">—① get→</span><span class="nd nd-d">Redis</span><span class="fa">—② on miss→</span><span class="nd nd-d">DB</span></div><div class="frow frow-sub"><span class="fa">③ fill cache with TTL → ④ return · next read is a hit</span></div><div class="viz-note">Writes: update the DB, then invalidate the key — never write the cache first</div></div>`,
      details: [
        "**Layers:** browser → CDN → API gateway → app-level (Redis/Memcached) → DB buffer pool. Name the layer you mean.",
        "**Patterns:** cache-aside (app reads cache, on miss reads DB and fills — the default) · write-through (write both, consistent but slow writes) · write-behind (fast writes, risk of loss).",
        "**Invalidation:** TTL is the baseline answer. Event-driven invalidation (purge on write) for freshness. Never claim “just invalidate” is easy — acknowledge stale-read windows.",
        "**Eviction:** LRU is the default; LFU for skewed popularity; note Redis uses approximated LRU.",
        "**Failure modes to volunteer:** cache stampede on hot-key expiry (fix: request coalescing / jittered TTLs / lock-and-fill) · hot key overwhelming one shard (fix: key replication with local cache) · cold-start avalanche after a flush.",
        "**Rule of thumb:** 80/20 access skew means caching 20% of data serves ~80% of reads."
      ]
    },
    {
      id: "sd-database",
      name: "Database Scaling: Replication & Sharding",
      summary: "Scale reads with replicas, writes with shards — and know the price of each.",
      visual: `<div class="sdd"><div class="viz-label">Replication copies everything everywhere · sharding splits it — different problems</div><div class="frow"><span class="nd nd-s">App</span><span class="fa">—writes→</span><span class="nd nd-d">Primary</span><span class="fa">—async repl→</span><span class="nd nd-d">Replica ×2<small>serve reads</small></span></div><div class="frow"><span class="nd nd-s">App</span><span class="fa">—hash(user_id)→</span><span class="nd nd-d">Shard A<small>users a–h</small></span><span class="nd nd-d">Shard B<small>i–q</small></span><span class="nd nd-d">Shard C<small>r–z</small></span></div><div class="viz-note">Replicas scale reads and give failover; shards scale writes and storage</div></div>`,
      details: [
        "**Replication (read scaling + availability):** one primary takes writes, replicas serve reads. Async replication → replication lag → read-your-own-writes anomalies (fix: read from primary after your own write, or session stickiness).",
        "**Failover:** replica promotion on primary death — mention the risk of losing un-replicated writes (async) vs the latency cost of sync replication.",
        "**Sharding (write scaling):** split data across nodes by a shard key. Hash-based (even spread, no range queries) vs range-based (range scans, hotspot risk).",
        "**Choosing the shard key is THE decision:** user_id for user-centric apps keeps a user's data together; a celebrity user is the classic hot-shard problem (fix: further split, or cache the celebrity).",
        "**What sharding costs you:** cross-shard joins (avoid: denormalize), cross-shard transactions (avoid: design around, or sagas), resharding pain (fix: consistent hashing or many virtual shards from day one).",
        "**Indexes:** every index speeds a read and taxes every write; composite index order matters (leftmost prefix)."
      ]
    },
    {
      id: "sd-sql-nosql",
      name: "SQL vs NoSQL",
      summary: "Not a religion — a set of trade-offs. The interviewer wants your reasoning, not your favorite.",
      visual: `<div class="duo"><div><strong>Reach for SQL when…</strong> you need transactions, joins, or flexible ad-hoc queries; scale is within a few shards; correctness beats raw write volume. The boring, right default.</div><div><strong>Reach for NoSQL when…</strong> one known access path must survive huge write volume (wide-column), you only ever fetch by key (KV), or documents nest naturally and the schema keeps evolving.</div></div>`,
      details: [
        "**Relational (Postgres/MySQL):** strong consistency, transactions, joins, mature tooling. The right default until scale/shape says otherwise. Scales further than people claim (replicas + sharding).",
        "**Key-value (Redis/DynamoDB):** O(1) fetch by key, massive scale, no joins/no rich queries. Sessions, carts, counters, feature flags.",
        "**Wide-column (Cassandra):** write-optimized (LSM trees), tunable consistency, partition+clustering key model. Time-series, activity feeds, write-heavy loads.",
        "**Document (MongoDB):** flexible nested schema, decent queries. Product catalogs, evolving schemas.",
        "**Search (Elasticsearch):** inverted index for full-text/fuzzy — always a *secondary* store fed by CDC/queue, never the source of truth.",
        "**Interview move:** pick per-workload. “User accounts in Postgres for transactions; feed items in Cassandra for write volume; search in ES” beats one-size-fits-all."
      ]
    },
    {
      id: "sd-cap",
      name: "CAP, Consistency Models & Consensus",
      summary: "During a network partition you choose: refuse writes (C) or accept divergence (A). Everything else is nuance.",
      visual: `<div class="duo"><div><strong>CP — refuse writes during a partition.</strong> Bank balances, inventory, seat booking. “Sorry, try again in a minute” beats a double-spend.</div><div><strong>AP — accept writes, reconcile later.</strong> Likes, feeds, presence, shopping carts. Stale-for-seconds beats down-for-seconds.</div></div>`,
      details: [
        "**CAP correctly stated:** P (partitions happen) is not optional; the choice is C-vs-A *during* a partition. Banks pick C; social feeds pick A.",
        "**Consistency spectrum:** strong (linearizable — reads see the latest write) → bounded staleness → read-your-writes / monotonic reads (session guarantees) → eventual. Name the session guarantees; they're the practical middle ground and an SDE-2 signal.",
        "**Quorums:** N replicas, write to W, read from R; R+W > N gives strong-ish consistency (e.g., N=3, W=2, R=2). Tune W/R for read- or write-heavy loads.",
        "**Consensus (know at a hand-wave):** Raft/Paxos elect a leader and order writes; used by etcd/ZooKeeper — which is what coordination, locks, and leader election should be delegated to in your design.",
        "**Idempotency:** at-least-once delivery + retries are everywhere, so every write API should tolerate duplicates (idempotency keys). This one word defuses many follow-ups."
      ]
    },
    {
      id: "sd-consistent-hashing",
      name: "Consistent Hashing",
      summary: "Add or remove a cache/DB node and only ~1/N of keys move — the trick behind Dynamo, Cassandra, and CDNs.",
      visual: `<div class="sdd"><div class="viz-label">The ring: every key walks clockwise to the next server</div><div class="ring-wrap"><div class="ring"><span class="rn rn-s" style="left:177px;top:95px">S1</span><span class="rn rn-s" style="left:54px;top:166px">S2</span><span class="rn rn-s" style="left:54px;top:24px">S3</span><span class="rn rn-k" style="left:166px;top:136px">k1</span><span class="rn rn-k" style="left:24px;top:136px">k2</span><span class="rn rn-k" style="left:116px;top:16px">k3</span></div><div class="viz-note ring-note">k1 → S2, k2 → S3, k3 → S1. Add a new server anywhere on the ring: it steals keys only from its clockwise neighbor — everyone else keeps theirs. With <strong>virtual nodes</strong>, each server owns 100–200 scattered positions, so load (and failover) spreads evenly.</div></div></div>`,
      details: [
        "**The problem:** `hash(key) % N` remaps almost every key when N changes → full cache wipe on scale-out.",
        "**The ring:** hash both nodes and keys onto a circle; a key belongs to the first node clockwise. Adding a node steals keys only from its clockwise neighbor.",
        "**Virtual nodes:** map each physical node to 100-200 ring positions → smooths load imbalance and lets heterogeneous nodes take proportional load.",
        "**Where to name-drop it:** distributed caches, Cassandra/Dynamo partitioning, sticky routing at the LB, shard rebalancing.",
        "**Interview depth check:** be ready to explain what happens on node failure (its range flows to the next node — with vnodes, spread across many nodes, not one)."
      ]
    },
    {
      id: "sd-queues",
      name: "Message Queues & Async Processing",
      summary: "The decoupling tool: absorb bursts, smooth spikes, isolate failures, enable fan-out.",
      visual: `<div class="sdd"><div class="viz-label">The queue turns “must survive peak” into “must survive average”</div><div class="frow"><span class="nd nd-s">API<small>burst 5K/s</small></span><span class="fa">—publish→</span><span class="nd nd-q">Queue<small>absorbs the spike</small></span><span class="fa">—pull→</span><span class="nd nd-s">Workers ×N<small>steady 1K/s</small></span><span class="fa">→</span><span class="nd nd-d">DB</span></div><div class="frow frow-sub"><span class="fa">⤷ poison message after N retries →</span><span class="nd nd-q">DLQ<small>+ alert</small></span></div><div class="viz-note">Producer and consumer no longer share fate — a slow consumer is lag, not an outage</div></div>`,
      details: [
        "**When to reach for a queue:** work that doesn't need to happen in the request path (emails, thumbnails, feed fan-out), traffic spikes exceeding downstream capacity, cross-service events.",
        "**Queue vs log:** SQS/RabbitMQ = message deleted on consume, per-message routing. Kafka = append-only log, consumers track offsets, replayable, multiple independent consumer groups. Fan-out or replay ⇒ Kafka.",
        "**Delivery semantics:** at-most-once, at-least-once (the practical default — pair with idempotent consumers), exactly-once (say “effectively-once via idempotency + dedup keys” and you'll sound right).",
        "**Operational vocabulary that scores points:** dead-letter queues for poison messages · backpressure & consumer lag monitoring · partition ordering (Kafka orders only within a partition — pick the partition key to match required ordering, e.g., per-user).",
        "**Classic exchange:** “What if the consumer crashes mid-task?” → message redelivered after visibility timeout, handler is idempotent, DLQ after N attempts."
      ]
    },
    {
      id: "sd-cdn-storage",
      name: "CDN, Object Storage & Media",
      summary: "Static and media bytes never touch your app servers — edge and object storage carry them.",
      visual: `<div class="sdd"><div class="viz-label">Bytes take the edge path — never your app servers</div><div class="frow"><span class="nd nd-c">Viewer</span><span class="fa">→</span><span class="nd nd-e">CDN edge<small>~95% hit</small></span><span class="fa">—miss→</span><span class="nd nd-d">Object storage<small>S3 / R2 origin</small></span></div><div class="frow"><span class="nd nd-c">Uploader</span><span class="fa">—signed URL→</span><span class="nd nd-d">Object storage</span><span class="fa">—event→</span><span class="nd nd-q">Queue</span><span class="fa">→</span><span class="nd nd-s">Workers<small>thumbnail / transcode</small></span></div><div class="viz-note">The DB stores metadata + the object key; blobs live in object storage; edges serve them</div></div>`,
      details: [
        "**Object storage (S3/GCS/R2):** effectively infinite, cheap, 11-nines durable; stores blobs (images, video, backups) addressed by key. DB stores the *metadata* + the key, never the blob.",
        "**CDN:** caches content at edge PoPs near users. Pull CDN (fetch-on-miss — default) vs push. Cache-Control/TTL headers drive it; purge or versioned URLs (file.v2.jpg / content-hash names) handle updates.",
        "**Signed URLs:** clients upload/download directly to object storage with time-limited signed URLs — your servers never proxy bytes. This one sentence upgrades most designs.",
        "**Video pipeline (YouTube-shape):** upload → queue → transcode to multiple bitrates → store renditions in object storage → serve manifest → adaptive bitrate streaming (HLS/DASH) via CDN.",
        "**When asked to cut latency globally:** CDN for static, regional deployments + GeoDNS for dynamic, edge compute for personalization-lite."
      ]
    },
    {
      id: "sd-ratelimit-api",
      name: "API Design & Rate Limiting",
      summary: "Clean APIs and abuse protection — a small topic that appears in nearly every design.",
      visual: `<div class="sdd"><div class="viz-label">Token bucket — rate and burst as two independent knobs</div><div class="bucket"><span class="fa">refill r tokens/sec →</span><span class="bkt"><span class="tok"></span><span class="tok"></span><span class="tok"></span><span class="tok used"></span><span class="tok used"></span></span><span class="fa">→ each request takes 1 · empty bucket = 429 + Retry-After</span></div><div class="viz-note">Bucket size = allowed burst · refill rate = sustained limit — tune them separately</div></div>`,
      details: [
        "**REST conventions:** nouns for resources (POST /v1/urls, GET /v1/users/{id}/feed), proper verbs & status codes, version from day one, pagination via cursor (not offset — offset breaks under insertion and gets slow deep in).",
        "**Idempotency keys on writes:** client sends a unique key; server dedupes retries. Payment-grade answer.",
        "**Rate limiting algorithms:** token bucket (allows bursts — the usual pick) · sliding window log (accurate, memory-heavy) · sliding window counter (the practical compromise) · fixed window (boundary-burst flaw — know why it's weak).",
        "**Distributed limiting:** counters live in Redis (INCR + EXPIRE, or a Lua script for atomicity); per-user and per-IP tiers; return 429 + Retry-After.",
        "**Design detail that impresses:** rate-limit check happens at the gateway BEFORE expensive work; limits are config, not code."
      ]
    },
    {
      id: "sd-observability",
      name: "Observability, Deploys & Resilience (2026 focus)",
      summary: "Interviews now probe “how do you run it”, not just “how do you build it” — SRE literacy is expected at SDE-2.",
      visual: `<div class="sdd"><div class="viz-label">The debugging loop to narrate when asked “p99 doubled — what do you do?”</div><div class="frow"><span class="nd nd-s">Dashboards<small>which endpoint / region?</small></span><span class="fa">→</span><span class="nd nd-s">Correlate<small>deploy? config? traffic?</small></span><span class="fa">→</span><span class="nd nd-s">Trace one slow request<small>find the slow hop</small></span><span class="fa">→</span><span class="nd nd-s">Mitigate<small>rollback / flag off</small></span><span class="fa">→</span><span class="nd nd-s">Root-cause<small>only after it's stable</small></span></div><div class="viz-note">Mitigate before you root-cause — say this and you sound like you've carried a pager</div></div>`,
      details: [
        "**Three pillars:** metrics (RED: rate, errors, duration — per service), logs (structured, with request IDs), traces (follow one request across services). p50/p95/p99 — and why averages lie.",
        "**The debugging narrative to rehearse:** “p99 doubled → check dashboards for which endpoint/region → correlate with deploys/config changes → trace a slow request → find the slow hop (DB? cache miss rate? GC?) → mitigate first (rollback/flag off), root-cause second.”",
        "**Deploy safety:** canary (1% → 10% → 100%) with automatic rollback on error-budget burn; blue/green for instant rollback; feature flags to decouple deploy from release.",
        "**Resilience patterns:** timeouts on EVERY network call (and budgets: caller timeout > sum of retries) · retries with exponential backoff + jitter (and only on idempotent ops) · circuit breakers to stop hammering a dying dependency · bulkheads/isolation pools · graceful degradation (serve stale cache when DB is down).",
        "**Failure-mode habit:** for every component in your design, know your answer to “what happens when THIS dies?” — that question is now standard."
      ]
    },
    {
      id: "sd-realtime",
      name: "Realtime Delivery: WebSockets, SSE & Polling",
      summary: "How servers push to clients — every chat, notification, and live-dashboard design starts with this choice.",
      visual: `<div class="sdd"><div class="viz-label">Routing a message across stateful gateways</div><div class="frow"><span class="nd nd-c">User A</span><span class="fa">—WS→</span><span class="nd nd-e">Gateway 1</span><span class="fa">—publish→</span><span class="nd nd-q">Pub/Sub</span><span class="fa">—deliver→</span><span class="nd nd-e">Gateway 2</span><span class="fa">—WS→</span><span class="nd nd-c">User B</span></div><div class="frow frow-sub"><span class="fa">session registry:</span><span class="nd nd-d">Redis<small>user B → gateway 2</small></span></div><div class="viz-note">Only the gateways are stateful; all logic behind them stays stateless and scalable</div></div>`,
      details: [
        "**Short polling:** client asks every N seconds. Simple, stateless, wasteful; worst-case latency = the interval. Fine for slow-changing data (a dashboard refreshing each minute).",
        "**Long polling:** server holds the request open until data arrives or it times out. Near-realtime with zero special infra — the cost is one held connection per client and a re-handshake per message.",
        "**SSE (Server-Sent Events):** one-way server→client stream over plain HTTP with auto-reconnect built in. The underrated right answer for feeds, notifications, live scores, LLM token streaming — anything that doesn't need client→server push.",
        "**WebSockets:** full-duplex persistent connection. The pick for chat, games, collaborative editing. The price: connection servers become STATEFUL — you now own a session registry (user → server), heartbeats, and reconnect/backfill logic.",
        "**Scaling stateful connections:** dedicated connection gateways hold the sockets (~100K–1M per box); pub/sub (Redis/Kafka) routes each message to whichever gateway holds the recipient; app logic stays stateless behind the gateways.",
        "**Interview move — state the escalation:** “flow is one-way, so I'd start with SSE; if we add typing indicators we upgrade to WebSockets.” Choosing the cheapest sufficient tool is the seniority signal."
      ]
    },
    {
      id: "sd-transactions",
      name: "Distributed Transactions, Idempotency & Sagas",
      summary: "Two services must both change and you can't wrap them in one ACID transaction — the gap where senior candidates separate.",
      visual: `<div class="sdd"><div class="viz-label">Saga: a chain of local commits, each with a compensating action</div><div class="frow"><span class="nd nd-s">Order svc<small>CREATE ✓</small></span><span class="fa">—event→</span><span class="nd nd-s">Payment<small>CHARGE ✓</small></span><span class="fa">—event→</span><span class="nd nd-s">Inventory<small>RESERVE ✗ fails</small></span></div><div class="frow frow-sub"><span class="fa">⤷ compensate backwards:</span><span class="nd nd-s">Payment<small>REFUND</small></span><span class="fa">→</span><span class="nd nd-s">Order<small>CANCEL</small></span></div><div class="viz-note">Each step is an ordinary local transaction; the saga is the pre-planned recovery path</div></div>`,
      details: [
        "**Why not 2PC:** two-phase commit blocks all participants on a coordinator that can die and wedge everyone. Say “2PC doesn't scale operationally — I'd design around it” and offer the patterns below.",
        "**Idempotency keys:** every retried write carries a client-generated key; the server stores processed keys with their responses and replays the same result on duplicates. THE answer to “what if this request is retried?” — memorize the mechanism, not just the word.",
        "**Outbox pattern:** write the business row AND an event row in one local transaction; a relay tails the outbox table and publishes. This kills the classic dual-write bug (“DB committed but the event was lost”).",
        "**Sagas:** a multi-service flow = a sequence of local transactions, each with a compensating action (refund, release, cancel). Choreography (services react to events — simple, hard to trace) vs orchestration (a coordinator drives the steps — visible, one more component). Order→payment→inventory is the canonical walkthrough.",
        "**“Exactly-once”:** doesn't exist on the wire. It's at-least-once delivery + idempotent handlers + dedup — phrase it exactly that way and the follow-up evaporates.",
        "**Distributed locks:** Redis SET NX with a TTL (or an etcd/ZooKeeper lease) for “only one worker may do X” — always with expiry, and mention fencing tokens if pushed on correctness."
      ]
    },
    {
      id: "sd-auth",
      name: "AuthN, AuthZ & API Security",
      summary: "Every design has a login box in the corner — be ready when the interviewer points at it.",
      visual: `<div class="sdd"><div class="viz-label">Where auth lives: the edge verifies, every data owner authorizes</div><div class="frow"><span class="nd nd-c">Client<small>sends token</small></span><span class="fa">→</span><span class="nd nd-e">API gateway<small>verify + rate limit</small></span><span class="fa">—user context→</span><span class="nd nd-s">Services<small>check permissions</small></span><span class="fa">→</span><span class="nd nd-d">Data<small>row-level ACLs</small></span></div><div class="viz-note">Authenticate once at the edge; authorize at every layer that owns data</div></div>`,
      details: [
        "**AuthN vs AuthZ:** authentication = who are you (login); authorization = what may you do (permissions). Mixing the two words up is a junior tell — keep them straight.",
        "**Sessions vs JWT:** server-side sessions (opaque ID in a cookie → lookup in Redis) are simple and instantly revocable — the sane default. JWTs are self-contained (no lookup; great for service-to-service and multi-region) but hard to revoke → keep them short-lived (~15 min) with refresh tokens.",
        "**OAuth 2.0 / OIDC in one breath:** “the user approves at the provider, the app receives a code and exchanges it server-side for tokens; OIDC adds an identity token on top of OAuth's authorization.” That depth suffices outside identity-team interviews.",
        "**Service-to-service:** mTLS or short-lived workload-identity tokens; never long-lived shared API keys pasted into config.",
        "**RBAC vs ABAC:** roles (admin/editor/viewer) cover 90% of designs; attribute rules (owner, org, region) when resources carry per-row ACLs — note that RAG systems need ACL filtering at the *retrieval* layer.",
        "**The checklist to volunteer:** rate-limit before expensive auth work, hash passwords with bcrypt/argon2, TLS everywhere, secrets in a vault (never in the repo), audit-log sensitive actions."
      ]
    }
  ],
  sdCases: [
    {
      id: "case-url-shortener",
      name: "URL Shortener (TinyURL)",
      difficulty: "Starter",
      focus: "ID generation, read-heavy caching, redirects",
      sections: [
        { h: "Requirements & scale", items: [
          "**Functional (scope out loud):** shorten a URL, redirect, optional custom alias + expiry. Explicitly defer: analytics dashboards, user accounts.",
          "**Non-functional:** availability > consistency (a stale redirect is fine; a down service isn't) · redirect p99 under ~100ms · 100:1 read:write.",
          "**Numbers:** 100M new URLs/month ≈ **40 writes/s**, ×100 ⇒ **4K reads/s** (peak ~10K). Storage: 500B × 100M/mo × 5yr ≈ **3TB** — one well-indexed DB fits; you shard for headroom, not necessity. Saying that is a judgment point."
        ]},
        { h: "API & data model", items: [
          "`POST /v1/urls {long_url, custom_alias?, expires_at?}` → `{code, short_url}` · `GET /{code}` → `302 Location: long_url` · idempotency key on the POST.",
          "One table: `urls(code PK, long_url, created_at, expires_at, owner_id)`. It's a key-value shape — Postgres, DynamoDB, anything works; interviewers use this case to test *reasoning*, so justify whatever you pick."
        ]},
        { h: "Architecture — trace a request", diagram: `<div class="sdd"><div class="frow"><span class="nd nd-c">Client</span><span class="fa">→</span><span class="nd nd-e">LB + gateway<small>rate limit</small></span><span class="fa">→</span><span class="nd nd-s">App servers<small>stateless</small></span><span class="fa">—① get→</span><span class="nd nd-d">Redis<small>code → URL · ~90% hit</small></span><span class="fa">—② miss→</span><span class="nd nd-d">DB<small>+ read replicas</small></span></div><div class="frow frow-sub"><span class="fa">write path:</span><span class="nd nd-s">App</span><span class="fa">—lease 1M-ID block→</span><span class="nd nd-d">Counter<small>coordinator</small></span></div></div>`, items: [
          "**Read (say it end-to-end):** `GET /abc123` → LB → app → Redis hit (Zipfian skew makes ~90% hits cheap) → 302. Miss → DB → backfill cache → 302.",
          "**301 vs 302:** 301 is cached by browsers — your servers stop seeing repeats (cheap, but no click counting); 302 keeps every hit visible. Discuss the trade, pick 302."
        ]},
        { h: "Deep dive: ID generation", items: [
          "Base62-encode a monotonic counter — 7 chars = 62⁷ ≈ **3.5 trillion** codes. The counter must not become a bottleneck or single point of failure:",
          "**Ranged allocation:** each app server leases a block of 1M IDs (from ZooKeeper or a DB row with `SELECT ... FOR UPDATE`) and serves them from memory. A crashed server wastes its unused block — that's fine, and saying “wasting IDs is free” shows you did the math.",
          "**Compare aloud:** random string + collision retry (simple; retry rate grows as the table fills) · hash of the URL (dedups identical long URLs, but predictable and collision-prone at 7 chars) · UUID (26+ chars — defeats the product).",
          "Sequential codes are guessable — if that matters, add a per-block random offset or a bijective scramble of the counter."
        ]},
        { h: "Trade-offs & follow-ups", items: [
          "**Expiry:** lazy delete on read + nightly sweeper — cheaper than active TTL scans.",
          "**“Redis dies?”** DB + replicas absorb 4K QPS — degraded latency, still up. **“One code goes viral?”** It's already in Redis; add a small in-process cache at the gateway if a single key dominates.",
          "**Multi-region:** codes are immutable after creation → async cross-region replication, reads served locally, writes routed to a home region. Immutability is what makes this easy — notice and name that pattern."
        ]}
      ]
    },
    {
      id: "case-rate-limiter",
      name: "Distributed Rate Limiter",
      difficulty: "Starter",
      focus: "Algorithms, Redis atomicity, failure open/closed",
      sections: [
        { h: "Requirements & scale", items: [
          "**Functional:** N requests per user (and per IP) per window · shared limits across all gateways · configurable per endpoint tier.",
          "**Non-functional:** added latency under ~1–2ms (it sits on EVERY request) · accurate-ish under burst · must not become the outage itself.",
          "**Numbers:** 10K gateway QPS × 1 Redis round trip each ⇒ the limiter store needs ~10K ops/s — trivial for Redis (~100K/s per node); latency budget, not throughput, is the constraint."
        ]},
        { h: "The algorithm comparison (the core)", items: [
          "**Fixed window:** counter per user per minute. Flaw: 2× burst straddling the boundary — know WHY it's weak.",
          "**Sliding window log:** store every request timestamp — exact, but O(requests) memory per user.",
          "**Sliding window counter:** weight the previous window's count by overlap — the practical compromise.",
          "**Token bucket:** bucket size = burst, refill rate = sustained limit — two independent knobs, the usual production answer. State one and move on; don't recite all four unprompted."
        ]},
        { h: "Architecture — trace a request", diagram: `<div class="sdd"><div class="frow"><span class="nd nd-c">Client</span><span class="fa">→</span><span class="nd nd-e">Gateway<small>local pre-limit (approx)</small></span><span class="fa">—EVAL Lua→</span><span class="nd nd-d">Redis cluster<small>bucket per user · sharded by key</small></span><span class="fa">—allowed→</span><span class="nd nd-s">Upstream services</span></div><div class="frow frow-sub"><span class="fa">⤷ denied →</span><span class="nd nd-c">429<small>Retry-After + X-RateLimit-Remaining</small></span></div></div>`, items: [
          "**Atomicity is the trap:** read-refill-decide-write must be ONE step or two gateways race on the same bucket → a Lua script (or Redis functions) executes the whole check atomically server-side.",
          "**Latency trick:** each gateway keeps an approximate local counter and syncs with Redis asynchronously — trades a little accuracy for sub-ms checks; name the trade explicitly."
        ]},
        { h: "Deep dives", items: [
          "**Failure policy — ask the interviewer:** Redis down → fail-open (allow everything; protects availability) or fail-closed (deny; protects a fragile downstream)? A payment API fails closed; a feed API fails open. Asking this question OF them is a strong move.",
          "**Tiering:** per-user, per-IP, and per-API-key limits stacked; check cheapest first. Limits live in config (hot-reloadable), not code.",
          "**Where it runs:** at the gateway BEFORE auth-heavy or DB work — the whole point is shedding load early."
        ]},
        { h: "Trade-offs & follow-ups", items: [
          "**“Hot user hammers one shard?”** — buckets shard by user key, so one user = one shard = fine; a whole-IP datacenter NAT is the real hot key → split by user-agent or fall back to local limits.",
          "**“Global limit across regions?”** — exact global counting costs a cross-region round trip; give each region a share of the quota and rebalance slowly. Precision vs latency, choose latency.",
          "**Client contract:** always return `429 + Retry-After` — well-behaved SDKs back off, and you've turned abuse into flow control."
        ]}
      ]
    },
    {
      id: "case-kv-store",
      name: "Distributed Key-Value Store",
      difficulty: "Core",
      focus: "Partitioning, replication, quorums — the concepts exam",
      sections: [
        { h: "Requirements & scale", items: [
          "**Functional:** `get(key)` / `put(key, value)`, values up to ~1MB. That's it — the simplicity is the point: this case is a pure exam of distributed-systems fundamentals, Dynamo in miniature.",
          "**Non-functional:** horizontal scale, survive any single node death with zero downtime, tunable consistency per operation, p99 read < 10ms.",
          "**Numbers to anchor:** 100TB dataset ÷ 64GB-RAM/2TB-disk nodes ⇒ ~50–100 nodes × 3 replicas — big enough that manual key→node mapping is absurd, which motivates the ring."
        ]},
        { h: "Architecture — one put, end to end", diagram: `<div class="sdd"><div class="frow"><span class="nd nd-c">Client</span><span class="fa">→</span><span class="nd nd-s">Coordinator<small>any node can be one</small></span><span class="fa">—hash(key) → ring→</span><span class="nd nd-d">Replica 1</span><span class="nd nd-d">Replica 2</span><span class="nd nd-d">Replica 3<small>next 3 clockwise</small></span></div><div class="frow frow-sub"><span class="fa">ack client when <strong>W=2</strong> confirm · reads query <strong>R=2</strong>, newest version wins</span></div></div>`, items: [
          "**Partitioning:** consistent hashing with virtual nodes — each key hashes to a ring position; the next N nodes clockwise are its replica set. Adding a node moves ~1/N of keys, not all of them.",
          "**Quorums:** N=3, W=2, R=2 ⇒ R+W > N — every read overlaps every write on at least one replica, so you read through single failures consistently. Tune W=1 for write-hot workloads, R=1 for read-hot, and say what each gives up."
        ]},
        { h: "Deep dives", items: [
          "**Conflict resolution:** last-write-wins (simple; loses concurrent writes under clock skew — name that loss) vs vector clocks (detect concurrency, push the merge to the reader, as Dynamo did). Choosing LWW is fine *if you say what it costs*.",
          "**Node failure:** gossip protocol spreads membership; **hinted handoff** — a neighbor accepts writes for a down node and replays them on recovery; **read repair** fixes stale replicas on the read path; **anti-entropy** (Merkle trees) reconciles in the background.",
          "**Storage engine:** LSM tree (memtable → flushed SSTables + compaction) for write-heavy — this is Cassandra/RocksDB; B-tree for read-heavy point lookups. One sentence each is the expected depth."
        ]},
        { h: "Trade-offs & follow-ups", items: [
          "**“Hot key?”** — the ring spreads keys, not popularity: add a small cache in the coordinator layer, or split the key (key#1..key#n) and merge on read.",
          "**“Large values?”** — store the blob in object storage, keep the pointer in the KV store; don't let 1MB values wreck compaction.",
          "**“Transactions across keys?”** — out of scope for Dynamo-style stores; that's the moment to name the CP alternative (etcd/Spanner-style) and the cost it pays in latency/availability."
        ]}
      ]
    },
    {
      id: "case-chat",
      name: "Chat System (WhatsApp/Slack)",
      difficulty: "Core",
      focus: "WebSockets, fan-out, delivery guarantees, presence",
      sections: [
        { h: "Requirements & scale", items: [
          "**Functional (scope out loud):** 1:1 + group chat, delivery/read receipts, presence, offline delivery, history. Defer: E2E-encryption details, media (reuse the object-storage pattern), calls.",
          "**Non-functional:** delivery p99 < ~500ms · no lost messages — durability before delivery · write-heavy, unlike most consumer systems.",
          "**Numbers:** 50M DAU × 40 msgs/day = 2B/day ≈ **23K msg/s** average, ~100K/s peak · 2B × ~100B ≈ **200GB/day** of message rows — wide-column territory."
        ]},
        { h: "API & data model", items: [
          "Over the socket: `send(conv_id, client_msg_id, text)` · `ack(msg_id)`. REST for history: `GET /v1/conversations/{id}/messages?before=cursor`.",
          "`messages`: **partition by conversation_id, cluster by message_id** (Snowflake — time-sortable) → one partition read returns a conversation in order. Plus `conversations`, `members`, `receipts(msg_id, user_id, state)`.",
          "`client_msg_id` is the idempotency key — a retry after a dropped socket must not create a duplicate message."
        ]},
        { h: "Architecture — trace one message", diagram: `<div class="sdd"><div class="frow"><span class="nd nd-c">User A</span><span class="fa">—WS→</span><span class="nd nd-e">Gateway 1<small>stateful: holds sockets</small></span><span class="fa">→</span><span class="nd nd-s">Chat service<small>stateless</small></span><span class="fa">—① persist→</span><span class="nd nd-d">Cassandra<small>by conv_id</small></span></div><div class="frow frow-sub"><span class="fa">② lookup</span><span class="nd nd-d">Registry<small>Redis: B → gw2</small></span><span class="fa">→ ③ route →</span><span class="nd nd-e">Gateway 2</span><span class="fa">—WS→</span><span class="nd nd-c">User B</span></div><div class="frow frow-sub"><span class="fa">⤷ B offline →</span><span class="nd nd-q">Push queue<small>→ notification system</small></span><span class="fa">· B pulls missed msgs by cursor on reconnect</span></div></div>`, items: [
          "**The heart — say it early:** connection gateways are STATEFUL (they hold WebSockets); everything behind them stays stateless. A session registry (Redis) maps user → gateway.",
          "**Send flow:** A → gateway → chat service → **persist FIRST** → ack A → registry lookup → deliver via B's gateway → B acks → receipt flows back. Durable-before-delivered is the guarantee that survives every crash question.",
          "**B offline?** The message is already durable → push notification → on reconnect B pulls everything after its last cursor."
        ]},
        { h: "Deep dives", items: [
          "**Group fan-out:** small groups → fan-out on write (deliver to each member's gateway); 100K-member channels → fan-out on read (pull on open). Same trade-off as the news feed — name the symmetry.",
          "**Ordering:** per-conversation sequence numbers assigned at the partition owner; clients render by seq and de-dup by ID. Global cross-conversation ordering doesn't exist and nobody needs it — say that.",
          "**Presence:** heartbeat ~30s → TTL'd Redis key; expiry = offline; interested parties hear via pub/sub. Don't broadcast a celebrity's presence to 1M watchers — batch + rate-limit.",
          "**Multi-device:** each device keeps its own per-conversation cursor; 'read' = max across devices; every device gets its own delivery."
        ]},
        { h: "Trade-offs & follow-ups", items: [
          "**“Exactly-once?”** — at-least-once + `client_msg_id` dedup = effectively-once. The wire can't do better; the endpoints fix it.",
          "**“A gateway dies?”** — its users reconnect through the LB to any other gateway, re-register, pull missed messages by cursor. Persist-first is what makes this a non-event.",
          "**E2E encryption (hand-wave depth):** Signal protocol — the server routes ciphertext; receipts, presence and push still work on plaintext metadata."
        ]}
      ]
    },
    {
      id: "case-newsfeed",
      name: "News Feed (Twitter/Instagram)",
      difficulty: "Core",
      focus: "Fan-out on write vs read, the celebrity problem",
      sections: [
        { h: "Requirements & scale", items: [
          "**Functional:** post (text + media), follow, personalized reverse-chron feed; ranked feed as a stretch. Defer: comments/likes (mention they're separate fan-out problems of their own).",
          "**Non-functional:** feed load p99 < 200ms · read-heavy ~100:1 · eventual consistency is fine — a post appearing after 5s is acceptable, and *saying so* is a judgment point.",
          "**Numbers:** 10M DAU × 5 loads = 50M reads/day ≈ **600 QPS avg, ~3K peak**. Writes are trivial (1M posts/day ≈ 12/s) — the danger is **fan-out amplification**: 1 post × 500 followers = 500 feed writes."
        ]},
        { h: "API & data model", items: [
          "`POST /v1/posts` · `GET /v1/feed?cursor=` — cursor = last-seen Snowflake ID, never offset pagination · `POST /v1/users/{id}/follow`.",
          "`posts(post_id, author, content, media_key)` · `follows(follower, followee)` · **feed cache**: one Redis list of post IDs per user, capped ~800 — store IDs only, hydrate content at read time."
        ]},
        { h: "Architecture — the hybrid fan-out", diagram: `<div class="sdd"><div class="frow"><span class="fa">write:</span><span class="nd nd-c">Author</span><span class="fa">→</span><span class="nd nd-s">Post svc</span><span class="fa">→</span><span class="nd nd-d">Posts DB</span><span class="fa">—event→</span><span class="nd nd-q">Queue</span><span class="fa">→</span><span class="nd nd-s">Fan-out workers</span><span class="fa">—LPUSH→</span><span class="nd nd-d">Feed lists<small>Redis · per follower</small></span></div><div class="frow"><span class="fa">read:</span><span class="nd nd-c">Reader</span><span class="fa">→</span><span class="nd nd-s">Feed svc</span><span class="fa">—① IDs→</span><span class="nd nd-d">Feed list</span><span class="fa">—② merge→</span><span class="nd nd-d">Celebrity posts<small>pulled live</small></span><span class="fa">—③ hydrate→</span><span class="nd nd-d">Post + user cache</span></div></div>`, items: [
          "**The central trade-off (say it unprompted):** fan-out on WRITE — precompute every follower's feed: fast reads, but a 100M-follower celebrity = 100M writes per post — vs fan-out on READ — assemble at request time: no amplification, slow reads. **Hybrid wins:** push for normal users, pull celebrities live at read.",
          "**Write path:** post → DB → queue → workers LPUSH the post ID into each follower's list, skipping dormant users (huge saving — most accounts are inactive).",
          "**Read path:** fetch cached IDs → k-way merge with live posts from followed celebrities → hydrate from post/user caches → return page + cursor."
        ]},
        { h: "Deep dives", items: [
          "**Celebrity threshold:** followers > ~10K ⇒ pull-side. A feed = cached list ∪ live merge of ≤ a few dozen celebrity timelines — cheap because each is already cached.",
          "**Deleted posts:** the ID may sit in millions of cached lists you can't chase — tombstone-check at hydration and drop. Blocks/mutes ride the same mechanism.",
          "**Ranked feed (SDE-2 flavor):** candidate generation (the chrono feed) → feature fetch → ML scorer under ~50ms → business re-rank. Features precomputed offline; the scorer is a stateless service.",
          "**Cold user:** cache miss → rebuild from the follows list live, accept the slow first load, cache the result."
        ]},
        { h: "Trade-offs & follow-ups", items: [
          "**“Why cap lists at ~800?”** — memory math: 10M users × 800 IDs × 8B ≈ 64GB — one small Redis cluster. Deeper scrolls fall through to the pull path.",
          "**“You post and don't see it on refresh?”** — read-your-writes: insert into your OWN feed cache synchronously, fan out to everyone else async.",
          "**“Likes/counters?”** — never fan likes out into feeds; keep sharded counters (or Redis + periodic flush) and hydrate at read."
        ]}
      ]
    },
    {
      id: "case-video",
      name: "Video Platform (YouTube)",
      difficulty: "Core",
      focus: "Upload pipeline, transcoding DAG, CDN delivery",
      sections: [
        { h: "Requirements & scale", items: [
          "**Functional:** upload, transcode, adaptive-quality streaming, thumbnails, view counts. Defer: recommendations, comments, live streaming (a different pipeline — say so).",
          "**Non-functional:** uploads must be durable and resumable (hours of user effort) · start-play < ~2s · economics dominated by storage and egress bandwidth.",
          "**Numbers:** 10K uploads/day × 500MB ≈ **5TB/day** ingest; renditions multiply storage ×3–4. Egress dwarfs everything → **CDN hit rate is the cost lever** — that's the sentence that frames the whole design."
        ]},
        { h: "API & data model", items: [
          "`POST /v1/videos` → signed multipart upload URLs · `GET /v1/videos/{id}` → metadata + manifest URL · players fetch segments straight from the CDN, never through your API.",
          "`videos(video_id, owner, title, status: uploading|processing|live, manifest_key)` — renditions/segments live in **object storage** keyed `video/{id}/{rendition}/{segment}`; the DB stores metadata, never bytes."
        ]},
        { h: "Architecture — upload to playback", diagram: `<div class="sdd"><div class="frow"><span class="nd nd-c">Uploader</span><span class="fa">—signed URLs, chunked→</span><span class="nd nd-d">Object storage<small>raw upload</small></span><span class="fa">—done event→</span><span class="nd nd-q">Queue</span><span class="fa">→</span><span class="nd nd-s">Transcode fleet<small>segment × rendition DAG</small></span><span class="fa">→</span><span class="nd nd-d">Object storage<small>renditions + manifests</small></span></div><div class="frow"><span class="fa">playback:</span><span class="nd nd-c">Viewer</span><span class="fa">→</span><span class="nd nd-e">CDN<small>~95% edge hit</small></span><span class="fa">—miss→</span><span class="nd nd-d">Origin<small>object storage</small></span></div><div class="frow frow-sub"><span class="fa">views:</span><span class="nd nd-c">Player events</span><span class="fa">→</span><span class="nd nd-q">Kafka</span><span class="fa">→</span><span class="nd nd-s">Aggregator<small>1-min windows</small></span><span class="fa">→</span><span class="nd nd-d">Counts store</span></div></div>`, items: [
          "**Upload:** client gets signed URLs → multipart chunks go direct to object storage (resumable) → completion event lands on a queue. **Your API servers never touch video bytes** — say this sentence verbatim.",
          "**Transcoding (the deep dive):** a DAG — split into ~10s segments → transcode each segment × each rendition (240p…4K) in parallel on a preemptible worker fleet → stitch → write manifests + thumbnails → flip status to live. **Segment-level parallelism** is why a 2-hour video processes in minutes.",
          "**Playback:** HLS/DASH — the player reads a manifest, measures its bandwidth, and picks a rendition per segment. Adaptive bitrate is WHY transcoding produces segments — connect those dots aloud."
        ]},
        { h: "Deep dives", items: [
          "**View counts:** never INCR the DB per view — events → Kafka → windowed aggregation → periodic flush. Eventually-consistent counts are fine; saying so shows judgment.",
          "**CDN strategy:** popular content lives at the edge; pre-warm edges for predicted-hot uploads (a new video from a 10M-subscriber channel); the long tail misses to origin and that's fine.",
          "**Resumability:** chunk checksums + an upload-session record let a flaky mobile connection resume at chunk 47 of 100 — a small detail interviewers reward."
        ]},
        { h: "Trade-offs & follow-ups", items: [
          "**“A transcode worker dies mid-job?”** — segment jobs are idempotent; the queue redelivers; a segment transcoded twice overwrites identically. Queue fundamentals, applied.",
          "**“Copyright / moderation?”** — fingerprinting runs as a parallel DAG branch that gates the status flip to live — it blocks publish, not upload.",
          "**“Live streaming?”** — different pipeline: real-time ingest, seconds-long buffer, short-segment HLS. Name the difference; don't design it unasked."
        ]}
      ]
    },
    {
      id: "case-notifications",
      name: "Notification System",
      difficulty: "Core",
      focus: "Multi-channel fan-out, dedup, retries, preferences",
      sections: [
        { h: "Requirements & scale", items: [
          "**Functional:** one API for push/SMS/email used by many producer services · preferences, opt-outs, quiet hours · no duplicates · retries with audit trail.",
          "**Non-functional:** at-least-once to the provider (an OTP must not vanish) · push < ~1s nice-to-have, SMS/email seconds are fine · billions/day capable.",
          "**Numbers:** 100M/day ≈ **1.2K/s average** — every stage is stateless workers on queues, so scale is horizontal; the real ceiling is provider throughput (APNs/Twilio caps), so pool connections and batch calls."
        ]},
        { h: "API & data model", items: [
          "`POST /v1/notify {event_key, user_id, category, payload, channels?}` — **event_key is the producer's idempotency key**; producers retry, you dedup.",
          "`preferences(user_id, channel, category, opted_in, quiet_hours)` · `notifications(id, user_id, channel, state: pending|sent|failed, attempts)` — persisted state answers “did the user get it?” for support and enables resend.",
          "`devices(user_id, push_token, platform, last_seen)` — tokens rot; plan their hygiene."
        ]},
        { h: "Architecture — one event through", diagram: `<div class="sdd"><div class="frow"><span class="nd nd-s">Producers<small>order svc · social svc · …</small></span><span class="fa">→</span><span class="nd nd-s">Notify API<small>dedup + prefs + collapse</small></span><span class="fa">→</span><span class="nd nd-q">Push queue</span><span class="nd nd-q">SMS queue</span><span class="nd nd-q">Email queue</span></div><div class="frow frow-sub"><span class="fa">pull →</span><span class="nd nd-s">Channel workers<small>backoff + batch</small></span><span class="fa">→</span><span class="nd nd-c">APNs / FCM · Twilio · SES<small>external providers</small></span><span class="fa">⤷ fail ×N →</span><span class="nd nd-q">DLQ<small>+ alert</small></span></div></div>`, items: [
          "**Flow:** producer → notify API → dedup (Redis SETNX on event_key with TTL) → preference/quiet-hours filter → route to per-channel queues → channel workers → providers.",
          "**A queue PER channel is the core sentence:** Twilio degrading becomes SMS lag, not a push outage — failure isolation by construction.",
          "**Collapse before the queues:** a short aggregation window per (user, category) turns 3 like-events into “3 people liked your post” — less spam, less volume."
        ]},
        { h: "Deep dives", items: [
          "**Reliability ladder:** provider 5xx → exponential backoff + jitter → N attempts → DLQ + alert; every transition persisted to the notifications table.",
          "**Per-user caps:** daily budget per category checked before enqueue — notifications spend user trust; over-sending burns it permanently.",
          "**Token hygiene:** consume provider feedback (bounces, uninstalls) to prune dead tokens, or delivery rates silently rot."
        ]},
        { h: "Trade-offs & follow-ups", items: [
          "**“Ordering across channels?”** — not guaranteed and not needed; per-user ordering within a channel via queue partition key if a product truly requires it.",
          "**“Provider down for an hour?”** — queues absorb, DLQ catches poison, lag alarms fire, nothing is lost. This is the queues-fundamental payoff — cite it.",
          "**“OTP behind 10M promo emails?”** — separate lanes: transactional vs marketing get their own queues and quotas. Priority lanes are the mature answer."
        ]}
      ]
    },
    {
      id: "case-typeahead",
      name: "Search Autocomplete (Typeahead)",
      difficulty: "Stretch",
      focus: "Trie serving, precomputation, freshness pipeline",
      sections: [
        { h: "Requirements & scale", items: [
          "**Functional:** top-5 suggestions per keystroke · trending queries surface within hours · offensive terms filtered. Defer heavy personalization (mention the client-side re-rank trick).",
          "**Non-functional:** p99 < 100ms end-to-end — it renders mid-keystroke · suggestions may be hours stale, and **saying that out loud unlocks the entire design** (it's what permits precomputation).",
          "**Numbers:** 10M searches/day × ~8 keystrokes ≈ 80M lookups/day ≈ **1K QPS avg, 5–10K peak** — must be served from memory; disk round trips can't hit the budget."
        ]},
        { h: "Architecture — precompute everything", diagram: `<div class="sdd"><div class="frow"><span class="fa">serve:</span><span class="nd nd-c">Keystroke</span><span class="fa">→</span><span class="nd nd-e">Browser + edge cache<small>1–2 char prefixes</small></span><span class="fa">—miss→</span><span class="nd nd-s">Trie shards<small>in-RAM · top-5 stored per node</small></span></div><div class="frow"><span class="fa">build:</span><span class="nd nd-d">Query logs</span><span class="fa">→</span><span class="nd nd-q">Kafka</span><span class="fa">→</span><span class="nd nd-s">Hourly aggregator<small>count + decay + filter</small></span><span class="fa">→</span><span class="nd nd-d">New trie<small>atomic swap into servers</small></span></div></div>`, items: [
          "**Core insight — lead with it:** don't rank at query time; PRECOMPUTE top-K per prefix. A trie whose every node stores its own top-5 completions turns a keystroke into one in-memory lookup.",
          "**Serving:** trie shards in RAM, partitioned by prefix range via consistent hashing. The first 1–2 characters have so few distinct values they're cached at the edge and in the browser — a massive hit-rate win.",
          "**Freshness pipeline:** query logs → Kafka → hourly aggregation (counts with exponential decay) → build a NEW trie offline → atomic pointer swap. **Blue/green for data — never mutate the live trie.**"
        ]},
        { h: "Deep dives", items: [
          "**Trending:** blend a short window (last hour, weighted high) with long-run popularity — the decay factor does most of the work.",
          "**Filtering at build time**, never query time — the serving path stays dumb and fast.",
          "**Client details that score:** debounce ~100ms, cancel in-flight requests on new input, session-cache prefix→results."
        ]},
        { h: "Trade-offs & follow-ups", items: [
          "**“Why not Elasticsearch prefix queries?”** — fine at small scale; at 10K QPS the precomputed trie wins on latency and cost. Name both; justify with the numbers.",
          "**“Personalized suggestions?”** — keep the shared trie cacheable; re-rank the top-K client-side against the user's own history. Don't shatter the shared structure for personalization.",
          "**“A query goes viral RIGHT NOW?”** — hourly rebuild too slow → bolt on a small real-time top-K sketch (count-min) merged at read. Offer it as an add-on; don't default to the complexity."
        ]}
      ]
    },
    {
      id: "case-rag",
      name: "AI: RAG Pipeline (2026 must-know)",
      difficulty: "Stretch",
      focus: "Embeddings, vector search, freshness, evaluation",
      sections: [
        { h: "Requirements & scale", items: [
          "**Problem shape:** “design a documentation Q&A / enterprise search assistant.” LLMs hallucinate and don't know private data → Retrieval-Augmented Generation: fetch relevant chunks, put them in the prompt, cite sources.",
          "**Non-functional:** retrieval p99 < ~50ms (ANN index) · the LLM dominates latency → stream tokens · answers must respect document permissions · doc edits reflected within minutes.",
          "**Numbers:** 1M docs × ~20 chunks × 1536-dim float32 ≈ **~120GB of vectors** — a sharded ANN (HNSW) index, not a toy."
        ]},
        { h: "Architecture — two paths", diagram: `<div class="sdd"><div class="frow"><span class="fa">ingest:</span><span class="nd nd-d">Docs</span><span class="fa">—CDC on edit→</span><span class="nd nd-q">Queue</span><span class="fa">→</span><span class="nd nd-s">Chunk + embed</span><span class="fa">→</span><span class="nd nd-d">Vector DB<small>+ source, ACL tags</small></span></div><div class="frow"><span class="fa">query:</span><span class="nd nd-c">User</span><span class="fa">→</span><span class="nd nd-s">Embed query</span><span class="fa">→</span><span class="nd nd-d">Vector top-k ∥ BM25<small>ACL-filtered</small></span><span class="fa">→</span><span class="nd nd-s">Rerank<small>cross-encoder</small></span><span class="fa">→</span><span class="nd nd-s">LLM<small>stream + cite</small></span></div></div>`, items: [
          "**Ingestion:** docs → chunk (semantic/heading-aware, ~300–800 tokens, ~10–15% overlap) → embed → vector DB with metadata {source, updated_at, ACL tags}. Edits flow through CDC/queue to re-embed — **freshness is an ingestion problem**; say that.",
          "**Query:** embed the query → vector top-k AND keyword/BM25 **in parallel** (hybrid — embeddings miss exact identifiers like error codes) → cross-encoder rerank → assemble prompt with citations → stream the answer.",
          "**ACL filtering happens AT retrieval**, on the candidate set, using the caller's permissions — retrieve-then-filter leaks content through the model's context. This is the #1 probe on this case."
        ]},
        { h: "Deep dives", items: [
          "**Chunking trade-off:** too small = fragments that can't answer anything; too big = diluted relevance and a blown context budget. Overlap patches boundary losses.",
          "**Evaluation (the differentiator):** keep a golden question set; measure retrieval recall@k and answer faithfulness **separately** — perfect retrieval + wrong answer is a prompting problem, not a search problem.",
          "**Semantic caching:** embed the query; if it's cosine-close to a cached one, serve that answer — big cost/latency win; invalidate on doc update.",
          "**Cost control:** a router sends easy queries to a small model; cap context length; cache embeddings."
        ]},
        { h: "Trade-offs & follow-ups", items: [
          "**“Why not fine-tune instead?”** — fine-tuning bakes knowledge in: stale, uncitable, un-ACL-able. RAG keeps knowledge external and updatable. That contrast is the expected answer.",
          "**“Model says things not in the docs?”** — require citations in the prompt, measure faithfulness, show retrieved snippets in the UI so users can verify.",
          "**Prompt injection via retrieved content:** retrieved text is DATA, not instructions — delimit it, never let it override the system prompt; it gets worse once agents act on it."
        ]}
      ]
    },
    {
      id: "case-llm-serving",
      name: "AI: LLM Inference & Agent Systems (2026 must-know)",
      difficulty: "Stretch",
      focus: "GPU serving economics, batching, agent orchestration",
      sections: [
        { h: "Requirements & scale", items: [
          "**Problem shape:** “serve an LLM product to 1M users” or “design the platform an agent runs on.” GPU economics drive every decision — the GPU-hour is the unit of cost.",
          "**Non-functional:** time-to-first-token < ~1s · sustained tokens/sec per stream · bounded cost per request · graceful behavior under GPU scarcity (queue and degrade, never crash).",
          "**Name the two phases immediately:** **prefill** (whole prompt processed in parallel — compute-bound) vs **decode** (one token at a time — memory-bandwidth-bound). Every serving optimization exploits this split."
        ]},
        { h: "Architecture — the serving stack", diagram: `<div class="sdd"><div class="frow"><span class="nd nd-c">Clients</span><span class="fa">→</span><span class="nd nd-e">Gateway<small>auth + token budgets</small></span><span class="fa">→</span><span class="nd nd-s">Model router<small>easy → small · hard → big</small></span><span class="fa">→</span><span class="nd nd-q">Per-model queues<small>autoscale on depth</small></span><span class="fa">→</span><span class="nd nd-s">GPU pools<small>continuous batching</small></span></div><div class="frow frow-sub"><span class="fa">agent loop: LLM → sandboxed tool → observe ↻ — budgets · traces · approval gates on every iteration</span></div></div>`, items: [
          "**Continuous batching — the single most important concept:** new requests join the running batch as others finish, keeping the GPU saturated without waiting to form fixed batches.",
          "**KV-cache is the memory hog:** paged attention allocates it in blocks (virtual memory for attention); prefix caching makes shared system prompts nearly free. Name both.",
          "**Fleet:** router → per-model queues → GPU pools. Autoscale on queue depth — but GPU cold starts take MINUTES → overprovision or scale predictively; shedding to a smaller model beats a 504.",
          "**Model router = the biggest cost lever:** classify the query, send easy ones to the cheap model."
        ]},
        { h: "Agent systems (the 2026 follow-up)", items: [
          "An agent = an LLM in a loop: plan → call tool → observe → repeat. The platform must provide: **sandboxed tool execution** with per-tool permissions · **iteration/token budgets** (runaway loops are cost incidents) · **checkpointing** for long runs (durable execution) · **human approval gates** before irreversible actions.",
          "**Trace every step** — prompt, tool calls, outputs. Non-determinism means you cannot debug what you didn't record; full traces are also your replay mechanism.",
          "**Prompt injection:** everything the agent reads (retrieved docs, web pages, tool output) is untrusted input — treat as data, never instructions; gate risky tools when context includes it."
        ]},
        { h: "Trade-offs & follow-ups", items: [
          "**“Why is decode slow?”** — each new token re-reads the whole KV-cache from GPU memory: bandwidth-bound, which is why batching decode across requests is nearly free throughput.",
          "**“How do you hide latency?”** — stream via SSE; optimize time-to-first-token (queue time + prefill). TTFT is the UX metric.",
          "**Cost probes:** per-user token budgets, semantic caching of common prompts, quantized models on the cheap tier, spot GPUs for batch/offline work."
        ]}
      ]
    }
  ]
};
