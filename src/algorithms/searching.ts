export type SearchAlgorithm = 'linear' | 'binary';

export interface SearchStep {
  array: number[];
  current: number | null;
  found: number | null;
  eliminated: number[];
  low?: number;
  high?: number;
  mid?: number;
  description: string;
  target: number;
}

export function generateSearchSteps(array: number[], target: number, algorithm: SearchAlgorithm): SearchStep[] {
  switch (algorithm) {
    case 'linear': return linearSearch([...array], target);
    case 'binary': return binarySearch([...array].sort((a, b) => a - b), target);
  }
}

function linearSearch(arr: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  const eliminated: number[] = [];

  steps.push({ array: [...arr], current: null, found: null, eliminated: [], description: `Searching for ${target} using Linear Search`, target });

  for (let i = 0; i < arr.length; i++) {
    steps.push({ array: [...arr], current: i, found: null, eliminated: [...eliminated], description: `Checking index ${i}: is ${arr[i]} === ${target}?`, target });
    if (arr[i] === target) {
      steps.push({ array: [...arr], current: i, found: i, eliminated: [...eliminated], description: `Found ${target} at index ${i}! 🎯`, target });
      return steps;
    }
    eliminated.push(i);
  }
  steps.push({ array: [...arr], current: null, found: null, eliminated: [...eliminated], description: `${target} not found in array`, target });
  return steps;
}

function binarySearch(arr: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  let low = 0, high = arr.length - 1;

  steps.push({ array: [...arr], current: null, found: null, eliminated: [], low, high, description: `Array sorted. Searching for ${target} using Binary Search`, target });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    steps.push({ array: [...arr], current: mid, found: null, eliminated: [], low, high, mid, description: `Mid = ${mid}, value = ${arr[mid]}. Comparing with ${target}`, target });

    if (arr[mid] === target) {
      steps.push({ array: [...arr], current: mid, found: mid, eliminated: [], low, high, mid, description: `Found ${target} at index ${mid}! 🎯`, target });
      return steps;
    } else if (arr[mid] < target) {
      steps.push({ array: [...arr], current: mid, found: null, eliminated: [], low, high, mid, description: `${arr[mid]} < ${target}, search right half`, target });
      low = mid + 1;
    } else {
      steps.push({ array: [...arr], current: mid, found: null, eliminated: [], low, high, mid, description: `${arr[mid]} > ${target}, search left half`, target });
      high = mid - 1;
    }
  }
  steps.push({ array: [...arr], current: null, found: null, eliminated: [], low, high, description: `${target} not found in array`, target });
  return steps;
}

export const searchInfo: Record<SearchAlgorithm, { name: string; time: string; space: string; description: string; requiresSorted: boolean }> = {
  linear: { name: 'Linear Search', time: 'O(n)', space: 'O(1)', description: 'Checks each element one by one until the target is found or the array ends.', requiresSorted: false },
  binary: { name: 'Binary Search', time: 'O(log n)', space: 'O(1)', description: 'Repeatedly halves the search range. Requires a sorted array.', requiresSorted: true },
};
