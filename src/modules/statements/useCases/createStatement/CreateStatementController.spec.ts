import createConnection from "../../../../database";
import { Connection } from "typeorm";
import { v4 as uuid } from "uuid";
import { hash } from "bcryptjs";
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;

describe("Create Statement", () => {
  
  beforeAll(async() => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password)
      values('${id}', 'admin', 'admin@finapi.com.br', '${password}')`
    );
  });

  afterAll(async() => {
    await connection.dropDatabase();;
    await connection.close();
  });

  it("Should be able to create a new statement operation", async() => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "admin@finapi.com.br",
      password: "admin"
    });

    const { token } = responseToken.body;

    const response = await request(app).post("/api/v1/statements/deposit").send({
      amount: 10,
      description: "Statement Test"
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("user_id");
  });

  it("Should NOT be able to make a withdraw if have insufficient funds", async() => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "admin@finapi.com.br",
      password: "admin"
    });

    const { token } = responseToken.body;

    const response = await request(app).post("/api/v1/statements/withdraw").send({
      amount: 15,
      description: "Withdraw test with insufficient funds"
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(400);
  });

});