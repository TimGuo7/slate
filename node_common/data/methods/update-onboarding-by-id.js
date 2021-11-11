import { runQuery } from "~/node_common/data/utilities";

export default async ({ id, upload, tags }) => {
  return await runQuery({
    label: "UPDATE_ONBOARDING_BY_ID",
    queryFn: async (DB) => {
      const response = await DB.from("onboarding")
        .where("id", id)
        .update({ upload, tags })
        .returning("*");

      const index = response ? response.pop() : null;
      return JSON.parse(JSON.stringify(index));
    },
    errorFn: async (e) => {
      return {
        error: true,
        decorator: "UPDATE_ONBOARDING_BY_ID",
      };
    },
  });
};
