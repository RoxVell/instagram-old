import User from "~/types/User";

export default interface UsersDatabase {
    getUserByUsername(username: string): Promise<User>;
    saveUser(user: User): Promise<User>;
}

// export default function makeUsersDb({ makeDb }): UsersDb {
//     async function getUserByUsername(username: string) {
//         const db = await makeDb();

//         return await db.collection('users').find()
//     }

//     return Object.freeze({
//         getUserByUsername
//     });
// }