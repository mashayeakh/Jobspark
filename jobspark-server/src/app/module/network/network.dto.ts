import { ConnectionStatus } from "prisma/generated/client";

export interface UpdateConnectionStatusDto {
  status: ConnectionStatus;
}
