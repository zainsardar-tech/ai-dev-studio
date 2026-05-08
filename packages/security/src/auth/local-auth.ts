export interface User {
  id: string;
  name: string;
  role: 'admin' | 'developer' | 'viewer';
  inviteCode?: string;
}

export class LocalAuth {
  private users: Map<string, User> = new Map();

  createUser(name: string, role: User['role'], inviteCode?: string): User {
    const user: User = {
      id: crypto.randomUUID(),
      name,
      role,
      inviteCode,
    };
    this.users.set(user.id, user);
    return user;
  }

  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  listUsers(): User[] {
    return Array.from(this.users.values());
  }

  removeUser(id: string): void {
    this.users.delete(id);
  }
}
