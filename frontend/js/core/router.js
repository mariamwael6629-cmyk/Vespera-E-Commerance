/* ===================== RENDER ENGINE ===================== */
function viewBody(){
  switch(State.view){
    case 'landing': return renderLanding();
    case 'catalog': return renderCatalog();
    case 'product': return renderProductDetail();
    case 'cart': return renderCartPage();
    case 'checkout': return renderCheckout();
    case 'login': return renderLogin();
    case 'register': return renderRegister();
    case 'forgot': return renderForgot();
    case 'dashboard': return renderDashboard();
    case 'wishlist': return renderWishlistPage();
    case 'order-confirm': return renderOrderConfirm();
    case 'admin': return renderAdmin();
    default: return renderLanding();
  }
}

function isAppView(){ return ['admin'].includes(State.view) === false; }

function renderApp(){
  const app = $('#app');
  const withChrome = !['login','register','forgot'].includes(State.view) && State.view!=='admin';
  app.innerHTML = `
    ${withChrome ? renderHeader() : (State.view==='admin' ? '' : '')}
    <main class="view" style="flex:1;display:flex;flex-direction:column;">
      ${viewBody()}
    </main>
    ${withChrome ? renderFooter() : ''}
  `;
  refreshIcons();
  renderToasts();
  initScrollReveal();
  if(typeof afterRenderHook === 'function') afterRenderHook();
}

function render(){ renderApp(); }

function initScrollReveal(){
  const items = $all('.reveal');
  if(!items.length) return;
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, {threshold:0.15});
  items.forEach(el=>obs.observe(el));
}
