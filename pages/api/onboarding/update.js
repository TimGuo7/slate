import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as ViewerManager from "~/node_common/managers/viewer";
import * as RequestUtilities from "~/node_common/request-utilities";
import * as Environment from "~/node_common/environment";

export default async (req, res) => {
  if (!Strings.isEmpty(Environment.ALLOWED_HOST) && req.headers.host !== Environment.ALLOWED_HOST) {
    return res.status(403).send({ decorator: "SERVER_UPDATE_ONBOARDING_NOT_ALLOWED", error: true });
  }

  const { upload, tags } = req?.body?.data;

  const userInfo = await RequestUtilities.checkAuthorizationInternal(req, res);
  if (!userInfo) {
    return;
  }
  const { id } = userInfo;

  const onboarding = await Data.getOnboardingByUserId({ userId: id });

  if (!onboarding) {
    return res.status(404).send({ decorator: "SERVER_UPDATE_ONBOARDING_FAILED", error: true });
  }

  if (onboarding.error) {
    return res.status(500).send({ decorator: "SERVER_UPDATE_ONBOARDING_FAILED", error: true });
  }

  const updatednboarding = await Data.updateOnboardingByUserId({
    id: onboarding.id,
    upload,
    tags,
  });

  if (!updatednboarding) {
    return res.status(404).send({ decorator: "SERVER_UPDATE_ONBOARDING_FAILED", error: true });
  }

  if (updatednboarding.error) {
    return res.status(500).send({ decorator: "SERVER_UPDATE_ONBOARDING_FAILED", error: true });
  }

  await ViewerManager.hydratePartial(id, { onboarding: true });

  return res.status(200).send({ decorator: "SERVER_UPDATE_ONBOARDING_SUCCESS" });
};
