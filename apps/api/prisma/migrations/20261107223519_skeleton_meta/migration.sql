-- CreateTable
CREATE TABLE "skeleton_meta" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT 'spectaxi',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skeleton_meta_pkey" PRIMARY KEY ("id")
);
