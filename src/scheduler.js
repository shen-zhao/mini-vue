let currentFlushPromise = Promise.resolve()

let isPending = false
let isFlushing = false
let queue = []
let flushIndex = 0

export function nextTick(fn) {
  const p = currentFlushPromise
  return fn ? p.then(this ? fn.bind(this) : fn) : p
}

export function invalidateJob(job) {
  const i = queue.indexOf(job)
  if (i > flushIndex) {
    queue.splice(i, 1)
  }
}

function findInsertIndex(job) {
  let start = flushIndex + 1;
  let end = queue.length;
  const jobId = getId(job);

  while (start < end) {
    const m = (start + end) >>> 1;
    const mJobId = getId(queue[m]);

    if (mJobId < jobId) {
      start = m + 1;
    } else if (mJobId > jobId) {
      end = m;
    } else {
      return m;
    }
  }

  return -1;
}

export function queueJob(job) {
  console.log(queue)
  if (!queue.length || (!queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex))) {
    const pos = findInsertIndex(job);
    if (pos > -1) {
      queue.splice(pos, 0, job);
    } else {
      queue.push(job)
    }
  }

  queueFlush()
}

function queueFlush() {
  if (!isPending && !isFlushing) {
    isPending = true;
    currentFlushPromise = currentFlushPromise.then(flushJob);
  }
}

function flushJob() {
  isPending = false;
  isFlushing = true;

  // 排序
  queue.sort((a, b) => getId(a) - getId(b))

  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      job();
    }
  } finally {
    isFlushing = false
    flushIndex = 0
    queue.length = 0
  }
}

const getId = (job) => {
  return job.id == null ? Infinity : job.id;
}
