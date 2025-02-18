-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "introducerId" INTEGER,
    "beneficiaryId" INTEGER,
    "balance" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);
