import { Connection } from "typeorm";
import { createNewConnection } from "../../../../database";
import request from "supertest";
import { v4 as uuid } from "uuid";
import { app } from "../../../../app";
import { hash } from "bcryptjs";

let connection: Connection;

describe("Authenticate User", () => {
  beforeAll(async() => {
    connection = await createNewConnection();
    await connection.runMigrations();

    const id = uuid();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password)
      values('${id}', 'admin', 'admin@finapi.com.br', '${password}')`
    );
  });

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to authenticate user", async() => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "admin@finapi.com.br",
      password: "admin"
    });

    expect(responseToken.status).toBe(200);
    expect(responseToken.body).toHaveProperty("user");
    expect(responseToken.body).toHaveProperty("token");

  });

  it("Should NOT be able to authenticate a non-existent user ", async() => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "false@email.com",
      password: "admin"
    });

    expect(responseToken.status).toBe(401);
  });

  it("Should NOT be able to authenticate a user with incorrect password ", async() => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "admin@finapi.com.br",
      password: "incorrectPass"
    });

    expect(responseToken.status).toBe(401);
  });
});