import * as React from "react";
import * as SVG from "~/common/svg";
import * as Styles from "~/common/styles";
import * as Typography from "~/components/system/components/Typography";
import * as FilterUtilities from "~/common/filter-utilities";

import { css } from "@emotion/react";
import { useFilterContext } from "~/components/core/Filter/Provider";

/* -------------------------------------------------------------------------------------------------
 *  Shared components between filters
 * -----------------------------------------------------------------------------------------------*/

const STYLES_FILTER_BUTTON_HIGHLIGHTED = (theme) => css`
  background-color: ${theme.semantic.textGrayLight};
`;

const STYLES_FILTER_BUTTON = (theme) => css`
  display: flex;
  align-items: center;
  width: 100%;
  ${Styles.BUTTON_RESET};
  padding: 5px 8px 3px;
  border-radius: 8px;
  color: ${theme.semantic.textBlack};
  &:hover {
    background-color: ${theme.semantic.textGrayLight};
    color: ${theme.semantic.textBlack};
  }

  &:disabled {
    color: ${theme.semantic.textGray};
    pointer-events: none;
    cursor: not-allowed;
  }
`;

const STYLES_FILTERS_GROUP = css`
  & > * + * {
    margin-top: 4px !important;
  }
  li {
    list-style: none;
  }
`;

const FilterButton = ({ children, Icon, isSelected, ...props }) => (
  <li>
    <Typography.P2
      as="button"
      css={[STYLES_FILTER_BUTTON, isSelected && STYLES_FILTER_BUTTON_HIGHLIGHTED]}
      {...props}
    >
      <Icon height={16} width={16} />
      <span style={{ marginLeft: 6 }}>{children}</span>
    </Typography.P2>
  </li>
);

const FilterSection = ({ title, children, ...props }) => (
  <div {...props}>
    {title && (
      <Typography.H6 style={{ paddingLeft: 8, marginBottom: 4 }} color="textGray">
        {title}
      </Typography.H6>
    )}
    <ul css={STYLES_FILTERS_GROUP}>{children}</ul>
  </div>
);

/* -------------------------------------------------------------------------------------------------
 *  InitialFilters
 * -----------------------------------------------------------------------------------------------*/

function Library() {
  const [{ filterState }, { setFilterType, hidePopup }] = useFilterContext();
  const currentFilterType = filterState.type;

  const libraryFilterType = FilterUtilities.TYPES_IDS.initial.library;

  return (
    <>
      <FilterSection>
        <FilterButton
          Icon={SVG.Clock}
          isSelected={currentFilterType === libraryFilterType}
          onClick={() => {
            setFilterType({
              view: FilterUtilities.VIEWS_IDS.initial,
              type: libraryFilterType,
              title: "Library",
            });
            hidePopup();
          }}
        >
          My Library
        </FilterButton>
      </FilterSection>
    </>
  );
}

function Tags({ viewer, ...props }) {
  const [{ filterState }, { setFilterType, hidePopup }] = useFilterContext();
  const currentFilterType = filterState.type;

  const tagFilterType = FilterUtilities.TYPES_IDS.initial.tags;

  const checkIsTagSelected = (slateId) =>
    currentFilterType === tagFilterType && filterState?.context?.slateId === slateId;

  const setSelectedTag = (slate) =>
    setFilterType({
      view: FilterUtilities.VIEWS_IDS.initial,
      type: tagFilterType,
      title: "#" + slate.slatename,
      context: { slateId: slate.id },
    });

  return (
    <FilterSection title="Tags" {...props}>
      {viewer.slates.map((slate) => (
        <FilterButton
          Icon={slate.isPublic ? SVG.Hash : SVG.SecurityLock}
          key={slate.id}
          isSelected={checkIsTagSelected(slate.id)}
          onClick={() => (setSelectedTag(slate), hidePopup())}
        >
          {slate.slatename}
        </FilterButton>
      ))}
    </FilterSection>
  );
}

export { Library, Tags };
