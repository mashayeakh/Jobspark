import { ConnectionStatus } from "prisma/generated/prisma/enums";

export interface UpdateConnectionStatusDto {
  status: ConnectionStatus;
}
