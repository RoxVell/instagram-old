import Timestamp from './Timestamp'

interface Post {
  id: string
  username: string
  content: string[]
  description: string
  created_date: Timestamp
  likes: number
  comments: number
}

export default Post
