// version 1 - using mathematics formula
// Time complexity: O(1)
// Space complexity: O(1)
function sum_to_n_a(n: number): number {
  // 1 + 2 + 3 + ... + n = n * (n + 1) / 2
  return (n * (n + 1)) / 2;
}

// version 2 - using simple for loop
// Time complexity: O(n)
// Space complexity: O(1)
function sum_to_n_b(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }

  return sum;
}

// version 3 - recusive way (quite complex implementation)
// using extra space to improve time complexity
// Time complexity: O(n)
// Space complexity: O(n)
const mem: { [key: string]: number } = { 1: 1 };
function sum_to_n_c(n: number): number {
  if (mem[n]) {
    return mem[n];
  }

  const res = n + sum_to_n_c(n - 1);
  mem[n] = res;

  return res;
}
