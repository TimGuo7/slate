import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as Validations from "~/common/validations";
import * as ViewerManager from "~/node_common/managers/viewer";
import * as SearchManager from "~/node_common/managers/search";
import * as RequestUtilities from "~/node_common/request-utilities";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationInternal(req, res);
  if (!userInfo) return;
  const { id, user } = userInfo;

  if (!req.body.data) {
    return res.status(500).send({
      decorator: "SERVER_UPDATE_SLATE_MUST_PROVIDE_DATA",
      error: true,
    });
  }

  let updates = req.body.data;

  const slate = await Data.getSlateById({ id: updates.id, includeFiles: true });

  if (!slate) {
    return res.status(404).send({ decorator: "SERVER_UPDATE_SLATE_NOT_FOUND", error: true });
  }

  if (slate.error) {
    return res.status(500).send({ decorator: "SERVER_UPDATE_SLATE_NOT_FOUND", error: true });
  }

  if (slate.ownerId !== id) {
    return res.status(403).send({ decorator: "SERVER_UPDATE_SLATE_NOT_ALLOWED", error: true });
  }

  if (typeof updates.isPublic !== "undefined" && slate.isPublic !== updates.isPublic) {
    let privacyResponse = await Data.updateSlatePrivacy({
      ownerId: id,
      id: slate.id,
      isPublic: updates.isPublic,
    });

    if (!privacyResponse) {
      return res
        .status(404)
        .send({ decorator: "SERVER_UPDATE_SLATE_UPDATE_PRIVACY_FAILED", error: true });
    }

    if (privacyResponse.error) {
      return res
        .status(500)
        .send({ decorator: "SERVER_UPDATE_SLATE_UPDATE_PRIVACY_FAILED", error: true });
    }
  }

  if (updates.data.name && updates.data.name !== slate.data.name) {
    if (!Validations.slatename(slate.data.name)) {
      return res.status(400).send({
        decorator: "SERVER_UPDATE_SLATE_INVALID_NAME",
        error: true,
      });
    }

    const existingSlate = await Data.getSlateByName({
      slatename: updates.data.name,
      ownerId: user.id,
    });

    if (existingSlate) {
      return res.status(500).send({
        decorator: "SERVER_UPDATE_SLATE_NAME_TAKEN",
        error: true,
      });
    } else {
      updates.slatename = Strings.createSlug(updates.data.name);
    }
  }

  updates.updatedAt = new Date();

  let response = await Data.updateSlateById(updates);

  if (!response) {
    return res.status(404).send({ decorator: "SERVER_UPDATE_SLATE_FAILED", error: true });
  }

  if (response.error) {
    return res.status(500).send({ decorator: "SERVER_UPDATE_SLATE_FAILED", error: true });
  }

  ViewerManager.hydratePartial(id, { slates: true });

  if (slate.isPublic && !updates.isPublic) {
    SearchManager.updateSlate(response, "REMOVE");

    Utilities.removeFromPublicCollectionUpdatePrivacy({ files: slate.objects });
  } else if (!slate.isPublic && updates.isPublic) {
    SearchManager.updateSlate(response, "ADD");

    Utilities.addToPublicCollectionUpdatePrivacy({ files: slate.objects });
  } else {
    SearchManager.updateSlate(response, "EDIT");
  }

  return res.status(200).send({ decorator: "SERVER_UPDATE_SLATE", slate: response });
};
