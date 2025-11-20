import { Prisma } from '@prisma/client';

export function countRetailersQuery(
  role: string,
  userId: string | undefined,
  search: string | undefined,
  regionId: number | undefined,
  areaId: number | undefined,
  distributorId: number | undefined,
  territoryId: number | undefined,
): Prisma.Sql {
  return Prisma.sql`
    SELECT COUNT(*)::bigint AS count
    FROM "Retailer"
    WHERE CASE
            WHEN ${role} = 'ADMIN' THEN TRUE
            ELSE "Retailer"."salesRepId" = ${userId}::INT
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
      );
  `;
}