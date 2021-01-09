import Post from "~/types/Post";

export default function buildMakePost() {
  return function(post: Pick<Post, 'username' | 'content' | 'description'>) {
    return {
      getUsername: () => post.username,
      getContent: () => post.content,
      getDescription: () => post.description
    }
  }
}
