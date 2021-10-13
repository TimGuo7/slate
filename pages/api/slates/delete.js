import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as ViewerManager from "~/node_common/managers/viewer";
import * as SearchManager from "~/node_common/managers/search";
import * as RequestUtilities from "~/node_common/request-utilities";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationInternal(req, res);
  if (!userInfo) return;
  const { id, user } = userInfo;

  const slate = await Data.getSlateById({ id: req.body.data.id, includeFiles: true });

  if (!slate) {
    return res.status(404).send({ decorator: "SERVER_DELETE_SLATE_SLATE_NOT_FOUND", error: true });
  }

  if (slate.error) {
    return res.status(500).send({ decorator: "SERVER_DELETE_SLATE_SLATE_NOT_FOUND", error: true });
  }

  if (slate.ownerId !== id) {
    return res.status(400).send({ decorator: "SERVER_DELETE_SLATE_NOT_ALLOWED", error: true });
  }

  const deleteResponse = await Data.deleteSlateById({ id: slate.id });

  if (!deleteResponse) {
    return res.status(404).send({ decorator: "SERVER_DELETE_SLATE_FAILED", error: true });
  }

  if (deleteResponse.error) {
    return res.status(500).send({ decorator: "SERVER_DELETE_SLATE_FAILED", error: true });
  }

  ViewerManager.hydratePartial(id, { slates: true });

  SearchManager.updateSlate(slate, "REMOVE");

  if (slate.isPublic) {
    Utilities.removeFromPublicCollectionUpdatePrivacy({ files: slate.objects });
  }

  return res.status(200).send({ decorator: "SERVER_DELETE_SLATE", error: false });
};
