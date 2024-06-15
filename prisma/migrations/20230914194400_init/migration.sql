-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "UserImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "altText" TEXT,
    "contentType" TEXT NOT NULL,
    "blob" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "UserImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Password" (
    "hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "access" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "algorithm" TEXT NOT NULL,
    "digits" INTEGER NOT NULL,
    "period" INTEGER NOT NULL,
    "charSet" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "Connection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "providerName" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Connection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentCacheVersion" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "timestamp" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "_PermissionToRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PermissionToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PermissionToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_RoleToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserImage_userId_key" ON "UserImage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Password_userId_key" ON "Password"("userId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_action_entity_access_key" ON "Permission"("action", "entity", "access");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_target_type_key" ON "Verification"("target", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_providerName_providerId_key" ON "Connection"("providerName", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionToRole_AB_unique" ON "_PermissionToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionToRole_B_index" ON "_PermissionToRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToUser_AB_unique" ON "_RoleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "_RoleToUser"("B");

--------------------------------- Manual Seeding --------------------------
-- Hey there, Kent here! This is how you can reliably seed your database with
-- some data. You edit the migration.sql file and that will handle it for you.

INSERT INTO "Permission" VALUES('clnf2zvli0000pcou3zzzzome','create','user','own','',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO "Permission" VALUES('clnf2zvll0001pcouly1310ku','create','user','any','',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO "Permission" VALUES('clnf2zvll0002pcouka7348re','read','user','own','',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO "Permission" VALUES('clnf2zvlm0003pcouea4dee51','read','user','any','',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO "Permission" VALUES('clnf2zvlm0004pcou2guvolx5','update','user','own','',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO "Permission" VALUES('clnf2zvln0005pcoun78ps5ap','update','user','any','',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO "Permission" VALUES('clnf2zvlo0006pcouyoptc5jp','delete','user','own','',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO "Permission" VALUES('clnf2zvlo0007pcouw1yzoyam','delete','user','any','',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO "Role" VALUES('clnf2zvlw000gpcour6dyyuh6','admin','',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO "Role" VALUES('clnf2zvlx000hpcou5dfrbegs','user','',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO "_PermissionToRole" VALUES('clnf2zvli0000pcou3zzzzome','clnf2zvlx000hpcou5dfrbegs');
INSERT INTO "_PermissionToRole" VALUES('clnf2zvll0001pcouly1310ku','clnf2zvlw000gpcour6dyyuh6');
INSERT INTO "_PermissionToRole" VALUES('clnf2zvll0002pcouka7348re','clnf2zvlx000hpcou5dfrbegs');
INSERT INTO "_PermissionToRole" VALUES('clnf2zvlm0003pcouea4dee51','clnf2zvlw000gpcour6dyyuh6');
INSERT INTO "_PermissionToRole" VALUES('clnf2zvlm0004pcou2guvolx5','clnf2zvlx000hpcou5dfrbegs');
INSERT INTO "_PermissionToRole" VALUES('clnf2zvln0005pcoun78ps5ap','clnf2zvlw000gpcour6dyyuh6');
INSERT INTO "_PermissionToRole" VALUES('clnf2zvlo0006pcouyoptc5jp','clnf2zvlx000hpcou5dfrbegs');
INSERT INTO "_PermissionToRole" VALUES('clnf2zvlo0007pcouw1yzoyam','clnf2zvlw000gpcour6dyyuh6');