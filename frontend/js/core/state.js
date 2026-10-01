/* ===================== STATE ===================== */
const State = {
  view:'landing',
  prevView:null,
  params:{},
  theme: localStorage.getItem('vsp_theme') || 'light',
  user: null, // {name,email}
  cart: [], // {pid, material, qty}
  wishlist: [], // pid
  filters:{ cat:'all', sort:'featured', price:[0,700], search:'', materials:[] },
  checkoutStep:1,
  checkoutData:{ shipping:{}, payment:{}, promo:null },
  adminView:'overview',
  toasts:[],
  notifOpen:false,
  notifications:[
    {id:1, title:'Order shipped', msg:'VS-10417 is on its way — arriving in 2 days.', time:'2h ago', unread:true, icon:'truck'},
    {id:2, title:'Price drop', msg:'Cusp Earbuds you saved dropped to $249.', time:'1d ago', unread:true, icon:'tag'},
    {id:3, title:'Back in stock', msg:'Cradle Charging Dock is available again.', time:'3d ago', unread:false, icon:'package'},
  ],
};

function saveCart(){ try{ localStorage.setItem('vsp_cart', JSON.stringify(State.cart)); }catch(e){} }
function loadCart(){ try{ const c = JSON.parse(localStorage.getItem('vsp_cart')||'[]'); State.cart = c; }catch(e){ State.cart=[]; } }
function saveWishlist(){ try{ localStorage.setItem('vsp_wishlist', JSON.stringify(State.wishlist)); }catch(e){} }
function loadWishlistLocal(){ try{ const w = JSON.parse(localStorage.getItem('vsp_wishlist')||'[]'); State.wishlist = w; }catch(e){ State.wishlist=[]; } }
