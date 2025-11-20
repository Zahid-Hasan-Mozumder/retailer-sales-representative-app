import { Prisma } from '../../../../generated/prisma/client';

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
    FROM "retailers"
    WHERE CASE
            WHEN ${role} = 'admin' THEN TRUE
            ELSE EXISTS (
              SELECT 1 FROM "sales_rep_retailers" sr
              WHERE sr."retailer_id" = "retailers"."id"
                AND sr."sales_rep_id" = ${userId}::INT
            )
          END
      AND (
        CASE
          WHEN ${search}::TEXT IS NOT NULL THEN
            LOWER("retailers"."name") LIKE LOWER('%' || ${search}::TEXT || '%') OR
            LOWER("retailers"."phone") LIKE LOWER('%' || ${search}::TEXT || '%')
          ELSE TRUE
        END
      )
      AND (
        CASE
          WHEN ${regionId}::INT IS NOT NULL THEN "retailers"."region_id" = ${regionId}::INT
          ELSE TRUE
        END
      )
      AND (
        CASE
          WHEN ${areaId}::INT IS NOT NULL THEN "retailers"."area_id" = ${areaId}::INT
          ELSE TRUE
        END
      )
      AND (
        CASE
          WHEN ${distributorId}::INT IS NOT NULL THEN "retailers"."distributor_id" = ${distributorId}::INT
          ELSE TRUE
        END
      )
      AND (
        CASE
          WHEN ${territoryId}::INT IS NOT NULL THEN "retailers"."territory_id" = ${territoryId}::INT
          ELSE TRUE
        END
      );
  `;
}
