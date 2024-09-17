/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Item_seller_id_key";

-- DropIndex
DROP INDEX "User_id_key";

-- CreateTable
CREATE TABLE "_Favorited" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Favorited_AB_unique" ON "_Favorited"("A", "B");

-- CreateIndex
CREATE INDEX "_Favorited_B_index" ON "_Favorited"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "_Favorited" ADD CONSTRAINT "_Favorited_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Favorited" ADD CONSTRAINT "_Favorited_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
