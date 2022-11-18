exports.nextPageURL = (req, current_page) => {
  const nextURL = new URL(
    req.protocol + "://" + req.get("host") + req.originalUrl
  );
  nextURL.searchParams.set("p", current_page + 1);
  return nextURL.href;
};
