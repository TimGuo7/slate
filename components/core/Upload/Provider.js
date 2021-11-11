import * as React from "react";
import * as UploadUtilities from "~/common/upload-utilities";
import * as FileUtilities from "~/common/file-utilities";
import * as Logging from "~/common/logging";

import { useEventListener } from "~/common/hooks";
import { useUploadOnboardingContext } from "~/components/core/Onboarding/Upload";

const UploadContext = React.createContext();
export const useUploadContext = () => React.useContext(UploadContext);

export const Provider = ({ children, page, data, viewer }) => {
  const [uploadState, uploadHandlers] = useUpload({});

  const [isUploadJumperVisible, { showUploadJumper, hideUploadJumper }] = useUploadJumper();

  useUploadOnDrop({ upload: uploadHandlers.upload, page, data, viewer });

  useUploadFromClipboard({
    upload: uploadHandlers.upload,
    uploadLink: uploadHandlers.uploadLink,
    page,
    data,
    viewer,
  });

  useEventListener({ type: "open-upload-jumper", handler: showUploadJumper });

  const providerValue = React.useMemo(
    () => [
      { ...uploadState, isUploadJumperVisible },
      {
        ...uploadHandlers,
        showUploadJumper,
        hideUploadJumper,
      },
    ],
    [uploadHandlers, uploadState, isUploadJumperVisible]
  );

  return <UploadContext.Provider value={providerValue}>{children}</UploadContext.Provider>;
};

const useUploadJumper = () => {
  const [isUploadJumperVisible, setUploadJumperState] = React.useState(false);
  const showUploadJumper = () => setUploadJumperState(true);
  const hideUploadJumper = () => setUploadJumperState(false);
  return [isUploadJumperVisible, { showUploadJumper, hideUploadJumper }];
};

const useUpload = () => {
  const DEFAULT_STATE = {
    fileLoading: {},
    isUploading: false,
    totalBytesUploaded: 0,
    totalBytes: 0,
    totalFilesUploaded: 0,
    totalFiles: 0,
    isFinished: false,
  };

  const [uploadState, setUploadState] = React.useState(DEFAULT_STATE);

  const uploadProvider = React.useMemo(() => {
    const handleStartUploading = () => {
      setUploadState((prev) => ({ ...prev, isFinished: false, isUploading: true }));
    };

    const handleFinishUploading = () => {
      setUploadState((prev) => ({
        ...DEFAULT_STATE,
        fileLoading: prev.fileLoading,
        isFinished: true,
      }));
    };

    const handleAddToQueue = (file) => {
      const fileKey = UploadUtilities.getFileKey(file);
      setUploadState((prev) => ({
        ...prev,
        fileLoading: {
          ...prev.fileLoading,
          [fileKey]: {
            id: fileKey,
            status: "saving",
            name: file.name,
            type: file.type,
            createdAt: Date.now(),
            loaded: 0,
            total: file.size,
            blob: file,
          },
        },
        isFinished: false,
        totalFiles: prev.totalFiles + 1,
        totalBytes: prev.totalBytes + file.size,
      }));
    };

    const handleSuccess = ({ fileKey, cid }) => {
      setUploadState((prev) => {
        const newFileLoading = { ...prev.fileLoading };
        newFileLoading[fileKey].status = "saved";
        newFileLoading[fileKey].cid = cid;
        return {
          ...prev,
          fileLoading: newFileLoading,
          totalFilesUploaded: prev.totalFilesUploaded + 1,
        };
      });
    };

    const handleDuplicate = ({ fileKey, cid }) => {
      setUploadState((prev) => {
        const newFileLoading = { ...prev.fileLoading };
        newFileLoading[fileKey].status = "duplicate";
        newFileLoading[fileKey].cid = cid;
        return {
          ...prev,
          fileLoading: newFileLoading,
          totalFilesUploaded: prev.totalFilesUploaded + 1,
        };
      });
    };

    const handleProgress = ({ fileKey, loaded }) => {
      setUploadState((prev) => {
        const newFileLoading = { ...prev.fileLoading };
        const bytesLoaded = loaded - newFileLoading[fileKey].loaded;
        newFileLoading[fileKey].loaded = loaded;
        return {
          ...prev,
          fileLoading: newFileLoading,
          totalBytesUploaded: prev.totalBytesUploaded + bytesLoaded,
        };
      });
    };

    const handleError = ({ fileKey }) => {
      setUploadState((prev) => {
        const newFileLoading = { ...prev.fileLoading };
        newFileLoading[fileKey].status = "failed";
        return {
          ...prev,
          fileLoading: newFileLoading,
          totalFiles: prev.totalFiles - 1,
          totalBytes: prev.totalBytes - newFileLoading[fileKey].total,
          totalBytesUploaded: prev.totalBytesUploaded - newFileLoading[fileKey].total,
        };
      });
    };

    const handleCancelUploading = ({ fileKeys }) => {
      setUploadState((prev) => {
        const newFileLoading = { ...prev.fileLoading };
        const newTotalFiles = prev.totalFiles - fileKeys.length;
        let newTotalBytes = prev.totalBytes;
        let newTotalBytesUploaded = prev.totalBytesUploaded;

        fileKeys.forEach((fileKey) => {
          newTotalBytes -= newFileLoading[fileKey].total;
          newTotalBytesUploaded -= newFileLoading[fileKey].loaded;
          delete newFileLoading[fileKey];
        });

        return {
          ...prev,
          fileLoading: newFileLoading,
          totalFiles: newTotalFiles,
          totalBytes: newTotalBytes,
          totalBytesUploaded: newTotalBytesUploaded,
        };
      });
    };

    return UploadUtilities.createUploadProvider({
      onStart: handleStartUploading,
      onFinish: handleFinishUploading,
      onAddedToQueue: handleAddToQueue,
      onSuccess: handleSuccess,
      onDuplicate: handleDuplicate,
      onProgress: handleProgress,
      onCancel: handleCancelUploading,
      onError: handleError,
    });
  }, []);

  const resetUploadState = () => (uploadProvider.clearUploadCache(), setUploadState(DEFAULT_STATE));

  return [
    uploadState,
    {
      upload: uploadProvider.upload,
      uploadLink: uploadProvider.uploadLink,
      retry: uploadProvider.retry,
      retryAll: uploadProvider.retryAll,
      cancel: uploadProvider.cancel,
      cancelAll: uploadProvider.cancelAll,
      resetUploadState,
    },
  ];
};

const useUploadOnDrop = ({ upload, page, data, viewer }) => {
  const onboardingContext = useUploadOnboardingContext();

  const handleDragEnter = (e) => e.preventDefault();
  const handleDragLeave = (e) => e.preventDefault();
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = async (e) => {
    e.preventDefault();

    const { files, error } = await FileUtilities.formatDroppedFiles({
      dataTransfer: e.dataTransfer,
    });

    if (error) {
      return null;
    }

    let slate = null;
    if (page?.id === "NAV_SLATE" && data?.ownerId === viewer?.id) {
      slate = data;
    }

    // NOTE(amine): finish the upload onboarding only if we're at the jumper walkthrough
    if (onboardingContext.currentStep === onboardingContext.steps.jumperWalkthrough)
      onboardingContext.goToNextStep();
    upload({ files, slate });
  };

  useEventListener({ type: "dragenter", handler: handleDragEnter }, []);
  useEventListener({ type: "dragleave", handler: handleDragLeave }, []);
  useEventListener({ type: "dragover", handler: handleDragOver }, []);
  useEventListener({ type: "drop", handler: handleDrop }, [onboardingContext]);
};

const useUploadFromClipboard = ({ upload, uploadLink, page, data, viewer }) => {
  const onboardingContext = useUploadOnboardingContext();

  const handlePaste = (e) => {
    //NOTE(amine): skip when pasting into an input/textarea or an element with contentEditable set to true
    const eventTargetTag = document?.activeElement.tagName.toLowerCase();
    const isEventTargetEditable = !!document?.activeElement.getAttribute("contentEditable");
    if (eventTargetTag === "input" || eventTargetTag === "textarea" || isEventTargetEditable) {
      return;
    }

    let slate = null;
    if (page?.id === "NAV_SLATE" && data?.ownerId === viewer?.id) {
      slate = data;
    }

    const link = e.clipboardData?.getData("text");
    try {
      new URL(link);
      uploadLink({ url: link, slate });
    } catch (e) {
      Logging.error(e);
    }

    const clipboardItems = e.clipboardData?.items || [];
    if (!clipboardItems) return;
    const { files } = FileUtilities.formatPastedImages({
      clipboardItems,
    });

    if (onboardingContext.currentStep === onboardingContext.steps.jumperWalkthrough)
      onboardingContext.goToNextStep();
    upload({ files, slate });
  };

  useEventListener({ type: "paste", handler: handlePaste }, [onboardingContext]);
};
