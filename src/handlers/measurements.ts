import { Context, Model } from "../deps.ts";
import { Measurement } from "../types/Measurement.ts";
import { Measurements } from "../db.ts";

export class MeasurementError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "MeasurementError";
    this.statusCode = statusCode;
  }
}

const toMeasurement = (row: Model) => ({
  code: row.code as string,
  name: row.name as string,
  unit: row.unit as string,
  referenceValues: {
    lower: row.lower as number,
    upper: row.upper as number,
  },
});

export const getMeasurements = async () => {
  const rows = await Measurements.all();
  const data: Measurement[] = rows.map(toMeasurement);
  return data;
};

export const getMeasurement = async (code: string | undefined) => {
  if (!code || code === "") {
    throw new MeasurementError("No measurement code specified");
  }
  const rows = await Measurements.where("code", code).all();

  if (rows.length === 0) {
    throw new MeasurementError("No measurement found with specified code", 404);
  }

  return toMeasurement(rows[0]);
};

export const addMeasurement = async (measurement: Measurement) => {
  if (!measurement) {
    throw new MeasurementError("No measurement specified");
  }

  const {
    code,
    name,
    unit,
    referenceValues: { upper, lower },
  } = measurement;

  if (!code || code === "") {
    throw new MeasurementError("Measurement code not specified");
  }
  if (code.length > 20) {
    throw new MeasurementError("Code is too long");
  }
  if (!name || name === "") {
    throw new MeasurementError("Measurement name not specified");
  }
  if (name.length > 50) {
    throw new MeasurementError("Name is too long");
  }
  if (!unit || unit === "") {
    throw new MeasurementError("Measurement unit not specified");
  }
  if (unit.length > 10) {
    throw new MeasurementError("Unit is too long");
  }
  if (!lower || !upper) {
    throw new MeasurementError("Measurement reference values are not specified");
  }
  if (isNaN(lower)) {
    throw new MeasurementError("Measurement's lower reference value is invalid");
  }
  if (isNaN(upper)) {
    throw new MeasurementError("Measurement's upper reference value is invalid");
  }
  if (upper.toString().length > 20) {
    throw new MeasurementError("Upper reference value is too long");
  }
  if (lower.toString().length > 20) {
    throw new MeasurementError("Lower reference value is too long");
  }

  if ((await Measurements.where("code", code).count()) !== 0) {
    throw new MeasurementError("Measurement with same code already exists");
  }

  await Measurements.create({ code, name, unit, upper, lower });
};

export const deleteMeasurement = async (code: string | undefined) => {
  if (!code || code === "") {
    throw new MeasurementError("No measurement code specified");
  }

  const deletedRows = await Measurements.where("code", code).delete();
  if ((deletedRows as Model).affectedRows === 0) throw new MeasurementError("No rows affected");
};
