Handlebars.registerHelper("json", function(json, options) {
  return JSON.stringify(json);
});

Handlebars.registerHelper("equals", function(a, b, options) {
  if ((a != null ? a.toString() : void 0) === (b != null ? b.toString() : void 0)) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});