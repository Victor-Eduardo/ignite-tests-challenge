import { Connection } from "typeorm";
import { createNewConnection } from "../../../../database";
import { v4 as uuid } from "uuid";
import { hash } from "bcryptjs";
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;

describe("Get balance", () => {
  
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

  it("Should be able to show the balance of user", async() => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "admin@finapi.com.br",
      password: "admin"
    });

    const { token } = responseToken.body;

    const response = await request(app).get("/api/v1/statements/balance").set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("statement");
    expect(response.body).toHaveProperty("balance");
  });
});