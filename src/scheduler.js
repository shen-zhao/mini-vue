const resolvedPromise = Promise.resolve();
let currentFlushPromise = null;

let isPending = false;
let isFlushing = false;
const queue = [];
let flushIndex = 0;

export function nextTick(fn) {
  const p = currentFlushPromise || resolvedPromise;
  return fn ? (this ? fn.bind(this) : fn) : p;
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

function queueJob(job) {
  if (!queue.length || (queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex))) {
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
    currentFlushPromise = resolvedPromise.then(flushJob);
  }
}

function flushJob() {
  isPending = false;
  isFlushing = true;

  // 排序
  queue.sort((a, b) => getId(a) - getId(b))

  for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
    const job = queue[flushIndex];
    job();
  }
}

const getId = (job) => {
  return job.id == null ? Infinity : job.id;
}
