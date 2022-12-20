enum OperationType {
  TRANSFER = 'transfer'
}

interface ISendTransferDTO {
  sender_id: string
  receiver_id: string
  type: OperationType
  amount: number
  description: string
}

export { ISendTransferDTO }