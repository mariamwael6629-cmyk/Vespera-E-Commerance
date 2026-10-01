/* ===================== VIEW: AUTH ===================== */
function authShell(content){
  return `<div style="min-height:100vh;display:flex;">
    <div style="flex:1;display:none;position:relative;overflow:hidden;background:linear-gradient(155deg,var(--surface),var(--ink-soft));" class="auth-visual">
      <img src="${img('auth-visual',900,1200)}" style="width:100%;height:100%;object-fit:cover;opacity:.85;">
      <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(21,17,15,0.6), transparent 50%);"></div>
      <a href="#" onclick="navigate('landing');return false;" class="serif" style="position:absolute;top:40px;left:40px;font-size:22px;color:#fff;">Vespera</a>
      <div style="position:absolute;bottom:48px;left:48px;right:48px;">
        <p class="serif" style="font-size:24px;color:#fff;line-height:1.4;font-style:italic;">"Six years in and my Aria II still looks — and sounds — brand new."</p>
        <p class="mono" style="font-size:11px;color:rgba(255,255,255,.6);margin-top:14px;letter-spacing:.05em;">— MARIAM K., VERIFIED OWNER</p>
      </div>
    </div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:40px;">
      <div style="width:100%;max-width:400px;">
        <a href="#" onclick="navigate('landing');return false;" class="serif auth-mobile-logo" style="font-size:22px;display:block;margin-bottom:40px;">Vespera</a>
        ${content}
      </div>
    </div>
  </div>`;
}

function renderLogin(){
  return authShell(`
    <div class="eyebrow" style="margin-bottom:16px;">Welcome back</div>
    <h1 class="serif" style="font-size:30px;margin-bottom:28px;">Sign in to your account</h1>
    <form onsubmit="event.preventDefault();doLogin();">
      <div class="field"><label>Email</label><input id="login-email" type="email" required placeholder="you@email.com"></div>
      <div class="field">
        <label>Password</label>
        <input id="login-pass" type="password" required placeholder="••••••••">
        <button type="button" onclick="navigate('forgot')" style="align-self:flex-end;font-size:12px;color:var(--copper-bright);margin-top:4px;">Forgot password?</button>
      </div>
      <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top:8px;">Sign in</button>
    </form>
    <div style="display:flex;align-items:center;gap:12px;margin:24px 0;">
      <div class="divider"></div><span class="mono" style="font-size:11px;color:var(--text-faint);">OR</span><div class="divider"></div>
    </div>
    <button class="btn btn-ghost btn-block" style="margin-bottom:10px;" onclick="doLogin('Google')">${icon('chrome',16)} Continue with Google</button>
    <button class="btn btn-ghost btn-block" onclick="doLogin('GitHub')">${icon('github',16)} Continue with GitHub</button>
    <p style="text-align:center;font-size:13px;color:var(--text-dim);margin-top:28px;">New here? <button onclick="navigate('register')" style="color:var(--copper-bright);font-weight:600;">Create an account</button></p>
  `);
}

async function doLogin(provider){
  if(provider){ toast('info','Not available in this demo', `${provider} sign-in isn't connected.`); return; }
  const email = $('#login-email')?.value || '';
  const password = $('#login-pass')?.value || '';
  if(!email || !password){ toast('error','Missing details','Enter your email and password.'); return; }
  try{
    const data = await apiFetch('/auth/login', {method:'POST', body: JSON.stringify({email, password})});
    setToken(data.access_token);
    State.user = {id:data.user.id, name:data.user.name, email:data.user.email, role:data.user.role};
    await Promise.all([loadMyOrders(), loadMyWishlist()]);
    toast('success','Signed in', `Welcome back, ${State.user.name}.`);
    navigate('dashboard');
  }catch(e){ toast('error','Could not sign in', e.message); }
}

function renderRegister(){
  return authShell(`
    <div class="eyebrow" style="margin-bottom:16px;">Join Vespera</div>
    <h1 class="serif" style="font-size:30px;margin-bottom:28px;">Create your account</h1>
    <form onsubmit="event.preventDefault();doRegister();">
      <div class="field"><label>Full name</label><input id="reg-name" required placeholder="Jordan Lee"></div>
      <div class="field"><label>Email</label><input id="reg-email" type="email" required placeholder="you@email.com"></div>
      <div class="field"><label>Password</label><input id="reg-pass" type="password" required placeholder="At least 8 characters"><div class="field-hint">Use 8+ characters with a number and symbol.</div></div>
      <label class="checkbox-row" style="margin-bottom:24px;"><input type="checkbox" required> I agree to the Terms of Service and Privacy Policy</label>
      <button type="submit" class="btn btn-primary btn-block btn-lg">Create account</button>
    </form>
    <p style="text-align:center;font-size:13px;color:var(--text-dim);margin-top:28px;">Already have an account? <button onclick="navigate('login')" style="color:var(--copper-bright);font-weight:600;">Sign in</button></p>
  `);
}
async function doRegister(){
  const name = $('#reg-name').value || '';
  const email = $('#reg-email').value || '';
  const password = $('#reg-pass').value || '';
  if(!name || !email || !password){ toast('error','Missing details','Fill in all fields.'); return; }
  try{
    const data = await apiFetch('/auth/register', {method:'POST', body: JSON.stringify({name, email, password})});
    setToken(data.access_token);
    State.user = {id:data.user.id, name:data.user.name, email:data.user.email, role:data.user.role};
    State.wishlist = [];
    ORDERS.length = 0;
    toast('success','Account created', `Welcome to Vespera, ${name.split(' ')[0]}.`);
    navigate('dashboard');
  }catch(e){ toast('error','Could not create account', e.message); }
}

function renderForgot(){
  return authShell(`
    <div class="eyebrow" style="margin-bottom:16px;">Reset password</div>
    <h1 class="serif" style="font-size:28px;margin-bottom:14px;">Forgot your password?</h1>
    <p style="font-size:13.5px;color:var(--text-dim);margin-bottom:28px;line-height:1.6;">Enter the email on your account and we'll send a link to reset it.</p>
    <form onsubmit="event.preventDefault();toast('success','Reset link sent','Check your inbox for next steps.');navigate('login');">
      <div class="field"><label>Email</label><input type="email" required placeholder="you@email.com"></div>
      <button type="submit" class="btn btn-primary btn-block btn-lg">Send reset link</button>
    </form>
    <button onclick="navigate('login')" style="display:flex;align-items:center;gap:6px;font-size:13px;color:var(--text-dim);margin-top:24px;">${icon('arrow-left',14)} Back to sign in</button>
  `);
}
