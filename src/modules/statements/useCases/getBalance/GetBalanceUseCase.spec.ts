import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let statementsRepositoryInMemory: IStatementsRepository;
let usersRepositoryInMemory: IUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Get balance", () => {
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to show user balance", async() => {
    const user = await createUserUseCase.execute({
      name: "user",
      email: "user@finapi.com.br",
      password: "1234",
    });

    const user_id = user.id as string;

    const result = await getBalanceUseCase.execute({user_id: user_id});

    expect(result).toHaveProperty("statement");
    expect(result).toHaveProperty("balance");

  });

  it("Should NOT be able to show user balance if user not exists", async() => {
    await expect(async() => {
      await getBalanceUseCase.execute({user_id: "falseId"});
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});