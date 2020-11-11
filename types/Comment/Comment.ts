import Reply from './Reply'

interface Comment extends Reply {
  repliesCount: number
  replies: Array<Reply>
}

export default Comment
