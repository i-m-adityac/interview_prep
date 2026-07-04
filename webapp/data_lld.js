// ============================================================
// FAANG Prep 2026 — LLD Data
// ============================================================

const DATA_LLD = {
  lldFundamentals: [
    {
      id: "lld-approach",
      name: "How LLD & Machine-Coding Rounds Work",
      summary: "45–90 minutes to turn fuzzy requirements into clean, extensible, working code. You're judged on structure and a working demo — not algorithms.",
      visual: `<div class="sdd"><div class="viz-label">The 90-minute machine-coding budget — the happy path gets almost half</div><div class="tl"><div class="tl-seg" style="flex:10"><div class="tl-bar sq1"></div><div class="tl-lbl">Clarify<br>10m</div></div><div class="tl-seg" style="flex:15"><div class="tl-bar sq2"></div><div class="tl-lbl">Entities + design<br>15m</div></div><div class="tl-seg" style="flex:40"><div class="tl-bar sq4"></div><div class="tl-lbl">Core happy path<br>40m</div></div><div class="tl-seg" style="flex:15"><div class="tl-bar sq5"></div><div class="tl-lbl">Extend + edges<br>15m</div></div><div class="tl-seg" style="flex:10"><div class="tl-bar sq6"></div><div class="tl-lbl">Demo + tests<br>10m</div></div></div></div>`,
      details: [
        "**Two flavors — ask which you're in.** Whiteboard OOD (Amazon-style: classes, relationships, a little code) vs machine coding (Flipkart/Swiggy/Uber-India style: 90 min, RUNNABLE code, demo at the end). The first rewards design vocabulary; the second rewards working software.",
        "**The 6-step loop:** ① clarify scope down to 3-4 core use cases → ② extract nouns (entities) and verbs (methods) from the requirements → ③ sketch entities + relationships → ④ put interfaces where the *variation* lives — pricing, matching, notification rules are tomorrow's requirements → ⑤ code the happy path END-TO-END → ⑥ extend, handle edges, demo.",
        "**What graders score:** separation of concerns · SOLID applied, not recited · extensibility (“add a new vehicle type without touching existing code”) · naming · a demo that runs. A working simple design beats a broken clever one, every time.",
        "**The classic failures:** over-engineering (six patterns, nothing runs) · the God class that does everything · the anemic model (all logic piled into one Manager while objects are bags of getters) · no demo because abstraction layer #3 felt important.",
        "**In-memory everything:** no DB, no framework — dicts/maps behind a thin repository interface. Say “I'd swap this for a real store behind the same interface” once, and move on."
      ]
    },
    {
      id: "lld-solid",
      name: "SOLID — with violations you can name",
      summary: "Five principles interviewers listen for. Each is easiest to remember as the smell it forbids.",
      details: [
        "**S — Single Responsibility:** one reason to change. Smell: an `Invoice` that computes totals AND formats PDFs AND writes to storage. Fix: calculator / printer / repository, three classes.",
        "**O — Open/Closed:** extend without modifying. Smell: `if type == 'car' … elif type == 'bike'` chains that grow with every feature. Fix: polymorphism — a new type is a new class, not a new branch.",
        "**L — Liskov Substitution:** subtypes must honor the base contract. Smell: `Square extends Rectangle` breaking `set_width`, a read-only file whose `write()` throws. If a subclass surprises callers, the hierarchy is wrong.",
        "**I — Interface Segregation:** several small interfaces beat one fat one. Smell: a `Machine` interface forcing `fax()` onto a printer. Fix: `Printable`, `Scannable` — implement what you are.",
        "**D — Dependency Inversion:** depend on abstractions, inject them. Smell: `OrderService` constructing `EmailSender` inside itself. Fix: accept a `Notifier` in the constructor — now it's testable and swappable.",
        "**Using them in the room:** never lecture. “I'll put pricing behind a strategy so it's open for extension” — one principle justifying one decision, then keep coding."
      ],
      code: `# D + O in one move: inject the abstraction, extend by adding classes
class Notifier(Protocol):
    def send(self, user, msg): ...

class EmailNotifier:                     # a new channel later is a new
    def send(self, user, msg): ...      # class - OrderService never changes

class OrderService:
    def __init__(self, notifier: Notifier):   # injected, not constructed
        self.notifier = notifier
    def place(self, order):
        # ... business logic ...
        self.notifier.send(order.user, "confirmed")`
    },
    {
      id: "lld-patterns-core",
      name: "The Six Design Patterns That Matter",
      summary: "Strategy, Factory, Observer, State, Singleton, Builder cover ~90% of LLD interviews. Know WHEN, not just how.",
      details: [
        "**Strategy — the king.** Any pluggable rule: pricing (Parking Lot), spot allocation, driver matching, split logic (Splitwise), dice rules. An interface + interchangeable implementations, injected at construction.",
        "**Factory.** Centralizes “which subclass do I build” — vehicles, notification channels, split types. It kills the if/elif chain at *creation* time the way Strategy kills it at *behavior* time.",
        "**Observer.** One event, many reactions: an elevator reaching a floor updates displays; an added expense notifies group members; an order status change fires notifications. Subject holds subscribers; coupling stays loose.",
        "**State.** An object whose allowed actions depend on its mode: vending machine (idle/has-money/dispensing), booking lifecycle, elevator doors. Each state is a class; handlers return the next state — nested-if hell dissolves.",
        "**Singleton — use sparingly.** One shared coordinator (the ParkingLot, a SeatLockProvider). Volunteer the drawbacks (global state, test pain) and you gain credit; sprinkle it silently and you lose it.",
        "**Builder.** Many-optional-fields construction. In Python keyword args often suffice — *saying that* is also a signal of judgment.",
        "**One-liner honorable mentions:** Decorator (stack features on a base — toppings, pricing add-ons) · Chain of Responsibility (logger levels, approval flows) · Command (undo/redo, schedulers) · Adapter (wrap a third-party payment API) · Facade (one clean entry into a messy subsystem)."
      ],
      code: `# Strategy + Factory - the LLD one-two punch
class PricingStrategy(Protocol):
    def price(self, ticket) -> float: ...

class HourlyPricing:
    def price(self, t): return t.hours() * 40
class WeekendFlat:
    def price(self, t): return 200

class ExitGate:
    def __init__(self, pricing: PricingStrategy):
        self.pricing = pricing        # swap rules without touching the gate

# Factory: creation decisions live in ONE place
class SplitFactory:
    registry = {}                     # kind -> class, register at startup
    @classmethod
    def create(cls, kind, **kw):
        return cls.registry[kind](**kw)`
    },
    {
      id: "lld-concurrency",
      name: "Concurrency Basics for LLD",
      summary: "Every good LLD interviewer eventually asks “what if two threads do this at once?” — have the vocabulary and one coded pattern ready.",
      details: [
        "**The race:** check-then-act (`if spot.is_free: spot.assign()`) breaks under concurrency — two threads pass the check together. Fix: make check+act atomic (a lock, or compare-and-swap).",
        "**Pessimistic vs optimistic:** take the lock first (simple, correct, can bottleneck) vs proceed-then-validate a version number at commit, retrying on conflict (better when collisions are rare). BookMyShow seats are the canonical stage for exactly this discussion.",
        "**Producer-consumer:** the shape behind async loggers, job workers, notification dispatch — a thread-safe queue decouples producers from N consumer threads. `queue.Queue` (Python) / `BlockingQueue` (Java) are the primitives to name.",
        "**Deadlock in one breath:** two locks acquired in opposite orders. Fix: a global lock ordering, or one coarser lock. Name it; don't derive it.",
        "**Cheap wins to mention:** immutable objects need no locks · thread-safe singleton (module import in Python, holder idiom in Java) · `ConcurrentHashMap`/atomics for counters."
      ],
      code: `import threading, queue

# Atomic seat hold - pessimistic, with TTL for abandonment
class SeatLockProvider:
    def __init__(self, ttl_sec=300):
        self.holds = {}                    # seat_id -> (user, expires_at)
        self.mu = threading.Lock()
        self.ttl = ttl_sec
    def try_hold(self, seat_id, user, now):
        with self.mu:                      # check-then-act made atomic
            h = self.holds.get(seat_id)
            if h and h[1] > now and h[0] != user:
                return False               # someone else holds it
            self.holds[seat_id] = (user, now + self.ttl)
            return True

# Producer-consumer: the async-logger core
log_q = queue.Queue(maxsize=10000)
def worker():
    while True:
        record = log_q.get()               # blocks until work arrives
        write_to_sink(record)
        log_q.task_done()`
    }
  ],
  lldCases: [
    {
      id: "lld-parking",
      name: "Parking Lot",
      difficulty: "Starter",
      focus: "the hello-world of LLD — strategies, factories, clean entity modeling",
      requirements: [
        "Multiple floors; spot types (bike / compact / large); a vehicle parks in a matching free spot.",
        "Entry gate issues a ticket; exit gate computes the fee and frees the spot.",
        "Pricing varies (hourly, day-pass) and WILL be extended — it's the interviewer's favorite follow-up.",
        "Show free-spot counts per floor."
      ],
      entities: [
        { n: "ParkingLot", s: "singleton", a: ["floors: List[Floor]", "gates: List[Gate]"], m: ["park(vehicle) → Ticket", "unpark(ticket) → Receipt"] },
        { n: "Floor", a: ["spots: Map[SpotType, List[Spot]]"], m: ["free_count(type) → int"] },
        { n: "ParkingSpot", a: ["id", "type: SpotType", "vehicle?"], m: ["assign(vehicle)", "free()"] },
        { n: "Vehicle", s: "abstract → Bike/Car/Truck", a: ["plate", "type"], m: [] },
        { n: "Ticket", a: ["id", "spot", "vehicle", "entry_time"], m: [] },
        { n: "PricingStrategy", s: "interface", a: [], m: ["price(ticket) → amount"] },
        { n: "SpotAllocationStrategy", s: "interface", a: [], m: ["find(floors, type) → Spot"] }
      ],
      relations: [
        "ParkingLot ◆— Floor ◆— ParkingSpot — composition: the lot owns floors, floors own spots",
        "Vehicle ◁— Bike / Car / Truck — inheritance; type maps to allowed SpotTypes",
        "Ticket → Spot, Vehicle — plain associations",
        "ParkingLot → PricingStrategy, SpotAllocationStrategy — injected: these are the swap points"
      ],
      patterns: [
        "**Strategy** — pricing and allocation are exactly the requirements that change; justify the interface out loud.",
        "**Factory** — `VehicleFactory.create('car', plate)` keeps creation + the vehicle→spot-type mapping in one place.",
        "**Singleton** — one lot coordinating shared state; mention its trade-offs unprompted."
      ],
      walkthrough: [
        "Clarify: how many floors? which vehicle types? pricing model? **multiple gates?** — that last question plants the concurrency flag early, on your terms.",
        "Nouns → entities, verbs → methods. Write ParkingLot's two public methods first; everything else exists to serve them.",
        "Code `park()` end-to-end (strategy finds spot → assign → mint ticket) and DEMO it before touching pricing detail.",
        "Close the loop with `unpark()`: price via strategy, free the spot, update floor displays (Observer, if time allows)."
      ],
      code: `from enum import Enum
from abc import ABC, abstractmethod
from typing import List, Dict
import time

class VehicleType(Enum):
    BIKE = 1; CAR = 2; TRUCK = 3

class SpotType(Enum):
    BIKE = 1; COMPACT = 2; LARGE = 3

class Vehicle(ABC):
    def __init__(self, plate: str, type: VehicleType):
        self.plate = plate
        self.type = type

class Car(Vehicle):
    def __init__(self, plate: str):
        super().__init__(plate, VehicleType.CAR)

class ParkingSpot:
    def __init__(self, id: str, type: SpotType):
        self.id = id
        self.type = type
        self.vehicle = None

    def is_free(self) -> bool: return self.vehicle is None
    def assign(self, vehicle: Vehicle): self.vehicle = vehicle
    def free(self): self.vehicle = None

class Floor:
    def __init__(self, num: int, spots: List[ParkingSpot]):
        self.num = num
        self.spots = spots
    def get_free_spots(self, type: SpotType):
        return [s for s in self.spots if s.type == type and s.is_free()]

class Ticket:
    def __init__(self, id: str, spot: ParkingSpot, vehicle: Vehicle):
        self.id = id
        self.spot = spot
        self.vehicle = vehicle
        self.entry_time = time.time()

class PricingStrategy(ABC):
    @abstractmethod
    def calculate_fee(self, duration_hours: float) -> float: pass

class HourlyPricing(PricingStrategy):
    def calculate_fee(self, hrs: float) -> float: return max(40.0, hrs * 40.0)

class SpotAllocationStrategy(ABC):
    @abstractmethod
    def find_spot(self, floors: List[Floor], type: SpotType) -> ParkingSpot: pass

class FirstAvailableAllocation(SpotAllocationStrategy):
    def find_spot(self, floors: List[Floor], type: SpotType) -> ParkingSpot:
        for f in floors:
            free = f.get_free_spots(type)
            if free: return free[0]
        return None

class ParkingLot:
    def __init__(self, floors: List[Floor], alloc: SpotAllocationStrategy, pricing: PricingStrategy):
        self.floors = floors
        self.alloc = alloc
        self.pricing = pricing
        self.tickets = {}

    def park(self, vehicle: Vehicle) -> Ticket:
        stype = self._get_spot_type(vehicle.type)
        spot = self.alloc.find_spot(self.floors, stype)
        if not spot: raise Exception("Lot full")
        spot.assign(vehicle)
        ticket = Ticket(f"TKT-{time.time()}", spot, vehicle)
        self.tickets[ticket.id] = ticket
        return ticket

    def unpark(self, ticket_id: str) -> float:
        ticket = self.tickets.pop(ticket_id, None)
        if not ticket: raise Exception("Invalid ticket")
        ticket.spot.free()
        hrs = (time.time() - ticket.entry_time) / 3600.0
        return self.pricing.calculate_fee(hrs)

    def _get_spot_type(self, vt: VehicleType) -> SpotType:
        return {VehicleType.BIKE: SpotType.BIKE, VehicleType.CAR: SpotType.COMPACT, VehicleType.TRUCK: SpotType.LARGE}[vt]`,
      followups: [
        "**Two gates grab one spot (the concurrency probe):** lock per spot or atomic claim on spot state — never one lot-wide lock. Connect to the concurrency concept page.",
        "**Nearest-spot efficiency:** a min-heap of free spots per (floor, type) makes allocation O(log n) instead of a scan.",
        "**EV charging spots:** new spot type + a charging surcharge decorating the pricing — the OCP test: zero edits to ParkingLot itself."
      ]
    },
    {
      id: "lld-vending",
      name: "Vending Machine",
      difficulty: "Starter",
      focus: "THE State-pattern case — model the transition table before coding",
      requirements: [
        "Accept coins, select a product, dispense, return change; cancel mid-flow refunds.",
        "Products live in coded slots with limited quantity.",
        "Illegal actions (dispense before paying) must be rejected cleanly — not with nested ifs."
      ],
      entities: [
        { n: "VendingMachine", s: "context", a: ["state: State", "inventory", "balance"], m: ["insert_coin(c)", "select(code)", "dispense()", "cancel()"] },
        { n: "State", s: "interface → Idle/HasMoney/Dispensing/OutOfStock", a: [], m: ["insert_coin(m, c)", "select(m, code)", "dispense(m)"] },
        { n: "Inventory", a: ["slots: Map[code, (Item, count)]"], m: ["available(code)", "release(code)"] },
        { n: "Item", a: ["name", "price"], m: [] },
        { n: "Coin", s: "enum", a: ["value"], m: [] }
      ],
      relations: [
        "VendingMachine → State — current state; every user action delegates to it",
        "State ◁— Idle / HasMoney / Dispensing / OutOfStock — one class per mode",
        "VendingMachine ◆— Inventory ◆— Item",
        "Each state handler returns the NEXT state — transitions are explicit, not scattered"
      ],
      patterns: [
        "**State** — the case exists to test this pattern: actions legal in one mode and not another.",
        "**Strategy** — payment methods (coins → UPI/card) as an extension point to mention.",
        "**Singleton** — usually overkill here; saying so is worth more than using it."
      ],
      walkthrough: [
        "Clarify: change-making? cancel? multi-item purchase? Then **draw the transition table on paper before any code** — states × actions → next state.",
        "Define the State interface so every action exists in every state — illegal ones raise/return a message, which is the clean rejection the graders want.",
        "Code Idle → HasMoney → Dispensing happy path, demo a full purchase with change, then add OutOfStock and cancel."
      ],
      followups: [
        "**Change-making:** greedy from largest coin works for canonical denominations — but the machine's coin inventory is finite: track it, fail to 'exact change only' mode.",
        "**Concurrent button mashing:** one lock around the transition is fine at this scale — say WHY it's fine (single physical machine, no contention).",
        "**Restocking/admin:** an AdminState or a separate interface — a nice ISP talking point."
      ]
    },
    {
      id: "lld-elevator",
      name: "Elevator System",
      difficulty: "Core",
      focus: "scheduling strategies + a clean state machine per car",
      requirements: [
        "N elevators, M floors; external requests (floor + direction) and internal ones (target floor).",
        "A dispatcher assigns requests to cars; cars serve stops efficiently (not FCFS teleporting).",
        "Displays on every floor track car position/direction."
      ],
      entities: [
        { n: "ElevatorSystem", s: "singleton", a: ["cars: List[Car]", "dispatcher"], m: ["request(floor, dir)"] },
        { n: "ElevatorCar", a: ["id", "floor", "direction", "stops: SortedSet"], m: ["add_stop(f)", "step()"] },
        { n: "Request", s: "external(floor,dir) / internal(target)", a: [], m: [] },
        { n: "SchedulingStrategy", s: "interface", a: [], m: ["assign(cars, request) → Car"] },
        { n: "Display", s: "observer", a: ["floor"], m: ["update(car)"] },
        { n: "Door", a: ["state"], m: ["open()", "close()"] }
      ],
      relations: [
        "ElevatorSystem ◆— ElevatorCar — composition",
        "ElevatorSystem → SchedulingStrategy — injected; FCFS and LOOK are two implementations",
        "ElevatorCar → state (idle / moving-up / moving-down / doors-open) — a small state machine",
        "Display observes ElevatorCar — Observer keeps cars unaware of UI"
      ],
      patterns: [
        "**Strategy** — scheduling is THE discussion: FCFS (simple, terrible) vs LOOK (serve stops in current direction, reverse when none ahead).",
        "**State** — a car's legal actions depend on its motion/door state.",
        "**Observer** — floor displays update on car movement without coupling."
      ],
      walkthrough: [
        "Clarify: how many cars/floors? optimize for wait time or energy? weight limits? — then scope to request→assignment→movement.",
        "Design ONE car and its state machine first; the dispatcher for N cars comes after — this ordering keeps you shippable.",
        "Implement LOOK with two sorted stop-sets (above/below current floor); step() consumes the nearest stop in the current direction.",
        "Demo: two cars, five floors, a burst of mixed requests — narrate each assignment."
      ],
      followups: [
        "**Starvation:** pure nearest-car assignment can starve a far floor — age requests or cap detours; naming the failure mode is the point.",
        "**Priority modes:** fire service (flush all, go to ground), VIP floors — where do they live? (a decorated/overriding strategy).",
        "**Testing the scheduler:** simulate request streams, assert max/mean wait — interviewers love hearing a test plan."
      ]
    },
    {
      id: "lld-splitwise",
      name: "Splitwise (Expense Sharing)",
      difficulty: "Core",
      focus: "factory + validation per split type, and the debt-simplification algorithm",
      requirements: [
        "Users and groups; an expense has a payer, amount, and a split: equal, exact amounts, or percentages.",
        "Each split type validates differently (exacts sum to total; percents to 100).",
        "Anyone can ask “who owes whom, how much?” at any time.",
        "Follow-up guaranteed: simplify debts to the minimum number of payments."
      ],
      entities: [
        { n: "User", a: ["id", "name"], m: [] },
        { n: "Group", a: ["members", "expenses"], m: ["add_expense(e)"] },
        { n: "Expense", a: ["paid_by", "amount", "splits: List[Split]"], m: [] },
        { n: "Split", s: "abstract → Equal/Exact/Percent", a: ["user", "amount"], m: ["validate(total)"] },
        { n: "BalanceSheet", a: ["net: Map[user, Map[user, amount]]"], m: ["apply(expense)", "balances(user)"] },
        { n: "SplitFactory", a: [], m: ["create(kind, **kw) → Split"] }
      ],
      relations: [
        "Group ◆— Expense ◆— Split — composition down the chain",
        "Split ◁— EqualSplit / ExactSplit / PercentSplit — each owns its validation",
        "BalanceSheet is DERIVED state — expenses are the source of truth, balances a running view"
      ],
      patterns: [
        "**Factory** — split creation + per-type validation in one place; a new split kind touches only the factory registry.",
        "**Strategy** — the split computation itself, if you prefer it over subclassing; either is defensible — say why.",
        "**Observer** — notify members when an expense lands (mention, don't build)."
      ],
      walkthrough: [
        "Clarify: groups or global? currencies (defer)? settle-up flows? — then state the key data decision: **store pairwise NET balances**, updated per expense, rather than replaying all expenses per query.",
        "Code add_expense → validate splits → apply to BalanceSheet; demo with one equal and one exact split.",
        "Keep the expense log as an append-only history — balances are a view over it. Dropping the phrase “event log + derived view” earns real points."
      ],
      code: `from abc import ABC, abstractmethod
from typing import List, Dict

class User:
    def __init__(self, id: str, name: str):
        self.id = id
        self.name = name

class Split(ABC):
    def __init__(self, user: User, amount: float = 0.0):
        self.user = user
        self.amount = amount
    @abstractmethod
    def validate(self, total: float) -> bool: pass

class EqualSplit(Split):
    def validate(self, total: float): return True

class ExactSplit(Split):
    def validate(self, total: float): return True

class PercentSplit(Split):
    def __init__(self, user: User, percent: float):
        super().__init__(user)
        self.percent = percent
    def validate(self, total: float):
        self.amount = (self.percent / 100.0) * total
        return True

class Expense:
    def __init__(self, id: str, paid_by: User, amount: float, splits: List[Split]):
        self.id = id
        self.paid_by = paid_by
        self.amount = amount
        self.splits = splits

class SplitFactory:
    @staticmethod
    def create_splits(type: str, total: float, users: List[User], details: List = None) -> List[Split]:
        if type == "EQUAL":
            share = total / len(users)
            return [EqualSplit(u, share) for u in users]
        elif type == "EXACT":
            return [ExactSplit(u, amt) for u, amt in zip(users, details)]
        elif type == "PERCENT":
            splits = [PercentSplit(u, pct) for u, pct in zip(users, details)]
            for s in splits: s.validate(total)
            return splits
        raise ValueError("Invalid type")

class BalanceSheet:
    def __init__(self):
        self.balances = {} # u1 -> { u2 -> balance }

    def add_expense(self, exp: Expense):
        payer = exp.paid_by
        for s in exp.splits:
            if s.user.id == payer.id: continue
            self._update(s.user.id, payer.id, s.amount)
            self._update(payer.id, s.user.id, -s.amount)

    def _update(self, u1: str, u2: str, amt: float):
        if u1 not in self.balances: self.balances[u1] = {}
        self.balances[u1][u2] = self.balances[u1].get(u2, 0.0) + amt`,
      followups: [
        "**Simplify debts (the hidden algorithm question):** net every user to one number, then repeatedly match max creditor with max debtor via two heaps — O(n log n), minimal transfer count.",
        "**Idempotency:** clients retry add_expense — an expense_id dedup check, same idea as every HLD case.",
        "**Concurrency:** per-group lock suffices; say why global locking is unnecessary."
      ]
    },
    {
      id: "lld-bookmyshow",
      name: "BookMyShow (Ticket Booking)",
      difficulty: "Core",
      focus: "concurrent seat locking — the LLD concurrency exam",
      requirements: [
        "Cinemas → screens → shows; users browse a show's seat map and book seats.",
        "Two users must never book the same seat — the entire case orbits this line.",
        "Selected seats are held briefly during payment; abandoned holds release automatically."
      ],
      entities: [
        { n: "Show", a: ["screen", "movie", "time"], m: ["seat_map()"] },
        { n: "ShowSeat", a: ["show", "seat", "status: free|held|booked"], m: [] },
        { n: "SeatLockProvider", s: "singleton", a: ["holds: Map[seat, (user, expiry)]", "ttl"], m: ["try_hold(seats, user)", "release(seats)"] },
        { n: "Booking", a: ["id", "user", "seats", "state"], m: ["confirm()", "expire()"] },
        { n: "PaymentProcessor", s: "interface", a: [], m: ["charge(user, amount)"] },
        { n: "PricingStrategy", s: "interface", a: [], m: ["price(show, seat) → amount"] }
      ],
      relations: [
        "Cinema ◆— Screen ◆— physical Seat · Show → Screen",
        "**ShowSeat = (show × seat) with status — the modeling insight: you book a seat FOR a show, not a seat**",
        "Booking → ShowSeats · Booking state: created → confirmed / expired",
        "SeatLockProvider is the single concurrency gate — everything mutating seat status goes through it"
      ],
      patterns: [
        "**Singleton** — one SeatLockProvider as the serialization point.",
        "**State** — booking lifecycle (created/confirmed/expired) with legal transitions.",
        "**Adapter** — payment gateways behind one interface.",
        "**Strategy** — pricing by seat class / showtime."
      ],
      walkthrough: [
        "Name the ShowSeat insight in the first five minutes — it reframes everything after.",
        "The flow: select seats → **try_hold ALL atomically (all-or-nothing)** → pay within TTL → confirm; expiry releases holds automatically.",
        "Code SeatLockProvider first (it's the exam — see the concurrency concept page for the exact snippet), then the booking flow around it, then demo two users racing for one seat."
      ],
      code: `from enum import Enum
import threading
import time
from typing import List, Dict

class SeatStatus(Enum):
    FREE = 1; HELD = 2; BOOKED = 3

class BookingStatus(Enum):
    CREATED = 1; CONFIRMED = 2; EXPIRED = 3

class Seat:
    def __init__(self, id: str): self.id = id

class Show:
    def __init__(self, id: str, movie: str, time: float):
        self.id = id; self.movie = movie; self.time = time

class ShowSeat:
    def __init__(self, show: Show, seat: Seat):
        self.show = show; self.seat = seat; self.status = SeatStatus.FREE

class SeatLockProvider:
    def __init__(self, ttl: float = 300.0):
        self.lock = threading.Lock()
        self.holds = {} # seat_id -> (user_id, expiry)
        self.ttl = ttl

    def try_hold(self, sids: List[str], uid: str) -> bool:
        now = time.time()
        with self.lock:
            for sid in sids:
                h = self.holds.get(sid)
                if h and h[1] > now and h[0] != uid: return False
            exp = now + self.ttl
            for sid in sids: self.holds[sid] = (uid, exp)
            return True

    def release(self, sids: List[str]):
        with self.lock:
            for sid in sids: self.holds.pop(sid, None)

class Booking:
    def __init__(self, id: str, uid: str, show: Show, sseats: List[ShowSeat]):
        self.id = id; self.uid = uid; self.show = show; self.sseats = sseats
        self.status = BookingStatus.CREATED

    def confirm(self, lp: SeatLockProvider) -> bool:
        if self.status != BookingStatus.CREATED: return False
        sids = [ss.seat.id for ss in self.sseats]
        now = time.time()
        with lp.lock:
            for sid in sids:
                h = lp.holds.get(sid)
                if not h or h[0] != self.uid or h[1] < now:
                    self.status = BookingStatus.EXPIRED; return False
            for ss in self.sseats: ss.status = SeatStatus.BOOKED
            for sid in sids: lp.holds.pop(sid, None)
            self.status = BookingStatus.CONFIRMED; return True

    def expire(self, lp: SeatLockProvider):
        if self.status == BookingStatus.CREATED:
            self.status = BookingStatus.EXPIRED
            lp.release([ss.seat.id for ss in self.sseats])
            for ss in self.sseats: ss.status = SeatStatus.FREE`,
      followups: [
        "**Pessimistic hold with TTL vs optimistic version-check:** holds win here because abandonment is common and users expect “seat held for 5:00”. Say the trade, not just the answer.",
        "**Multiple app servers?** — the in-process lock becomes Redis `SET NX EX` per seat; same semantics, distributed. This bridge to HLD is exactly what SDE-2 loops probe.",
        "**Oversell prevention:** confirm() re-validates every hold inside a transaction — payment success alone is not booking success.",
        "**Blockbuster opens bookings (thundering herd):** virtual waiting room / queue in front — name it and move on."
      ]
    },
    {
      id: "lld-snake-ladder",
      name: "Snake & Ladder",
      difficulty: "Starter",
      focus: "the 30-minute warm-up — clean game loop, one elegant modeling trick",
      requirements: [
        "N players take turns rolling a die on a 100-cell board; snakes drop you, ladders lift you; first to the end wins.",
        "Board layout (snakes/ladders) is configurable.",
        "Rules will be extended — crooked dice, extra dice, kill rules."
      ],
      entities: [
        { n: "Game", a: ["board", "players: Deque", "dice"], m: ["play()", "take_turn(p)"] },
        { n: "Board", a: ["size", "jumpers: Map[start → end]"], m: ["next_position(pos, roll)"] },
        { n: "Jumper", s: "snake OR ladder", a: ["start", "end"], m: [] },
        { n: "Dice", s: "strategy", a: ["count", "faces"], m: ["roll() → int"] },
        { n: "Player", a: ["name", "position"], m: [] }
      ],
      relations: [
        "Game ◆— Board ◆— Jumper · Game ◆— Player queue",
        "**Jumper models snakes AND ladders as one class** (end < start vs end > start) — the elegance graders notice",
        "Game → Dice — strategy: normal / crooked / multi-dice swap in cleanly"
      ],
      patterns: [
        "**Strategy** — dice behavior.",
        "**Builder** — board construction from config (size, jumper list).",
        "**Command** — undo, if asked; a stack of reversible moves."
      ],
      walkthrough: [
        "This is a speed rep — target a working game in ~30 min.",
        "The loop: pop player from deque → roll → move (clamp overshoot: bounce or stay, ASK which rule) → apply jumper → win check → re-queue.",
        "A `deque` for turn rotation reads better than index arithmetic — small things add up in machine-coding rubrics."
      ],
      followups: [
        "**Kill rule** (landing on an opponent sends them home): does it belong to Board or Game? — a tidy SRP discussion; rules about *players* live in Game.",
        "**Play-till-all-finish** vs first-winner: return a ranking list; the loop barely changes if it was clean.",
        "**Undo:** Command stack of (player, from, to) records — cheap if moves are objects, painful if the loop mutates state inline. Which is the design lesson."
      ]
    },
    {
      id: "lld-logger",
      name: "Logger Framework",
      difficulty: "Core",
      focus: "singleton + strategy + async producer-consumer in one small system",
      requirements: [
        "Log levels (DEBUG < INFO < WARN < ERROR) with a configurable threshold.",
        "Multiple sinks at once: console, file — extensible to remote.",
        "Logging must not block the caller — async by design.",
        "Pluggable formatting (plain, JSON)."
      ],
      entities: [
        { n: "Logger", s: "singleton facade", a: ["config", "dispatcher"], m: ["debug(msg)", "info(msg)", "error(msg)"] },
        { n: "LogRecord", a: ["level", "msg", "ts", "thread"], m: [] },
        { n: "Sink", s: "interface → Console/File", a: [], m: ["write(formatted)"] },
        { n: "Formatter", s: "interface → Plain/JSON", a: [], m: ["format(record) → str"] },
        { n: "AsyncDispatcher", a: ["queue", "worker thread"], m: ["submit(record)"] },
        { n: "LoggerConfig", a: ["threshold", "sinks", "formatter"], m: [] }
      ],
      relations: [
        "Logger → AsyncDispatcher → Sinks — the caller returns as soon as the record is queued",
        "Sink ◁— ConsoleSink / FileSink · Formatter ◁— Plain / JSON",
        "Logger fans out one record to ALL registered sinks — Observer in spirit"
      ],
      patterns: [
        "**Singleton** — the one legitimately natural use; still name the test-pain trade-off.",
        "**Strategy** — formatter.",
        "**Observer** — multiple sinks receiving each record.",
        "**Producer-consumer** — the async queue; this is the concurrency-page pattern, applied.",
        "**Chain of Responsibility** — the classic level-chain design; also say when it's overkill: a simple threshold comparison does the same job with less machinery. That judgment call is a maturity signal."
      ],
      walkthrough: [
        "Clarify: async mandatory? multiple sinks? rotation? — then code the SYNC path first: log() → threshold check → format → fan out to sinks. Demo it.",
        "Wrap it in the AsyncDispatcher (queue + worker thread) second — the caller now just enqueues.",
        "Keep sinks dumb (write a string); keep policy (threshold, format) in config — separation the grader is scanning for."
      ],
      followups: [
        "**Queue full?** — block the caller, drop with a counter, or sample: name all three, pick per use-case (dropping audit logs ≠ dropping debug logs). This is backpressure, LLD-sized.",
        "**Log rotation:** size/time policy inside FileSink — nobody else should know.",
        "**Rate-limiting a noisy logger:** token bucket per source — the HLD idea, miniaturized. Cross-referencing it scores."
      ]
    },
    {
      id: "lld-ride-hailing",
      name: "Ride Hailing (mini-Uber)",
      difficulty: "Stretch",
      focus: "the LLD↔HLD bridge — matching strategies, location indexing, trip lifecycle",
      requirements: [
        "Riders request trips; nearby available drivers get matched; trip runs a lifecycle to completion.",
        "Driver locations update continuously; “nearby” must be efficient, not a full scan.",
        "Pricing supports surge; matching strategy will change — design for it."
      ],
      entities: [
        { n: "TripManager", s: "singleton", a: ["trips", "matching", "pricing"], m: ["request(rider, loc) → Trip"] },
        { n: "Trip", a: ["rider", "driver", "state"], m: ["start()", "end()"] },
        { n: "Driver", a: ["id", "loc", "status: available|on-trip"], m: [] },
        { n: "LocationIndex", a: ["grid: Map[cell, Set[Driver]]"], m: ["update(driver, loc)", "nearby(loc, r)"] },
        { n: "MatchingStrategy", s: "interface", a: [], m: ["match(request, candidates) → Driver"] },
        { n: "PricingStrategy", s: "interface", a: [], m: ["quote(trip) → fare"] }
      ],
      relations: [
        "TripManager ◆— Trip · TripManager → Matching/PricingStrategy — injected swap points",
        "Trip state: requested → matched → started → ended (→ cancelled) — a strict state machine",
        "LocationIndex is the interesting structure: a uniform grid of cells → driver sets"
      ],
      patterns: [
        "**Strategy** — matching (nearest / highest-rated / fairness) and pricing (surge).",
        "**State** — trip lifecycle with legal transitions only.",
        "**Observer** — rider + driver notified on every transition.",
        "**Singleton** — TripManager as coordinator."
      ],
      walkthrough: [
        "Scope HARD — this case eats 90 minutes if you let it: request → match → lifecycle, nothing else.",
        "Build LocationIndex as a uniform grid (dict cell → drivers): `nearby()` checks the cell + 8 neighbors — O(candidates), not O(all drivers). Name geohash/quadtree as the production upgrade; implement the grid.",
        "Matching: candidates from the index → strategy picks → **atomically claim the driver** (status CAS) → create Trip. Demo two riders racing for one driver."
      ],
      followups: [
        "**Two riders, one driver:** atomic claim on driver status — the same shape as BookMyShow seats; saying “same pattern as seat locking” shows transfer.",
        "**Surge pricing:** demand/supply ratio per grid cell feeding the PricingStrategy — the grid does double duty.",
        "**“Scale this to a city of 5M”** — that's the HLD version: the in-process grid becomes a location service (Redis geo), matching becomes a worker pool. Name the seam; this case IS the LLD↔HLD bridge."
      ]
    }
  ]
};
