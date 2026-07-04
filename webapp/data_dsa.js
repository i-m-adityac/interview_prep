// ============================================================
// FAANG Prep 2026 — DSA Data
// ============================================================

const DATA_DSA = {
  patterns: [
    {
      id: "coding-playbook",
      name: "Coding Round Playbook",
      week: 1,
      recognize: "You are in a live coding interview. The clock is ticking, and you need a systematic execution engine to demonstrate both technical and communication excellence.",
      idea: "Don't just code. The interviewer evaluates your communication, problem-solving structure, and code design. Use the four-step framework to ensure you collect requirements, build alignment on trade-offs, write modular code, and dry-run test cases before running any code.",
      visual: `<div class="sdd"><div class="viz-label">The 45-minute coding budget — spend half your time before typing a single line of code</div><div class="tl"><div class="tl-seg" style="flex:5"><div class="tl-bar sq1"></div><div class="tl-lbl">Clarify<br>5m</div></div><div class="tl-seg" style="flex:10"><div class="tl-bar sq2"></div><div class="tl-lbl">Discuss<br>10m</div></div><div class="tl-seg" style="flex:20"><div class="tl-bar sq4"></div><div class="tl-lbl">Code<br>20m</div></div><div class="tl-seg" style="flex:8"><div class="tl-bar sq5"></div><div class="tl-lbl">Dry-run<br>8m</div></div><div class="tl-seg" style="flex:2"><div class="tl-bar sq6"></div><div class="tl-lbl">Wrap</div></div></div></div>`,
      template: `# Step-by-Step execution protocol in the room:
# 1. CLARIFY: Inputs, constraints, types, edge cases.
# 2. DISCUSS: Pitch brute force, optimize, state Big-O, get sign-off.
# 3. CODE: Use descriptive names, write clean helper functions.
# 4. DRY-RUN: Trace a test case with columns for variable states.`,
      complexity: "Goal: O(N) time / O(N) or O(1) space with zero syntax errors on first attempt.",
      pitfalls: [
        "Jumping into coding immediately — makes you look junior and leads to bugs.",
        "Silent coding — if you don't speak, the interviewer cannot evaluate your thought process.",
        "Not validating inputs — forgetting empty arrays, negative numbers, or overflow checks.",
        "Failing to manually trace a test case — dry-run it first to find logical bugs before compiling."
      ],
      problems: []
    },
    {
      id: "arrays-hashing",
      name: "Arrays & Hashing",
      week: 1,
      recognize: "You need fast lookups, counting, de-duplication, or grouping. Words like “find pairs”, “count occurrences”, “anagram”, “duplicate” are giveaways.",
      idea: "Trade memory for speed: a hash map/set turns an O(n) scan into an O(1) lookup. Most O(n²) brute-force pair problems collapse to O(n) once you ask “what would I need to have already seen for the current element to complete an answer?” — then store exactly that in a map as you go.",
      visual: `<div class="viz-array-wrap"><div class="viz-label">Two Sum — target 9: at each step ask “have I seen (9 − x)?”</div><div class="viz-array"><div class="cell seen">2</div><div class="cell seen">7</div><div class="cell cur">11</div><div class="cell">15</div></div><div class="viz-note">map so far: {2:0, 7:1} — when we reach 7 we find 9−7=2 already in the map ✓</div></div>`,
      template: `# Complement lookup (Two Sum shape)
def two_sum(nums, target):
    seen = {}                      # value -> index
    for i, x in enumerate(nums):
        if target - x in seen:     # the question: "did my complement pass by?"
            return [seen[target - x], i]
        seen[x] = i

# Frequency counting (anagram / majority shape)
from collections import Counter
def is_anagram(s, t):
    return Counter(s) == Counter(t)

# Prefix sum (subarray-sum shape)
def subarray_sum_equals_k(nums, k):
    count, prefix, seen = 0, 0, {0: 1}
    for x in nums:
        prefix += x
        count += seen.get(prefix - k, 0)
        seen[prefix] = seen.get(prefix, 0) + 1
    return count`,
      complexity: "Typically O(n) time, O(n) space — you pay memory to erase the inner loop.",
      pitfalls: [
        "Inserting into the map before checking the complement — breaks when the answer uses the same index twice.",
        "Using a list where a set suffices: `x in list` is O(n) and silently makes your solution O(n²).",
        "Forgetting prefix-sum's seed `{0:1}` — subarrays starting at index 0 disappear."
      ],
      problems: [
        { name: "Two Sum", diff: "E", url: "https://leetcode.com/problems/two-sum/" },
        { name: "Contains Duplicate", diff: "E", url: "https://leetcode.com/problems/contains-duplicate/" },
        { name: "Valid Anagram", diff: "E", url: "https://leetcode.com/problems/valid-anagram/" },
        { name: "Group Anagrams", diff: "M", url: "https://leetcode.com/problems/group-anagrams/" },
        { name: "Top K Frequent Elements", diff: "M", url: "https://leetcode.com/problems/top-k-frequent-elements/" },
        { name: "Product of Array Except Self", diff: "M", url: "https://leetcode.com/problems/product-of-array-except-self/" },
        { name: "Longest Consecutive Sequence", diff: "M", url: "https://leetcode.com/problems/longest-consecutive-sequence/" },
        { name: "Subarray Sum Equals K", diff: "M", url: "https://leetcode.com/problems/subarray-sum-equals-k/" }
      ]
    },
    {
      id: "two-pointers",
      name: "Two Pointers",
      week: 2,
      recognize: "Sorted array (or one you may sort), pairs/triplets with a target, palindromes, in-place removal, or “container/trap water” geometry.",
      idea: "Two indices walk toward each other (or in the same direction at different speeds). The magic: each comparison lets you *discard* one side safely, so the O(n²) pair space is explored in O(n). It only works when the data has an ordering that makes the discard provably safe — that's why sorting first is so common.",
      visual: `<div class="viz-array-wrap"><div class="viz-label">Sorted two-sum, target 13: sum too small → move L right; too big → move R left</div><div class="viz-array"><div class="cell ptr-l">1</div><div class="cell">3</div><div class="cell">4</div><div class="cell">6</div><div class="cell">9</div><div class="cell ptr-r">12</div></div><div class="viz-note">L + R = 13 ✓ — each step permanently rules out a row/column of the pair grid</div></div>`,
      template: `# Converging pointers (sorted pair sum / palindrome shape)
def pair_sum_sorted(nums, target):
    l, r = 0, len(nums) - 1
    while l < r:
        s = nums[l] + nums[r]
        if s == target: return [l, r]
        if s < target:  l += 1     # left value can never pair with anything -> discard
        else:           r -= 1
    return []

# Fast & slow (same-direction, in-place overwrite shape)
def remove_duplicates(nums):
    write = 1
    for read in range(1, len(nums)):
        if nums[read] != nums[write - 1]:
            nums[write] = nums[read]
            write += 1
    return write`,
      complexity: "O(n) after an optional O(n log n) sort; O(1) extra space — this is often *the* follow-up answer when the interviewer says “can you do it without extra memory?”",
      pitfalls: [
        "3Sum: forgetting to skip duplicate values for all three positions → duplicate triplets.",
        "Moving the wrong pointer in container-with-water — always move the *shorter* wall; the taller one can only help.",
        "Off-by-one in `while l < r` vs `l <= r` — decide whether pointers may meet before writing the loop."
      ],
      problems: [
        { name: "Valid Palindrome", diff: "E", url: "https://leetcode.com/problems/valid-palindrome/" },
        { name: "Two Sum II (Sorted)", diff: "M", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
        { name: "3Sum", diff: "M", url: "https://leetcode.com/problems/3sum/" },
        { name: "Container With Most Water", diff: "M", url: "https://leetcode.com/problems/container-with-most-water/" },
        { name: "Sort Colors", diff: "M", url: "https://leetcode.com/problems/sort-colors/" },
        { name: "Trapping Rain Water", diff: "H", url: "https://leetcode.com/problems/trapping-rain-water/" }
      ]
    },
    {
      id: "sliding-window",
      name: "Sliding Window",
      week: 2,
      recognize: "“Longest / shortest / count of subarrays or substrings satisfying X.” Contiguous ranges + an optimum = window.",
      idea: "A window [l, r] slides over the data. Grow r to include new elements; when the window breaks the constraint, shrink from l until it's valid again. Every element enters and leaves the window at most once, so the whole thing is O(n) even though it looks like nested loops. Keep the window's *state* (counts, sum, distinct chars) in O(1)-updatable form.",
      visual: `<div class="viz-array-wrap"><div class="viz-label">Longest substring without repeats — window slides, never restarts</div><div class="viz-array viz-chars"><div class="cell">a</div><div class="cell win">b</div><div class="cell win">c</div><div class="cell win">a</div><div class="cell cur">b</div><div class="cell">c</div></div><div class="viz-note">new 'b' repeats → shrink left past the old 'b', then extend again</div></div>`,
      template: `# Variable-size window (longest-valid shape)
def longest_no_repeat(s):
    seen, l, best = set(), 0, 0
    for r, ch in enumerate(s):
        while ch in seen:          # constraint broken -> shrink
            seen.discard(s[l]); l += 1
        seen.add(ch)
        best = max(best, r - l + 1)
    return best

# Fixed-size window (size-k max/avg shape)
def max_sum_k(nums, k):
    cur = sum(nums[:k]); best = cur
    for r in range(k, len(nums)):
        cur += nums[r] - nums[r - k]   # add entering, drop leaving
        best = max(best, cur)
    return best`,
      complexity: "O(n) time — each index enters and leaves once. Space = window state (often O(k) or O(charset)).",
      pitfalls: [
        "Recomputing window state from scratch each step (O(n·k)) instead of incremental add/remove.",
        "For “minimum window” problems the loop inverts: shrink *while valid*, record inside the shrink loop.",
        "Windows don't work with negative numbers for sum-based shrink logic — that's when you switch to prefix sums."
      ],
      problems: [
        { name: "Best Time to Buy and Sell Stock", diff: "E", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
        { name: "Longest Substring Without Repeating Characters", diff: "M", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
        { name: "Longest Repeating Character Replacement", diff: "M", url: "https://leetcode.com/problems/longest-repeating-character-replacement/" },
        { name: "Permutation in String", diff: "M", url: "https://leetcode.com/problems/permutation-in-string/" },
        { name: "Minimum Window Substring", diff: "H", url: "https://leetcode.com/problems/minimum-window-substring/" },
        { name: "Sliding Window Maximum", diff: "H", url: "https://leetcode.com/problems/sliding-window-maximum/" }
      ]
    },
    {
      id: "stack",
      name: "Stack & Monotonic Stack",
      week: 3,
      recognize: "Matching pairs (brackets), “most recent unresolved thing”, undo semantics — or any “next greater / previous smaller element” question.",
      idea: "A stack remembers unfinished business in reverse order. The monotonic variant keeps the stack sorted by popping anything the new element beats: each pop *resolves* a waiting element (“your next greater element has arrived”). Since every element is pushed and popped once, it's O(n) — this one pattern kills a whole family of “nearest larger/smaller” problems.",
      visual: `<div class="viz-array-wrap"><div class="viz-label">Daily Temperatures — falling temps wait on the stack; a warm day resolves them</div><div class="viz-array"><div class="cell">73</div><div class="cell stk">74</div><div class="cell stk">71</div><div class="cell stk">69</div><div class="cell cur">76</div><div class="cell">72</div></div><div class="viz-note">76 arrives → pops 69, 71, 74 (each learns its answer) then joins the stack</div></div>`,
      template: `# Bracket matching (classic stack)
def valid_parens(s):
    pairs, st = {')':'(', ']':'[', '}':'{'}, []
    for ch in s:
        if ch in pairs:
            if not st or st.pop() != pairs[ch]: return False
        else:
            st.append(ch)
    return not st

# Monotonic stack (next-greater shape)
def daily_temperatures(temps):
    res, st = [0] * len(temps), []      # st holds indices, temps decreasing
    for i, t in enumerate(temps):
        while st and temps[st[-1]] < t: # t resolves everything smaller
            j = st.pop()
            res[j] = i - j
        st.append(i)
    return res`,
      complexity: "O(n) — every index is pushed once and popped at most once. Space O(n) worst case.",
      pitfalls: [
        "Storing values instead of indices — you almost always need the index for distances/widths.",
        "Getting the monotonic direction backwards: next *greater* → keep a *decreasing* stack.",
        "Largest-rectangle problems: forgetting the sentinel bar at the end to flush the stack."
      ],
      problems: [
        { name: "Valid Parentheses", diff: "E", url: "https://leetcode.com/problems/valid-parentheses/" },
        { name: "Min Stack", diff: "M", url: "https://leetcode.com/problems/min-stack/" },
        { name: "Evaluate Reverse Polish Notation", diff: "M", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/" },
        { name: "Daily Temperatures", diff: "M", url: "https://leetcode.com/problems/daily-temperatures/" },
        { name: "Car Fleet", diff: "M", url: "https://leetcode.com/problems/car-fleet/" },
        { name: "Largest Rectangle in Histogram", diff: "H", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/" }
      ]
    },
    {
      id: "binary-search",
      name: "Binary Search",
      week: 3,
      recognize: "Sorted data, O(log n) required, rotated arrays — or (the sneaky one) “minimize the maximum / find the smallest X that works” where you can *check* a guess quickly.",
      idea: "Binary search is not about arrays — it's about any monotonic yes/no boundary. If answers look like [no, no, no, YES, YES, YES], halving finds the boundary in log steps. “Search on the answer”: guess a capacity/speed/day, write a greedy `feasible(guess)` checker, and binary-search the smallest feasible guess. This reframe is a FAANG favorite.",
      visual: `<div class="viz-array-wrap"><div class="viz-label">Find the boundary of feasibility, not a value</div><div class="viz-array"><div class="cell no">✗</div><div class="cell no">✗</div><div class="cell no">✗</div><div class="cell yes cur">✓</div><div class="cell yes">✓</div><div class="cell yes">✓</div><div class="cell yes">✓</div></div><div class="viz-note">answer = first ✓ — mid infeasible → go right; feasible → remember it, go left</div><div class="viz-label" style="margin-top:0.8rem">Rotated sorted array — find which half is sorted first</div><div class="viz-array"><div class="cell">4</div><div class="cell cur">5</div><div class="cell">6</div><div class="cell">7</div><div class="cell stk">0</div><div class="cell stk">1</div><div class="cell stk">2</div></div><div class="viz-note">mid=7 ≥ left=4 → left half [4..7] is sorted · target=1 not in [4..7] → search right half [0..2]</div></div>`,
      template: `# The one loop to memorize: lower-bound / first-true
def first_true(lo, hi, feasible):
    while lo < hi:
        mid = (lo + hi) // 2
        if feasible(mid):
            hi = mid          # mid might be the answer -> keep it in range
        else:
            lo = mid + 1      # mid is definitely not -> discard it
    return lo                 # first index where feasible() is True

# Search-on-answer example: Koko eating bananas
import math
def min_eating_speed(piles, h):
    def feasible(k):
        return sum(math.ceil(p / k) for p in piles) <= h
    return first_true(1, max(piles), feasible)`,
      complexity: "O(log n) on arrays; O(n log(range)) for search-on-answer (n per feasibility check).",
      pitfalls: [
        "Mixing loop styles — learn ONE template (`while lo < hi`, `hi = mid`, `lo = mid+1`) and use it everywhere.",
        "Infinite loop when using `lo = mid` with floor division — that combination never terminates.",
        "Rotated array: first decide which half is sorted, *then* check if the target lies inside it."
      ],
      problems: [
        { name: "Binary Search", diff: "E", url: "https://leetcode.com/problems/binary-search/" },
        { name: "Search a 2D Matrix", diff: "M", url: "https://leetcode.com/problems/search-a-2d-matrix/" },
        { name: "Koko Eating Bananas", diff: "M", url: "https://leetcode.com/problems/koko-eating-bananas/" },
        { name: "Search in Rotated Sorted Array", diff: "M", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
        { name: "Find Minimum in Rotated Sorted Array", diff: "M", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
        { name: "Median of Two Sorted Arrays", diff: "H", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/" }
      ]
    },
    {
      id: "linked-list",
      name: "Linked List",
      week: 4,
      recognize: "The input *is* a linked list — or you need O(1) insert/delete at known positions (LRU cache!).",
      idea: "Almost every list problem is one of three moves: (1) the dummy head that removes “is this the first node?” special-casing, (2) fast & slow pointers for middles and cycle detection (Floyd), (3) the three-pointer reversal dance. Draw boxes and arrows before coding — every list bug is a pointer reassigned one line too early.",
      visual: `<div class="viz-array-wrap"><div class="viz-label">Reversal: prev / cur walk the list, flipping one arrow per step</div><div class="viz-list"><div class="lnode done">1</div><span class="arrow">←</span><div class="lnode ptr-l">2</div><span class="arrow gap">·</span><div class="lnode ptr-r">3</div><span class="arrow">→</span><div class="lnode">4</div></div><div class="viz-note">prev=2, cur=3: save cur.next, point cur back, slide both forward</div></div>`,
      template: `# The reversal dance (memorize cold - it's a building block)
def reverse(head):
    prev = None
    while head:
        nxt = head.next     # 1. save
        head.next = prev    # 2. flip
        prev = head         # 3. advance prev
        head = nxt          # 4. advance head
    return prev

# Fast & slow: middle + cycle detection
def middle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
    return slow

# Dummy head: kills edge cases at the front
def remove_val(head, val):
    dummy = ListNode(0, head)
    cur = dummy
    while cur.next:
        if cur.next.val == val: cur.next = cur.next.next
        else: cur = cur.next
    return dummy.next`,
      complexity: "O(n) time, O(1) space is the standard bar — recursion is elegant but the O(1) iterative version is what they want.",
      pitfalls: [
        "Losing the rest of the list — always save `next` before overwriting a pointer.",
        "No dummy head → separate code path for deleting/inserting at the head → bugs.",
        "LRU cache: forgetting to move a node to the front on *get*, not just on put."
      ],
      problems: [
        { name: "Reverse Linked List", diff: "E", url: "https://leetcode.com/problems/reverse-linked-list/" },
        { name: "Merge Two Sorted Lists", diff: "E", url: "https://leetcode.com/problems/merge-two-sorted-lists/" },
        { name: "Linked List Cycle", diff: "E", url: "https://leetcode.com/problems/linked-list-cycle/" },
        { name: "Reorder List", diff: "M", url: "https://leetcode.com/problems/reorder-list/" },
        { name: "Remove Nth Node From End", diff: "M", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
        { name: "LRU Cache", diff: "M", url: "https://leetcode.com/problems/lru-cache/" },
        { name: "Merge K Sorted Lists", diff: "H", url: "https://leetcode.com/problems/merge-k-sorted-lists/" }
      ]
    },
    {
      id: "trees",
      name: "Trees — DFS & BFS",
      week: 5,
      recognize: "Binary trees, BSTs, n-ary trees. “Depth / path / ancestor / level” vocabulary. BST ⇒ think sorted / inorder.",
      idea: "Two traversal engines power everything. DFS (recursion): trust the function to answer the question for a subtree, combine children's answers at the root — most tree problems are 5 lines once you phrase “what do I return upward?”. BFS (queue): process level by level — anything with “level”, “nearest”, or “zigzag” in it. For BSTs, the inorder traversal is sorted; use the ordering to prune.",
      visual: `<div class="viz-array-wrap"><div class="viz-label">DFS goes deep (stack/recursion) · BFS sweeps levels (queue)</div><div class="viz-tree"><div class="trow"><div class="tnode cur">1</div></div><div class="trow"><div class="tnode win">2</div><div class="tnode win">3</div></div><div class="trow"><div class="tnode">4</div><div class="tnode">5</div><div class="tnode">6</div><div class="tnode">7</div></div></div><div class="viz-note">DFS order: 1 2 4 5 3 6 7 · BFS order: 1 | 2 3 | 4 5 6 7</div></div>`,
      template: `# DFS: "ask the subtree, combine at the root"
def max_depth(root):
    if not root: return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))

# BFS: level-order with a queue
from collections import deque
def level_order(root):
    if not root: return []
    q, out = deque([root]), []
    while q:
        level = []
        for _ in range(len(q)):        # freeze current level size
            node = q.popleft()
            level.append(node.val)
            if node.left:  q.append(node.left)
            if node.right: q.append(node.right)
        out.append(level)
    return out

# BST validation: pass down the allowed range
def is_valid_bst(root, lo=float('-inf'), hi=float('inf')):
    if not root: return True
    if not (lo < root.val < hi): return False
    return (is_valid_bst(root.left, lo, root.val) and
            is_valid_bst(root.right, root.val, hi))`,
      complexity: "O(n) time for full traversals; O(h) space for DFS (recursion depth), O(width) for BFS.",
      pitfalls: [
        "BST validation by only comparing parent↔child — you must thread the full (lo, hi) range down.",
        "Path problems: confusing “path through a node” (combine both children) with “path returned upward” (pick ONE child).",
        "BFS level loop: read `len(q)` once before the inner loop, or levels bleed together."
      ],
      problems: [
        { name: "Invert Binary Tree", diff: "E", url: "https://leetcode.com/problems/invert-binary-tree/" },
        { name: "Maximum Depth of Binary Tree", diff: "E", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
        { name: "Diameter of Binary Tree", diff: "E", url: "https://leetcode.com/problems/diameter-of-binary-tree/" },
        { name: "Binary Tree Level Order Traversal", diff: "M", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
        { name: "Validate Binary Search Tree", diff: "M", url: "https://leetcode.com/problems/validate-binary-search-tree/" },
        { name: "Lowest Common Ancestor of a BST", diff: "M", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/" },
        { name: "Kth Smallest Element in a BST", diff: "M", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
        { name: "Binary Tree Maximum Path Sum", diff: "H", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" }
      ]
    },
    {
      id: "tries",
      name: "Tries (Prefix Trees)",
      week: 6,
      recognize: "Many string lookups sharing prefixes: autocomplete, dictionary search, word games, “starts with”.",
      idea: "A tree where each edge is a character; walking from the root spells a word. All words sharing a prefix share a path, so prefix queries cost O(prefix length) regardless of dictionary size. Each node: a `children` dict + an `is_end` flag. In interviews the trie itself is easy — the interesting part is combining it with DFS/backtracking (Word Search II).",
      visual: `<div class="viz-array-wrap"><div class="viz-label">“car”, “card”, “care” share the c→a→r path</div><div class="viz-tree"><div class="trow"><div class="tnode cur">c</div></div><div class="trow"><div class="tnode win">a</div></div><div class="trow"><div class="tnode win">r ✓</div></div><div class="trow"><div class="tnode">d ✓</div><div class="tnode">e ✓</div></div></div><div class="viz-note">✓ = is_end. Prefix query “car” = walk 3 edges, done — dictionary size irrelevant</div></div>`,
      template: `class TrieNode:
    def __init__(self):
        self.children = {}     # char -> TrieNode
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, TrieNode())
        node.is_end = True

    def _walk(self, s):
        node = self.root
        for ch in s:
            node = node.children.get(ch)
            if not node: return None
        return node

    def search(self, word):
        node = self._walk(word)
        return bool(node and node.is_end)

    def starts_with(self, prefix):
        return self._walk(prefix) is not None`,
      complexity: "Insert/search O(L) where L = word length. Space O(total characters) — the price of speed.",
      pitfalls: [
        "Forgetting `is_end` — “car” being a path doesn't mean “ca” is a word.",
        "Word Search II: not pruning trie nodes after a word is found → TLE on big boards.",
        "Wildcard search ('.') needs branching DFS over all children at that position."
      ],
      problems: [
        { name: "Implement Trie", diff: "M", url: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
        { name: "Design Add and Search Words", diff: "M", url: "https://leetcode.com/problems/design-add-and-search-words-data-structure/" },
        { name: "Word Search II", diff: "H", url: "https://leetcode.com/problems/word-search-ii/" }
      ]
    },
    {
      id: "heap",
      name: "Heap / Priority Queue",
      week: 6,
      recognize: "“K largest / K closest / K most frequent”, streaming data, “schedule the next task”, running median.",
      idea: "A heap gives you the min (or max) in O(1) and updates in O(log n) — perfect when you repeatedly need “the best so far” without full sorting. The K-pattern: keep a heap of size k of the *opposite* kind (min-heap for k-largest), evict the root when it grows — O(n log k) beats sorting. Two heaps facing each other maintain a running median.",
      visual: `<div class="viz-array-wrap"><div class="viz-label">K=3 largest: min-heap of size 3 — newcomers fight the smallest keeper</div><div class="viz-tree"><div class="trow"><div class="tnode cur">7</div></div><div class="trow"><div class="tnode">12</div><div class="tnode">9</div></div></div><div class="viz-note">next value 10 &gt; root 7 → pop 7, push 10. Heap always holds the current top-3</div></div>`,
      template: `import heapq

# K largest: min-heap of size k (root = weakest member)
def k_largest(nums, k):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap            # root heap[0] = kth largest

# Max-heap in Python: negate values
# heapq.heappush(h, -x);  largest = -h[0]

# Two heaps: running median
class MedianFinder:
    def __init__(self):
        self.lo = []   # max-heap (negated): smaller half
        self.hi = []   # min-heap: larger half
    def add(self, num):
        heapq.heappush(self.lo, -num)
        heapq.heappush(self.hi, -heapq.heappop(self.lo))
        if len(self.hi) > len(self.lo):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))
    def median(self):
        if len(self.lo) > len(self.hi): return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2`,
      complexity: "Push/pop O(log n); building from a list O(n) via heapify. K-pattern: O(n log k).",
      pitfalls: [
        "Python only has a min-heap — negate for max, or push tuples (key, item).",
        "Pushing unorderable objects → TypeError; push (priority, tie_breaker, obj).",
        "Using a size-n heap when size-k suffices — the log factor difference matters and interviewers notice."
      ],
      problems: [
        { name: "Kth Largest Element in a Stream", diff: "E", url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/" },
        { name: "Last Stone Weight", diff: "E", url: "https://leetcode.com/problems/last-stone-weight/" },
        { name: "K Closest Points to Origin", diff: "M", url: "https://leetcode.com/problems/k-closest-points-to-origin/" },
        { name: "Kth Largest Element in an Array", diff: "M", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
        { name: "Task Scheduler", diff: "M", url: "https://leetcode.com/problems/task-scheduler/" },
        { name: "Find Median from Data Stream", diff: "H", url: "https://leetcode.com/problems/find-median-from-data-stream/" }
      ]
    },
    {
      id: "backtracking",
      name: "Backtracking",
      week: 7,
      recognize: "“All combinations / permutations / subsets”, “generate every valid X”, puzzles (Sudoku, N-Queens), word search in a grid.",
      idea: "Systematic trial and error on a decision tree: at each step, try every valid choice, recurse, then *undo* (backtrack) and try the next. The three-beat rhythm — choose → explore → unchoose — is the whole pattern. Speed comes from pruning: detect dead ends as high up the tree as possible. Expect exponential complexity and say so out loud; the interviewer knows.",
      visual: `<div class="viz-array-wrap"><div class="viz-label">Subsets of [1,2,3]: at each level, choose an element → recurse → unchoose</div><div class="viz-tree"><div class="trow"><div class="tnode cur">[ ]</div></div><div class="trow"><div class="tnode win">[1]</div><div class="tnode">[2]</div><div class="tnode">[3]</div></div><div class="trow"><div class="tnode win">[1,2]</div><div class="tnode">[1,3]</div><div class="tnode done">[2,3]</div></div><div class="trow"><div class="tnode win">[1,2,3]</div></div></div><div class="viz-note">path [ ]→[1]→[1,2]→[1,2,3]: choose 1 (append) → choose 2 → choose 3 → record → <strong>pop 3</strong> (unchoose) → pop 2 → try 3 → gives [1,3] · 2ⁿ total subsets</div></div>`,
      template: `# The universal skeleton: choose -> explore -> unchoose
def subsets(nums):
    res, path = [], []
    def backtrack(start):
        res.append(path[:])            # record current node
        for i in range(start, len(nums)):
            path.append(nums[i])       # choose
            backtrack(i + 1)           # explore
            path.pop()                 # unchoose
    backtrack(0)
    return res

# Permutations: track what's used
def permutations(nums):
    res, path, used = [], [], set()
    def backtrack():
        if len(path) == len(nums):
            res.append(path[:]); return
        for i, x in enumerate(nums):
            if i in used: continue
            used.add(i); path.append(x)
            backtrack()
            path.pop(); used.discard(i)
    backtrack()
    return res

# Dedup trick (combination-sum-II shape), needs sorted input:
# if i > start and nums[i] == nums[i-1]: continue`,
      complexity: "Subsets O(2ⁿ), permutations O(n!), grid word search O(4^L). State it upfront — it shows judgment.",
      pitfalls: [
        "`res.append(path)` without copying — every entry ends up as the same (empty) list.",
        "Duplicate combinations: sort first, then skip equal siblings at the same tree level.",
        "Grid search: forgetting to un-mark the visited cell on the way back."
      ],
      problems: [
        { name: "Subsets", diff: "M", url: "https://leetcode.com/problems/subsets/" },
        { name: "Combination Sum", diff: "M", url: "https://leetcode.com/problems/combination-sum/" },
        { name: "Permutations", diff: "M", url: "https://leetcode.com/problems/permutations/" },
        { name: "Word Search", diff: "M", url: "https://leetcode.com/problems/word-search/" },
        { name: "Palindrome Partitioning", diff: "M", url: "https://leetcode.com/problems/palindrome-partitioning/" },
        { name: "N-Queens", diff: "H", url: "https://leetcode.com/problems/n-queens/" }
      ]
    },
    {
      id: "graphs",
      name: "Graphs — BFS, DFS & Islands",
      week: 7,
      recognize: "Grids treated as maps, networks, prerequisites, “connected”, “shortest path (unweighted)”, “spread/infection” simulations.",
      idea: "Model first, traverse second: what are the nodes, what are the edges, build an adjacency list (or treat the grid itself as the graph). Then it's the same two engines as trees — DFS for connectivity/component counting, BFS for shortest paths in unweighted graphs — plus one new requirement: a `visited` set, because graphs have cycles. Multi-source BFS (start the queue with *all* sources) is the elegant answer to “rotting oranges”-style spread problems.",
      visual: `<div class="viz-array-wrap"><div class="viz-label">Number of Islands — each DFS flood-fill sinks one island</div><div class="viz-grid"><div class="gcell land">1</div><div class="gcell land">1</div><div class="gcell">0</div><div class="gcell land2">1</div><div class="gcell land">1</div><div class="gcell">0</div><div class="gcell">0</div><div class="gcell land2">1</div><div class="gcell">0</div><div class="gcell">0</div><div class="gcell">0</div><div class="gcell land2">1</div></div><div class="viz-note">2 islands: every unvisited land cell starts a new flood-fill = new island</div></div>`,
      template: `from collections import deque

# Grid DFS (flood fill / islands)
def num_islands(grid):
    rows, cols, count = len(grid), len(grid[0]), 0
    def sink(r, c):
        if not (0 <= r < rows and 0 <= c < cols) or grid[r][c] != "1":
            return
        grid[r][c] = "0"                     # mark visited in-place
        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
            sink(r + dr, c + dc)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                sink(r, c)
    return count

# BFS shortest path (unweighted) - distance = level number
def shortest(graph, src, dst):
    q, seen = deque([(src, 0)]), {src}
    while q:
        node, d = q.popleft()
        if node == dst: return d
        for nxt in graph[node]:
            if nxt not in seen:
                seen.add(nxt)
                q.append((nxt, d + 1))
    return -1`,
      complexity: "O(V + E) for both DFS and BFS — on a grid that's O(rows × cols).",
      pitfalls: [
        "Marking visited when *popping* instead of when *pushing* → nodes enqueued multiple times.",
        "DFS recursion depth: a 300×300 grid can blow Python's stack — mention the iterative version.",
        "Clone Graph: the visited map must store node→copy, and you check it before recursing."
      ],
      problems: [
        { name: "Number of Islands", diff: "M", url: "https://leetcode.com/problems/number-of-islands/" },
        { name: "Max Area of Island", diff: "M", url: "https://leetcode.com/problems/max-area-of-island/" },
        { name: "Clone Graph", diff: "M", url: "https://leetcode.com/problems/clone-graph/" },
        { name: "Rotting Oranges", diff: "M", url: "https://leetcode.com/problems/rotting-oranges/" },
        { name: "Pacific Atlantic Water Flow", diff: "M", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
        { name: "Word Ladder", diff: "H", url: "https://leetcode.com/problems/word-ladder/" }
      ]
    },
    {
      id: "matrix-grids",
      name: "Matrix & 2D Grids",
      week: 7,
      recognize: "The input is a 2D array / grid, and you need to perform coordinate navigation, rotations, transpositions, reflections, or element checking.",
      idea: "A matrix is a graph where cells are nodes and adjacent cells are neighbors. However, unlike standard graphs, matrices have unique geometric properties. Use standard coordinate transformations (e.g. transposing) or coordinate delta loops for directions. Always validate grid bounds (rows/columns) first, and be extremely careful with 2D deep copies.",
      visual: `<div class="viz-array-wrap"><div class="viz-label">Transpose + Reverse = 90° Clockwise Rotation</div><div class="viz-grid viz-grid-3"><div class="cell">1</div><div class="cell">2</div><div class="cell">3</div><div class="cell">4</div><div class="cell">5</div><div class="cell">6</div><div class="cell">7</div><div class="cell">8</div><div class="cell">9</div></div><div class="viz-note">Transpose rows/cols, then reverse each row: [1,2,3] becomes [7,4,1] in column 1 ✓</div></div>`,
      template: `# 1. Safe Deep Copy (crucial: prevent inner list reference sharing)
copied_grid = [row[:] for row in matrix]

# 2. In-Bounds Guard Helper
def is_valid(r, c, rows, cols):
    return 0 <= r < rows and 0 <= c < cols

# 3. Directional Navigation Deltas (clockwise search)
directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
for dr, dc in directions:
    next_r, next_c = r + dr, c + dc

# 4. Transpose a Matrix (flip along main diagonal)
transposed = [[matrix[i][j] for i in range(rows)] for j in range(cols)]`,
      complexity: "Typically O(Rows × Cols) time, and O(Rows × Cols) or O(1) extra space.",
      pitfalls: [
        "Shallow copying matrix: `copied = matrix[:]` only copies outer list pointers. Changing `copied[0][0]` will modify the original matrix!",
        "Off-by-one or out-of-bounds errors — check `0 <= r < rows` and `0 <= c < cols` on every step.",
        "Forgetting direction vectors: writing repetitive if/else blocks for directions makes code bug-prone. Use delta loops."
      ],
      problems: [
        { name: "Rotate Image", diff: "M", url: "https://leetcode.com/problems/rotate-image/" },
        { name: "Spiral Matrix", diff: "M", url: "https://leetcode.com/problems/spiral-matrix/" },
        { name: "Set Matrix Zeroes", diff: "M", url: "https://leetcode.com/problems/set-matrix-zeroes/" }
      ]
    },
    {
      id: "adv-graphs",
      name: "Advanced Graphs — Topo Sort, Union-Find, Dijkstra",
      week: 8,
      recognize: "Prerequisites/build order ⇒ topological sort. Dynamic connectivity / “merge groups” ⇒ union-find. Weighted shortest path ⇒ Dijkstra.",
      idea: "Three specialized tools. Topological sort (Kahn's): repeatedly remove nodes with zero in-degree — if you can't consume every node, there's a cycle (course schedule!). Union-Find: near-O(1) “are these connected? / merge them” with path compression. Dijkstra: BFS upgraded with a priority queue so the *cheapest* frontier node expands first — correct only with non-negative weights.",
      visual: `<div class="viz-array-wrap"><div class="viz-label">Kahn's topo sort: peel off zero-in-degree layers</div><div class="viz-list"><div class="lnode done">A</div><span class="arrow">→</span><div class="lnode cur">B</div><span class="arrow">→</span><div class="lnode">D</div></div><div class="viz-list"><div class="lnode done">C</div><span class="arrow">→</span><div class="lnode cur">B</div></div><div class="viz-note">A, C have no prereqs → remove → B frees up → then D. Leftover nodes = cycle.</div><div class="viz-label" style="margin-top:0.8rem">Dijkstra: always expand the cheapest unvisited node</div><div class="viz-list"><div class="lnode done">S<small style='font-size:0.6rem;display:block'>d=0</small></div><span class="arrow">—2→</span><div class="lnode done">A<small style='font-size:0.6rem;display:block'>d=2</small></div><span class="arrow">—3→</span><div class="lnode cur">C<small style='font-size:0.6rem;display:block'>d=5</small></div></div><div class="viz-list" style="margin-left:1.4rem"><span class="arrow">↘</span><span class="arrow">—6→</span><div class="lnode">B<small style='font-size:0.6rem;display:block'>d=6</small></div><span class="arrow">—1→</span><div class="lnode">C<small style='font-size:0.6rem;display:block'>d=7✗</small></div></div><div class="viz-note">pop A(d=2) → relax edges: C=2+3=5 ✓, B=2+4=6 ✓ · later B→C=7 but C already has 5 → skip (stale entry)</div><div class="viz-label" style="margin-top:0.8rem">Union-Find: path compression flattens the tree</div><div class="viz-list"><div class="lnode">4</div><span class="arrow">→</span><div class="lnode">3</div><span class="arrow">→</span><div class="lnode">2</div><span class="arrow">→</span><div class="lnode cur">1</div></div><div class="viz-list"><span class="arrow">after find(4):</span><div class="lnode done">4</div><span class="arrow">→</span><div class="lnode cur">1</div><span class="arrow"> </span><div class="lnode done">3</div><span class="arrow">→</span><div class="lnode cur">1</div><span class="arrow"> </span><div class="lnode done">2</div><span class="arrow">→</span><div class="lnode cur">1</div></div><div class="viz-note">find(4) walks to root 1, then compresses: every node points directly to root → next find() is O(1)</div></div>`,
      template: `from collections import deque
import heapq

# Topological sort (Kahn's) + cycle detection
def topo_order(n, edges):            # edges: (prereq, course)
    adj, indeg = [[] for _ in range(n)], [0] * n
    for a, b in edges:
        adj[a].append(b); indeg[b] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    order = []
    while q:
        u = q.popleft(); order.append(u)
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0: q.append(v)
    return order if len(order) == n else []   # [] -> cycle

# Union-Find with path compression + union by size
class UF:
    def __init__(self, n):
        self.p = list(range(n)); self.size = [1] * n
    def find(self, x):
        while self.p[x] != x:
            self.p[x] = self.p[self.p[x]]     # path compression
            x = self.p[x]
        return x
    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb: return False
        if self.size[ra] < self.size[rb]: ra, rb = rb, ra
        self.p[rb] = ra; self.size[ra] += self.size[rb]
        return True

# Dijkstra: PQ of (dist, node); first pop = final answer
def dijkstra(adj, src):              # adj[u] = [(v, w), ...]
    dist = {src: 0}
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist.get(u, float('inf')): continue   # stale entry
        for v, w in adj[u]:
            nd = d + w
            if nd < dist.get(v, float('inf')):
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return dist`,
      complexity: "Topo O(V+E) · Union-Find ~O(α(n)) per op · Dijkstra O(E log V).",
      pitfalls: [
        "Dijkstra with negative edges — silently wrong; that's Bellman-Ford territory.",
        "Skipping the stale-entry check in Dijkstra (lazy deletion) → reprocessing and TLE.",
        "Union-find without compression/rank degrades to O(n) chains."
      ],
      problems: [
        { name: "Course Schedule", diff: "M", url: "https://leetcode.com/problems/course-schedule/" },
        { name: "Course Schedule II", diff: "M", url: "https://leetcode.com/problems/course-schedule-ii/" },
        { name: "Number of Connected Components", diff: "M", url: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/" },
        { name: "Redundant Connection", diff: "M", url: "https://leetcode.com/problems/redundant-connection/" },
        { name: "Network Delay Time", diff: "M", url: "https://leetcode.com/problems/network-delay-time/" },
        { name: "Min Cost to Connect All Points", diff: "M", url: "https://leetcode.com/problems/min-cost-to-connect-all-points/" }
      ]
    },
    {
      id: "dp-1d",
      name: "Dynamic Programming — 1D",
      week: 9,
      recognize: "“Number of ways”, “min/max cost to reach”, choices at each step with overlapping subproblems. If your recursion tree recomputes the same input, it's DP.",
      idea: "DP = recursion + memory. The workflow that never fails: (1) write the brute-force recursion, (2) notice repeated states, (3) memoize (top-down), (4) optionally convert to a bottom-up table, (5) optionally compress space. The real skill is *defining the state*: “dp[i] = the answer for the first i elements” — say the definition out loud before writing any code. House Robber: dp[i] = max(rob i + dp[i-2], skip = dp[i-1]).",
      visual: `<div class="viz-array-wrap"><div class="viz-label">Climbing Stairs: each cell = sum of the two before it (Fibonacci in disguise)</div><div class="viz-array"><div class="cell done">1</div><div class="cell done">1</div><div class="cell done">2</div><div class="cell done">3</div><div class="cell done">5</div><div class="cell cur">8</div><div class="cell">?</div></div><div class="viz-note">dp[i] = dp[i−1] + dp[i−2] — last step was a 1-hop or a 2-hop</div></div>`,
      template: `from functools import cache

# Top-down: brute force + @cache (write this FIRST in interviews)
def climb_stairs(n):
    @cache
    def ways(i):
        if i <= 1: return 1
        return ways(i - 1) + ways(i - 2)
    return ways(n)

# Bottom-up with O(1) space (House Robber)
def rob(nums):
    take, skip = 0, 0            # best if we rob / don't rob previous
    for x in nums:
        take, skip = skip + x, max(take, skip)
    return max(take, skip)

# Unbounded choices (Coin Change): min coins to reach amount
def coin_change(coins, amount):
    dp = [0] + [float('inf')] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
      complexity: "O(states × work per state). 1-D problems: usually O(n) or O(n·choices).",
      pitfalls: [
        "Jumping straight to a table without stating the recurrence — get the recursion right first, optimization is mechanical.",
        "Wrong base cases — hand-verify dp[0] and dp[1] before trusting the loop.",
        "Coin Change: confusing “count combinations” (coins outer loop) with “count permutations” (amount outer loop)."
      ],
      problems: [
        { name: "Climbing Stairs", diff: "E", url: "https://leetcode.com/problems/climbing-stairs/" },
        { name: "House Robber", diff: "M", url: "https://leetcode.com/problems/house-robber/" },
        { name: "Coin Change", diff: "M", url: "https://leetcode.com/problems/coin-change/" },
        { name: "Longest Increasing Subsequence", diff: "M", url: "https://leetcode.com/problems/longest-increasing-subsequence/" },
        { name: "Word Break", diff: "M", url: "https://leetcode.com/problems/word-break/" },
        { name: "Decode Ways", diff: "M", url: "https://leetcode.com/problems/decode-ways/" },
        { name: "Maximum Product Subarray", diff: "M", url: "https://leetcode.com/problems/maximum-product-subarray/" }
      ]
    },
    {
      id: "dp-2d",
      name: "Dynamic Programming — 2D",
      week: 10,
      recognize: "Two sequences compared (edit distance, LCS), grid paths, take-or-skip with a capacity (knapsack).",
      idea: "Same workflow, two-dimensional state: dp[i][j] usually means “answer for the first i of A and first j of B” or “best value using items 1..i with capacity j”. The recurrence almost always branches on “do the current elements match / do I take this item?”. Draw a small table by hand and fill 3-4 cells — it debugs your recurrence faster than staring at code.",
      visual: `<div class="viz-array-wrap"><div class="viz-label">LCS("abc", "ac"): match → diagonal + 1, else max(up, left)</div><div class="viz-grid viz-grid-4"><div class="gcell hdr"></div><div class="gcell hdr">a</div><div class="gcell hdr">b</div><div class="gcell hdr">c</div><div class="gcell hdr">a</div><div class="gcell done">1</div><div class="gcell done">1</div><div class="gcell done">1</div><div class="gcell hdr">c</div><div class="gcell done">1</div><div class="gcell done">1</div><div class="gcell land">2</div></div><div class="viz-note">cell [c,c]: chars match → take diagonal (1) + 1 = <strong>2</strong> · cell [c,b]: no match → max(up=1, left=1) = 1</div><div class="viz-label" style="margin-top:0.8rem">Each cell looks at exactly 3 neighbors — memorize the shape</div><div class="viz-grid viz-grid-4" style="margin-top:4px"><div class="gcell hdr"></div><div class="gcell hdr"></div><div class="gcell hdr"></div><div class="gcell hdr"></div><div class="gcell hdr"></div><div class="gcell done">↖</div><div class="gcell stk">↑</div><div class="gcell hdr"></div><div class="gcell hdr"></div><div class="gcell stk">←</div><div class="gcell cur">?</div><div class="gcell hdr"></div></div><div class="viz-note">match → ↖ diagonal + 1 · no match → max(↑ up, ← left) · this 3-cell shape is the same for Edit Distance, just with 3 ops instead of 2</div></div>`,
      template: `# Longest Common Subsequence - the mother of 2-D string DP
def lcs(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i-1] == b[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1        # match -> extend diagonal
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]

# 0/1 Knapsack shape (take-or-skip with capacity)
def knapsack(weights, values, cap):
    dp = [0] * (cap + 1)
    for w, v in zip(weights, values):
        for c in range(cap, w - 1, -1):    # reverse -> each item used once
            dp[c] = max(dp[c], dp[c - w] + v)
    return dp[cap]`,
      complexity: "O(m·n) time; space compressible to one row when the recurrence only looks one row up.",
      pitfalls: [
        "Index confusion: dp is (m+1)×(n+1) but strings are 0-indexed — dp[i][j] pairs with a[i-1], b[j-1].",
        "0/1 knapsack with a forward inner loop reuses an item infinitely — reverse the capacity loop.",
        "Edit distance: all three ops (insert/delete/replace) branch from different neighbors; label them."
      ],
      problems: [
        { name: "Unique Paths", diff: "M", url: "https://leetcode.com/problems/unique-paths/" },
        { name: "Longest Common Subsequence", diff: "M", url: "https://leetcode.com/problems/longest-common-subsequence/" },
        { name: "Coin Change II", diff: "M", url: "https://leetcode.com/problems/coin-change-ii/" },
        { name: "Target Sum", diff: "M", url: "https://leetcode.com/problems/target-sum/" },
        { name: "Edit Distance", diff: "M", url: "https://leetcode.com/problems/edit-distance/" },
        { name: "Longest Palindromic Substring", diff: "M", url: "https://leetcode.com/problems/longest-palindromic-substring/" }
      ]
    },
    {
      id: "greedy",
      name: "Greedy",
      week: 9,
      recognize: "“Maximum/minimum something” where a local rule feels right: jumps, scheduling, gas stations. Often paired with sorting.",
      idea: "Make the locally best choice and never look back. The hard part isn't coding — it's *justifying* why greedy is safe (an exchange argument: “swapping any other choice for the greedy one never makes things worse”). In interviews, state your greedy rule, test it against a tricky example, and only then code. If you can't argue it, it's probably DP.",
      visual: `<div class="viz-array-wrap"><div class="viz-label">Jump Game: track the farthest reachable index in one pass</div><div class="viz-array"><div class="cell done">2</div><div class="cell done">3</div><div class="cell cur">1</div><div class="cell win">1</div><div class="cell win">4</div></div><div class="viz-note">at i=1 reach = max(2, 1+3) = 4 → the end is reachable</div></div>`,
      template: `# Jump Game: farthest-reach sweep
def can_jump(nums):
    reach = 0
    for i, x in enumerate(nums):
        if i > reach: return False   # stranded before reaching i
        reach = max(reach, i + x)
    return True

# Kadane's: max subarray - "extend or restart"
def max_subarray(nums):
    best = cur = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)        # restart if the past is dead weight
        best = max(best, cur)
    return best`,
      complexity: "Usually O(n) or O(n log n) with a sort — that's the appeal.",
      pitfalls: [
        "Assuming greedy works without a counterexample check — coin change with coins [1,3,4], amount 6 breaks greedy.",
        "Kadane's with all-negative arrays: initialize from nums[0], not 0.",
        "Sorting by the wrong key — for interval scheduling it's end time, not start time."
      ],
      problems: [
        { name: "Maximum Subarray", diff: "M", url: "https://leetcode.com/problems/maximum-subarray/" },
        { name: "Jump Game", diff: "M", url: "https://leetcode.com/problems/jump-game/" },
        { name: "Jump Game II", diff: "M", url: "https://leetcode.com/problems/jump-game-ii/" },
        { name: "Gas Station", diff: "M", url: "https://leetcode.com/problems/gas-station/" },
        { name: "Partition Labels", diff: "M", url: "https://leetcode.com/problems/partition-labels/" }
      ]
    },
    {
      id: "intervals",
      name: "Intervals",
      week: 10,
      recognize: "Input is [start, end] pairs: meetings, merging ranges, booking conflicts.",
      idea: "One move solves nearly everything: sort by start, then sweep left to right comparing each interval with the last kept one — overlap if `start ≤ prev_end`. For “minimum rooms” questions, split starts and ends into separate sorted lists (or use a heap of end times) and sweep. Draw the intervals as horizontal bars before coding; the picture *is* the algorithm.",
      visual: `<div class="viz-array-wrap"><div class="viz-label">Merge: sort by start, extend the current block while overlapping</div><div class="viz-bars"><div class="ibar" style="margin-left:0%;width:30%">1–4</div><div class="ibar" style="margin-left:20%;width:30%">3–6</div><div class="ibar alt" style="margin-left:60%;width:25%">8–10</div></div><div class="viz-note">[1,4] and [3,6] overlap (3 ≤ 4) → merge to [1,6]; [8,10] stands alone</div></div>`,
      template: `# Merge Intervals - the canonical sweep
def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    out = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= out[-1][1]:              # overlaps the last block
            out[-1][1] = max(out[-1][1], end)
        else:
            out.append([start, end])
    return out

# Meeting Rooms II: min rooms via two-pointer sweep
def min_rooms(intervals):
    starts = sorted(i[0] for i in intervals)
    ends   = sorted(i[1] for i in intervals)
    rooms, e = 0, 0
    for s in starts:
        if s < ends[e]:
            rooms += 1        # this meeting overlaps all e unfinished ones
        else:
            e += 1            # reuse the room freed by ends[e]
    return rooms`,
      complexity: "O(n log n) for the sort; the sweep itself is O(n).",
      pitfalls: [
        "Touching endpoints: is [1,4] + [4,5] an overlap? Ask the interviewer — it changes ≤ vs <.",
        "Merging: take max(prev_end, end) — a later interval can be fully swallowed.",
        "Non-overlapping-intervals (erase count): sort by END time, greedy-keep earliest-ending."
      ],
      problems: [
        { name: "Insert Interval", diff: "M", url: "https://leetcode.com/problems/insert-interval/" },
        { name: "Merge Intervals", diff: "M", url: "https://leetcode.com/problems/merge-intervals/" },
        { name: "Non-overlapping Intervals", diff: "M", url: "https://leetcode.com/problems/non-overlapping-intervals/" },
        { name: "Meeting Rooms II", diff: "M", url: "https://leetcode.com/problems/meeting-rooms-ii/" }
      ]
    },
    {
      id: "bits",
      name: "Bit Manipulation",
      week: 11,
      recognize: "“Without extra memory”, “appears once while others appear twice”, counting bits, arithmetic without operators.",
      idea: "Five idioms cover ~90% of bit questions: XOR cancels pairs (x^x=0), `n & (n-1)` clears the lowest set bit, `n & 1` reads the last bit, shifts multiply/divide by 2, and a bitmask can represent any subset of ≤ ~20 items as an int. Bit questions are rarer at FAANG now but they're cheap to prepare and make great warm-ups.",
      visual: `<div class="viz-array-wrap"><div class="viz-label">n & (n−1) clears the lowest set bit</div><div class="viz-array viz-chars"><div class="cell">1</div><div class="cell">0</div><div class="cell win">1</div><div class="cell cur">1</div><div class="cell">0</div><div class="cell">0</div></div><div class="viz-note">n=44 (101100) & 43 (101011) = 101000 — one set bit gone per operation</div></div>`,
      template: `# XOR: the pair annihilator
def single_number(nums):
    acc = 0
    for x in nums: acc ^= x    # pairs cancel; the loner survives
    return acc

# Count set bits: Brian Kernighan
def hamming_weight(n):
    count = 0
    while n:
        n &= n - 1             # drop lowest set bit
        count += 1
    return count

# Missing number in 0..n: XOR indices against values
def missing_number(nums):
    acc = len(nums)
    for i, x in enumerate(nums):
        acc ^= i ^ x
    return acc`,
      complexity: "O(n) or O(bits) — constant space is the whole point.",
      pitfalls: [
        "Python ints are unbounded — simulating 32-bit overflow needs masking with 0xFFFFFFFF.",
        "Operator precedence: `==` binds tighter than `&` — parenthesize `(n & 1) == 1`.",
        "Signed shifts: know that Python has no arithmetic-shift trap, but C++/Java interviewers may probe it."
      ],
      problems: [
        { name: "Single Number", diff: "E", url: "https://leetcode.com/problems/single-number/" },
        { name: "Number of 1 Bits", diff: "E", url: "https://leetcode.com/problems/number-of-1-bits/" },
        { name: "Counting Bits", diff: "E", url: "https://leetcode.com/problems/counting-bits/" },
        { name: "Missing Number", diff: "E", url: "https://leetcode.com/problems/missing-number/" },
        { name: "Sum of Two Integers", diff: "M", url: "https://leetcode.com/problems/sum-of-two-integers/" }
      ]
    },
    {
      id: "design",
      name: "Design Problems (OOD-lite)",
      week: 11,
      recognize: "“Design a data structure that supports X, Y in O(1)…” — LRU/LFU cache, Twitter feed, randomized set.",
      idea: "These test whether you can *compose* structures: each required operation's complexity constraint tells you which structure to bolt on. O(1) lookup → hash map. O(1) ordering/recency → doubly linked list. O(1) random → array + swap-with-last delete. Log-time min → heap. Practice narrating the composition: “get must be O(1) so I need a map; eviction needs recency order so I pair it with a linked list.”",
      visual: `<div class="viz-array-wrap"><div class="viz-label">LRU Cache = hash map (O(1) find) + doubly-linked list (O(1) reorder)</div><div class="viz-list"><div class="lnode cur">MRU</div><span class="arrow">⇄</span><div class="lnode">k2</div><span class="arrow">⇄</span><div class="lnode">k7</div><span class="arrow">⇄</span><div class="lnode done">LRU</div></div><div class="viz-note">map points straight into list nodes; touch = unlink + move to front; evict = drop tail</div></div>`,
      template: `# LRU Cache via OrderedDict (know the manual version too!)
from collections import OrderedDict
class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.od = OrderedDict()
    def get(self, key):
        if key not in self.od: return -1
        self.od.move_to_end(key)          # touch = most recent
        return self.od[key]
    def put(self, key, value):
        if key in self.od: self.od.move_to_end(key)
        self.od[key] = value
        if len(self.od) > self.cap:
            self.od.popitem(last=False)   # evict least recent

# Insert/Delete/GetRandom O(1): array + index map
import random
class RandomizedSet:
    def __init__(self):
        self.arr, self.idx = [], {}
    def insert(self, v):
        if v in self.idx: return False
        self.idx[v] = len(self.arr); self.arr.append(v)
        return True
    def remove(self, v):
        if v not in self.idx: return False
        i, last = self.idx[v], self.arr[-1]
        self.arr[i], self.idx[last] = last, i   # swap victim with last
        self.arr.pop(); del self.idx[v]
        return True
    def get_random(self):
        return random.choice(self.arr)`,
      complexity: "Each operation's bound is part of the spec — restate them before coding.",
      pitfalls: [
        "Using OrderedDict without being able to explain the underlying map+DLL — interviewers will ask.",
        "RandomizedSet remove: forgetting to update the moved element's index in the map.",
        "Not asking about capacity/eviction/thread-safety expectations upfront."
      ],
      problems: [
        { name: "LRU Cache", diff: "M", url: "https://leetcode.com/problems/lru-cache/" },
        { name: "Insert Delete GetRandom O(1)", diff: "M", url: "https://leetcode.com/problems/insert-delete-getrandom-o1/" },
        { name: "Design Twitter", diff: "M", url: "https://leetcode.com/problems/design-twitter/" },
        { name: "Time Based Key-Value Store", diff: "M", url: "https://leetcode.com/problems/time-based-key-value-store/" },
        { name: "LFU Cache", diff: "H", url: "https://leetcode.com/problems/lfu-cache/" }
      ]
    }
  ]
};
