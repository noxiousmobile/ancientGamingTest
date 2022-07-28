export interface UserDTO {
  id: number;
  name: string;
  wallets: WalletsDTO[];
}

export interface WalletsDTO {
  id: number,
  amount: number,
  currency: string
}
