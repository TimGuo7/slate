import * as React from "react";
import { useIsomorphicLayoutEffect } from "~/common/hooks";
import * as FilterUtilities from "~/common/filter-utilities";

const UploadContext = React.createContext({});
export const useFilterContext = () => React.useContext(UploadContext);

export const Provider = ({ children, viewer }) => {
  const [isSidebarVisible, toggleSidebar] = useFilterSidebar();

  const [isPopupVisible, { hidePopup, togglePopup }] = useFilterPopup();

  const [filterState, { setFilterType }] = useFilter({
    viewer: viewer,
  });

  const contextValue = React.useMemo(
    () => [
      {
        sidebarState: { isVisible: isSidebarVisible },
        popupState: { isVisible: isPopupVisible },
        filterState,
      },
      { toggleSidebar, setFilterType, hidePopup, togglePopup },
    ],
    [isSidebarVisible, isPopupVisible, filterState]
  );

  return <UploadContext.Provider value={contextValue}>{children}</UploadContext.Provider>;
};

const useFilterSidebar = () => {
  const [isSidebarVisible, setSidebarState] = React.useState(false);
  const toggleSidebar = () => setSidebarState((prev) => !prev);
  return [isSidebarVisible, toggleSidebar];
};

const useFilterPopup = () => {
  const [isPopupVisible, setPopupVisibility] = React.useState(false);

  const hidePopup = () => setPopupVisibility(false);
  const togglePopup = () => setPopupVisibility((prev) => !prev);
  return [isPopupVisible, { hidePopup, togglePopup }];
};

const useFilter = ({ viewer }) => {
  const DEFAULT_STATE = {
    view: FilterUtilities.VIEWS_IDS.initial,
    type: FilterUtilities.TYPES_IDS.initial.library,
    title: "Library",
    // NOTE(amine): some filters may require additional information to work (ex: tags needs `id` to be able to get objects)
    context: {},
    objects: viewer.library,
    search: {
      objects: [],
      tags: [],
      startDate: null,
      endDate: null,
    },
  };
  const [filterState, setFilterState] = React.useState(DEFAULT_STATE);

  const setFilterType = ({ view, type, title, context }) =>
    setFilterState((prev) => ({ ...prev, view, type, title, context }));

  const setFilterObjects = (objects) => setFilterState((prev) => ({ ...prev, objects }));
  useIsomorphicLayoutEffect(() => {
    if (filterState.type === FilterUtilities.TYPES_IDS.initial.library) {
      setFilterObjects(viewer.library);
      return;
    }

    if (filterState.type === FilterUtilities.TYPES_IDS.initial.tags) {
      const { slateId } = filterState.context;
      setFilterObjects(viewer.slates.find((slate) => slate.id === slateId)?.objects || []);
      return;
    }
  }, [filterState.type, filterState.context, filterState.view, viewer]);

  return [filterState, { setFilterType, setFilterObjects }];
};
