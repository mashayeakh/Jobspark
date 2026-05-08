-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "workStyleId" INTEGER;

-- CreateTable
CREATE TABLE "WorkStyle" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "WorkStyle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkStyle_label_key" ON "WorkStyle"("label");

-- CreateIndex
CREATE UNIQUE INDEX "WorkStyle_value_key" ON "WorkStyle"("value");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_workStyleId_fkey" FOREIGN KEY ("workStyleId") REFERENCES "WorkStyle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
