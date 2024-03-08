import { ToDo } from "../types";

export const createItem = (data: ToDo) => {
  console.log(data);
}

export const updateItem = (id: string | undefined, data: ToDo) => {
  console.log(data);
}

export const deleteItem = (id: string | undefined) => {
  console.log(id);
}

export const getItem = (id: string | undefined) => {
  console.log(id);
}