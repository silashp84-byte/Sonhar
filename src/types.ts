export enum FriendshipStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted'
}

export enum DreamStatus {
  ACTIVE = 'active',
  ACHIEVED = 'achieved'
}

export interface UserProfile {
  uid: string;
  displayName: string;
  bio: string;
  photoURL: string;
  dreamGoal: string;
  location: string;
  createdAt: any; // ServerTimestamp
  lastSeen: any;
}

export interface Dream {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  status: DreamStatus;
  createdAt: any;
}

export interface Friendship {
  id: string;
  userIds: string[];
  status: FriendshipStatus;
  requestedBy: string;
  createdAt: any;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: any;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}
