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
    statusColumn: null,
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
          COUNT(psp.id) AS people_count
        FROM political_sumit t
        LEFT JOIN political_submit_people psp
          ON psp.submit_id = t.id
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

    const totalResult = await executeQuery(totalQuery, params);
    const total = totalResult?.data?.[0]?.total || 0;

    const listResult = await executeQuery(query, [
      ...params,
      Number(limit),
      Number(offset),
    ]);

    for (const task of listResult.data) {
      if (task.attnds_id) {
        const members = await executeQuery(
          `SELECT id, name
       FROM members
       WHERE FIND_IN_SET(id, ?)`,
          [task.attnds_id],
        );

        task.members = members.data;
        task.people_count = members.data.length;
      } else {
        task.members = [];
        task.people_count = 0;
      }
    }

    return {
      list: listResult?.data || [],
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async fetchAnalticCount({ user_id, type }) {
    const config = tableMap[type];

    if (!config) {
      throw new Error("Invalid analytics type");
    }

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
            status: "assigned",
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
  }
}
