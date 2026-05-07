import { ConnectionStatus } from "prisma/generated";

export interface UpdateConnectionStatusDto {
  status: ConnectionStatus;
}
