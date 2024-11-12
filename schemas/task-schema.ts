import * as z from "zod";

export const taskSchema = z.object({
  task: z.string().min(1, {
    message: "Task cannot be empty",
  }),
});
