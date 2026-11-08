// Demo harness: floating image picker. Clicking a thumbnail reloads the
// editor with `?src=` pointing at that file.
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
})();
