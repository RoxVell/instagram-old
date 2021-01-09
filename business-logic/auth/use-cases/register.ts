import UsersDatabase from "~/business-logic/data-access/usersDb";
import makeUser from "~/business-logic/user/entity";
import User from "~/types/User";

export function buildRegisterUser(usersDb: UsersDatabase) {
  return async function registerUser(user: User) {
    const newUser = makeUser(user);

    const isUserExists = await usersDb.getUserByUsername(newUser.getUsername());

    if (isUserExists) {
      return {
        success: false,
        message: `User with giwen username: '${newUser.getUsername()}' is already exists`
      };
    }

    return await usersDb.saveUser(newUser.toJSON());
  }
}
