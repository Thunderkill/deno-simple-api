import { addMeasurement, deleteMeasurement, getMeasurement, getMeasurements } from "./handlers/measurements.ts";
import { Router } from "./deps.ts";

export const router = new Router();

router
  .get("/measurements", async ({ response }) => {
    const measurements = await getMeasurements();
    response.body = measurements;
    response.status = 200;
  })
  .get("/measurement/:code?", async ({ params, response }) => {
    const measurement = await getMeasurement(params.code);
    response.status = 200;
    response.body = measurement;
  })
  .post("/measurement", async ({ request, response }) => {
    const body = await request.body();
    if (body.type !== "json") {
      response.status = 400;
      response.body = "Invalid request body, specify a valid measurement";
      return;
    }
    const data = await body.value;
    await addMeasurement(data);
    response.status = 200;
  })
  .delete("/measurement/:code?", async ({ params, response }) => {
    await deleteMeasurement(params.code);
    response.status = 200;
  });
