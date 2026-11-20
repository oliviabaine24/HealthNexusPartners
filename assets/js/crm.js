/* HNP CRM glue: carries source, door, UTM and asset into GHL form iframes as hidden-field values. */
(function () {
  function put(k, v) { try { sessionStorage.setItem('hnp_' + k, v); } catch (e) {} }
  function get(k) { try { return sessionStorage.getItem('hnp_' + k) || ''; } catch (e) { return ''; } }
  var q = new URLSearchParams(location.search);
  ['utm_source', 'door', 'asset'].forEach(function (k) { if (q.get(k)) put(k, q.get(k)); });

  function refresh() {
    var frames = document.querySelectorAll('iframe[data-form-id]');
    for (var i = 0; i < frames.length; i++) {
      var f = frames[i];
      var base = f.getAttribute('data-base') || f.src.split('?')[0];
      f.setAttribute('data-base', base);
      var p = new URLSearchParams();
      p.set('source_page', location.pathname);
      if (get('utm_source')) p.set('utm_source', get('utm_source'));
      if (get('door')) p.set('door', get('door'));
      if (f.getAttribute('data-hnp-form') === 'resource' && get('asset')) p.set('asset', get('asset'));
      var next = base + '?' + p.toString();
      if (f.getAttribute('src') !== next) f.setAttribute('src', next);
    }
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('[data-asset]') : null;
    if (a) { put('asset', a.getAttribute('data-asset')); refresh(); }
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh); else refresh();
})();
