-- CreateEnum
CREATE TYPE "District" AS ENUM ('KASARAGOD', 'KANNUR', 'WAYANAD', 'KOZHIKODE', 'MALAPPURAM', 'PALAKKAD', 'THRISSUR', 'ERNAKULAM', 'IDUKKI', 'KOTTAYAM', 'ALAPPUZHA', 'PATHANAMTHITTA', 'KOLLAM', 'THIRUVANANTHAPURAM');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('WORKING', 'RETIRED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "Department" AS ENUM ('LSGD', 'PWD', 'IRRIGATION');

-- CreateEnum
CREATE TYPE "Designation" AS ENUM ('ASSISTANT_ENGINEER', 'ASSISTANT_EXECUTIVE_ENGINEER', 'EXECUTIVE_ENGINEER', 'SUPERINTENDING_ENGINEER', 'CHIEF_ENGINEER');

-- CreateEnum
CREATE TYPE "CommitteeType" AS ENUM ('NONE', 'STATE', 'DISTRICT');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'REGULAR');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('VERIFIED', 'PENDING', 'REJECTED');

-- CreateEnum
CREATE TYPE "StatePositionTitle" AS ENUM ('PRESIDENT', 'VICE_PRESIDENT', 'GENERAL_SECRETARY', 'JOINT_SECRETARY', 'TREASURER', 'EDITOR', 'EXECUTIVE_COMMITTEE_MEMBER', 'IMMEDIATE_PAST_PRESIDENT', 'IMMEDIATE_PAST_SECRETARY');

-- CreateEnum
CREATE TYPE "DistrictPositionTitle" AS ENUM ('DISTRICT_PRESIDENT', 'DISTRICT_SECRETARY');

-- CreateEnum
CREATE TYPE "SecurityQuestionType" AS ENUM ('MOTHERS_MAIDEN_NAME', 'FIRST_PET', 'FIRST_SCHOOL', 'FAVOURITE_BOOK', 'FAVOURITE_CAR');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('PROMOTION', 'TRANSFER', 'RETIREMENT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "bloodGroup" "BloodGroup" NOT NULL,
    "userStatus" "UserStatus" NOT NULL DEFAULT 'RETIRED',
    "department" "Department",
    "designation" "Designation",
    "officeAddress" TEXT,
    "workDistrict" "District",
    "personalAddress" TEXT NOT NULL,
    "homeDistrict" "District" NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "mobileNumber" TEXT NOT NULL,
    "photoUrl" TEXT,
    "committeeType" "CommitteeType" NOT NULL DEFAULT 'NONE',
    "userRole" "UserRole" NOT NULL DEFAULT 'REGULAR',
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "razorpayId" TEXT,
    "password" TEXT,
    "membershipId" INTEGER,
    "positionState" "StatePositionTitle",
    "positionDistrict" "DistrictPositionTitle",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "photoId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityQuestion" (
    "id" SERIAL NOT NULL,
    "question" "SecurityQuestionType" NOT NULL,
    "answer" TEXT NOT NULL,
    "membershipId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecurityQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromotionTransferRequest" (
    "id" TEXT NOT NULL,
    "membershipId" INTEGER NOT NULL,
    "requestType" "RequestType" NOT NULL,
    "oldPosition" "Designation",
    "newPosition" "Designation",
    "oldWorkDistrict" "District",
    "newWorkDistrict" "District",
    "oldOfficeAddress" TEXT,
    "newOfficeAddress" TEXT,
    "retirementDate" TIMESTAMP(3),
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "adminComments" TEXT,
    "showAgain" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PromotionTransferRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Obituary" (
    "id" TEXT NOT NULL,
    "membershipId" INTEGER NOT NULL,
    "dateOfDeath" TIMESTAMP(3) NOT NULL,
    "dateRecorded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "additionalNote" TEXT,

    CONSTRAINT "Obituary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_razorpayId_key" ON "User"("razorpayId");

-- CreateIndex
CREATE UNIQUE INDEX "User_membershipId_key" ON "User"("membershipId");

-- CreateIndex
CREATE UNIQUE INDEX "User_photoId_key" ON "User"("photoId");

-- CreateIndex
CREATE UNIQUE INDEX "SecurityQuestion_membershipId_key" ON "SecurityQuestion"("membershipId");

-- AddForeignKey
ALTER TABLE "SecurityQuestion" ADD CONSTRAINT "SecurityQuestion_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "User"("membershipId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionTransferRequest" ADD CONSTRAINT "PromotionTransferRequest_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "User"("membershipId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Obituary" ADD CONSTRAINT "Obituary_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "User"("membershipId") ON DELETE RESTRICT ON UPDATE CASCADE;
