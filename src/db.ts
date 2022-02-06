import { Database, DataTypes, ensureDirSync, Model, SQLite3Connector } from "./deps.ts";

ensureDirSync("./database");

const connection = new SQLite3Connector({
  filepath: "./database/measurements.db",
});

export const db = new Database(connection);

export class Measurements extends Model {
  static table = "measurements";

  static fields = {
    id: { primaryKey: true, autoIncrement: true },
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    unit: DataTypes.STRING,
    lower: DataTypes.FLOAT,
    upper: DataTypes.FLOAT,
  };
}

db.link([Measurements]);

db.sync();
