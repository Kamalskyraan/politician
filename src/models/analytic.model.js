import { executeQuery } from "../utils/helper.js";

const tableMap = {
  appointment: {
    table: "appointments",
    statusColumn: "status",
    statuses: ["pending", "upcoming", "completed", "cancelled"],
  },
  meeting: {
    table: "meeting",
    statusColumn: "status",
    statuses: ["pending", "upcoming", "completed", "cancelled"],
  },
  task: {
    table: "tasks",
    statusColumn: "t_status",
    statuses: ["pending", "inprogress", "completed", "cancelled"],
  },
  summit: {
    table: "political_sumit",
    statusColumn: "status",
    statuses: ["upcoming", "inprogress", "completed", "cancelled"],
  },
};
//
export class analyticsModel {
  async fetchAnalytics({ user_id, type, c_status, page = 1, limit = 10 }) {
    const config = tableMap[type];

    if (!config) {
      throw new Error("Invalid analytics type");
    }

    const offset = (Number(page) - 1) * Number(limit);

    let where = `WHERE t.user_id = ?`;
    const params = [user_id];

    if (config.statusColumn && c_status) {
      where += ` AND t.${config.statusColumn} = ?`;
      params.push(c_status);
    }

    let query = "";

    if (type === "summit") {
      query = `
        SELECT
          t.*,
          COUNT(p.id) AS people_count
        FROM political_sumit t
        LEFT JOIN political_sumit_peoples p
          ON p.sumit_id = t.id
        ${where}
        GROUP BY t.id
        ORDER BY t.created_at DESC
        LIMIT ? OFFSET ?
      `;
    } else if (type === "task") {
      query = `
        SELECT
          t.*,
          (
            SELECT COUNT(*)
            FROM members m
            WHERE FIND_IN_SET(m.id, t.attnds_id)
          ) AS people_count
        FROM tasks t
        ${where}
        ORDER BY t.created_at DESC
        LIMIT ? OFFSET ?
      `;
    } else {
      query = `
        SELECT
          t.*
        FROM ${config.table} t
        ${where}
        ORDER BY t.created_at DESC
        LIMIT ? OFFSET ?
      `;
    }

    const totalQuery = `
      SELECT COUNT(*) AS total
      FROM ${config.table} t
      ${where}
    `;

    try {
      const totalResult = await executeQuery(totalQuery, params);
      const total = totalResult?.data?.[0]?.total || 0;

      const listResult = await executeQuery(query, [
        ...params,
        Number(limit),
        Number(offset),
      ]);

      // Ensure listResult.data is always an array
      const listData = Array.isArray(listResult?.data) ? listResult.data : [];

      if (type === "task") {
        for (const task of listData) {
          if (task.attnds_id) {
            const members = await executeQuery(
              `SELECT id, name
               FROM members
               WHERE FIND_IN_SET(id, ?)`,
              [task.attnds_id],
            );

            task.members = Array.isArray(members?.data) ? members.data : [];
            task.people_count = task.members.length;
          } else {
            task.members = [];
            task.people_count = 0;
          }
        }
      } else if (type === "summit") {
        for (const summit of listData) {
          const people = await executeQuery(
            `
            SELECT
              p.id,
              p.name,
              p.type
            FROM political_sumit_peoples p
            WHERE p.sumit_id = ?
            `,
            [summit.id],
          );

          summit.people = Array.isArray(people?.data) ? people.data : [];
          summit.people_count = summit.people.length;
        }
      }

      return {
        list: listData,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error in fetchAnalytics:", error);
      // Return empty data on error
      return {
        list: [],
        pagination: {
          total: 0,
          page: Number(page),
          limit: Number(limit),
          totalPages: 0,
        },
      };
    }
  }

  async fetchAnalticCount({ user_id, type }) {
    const config = tableMap[type];

    if (!config) {
      throw new Error("Invalid analytics type");
    }

    try {
      // Summit doesn't have status
      if (!config.statusColumn) {
        const result = await executeQuery(
          `
          SELECT COUNT(*) AS count
          FROM ${config.table}
          WHERE user_id = ?
          `,
          [user_id],
        );

        return {
          success: 1,
          data: [
            {
              count: result?.data?.[0]?.count || 0,
            },
          ],
        };
      }

      const result = await executeQuery(
        `
        SELECT
          ${config.statusColumn} AS status,
          COUNT(*) AS count
        FROM ${config.table}
        WHERE user_id = ?
        GROUP BY ${config.statusColumn}
        `,
        [user_id],
      );

      const dbData = Array.isArray(result?.data) ? result.data : [];

      const counts = config.statuses.map((status) => {
        const row = dbData.find((item) => item.status === status);

        return {
          status,
          count: row ? Number(row.count) : 0,
        };
      });

      return {
        success: 1,
        data: counts,
      };
    } catch (error) {
      console.error("Error in fetchAnalticCount:", error);
      return {
        success: 0,
        data: [],
      };
    }
  }
}
