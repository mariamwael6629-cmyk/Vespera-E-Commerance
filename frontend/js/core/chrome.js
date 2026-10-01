/* ===================== CHROME: NAV / DRAWERS / OVERLAYS ===================== */
function renderHeader(){
  const active = (v)=> State.view===v ? 'color:var(--ivory);' : 'color:var(--text-dim);';
  return `
  <header id="site-header" style="position:sticky;top:0;z-index:500;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
    background:${State.theme==='dark'?'rgba(20,23,22,0.82)':'rgba(250,250,248,0.88)'};border-bottom:1px solid var(--line);transition:background .4s var(--ease);">
    <div class="container" style="display:flex;align-items:center;justify-content:space-between;height:78px;gap:24px;">
      <a href="#" onclick="navigate('landing');return false;" class="serif" style="font-size:22px;font-weight:500;letter-spacing:.02em;display:flex;align-items:center;gap:10px;flex:none;">
        <span style="width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--line-strong);">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="var(--ivory)" stroke-width="1.5"/></svg>
        </span>
        Vespera
      </a>

      <nav aria-label="Main" style="display:flex;align-items:center;gap:32px;flex:1;justify-content:center;" class="nav-desktop">
        <div class="mega-trigger" style="position:relative;" onmouseenter="$('#mega-menu').style.opacity='1';$('#mega-menu').style.visibility='visible';$('#mega-menu').style.transform='translateY(0)';" onmouseleave="$('#mega-menu').style.opacity='0';$('#mega-menu').style.visibility='hidden';$('#mega-menu').style.transform='translateY(-8px)';">
          <button style="font-size:13.5px;font-weight:500;${active('catalog')}display:flex;align-items:center;gap:6px;" onclick="navigate('catalog',{cat:'all'})">Shop ${icon('chevron-down',14)}</button>
          <div id="mega-menu" class="glass" style="position:fixed;left:0;top:78px;width:100%;opacity:0;visibility:hidden;transform:translateY(-8px);
            transition:opacity .3s var(--ease), transform .3s var(--ease), visibility .3s;border-radius:0;border-top:1px solid var(--line);border-left:none;border-right:none;">
            <div class="container" style="padding:36px 40px;display:grid;grid-template-columns:repeat(4,1fr);gap:32px;">
              ${CATEGORIES.map(c=>`
                <div>
                  <a href="#" onclick="navigate('catalog',{cat:'${c.id}'});return false;" class="serif" style="font-size:17px;display:block;margin-bottom:6px;">${c.name}</a>
                  <p style="font-size:12.5px;color:var(--text-dim);line-height:1.5;margin-bottom:14px;">${c.desc}</p>
                  <a href="#" onclick="navigate('catalog',{cat:'${c.id}'});return false;" class="mono" style="font-size:11px;color:var(--copper-bright);letter-spacing:.05em;">VIEW ALL →</a>
                </div>`).join('')}
            </div>
          </div>
        </div>
        <button style="font-size:13.5px;font-weight:500;${active('catalog')}" onclick="navigate('catalog',{cat:'all',sale:1})">Sale</button>
        <button style="font-size:13.5px;font-weight:500;${active('landing')}" onclick="navigate('landing');setTimeout(()=>document.getElementById('about-anchor')?.scrollIntoView({behavior:'smooth'}),50);">About</button>
      </nav>

      <div style="display:flex;align-items:center;gap:10px;flex:none;">
        <button class="btn-icon nav-search-btn" aria-label="Search" onclick="openSearch()">${icon('search',17)}</button>
        <button class="btn-icon" aria-label="Toggle dark mode" onclick="toggleTheme()">${icon(State.theme==='dark'?'sun':'moon',17)}</button>
        <div style="position:relative;">
          <button class="btn-icon" aria-label="Notifications" onclick="toggleNotifPanel()">${icon('bell',17)}</button>
          ${State.notifications.some(n=>n.unread) ? `<span style="position:absolute;top:6px;right:6px;width:8px;height:8px;border-radius:50%;background:var(--copper-bright);border:1.5px solid var(--ink);"></span>`:''}
          ${renderNotifPanel()}
        </div>
        <button class="btn-icon" aria-label="Wishlist" onclick="navigate('wishlist')" style="position:relative;">
          ${icon('heart',17)}
          ${State.wishlist.length ? `<span class="mono" style="position:absolute;top:-4px;right:-4px;background:var(--burgundy-bright);color:#fff;font-size:9.5px;width:17px;height:17px;border-radius:50%;display:flex;align-items:center;justify-content:center;">${State.wishlist.length}</span>`:''}
        </button>
        <button class="btn-icon" aria-label="Cart" onclick="openCart()" style="position:relative;">
          ${icon('shopping-bag',17)}
          <span class="cart-count mono" style="position:absolute;top:-4px;right:-4px;background:var(--copper-bright);color:var(--ink);font-size:9.5px;width:17px;height:17px;border-radius:50%;display:${cartCount()>0?'flex':'none'};align-items:center;justify-content:center;">${cartCount()}</span>
        </button>
        ${State.user
          ? `<button class="btn-icon" aria-label="Account" onclick="navigate('dashboard')">${icon('user',17)}</button>`
          : `<button class="btn btn-primary btn-sm nav-login" onclick="navigate('login')">Sign in</button>`}
        <button class="btn-icon nav-burger" aria-label="Menu" onclick="toggleMobileNav()">${icon('menu',19)}</button>
      </div>
    </div>
  </header>
  <div id="mobile-nav-overlay" class="overlay" onclick="if(event.target===this)toggleMobileNav()">
    <div class="drawer" style="width:min(340px,86vw);margin-left:0;">
      <div style="padding:24px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--line);">
        <span class="serif" style="font-size:19px;">Menu</span>
        <button class="btn-icon" onclick="toggleMobileNav()">${icon('x',18)}</button>
      </div>
      <div style="padding:24px;display:flex;flex-direction:column;gap:4px;overflow-y:auto;flex:1;">
        ${CATEGORIES.map(c=>`<button onclick="navigate('catalog',{cat:'${c.id}'});toggleMobileNav();" style="text-align:left;padding:14px 8px;font-size:15px;border-bottom:1px solid var(--line);">${c.name}</button>`).join('')}
        <button onclick="navigate('catalog',{cat:'all',sale:1});toggleMobileNav();" style="text-align:left;padding:14px 8px;font-size:15px;border-bottom:1px solid var(--line);color:var(--copper-bright);">Sale</button>
        <button onclick="navigate(${State.user?"'dashboard'":"'login'"});toggleMobileNav();" style="text-align:left;padding:14px 8px;font-size:15px;border-bottom:1px solid var(--line);">${State.user?'My account':'Sign in'}</button>
        <button onclick="navigate('wishlist');toggleMobileNav();" style="text-align:left;padding:14px 8px;font-size:15px;border-bottom:1px solid var(--line);">Wishlist</button>
        <button onclick="navigate('admin');toggleMobileNav();" style="text-align:left;padding:14px 8px;font-size:15px;color:var(--text-faint);">Admin dashboard</button>
      </div>
    </div>
  </div>`;
}

function toggleMobileNav(){ $('#mobile-nav-overlay').classList.toggle('open'); }

function toggleTheme(){
  State.theme = State.theme==='dark' ? 'light' : 'dark';
  localStorage.setItem('vsp_theme', State.theme);
  document.documentElement.setAttribute('data-theme', State.theme);
  renderApp();
}

function toggleNotifPanel(){ State.notifOpen = !State.notifOpen; renderApp(); }
function renderNotifPanel(){
  if(!State.notifOpen) return '';
  return `<div class="glass" style="position:absolute;top:50px;right:0;width:340px;border-radius:var(--radius-md);overflow:hidden;box-shadow:0 24px 48px -12px rgba(0,0,0,.5);z-index:600;" onclick="event.stopPropagation()">
    <div style="padding:16px 18px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;">
      <span style="font-weight:700;font-size:13.5px;">Notifications</span>
      <button class="mono" style="font-size:10.5px;color:var(--copper-bright);" onclick="markAllRead()">MARK ALL READ</button>
    </div>
    <div style="max-height:340px;overflow-y:auto;">
      ${State.notifications.map(n=>`
        <div style="display:flex;gap:12px;padding:14px 18px;border-bottom:1px solid var(--line);background:${n.unread?'rgba(184,122,75,0.05)':'transparent'};">
          <div style="width:32px;height:32px;border-radius:50%;background:rgba(184,122,75,0.14);color:var(--copper-bright);display:flex;align-items:center;justify-content:center;flex:none;">${icon(n.icon,15)}</div>
          <div style="flex:1;">
            <div style="font-size:12.5px;font-weight:600;margin-bottom:2px;">${n.title}</div>
            <div style="font-size:11.5px;color:var(--text-dim);line-height:1.4;margin-bottom:4px;">${n.msg}</div>
            <div class="mono" style="font-size:10px;color:var(--text-faint);">${n.time}</div>
          </div>
        </div>`).join('')}
    </div>
  </div>`;
}
function markAllRead(){ State.notifications.forEach(n=>n.unread=false); renderApp(); }

function openCart(){ State.cartOpen = true; renderCartDrawer(); $('#cart-overlay').classList.add('open'); }
function closeCart(){ $('#cart-overlay').classList.remove('open'); }

function renderCartDrawer(){
  const root = $('#overlay-root');
  const items = State.cart;
  const subtotal = cartSubtotal();
  root.innerHTML += items.length>=0 ? `` : '';
  let html = `<div id="cart-overlay" class="overlay" onclick="if(event.target===this)closeCart()">
    <div class="drawer">
      <div style="padding:24px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;">
        <span class="serif" style="font-size:20px;">Your bag (${cartCount()})</span>
        <button class="btn-icon" onclick="closeCart()" aria-label="Close cart">${icon('x',18)}</button>
      </div>
      <div style="flex:1;overflow-y:auto;padding:20px 24px;">
        ${items.length===0 ? `
          <div style="text-align:center;padding:60px 20px;">
            <div style="width:64px;height:64px;border-radius:50%;background:rgba(184,122,75,0.1);display:flex;align-items:center;justify-content:center;margin:0 auto 18px;color:var(--copper-bright);">${icon('shopping-bag',26)}</div>
            <p class="serif" style="font-size:18px;margin-bottom:8px;">Your bag is empty</p>
            <p style="font-size:13px;color:var(--text-dim);margin-bottom:22px;">Items you add will appear here.</p>
            <button class="btn btn-primary btn-sm" onclick="closeCart();navigate('catalog',{cat:'all'})">Browse the catalog</button>
          </div>` :
          items.map(it=>{
            const p = getProduct(it.pid);
            return `<div style="display:flex;gap:14px;padding:16px 0;border-bottom:1px solid var(--line);">
              <img src="${p.images[0]}" alt="${p.name}" style="width:78px;height:78px;border-radius:var(--radius-sm);object-fit:cover;flex:none;">
              <div style="flex:1;min-width:0;">
                <div style="display:flex;justify-content:space-between;gap:8px;">
                  <a href="#" onclick="closeCart();navigate('product',{id:'${p.id}'});return false;" style="font-size:14px;font-weight:600;line-height:1.3;">${p.name}</a>
                  <button onclick="removeFromCart('${p.id}','${it.material}')" aria-label="Remove" style="color:var(--text-faint);flex:none;">${icon('trash-2',15)}</button>
                </div>
                <div class="mono" style="font-size:11px;color:var(--text-dim);margin:4px 0 10px;">${MATERIALS[it.material].name}</div>
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <div style="display:flex;align-items:center;border:1px solid var(--line-strong);border-radius:999px;">
                    <button onclick="updateCartQty('${p.id}','${it.material}',${it.qty-1})" style="width:26px;height:26px;font-size:14px;" aria-label="Decrease quantity">−</button>
                    <span class="mono" style="font-size:12px;width:24px;text-align:center;">${it.qty}</span>
                    <button onclick="updateCartQty('${p.id}','${it.material}',${it.qty+1})" style="width:26px;height:26px;font-size:14px;" aria-label="Increase quantity">+</button>
                  </div>
                  <span class="mono" style="font-size:13.5px;font-weight:600;">${fmt(p.price*it.qty)}</span>
                </div>
              </div>
            </div>`;
          }).join('')
        }
      </div>
      ${items.length>0 ? `
      <div style="padding:24px;border-top:1px solid var(--line);">
        <div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text-dim);margin-bottom:8px;">
          <span>Subtotal</span><span class="mono">${fmt(subtotal)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-faint);margin-bottom:18px;">
          <span>Shipping & taxes</span><span>Calculated at checkout</span>
        </div>
        <button class="btn btn-primary btn-block btn-lg" onclick="closeCart();navigate('checkout');">Checkout — ${fmt(subtotal)}</button>
        <button class="btn btn-ghost btn-block" style="margin-top:10px;" onclick="closeCart();navigate('cart');">View full bag</button>
      </div>`:''}
    </div>
  </div>`;
  const existing = document.getElementById('cart-overlay');
  if(existing) existing.outerHTML = html; else root.insertAdjacentHTML('beforeend', html);
  refreshIcons();
  requestAnimationFrame(()=>$('#cart-overlay').classList.add('open'));
}

function openSearch(){
  const root = $('#overlay-root');
  const html = `<div id="search-overlay" class="overlay" style="align-items:flex-start;" onclick="if(event.target===this)closeSearchPanel()">
    <div class="modal-center glass" style="margin-top:90px;width:min(600px,92vw);">
      <div style="padding:6px;">
        <div style="display:flex;align-items:center;gap:12px;padding:16px 18px;border-bottom:1px solid var(--line);">
          ${icon('search',18)}
          <input id="search-input" type="text" placeholder="Search products, materials, categories…" oninput="liveSearch(this.value)"
            style="flex:1;background:none;border:none;color:var(--ivory);font-size:16px;outline:none;" autofocus>
          <button class="btn-icon" onclick="closeSearchPanel()" aria-label="Close search">${icon('x',16)}</button>
        </div>
        <div id="search-results" style="max-height:50vh;overflow-y:auto;padding:8px;"></div>
      </div>
    </div>
  </div>`;
  const existing = document.getElementById('search-overlay');
  if(existing) existing.remove();
  root.insertAdjacentHTML('beforeend', html);
  refreshIcons();
  requestAnimationFrame(()=>{ $('#search-overlay').classList.add('open'); $('#search-input').focus(); });
}
function closeSearchPanel(){ const el = $('#search-overlay'); if(el){ el.classList.remove('open'); setTimeout(()=>el.remove(),400);} }
function liveSearch(q){
  const results = $('#search-results');
  if(!q || q.length<1){ results.innerHTML=''; return; }
  const matches = PRODUCTS.filter(p=>p.name.toLowerCase().includes(q.toLowerCase()) || p.cat.includes(q.toLowerCase())).slice(0,6);
  if(matches.length===0){ results.innerHTML = `<div style="padding:30px;text-align:center;color:var(--text-dim);font-size:13.5px;">No products match "${q}". Try a category like "audio" or "desk".</div>`; return; }
  results.innerHTML = matches.map(p=>`
    <button onclick="closeSearchPanel();navigate('product',{id:'${p.id}'})" style="width:100%;display:flex;align-items:center;gap:14px;padding:10px;border-radius:var(--radius-sm);text-align:left;" onmouseover="this.style.background='rgba(184,122,75,0.08)'" onmouseout="this.style.background='none'">
      <img src="${p.images[0]}" style="width:46px;height:46px;border-radius:8px;object-fit:cover;">
      <div style="flex:1;">
        <div style="font-size:13.5px;font-weight:600;">${p.name}</div>
        <div class="mono" style="font-size:11px;color:var(--text-dim);">${CATEGORIES.find(c=>c.id===p.cat).name}</div>
      </div>
      <span class="mono" style="font-size:13px;">${fmt(p.price)}</span>
    </button>`).join('');
}

document.addEventListener('click', (e)=>{
  if(State.notifOpen && !e.target.closest('[aria-label="Notifications"]') && !e.target.closest('.glass[onclick]')){
    State.notifOpen = false; renderApp();
  }
});
document.addEventListener('keydown', (e)=>{
  if(e.key==='Escape'){
    ['cart-overlay','search-overlay','quickview-overlay','auth-modal-overlay'].forEach(id=>{ const el=document.getElementById(id); if(el) el.classList.remove('open'); });
  }
});

function renderFooter(){
  return `<footer style="border-top:1px solid var(--line);padding:64px 0 32px;margin-top:auto;">
    <div class="container">
      <div style="display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:40px;margin-bottom:48px;" class="footer-grid">
        <div>
          <div class="serif" style="font-size:20px;margin-bottom:14px;">Vespera</div>
          <p style="font-size:13px;color:var(--text-dim);line-height:1.7;max-width:280px;">Considered objects for the desk, the ear, and the everyday carry. Designed quietly, built to last.</p>
          <div style="display:flex;gap:10px;margin-top:20px;">
            ${['instagram','twitter','youtube'].map(s=>`<button class="btn-icon" style="width:36px;height:36px;" aria-label="${s}">${icon(s,15)}</button>`).join('')}
          </div>
        </div>
        <div>
          <div class="eyebrow" style="margin-bottom:16px;">Shop</div>
          ${CATEGORIES.map(c=>`<button onclick="navigate('catalog',{cat:'${c.id}'})" style="display:block;font-size:13px;color:var(--text-dim);margin-bottom:11px;text-align:left;">${c.name}</button>`).join('')}
        </div>
        <div>
          <div class="eyebrow" style="margin-bottom:16px;">Account</div>
          <button onclick="navigate('login')" style="display:block;font-size:13px;color:var(--text-dim);margin-bottom:11px;">Sign in</button>
          <button onclick="navigate('dashboard',{tab:'orders'})" style="display:block;font-size:13px;color:var(--text-dim);margin-bottom:11px;">Track an order</button>
          <button onclick="navigate('wishlist')" style="display:block;font-size:13px;color:var(--text-dim);margin-bottom:11px;">Wishlist</button>
          <button onclick="navigate('admin')" style="display:block;font-size:13px;color:var(--text-faint);">Admin</button>
        </div>
        <div>
          <div class="eyebrow" style="margin-bottom:16px;">Stay in touch</div>
          <p style="font-size:12.5px;color:var(--text-dim);margin-bottom:14px;">Quiet, occasional notes on new pieces.</p>
          <form onsubmit="event.preventDefault();toast('success','Subscribed','You\\'ll hear from us occasionally.');this.reset();" style="display:flex;gap:8px;">
            <input type="email" required placeholder="Email address" style="flex:1;background:rgba(246,239,228,0.05);border:1px solid var(--line-strong);border-radius:8px;padding:10px 12px;color:var(--ivory);font-size:12.5px;">
            <button class="btn-icon" type="submit" aria-label="Subscribe" style="background:var(--copper-bright);color:var(--ink);border:none;">${icon('arrow-right',15)}</button>
          </form>
        </div>
      </div>
      <div class="divider" style="margin-bottom:24px;"></div>
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;">
        <span class="mono" style="font-size:11px;color:var(--text-faint);">© 2026 VESPERA STUDIO. ALL RIGHTS RESERVED.</span>
        <div style="display:flex;gap:20px;">
          <span class="mono" style="font-size:11px;color:var(--text-faint);">PRIVACY</span>
          <span class="mono" style="font-size:11px;color:var(--text-faint);">TERMS</span>
          <span class="mono" style="font-size:11px;color:var(--text-faint);">ACCESSIBILITY</span>
        </div>
      </div>
    </div>
  </footer>`;
}
