import Timestamp from "./Timestamp";

export default interface User {
  created_date: Timestamp
  email: string
  followers: number
  following: number
  posts: number
  profile_description: string
  username: string
  verified: false
}