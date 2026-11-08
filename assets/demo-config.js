// Demo harness: `?src=<url>` overrides the config mediaUrl and the naming.
(function () {
  var cfgEl = document.getElementById('editor-config');
  try {
    var params = new URLSearchParams(location.search);
    var src = params.get('src');
    if (src && cfgEl) {
      var cfg = JSON.parse(cfgEl.textContent);
      cfg.mediaUrl = src;
      var base = src.split('/').pop().replace(/\.[^.]+$/, '');
      cfg.name = base + '.jpg';
      cfg.stem = base || 'demo';
      cfg.uploadName = cfg.stem + '.jpg';
      cfgEl.textContent = JSON.stringify(cfg, null, 2);
    }
  } catch (e) {
    console.warn('aurora demo config not applied', e);
  }
})();
