import Timestamp from '../Timestamp'

interface Reply {
  id: string
  username: string
  text: string
  likes: number
  repliesCount: number
  created_date: Timestamp
}

export default Reply
