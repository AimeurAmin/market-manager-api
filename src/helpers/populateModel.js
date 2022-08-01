const populateModel = (query) => {
  const expand = query?.split(",");
  const expandExpression = expand
    ? [
        ...expand.map((el) => {
          const splitEl = el.split(":");
          if (splitEl.length > 1) {
            const secondExpandExpression = splitEl[1].split("..")
              ? [
                  ...splitEl[1].split("..").map((secondEl) => ({
                    path: secondEl,
                  })),
                ]
              : [];

            return {
              path: splitEl[0],
              populate: secondExpandExpression,
            };
          } else {
            return {
              path: splitEl[0],
            };
          }
        }),
      ]
    : [];

  return expandExpression;
};

export default populateModel;
