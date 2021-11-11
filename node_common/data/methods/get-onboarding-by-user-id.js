import { runQuery } from "~/node_common/data/utilities";

export default async ({ userId }) => {
  return await runQuery({
    label: "GET_ONBOARDING_BY_USER_ID",
    queryFn: async (DB) => {
      let query = await DB.select("*").from("onboarding").where({ userId });

      if (!query || query.error) {
        return null;
      }
      if (Array.isArray(query)) {
        query = query.pop();
      }

      return JSON.parse(JSON.stringify(query));
    },
    errorFn: async () => {
      return {
        error: true,
        decorator: "GET_ONBOARDING_BY_USER_ID",
      };
    },
  });
};
