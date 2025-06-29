import { Rule } from "../components/RuleInput";

interface ScheduleInput {
  clients: Record<string, string>[];
  workers: Record<string, string>[];
  tasks: Record<string, string>[];
  rules: Rule[];
  priorities: Record<string, number>;
}

export interface Assignment {
  phase: number;
  taskId: string;
  clientId: string;
  workerId: string;
}


export function generateSchedule({ clients, workers, tasks, rules, priorities }: ScheduleInput): Assignment[] {
  const assignments: Assignment[] = [];

  // Phase-wise assignment tracker
  const phaseLoad: Record<number, Record<string, number>> = {}; // phase -> workerId -> load
  const taskConcurrent: Record<string, number> = {}; // taskId -> current count

  // Convert worker availability into easier lookup
  const workerAvailability: Record<string, number[]> = {};
  workers.forEach((worker) => {
    const slots = worker.AvailableSlots?.split(",").map((s) => Number(s.trim())) || [];
    workerAvailability[worker.WorkerID] = slots;
  });

  // Sort clients by priority
  const sortedClients = [...clients].sort((a, b) => {
    return Number(b.PriorityLevel || 0) - Number(a.PriorityLevel || 0);
  });

  for (const client of sortedClients) {
    const requestedTasks = client.RequestedTaskIDs?.split(",").map((id) => id.trim()) || [];

    for (const taskId of requestedTasks) {
      const task = tasks.find((t) => t.TaskID === taskId);
      if (!task) continue;

      const requiredSkills = task.RequiredSkills?.split(",").map((s) => s.trim());
      const duration = Number(task.Duration);
      const maxConcurrent = Number(task.MaxConcurrent);
      const preferredPhases = parsePreferredPhases(task.PreferredPhases);

      let assigned = false;

      for (const worker of workers) {
        const skills = worker.Skills?.split(",").map((s) => s.trim());
        if (!requiredSkills?.every((s) => skills?.includes(s))) continue;

        const workerSlots = workerAvailability[worker.WorkerID];

        for (const phase of workerSlots) {
          if (preferredPhases.length && !preferredPhases.includes(phase)) continue;

          const currentLoad = phaseLoad[phase]?.[worker.WorkerID] || 0;
          const maxLoad = Number(worker.MaxLoadPerPhase);
          if (currentLoad + duration > maxLoad) continue;

          const concurrentCount = taskConcurrent[taskId + "-" + phase] || 0;
          if (concurrentCount >= maxConcurrent) continue;

          // Assign
          assignments.push({
            phase,
            taskId,
            clientId: client.ClientID,
            workerId: worker.WorkerID,
          });

          phaseLoad[phase] = phaseLoad[phase] || {};
          phaseLoad[phase][worker.WorkerID] = currentLoad + duration;

          taskConcurrent[taskId + "-" + phase] = concurrentCount + 1;

          assigned = true;
          break;
        }

        if (assigned) break;
      }
    }
  }

  return assignments;
}

function parsePreferredPhases(raw: string): number[] {
  if (!raw) return [];
  if (raw.startsWith("[") && raw.endsWith("]")) {
    try {
      const json = JSON.parse(raw);
      if (Array.isArray(json)) return json.map(Number);
    } catch {
      return [];
    }
  }
  if (raw.includes("-")) {
    const [start, end] = raw.split("-").map(Number);
    const range = [];
    for (let i = start; i <= end; i++) range.push(i);
    return range;
  }
  return raw.split(",").map(Number);
}