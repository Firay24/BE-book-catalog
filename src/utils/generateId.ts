import { v4 as uuidv4 } from 'uuid';
export const generateId = (): string => {
  return uuidv4().toUpperCase().replace(/-/g, '').slice(0, 20);
};
