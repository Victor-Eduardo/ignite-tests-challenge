import { Request, Response } from "express";
import { container } from "tsyringe";
import { SendTransferUseCase } from "./SendTransferUseCase";

enum OperationType {
  TRANSFER = 'transfer'
}

class SendTransferController {
  async handle(request: Request, response: Response) {
    const { id: sender_id } = request.user;

    const { receiver_id } = request.params;

    const { amount, description } = request.body;
    
    const type = 'transfer' as OperationType;

    const sendTransferUseCase = container.resolve(SendTransferUseCase);

    const statement = await sendTransferUseCase.execute({ sender_id, receiver_id, type, amount, description });

    return response.status(201).json(statement);
  }
}

export { SendTransferController };