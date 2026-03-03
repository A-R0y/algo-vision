// Python code snippets for each algorithm, with line-to-step mapping

export interface PythonSnippet {
  code: string;
  lines: string[]; // each line of code
}

export const pythonCode: Record<string, PythonSnippet> = {
  // Sorting
  bubble: {
    code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
    lines: [],
  },
  selection: {
    code: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
    lines: [],
  },
  insertion: {
    code: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
    lines: [],
  },
  quick: {
    code: `def quick_sort(arr, low, high):
    if low < high:
        pivot = arr[high]
        i = low - 1
        for j in range(low, high):
            if arr[j] < pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
        arr[i+1], arr[high] = arr[high], arr[i+1]
        pi = i + 1
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)`,
    lines: [],
  },
  merge: {
    code: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
    lines: [],
  },
  heap: {
    code: `def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)

def heapify(arr, n, i):
    largest = i
    l, r = 2*i + 1, 2*i + 2
    if l < n and arr[l] > arr[largest]:
        largest = l
    if r < n and arr[r] > arr[largest]:
        largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`,
    lines: [],
  },

  // Searching
  linear: {
    code: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,
    lines: [],
  },
  binary: {
    code: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
    lines: [],
  },

  // Stack & Queue
  stack: {
    code: `class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        if not self.is_empty():
            return self.items.pop()

    def peek(self):
        if not self.is_empty():
            return self.items[-1]

    def is_empty(self):
        return len(self.items) == 0`,
    lines: [],
  },
  queue: {
    code: `from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()

    def enqueue(self, item):
        self.items.append(item)

    def dequeue(self):
        if not self.is_empty():
            return self.items.popleft()

    def front(self):
        if not self.is_empty():
            return self.items[0]

    def is_empty(self):
        return len(self.items) == 0`,
    lines: [],
  },

  // BST
  bst_insert: {
    code: `class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(root, val):
    if root is None:
        return Node(val)
    if val < root.val:
        root.left = insert(root.left, val)
    elif val > root.val:
        root.right = insert(root.right, val)
    return root`,
    lines: [],
  },
  bst_search: {
    code: `def search(root, target):
    if root is None:
        return False
    if target == root.val:
        return True
    elif target < root.val:
        return search(root.left, target)
    else:
        return search(root.right, target)`,
    lines: [],
  },
  inorder: {
    code: `def inorder(root):
    if root is None:
        return []
    return (inorder(root.left) +
            [root.val] +
            inorder(root.right))`,
    lines: [],
  },
  preorder: {
    code: `def preorder(root):
    if root is None:
        return []
    return ([root.val] +
            preorder(root.left) +
            preorder(root.right))`,
    lines: [],
  },
  postorder: {
    code: `def postorder(root):
    if root is None:
        return []
    return (postorder(root.left) +
            postorder(root.right) +
            [root.val])`,
    lines: [],
  },

  // Heap
  min_heap: {
    code: `import heapq

class MinHeap:
    def __init__(self):
        self.heap = []

    def insert(self, val):
        heapq.heappush(self.heap, val)

    def extract_min(self):
        if self.heap:
            return heapq.heappop(self.heap)

    def peek(self):
        if self.heap:
            return self.heap[0]`,
    lines: [],
  },
  max_heap: {
    code: `import heapq

class MaxHeap:
    def __init__(self):
        self.heap = []

    def insert(self, val):
        heapq.heappush(self.heap, -val)

    def extract_max(self):
        if self.heap:
            return -heapq.heappop(self.heap)

    def peek(self):
        if self.heap:
            return -self.heap[0]`,
    lines: [],
  },

  // Hash Table
  hash_table: {
    code: `class HashTable:
    def __init__(self, size=8):
        self.size = size
        self.table = [[] for _ in range(size)]

    def _hash(self, key):
        return sum(ord(c) for c in key) % self.size

    def insert(self, key, value):
        idx = self._hash(key)
        for i, (k, v) in enumerate(self.table[idx]):
            if k == key:
                self.table[idx][i] = (key, value)
                return
        self.table[idx].append((key, value))

    def search(self, key):
        idx = self._hash(key)
        for k, v in self.table[idx]:
            if k == key:
                return v
        return None

    def delete(self, key):
        idx = self._hash(key)
        self.table[idx] = [(k,v) for k,v
            in self.table[idx] if k != key]`,
    lines: [],
  },

  // Linked List
  linked_list: {
    code: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def insert_head(self, val):
        node = Node(val)
        node.next = self.head
        self.head = node

    def insert_tail(self, val):
        node = Node(val)
        if not self.head:
            self.head = node
            return
        cur = self.head
        while cur.next:
            cur = cur.next
        cur.next = node

    def delete_head(self):
        if self.head:
            self.head = self.head.next

    def traverse(self):
        cur = self.head
        while cur:
            print(cur.val, end=" -> ")
            cur = cur.next
        print("None")`,
    lines: [],
  },

  // Graph algorithms
  bfs: {
    code: `from collections import deque

def bfs(graph, source, target):
    visited = set([source])
    queue = deque([source])
    parent = {source: None}
    while queue:
        node = queue.popleft()
        if node == target:
            return build_path(parent, target)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                parent[neighbor] = node
                queue.append(neighbor)
    return None`,
    lines: [],
  },
  dfs: {
    code: `def dfs(graph, source, target):
    visited = set()
    stack = [source]
    parent = {source: None}
    while stack:
        node = stack.pop()
        if node in visited:
            continue
        visited.add(node)
        if node == target:
            return build_path(parent, target)
        for neighbor in graph[node]:
            if neighbor not in visited:
                parent[neighbor] = node
                stack.append(neighbor)
    return None`,
    lines: [],
  },
  dijkstra: {
    code: `import heapq

def dijkstra(graph, source, target):
    dist = {v: float('inf') for v in graph}
    dist[source] = 0
    pq = [(0, source)]
    parent = {source: None}
    while pq:
        d, u = heapq.heappop(pq)
        if u == target:
            return build_path(parent, target)
        if d > dist[u]:
            continue
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                parent[v] = u
                heapq.heappush(pq, (dist[v], v))`,
    lines: [],
  },
  "bellman-ford": {
    code: `def bellman_ford(graph, V, source):
    dist = {v: float('inf') for v in range(V)}
    dist[source] = 0
    for _ in range(V - 1):
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    # Check negative cycles
    for u, v, w in edges:
        if dist[u] + w < dist[v]:
            raise ValueError("Negative cycle")
    return dist`,
    lines: [],
  },
  "floyd-warshall": {
    code: `def floyd_warshall(graph, V):
    dist = [[float('inf')] * V for _ in range(V)]
    for i in range(V):
        dist[i][i] = 0
    for u, v, w in edges:
        dist[u][v] = w
    for k in range(V):
        for i in range(V):
            for j in range(V):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    return dist`,
    lines: [],
  },
  "a-star": {
    code: `import heapq

def a_star(graph, source, target, h):
    g = {source: 0}
    f = {source: h(source)}
    pq = [(f[source], source)]
    parent = {source: None}
    while pq:
        _, u = heapq.heappop(pq)
        if u == target:
            return build_path(parent, target)
        for v, w in graph[u]:
            tent_g = g[u] + w
            if tent_g < g.get(v, float('inf')):
                g[v] = tent_g
                f[v] = tent_g + h(v)
                parent[v] = u
                heapq.heappush(pq, (f[v], v))`,
    lines: [],
  },
  "best-first": {
    code: `import heapq

def best_first(graph, source, target, h):
    visited = set()
    pq = [(h(source), source)]
    parent = {source: None}
    while pq:
        _, u = heapq.heappop(pq)
        if u in visited:
            continue
        visited.add(u)
        if u == target:
            return build_path(parent, target)
        for v in graph[u]:
            if v not in visited:
                parent[v] = u
                heapq.heappush(pq, (h(v), v))`,
    lines: [],
  },
  "bidirectional-bfs": {
    code: `from collections import deque

def bi_bfs(graph, source, target):
    if source == target:
        return [source]
    vis_s, vis_t = {source}, {target}
    q_s, q_t = deque([source]), deque([target])
    par_s = {source: None}
    par_t = {target: None}
    while q_s and q_t:
        # Expand from source
        node = q_s.popleft()
        for nb in graph[node]:
            if nb not in vis_s:
                vis_s.add(nb)
                par_s[nb] = node
                q_s.append(nb)
                if nb in vis_t:
                    return join(par_s, par_t, nb)
        # Expand from target
        node = q_t.popleft()
        for nb in graph[node]:
            if nb not in vis_t:
                vis_t.add(nb)
                par_t[nb] = node
                q_t.append(nb)
                if nb in vis_s:
                    return join(par_s, par_t, nb)`,
    lines: [],
  },
  prims: {
    code: `import heapq

def prims(graph, start=0):
    visited = set([start])
    edges = [(w, start, v)
             for v, w in graph[start]]
    heapq.heapify(edges)
    mst = []
    while edges:
        w, u, v = heapq.heappop(edges)
        if v in visited:
            continue
        visited.add(v)
        mst.append((u, v, w))
        for next_v, next_w in graph[v]:
            if next_v not in visited:
                heapq.heappush(edges,
                    (next_w, v, next_v))
    return mst`,
    lines: [],
  },
  kruskals: {
    code: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py: return False
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        return True

def kruskals(edges, V):
    edges.sort(key=lambda e: e[2])
    uf = UnionFind(V)
    mst = []
    for u, v, w in edges:
        if uf.union(u, v):
            mst.append((u, v, w))
    return mst`,
    lines: [],
  },
};

// Map step descriptions to highlighted line numbers for each algorithm
export function getHighlightedLines(algorithm: string, description: string): number[] {
  if (!description) return [];
  const d = description.toLowerCase();

  switch (algorithm) {
    case "bubble":
      if (d.includes("starting")) return [0, 1];
      if (d.includes("comparing")) return [3, 4];
      if (d.includes("swapped")) return [5];
      if (d.includes("complete")) return [6];
      return [];
    case "selection":
      if (d.includes("starting")) return [0, 1];
      if (d.includes("finding minimum")) return [3, 4, 5];
      if (d.includes("swapped")) return [7];
      if (d.includes("complete")) return [8];
      return [];
    case "insertion":
      if (d.includes("starting")) return [0, 1];
      if (d.includes("comparing")) return [3, 4];
      if (d.includes("inserted")) return [5, 6];
      if (d.includes("complete")) return [7];
      return [];
    case "quick":
      if (d.includes("starting")) return [0, 1];
      if (d.includes("pivot chosen")) return [2];
      if (d.includes("comparing")) return [4, 5];
      if (d.includes("swapped")) return [6];
      if (d.includes("pivot") && d.includes("placed")) return [7, 8];
      if (d.includes("complete")) return [9, 10];
      return [];
    case "merge":
      if (d.includes("starting")) return [0, 1];
      if (d.includes("merging")) return [10, 11, 12, 13];
      if (d.includes("placing")) return [14, 15];
      if (d.includes("complete")) return [17, 18];
      return [];
    case "heap":
      if (d.includes("starting") || d.includes("building")) return [0, 1, 2];
      if (d.includes("heapify")) return [8, 9, 10, 11, 12, 13];
      if (d.includes("swapped") || d.includes("moved max")) return [4, 5];
      if (d.includes("max-heap built")) return [3];
      if (d.includes("complete")) return [6];
      return [];
    case "linear":
      if (d.includes("searching for")) return [0];
      if (d.includes("checking")) return [1, 2];
      if (d.includes("found")) return [2, 3];
      if (d.includes("not found")) return [4];
      return [];
    case "binary":
      if (d.includes("array sorted")) return [0, 1];
      if (d.includes("mid =")) return [2, 3];
      if (d.includes("found")) return [4, 5];
      if (d.includes("search right")) return [6, 7];
      if (d.includes("search left")) return [8, 9];
      if (d.includes("not found")) return [10];
      return [];
    case "bfs":
      if (d.includes("start")) return [2, 3, 4];
      if (d.includes("visit")) return [6, 7];
      if (d.includes("found")) return [8];
      if (d.includes("enqueue")) return [11, 12, 13];
      return [];
    case "dfs":
      if (d.includes("start")) return [1, 2, 3];
      if (d.includes("visit")) return [6, 7];
      if (d.includes("found")) return [8];
      return [];
    case "dijkstra":
      if (d.includes("start")) return [2, 3, 4];
      if (d.includes("visit")) return [7];
      if (d.includes("found") || d.includes("shortest")) return [8];
      if (d.includes("relax")) return [11, 12, 13, 14];
      return [];
    case "bellman-ford":
      if (d.includes("start")) return [1, 2];
      if (d.includes("relax") || d.includes("iteration")) return [4, 5];
      if (d.includes("negative")) return [7, 8];
      return [];
    case "floyd-warshall":
      if (d.includes("init")) return [1, 2, 3, 4, 5];
      if (d.includes("k=") || d.includes("considering")) return [6, 7, 8, 9];
      return [];
    case "a-star":
      if (d.includes("start")) return [2, 3, 4];
      if (d.includes("visit")) return [7];
      if (d.includes("found") || d.includes("optimal")) return [8];
      if (d.includes("update")) return [10, 11, 12, 13, 14];
      return [];
    case "best-first":
      if (d.includes("start")) return [2, 3];
      if (d.includes("visit")) return [7, 8];
      if (d.includes("found")) return [9];
      if (d.includes("add")) return [11, 12];
      return [];
    case "bidirectional-bfs":
      if (d.includes("start")) return [3, 4, 5, 6];
      if (d.includes("forward")) return [9, 10, 11, 12, 13];
      if (d.includes("backward")) return [16, 17, 18, 19, 20];
      if (d.includes("met")) return [14, 21];
      return [];
    case "prims":
      if (d.includes("start")) return [2, 3, 4];
      if (d.includes("add") || d.includes("visit")) return [8, 9];
      if (d.includes("edge")) return [10, 11, 12];
      return [];
    case "kruskals":
      if (d.includes("sort")) return [16];
      if (d.includes("union") || d.includes("add")) return [19, 20];
      if (d.includes("skip") || d.includes("cycle")) return [19];
      return [];
    default:
      return [];
  }
}
