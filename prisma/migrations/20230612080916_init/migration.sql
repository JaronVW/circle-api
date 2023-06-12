/*
  Warnings:

  - The primary key for the `Message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Message` table. All the data in the column will be lost.
  - Added the required column `Message` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StreamID` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserID` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" DROP CONSTRAINT "Message_pkey",
DROP COLUMN "ID",
DROP COLUMN "message",
ADD COLUMN     "Message" VARCHAR NOT NULL,
ADD COLUMN     "MessageID" SERIAL NOT NULL,
ADD COLUMN     "StreamID" VARCHAR NOT NULL,
ADD COLUMN     "UserID" INTEGER NOT NULL,
ADD CONSTRAINT "Message_pkey" PRIMARY KEY ("MessageID");

-- CreateTable
CREATE TABLE "Stream" (
    "StreamID" VARCHAR NOT NULL,
    "UserID" INTEGER NOT NULL,

    CONSTRAINT "Stream_pkey" PRIMARY KEY ("StreamID")
);

-- CreateTable
CREATE TABLE "User" (
    "UserID" SERIAL NOT NULL,
    "FirstName" VARCHAR NOT NULL,
    "Infix" VARCHAR,
    "LastName" VARCHAR NOT NULL,
    "Email" VARCHAR NOT NULL,
    "Password" VARCHAR NOT NULL,
    "SSN" VARCHAR NOT NULL,
    "PhoneNumber" VARCHAR NOT NULL,
    "Address" VARCHAR NOT NULL,
    "PostalCode" VARCHAR NOT NULL,
    "Birthdate" DATE NOT NULL,
    "Country" VARCHAR NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("UserID")
);

-- CreateIndex
CREATE INDEX "fki_FK_UserID" ON "Stream"("UserID");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "FK_StreamID" FOREIGN KEY ("StreamID") REFERENCES "Stream"("StreamID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "FK_UserID" FOREIGN KEY ("UserID") REFERENCES "User"("UserID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Stream" ADD CONSTRAINT "FK_UserID" FOREIGN KEY ("UserID") REFERENCES "User"("UserID") ON DELETE NO ACTION ON UPDATE NO ACTION;
