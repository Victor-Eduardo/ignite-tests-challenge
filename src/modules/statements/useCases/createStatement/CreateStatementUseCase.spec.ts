import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";
import { CreateStatementError } from "./CreateStatementError";

let statementsRepository: IStatementsRepository;
let usersRepositoryInMemory: IUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create statement", () => {
  let user_id: string;

  beforeEach(async() => {
    statementsRepository = new  InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepository);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

    const user = await createUserUseCase.execute({
      name: "test",
      email: "test@finapi.com.br",
      password: "1234"
    });

    user_id = user.id as string;
  });

  it("Should be able to make a deposit", async() => {
    const statement: ICreateStatementDTO = {
      user_id,
      type: "deposit" as OperationType,
      amount: 10,
      description: "deposit test"
    };

    const result = await createStatementUseCase.execute(statement);

    expect(result).toHaveProperty("id");
    expect(result.type).toBe("deposit");
  });

  it("Should be able to make a withdraw", async() => {
    await createStatementUseCase.execute({
      user_id,
      type: "deposit" as OperationType,
      amount: 15,
      description: "deposit"
    });

    const statement: ICreateStatementDTO = {
      user_id,
      type: "withdraw" as OperationType,
      amount: 10,
      description: "withdraw test"
    };

    const result = await createStatementUseCase.execute(statement);

    expect(result).toHaveProperty("id");
    expect(result.type).toBe("withdraw");
  });

  it("Should NOT be able to make a new statement if user not exists", async() => {
    await expect(async() => {

      await createStatementUseCase.execute({
        user_id: "falseId",
        type: "deposit" as OperationType,
        amount: 10,
        description: "false id test"
      });

    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("Should NOT be able to make a withdraw if have insufficient funds", async() => {
    await expect(async() => {

      await createStatementUseCase.execute({
        user_id,
        type: "deposit" as OperationType,
        amount: 10,
        description: "deposit test"
      });

      const result = await createStatementUseCase.execute({
        user_id,
        type: "withdraw" as OperationType,
        amount: 15,
        description: "withdraw test"
      });

    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
