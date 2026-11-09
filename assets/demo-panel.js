// Demo harness: floating image picker. Clicking a thumbnail reloads the
// editor with `?src=` pointing at that file. "Chọn ảnh từ máy" opens the
// device file picker and loads the file directly into the editor instance
// (no reload), so any local image can be tried.
(function () {
  var items = [
    ['demo/photo-river.jpg', 'Sông / núi'],
    ['demo/photo-pug.jpg', 'Chó pug'],
    ['demo/photo-64.jpg', 'Người']
  ];
  var grid = document.getElementById('demo-grid');
  if (!grid) return;
  items.forEach(function (pair) {
    var a = document.createElement('a');
    a.href = './editor.html?src=' + encodeURIComponent('./' + pair[0]);
    a.title = pair[1];
    var img = document.createElement('img');
    img.src = './' + pair[0];
    img.alt = pair[1];
    img.loading = 'lazy';
    img.style.cssText =
      'width:64px;height:64px;object-fit:cover;border-radius:10px;display:block;border:1px solid rgba(255,255,255,.18)';
    a.appendChild(img);
    grid.appendChild(a);
  });
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.style.display = 'none';
  input.setAttribute('aria-label', 'Chọn ảnh từ máy');
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = '＋ Chọn ảnh từ máy';
  btn.style.cssText =
    'margin-top:8px;width:100%;height:34px;border-radius:10px;border:1px solid rgba(243,199,123,.4);' +
    'background:rgba(243,199,123,.12);color:#f3c77b;font:650 12px system-ui;cursor:pointer';
  btn.addEventListener('click', function () { input.click(); });
  input.addEventListener('change', function () {
    var file = input.files && input.files[0];
    if (!file) return;
    var editor = window.__aurumEditor;
    if (!editor || typeof editor.load !== 'function') {
      alert('Editor chưa sẵn sàng, thử lại sau giây thôi.');
      return;
    }
    editor.load(file).catch(function (err) {
      console.error('[demo] load failed', err);
      alert('Không mở được ảnh này (' + (err && err.message ? err.message : err) + ').');
    });
    input.value = '';
  });
  grid.parentElement.appendChild(btn);
  grid.parentElement.appendChild(input);
})();
