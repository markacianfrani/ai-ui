export type ToolTone = "read" | "write" | "edit" | "bash" | "generic";

export function getToolTone(name: string): ToolTone {
  const normalized = name.toLowerCase();
  if (normalized.includes("read")) {
    return "read";
  }
  if (normalized.includes("write")) {
    return "write";
  }
  if (normalized.includes("edit")) {
    return "edit";
  }
  if (normalized.includes("bash")) {
    return "bash";
  }
  return "generic";
}
