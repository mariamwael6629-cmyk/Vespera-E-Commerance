/* ===================== VIEW: WISHLIST ===================== */
function renderWishlistPage(){
  const items = PRODUCTS.filter(p=>State.wishlist.includes(p.id));
  return `<section style="padding:48px 0 100px;"><div class="container">
    <h1 class="serif" style="font-size:clamp(28px,3.6vw,42px);margin-bottom:12px;">Wishlist</h1>
    <p style="color:var(--text-dim);font-size:14px;margin-bottom:36px;">${items.length} saved item${items.length!==1?'s':''}</p>
    ${items.length===0 ? `
      <div style="text-align:center;padding:80px 20px;">
        <div style="width:64px;height:64px;border-radius:50%;background:rgba(184,122,75,0.1);display:flex;align-items:center;justify-content:center;margin:0 auto 18px;color:var(--copper-bright);">${icon('heart',26)}</div>
        <p class="serif" style="font-size:19px;margin-bottom:8px;">Nothing saved yet</p>
        <p style="font-size:13px;color:var(--text-dim);margin-bottom:20px;">Tap the heart on any product to save it here.</p>
        <button class="btn btn-primary btn-sm" onclick="navigate('catalog',{cat:'all'})">Browse the catalog</button>
      </div>` : `
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:24px;" class="product-grid">${items.map(productCard).join('')}</div>`}
  </div></section>`;
}
