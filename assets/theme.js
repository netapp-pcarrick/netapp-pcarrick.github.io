/* Light, dark or auto (follow the system) switch for DocOps pages. Per viewer, kept in this
   page's browser storage under "docops:theme"; the page renders the same without it.
   It sets data-theme on <html> straight away, then adds the buttons to .masthead, or to the
   element marked data-theme-host, once the page has loaded. */
(function () {
  var KEY = "docops:theme";
  var root = document.documentElement;
  function saved() {
    try {
      var v = localStorage.getItem(KEY);
      return v === "light" || v === "dark" ? v : "auto";
    } catch (e) {
      return "auto";
    }
  }
  function apply(v) {
    if (v === "light" || v === "dark") root.setAttribute("data-theme", v);
    else root.removeAttribute("data-theme");
  }
  apply(saved());
  function build() {
    var host = document.querySelector("[data-theme-host]") || document.querySelector(".masthead");
    if (!host || host.querySelector(".theme-switch")) return;
    var group = document.createElement("div");
    group.className = "theme-switch";
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", "Colour theme");
    var current = saved();
    [["auto", "Auto", "Follow the system setting"], ["light", "Light", "Light theme"], ["dark", "Dark", "Dark theme"]].forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = o[1];
      b.title = o[2];
      b.setAttribute("aria-pressed", String(o[0] === current));
      b.addEventListener("click", function () {
        try {
          if (o[0] === "auto") localStorage.removeItem(KEY);
          else localStorage.setItem(KEY, o[0]);
        } catch (e) {
          /* storage blocked: the theme still changes for this visit */
        }
        apply(o[0]);
        Array.prototype.forEach.call(group.children, function (c) { c.setAttribute("aria-pressed", String(c === b)); });
      });
      group.appendChild(b);
    });
    host.appendChild(group);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
