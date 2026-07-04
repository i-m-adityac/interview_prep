// ============================================================
// FAANG Prep 2026 — Centralized Coding Problems Bank
// ============================================================

const DATA_PROBLEMS = {
  // Arrays & Hashing
  "two-sum": {
    name: "Two Sum",
    diff: "E",
    url: "https://leetcode.com/problems/two-sum/",
    pattern: "arrays-hashing"
  },
  "contains-duplicate": {
    name: "Contains Duplicate",
    diff: "E",
    url: "https://leetcode.com/problems/contains-duplicate/",
    pattern: "arrays-hashing"
  },
  "valid-anagram": {
    name: "Valid Anagram",
    diff: "E",
    url: "https://leetcode.com/problems/valid-anagram/",
    pattern: "arrays-hashing"
  },
  "group-anagrams": {
    name: "Group Anagrams",
    diff: "M",
    url: "https://leetcode.com/problems/group-anagrams/",
    pattern: "arrays-hashing"
  },
  "top-k-frequent-elements": {
    name: "Top K Frequent Elements",
    diff: "M",
    url: "https://leetcode.com/problems/top-k-frequent-elements/",
    pattern: "arrays-hashing"
  },
  "longest-consecutive-sequence": {
    name: "Longest Consecutive Sequence",
    diff: "M",
    url: "https://leetcode.com/problems/longest-consecutive-sequence/",
    pattern: "arrays-hashing"
  },
  "subarray-sum-equals-k": {
    name: "Subarray Sum Equals K",
    diff: "M",
    url: "https://leetcode.com/problems/subarray-sum-equals-k/",
    pattern: "arrays-hashing"
  },

  // Two Pointers & Sliding Window
  "valid-palindrome": {
    name: "Valid Palindrome",
    diff: "E",
    url: "https://leetcode.com/problems/valid-palindrome/",
    pattern: "two-pointers"
  },
  "two-sum-ii-sorted": {
    name: "Two Sum II (Sorted)",
    diff: "M",
    url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
    pattern: "two-pointers"
  },
  "three-sum": {
    name: "3Sum",
    diff: "M",
    url: "https://leetcode.com/problems/3sum/",
    pattern: "two-pointers"
  },
  "container-with-most-water": {
    name: "Container With Most Water",
    diff: "M",
    url: "https://leetcode.com/problems/container-with-most-water/",
    pattern: "two-pointers"
  },
  "trapping-rain-water": {
    name: "Trapping Rain Water",
    diff: "H",
    url: "https://leetcode.com/problems/trapping-rain-water/",
    pattern: "two-pointers"
  },
  "longest-substring-without-repeating": {
    name: "Longest Substring Without Repeating Characters",
    diff: "M",
    url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    pattern: "sliding-window"
  },
  "longest-repeating-character-replacement": {
    name: "Longest Repeating Character Replacement",
    diff: "M",
    url: "https://leetcode.com/problems/longest-repeating-character-replacement/",
    pattern: "sliding-window"
  },
  "minimum-window-substring": {
    name: "Minimum Window Substring",
    diff: "H",
    url: "https://leetcode.com/problems/minimum-window-substring/",
    pattern: "sliding-window"
  },

  // Stack & Monotonic Stack
  "valid-parentheses": {
    name: "Valid Parentheses",
    diff: "E",
    url: "https://leetcode.com/problems/valid-parentheses/",
    pattern: "stack"
  },
  "min-stack": {
    name: "Min Stack",
    diff: "M",
    url: "https://leetcode.com/problems/min-stack/",
    pattern: "stack"
  },
  "daily-temperatures": {
    name: "Daily Temperatures",
    diff: "M",
    url: "https://leetcode.com/problems/daily-temperatures/",
    pattern: "stack"
  },
  "decode-string": {
    name: "Decode String",
    diff: "M",
    url: "https://leetcode.com/problems/decode-string/",
    pattern: "stack"
  },
  "largest-rectangle-histogram": {
    name: "Largest Rectangle in Histogram",
    diff: "H",
    url: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    pattern: "stack"
  },

  // Binary Search
  "search-in-rotated-sorted-array": {
    name: "Search in Rotated Sorted Array",
    diff: "M",
    url: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    pattern: "binary-search"
  },
  "koko-eating-bananas": {
    name: "Koko Eating Bananas",
    diff: "M",
    url: "https://leetcode.com/problems/koko-eating-bananas/",
    pattern: "binary-search"
  },
  "find-first-and-last-in-sorted-array": {
    name: "Find First and Last Position of Element in Sorted Array",
    diff: "M",
    url: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
    pattern: "binary-search"
  },

  // Linked Lists
  "reverse-linked-list": {
    name: "Reverse Linked List",
    diff: "E",
    url: "https://leetcode.com/problems/reverse-linked-list/",
    pattern: "linked-list"
  },
  "merge-two-sorted-lists": {
    name: "Merge Two Sorted Lists",
    diff: "E",
    url: "https://leetcode.com/problems/merge-two-sorted-lists/",
    pattern: "linked-list"
  },
  "linked-list-cycle": {
    name: "Linked List Cycle",
    diff: "E",
    url: "https://leetcode.com/problems/linked-list-cycle/",
    pattern: "linked-list"
  },
  "copy-list-with-random-pointer": {
    name: "Copy List with Random Pointer",
    diff: "M",
    url: "https://leetcode.com/problems/copy-list-with-random-pointer/",
    pattern: "linked-list"
  },
  "lru-cache": {
    name: "LRU Cache",
    diff: "M",
    url: "https://leetcode.com/problems/lru-cache/",
    pattern: "design"
  },
  "lfu-cache": {
    name: "LFU Cache",
    diff: "H",
    url: "https://leetcode.com/problems/lfu-cache/",
    pattern: "design"
  },

  // Heaps / Priority Queues
  "k-closest-points": {
    name: "K Closest Points to Origin",
    diff: "M",
    url: "https://leetcode.com/problems/k-closest-points-to-origin/",
    pattern: "heap"
  },
  "top-k-frequent-words": {
    name: "Top K Frequent Words",
    diff: "M",
    url: "https://leetcode.com/problems/top-k-frequent-words/",
    pattern: "heap"
  },
  "task-scheduler": {
    name: "Task Scheduler",
    diff: "M",
    url: "https://leetcode.com/problems/task-scheduler/",
    pattern: "heap"
  },
  "merge-k-sorted-lists": {
    name: "Merge k Sorted Lists",
    diff: "H",
    url: "https://leetcode.com/problems/merge-k-sorted-lists/",
    pattern: "heap"
  },
  "median-from-data-stream": {
    name: "Find Median from Data Stream",
    diff: "H",
    url: "https://leetcode.com/problems/find-median-from-data-stream/",
    pattern: "heap"
  },

  // Intervals
  "merge-intervals": {
    name: "Merge Intervals",
    diff: "M",
    url: "https://leetcode.com/problems/merge-intervals/",
    pattern: "intervals"
  },
  "non-overlapping-intervals": {
    name: "Non-overlapping Intervals",
    diff: "M",
    url: "https://leetcode.com/problems/non-overlapping-intervals/",
    pattern: "intervals"
  },
  "meeting-rooms-ii": {
    name: "Meeting Rooms II",
    diff: "M",
    url: "https://leetcode.com/problems/meeting-rooms-ii/",
    pattern: "intervals"
  },

  // Trees & Graphs
  "binary-tree-inorder": {
    name: "Binary Tree Inorder Traversal",
    diff: "E",
    url: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
    pattern: "trees"
  },
  "invert-binary-tree": {
    name: "Invert Binary Tree",
    diff: "E",
    url: "https://leetcode.com/problems/invert-binary-tree/",
    pattern: "trees"
  },
  "maximum-depth-binary-tree": {
    name: "Maximum Depth of Binary Tree",
    diff: "E",
    url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    pattern: "trees"
  },
  "validate-binary-search-tree": {
    name: "Validate Binary Search Tree",
    diff: "M",
    url: "https://leetcode.com/problems/validate-binary-search-tree/",
    pattern: "trees"
  },
  "lowest-common-ancestor-bst": {
    name: "Lowest Common Ancestor of a Binary Search Tree",
    diff: "E",
    url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    pattern: "trees"
  },
  "binary-tree-max-path-sum": {
    name: "Binary Tree Maximum Path Sum",
    diff: "H",
    url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
    pattern: "trees"
  },
  "serialize-deserialize-binary-tree": {
    name: "Serialize and Deserialize Binary Tree",
    diff: "H",
    url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
    pattern: "trees"
  },
  "implement-trie": {
    name: "Implement Trie (Prefix Tree)",
    diff: "M",
    url: "https://leetcode.com/problems/implement-trie-prefix-tree/",
    pattern: "tries"
  },
  "word-search-ii": {
    name: "Word Search II",
    diff: "H",
    url: "https://leetcode.com/problems/word-search-ii/",
    pattern: "tries"
  },
  "number-of-islands": {
    name: "Number of Islands",
    diff: "M",
    url: "https://leetcode.com/problems/number-of-islands/",
    pattern: "graphs"
  },
  "clone-graph": {
    name: "Clone Graph",
    diff: "M",
    url: "https://leetcode.com/problems/clone-graph/",
    pattern: "graphs"
  },
  "course-schedule": {
    name: "Course Schedule",
    diff: "M",
    url: "https://leetcode.com/problems/course-schedule/",
    pattern: "graphs"
  },
  "network-delay-time": {
    name: "Network Delay Time",
    diff: "M",
    url: "https://leetcode.com/problems/network-delay-time/",
    pattern: "adv-graphs"
  },
  "alien-dictionary": {
    name: "Alien Dictionary",
    diff: "H",
    url: "https://leetcode.com/problems/alien-dictionary/",
    pattern: "adv-graphs"
  },

  // Dynamic Programming & Greedy
  "climbing-stairs": {
    name: "Climbing Stairs",
    diff: "E",
    url: "https://leetcode.com/problems/climbing-stairs/",
    pattern: "dp-1d"
  },
  "coin-change": {
    name: "Coin Change",
    diff: "M",
    url: "https://leetcode.com/problems/coin-change/",
    pattern: "dp-1d"
  },
  "longest-increasing-subsequence": {
    name: "Longest Increasing Subsequence",
    diff: "M",
    url: "https://leetcode.com/problems/longest-increasing-subsequence/",
    pattern: "dp-1d"
  },
  "longest-common-subsequence": {
    name: "Longest Common Subsequence",
    diff: "M",
    url: "https://leetcode.com/problems/longest-common-subsequence/",
    pattern: "dp-2d"
  },
  "edit-distance": {
    name: "Edit Distance",
    diff: "H",
    url: "https://leetcode.com/problems/edit-distance/",
    pattern: "dp-2d"
  },
  "jump-game": {
    name: "Jump Game",
    diff: "M",
    url: "https://leetcode.com/problems/jump-game/",
    pattern: "greedy"
  },
  "gas-station": {
    name: "Gas Station",
    diff: "M",
    url: "https://leetcode.com/problems/gas-station/",
    pattern: "greedy"
  }
};
