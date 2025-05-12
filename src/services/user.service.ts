import { v4 as uuidv4, validate as isUuid } from "uuid";
import { User } from "../models/user.model";

class UserService {
  private users: User[] = [];

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | null {
    if (!isUuid(id)) return null;
    return this.users.find((user) => user.id === id) || null;
  }

  createUser(input: Omit<User, "id">): User {
    const user = new User(uuidv4(), input.username, input.age, input.hobbies);
    this.users.push(user);
    return user;
  }

  updateUser(id: string, input: Partial<User>): User | null {
    if (!isUuid(id)) return null;
    const user = this.getUserById(id);
    if (!user) return null;
    Object.assign(user, input);
    return user;
  }

  deleteUser(id: string): boolean {
    if (!isUuid(id)) return false;
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
}

export const userService = new UserService();
