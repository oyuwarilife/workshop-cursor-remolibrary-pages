/**
 * ダミープロンプトなどをクリップボードにコピー（file:// では失敗時に範囲選択）
 */
(function () {
  function getPromptText(id) {
    var el = document.getElementById(id);
    if (!el) return "";
    return (el.textContent || "").replace(/\u00a0/g, " ");
  }

  function selectElementContents(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-copy-target]");
    if (!btn) return;
    e.preventDefault();
    var id = btn.getAttribute("data-copy-target");
    var text = getPromptText(id);
    if (!text) return;

    var label = btn.getAttribute("data-copy-label") || "コピーしました！";
    var orig = btn.textContent;

    function done() {
      btn.textContent = label;
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = orig;
        btn.disabled = false;
      }, 2000);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () {
        var el = document.getElementById(id);
        if (el) selectElementContents(el);
        btn.textContent = "選択しました（Ctrl+C）";
        setTimeout(function () {
          btn.textContent = orig;
        }, 2500);
      });
    } else {
      var el = document.getElementById(id);
      if (el) selectElementContents(el);
      btn.textContent = "選択しました（Ctrl+C）";
      setTimeout(function () {
        btn.textContent = orig;
      }, 2500);
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    var pre = document.getElementById("dummy-prompt-pre");
    if (!pre) return;
    pre.addEventListener("click", function () {
      var range = document.createRange();
      range.selectNodeContents(pre);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    });
  });
})();
