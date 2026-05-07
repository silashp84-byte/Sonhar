# Security Spec for DREAMS

## Data Invariants
1. A Dream must belong to a valid user.
2. A Friendship must contain exactly two distinct users.
3. A Message must be part of a Friendship where the sender is one of the participants.
4. Users can only update their own profile and dreams.

## The Dirty Dozen Payloads
1. **Identity Spoofing**: Attempt to create a profile for another UID.
2. **Ghost Dream**: Attempt to create a dream for another UID.
3. **Friendship Hijack**: Attempt to accept a friend request intended for someone else.
4. **Message Forgery**: Attempt to send a message in a chat you aren't part of.
5. **PII Leak**: Attempt to list all users' private info (if any).
6. **Shadow Field**: Add `isAdmin: true` to a user profile update.
7. **Orphaned Message**: Create a message for a non-existent friendship.
8. **Recursive Cost Attack**: Send a 1MB string as a dream title.
9. **Status Fast-track**: Set a friendship to `accepted` during initial request creation.
10. **ID Poisoning**: Use a 2KB string as a document ID.
11. **Timestamp Spoofing**: Provide a client-side `createdAt` date from 2010.
12. **Double Participants**: Create a friendship where `userIds` contains the same UID twice.

## Test Runner (Conceptual)
Verified via `firestore.rules.test.ts` (if environment allowed, otherwise manual logic check).
