export type AuthProvider = 'email' | 'google' | 'discord'

export interface User {
  id: string
  supabaseId: string
  username: string
  displayName: string
  avatarUrl: string | null
  bio: string | null
  followersCount: number
  followingCount: number
  postsCount: number
  createdAt: string
}

export interface Game {
  id: string
  title: string
  coverUrl: string | null
  genre: string[]
  description: string | null
  avgRating: number
  releaseDate: string | null
}

export interface Post {
  id: string
  userId: string
  gameId: string | null
  content: string
  images: string[]
  likesCount: number
  commentsCount: number
  isLiked: boolean
  user: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>
  game: Pick<Game, 'id' | 'title' | 'coverUrl'> | null
  createdAt: string
}

export interface Comment {
  id: string
  postId: string
  userId: string
  content: string
  user: Pick<User, 'id' | 'username' | 'avatarUrl'>
  createdAt: string
}

export interface Review {
  id: string
  userId: string
  gameId: string
  rating: number
  content: string
  user: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>
  game: Pick<Game, 'id' | 'title'>
  createdAt: string
}

export interface UserGame {
  id: string
  userId: string
  gameId: string
  status: 'playing' | 'wishlist' | 'finished' | 'dropped'
  progress: number
  game: Game
  createdAt: string
  updatedAt: string
}

export interface Follow {
  followerId: string
  followeeId: string
}

export type NotificationType = 'like' | 'comment' | 'follow' | 'review'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  data: Record<string, unknown>
  read: boolean
  createdAt: string
}

export interface NewsArticle {
  id: string
  title: string
  summary: string
  imageUrl: string | null
  source: string
  url: string
  publishedAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  nextCursor: string | null
  hasMore: boolean
}

export interface ApiResponse<T> {
  data: T
  error: string | null
}

export interface MutationResponse<T> {
  oldData: T | null
  newData: T
  error: string | null
}
