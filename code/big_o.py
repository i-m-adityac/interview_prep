from functools import lru_cache

class FibonacciSeries:
    """
    Demonstrates different implementations of the Fibonacci sequence
    to illustrate time complexity (Big O) and optimization techniques.
    """

    def fibonacci_recursive(self, n):
        """
        Standard Recursive approach.
        - Time Complexity: O(2^n) - Exponential growth due to redundant calculations.
        - Space Complexity: O(n) - Call stack depth.
        """
        if n <= 0:
            return 0
        if n <= 1:
            return 1
        # Redundant recursive calls recalculate same sub-problems
        return self.fibonacci_recursive(n - 1) + self.fibonacci_recursive(n - 2)

    def fibonacci_memo(self, n, memo=None):
        """
        Memoized (Top-Down Dynamic Programming) approach.
        Stores previously computed results in a dictionary to avoid redundant calculations.
        - Time Complexity: O(n) - Linear growth.
        - Space Complexity: O(n) - For the memo dictionary and call stack.
        """
        if memo is None:
            memo = {}
            
        if n <= 0:
            return 0
        if n <= 1:
            return 1
        if n in memo:
            return memo[n]

        # Store calculated result in memo dictionary
        memo[n] = self.fibonacci_memo(n - 1, memo) + self.fibonacci_memo(n - 2, memo)
        return memo[n]

    @lru_cache(maxsize=None)
    def fibonacci_inbuilt_memo(self, n):
        """
        Inbuilt Memoization using Python's lru_cache.
        Automatically caches function calls and returns cached results for identical arguments.
        - Time Complexity: O(n) - Linear growth.
        - Space Complexity: O(n) - For the cache and call stack.
        """
        if n <= 0:
            return 0
        if n <= 1:
            return 1
        # Recursive calls are automatically cached by the decorator
        return self.fibonacci_inbuilt_memo(n - 1) + self.fibonacci_inbuilt_memo(n - 2)


# Example execution
if __name__ == "__main__":
    series = FibonacciSeries()
    
    # Visual check of execution
    print("Memoized fibonacci(6):", series.fibonacci_memo(6))
    print("Inbuilt Memoized fibonacci(6):", series.fibonacci_inbuilt_memo(6))
    print("Recursive fibonacci(6):", series.fibonacci_recursive(6))

