import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: IUsersRepository;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to authenticate an user", async() => {
    const user: ICreateUserDTO = {
      name: "user",
      email: "user@finapi.com.br",
      password: "1234",
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({ 
      email: user.email, password: user.password 
    });

    expect(result).toHaveProperty("token");
  });

  it("Should NOT be able to authenticate a non-existent user", () => {
    expect(async() => {
      await authenticateUserUseCase.execute({
        email: "false@email.com",
        password: "1234"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should NOT be able to authenticate with incorrect password", async() => {
    await expect(async() => {
      const user: ICreateUserDTO = {
        name: "user",
        email: "user@finapi.com.br",
        password: "1234",
      };
  
      await createUserUseCase.execute(user);
  
      await authenticateUserUseCase.execute({ 
        email: user.email, password: "incorrectPassword" 
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});