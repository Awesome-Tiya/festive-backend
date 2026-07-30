-- CreateEnum
CREATE TYPE "public"."CommentFlagReason" AS ENUM ('SPAM', 'DISRESPECT', 'HATE_SPEECH', 'HARASSMENT', 'MISINFORMATION', 'VULGAR', 'OTHER');

-- CreateTable
CREATE TABLE "public"."Suggestion" (
    "id" TEXT NOT NULL,
    "suggestion" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Suggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Article" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "username" TEXT,
    "album" TEXT,
    "time" TIMESTAMP(3),

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CommentFlag" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "reason" "public"."CommentFlagReason" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Comment" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "isFlag" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT NOT NULL,
    "username" TEXT,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UpVote" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "UpVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Sticker" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Sticker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DailyFestival" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "fest1Name" TEXT NOT NULL,
    "fest1Desc" TEXT NOT NULL,
    "fest2Name" TEXT NOT NULL,
    "fest2Desc" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyFestival_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Like" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Suggestion_createdAt_idx" ON "public"."Suggestion"("createdAt");

-- CreateIndex
CREATE INDEX "Article_time_idx" ON "public"."Article"("time");

-- CreateIndex
CREATE UNIQUE INDEX "Article_time_title_key" ON "public"."Article"("time", "title");

-- CreateIndex
CREATE INDEX "CommentFlag_commentId_idx" ON "public"."CommentFlag"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentFlag_commentId_username_key" ON "public"."CommentFlag"("commentId", "username");

-- CreateIndex
CREATE UNIQUE INDEX "UpVote_articleId_username_key" ON "public"."UpVote"("articleId", "username");

-- CreateIndex
CREATE UNIQUE INDEX "DailyFestival_date_key" ON "public"."DailyFestival"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Like_commentId_username_key" ON "public"."Like"("commentId", "username");

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UpVote" ADD CONSTRAINT "UpVote_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sticker" ADD CONSTRAINT "Sticker_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
