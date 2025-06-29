export interface ValidationError {
  rowIndex: number;
  columnKey: string;
  message: string;
}

export function validateClients(
  clients: Record<string, string>[],
  tasks: Record<string, string>[]
): ValidationError[] {
  const errors: ValidationError[] = [];
  const validTaskIDs = new Set(tasks.map((t) => t.TaskID));

  clients.forEach((client, idx) => {
    // Required columns
    if (!client.ClientID) {
      errors.push({ rowIndex: idx, columnKey: "ClientID", message: "ClientID missing" });
    }
    if (!client.PriorityLevel) {
      errors.push({ rowIndex: idx, columnKey: "PriorityLevel", message: "PriorityLevel missing" });
    } else {
      const val = Number(client.PriorityLevel);
      if (isNaN(val) || val < 1 || val > 5) {
        errors.push({
          rowIndex: idx,
          columnKey: "PriorityLevel",
          message: "PriorityLevel must be an integer between 1 and 5",
        });
      }
    }

    if (client.RequestedTaskIDs) {
      const requested = client.RequestedTaskIDs.split(",").map((s) => s.trim());
      requested.forEach((taskID) => {
        if (!validTaskIDs.has(taskID)) {
          errors.push({
            rowIndex: idx,
            columnKey: "RequestedTaskIDs",
            message: `Unknown TaskID '${taskID}' requested`,
          });
        }
      });
    }
  });

  return errors;
}
