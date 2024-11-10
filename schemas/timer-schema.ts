import * as z from "zod";

export const timerSchema = z.object({
  task: z
    .string({
      message: "Please enter a task name",
    })
    .min(1, {
      message: "Please enter a task name",
    }),
});
