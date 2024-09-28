-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "zip" INTEGER NOT NULL,
    "street" TEXT NOT NULL,
    "apartment" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Browsing_History" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "looked_at_tags" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "Browsing_History_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credit_Card" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "pin" TEXT NOT NULL,
    "exp_date" TEXT NOT NULL,

    CONSTRAINT "Credit_Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "default_photo" TEXT NOT NULL,
    "additional_photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[],

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Past_Transactions" (
    "id" SERIAL NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "buyer_id" INTEGER NOT NULL,
    "item_dict" JSONB NOT NULL,
    "total_cost" INTEGER NOT NULL,
    "tags" TEXT[],

    CONSTRAINT "Past_Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shopping_Cart" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "item_dict" JSONB NOT NULL,
    "total_cost" INTEGER NOT NULL,

    CONSTRAINT "Shopping_Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_admin" BOOLEAN DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Favorited" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Browsing_History_user_id_key" ON "Browsing_History"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Shopping_Cart_user_id_key" ON "Shopping_Cart"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_Favorited_AB_unique" ON "_Favorited"("A", "B");

-- CreateIndex
CREATE INDEX "_Favorited_B_index" ON "_Favorited"("B");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Browsing_History" ADD CONSTRAINT "Browsing_History_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_Card" ADD CONSTRAINT "Credit_Card_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Past_Transactions" ADD CONSTRAINT "Past_Transactions_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Past_Transactions" ADD CONSTRAINT "Past_Transactions_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shopping_Cart" ADD CONSTRAINT "Shopping_Cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Favorited" ADD CONSTRAINT "_Favorited_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Favorited" ADD CONSTRAINT "_Favorited_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
