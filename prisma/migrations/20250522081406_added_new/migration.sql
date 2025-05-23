-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('group', 'direct');

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "type" "ChatType" NOT NULL DEFAULT 'direct';

-- AlterTable
ALTER TABLE "ChatMember" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "isOnline" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastSeenAt" TIMESTAMP(3);
