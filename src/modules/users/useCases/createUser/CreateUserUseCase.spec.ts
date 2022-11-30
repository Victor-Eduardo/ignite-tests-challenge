import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: IUsersRepository; 

describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to create a new user", async() => {
    const user = await createUserUseCase.execute({
      name: "test name",
      email: "test@finapi.com.br",
      password: "1234"
    });

    expect(user).toHaveProperty("id");
  });

  it("Should NOT be able to a create a new user if an user with same email already exists", async() => {
    await expect(async () => {
      await createUserUseCase.execute({
        name: "test name",
        email: "test@finapi.com.br",
        password: "1234"
      });

      await createUserUseCase.execute({
        name: "test name",
        email: "test@finapi.com.br",
        password: "1234"
      });
      
    }).rejects.toBeInstanceOf(CreateUserError);
  });

});