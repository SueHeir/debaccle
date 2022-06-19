import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Comment = {
  __typename?: "Comment";
  createdAt: Scalars["String"];
  creator: User;
  creatorId: Scalars["Float"];
  downvotes: Scalars["Float"];
  id: Scalars["Float"];
  postId: Scalars["Float"];
  text: Scalars["String"];
  textSnippet: Scalars["String"];
  updatedAt: Scalars["String"];
  upvotes: Scalars["Float"];
  voteStatus?: Maybe<Scalars["Int"]>;
};

export type CommentFieldError = {
  __typename?: "CommentFieldError";
  field: Scalars["String"];
  message: Scalars["String"];
};

export type CommentInput = {
  postId: Scalars["Float"];
  text: Scalars["String"];
};

export type CommentResponse = {
  __typename?: "CommentResponse";
  comment?: Maybe<Comment>;
  errors?: Maybe<Array<CommentFieldError>>;
};

export type FieldError = {
  __typename?: "FieldError";
  field: Scalars["String"];
  message: Scalars["String"];
};

export type FieldError2 = {
  __typename?: "FieldError2";
  field: Scalars["String"];
  message: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  changePassword: UserResponse;
  createComment: CommentResponse;
  createPost: PostResponse;
  deleteComment: Scalars["Boolean"];
  deletePost: Scalars["Boolean"];
  deleteUser: Scalars["Boolean"];
  followUser?: Maybe<UserResponse>;
  forgotPassword: Scalars["Boolean"];
  hateUser?: Maybe<UserResponse>;
  login: UserResponse;
  logout: Scalars["Boolean"];
  register: UserResponse;
  registerEmail: Scalars["Boolean"];
  unfollowUser?: Maybe<UserResponse>;
  unhateUser?: Maybe<UserResponse>;
  updateComment?: Maybe<Comment>;
  updatePost?: Maybe<PostResponse>;
  updateUser?: Maybe<User>;
  vote: Post;
  voteComment: Comment;
};

export type MutationChangePasswordArgs = {
  newPassword: Scalars["String"];
  token: Scalars["String"];
};

export type MutationCreateCommentArgs = {
  input: CommentInput;
};

export type MutationCreatePostArgs = {
  file?: InputMaybe<Scalars["Upload"]>;
  input: PostInput;
};

export type MutationDeleteCommentArgs = {
  id: Scalars["Int"];
  postId: Scalars["Int"];
};

export type MutationDeletePostArgs = {
  id: Scalars["Int"];
};

export type MutationFollowUserArgs = {
  username: Scalars["String"];
};

export type MutationForgotPasswordArgs = {
  email: Scalars["String"];
};

export type MutationHateUserArgs = {
  username: Scalars["String"];
};

export type MutationLoginArgs = {
  password: Scalars["String"];
  usernameOrEmail: Scalars["String"];
};

export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};

export type MutationRegisterEmailArgs = {
  token: Scalars["String"];
};

export type MutationUnfollowUserArgs = {
  username: Scalars["String"];
};

export type MutationUnhateUserArgs = {
  username: Scalars["String"];
};

export type MutationUpdateCommentArgs = {
  id: Scalars["Int"];
  text: Scalars["String"];
};

export type MutationUpdatePostArgs = {
  id: Scalars["Int"];
  text: Scalars["String"];
  title: Scalars["String"];
};

export type MutationUpdateUserArgs = {
  bio: Scalars["String"];
  file?: InputMaybe<Scalars["Upload"]>;
  id: Scalars["Int"];
  image: Scalars["String"];
  name: Scalars["String"];
};

export type MutationVoteArgs = {
  postId: Scalars["Int"];
  value: Scalars["Int"];
};

export type MutationVoteCommentArgs = {
  commentId: Scalars["Int"];
  value: Scalars["Int"];
};

export type PaginatedComments = {
  __typename?: "PaginatedComments";
  comments: Array<Comment>;
  hasMore: Scalars["Boolean"];
};

export type PaginatedPosts = {
  __typename?: "PaginatedPosts";
  hasMore: Scalars["Boolean"];
  posts: Array<Post>;
};

export type Post = {
  __typename?: "Post";
  commentCount: Scalars["Float"];
  comments?: Maybe<Array<Comment>>;
  createdAt: Scalars["String"];
  creator: User;
  creatorId: Scalars["Float"];
  downvotes: Scalars["Float"];
  id: Scalars["Float"];
  image: Scalars["String"];
  locked: Scalars["Boolean"];
  text: Scalars["String"];
  textSnippet: Scalars["String"];
  title: Scalars["String"];
  updatedAt: Scalars["String"];
  upvotes: Scalars["Float"];
  voteStatus?: Maybe<Scalars["Int"]>;
};

export type PostInput = {
  text: Scalars["String"];
  title: Scalars["String"];
  type: Scalars["String"];
  topics: Array<Scalars["String"]>;
};

export type PostResponse = {
  __typename?: "PostResponse";
  errors?: Maybe<Array<FieldError2>>;
  post?: Maybe<Post>;
};

export type Query = {
  __typename?: "Query";
  comment?: Maybe<Comment>;
  comments: PaginatedComments;
  me?: Maybe<User>;
  post?: Maybe<Post>;
  posts: PaginatedPosts;
  search: SearchResponse;
  trending: PaginatedPosts;
  user?: Maybe<User>;
  userFollowHateInfo?: Maybe<Array<User>>;
};

export type QueryCommentArgs = {
  id: Scalars["Int"];
};

export type QueryCommentsArgs = {
  cursor?: InputMaybe<Scalars["String"]>;
  limit: Scalars["Int"];
  postId: Scalars["Int"];
};

export type QueryPostArgs = {
  id: Scalars["Int"];
};

export type QueryPostsArgs = {
  cursor?: InputMaybe<Scalars["String"]>;
  limit: Scalars["Int"];
  showExpired?: InputMaybe<Scalars["Boolean"]>;
  userids?: InputMaybe<Array<Scalars["Int"]>>;
  users?: InputMaybe<Array<Scalars["String"]>>;
};

export type QuerySearchArgs = {
  search: Scalars["String"];
};

export type QueryTrendingArgs = {
  anti: Scalars["Boolean"];
  cursor?: InputMaybe<Scalars["String"]>;
  limit: Scalars["Int"];
};

export type QueryUserArgs = {
  id?: InputMaybe<Scalars["Int"]>;
  username?: InputMaybe<Scalars["String"]>;
};

export type QueryUserFollowHateInfoArgs = {
  id?: InputMaybe<Scalars["Int"]>;
  type: Scalars["String"];
  username?: InputMaybe<Scalars["String"]>;
};

export type SearchResponse = {
  __typename?: "SearchResponse";
  posts?: Maybe<Array<Post>>;
  users?: Maybe<Array<User>>;
};

export type User = {
  __typename?: "User";
  bio: Scalars["String"];
  comments: Array<Comment>;
  createdAt: Scalars["String"];
  credits: Scalars["Float"];
  email: Scalars["String"];
  emailvarified: Scalars["Boolean"];
  emailvarifiedtoken: Scalars["String"];
  followers: Array<Scalars["Int"]>;
  following: Array<Scalars["Int"]>;
  haters: Array<Scalars["Int"]>;
  hating: Array<Scalars["Int"]>;
  id: Scalars["Float"];
  image: Scalars["String"];
  name: Scalars["String"];
  updatedAt: Scalars["String"];
  username: Scalars["String"];
};

export type UserResponse = {
  __typename?: "UserResponse";
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernamePasswordInput = {
  email: Scalars["String"];
  name: Scalars["String"];
  password: Scalars["String"];
  username: Scalars["String"];
};

export type CommentSnippetFragment = {
  __typename?: "Comment";
  id: number;
  postId: number;
  text: string;
  textSnippet: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
  creator: {
    __typename?: "User";
    id: number;
    username: string;
    name: string;
    image: string;
  };
};

export type PostSnippetFragment = {
  __typename?: "Post";
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  upvotes: number;
  downvotes: number;
  textSnippet: string;
  voteStatus?: number | null;
  text: string;
  creatorId: number;
  commentCount: number;
  image: string;
  locked: boolean;
  creator: {
    __typename?: "User";
    id: number;
    username: string;
    name: string;
    image: string;
  };
  comments?: Array<{
    __typename?: "Comment";
    id: number;
    postId: number;
    text: string;
    textSnippet: string;
    upvotes: number;
    downvotes: number;
    createdAt: string;
    updatedAt: string;
    creator: {
      __typename?: "User";
      id: number;
      username: string;
      name: string;
      image: string;
    };
  }> | null;
};

export type RegularErrorFragment = {
  __typename?: "FieldError";
  field: string;
  message: string;
};

export type RegularError2Fragment = {
  __typename?: "FieldError2";
  field: string;
  message: string;
};

export type RegularError3Fragment = {
  __typename?: "CommentFieldError";
  field: string;
  message: string;
};

export type RegularUserFragment = {
  __typename?: "User";
  id: number;
  username: string;
  name: string;
  bio: string;
  image: string;
  credits: number;
  followers: Array<number>;
  following: Array<number>;
  haters: Array<number>;
  hating: Array<number>;
  emailvarified: boolean;
};

export type RegularPostResponseFragment = {
  __typename?: "PostResponse";
  errors?: Array<{
    __typename?: "FieldError2";
    field: string;
    message: string;
  }> | null;
  post?: {
    __typename?: "Post";
    id: number;
    createdAt: string;
    updatedAt: string;
    title: string;
    upvotes: number;
    downvotes: number;
    textSnippet: string;
    voteStatus?: number | null;
    text: string;
    creatorId: number;
    commentCount: number;
    image: string;
    locked: boolean;
    creator: {
      __typename?: "User";
      id: number;
      username: string;
      name: string;
      image: string;
    };
    comments?: Array<{
      __typename?: "Comment";
      id: number;
      postId: number;
      text: string;
      textSnippet: string;
      upvotes: number;
      downvotes: number;
      createdAt: string;
      updatedAt: string;
      creator: {
        __typename?: "User";
        id: number;
        username: string;
        name: string;
        image: string;
      };
    }> | null;
  } | null;
};

export type RegularCommentResponseFragment = {
  __typename?: "CommentResponse";
  errors?: Array<{
    __typename?: "CommentFieldError";
    field: string;
    message: string;
  }> | null;
  comment?: {
    __typename?: "Comment";
    id: number;
    postId: number;
    text: string;
  } | null;
};

export type RegularUserResponseFragment = {
  __typename?: "UserResponse";
  errors?: Array<{
    __typename?: "FieldError";
    field: string;
    message: string;
  }> | null;
  user?: {
    __typename?: "User";
    id: number;
    username: string;
    name: string;
    bio: string;
    image: string;
    credits: number;
    followers: Array<number>;
    following: Array<number>;
    haters: Array<number>;
    hating: Array<number>;
    emailvarified: boolean;
  } | null;
};

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars["String"];
  newPassword: Scalars["String"];
}>;

export type ChangePasswordMutation = {
  __typename?: "Mutation";
  changePassword: {
    __typename?: "UserResponse";
    errors?: Array<{
      __typename?: "FieldError";
      field: string;
      message: string;
    }> | null;
    user?: {
      __typename?: "User";
      id: number;
      username: string;
      name: string;
      bio: string;
      image: string;
      credits: number;
      followers: Array<number>;
      following: Array<number>;
      haters: Array<number>;
      hating: Array<number>;
      emailvarified: boolean;
    } | null;
  };
};

export type CreateCommentMutationVariables = Exact<{
  input: CommentInput;
}>;

export type CreateCommentMutation = {
  __typename?: "Mutation";
  createComment: {
    __typename?: "CommentResponse";
    errors?: Array<{
      __typename?: "CommentFieldError";
      field: string;
      message: string;
    }> | null;
    comment?: {
      __typename?: "Comment";
      id: number;
      postId: number;
      text: string;
      textSnippet: string;
      creator: {
        __typename?: "User";
        id: number;
        username: string;
        name: string;
      };
    } | null;
  };
};

export type CreatePostMutationVariables = Exact<{
  input: PostInput;
  file?: InputMaybe<Scalars["Upload"]>;
}>;

export type CreatePostMutation = {
  __typename?: "Mutation";
  createPost: {
    __typename?: "PostResponse";
    errors?: Array<{
      __typename?: "FieldError2";
      field: string;
      message: string;
    }> | null;
    post?: {
      __typename?: "Post";
      id: number;
      createdAt: string;
      updatedAt: string;
      title: string;
      upvotes: number;
      downvotes: number;
      textSnippet: string;
      voteStatus?: number | null;
      text: string;
      creatorId: number;
      commentCount: number;
      image: string;
      locked: boolean;
      creator: {
        __typename?: "User";
        id: number;
        username: string;
        name: string;
        image: string;
      };
      comments?: Array<{
        __typename?: "Comment";
        id: number;
        postId: number;
        text: string;
        textSnippet: string;
        upvotes: number;
        downvotes: number;
        createdAt: string;
        updatedAt: string;
        creator: {
          __typename?: "User";
          id: number;
          username: string;
          name: string;
          image: string;
        };
      }> | null;
    } | null;
  };
};

export type DeleteCommentMutationVariables = Exact<{
  id: Scalars["Int"];
  postId: Scalars["Int"];
}>;

export type DeleteCommentMutation = {
  __typename?: "Mutation";
  deleteComment: boolean;
};

export type DeletePostMutationVariables = Exact<{
  id: Scalars["Int"];
}>;

export type DeletePostMutation = {
  __typename?: "Mutation";
  deletePost: boolean;
};

export type DeleteUserMutationVariables = Exact<{ [key: string]: never }>;

export type DeleteUserMutation = {
  __typename?: "Mutation";
  deleteUser: boolean;
};

export type FollowUserMutationVariables = Exact<{
  username: Scalars["String"];
}>;

export type FollowUserMutation = {
  __typename?: "Mutation";
  followUser?: {
    __typename?: "UserResponse";
    errors?: Array<{
      __typename?: "FieldError";
      field: string;
      message: string;
    }> | null;
    user?: {
      __typename?: "User";
      id: number;
      username: string;
      name: string;
      bio: string;
      image: string;
      credits: number;
      followers: Array<number>;
      following: Array<number>;
      haters: Array<number>;
      hating: Array<number>;
      emailvarified: boolean;
    } | null;
  } | null;
};

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars["String"];
}>;

export type ForgotPasswordMutation = {
  __typename?: "Mutation";
  forgotPassword: boolean;
};

export type HateUserMutationVariables = Exact<{
  username: Scalars["String"];
}>;

export type HateUserMutation = {
  __typename?: "Mutation";
  hateUser?: {
    __typename?: "UserResponse";
    errors?: Array<{
      __typename?: "FieldError";
      field: string;
      message: string;
    }> | null;
    user?: {
      __typename?: "User";
      id: number;
      username: string;
      name: string;
      bio: string;
      image: string;
      credits: number;
      followers: Array<number>;
      following: Array<number>;
      haters: Array<number>;
      hating: Array<number>;
      emailvarified: boolean;
    } | null;
  } | null;
};

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars["String"];
  password: Scalars["String"];
}>;

export type LoginMutation = {
  __typename?: "Mutation";
  login: {
    __typename?: "UserResponse";
    errors?: Array<{
      __typename?: "FieldError";
      field: string;
      message: string;
    }> | null;
    user?: {
      __typename?: "User";
      id: number;
      username: string;
      name: string;
      bio: string;
      image: string;
      credits: number;
      followers: Array<number>;
      following: Array<number>;
      haters: Array<number>;
      hating: Array<number>;
      emailvarified: boolean;
    } | null;
  };
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: "Mutation"; logout: boolean };

export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;

export type RegisterMutation = {
  __typename?: "Mutation";
  register: {
    __typename?: "UserResponse";
    errors?: Array<{
      __typename?: "FieldError";
      field: string;
      message: string;
    }> | null;
    user?: {
      __typename?: "User";
      id: number;
      username: string;
      name: string;
      bio: string;
      image: string;
      credits: number;
      followers: Array<number>;
      following: Array<number>;
      haters: Array<number>;
      hating: Array<number>;
      emailvarified: boolean;
    } | null;
  };
};

export type RegisterEmailMutationVariables = Exact<{
  token: Scalars["String"];
}>;

export type RegisterEmailMutation = {
  __typename?: "Mutation";
  registerEmail: boolean;
};

export type UnFollowUserMutationVariables = Exact<{
  username: Scalars["String"];
}>;

export type UnFollowUserMutation = {
  __typename?: "Mutation";
  unfollowUser?: {
    __typename?: "UserResponse";
    errors?: Array<{
      __typename?: "FieldError";
      field: string;
      message: string;
    }> | null;
    user?: {
      __typename?: "User";
      id: number;
      username: string;
      name: string;
      bio: string;
      image: string;
      credits: number;
      followers: Array<number>;
      following: Array<number>;
      haters: Array<number>;
      hating: Array<number>;
      emailvarified: boolean;
    } | null;
  } | null;
};

export type UnHateUserMutationVariables = Exact<{
  username: Scalars["String"];
}>;

export type UnHateUserMutation = {
  __typename?: "Mutation";
  unhateUser?: {
    __typename?: "UserResponse";
    errors?: Array<{
      __typename?: "FieldError";
      field: string;
      message: string;
    }> | null;
    user?: {
      __typename?: "User";
      id: number;
      username: string;
      name: string;
      bio: string;
      image: string;
      credits: number;
      followers: Array<number>;
      following: Array<number>;
      haters: Array<number>;
      hating: Array<number>;
      emailvarified: boolean;
    } | null;
  } | null;
};

export type UpdatePostMutationVariables = Exact<{
  id: Scalars["Int"];
  title: Scalars["String"];
  text: Scalars["String"];
}>;

export type UpdatePostMutation = {
  __typename?: "Mutation";
  updatePost?: {
    __typename?: "PostResponse";
    errors?: Array<{
      __typename?: "FieldError2";
      field: string;
      message: string;
    }> | null;
    post?: {
      __typename?: "Post";
      id: number;
      createdAt: string;
      updatedAt: string;
      title: string;
      upvotes: number;
      downvotes: number;
      textSnippet: string;
      voteStatus?: number | null;
      text: string;
      creatorId: number;
      commentCount: number;
      image: string;
      locked: boolean;
      creator: {
        __typename?: "User";
        id: number;
        username: string;
        name: string;
        image: string;
      };
      comments?: Array<{
        __typename?: "Comment";
        id: number;
        postId: number;
        text: string;
        textSnippet: string;
        upvotes: number;
        downvotes: number;
        createdAt: string;
        updatedAt: string;
        creator: {
          __typename?: "User";
          id: number;
          username: string;
          name: string;
          image: string;
        };
      }> | null;
    } | null;
  } | null;
};

export type UpdateUserMutationVariables = Exact<{
  id: Scalars["Int"];
  name: Scalars["String"];
  bio: Scalars["String"];
  image: Scalars["String"];
  file?: InputMaybe<Scalars["Upload"]>;
}>;

export type UpdateUserMutation = {
  __typename?: "Mutation";
  updateUser?: {
    __typename?: "User";
    id: number;
    name: string;
    bio: string;
    username: string;
  } | null;
};

export type VoteMutationVariables = Exact<{
  value: Scalars["Int"];
  postId: Scalars["Int"];
}>;

export type VoteMutation = {
  __typename?: "Mutation";
  vote: {
    __typename?: "Post";
    id: number;
    createdAt: string;
    updatedAt: string;
    title: string;
    upvotes: number;
    downvotes: number;
    textSnippet: string;
    voteStatus?: number | null;
    text: string;
    creatorId: number;
    commentCount: number;
    image: string;
    locked: boolean;
    creator: {
      __typename?: "User";
      id: number;
      username: string;
      name: string;
      image: string;
    };
    comments?: Array<{
      __typename?: "Comment";
      id: number;
      postId: number;
      text: string;
      textSnippet: string;
      upvotes: number;
      downvotes: number;
      createdAt: string;
      updatedAt: string;
      creator: {
        __typename?: "User";
        id: number;
        username: string;
        name: string;
        image: string;
      };
    }> | null;
  };
};

export type VoteCommentMutationVariables = Exact<{
  value: Scalars["Int"];
  commentId: Scalars["Int"];
}>;

export type VoteCommentMutation = {
  __typename?: "Mutation";
  voteComment: {
    __typename?: "Comment";
    id: number;
    postId: number;
    text: string;
    textSnippet: string;
    upvotes: number;
    downvotes: number;
    createdAt: string;
    updatedAt: string;
    creator: {
      __typename?: "User";
      id: number;
      username: string;
      name: string;
      image: string;
    };
  };
};

export type CommentsQueryVariables = Exact<{
  limit: Scalars["Int"];
  cursor?: InputMaybe<Scalars["String"]>;
  postId: Scalars["Int"];
}>;

export type CommentsQuery = {
  __typename?: "Query";
  comments: {
    __typename?: "PaginatedComments";
    hasMore: boolean;
    comments: Array<{
      __typename?: "Comment";
      id: number;
      postId: number;
      text: string;
      textSnippet: string;
      upvotes: number;
      downvotes: number;
      createdAt: string;
      updatedAt: string;
      creator: {
        __typename?: "User";
        id: number;
        username: string;
        name: string;
        image: string;
      };
    }>;
  };
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  __typename?: "Query";
  me?: {
    __typename?: "User";
    id: number;
    username: string;
    name: string;
    bio: string;
    image: string;
    credits: number;
    followers: Array<number>;
    following: Array<number>;
    haters: Array<number>;
    hating: Array<number>;
    emailvarified: boolean;
  } | null;
};

export type PostQueryVariables = Exact<{
  id: Scalars["Int"];
}>;

export type PostQuery = {
  __typename?: "Query";
  post?: {
    __typename?: "Post";
    id: number;
    createdAt: string;
    updatedAt: string;
    title: string;
    upvotes: number;
    downvotes: number;
    textSnippet: string;
    voteStatus?: number | null;
    text: string;
    creatorId: number;
    commentCount: number;
    image: string;
    locked: boolean;
    creator: {
      __typename?: "User";
      id: number;
      username: string;
      name: string;
      image: string;
    };
    comments?: Array<{
      __typename?: "Comment";
      id: number;
      postId: number;
      text: string;
      textSnippet: string;
      upvotes: number;
      downvotes: number;
      createdAt: string;
      updatedAt: string;
      creator: {
        __typename?: "User";
        id: number;
        username: string;
        name: string;
        image: string;
      };
    }> | null;
  } | null;
};

export type PostsQueryVariables = Exact<{
  limit: Scalars["Int"];
  cursor?: InputMaybe<Scalars["String"]>;
  users?: InputMaybe<Array<Scalars["String"]> | Scalars["String"]>;
  userids?: InputMaybe<Array<Scalars["Int"]> | Scalars["Int"]>;
  showExpired?: InputMaybe<Scalars["Boolean"]>;
}>;

export type PostsQuery = {
  __typename?: "Query";
  posts: {
    __typename?: "PaginatedPosts";
    hasMore: boolean;
    posts: Array<{
      __typename?: "Post";
      id: number;
      createdAt: string;
      updatedAt: string;
      title: string;
      upvotes: number;
      downvotes: number;
      textSnippet: string;
      voteStatus?: number | null;
      text: string;
      creatorId: number;
      commentCount: number;
      image: string;
      locked: boolean;
      creator: {
        __typename?: "User";
        id: number;
        username: string;
        name: string;
        image: string;
      };
      comments?: Array<{
        __typename?: "Comment";
        id: number;
        postId: number;
        text: string;
        textSnippet: string;
        upvotes: number;
        downvotes: number;
        createdAt: string;
        updatedAt: string;
        creator: {
          __typename?: "User";
          id: number;
          username: string;
          name: string;
          image: string;
        };
      }> | null;
    }>;
  };
};

export type TrendingQueryVariables = Exact<{
  limit: Scalars["Int"];
  cursor?: InputMaybe<Scalars["String"]>;
  anti: Scalars["Boolean"];
}>;

export type TrendingQuery = {
  __typename?: "Query";
  trending: {
    __typename?: "PaginatedPosts";
    hasMore: boolean;
    posts: Array<{
      __typename?: "Post";
      id: number;
      createdAt: string;
      updatedAt: string;
      title: string;
      upvotes: number;
      downvotes: number;
      textSnippet: string;
      voteStatus?: number | null;
      text: string;
      creatorId: number;
      commentCount: number;
      image: string;
      locked: boolean;
      creator: {
        __typename?: "User";
        id: number;
        username: string;
        name: string;
        image: string;
      };
      comments?: Array<{
        __typename?: "Comment";
        id: number;
        postId: number;
        text: string;
        textSnippet: string;
        upvotes: number;
        downvotes: number;
        createdAt: string;
        updatedAt: string;
        creator: {
          __typename?: "User";
          id: number;
          username: string;
          name: string;
          image: string;
        };
      }> | null;
    }>;
  };
};

export type SearchQueryVariables = Exact<{
  search: Scalars["String"];
}>;

export type SearchQuery = {
  __typename?: "Query";
  search: {
    __typename?: "SearchResponse";
    users?: Array<{
      __typename?: "User";
      id: number;
      username: string;
      name: string;
      bio: string;
      image: string;
      credits: number;
      followers: Array<number>;
      following: Array<number>;
      haters: Array<number>;
      hating: Array<number>;
      emailvarified: boolean;
    }> | null;
    posts?: Array<{
      __typename?: "Post";
      id: number;
      createdAt: string;
      updatedAt: string;
      title: string;
      upvotes: number;
      downvotes: number;
      textSnippet: string;
      voteStatus?: number | null;
      text: string;
      creatorId: number;
      commentCount: number;
      image: string;
      locked: boolean;
      creator: {
        __typename?: "User";
        id: number;
        username: string;
        name: string;
        image: string;
      };
      comments?: Array<{
        __typename?: "Comment";
        id: number;
        postId: number;
        text: string;
        textSnippet: string;
        upvotes: number;
        downvotes: number;
        createdAt: string;
        updatedAt: string;
        creator: {
          __typename?: "User";
          id: number;
          username: string;
          name: string;
          image: string;
        };
      }> | null;
    }> | null;
  };
};

export type UserQueryVariables = Exact<{
  id?: InputMaybe<Scalars["Int"]>;
  username?: InputMaybe<Scalars["String"]>;
}>;

export type UserQuery = {
  __typename?: "Query";
  user?: {
    __typename?: "User";
    id: number;
    username: string;
    name: string;
    bio: string;
    credits: number;
    image: string;
    followers: Array<number>;
    following: Array<number>;
    haters: Array<number>;
    hating: Array<number>;
  } | null;
};

export type UserFollowHateInfoQueryVariables = Exact<{
  id?: InputMaybe<Scalars["Int"]>;
  username?: InputMaybe<Scalars["String"]>;
  type: Scalars["String"];
}>;

export type UserFollowHateInfoQuery = {
  __typename?: "Query";
  userFollowHateInfo?: Array<{
    __typename?: "User";
    id: number;
    username: string;
    name: string;
    image: string;
    followers: Array<number>;
    following: Array<number>;
    haters: Array<number>;
    hating: Array<number>;
  }> | null;
};

export const RegularError2FragmentDoc = gql`
  fragment RegularError2 on FieldError2 {
    field
    message
  }
`;
export const CommentSnippetFragmentDoc = gql`
  fragment CommentSnippet on Comment {
    id
    postId
    text
    textSnippet
    upvotes
    downvotes
    createdAt
    updatedAt
    creator {
      id
      username
      name
      image
    }
  }
`;
export const PostSnippetFragmentDoc = gql`
  fragment PostSnippet on Post {
    id
    createdAt
    updatedAt
    title
    upvotes
    downvotes
    textSnippet
    voteStatus
    text
    creatorId
    commentCount
    image
    locked
    creator {
      id
      username
      name
      image
    }
    comments {
      ...CommentSnippet
    }
  }
  ${CommentSnippetFragmentDoc}
`;
export const RegularPostResponseFragmentDoc = gql`
  fragment RegularPostResponse on PostResponse {
    errors {
      ...RegularError2
    }
    post {
      ...PostSnippet
    }
  }
  ${RegularError2FragmentDoc}
  ${PostSnippetFragmentDoc}
`;
export const RegularError3FragmentDoc = gql`
  fragment RegularError3 on CommentFieldError {
    field
    message
  }
`;
export const RegularCommentResponseFragmentDoc = gql`
  fragment RegularCommentResponse on CommentResponse {
    errors {
      ...RegularError3
    }
    comment {
      id
      postId
      text
    }
  }
  ${RegularError3FragmentDoc}
`;
export const RegularErrorFragmentDoc = gql`
  fragment RegularError on FieldError {
    field
    message
  }
`;
export const RegularUserFragmentDoc = gql`
  fragment RegularUser on User {
    id
    username
    name
    bio
    image
    credits
    followers
    following
    haters
    hating
    emailvarified
  }
`;
export const RegularUserResponseFragmentDoc = gql`
  fragment RegularUserResponse on UserResponse {
    errors {
      ...RegularError
    }
    user {
      ...RegularUser
    }
  }
  ${RegularErrorFragmentDoc}
  ${RegularUserFragmentDoc}
`;
export const ChangePasswordDocument = gql`
  mutation ChangePassword($token: String!, $newPassword: String!) {
    changePassword(token: $token, newPassword: $newPassword) {
      ...RegularUserResponse
    }
  }
  ${RegularUserResponseFragmentDoc}
`;
export type ChangePasswordMutationFn = Apollo.MutationFunction<
  ChangePasswordMutation,
  ChangePasswordMutationVariables
>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangePasswordMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >(ChangePasswordDocument, options);
}
export type ChangePasswordMutationHookResult = ReturnType<
  typeof useChangePasswordMutation
>;
export type ChangePasswordMutationResult =
  Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<
  ChangePasswordMutation,
  ChangePasswordMutationVariables
>;
export const CreateCommentDocument = gql`
  mutation CreateComment($input: CommentInput!) {
    createComment(input: $input) {
      errors {
        field
        message
      }
      comment {
        id
        postId
        text
        textSnippet
        creator {
          id
          username
          name
        }
      }
    }
  }
`;
export type CreateCommentMutationFn = Apollo.MutationFunction<
  CreateCommentMutation,
  CreateCommentMutationVariables
>;

/**
 * __useCreateCommentMutation__
 *
 * To run a mutation, you first call `useCreateCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCommentMutation, { data, loading, error }] = useCreateCommentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCommentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateCommentMutation,
    CreateCommentMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateCommentMutation,
    CreateCommentMutationVariables
  >(CreateCommentDocument, options);
}
export type CreateCommentMutationHookResult = ReturnType<
  typeof useCreateCommentMutation
>;
export type CreateCommentMutationResult =
  Apollo.MutationResult<CreateCommentMutation>;
export type CreateCommentMutationOptions = Apollo.BaseMutationOptions<
  CreateCommentMutation,
  CreateCommentMutationVariables
>;
export const CreatePostDocument = gql`
  mutation CreatePost($input: PostInput!, $file: Upload) {
    createPost(input: $input, file: $file) {
      ...RegularPostResponse
    }
  }
  ${RegularPostResponseFragmentDoc}
`;
export type CreatePostMutationFn = Apollo.MutationFunction<
  CreatePostMutation,
  CreatePostMutationVariables
>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      input: // value for 'input'
 *      file: // value for 'file'
 *   },
 * });
 */
export function useCreatePostMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreatePostMutation,
    CreatePostMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(
    CreatePostDocument,
    options
  );
}
export type CreatePostMutationHookResult = ReturnType<
  typeof useCreatePostMutation
>;
export type CreatePostMutationResult =
  Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<
  CreatePostMutation,
  CreatePostMutationVariables
>;
export const DeleteCommentDocument = gql`
  mutation DeleteComment($id: Int!, $postId: Int!) {
    deleteComment(id: $id, postId: $postId)
  }
`;
export type DeleteCommentMutationFn = Apollo.MutationFunction<
  DeleteCommentMutation,
  DeleteCommentMutationVariables
>;

/**
 * __useDeleteCommentMutation__
 *
 * To run a mutation, you first call `useDeleteCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCommentMutation, { data, loading, error }] = useDeleteCommentMutation({
 *   variables: {
 *      id: // value for 'id'
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useDeleteCommentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteCommentMutation,
    DeleteCommentMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    DeleteCommentMutation,
    DeleteCommentMutationVariables
  >(DeleteCommentDocument, options);
}
export type DeleteCommentMutationHookResult = ReturnType<
  typeof useDeleteCommentMutation
>;
export type DeleteCommentMutationResult =
  Apollo.MutationResult<DeleteCommentMutation>;
export type DeleteCommentMutationOptions = Apollo.BaseMutationOptions<
  DeleteCommentMutation,
  DeleteCommentMutationVariables
>;
export const DeletePostDocument = gql`
  mutation DeletePost($id: Int!) {
    deletePost(id: $id)
  }
`;
export type DeletePostMutationFn = Apollo.MutationFunction<
  DeletePostMutation,
  DeletePostMutationVariables
>;

/**
 * __useDeletePostMutation__
 *
 * To run a mutation, you first call `useDeletePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePostMutation, { data, loading, error }] = useDeletePostMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePostMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeletePostMutation,
    DeletePostMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeletePostMutation, DeletePostMutationVariables>(
    DeletePostDocument,
    options
  );
}
export type DeletePostMutationHookResult = ReturnType<
  typeof useDeletePostMutation
>;
export type DeletePostMutationResult =
  Apollo.MutationResult<DeletePostMutation>;
export type DeletePostMutationOptions = Apollo.BaseMutationOptions<
  DeletePostMutation,
  DeletePostMutationVariables
>;
export const DeleteUserDocument = gql`
  mutation DeleteUser {
    deleteUser
  }
`;
export type DeleteUserMutationFn = Apollo.MutationFunction<
  DeleteUserMutation,
  DeleteUserMutationVariables
>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteUserMutation,
    DeleteUserMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(
    DeleteUserDocument,
    options
  );
}
export type DeleteUserMutationHookResult = ReturnType<
  typeof useDeleteUserMutation
>;
export type DeleteUserMutationResult =
  Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<
  DeleteUserMutation,
  DeleteUserMutationVariables
>;
export const FollowUserDocument = gql`
  mutation FollowUser($username: String!) {
    followUser(username: $username) {
      ...RegularUserResponse
    }
  }
  ${RegularUserResponseFragmentDoc}
`;
export type FollowUserMutationFn = Apollo.MutationFunction<
  FollowUserMutation,
  FollowUserMutationVariables
>;

/**
 * __useFollowUserMutation__
 *
 * To run a mutation, you first call `useFollowUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFollowUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [followUserMutation, { data, loading, error }] = useFollowUserMutation({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useFollowUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    FollowUserMutation,
    FollowUserMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<FollowUserMutation, FollowUserMutationVariables>(
    FollowUserDocument,
    options
  );
}
export type FollowUserMutationHookResult = ReturnType<
  typeof useFollowUserMutation
>;
export type FollowUserMutationResult =
  Apollo.MutationResult<FollowUserMutation>;
export type FollowUserMutationOptions = Apollo.BaseMutationOptions<
  FollowUserMutation,
  FollowUserMutationVariables
>;
export const ForgotPasswordDocument = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables
>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ForgotPasswordMutation,
    ForgotPasswordMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ForgotPasswordMutation,
    ForgotPasswordMutationVariables
  >(ForgotPasswordDocument, options);
}
export type ForgotPasswordMutationHookResult = ReturnType<
  typeof useForgotPasswordMutation
>;
export type ForgotPasswordMutationResult =
  Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables
>;
export const HateUserDocument = gql`
  mutation HateUser($username: String!) {
    hateUser(username: $username) {
      ...RegularUserResponse
    }
  }
  ${RegularUserResponseFragmentDoc}
`;
export type HateUserMutationFn = Apollo.MutationFunction<
  HateUserMutation,
  HateUserMutationVariables
>;

/**
 * __useHateUserMutation__
 *
 * To run a mutation, you first call `useHateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [hateUserMutation, { data, loading, error }] = useHateUserMutation({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useHateUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    HateUserMutation,
    HateUserMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<HateUserMutation, HateUserMutationVariables>(
    HateUserDocument,
    options
  );
}
export type HateUserMutationHookResult = ReturnType<typeof useHateUserMutation>;
export type HateUserMutationResult = Apollo.MutationResult<HateUserMutation>;
export type HateUserMutationOptions = Apollo.BaseMutationOptions<
  HateUserMutation,
  HateUserMutationVariables
>;
export const LoginDocument = gql`
  mutation Login($usernameOrEmail: String!, $password: String!) {
    login(usernameOrEmail: $usernameOrEmail, password: $password) {
      ...RegularUserResponse
    }
  }
  ${RegularUserResponseFragmentDoc}
`;
export type LoginMutationFn = Apollo.MutationFunction<
  LoginMutation,
  LoginMutationVariables
>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      usernameOrEmail: // value for 'usernameOrEmail'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LoginMutation,
    LoginMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LoginMutation, LoginMutationVariables>(
    LoginDocument,
    options
  );
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<
  LoginMutation,
  LoginMutationVariables
>;
export const LogoutDocument = gql`
  mutation Logout {
    logout
  }
`;
export type LogoutMutationFn = Apollo.MutationFunction<
  LogoutMutation,
  LogoutMutationVariables
>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LogoutMutation,
    LogoutMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(
    LogoutDocument,
    options
  );
}
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<
  LogoutMutation,
  LogoutMutationVariables
>;
export const RegisterDocument = gql`
  mutation Register($options: UsernamePasswordInput!) {
    register(options: $options) {
      ...RegularUserResponse
    }
  }
  ${RegularUserResponseFragmentDoc}
`;
export type RegisterMutationFn = Apollo.MutationFunction<
  RegisterMutation,
  RegisterMutationVariables
>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useRegisterMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RegisterMutation,
    RegisterMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(
    RegisterDocument,
    options
  );
}
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<
  RegisterMutation,
  RegisterMutationVariables
>;
export const RegisterEmailDocument = gql`
  mutation RegisterEmail($token: String!) {
    registerEmail(token: $token)
  }
`;
export type RegisterEmailMutationFn = Apollo.MutationFunction<
  RegisterEmailMutation,
  RegisterEmailMutationVariables
>;

/**
 * __useRegisterEmailMutation__
 *
 * To run a mutation, you first call `useRegisterEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerEmailMutation, { data, loading, error }] = useRegisterEmailMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useRegisterEmailMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RegisterEmailMutation,
    RegisterEmailMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RegisterEmailMutation,
    RegisterEmailMutationVariables
  >(RegisterEmailDocument, options);
}
export type RegisterEmailMutationHookResult = ReturnType<
  typeof useRegisterEmailMutation
>;
export type RegisterEmailMutationResult =
  Apollo.MutationResult<RegisterEmailMutation>;
export type RegisterEmailMutationOptions = Apollo.BaseMutationOptions<
  RegisterEmailMutation,
  RegisterEmailMutationVariables
>;
export const UnFollowUserDocument = gql`
  mutation UnFollowUser($username: String!) {
    unfollowUser(username: $username) {
      ...RegularUserResponse
    }
  }
  ${RegularUserResponseFragmentDoc}
`;
export type UnFollowUserMutationFn = Apollo.MutationFunction<
  UnFollowUserMutation,
  UnFollowUserMutationVariables
>;

/**
 * __useUnFollowUserMutation__
 *
 * To run a mutation, you first call `useUnFollowUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnFollowUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unFollowUserMutation, { data, loading, error }] = useUnFollowUserMutation({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useUnFollowUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UnFollowUserMutation,
    UnFollowUserMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UnFollowUserMutation,
    UnFollowUserMutationVariables
  >(UnFollowUserDocument, options);
}
export type UnFollowUserMutationHookResult = ReturnType<
  typeof useUnFollowUserMutation
>;
export type UnFollowUserMutationResult =
  Apollo.MutationResult<UnFollowUserMutation>;
export type UnFollowUserMutationOptions = Apollo.BaseMutationOptions<
  UnFollowUserMutation,
  UnFollowUserMutationVariables
>;
export const UnHateUserDocument = gql`
  mutation UnHateUser($username: String!) {
    unhateUser(username: $username) {
      ...RegularUserResponse
    }
  }
  ${RegularUserResponseFragmentDoc}
`;
export type UnHateUserMutationFn = Apollo.MutationFunction<
  UnHateUserMutation,
  UnHateUserMutationVariables
>;

/**
 * __useUnHateUserMutation__
 *
 * To run a mutation, you first call `useUnHateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnHateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unHateUserMutation, { data, loading, error }] = useUnHateUserMutation({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useUnHateUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UnHateUserMutation,
    UnHateUserMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UnHateUserMutation, UnHateUserMutationVariables>(
    UnHateUserDocument,
    options
  );
}
export type UnHateUserMutationHookResult = ReturnType<
  typeof useUnHateUserMutation
>;
export type UnHateUserMutationResult =
  Apollo.MutationResult<UnHateUserMutation>;
export type UnHateUserMutationOptions = Apollo.BaseMutationOptions<
  UnHateUserMutation,
  UnHateUserMutationVariables
>;
export const UpdatePostDocument = gql`
  mutation UpdatePost($id: Int!, $title: String!, $text: String!) {
    updatePost(id: $id, title: $title, text: $text) {
      ...RegularPostResponse
    }
  }
  ${RegularPostResponseFragmentDoc}
`;
export type UpdatePostMutationFn = Apollo.MutationFunction<
  UpdatePostMutation,
  UpdatePostMutationVariables
>;

/**
 * __useUpdatePostMutation__
 *
 * To run a mutation, you first call `useUpdatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePostMutation, { data, loading, error }] = useUpdatePostMutation({
 *   variables: {
 *      id: // value for 'id'
 *      title: // value for 'title'
 *      text: // value for 'text'
 *   },
 * });
 */
export function useUpdatePostMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdatePostMutation,
    UpdatePostMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(
    UpdatePostDocument,
    options
  );
}
export type UpdatePostMutationHookResult = ReturnType<
  typeof useUpdatePostMutation
>;
export type UpdatePostMutationResult =
  Apollo.MutationResult<UpdatePostMutation>;
export type UpdatePostMutationOptions = Apollo.BaseMutationOptions<
  UpdatePostMutation,
  UpdatePostMutationVariables
>;
export const UpdateUserDocument = gql`
  mutation UpdateUser(
    $id: Int!
    $name: String!
    $bio: String!
    $image: String!
    $file: Upload
  ) {
    updateUser(id: $id, name: $name, bio: $bio, image: $image, file: $file) {
      id
      name
      bio
      username
    }
  }
`;
export type UpdateUserMutationFn = Apollo.MutationFunction<
  UpdateUserMutation,
  UpdateUserMutationVariables
>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      bio: // value for 'bio'
 *      image: // value for 'image'
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUpdateUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateUserMutation,
    UpdateUserMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(
    UpdateUserDocument,
    options
  );
}
export type UpdateUserMutationHookResult = ReturnType<
  typeof useUpdateUserMutation
>;
export type UpdateUserMutationResult =
  Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<
  UpdateUserMutation,
  UpdateUserMutationVariables
>;
export const VoteDocument = gql`
  mutation Vote($value: Int!, $postId: Int!) {
    vote(value: $value, postId: $postId) {
      ...PostSnippet
    }
  }
  ${PostSnippetFragmentDoc}
`;
export type VoteMutationFn = Apollo.MutationFunction<
  VoteMutation,
  VoteMutationVariables
>;

/**
 * __useVoteMutation__
 *
 * To run a mutation, you first call `useVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [voteMutation, { data, loading, error }] = useVoteMutation({
 *   variables: {
 *      value: // value for 'value'
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useVoteMutation(
  baseOptions?: Apollo.MutationHookOptions<VoteMutation, VoteMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<VoteMutation, VoteMutationVariables>(
    VoteDocument,
    options
  );
}
export type VoteMutationHookResult = ReturnType<typeof useVoteMutation>;
export type VoteMutationResult = Apollo.MutationResult<VoteMutation>;
export type VoteMutationOptions = Apollo.BaseMutationOptions<
  VoteMutation,
  VoteMutationVariables
>;
export const VoteCommentDocument = gql`
  mutation VoteComment($value: Int!, $commentId: Int!) {
    voteComment(value: $value, commentId: $commentId) {
      ...CommentSnippet
    }
  }
  ${CommentSnippetFragmentDoc}
`;
export type VoteCommentMutationFn = Apollo.MutationFunction<
  VoteCommentMutation,
  VoteCommentMutationVariables
>;

/**
 * __useVoteCommentMutation__
 *
 * To run a mutation, you first call `useVoteCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVoteCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [voteCommentMutation, { data, loading, error }] = useVoteCommentMutation({
 *   variables: {
 *      value: // value for 'value'
 *      commentId: // value for 'commentId'
 *   },
 * });
 */
export function useVoteCommentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    VoteCommentMutation,
    VoteCommentMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<VoteCommentMutation, VoteCommentMutationVariables>(
    VoteCommentDocument,
    options
  );
}
export type VoteCommentMutationHookResult = ReturnType<
  typeof useVoteCommentMutation
>;
export type VoteCommentMutationResult =
  Apollo.MutationResult<VoteCommentMutation>;
export type VoteCommentMutationOptions = Apollo.BaseMutationOptions<
  VoteCommentMutation,
  VoteCommentMutationVariables
>;
export const CommentsDocument = gql`
  query Comments($limit: Int!, $cursor: String, $postId: Int!) {
    comments(limit: $limit, cursor: $cursor, postId: $postId) {
      hasMore
      comments {
        ...CommentSnippet
      }
    }
  }
  ${CommentSnippetFragmentDoc}
`;

/**
 * __useCommentsQuery__
 *
 * To run a query within a React component, call `useCommentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCommentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommentsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useCommentsQuery(
  baseOptions: Apollo.QueryHookOptions<CommentsQuery, CommentsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CommentsQuery, CommentsQueryVariables>(
    CommentsDocument,
    options
  );
}
export function useCommentsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CommentsQuery,
    CommentsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CommentsQuery, CommentsQueryVariables>(
    CommentsDocument,
    options
  );
}
export type CommentsQueryHookResult = ReturnType<typeof useCommentsQuery>;
export type CommentsLazyQueryHookResult = ReturnType<
  typeof useCommentsLazyQuery
>;
export type CommentsQueryResult = Apollo.QueryResult<
  CommentsQuery,
  CommentsQueryVariables
>;
export const MeDocument = gql`
  query Me {
    me {
      ...RegularUser
    }
  }
  ${RegularUserFragmentDoc}
`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(
  baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}
export function useMeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const PostDocument = gql`
  query Post($id: Int!) {
    post(id: $id) {
      ...PostSnippet
    }
  }
  ${PostSnippetFragmentDoc}
`;

/**
 * __usePostQuery__
 *
 * To run a query within a React component, call `usePostQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePostQuery(
  baseOptions: Apollo.QueryHookOptions<PostQuery, PostQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<PostQuery, PostQueryVariables>(PostDocument, options);
}
export function usePostLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PostQuery, PostQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<PostQuery, PostQueryVariables>(
    PostDocument,
    options
  );
}
export type PostQueryHookResult = ReturnType<typeof usePostQuery>;
export type PostLazyQueryHookResult = ReturnType<typeof usePostLazyQuery>;
export type PostQueryResult = Apollo.QueryResult<PostQuery, PostQueryVariables>;
export const PostsDocument = gql`
  query Posts(
    $limit: Int!
    $cursor: String
    $users: [String!]
    $userids: [Int!]
    $showExpired: Boolean
  ) {
    posts(
      limit: $limit
      cursor: $cursor
      users: $users
      userids: $userids
      showExpired: $showExpired
    ) {
      hasMore
      posts {
        ...PostSnippet
      }
    }
  }
  ${PostSnippetFragmentDoc}
`;

/**
 * __usePostsQuery__
 *
 * To run a query within a React component, call `usePostsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *      users: // value for 'users'
 *      userids: // value for 'userids'
 *      showExpired: // value for 'showExpired'
 *   },
 * });
 */
export function usePostsQuery(
  baseOptions: Apollo.QueryHookOptions<PostsQuery, PostsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<PostsQuery, PostsQueryVariables>(
    PostsDocument,
    options
  );
}
export function usePostsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PostsQuery, PostsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<PostsQuery, PostsQueryVariables>(
    PostsDocument,
    options
  );
}
export type PostsQueryHookResult = ReturnType<typeof usePostsQuery>;
export type PostsLazyQueryHookResult = ReturnType<typeof usePostsLazyQuery>;
export type PostsQueryResult = Apollo.QueryResult<
  PostsQuery,
  PostsQueryVariables
>;
export const TrendingDocument = gql`
  query Trending($limit: Int!, $cursor: String, $anti: Boolean!) {
    trending(limit: $limit, cursor: $cursor, anti: $anti) {
      hasMore
      posts {
        ...PostSnippet
      }
    }
  }
  ${PostSnippetFragmentDoc}
`;

/**
 * __useTrendingQuery__
 *
 * To run a query within a React component, call `useTrendingQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrendingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrendingQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *      anti: // value for 'anti'
 *   },
 * });
 */
export function useTrendingQuery(
  baseOptions: Apollo.QueryHookOptions<TrendingQuery, TrendingQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TrendingQuery, TrendingQueryVariables>(
    TrendingDocument,
    options
  );
}
export function useTrendingLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    TrendingQuery,
    TrendingQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TrendingQuery, TrendingQueryVariables>(
    TrendingDocument,
    options
  );
}
export type TrendingQueryHookResult = ReturnType<typeof useTrendingQuery>;
export type TrendingLazyQueryHookResult = ReturnType<
  typeof useTrendingLazyQuery
>;
export type TrendingQueryResult = Apollo.QueryResult<
  TrendingQuery,
  TrendingQueryVariables
>;
export const SearchDocument = gql`
  query Search($search: String!) {
    search(search: $search) {
      users {
        ...RegularUser
      }
      posts {
        ...PostSnippet
      }
    }
  }
  ${RegularUserFragmentDoc}
  ${PostSnippetFragmentDoc}
`;

/**
 * __useSearchQuery__
 *
 * To run a query within a React component, call `useSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchQuery({
 *   variables: {
 *      search: // value for 'search'
 *   },
 * });
 */
export function useSearchQuery(
  baseOptions: Apollo.QueryHookOptions<SearchQuery, SearchQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SearchQuery, SearchQueryVariables>(
    SearchDocument,
    options
  );
}
export function useSearchLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SearchQuery, SearchQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SearchQuery, SearchQueryVariables>(
    SearchDocument,
    options
  );
}
export type SearchQueryHookResult = ReturnType<typeof useSearchQuery>;
export type SearchLazyQueryHookResult = ReturnType<typeof useSearchLazyQuery>;
export type SearchQueryResult = Apollo.QueryResult<
  SearchQuery,
  SearchQueryVariables
>;
export const UserDocument = gql`
  query User($id: Int, $username: String) {
    user(id: $id, username: $username) {
      id
      username
      name
      bio
      credits
      image
      followers
      following
      haters
      hating
    }
  }
`;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *      username: // value for 'username'
 *   },
 * });
 */
export function useUserQuery(
  baseOptions?: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
}
export function useUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(
    UserDocument,
    options
  );
}
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const UserFollowHateInfoDocument = gql`
  query UserFollowHateInfo($id: Int, $username: String, $type: String!) {
    userFollowHateInfo(id: $id, username: $username, type: $type) {
      id
      username
      name
      image
      followers
      following
      haters
      hating
    }
  }
`;

/**
 * __useUserFollowHateInfoQuery__
 *
 * To run a query within a React component, call `useUserFollowHateInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserFollowHateInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserFollowHateInfoQuery({
 *   variables: {
 *      id: // value for 'id'
 *      username: // value for 'username'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useUserFollowHateInfoQuery(
  baseOptions: Apollo.QueryHookOptions<
    UserFollowHateInfoQuery,
    UserFollowHateInfoQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    UserFollowHateInfoQuery,
    UserFollowHateInfoQueryVariables
  >(UserFollowHateInfoDocument, options);
}
export function useUserFollowHateInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UserFollowHateInfoQuery,
    UserFollowHateInfoQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    UserFollowHateInfoQuery,
    UserFollowHateInfoQueryVariables
  >(UserFollowHateInfoDocument, options);
}
export type UserFollowHateInfoQueryHookResult = ReturnType<
  typeof useUserFollowHateInfoQuery
>;
export type UserFollowHateInfoLazyQueryHookResult = ReturnType<
  typeof useUserFollowHateInfoLazyQuery
>;
export type UserFollowHateInfoQueryResult = Apollo.QueryResult<
  UserFollowHateInfoQuery,
  UserFollowHateInfoQueryVariables
>;
