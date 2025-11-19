/*
  Warnings:

  - A unique constraint covering the columns `[name,region_id]` on the table `areas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,area_id]` on the table `territories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "areas_name_region_id_key" ON "areas"("name", "region_id");

-- CreateIndex
CREATE UNIQUE INDEX "territories_name_area_id_key" ON "territories"("name", "area_id");
