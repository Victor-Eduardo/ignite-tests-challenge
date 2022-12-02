import createConnection from "../../../../database";
import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";

let connection: Connection;

describe("Create User", () => {
  beforeAll(async() => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new user", async() => {
    const response = await request(app).post("/api/v1/users").send({
      name: "test",
      email: "test@finapi.com.br",
      password: "1234"
    });

    expect(response.status).toBe(201);
  });

  it("Should NOT be able to create a new user if email already exists", async() => {
    await request(app).post("/api/v1/users").send({
      name: "test",
      email: "test@finapi.com.br",
      password: "1234"
    });

    const response = await request(app).post("/api/v1/users").send({
      name: "other test",
      email: "test@finapi.com.br",
      password: "4321"
    });

    expect(response.status).toBe(400);
  });

});