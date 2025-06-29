export interface ValidationError {
  rowIndex: number;
  columnKey: string;
  message: string;
}

export function validateWorkers(
  workers: Record<string, string>[],
  tasks: Record<string, string>[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  workers.forEach((worker, idx) => {
    // Required fields
    if (!worker.WorkerID) {
      errors.push({ rowIndex: idx, columnKey: "WorkerID", message: "WorkerID missing" });
    }
    if (!worker.Skills) {
      errors.push({ rowIndex: idx, columnKey: "Skills", message: "Skills missing" });
    }

    // Validate AvailableSlots: should be numbers or array-like string (e.g. "1,3,5")
    if (worker.AvailableSlots) {
      // Try to parse slots into array of numbers
      const slotsRaw = worker.AvailableSlots.trim();

      // Accept either comma-separated numbers or JSON array string
      let slots: number[] = [];
      try {
        if (slotsRaw.startsWith("[") && slotsRaw.endsWith("]")) {
          slots = JSON.parse(slotsRaw);
          if (!Array.isArray(slots)) throw new Error();
        } else {
          slots = slotsRaw.split(",").map((s) => Number(s.trim()));
        }

        // Validate all are numbers and positive
        slots.forEach((slot) => {
          if (isNaN(slot) || slot < 1) {
            errors.push({
              rowIndex: idx,
              columnKey: "AvailableSlots",
              message: `Invalid phase slot '${slot}' (should be positive number)`,
            });
          }
        });
      } catch {
        errors.push({
          rowIndex: idx,
          columnKey: "AvailableSlots",
          message: "Malformed AvailableSlots (should be comma-separated or JSON array of numbers)",
        });
      }
    } else {
      errors.push({ rowIndex: idx, columnKey: "AvailableSlots", message: "AvailableSlots missing" });
    }

    // MaxLoadPerPhase: should be positive integer
    if (worker.MaxLoadPerPhase) {
      const val = Number(worker.MaxLoadPerPhase);
      if (!Number.isInteger(val) || val < 1) {
        errors.push({
          rowIndex: idx,
          columnKey: "MaxLoadPerPhase",
          message: "MaxLoadPerPhase must be a positive integer",
        });
      }
    } else {
      errors.push({
        rowIndex: idx,
        columnKey: "MaxLoadPerPhase",
        message: "MaxLoadPerPhase missing",
      });
    }

    // Optional: QualificationLevel numeric check
    if (worker.QualificationLevel) {
      const val = Number(worker.QualificationLevel);
      if (isNaN(val)) {
        errors.push({
          rowIndex: idx,
          columnKey: "QualificationLevel",
          message: "QualificationLevel should be a number",
        });
      }
    }

    // Add any other validations you want here, e.g. WorkerGroup presence or format
  });

  return errors;
}
