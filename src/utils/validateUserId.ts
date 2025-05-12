import { validate as isUuid } from "uuid";

export const validateUserId = (id: string | undefined): boolean => {
  return !!id && isUuid(id);
};
