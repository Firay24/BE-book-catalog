-- CreateEnum
CREATE TYPE "Thickness" AS ENUM ('THIN', 'NORMAL', 'THICK');

-- CreateEnum
CREATE TYPE "StatusBook" AS ENUM ('AVAILABLE', 'BORROWED');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "Id" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "RoleId" TEXT NOT NULL,
    "BanUntil" DATE,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Role" (
    "Id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Category" (
    "Id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Book" (
    "Id" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "ImageUrl" TEXT NOT NULL,
    "ReleaseYear" INTEGER NOT NULL,
    "Price" INTEGER NOT NULL,
    "TotalPage" INTEGER NOT NULL,
    "Thickness" "Thickness" NOT NULL,
    "CategoryId" TEXT NOT NULL,
    "Status" "StatusBook" NOT NULL DEFAULT 'AVAILABLE',
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "BorrowRequest" (
    "Id" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "BookId" TEXT NOT NULL,
    "Status" "RequestStatus" NOT NULL,
    "RequestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Approved" DATE,

    CONSTRAINT "BorrowRequest_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "BorrowedBook" (
    "Id" TEXT NOT NULL,
    "BorrowRequestId" TEXT NOT NULL,
    "StartDate" TIMESTAMP(3) NOT NULL,
    "EndDate" TIMESTAMP(3) NOT NULL,
    "BookId" TEXT NOT NULL,
    "ReturnedDate" TIMESTAMP(3),

    CONSTRAINT "BorrowedBook_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_RoleId_fkey" FOREIGN KEY ("RoleId") REFERENCES "Role"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_CategoryId_fkey" FOREIGN KEY ("CategoryId") REFERENCES "Category"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BorrowRequest" ADD CONSTRAINT "BorrowRequest_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BorrowRequest" ADD CONSTRAINT "BorrowRequest_BookId_fkey" FOREIGN KEY ("BookId") REFERENCES "Book"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BorrowedBook" ADD CONSTRAINT "BorrowedBook_BorrowRequestId_fkey" FOREIGN KEY ("BorrowRequestId") REFERENCES "BorrowRequest"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BorrowedBook" ADD CONSTRAINT "BorrowedBook_BookId_fkey" FOREIGN KEY ("BookId") REFERENCES "Book"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
