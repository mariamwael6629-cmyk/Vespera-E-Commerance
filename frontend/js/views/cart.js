/* ===================== VIEW: CART PAGE ===================== */
function renderCartPage(){
  const items = State.cart;
  const subtotal = cartSubtotal();
  const promo = State.checkoutData.promo;
  const discount = promo ? (promo.type==='percent' ? subtotal*promo.value/100 : promo.type==='fixed' ? promo.value : 0) : 0;
  const shipping = subtotal>150 || (promo&&promo.type==='shipping') ? 0 : 14;
  const total = Math.max(0, subtotal - discount) + shipping;

  return `
  <section style="padding:48px 0 100px;">
    <div class="container">
      <h1 class="serif" style="font-size:clamp(28px,3.6vw,42px);margin-bottom:36px;">Your bag</h1>
      ${items.length===0 ? `
        <div style="text-align:center;padding:100px 20px;">
          <div style="width:72px;height:72px;border-radius:50%;background:rgba(184,122,75,0.1);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;color:var(--copper-bright);">${icon('shopping-bag',30)}</div>
          <p class="serif" style="font-size:21px;margin-bottom:10px;">Your bag is empty</p>
          <p style="font-size:14px;color:var(--text-dim);margin-bottom:24px;">Browse the catalog to find your next object.</p>
          <button class="btn btn-primary" onclick="navigate('catalog',{cat:'all'})">Shop the collection</button>
        </div>` : `
      <div style="display:grid;grid-template-columns:1fr 360px;gap:48px;" class="cart-page-grid">
        <div>
          ${items.map(it=>{
            const p = getProduct(it.pid);
            return `<div class="card" style="display:flex;gap:18px;padding:20px;margin-bottom:16px;">
              <img src="${p.images[0]}" alt="${p.name}" style="width:100px;height:100px;border-radius:var(--radius-sm);object-fit:cover;flex:none;cursor:pointer;" onclick="navigate('product',{id:'${p.id}'})">
              <div style="flex:1;">
                <div style="display:flex;justify-content:space-between;">
                  <a href="#" onclick="navigate('product',{id:'${p.id}'});return false;" style="font-size:16px;font-weight:600;">${p.name}</a>
                  <span class="mono" style="font-size:15px;font-weight:700;">${fmt(p.price*it.qty)}</span>
                </div>
                <div class="mono" style="font-size:11.5px;color:var(--text-dim);margin:6px 0 16px;">${MATERIALS[it.material].name} · ${fmt(p.price)} each</div>
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <div style="display:flex;align-items:center;border:1px solid var(--line-strong);border-radius:999px;">
                    <button onclick="updateCartQty('${p.id}','${it.material}',${it.qty-1})" style="width:32px;height:32px;" aria-label="Decrease">−</button>
                    <span class="mono" style="font-size:13px;width:30px;text-align:center;">${it.qty}</span>
                    <button onclick="updateCartQty('${p.id}','${it.material}',${it.qty+1})" style="width:32px;height:32px;" aria-label="Increase">+</button>
                  </div>
                  <button onclick="removeFromCart('${p.id}','${it.material}')" style="font-size:12px;color:var(--text-faint);display:flex;align-items:center;gap:6px;">${icon('trash-2',14)}Remove</button>
                </div>
              </div>
            </div>`;
          }).join('')}
        </div>
        <div>
          <div class="card" style="padding:24px;position:sticky;top:100px;">
            <h3 class="serif" style="font-size:18px;margin-bottom:20px;">Order summary</h3>
            <div style="display:flex;gap:8px;margin-bottom:18px;">
              <input id="promo-input" type="text" placeholder="Promo code" style="flex:1;background:rgba(246,239,228,0.04);border:1px solid var(--line-strong);border-radius:8px;padding:11px 13px;color:var(--ivory);font-size:13px;">
              <button class="btn btn-ghost btn-sm" onclick="applyPromo()">Apply</button>
            </div>
            ${promo ? `<div class="badge badge-success" style="margin-bottom:16px;">${icon('check',11)} ${promo.code} applied</div>` : ''}
            <div style="display:flex;justify-content:space-between;font-size:13.5px;margin-bottom:10px;"><span style="color:var(--text-dim);">Subtotal</span><span class="mono">${fmt(subtotal)}</span></div>
            ${discount>0?`<div style="display:flex;justify-content:space-between;font-size:13.5px;margin-bottom:10px;color:var(--copper-bright);"><span>Discount</span><span class="mono">−${fmt(discount)}</span></div>`:''}
            <div style="display:flex;justify-content:space-between;font-size:13.5px;margin-bottom:18px;"><span style="color:var(--text-dim);">Shipping</span><span class="mono">${shipping===0?'Free':fmt(shipping)}</span></div>
            <div class="divider" style="margin-bottom:18px;"></div>
            <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:700;margin-bottom:24px;"><span>Total</span><span class="mono">${fmt(total)}</span></div>
            <button class="btn btn-primary btn-block btn-lg" onclick="navigate('checkout')">Proceed to checkout ${icon('arrow-right',15)}</button>
          </div>
        </div>
      </div>`}
    </div>
  </section>`;
}

async function applyPromo(){
  const code = $('#promo-input').value.trim().toUpperCase();
  if(!code){ return; }
  try{
    const data = await apiFetch('/promos/validate', {method:'POST', body: JSON.stringify({code})});
    const found = normalizePromo(data);
    State.checkoutData.promo = found;
    toast('success','Promo applied', `${found.code} — ${found.type==='percent'?found.value+'% off':found.type==='fixed'?fmt(found.value)+' off':'free shipping'}`);
  }catch(e){ toast('error','Invalid code', e.message); }
  renderApp();
}
