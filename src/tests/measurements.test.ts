import { app } from "../app.ts";
import { Measurements } from "../db.ts";
import { superoak } from "../dev_deps.ts";

const clearDb = () => {
  Measurements.truncate();
};

const SAMPLE_POST_DATA = '{"code": "test","name": "test measurement","unit": "g/l","referenceValues": {"lower": 200,"upper": 300}}';

// Send simple GET request
Deno.test("we should be able to get measurements", async () => {
  clearDb();
  const request = await superoak(app);
  await request.get("/measurements").expect(200);
});

Deno.test("we should not be able to get a single measurement", async () => {
  clearDb();
  const request = await superoak(app);
  await request.get("/measurement/test").expect(404);
});

Deno.test("it should allow post requests", async () => {
  clearDb();
  const request = await superoak(app);
  await request.post("/measurement").set("Content-Type", "application/json").send(SAMPLE_POST_DATA).expect(200);
});

Deno.test("it should not allow invalid post requests", async (t) => {
  clearDb();
  await t.step("test posting without code", async () => {
    const request = await superoak(app);
    await request
      .post("/measurement")
      .set("Content-Type", "application/json")
      .send('{"code": "","name": "test measurement","unit": "g/l","referenceValues": {"lower": 200,"upper": 300}}')
      .expect(400);
  });
  await t.step("test posting without name", async () => {
    const request = await superoak(app);
    await request
      .post("/measurement")
      .set("Content-Type", "application/json")
      .send('{"code": "test","name": "","unit": "g/l","referenceValues": {"lower": 200,"upper": 300}}')
      .expect(400);
  });
  await t.step("test posting without unit", async () => {
    const request = await superoak(app);
    await request
      .post("/measurement")
      .set("Content-Type", "application/json")
      .send('{"code": "test","name": "test measurement","unit": "","referenceValues": {"lower": 200,"upper": 300}}')
      .expect(400);
  });
  await t.step("test posting without reference values", async () => {
    const request = await superoak(app);
    await request
      .post("/measurement")
      .set("Content-Type", "application/json")
      .send('{"code": "test","name": "test measurement","unit": "g/l"')
      .expect(400);
  });
});

Deno.test("it should not allow two post requests with same code", async (t) => {
  clearDb();
  await t.step("create first measurement", async () => {
    const request = await superoak(app);
    await request.post("/measurement").set("Content-Type", "application/json").send(SAMPLE_POST_DATA).expect(200);
  });
  await t.step("create second measurement that should fail", async () => {
    const request = await superoak(app);
    await request.post("/measurement").set("Content-Type", "application/json").send(SAMPLE_POST_DATA).expect(400);
  });
});

Deno.test("it should be able to delete measurement", async () => {
  clearDb();
  let request = await superoak(app);
  await request.get("/measurement/test").expect(404);

  request = await superoak(app);
  await request.post("/measurement").set("Content-Type", "application/json").send(SAMPLE_POST_DATA).expect(200);

  request = await superoak(app);
  await request.get("/measurement/test").expect(200);

  request = await superoak(app);
  await request.delete("/measurement/test").expect(200);

  request = await superoak(app);
  await request.get("/measurement/test").expect(404);
});
