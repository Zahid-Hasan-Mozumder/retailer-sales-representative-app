import { Prisma } from '../../../../generated/prisma/client';

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
    SELECT "retailers"."id",
           "retailers"."uid",
           "retailers"."name",
           "retailers"."phone",
           "retailers"."region_id"     AS "regionId",
           "retailers"."area_id"       AS "areaId",
           "retailers"."distributor_id" AS "distributorId",
           "retailers"."territory_id"  AS "territoryId",
           "retailers"."routes",
           "retailers"."created_at"    AS "createdAt",
           "retailers"."updated_at"    AS "updatedAt"
    FROM "retailers"
    WHERE CASE
            WHEN ${role} = 'admin' THEN TRUE
            ELSE EXISTS (
              SELECT 1
              FROM "sales_rep_retailers" sr
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
      )
    ORDER BY
      CASE WHEN ${sortName} = 'asc' THEN "retailers"."name" END,
      CASE WHEN ${sortName} = 'desc' THEN "retailers"."name" END DESC,
      CASE WHEN ${sortUpdatedAt} = 'asc' THEN "retailers"."updated_at" END,
      CASE WHEN ${sortUpdatedAt} = 'desc' THEN "retailers"."updated_at" END DESC,
      CASE WHEN ${sortCreatedAt} = 'asc' THEN "retailers"."created_at" END,
      CASE WHEN ${sortCreatedAt} = 'desc' THEN "retailers"."created_at" END DESC
    OFFSET ${offset} LIMIT ${limit};
  `;
}
