/* ===================== INIT / BOOT ===================== */
function afterRenderHook(){
  // re-attach any per-view listeners if needed in future; currently no-op
}

(function boot(){
  document.documentElement.setAttribute('data-theme', State.theme);
  loadCart();
  loadWishlistLocal();

  async function bootstrapAndRender(){
    await Promise.all([loadCategoriesFromAPI(), loadProductsFromAPI(), restoreSession()]);
    renderApp();
    document.getElementById('app').style.opacity = '1';
    const loader = document.getElementById('loader');
    if(loader){ loader.style.opacity = '0'; loader.style.visibility = 'hidden'; setTimeout(()=>loader.remove(), 650); }
  }

  let bootstrapped = false;
  function startBootstrap(){
    if(bootstrapped) return;
    bootstrapped = true;
    setTimeout(bootstrapAndRender, 600);
  }

  window.addEventListener('load', startBootstrap);
  if(document.readyState === 'complete'){ startBootstrap(); }
})();
