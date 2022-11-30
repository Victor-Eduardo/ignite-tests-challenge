import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let statementsRepositoryInMemory: IStatementsRepository;
let usersRepositoryInMemory: IUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement Operation", () => {
  let user_id: string;
  let statement_id: string;

  beforeEach(async() => {
    statementsRepositoryInMemory = new  InMemoryStatementsRepository();
    
    usersRepositoryInMemory = new InMemoryUsersRepository();
    
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);

    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);

    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

    const user = await createUserUseCase.execute({
      name: "test",
      email: "test@finapi.com.br",
      password: "1234"
    });

    user_id = user.id as string;

    const statement = await createStatementUseCase.execute({
      user_id,
      type: "deposit" as OperationType,
      amount: 10,
      description: "Deposit get test"
    });

    statement_id = statement.id as string;
  });

  it("Should be able to show the statement operation", async() => {    
    const result = await getStatementOperationUseCase.execute({
      user_id, statement_id
    });

    expect(result).toHaveProperty("id");
    expect(result.id).toBe(statement_id);
  });

  it("Should NOT be able to show the statement operation if user not exists", async() => {
    await expect(async() => {

      user_id = "falseId";

      await getStatementOperationUseCase.execute({
        user_id, statement_id
      });

    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Should NOT be able to show statement if operation doesn't exists", async() => {
    await expect(async() => {

      statement_id = "falseId";

      await getStatementOperationUseCase.execute({
        user_id, statement_id
      });

    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});