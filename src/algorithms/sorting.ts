export type SortAlgorithm = 'bubble' | 'selection' | 'insertion' | 'quick' | 'merge' | 'heap';

export interface SortStep {
  array: number[];
  comparing: [number, number] | null;
  swapping: [number, number] | null;
  sorted: number[];
  description: string;
}

export function generateSteps(array: number[], algorithm: SortAlgorithm): SortStep[] {
  switch (algorithm) {
    case 'bubble': return bubbleSort([...array]);
    case 'selection': return selectionSort([...array]);
    case 'insertion': return insertionSort([...array]);
    case 'quick': return quickSort([...array]);
    case 'merge': return mergeSort([...array]);
    case 'heap': return heapSort([...array]);
  }
}

function bubbleSort(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const sorted: number[] = [];
  const a = [...arr];
  
  steps.push({ array: [...a], comparing: null, swapping: null, sorted: [], description: 'Starting Bubble Sort' });
  
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      steps.push({ array: [...a], comparing: [j, j + 1], swapping: null, sorted: [...sorted], description: `Comparing ${a[j]} and ${a[j + 1]}` });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ array: [...a], comparing: null, swapping: [j, j + 1], sorted: [...sorted], description: `Swapped ${a[j + 1]} and ${a[j]}` });
      }
    }
    sorted.unshift(a.length - i - 1);
  }
  sorted.unshift(0);
  steps.push({ array: [...a], comparing: null, swapping: null, sorted: [...sorted], description: 'Bubble Sort complete!' });
  return steps;
}

function selectionSort(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const sorted: number[] = [];
  const a = [...arr];
  
  steps.push({ array: [...a], comparing: null, swapping: null, sorted: [], description: 'Starting Selection Sort' });
  
  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      steps.push({ array: [...a], comparing: [minIdx, j], swapping: null, sorted: [...sorted], description: `Finding minimum: comparing ${a[minIdx]} and ${a[j]}` });
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      steps.push({ array: [...a], comparing: null, swapping: [i, minIdx], sorted: [...sorted], description: `Swapped ${a[minIdx]} to position ${i}` });
    }
    sorted.push(i);
  }
  sorted.push(a.length - 1);
  steps.push({ array: [...a], comparing: null, swapping: null, sorted: [...sorted], description: 'Selection Sort complete!' });
  return steps;
}

function insertionSort(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const a = [...arr];
  const sorted: number[] = [0];
  
  steps.push({ array: [...a], comparing: null, swapping: null, sorted: [0], description: 'Starting Insertion Sort' });
  
  for (let i = 1; i < a.length; i++) {
    let j = i;
    while (j > 0 && a[j - 1] > a[j]) {
      steps.push({ array: [...a], comparing: [j - 1, j], swapping: null, sorted: [...sorted], description: `Comparing ${a[j - 1]} and ${a[j]}` });
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
      steps.push({ array: [...a], comparing: null, swapping: [j - 1, j], sorted: [...sorted], description: `Inserted ${a[j]} into correct position` });
      j--;
    }
    sorted.push(i);
  }
  steps.push({ array: [...a], comparing: null, swapping: null, sorted: sorted, description: 'Insertion Sort complete!' });
  return steps;
}

function quickSort(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const a = [...arr];
  const sorted: number[] = [];

  steps.push({ array: [...a], comparing: null, swapping: null, sorted: [], description: 'Starting Quick Sort' });

  function partition(low: number, high: number): number {
    const pivot = a[high];
    steps.push({ array: [...a], comparing: [high, high], swapping: null, sorted: [...sorted], description: `Pivot chosen: ${pivot}` });
    let i = low - 1;
    for (let j = low; j < high; j++) {
      steps.push({ array: [...a], comparing: [j, high], swapping: null, sorted: [...sorted], description: `Comparing ${a[j]} with pivot ${pivot}` });
      if (a[j] < pivot) {
        i++;
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          steps.push({ array: [...a], comparing: null, swapping: [i, j], sorted: [...sorted], description: `Swapped ${a[j]} and ${a[i]}` });
        }
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    steps.push({ array: [...a], comparing: null, swapping: [i + 1, high], sorted: [...sorted], description: `Pivot ${pivot} placed at position ${i + 1}` });
    sorted.push(i + 1);
    return i + 1;
  }

  function qs(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      qs(low, pi - 1);
      qs(pi + 1, high);
    } else if (low === high) {
      sorted.push(low);
    }
  }

  qs(0, a.length - 1);
  steps.push({ array: [...a], comparing: null, swapping: null, sorted: Array.from({ length: a.length }, (_, i) => i), description: 'Quick Sort complete!' });
  return steps;
}

function mergeSort(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const a = [...arr];

  steps.push({ array: [...a], comparing: null, swapping: null, sorted: [], description: 'Starting Merge Sort' });

  function mergeSortHelper(left: number, right: number) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    mergeSortHelper(left, mid);
    mergeSortHelper(mid + 1, right);

    const temp: number[] = [];
    let i = left, j = mid + 1;
    while (i <= mid && j <= right) {
      steps.push({ array: [...a], comparing: [i, j], swapping: null, sorted: [], description: `Merging: comparing ${a[i]} and ${a[j]}` });
      if (a[i] <= a[j]) { temp.push(a[i++]); }
      else { temp.push(a[j++]); }
    }
    while (i <= mid) temp.push(a[i++]);
    while (j <= right) temp.push(a[j++]);
    for (let k = 0; k < temp.length; k++) {
      a[left + k] = temp[k];
      steps.push({ array: [...a], comparing: null, swapping: [left + k, left + k], sorted: [], description: `Placing ${temp[k]} at position ${left + k}` });
    }
  }

  mergeSortHelper(0, a.length - 1);
  steps.push({ array: [...a], comparing: null, swapping: null, sorted: Array.from({ length: a.length }, (_, i) => i), description: 'Merge Sort complete!' });
  return steps;
}

function heapSort(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const a = [...arr];
  const sorted: number[] = [];

  steps.push({ array: [...a], comparing: null, swapping: null, sorted: [], description: 'Starting Heap Sort — building max-heap' });

  function heapify(n: number, i: number) {
    let largest = i;
    const l = 2 * i + 1, r = 2 * i + 2;
    steps.push({ array: [...a], comparing: [i, l < n ? l : i], swapping: null, sorted: [...sorted], description: `Heapify at index ${i}` });
    if (l < n && a[l] > a[largest]) largest = l;
    if (r < n && a[r] > a[largest]) largest = r;
    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      steps.push({ array: [...a], comparing: null, swapping: [i, largest], sorted: [...sorted], description: `Swapped ${a[largest]} and ${a[i]}` });
      heapify(n, largest);
    }
  }

  for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) heapify(a.length, i);
  steps.push({ array: [...a], comparing: null, swapping: null, sorted: [], description: 'Max-heap built! Now extracting elements' });

  for (let i = a.length - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    sorted.unshift(i);
    steps.push({ array: [...a], comparing: null, swapping: [0, i], sorted: [...sorted], description: `Moved max ${a[i]} to position ${i}` });
    heapify(i, 0);
  }
  sorted.unshift(0);
  steps.push({ array: [...a], comparing: null, swapping: null, sorted: Array.from({ length: a.length }, (_, i) => i), description: 'Heap Sort complete!' });
  return steps;
}

export const algorithmInfo: Record<SortAlgorithm, { name: string; time: string; space: string; description: string }> = {
  bubble: { name: 'Bubble Sort', time: 'O(n²)', space: 'O(1)', description: 'Repeatedly swaps adjacent elements if they are in the wrong order.' },
  selection: { name: 'Selection Sort', time: 'O(n²)', space: 'O(1)', description: 'Finds the minimum element and places it at the beginning.' },
  insertion: { name: 'Insertion Sort', time: 'O(n²)', space: 'O(1)', description: 'Builds the sorted array one element at a time by inserting each element in place.' },
  quick: { name: 'Quick Sort', time: 'O(n log n)', space: 'O(log n)', description: 'Divides array around a pivot, recursively sorts partitions.' },
  merge: { name: 'Merge Sort', time: 'O(n log n)', space: 'O(n)', description: 'Divides array in half, sorts each half, then merges them back together.' },
  heap: { name: 'Heap Sort', time: 'O(n log n)', space: 'O(1)', description: 'Builds a max-heap, then repeatedly extracts the maximum to build sorted array.' },
};
