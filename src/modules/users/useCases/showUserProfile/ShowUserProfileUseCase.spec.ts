import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: IUsersRepository;

describe("Show User Profile", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to show user profile", async() => {
    const user = await createUserUseCase.execute({
      name: "user",
      email: "user@finapi.com.br",
      password: "1234",
    });

    const user_id = user.id as string;

    const result = await showUserProfileUseCase.execute(user_id);

    expect(result).toBeInstanceOf(User);
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("email");
  });

  it("Should NOT be able to show profile if user not exists", async() => {
    await expect(async() => {
     await showUserProfileUseCase.execute("falseId");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});