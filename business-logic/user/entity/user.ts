import User from "~/types/User"

export default function buildMakeUser() {
  return function makeUser(user: User) {
    return {
      getUsername: () => user.username,
      getEmail: () => user.email,
      getFollowersCount: () => user.followers,
      getFollowingCount: () => user.following,
      getPostsCount: () => user.posts,
      getProfileDescription: () => user.profile_description,
      getVerifiedStatus: () => user.verified,
      toJSON: (): User => {
        return {
          ...user
        };
      }
    };
  }
}
