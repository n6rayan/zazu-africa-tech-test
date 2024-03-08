export interface ToDo {
  id: string;
  description: string;
  complete: boolean;
  createdAt: string;
  modifiedAt: string; 
}

export type CreateToDoPayload = ToDo;
export type UpdateToDoPayload = Omit<ToDo, 'id' | 'createdAt'>;