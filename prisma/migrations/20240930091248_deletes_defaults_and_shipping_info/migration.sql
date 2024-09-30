/*
  Warnings:

  - You are about to drop the `_Favorited` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `paying_card` to the `Past_Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping_address` to the `Past_Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Browsing_History" DROP CONSTRAINT "Browsing_History_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Credit_Card" DROP CONSTRAINT "Credit_Card_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_seller_id_fkey";

-- DropForeignKey
ALTER TABLE "Past_Transactions" DROP CONSTRAINT "Past_Transactions_buyer_id_fkey";

-- DropForeignKey
ALTER TABLE "Past_Transactions" DROP CONSTRAINT "Past_Transactions_seller_id_fkey";

-- DropForeignKey
ALTER TABLE "Shopping_Cart" DROP CONSTRAINT "Shopping_Cart_user_id_fkey";

-- DropForeignKey
ALTER TABLE "_Favorited" DROP CONSTRAINT "_Favorited_A_fkey";

-- DropForeignKey
ALTER TABLE "_Favorited" DROP CONSTRAINT "_Favorited_B_fkey";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "is_default" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Credit_Card" ADD COLUMN     "is_default" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Past_Transactions" ADD COLUMN     "paying_card" TEXT NOT NULL,
ADD COLUMN     "shipping_address" TEXT NOT NULL;

-- DropTable
DROP TABLE "_Favorited";

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Browsing_History" ADD CONSTRAINT "Browsing_History_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_Card" ADD CONSTRAINT "Credit_Card_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Past_Transactions" ADD CONSTRAINT "Past_Transactions_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Past_Transactions" ADD CONSTRAINT "Past_Transactions_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shopping_Cart" ADD CONSTRAINT "Shopping_Cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
