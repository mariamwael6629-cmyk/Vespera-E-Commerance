/* ===================== VIEW: CHECKOUT ===================== */
function renderCheckout(){
  if(State.cart.length===0 && State.checkoutStep===1){
    return `<section style="padding:100px 0;"><div class="container" style="text-align:center;">
      <p class="serif" style="font-size:22px;margin-bottom:16px;">Your bag is empty</p>
      <button class="btn btn-primary" onclick="navigate('catalog',{cat:'all'})">Shop the collection</button>
    </div></section>`;
  }
  const steps = ['Shipping','Payment','Review'];
  const subtotal = cartSubtotal();
  const promo = State.checkoutData.promo;
  const discount = promo ? (promo.type==='percent' ? subtotal*promo.value/100 : promo.type==='fixed' ? promo.value : 0) : 0;
  const shipping = subtotal>150 || (promo&&promo.type==='shipping') ? 0 : 14;
  const total = Math.max(0, subtotal-discount) + shipping;

  return `
  <section style="padding:48px 0 100px;">
    <div class="container" style="max-width:1100px;">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:48px;">
        ${steps.map((s,i)=>{
          const n=i+1; const active = State.checkoutStep===n; const done = State.checkoutStep>n;
          return `<div style="display:flex;align-items:center;gap:10px;">
            <div class="mono" style="width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;
              background:${done?'var(--copper-bright)':active?'transparent':'var(--surface)'};color:${done?'var(--ink)':active?'var(--copper-bright)':'var(--text-faint)'};
              border:1.5px solid ${active||done?'var(--copper-bright)':'var(--line-strong)'};">${done?icon('check',13):n}</div>
            <span style="font-size:13px;font-weight:${active?'700':'400'};color:${active?'var(--ivory)':'var(--text-dim)'};">${s}</span>
          </div>${i<steps.length-1?`<div style="width:40px;height:1px;background:var(--line-strong);"></div>`:''}`;
        }).join('')}
      </div>

      <div style="display:grid;grid-template-columns:1fr 360px;gap:48px;" class="cart-page-grid">
        <div class="card" style="padding:32px;">
          ${State.checkoutStep===1 ? checkoutStepShipping() : ''}
          ${State.checkoutStep===2 ? checkoutStepPayment() : ''}
          ${State.checkoutStep===3 ? checkoutStepReview() : ''}
        </div>
        <div>
          <div class="card" style="padding:24px;position:sticky;top:100px;">
            <h3 class="serif" style="font-size:17px;margin-bottom:18px;">Order summary</h3>
            ${State.cart.map(it=>{ const p=getProduct(it.pid); return `
              <div style="display:flex;gap:12px;margin-bottom:14px;">
                <img src="${p.images[0]}" style="width:48px;height:48px;border-radius:8px;object-fit:cover;flex:none;">
                <div style="flex:1;font-size:12.5px;">
                  <div style="font-weight:600;">${p.name}</div>
                  <div class="mono" style="color:var(--text-faint);font-size:11px;">${MATERIALS[it.material].name} × ${it.qty}</div>
                </div>
                <span class="mono" style="font-size:12.5px;">${fmt(p.price*it.qty)}</span>
              </div>`;}).join('')}
            <div class="divider" style="margin:14px 0;"></div>
            <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:8px;"><span style="color:var(--text-dim);">Subtotal</span><span class="mono">${fmt(subtotal)}</span></div>
            ${discount>0?`<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:8px;color:var(--copper-bright);"><span>Discount</span><span class="mono">−${fmt(discount)}</span></div>`:''}
            <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:14px;"><span style="color:var(--text-dim);">Shipping</span><span class="mono">${shipping===0?'Free':fmt(shipping)}</span></div>
            <div class="divider" style="margin-bottom:14px;"></div>
            <div style="display:flex;justify-content:space-between;font-size:17px;font-weight:700;"><span>Total</span><span class="mono">${fmt(total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function checkoutStepShipping(){
  const d = State.checkoutData.shipping;
  return `
  <h2 class="serif" style="font-size:22px;margin-bottom:24px;">Shipping address</h2>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
    <div class="field"><label>Full name</label><input id="ship-name" value="${d.name||''}" placeholder="Jordan Lee"></div>
    <div class="field"><label>Email</label><input id="ship-email" type="email" value="${d.email||''}" placeholder="jordan@email.com"></div>
  </div>
  <div class="field"><label>Address</label><input id="ship-address" value="${d.address||''}" placeholder="123 Birch Street"></div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;">
    <div class="field"><label>City</label><input id="ship-city" value="${d.city||''}" placeholder="Austin"></div>
    <div class="field"><label>State</label><input id="ship-state" value="${d.state||''}" placeholder="TX"></div>
    <div class="field"><label>ZIP</label><input id="ship-zip" value="${d.zip||''}" placeholder="78701"></div>
  </div>
  <div class="field"><label>Shipping method</label>
    <select id="ship-method">
      <option value="standard">Standard — 5-7 days — Free over $150</option>
      <option value="express">Express — 2-3 days — $24</option>
    </select>
  </div>
  <button class="btn btn-primary btn-block btn-lg" style="margin-top:8px;" onclick="checkoutNext()">Continue to payment ${icon('arrow-right',15)}</button>`;
}

function checkoutStepPayment(){
  const d = State.checkoutData.payment;
  return `
  <h2 class="serif" style="font-size:22px;margin-bottom:24px;">Payment details</h2>
  <div style="display:flex;gap:10px;margin-bottom:24px;">
    <span class="badge badge-ivory">${icon('lock',11)} Secured by Stripe</span>
  </div>
  <div class="field"><label>Card number</label><input id="pay-card" value="${d.card||''}" placeholder="4242 4242 4242 4242" maxlength="19"></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
    <div class="field"><label>Expiry</label><input id="pay-exp" value="${d.exp||''}" placeholder="MM/YY"></div>
    <div class="field"><label>CVC</label><input id="pay-cvc" value="${d.cvc||''}" placeholder="123" maxlength="4"></div>
  </div>
  <div class="field"><label>Name on card</label><input id="pay-name" value="${d.name||''}" placeholder="Jordan Lee"></div>
  <label class="checkbox-row" style="margin-bottom:24px;"><input type="checkbox" id="pay-save" ${d.save?'checked':''}> Save this card for next time</label>
  <div style="display:flex;gap:12px;">
    <button class="btn btn-ghost" onclick="checkoutBack()">${icon('arrow-left',15)} Back</button>
    <button class="btn btn-primary btn-block btn-lg" onclick="checkoutNext()">Review order ${icon('arrow-right',15)}</button>
  </div>`;
}

function checkoutStepReview(){
  const s = State.checkoutData.shipping;
  const p = State.checkoutData.payment;
  return `
  <h2 class="serif" style="font-size:22px;margin-bottom:24px;">Review your order</h2>
  <div style="margin-bottom:24px;">
    <div class="eyebrow" style="margin-bottom:10px;">Shipping to</div>
    <p style="font-size:14px;line-height:1.6;">${s.name||'—'}<br>${s.address||'—'}<br>${s.city||''}, ${s.state||''} ${s.zip||''}</p>
  </div>
  <div style="margin-bottom:24px;">
    <div class="eyebrow" style="margin-bottom:10px;">Payment</div>
    <p style="font-size:14px;">Card ending in ${p.card ? p.card.slice(-4) : '4242'}</p>
  </div>
  <label class="checkbox-row" style="margin-bottom:24px;"><input type="checkbox" id="agree-terms" checked> I agree to the Terms of Service and Return Policy</label>
  <div style="display:flex;gap:12px;">
    <button class="btn btn-ghost" onclick="checkoutBack()">${icon('arrow-left',15)} Back</button>
    <button class="btn btn-primary btn-block btn-lg" onclick="placeOrder()">${icon('lock',15)} Place order</button>
  </div>`;
}

function checkoutNext(){
  if(State.checkoutStep===1){
    const f = {name:$('#ship-name').value, email:$('#ship-email').value, address:$('#ship-address').value, city:$('#ship-city').value, state:$('#ship-state').value, zip:$('#ship-zip').value, method:$('#ship-method').value};
    if(!f.name || !f.email || !f.address){ toast('error','Missing information','Please complete name, email, and address before continuing.'); return; }
    State.checkoutData.shipping = f;
  }
  if(State.checkoutStep===2){
    const f = {card:$('#pay-card').value, exp:$('#pay-exp').value, cvc:$('#pay-cvc').value, name:$('#pay-name').value, save:$('#pay-save').checked};
    if(!f.card || !f.exp || !f.cvc){ toast('error','Missing payment info','Please complete all card fields to continue.'); return; }
    State.checkoutData.payment = f;
  }
  State.checkoutStep++; renderApp();
}
function checkoutBack(){ State.checkoutStep--; renderApp(); }

async function placeOrder(){
  if(!State.user){ toast('error','Sign in required','Please sign in to place an order.'); navigate('login'); return; }
  const items = State.cart.map(i=>({product_id:i.pid, material:i.material, qty:i.qty}));
  const card = (State.checkoutData.payment && State.checkoutData.payment.card) || '';
  const card_last4 = card.replace(/\s/g,'').slice(-4) || null;
  const promo = State.checkoutData.promo;
  try{
    const order = await apiFetch('/orders', {method:'POST', body: JSON.stringify({
      items, shipping: State.checkoutData.shipping, card_last4, promo_code: promo ? promo.code : null,
    })});
    State.lastOrder = {id:order.id, items:[...State.cart], total: order.total};
    ORDERS.unshift(normalizeOrder(order));
    State.cart = []; saveCart();
    State.checkoutStep = 1;
    State.checkoutData.promo = null;
    toast('success','Order placed', `Confirmation ${order.id} sent to your email.`);
    navigate('order-confirm');
  }catch(e){ toast('error','Could not place order', e.message); }
}

function renderOrderConfirm(){
  const o = State.lastOrder || {id:'VS-10500', items:[], total:0};
  return `<section style="padding:80px 0;"><div class="container" style="max-width:560px;text-align:center;">
    <div style="width:76px;height:76px;border-radius:50%;background:rgba(184,122,75,0.14);display:flex;align-items:center;justify-content:center;margin:0 auto 24px;color:var(--copper-bright);">${icon('check-circle',34)}</div>
    <h1 class="serif" style="font-size:32px;margin-bottom:12px;">Order confirmed</h1>
    <p style="color:var(--text-dim);font-size:14.5px;margin-bottom:8px;">Thank you — your order is being prepared.</p>
    <p class="mono" style="font-size:13px;color:var(--copper-bright);margin-bottom:36px;">Confirmation #${o.id}</p>
    <div class="card" style="padding:24px;text-align:left;margin-bottom:32px;">
      <div class="eyebrow" style="margin-bottom:14px;">What happens next</div>
      <div style="display:flex;gap:12px;margin-bottom:16px;"><span style="color:var(--copper-bright);">${icon('mail',16)}</span><span style="font-size:13px;color:var(--text-dim);">A confirmation email is on its way</span></div>
      <div style="display:flex;gap:12px;margin-bottom:16px;"><span style="color:var(--copper-bright);">${icon('package',16)}</span><span style="font-size:13px;color:var(--text-dim);">We'll notify you the moment it ships</span></div>
      <div style="display:flex;gap:12px;"><span style="color:var(--copper-bright);">${icon('truck',16)}</span><span style="font-size:13px;color:var(--text-dim);">Estimated delivery in 5-7 business days</span></div>
    </div>
    <div style="display:flex;gap:12px;justify-content:center;">
      <button class="btn btn-ghost" onclick="navigate('dashboard',{tab:'orders'})">Track order</button>
      <button class="btn btn-primary" onclick="navigate('catalog',{cat:'all'})">Continue shopping</button>
    </div>
  </div></section>`;
}
