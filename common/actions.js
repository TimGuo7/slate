import "isomorphic-fetch";

import * as Logging from "~/common/logging";
import * as Events from "~/common/custom-events";
import * as Websockets from "~/common/browser-websockets";
import * as Strings from "~/common/strings";
import * as Credentials from "~/common/credentials";
import * as Environment from "~/common/environment";

//NOTE(martina): call Websockets.checkWebsocket() before any api call that uses websockets to return updates
//  to make sure that websockets are properly connected (and to reconnect them if they are not)
//  otherwise updates may not occur properly

//NOTE(martina): if the server is the slate backend, you should set credentials: "include". If it is cross origin (aka a call to shovel or lens), you will not be able to use credentials
// Instead, if a cross origin server requires authorization, pass an API key with Authorization: getCookie(Credentials.session.key)
const getCookie = (name) => {
  var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
};

const REQUEST_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

//NOTE(martina): used for calls to the server
const DEFAULT_OPTIONS = {
  method: "POST",
  headers: REQUEST_HEADERS,
  credentials: "include",
};

//NOTE(martina): used for calls to other servers (where sending credentials isn't allowed b/c it's cross origin) which also don't require API keys
const CORS_OPTIONS = {
  method: "POST",
  headers: REQUEST_HEADERS,
  credentials: "omit",
};

const returnJSON = async (route, options) => {
  try {
    const response = await fetch(route, options);
    const json = await response.json();

    return json;
  } catch (e) {
    if (e.name === "AbortError") return { aborted: true };
    Logging.error(e);
  }
};

export const createZipToken = async (files) => {
  return await returnJSON(`${Environment.URI_SHOVEL}/api/download/create-zip-token`, {
    ...CORS_OPTIONS,
    body: JSON.stringify({ files }),
  });
};

export const downloadZip = ({ token, name }) =>
  `${Environment.URI_SHOVEL}/api/download/download-by-token?downloadId=${token}&name=${name}`;

export const health = async (data = {}) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/_`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data: { buckets: data.buckets } }),
  });
};

export const sendFilecoin = async (data) => {
  if (Strings.isEmpty(data.source)) {
    return null;
  }

  if (Strings.isEmpty(data.target)) {
    return null;
  }

  if (!data.amount) {
    return null;
  }
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/addresses/send`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

// export const mql = async (url) => {
//   try {
//     const res = await microlink(url, { screenshot: true });
//     return res;
//   } catch (e) {
//     console.log(e);
//     if (e.description) {
//       Events.dispatchMessage({ message: e.description });
//     }
//   }
// };

export const search = async (data) => {
  return await returnJSON(`/api/search/search`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const checkUsername = async (data) => {
  return await returnJSON(`/api/users/check-username`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const checkEmail = async (data) => {
  return await returnJSON(`/api/users/check-email`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

//NOTE(toast): this functionality comes with the upgraded sg plan
// export const validateEmail = async (data) => {
//   return await returnJSON("/api/emails/validate", {
//     ...DEFAULT_OPTIONS,
//     body: JSON.stringify({ data }),
//   });
// };

export const sendEmail = async (data) => {
  return await returnJSON("/api/emails/send-email", {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const sendTemplateEmail = async (data) => {
  return await returnJSON("/api/emails/send-template", {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const removeFromBucket = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/data/bucket-remove`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const getSlateById = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/slates/get`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const getSlatesByIds = async (data) => {
  return await returnJSON(`/api/slates/get`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const getSocial = async (data) => {
  return await returnJSON(`/api/users/get-social`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const deleteTrustRelationship = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/users/trust-delete`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const updateTrustRelationship = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/users/trust-update`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const createTrustRelationship = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/users/trust`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const createSubscription = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/subscribe`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

// export const search = async (data) => {
//   await Websockets.checkWebsocket();
//   if (Strings.isEmpty(data.query)) {
//     return { decorator: "NO_SERVER_TRIP", data: { results: [] } };
//   }

//   return await returnJSON(`${Environment.URI_LENS}/search`, {
//     ...CORS_OPTIONS,
//     body: JSON.stringify({ data }),
//   });
// };

export const createFile = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/data/create`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const createLink = async (data, options) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/data/create-link`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
    ...options,
  });
};

export const addFileToSlate = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/slates/add-file`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const requestTwitterToken = async () => {
  return await returnJSON(`/api/twitter/request-token`, {
    ...DEFAULT_OPTIONS,
  });
};

export const authenticateViaTwitter = async (data) => {
  return await returnJSON(`/api/twitter/authenticate`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const createUserViaTwitter = async (data) => {
  return await returnJSON(`/api/twitter/signup`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const createUserViaTwitterWithVerification = async (data) => {
  return await returnJSON(`/api/twitter/signup-with-verification`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const updateViewer = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/users/update`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const signIn = async (data) => {
  return await returnJSON(`/api/sign-in`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const hydrateAuthenticatedUser = async () => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/hydrate`, {
    ...DEFAULT_OPTIONS,
  });
};

export const deleteViewer = async () => {
  return await returnJSON(`/api/users/delete`, {
    ...DEFAULT_OPTIONS,
  });
};

export const createUser = async (data) => {
  return await returnJSON(`/api/users/create`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const updateStatus = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/users/status-update`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

// export const checkCIDStatus = async (data) => {
//   return await returnJSON(`/api/data/cid-status`, {
//     ...DEFAULT_OPTIONS,
//     body: JSON.stringify({ data }),
//   });
// };

export const createSlate = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/slates/create`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const updateSlate = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/slates/update`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const deleteSlate = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/slates/delete`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const removeFileFromSlate = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/slates/remove-file`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const generateAPIKey = async () => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/keys/generate`, {
    ...DEFAULT_OPTIONS,
  });
};

export const deleteAPIKey = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/keys/delete`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const saveCopy = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/data/save-copy`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const updateFile = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/data/update`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const deleteFiles = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/data/delete`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const getSerializedSlate = async (data) => {
  return await returnJSON(`/api/slates/get-serialized`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const getSerializedProfile = async (data) => {
  return await returnJSON(`/api/users/get-serialized`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const createSupportMessage = async (data) => {
  return await returnJSON(`/api/support-message`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const createDownloadActivity = async (data) => {
  return await returnJSON(`/api/activity/create-download-activity`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const getActivity = async (data) => {
  return await returnJSON(`/api/activity/get-activity`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const getExplore = async (data) => {
  return await returnJSON(`/api/activity/get-explore`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const getZipFilePaths = async (data) => {
  return await returnJSON(`/api/zip/get-paths`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const cleanDatabase = async () => {
  return await returnJSON(`/api/clean-up/users`, {
    ...DEFAULT_OPTIONS,
  });
};

export const createTwitterEmailVerification = async (data) => {
  return await returnJSON(`/api/verifications/twitter/create`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const verifyTwitterEmail = async (data) => {
  return await returnJSON(`/api/verifications/twitter/verify`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const createPasswordResetVerification = async (data) => {
  return await returnJSON(`/api/verifications/password-reset/create`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const verifyPasswordResetEmail = async (data) => {
  return await returnJSON(`/api/verifications/password-reset/verify`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const resetPassword = async (data) => {
  return await returnJSON(`/api/users/reset-password`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const createLegacyVerification = async (data) => {
  return await returnJSON(`/api/verifications/legacy/create`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const migrateUser = async (data) => {
  return await returnJSON(`/api/users/migrate`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const createVerification = async (data) => {
  return await returnJSON(`/api/verifications/create`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const verifyEmail = async (data) => {
  return await returnJSON(`/api/verifications/verify`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const resendVerification = async (data) => {
  return await returnJSON(`/api/verifications/resend`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const getUserVersion = async (data) => {
  return await returnJSON(`/api/users/get-version`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const createOnboarding = async (data) => {
  return await returnJSON(`/api/onboarding/create`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const updateOnboarding = async (data) => {
  return await returnJSON(`/api/onboarding/update`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const linkTwitterAccount = async (data) => {
  return await returnJSON(`/api/twitter/link`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const linkTwitterAccountWithVerification = async (data) => {
  return await returnJSON(`/api/twitter/link-with-verification`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const resendPasswordResetVerification = async (data) => {
  return await returnJSON(`/api/verifications/password-reset/resend`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};
