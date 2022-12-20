import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { ISendTransferDTO } from "./ISendTransferDTO";

@injectable()
class SendTransferUseCase {
  
  constructor(
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ sender_id, receiver_id, type, amount, description }: ISendTransferDTO): Promise<Statement> {
    const user = await this.usersRepository.findById(receiver_id);

    if(!user) throw new CreateStatementError.UserNotFound();

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if(balance < amount) throw new CreateStatementError.InsufficientFunds();

    const statement = await this.statementsRepository.create({
      user_id: sender_id,
      receiver_id,
      type,
      amount,
      description
    });

    await this.statementsRepository.create({
      user_id: receiver_id,
      sender_id,
      type,
      amount,
      description
    });

    return statement;
    
  };

}

export { SendTransferUseCase };