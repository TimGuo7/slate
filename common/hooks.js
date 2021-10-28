import * as React from "react";
import * as Logging from "~/common/logging";
import * as Actions from "~/common/actions";
import * as Events from "~/common/custom-events";
import * as Constants from "~/common/constants";

export const useMounted = (callback, depedencies) => {
  const mountedRef = React.useRef(false);
  useIsomorphicLayoutEffect(() => {
    if (mountedRef.current && callback) {
      callback();
    }
    mountedRef.current = true;
  }, depedencies);
};
/** NOTE(amine):
 * useForm handles three main responsabilities
 *  - control inputs
 *  - control form
 *  - add validations
 *
 *  For validations
 *  - Validate each field when onBlur event is triggered
 *  - Validate all fields before submit
 *  - font submit if there is errors
 */

export const useForm = ({
  onSubmit,
  validate,
  initialValues,
  validateOnBlur = true,
  validateOnSubmit = true,
}) => {
  const [internal, setInternal] = React.useState({ isSubmitting: false, isValidating: false });
  const [state, setState] = React.useState({
    isSubmitting: false,
    values: initialValues,
    errors: {},
    touched: {},
  });

  const _hasError = (obj) => Object.keys(obj).some((name) => obj[name]);
  const _mergeEventHandlers =
    (events = []) =>
    (e) =>
      events.forEach((event) => {
        if (event) event(e);
      });

  /** ---------- NOTE(amine): Input Handlers ---------- */
  const handleFieldChange = (e) =>
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, [e.target.name]: e.target.value },
      errors: { ...prev.errors, [e.target.name]: undefined },
      touched: { ...prev.touched, [e.target.name]: false },
    }));

  const handleOnBlur = async (e) => {
    // NOTE(amine): validate the inputs onBlur and touch the current input
    let errors = {};
    if (validateOnBlur && validate) {
      try {
        setInternal((prev) => ({ ...prev, isValidating: true }));
        errors = await validate(state.values, {});
      } catch (e) {
        Logging.error(e);
      } finally {
        setInternal((prev) => ({ ...prev, isValidating: false }));
        setState((prev) => ({
          ...prev,
          touched: { ...prev.touched, [e.target.name]: validateOnBlur },
          errors,
        }));
      }
    }
  };

  // Note(Amine): this prop getter will capture the field state
  const getFieldProps = (name, { onChange, onBlur, error } = {}) => ({
    name: name,
    value: state.values[name],
    error: error || state.errors[name],
    touched: state.touched[name],
    onChange: _mergeEventHandlers([onChange, handleFieldChange]),
    onBlur: _mergeEventHandlers([onBlur, handleOnBlur]),
  });

  /** ---------- NOTE(amine): Form Handlers ----------  */

  const submitAsync = async () => {
    // NOTE(amine): Don't submit if the form is validating or already submitting
    if (internal.isSubmitting || internal.isValidating) return;

    //NOTE(amine): touch all inputs
    setState((prev) => {
      const touched = Object.keys(prev.values).reduce((acc, key) => ({ ...acc, [key]: true }), {});
      return { ...prev, touched };
    });

    // NOTE(amine): validate inputs
    if (validateOnSubmit && validate) {
      let errors = {};
      try {
        setInternal((prev) => ({ ...prev, isValidating: true }));
        errors = await validate(state.values, { ...state.errors });
        if (_hasError(errors)) return;
      } catch (e) {
        Logging.error(e);
      } finally {
        setInternal((prev) => ({ ...prev, isValidating: false }));
        setState((prev) => ({ ...prev, errors }));
      }
    }

    // NOTE(amine): submit the form
    if (!onSubmit) return;
    setInternal((prev) => ({ ...prev, isSubmitting: true }));
    try {
      await onSubmit(state.values);
    } catch (e) {
      Logging.error(e);
    } finally {
      setInternal((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleFormOnSubmit = (e) => {
    e.preventDefault();
    submitAsync()
      .then()
      .catch((e) => Logging.error(e));
  };

  // Note(Amine): this prop getter will overide the form onSubmit handler
  const getFormProps = () => ({
    onSubmit: handleFormOnSubmit,
  });

  return {
    getFieldProps,
    getFormProps,
    values: state.values,
    isSubmitting: internal.isSubmitting,
    isValidating: internal.isValidating,
  };
};

/** NOTE(amine): Since we can use on our design system an input onSubmit,
 *               useField is a special case of useForm
 */
export const useField = ({
  onSubmit,
  validate,
  initialValue,
  onChange,
  onBlur,
  validateOnBlur = true,
  validateOnSubmit = true,
}) => {
  const [state, setState] = React.useState({
    isSubmitting: false,
    value: initialValue,
    error: undefined,
    touched: undefined,
  });

  const _mergeEventHandlers =
    (events = []) =>
    (e) =>
      events.forEach((event) => {
        if (event) event(e);
      });

  const setFieldValue = (value) =>
    setState((prev) => ({
      ...prev,
      value,
      error: undefined,
      touched: false,
    }));

  /** ---------- NOTE(amine): Input Handlers ---------- */
  const handleFieldChange = (e) => setFieldValue(e.target.value);
  const handleOnBlur = () => {
    // NOTE(amine): validate the inputs onBlur and touch the current input
    let error = {};
    if (validateOnBlur && validate) error = validate(state.value);
    setState((prev) => ({ ...prev, touched: validateOnBlur, error }));
  };

  const handleFormOnSubmit = () => {
    //NOTE(amine): touch all inputs
    setState((prev) => ({ ...prev, touched: true }));

    // NOTE(amine): validate inputs
    if (validateOnSubmit && validate) {
      const error = validate(state.value);
      setState((prev) => ({ ...prev, error }));
      if (error) return;
    }

    // NOTE(amine): submit the form
    if (!onSubmit) return;
    setState((prev) => ({ ...prev, isSubmitting: true }));
    onSubmit(state.value)
      ?.then(() => {
        setState((prev) => ({ ...prev, isSubmitting: false }));
      })
      ?.catch(() => {
        setState((prev) => ({ ...prev, isSubmitting: false }));
      });
  };

  // Note(Amine): this prop getter will capture the field state
  const getFieldProps = (name) => ({
    name: name,
    value: state.value,
    error: state.error,
    touched: state.touched,
    onChange: _mergeEventHandlers([onChange, handleFieldChange]),
    onBlur: _mergeEventHandlers([onBlur, handleOnBlur]),
    onSubmit: handleFormOnSubmit,
  });

  return { getFieldProps, value: state.value, setFieldValue, isSubmitting: state.isSubmitting };
};

export const useIntersection = ({ onIntersect, ref }, dependencies = []) => {
  // NOTE(amine): fix for stale closure caused by hooks
  const onIntersectRef = React.useRef();
  onIntersectRef.current = onIntersect;

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (onIntersectRef.current) onIntersectRef.current(lazyObserver, ref);
        }
      });
    });
    // start to observe element
    lazyObserver.observe(ref.current);
    return () => lazyObserver.unobserve(ref.current);
  }, dependencies);
};

// NOTE(amine): the intersection will be called one time
export const useInView = ({ ref }) => {
  const [isInView, setInView] = React.useState(false);
  useIntersection({
    ref,
    onIntersect: (lazyObserver, ref) => {
      setInView(true);
      lazyObserver.unobserve(ref.current);
    },
  });
  return { isInView };
};

// NOTE(amine): manage file saving state
export const useSaveHandler = ({ file, viewer }) => {
  const savedFile = React.useMemo(() => viewer?.libraryCids[file.cid], [viewer]);
  const [state, setState] = React.useState({
    isSaved: !!savedFile,
    // NOTE(amine): viewer will have the hydrated state
    saveCount: file.saveCount,
  });

  const handleSaveState = () => {
    setState((prev) => {
      if (prev.isSaved) {
        return {
          isSaved: false,
          saveCount: prev.saveCount - 1,
        };
      }
      return {
        isSaved: true,
        saveCount: prev.saveCount + 1,
      };
    });
  };

  const save = async () => {
    if (!viewer) {
      Events.dispatchCustomEvent({ name: "slate-global-open-cta", detail: {} });
      return;
    }
    // NOTE(amine): optimistic update
    handleSaveState();
    const response =
      state.isSaved && savedFile
        ? await Actions.deleteFiles({ ids: [savedFile.id] })
        : await Actions.saveCopy({ files: [file] });
    if (Events.hasError(response)) {
      // NOTE(amine): revert back to old state if there is an error
      handleSaveState();
      return;
    }
  };

  return { save, ...state };
};

export const useFollowProfileHandler = ({ user, viewer, onAction }) => {
  const [isFollowing, setFollowing] = React.useState(
    !viewer
      ? false
      : !!viewer?.following.some((entry) => {
          return entry.id === user.id;
        })
  );

  const handleFollow = async (userId) => {
    if (!viewer) {
      Events.dispatchCustomEvent({ name: "slate-global-open-cta", detail: {} });
      return;
    }

    setFollowing((prev) => !prev);
    const response = await Actions.createSubscription({
      userId,
    });

    if (Events.hasError(response)) {
      setFollowing((prev) => !prev);
      return;
    }

    onAction({
      type: "UPDATE_VIEWER",
      viewer: {
        following: isFollowing
          ? viewer.following.filter((user) => user.id !== userId)
          : viewer.following.concat([
              {
                id: user.id,
                followerCount: user.followerCount + 1,
                slateCount: user.slateCount,
                username: user.username,
              },
            ]),
      },
    });
  };

  return { handleFollow, isFollowing };
};

// NOTE(amine): use this hook when we need to evaluate dependencies manually
export function useMemoCompare(next, compare) {
  const previousRef = React.useRef();
  const previous = previousRef.current;

  const isEqual = compare(previous, next);

  if (!isEqual) {
    previousRef.current = next;
  }

  return isEqual ? previous : next;
}

/**
 * NOTE(amine): use this hook to get rid of nextJs warnings
 * source: https://medium.com/@alexandereardon/uselayouteffect-and-ssr-192986cdcf7a
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export const useMediaQuery = () => {
  const isMobileQuery = `(max-width: ${Constants.sizes.mobile}px)`;

  const [isMobile, setMatch] = React.useState(true);

  const handleResize = () => {
    const isMobile = window.matchMedia(isMobileQuery).matches;
    setMatch(isMobile);
  };

  React.useEffect(() => {
    if (!window) return;

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // NOTE(amine): currently only support mobile breakpoint, we can add more breakpoints as needed.
  return {
    mobile: isMobile,
  };
};

export const useEventListener = (type, handler, dependencies) => {
  React.useEffect(() => {
    if (!window) return;

    window.addEventListener(type, handler);
    return () => window.removeEventListener(type, handler);
  }, dependencies);
};

export const useTimeout = (callback, ms, dependencies) => {
  React.useEffect(() => {
    const timeoutId = setTimeout(callback, ms);
    return () => clearTimeout(timeoutId);
  }, dependencies);
};

export const useEscapeKey = (callback) => {
  const handleKeyUp = React.useCallback(
    (e) => {
      if (e.key === "Escape") callback();
    },
    [callback]
  );
  useEventListener("keyup", handleKeyUp, [handleKeyUp]);
};

export const useLockScroll = ({ lock = true } = {}) => {
  React.useEffect(() => {
    if (!lock) return;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "visible");
  }, [lock]);
};

export const useHover = () => {
  const [isHovered, setHoverState] = React.useState(false);

  const handleOnMouseEnter = () => setHoverState(true);
  const handleOnMouseLeave = () => setHoverState(false);

  return [isHovered, { handleOnMouseEnter, handleOnMouseLeave }];
};
