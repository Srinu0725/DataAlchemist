export interface ValidationError {
  rowIndex: number;
  columnKey: string;
  message: string;
}

// Helper to expand phase range strings like "1-3" or "[1,3,5]" to number arrays
function parsePreferredPhases(raw: string): number[] | null {
  try {
    if (!raw) return [];
    const trimmed = raw.trim();

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      // JSON array string
      const arr = JSON.parse(trimmed);
      if (!Array.isArray(arr)) return null;
      return arr.map(Number);
    } else if (trimmed.includes("-")) {
      // range string like "1-3"
      const [startStr, endStr] = trimmed.split("-");
      const start = Number(startStr);
      const end = Number(endStr);
      if (isNaN(start) || isNaN(end) || start > end) return null;
      const range = [];
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      return range;
    } else {
      // Comma separated numbers like "1,3,5"
      return trimmed.split(",").map(Number);
    }
  } catch {
    return null;
  }
}

export function validateTasks(
  tasks: Record<string, string>[],
  workers: Record<string, string>[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Collect all worker skills to validate RequiredSkills
  const allWorkerSkills = new Set<string>();
  workers.forEach((w) => {
    if (w.Skills) {
      w.Skills.split(",").forEach((skill) => allWorkerSkills.add(skill.trim()));
    }
  });

  tasks.forEach((task, idx) => {
    // Required columns
    if (!task.TaskID) {
      errors.push({ rowIndex: idx, columnKey: "TaskID", message: "TaskID missing" });
    }
    if (!task.Duration) {
      errors.push({ rowIndex: idx, columnKey: "Duration", message: "Duration missing" });
    } else {
      const val = Number(task.Duration);
      if (isNaN(val) || val < 1) {
        errors.push({
          rowIndex: idx,
          columnKey: "Duration",
          message: "Duration must be a number ≥ 1",
        });
      }
    }

    // MaxConcurrent check
    if (task.MaxConcurrent) {
      const val = Number(task.MaxConcurrent);
      if (!Number.isInteger(val) || val < 1) {
        errors.push({
          rowIndex: idx,
          columnKey: "MaxConcurrent",
          message: "MaxConcurrent must be a positive integer",
        });
      }
    } else {
      errors.push({
        rowIndex: idx,
        columnKey: "MaxConcurrent",
        message: "MaxConcurrent missing",
      });
    }

    // RequiredSkills must be subset of worker skills
    if (task.RequiredSkills) {
      const skills = task.RequiredSkills.split(",").map((s) => s.trim());
      skills.forEach((skill) => {
        if (!allWorkerSkills.has(skill)) {
          errors.push({
            rowIndex: idx,
            columnKey: "RequiredSkills",
            message: `Skill '${skill}' not found in any worker`,
          });
        }
      });
    } else {
      errors.push({
        rowIndex: idx,
        columnKey: "RequiredSkills",
        message: "RequiredSkills missing",
      });
    }

    // PreferredPhases should parse correctly
    if (task.PreferredPhases) {
      const phases = parsePreferredPhases(task.PreferredPhases);
      if (!phases || phases.some((p) => isNaN(p) || p < 1)) {
        errors.push({
          rowIndex: idx,
          columnKey: "PreferredPhases",
          message: "PreferredPhases malformed or invalid",
        });
      }
    }
  });

  return errors;
}
