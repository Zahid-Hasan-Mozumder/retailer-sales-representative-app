-- Enable pg_trgm extension required for GIN trigram indexes
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- CreateIndex
CREATE INDEX "areas_name_idx" ON "areas" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "distributors_name_idx" ON "distributors" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "regions_name_idx" ON "regions" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "retailers_name_phone_idx" ON "retailers" USING GIN ("name" gin_trgm_ops, "phone" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "territories_name_idx" ON "territories" USING GIN ("name" gin_trgm_ops);
