import { Prisma } from '@prisma/client';

export function getRetailersQuery(
  role: string,
  userId: string | undefined,
  search: string | undefined,
  sortName: string | undefined,
  sortUpdatedAt: string | undefined,
  sortCreatedAt: string | undefined,
  offset: number,
  limit: number,
  regionId: number | undefined,
  areaId: number | undefined,
  distributorId: number | undefined,
  territoryId: number | undefined,
): Prisma.Sql {
  return Prisma.sql`
    SELECT "Retailer"."id",
           "Retailer"."uid",
           "Retailer"."name",
           "Retailer"."phone",
           "Retailer"."regionId",
           "Retailer"."areaId",
           "Retailer"."distributorId",
           "Retailer"."territoryId",
           "Retailer"."routes",
           "Retailer"."createdAt",
           "Retailer"."updatedAt"
    FROM "Retailer"
    WHERE CASE
            WHEN ${role} = 'ADMIN' THEN TRUE
            ELSE EXISTS (
              SELECT 1
              FROM "SalesRepRetailer"
              WHERE "SalesRepRetailer"."retailerId" = "Retailer"."id"
                AND "SalesRepRetailer"."salesRepId" = ${userId}::INT
            )
          END
      AND (
        CASE
          WHEN ${search}::TEXT IS NOT NULL THEN
            LOWER("Retailer"."name") LIKE LOWER('%' || ${search}::TEXT || '%') OR
            LOWER("Retailer"."phone") LIKE LOWER('%' || ${search}::TEXT || '%')
          ELSE TRUE
        END
      )
      AND (
        CASE
          WHEN ${regionId}::INT IS NOT NULL THEN "Retailer"."regionId" = ${regionId}::INT
          ELSE TRUE
        END
      )
      AND (
        CASE
          WHEN ${areaId}::INT IS NOT NULL THEN "Retailer"."areaId" = ${areaId}::INT
          ELSE TRUE
        END
      )
      AND (
        CASE
          WHEN ${distributorId}::INT IS NOT NULL THEN "Retailer"."distributorId" = ${distributorId}::INT
          ELSE TRUE
        END
      )
      AND (
        CASE
          WHEN ${territoryId}::INT IS NOT NULL THEN "Retailer"."territoryId" = ${territoryId}::INT
          ELSE TRUE
        END
      )
    ORDER BY
      CASE WHEN ${sortName} = 'asc' THEN "Retailer"."name" END,
      CASE WHEN ${sortName} = 'desc' THEN "Retailer"."name" END DESC,
      CASE WHEN ${sortUpdatedAt} = 'asc' THEN "Retailer"."updatedAt" END,
      CASE WHEN ${sortUpdatedAt} = 'desc' THEN "Retailer"."updatedAt" END DESC,
      CASE WHEN ${sortCreatedAt} = 'asc' THEN "Retailer"."createdAt" END,
      CASE WHEN ${sortCreatedAt} = 'desc' THEN "Retailer"."createdAt" END DESC
    OFFSET ${offset} LIMIT ${limit};
  `;
}
