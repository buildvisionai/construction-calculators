export interface Task {
  id: string;
  duration: number;
  dependencies: string[];
}

export interface TimelineResult {
  projectDuration: number;
  criticalPath: string[];
  earliestStart: Record<string, number>;
  earliestFinish: Record<string, number>;
  latestStart: Record<string, number>;
  latestFinish: Record<string, number>;
  totalFloat: Record<string, number>;
}

/**
 * Critical path method (CPM) scheduler.
 * Returns earliest/latest start & finish for each task and the critical path.
 */
export function calculateTimeline(tasks: Task[]): TimelineResult {
  const graph: Record<string, Task> = {};
  tasks.forEach(t => { graph[t.id] = t; });

  const earliestStart: Record<string, number> = {};
  const earliestFinish: Record<string, number> = {};
  const visited = new Set<string>();

  function forwardPass(taskId: string): number {
    if (visited.has(taskId)) return earliestFinish[taskId];
    visited.add(taskId);

    const task = graph[taskId];
    let maxDepFinish = 0;
    task.dependencies.forEach(depId => {
      maxDepFinish = Math.max(maxDepFinish, forwardPass(depId));
    });

    earliestStart[taskId] = maxDepFinish;
    earliestFinish[taskId] = maxDepFinish + task.duration;
    return earliestFinish[taskId];
  }

  let projectDuration = 0;
  tasks.forEach(t => {
    projectDuration = Math.max(projectDuration, forwardPass(t.id));
  });

  // Backward pass
  const latestFinish: Record<string, number> = {};
  const latestStart: Record<string, number> = {};
  tasks.forEach(t => { latestFinish[t.id] = projectDuration; });

  // Determine which tasks each task feeds into
  const successors: Record<string, string[]> = {};
  tasks.forEach(t => { successors[t.id] = []; });
  tasks.forEach(t => {
    t.dependencies.forEach(depId => {
      if (successors[depId]) successors[depId].push(t.id);
    });
  });

  // Process in reverse topological order (simple: repeat until stable)
  const taskIds = tasks.map(t => t.id).reverse();
  for (let i = 0; i < taskIds.length * 2; i++) {
    taskIds.forEach(id => {
      const succs = successors[id];
      if (succs.length > 0) {
        latestFinish[id] = Math.min(...succs.map(s => latestStart[s] ?? projectDuration));
      }
      latestStart[id] = latestFinish[id] - graph[id].duration;
    });
  }

  const totalFloat: Record<string, number> = {};
  const criticalPath: string[] = [];
  tasks.forEach(t => {
    totalFloat[t.id] = (latestStart[t.id] ?? 0) - earliestStart[t.id];
    if (totalFloat[t.id] === 0) criticalPath.push(t.id);
  });

  return { projectDuration, criticalPath, earliestStart, earliestFinish, latestStart, latestFinish, totalFloat };
}
