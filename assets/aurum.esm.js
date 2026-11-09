/*! aurum-image-editor v1.0.0 | MIT | headless core + optional iOS dark/gold UI */
var ji=Object.defineProperty;var Gi=(a,i,t)=>i in a?ji(a,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[i]=t;var d=(a,i,t)=>Gi(a,typeof i!="symbol"?i+"":i,t);var Ft=640,Jt=.35,Oi=.09;function Rt(a,i,t){return a<i?i:a>t?t:a}function Te(a,i,t){if(!a.length)return null;let e=64,r=Rt(t/Math.max(1,i),.05,20),s=Math.max(24,Math.min(128,Math.round(e*r))),o=e*s,n=new Float32Array(o),u=new Float32Array(o);for(let p of a){let v=Rt(p.radius,.002,.35),f=v/r,m=Math.max(0,Math.floor((p.x-v)*e)),g=Math.min(e-1,Math.ceil((p.x+v)*e)),x=Math.max(0,Math.floor((p.y-f)*s)),_=Math.min(s-1,Math.ceil((p.y+f)*s));for(let y=x;y<=_;y+=1){let T=((y+.5)/s-p.y)/f;for(let k=m;k<=g;k+=1){let L=((k+.5)/e-p.x)/v,R=L*L+T*T;if(R>=1)continue;let C=1-R,z=C*C,I=y*e+k;n[I]+=p.dx*z,u[I]+=p.dy*z}}}let l=0;for(let p=0;p<o;p+=1)l=Math.max(l,Math.abs(n[p]),Math.abs(u[p]));if(l<1e-6)return null;let c=Math.min(.09,l*1.02),h=new Uint8Array(o*4);for(let p=0;p<o;p+=1){let v=Rt(n[p],-c,c),f=Rt(u[p],-c,c),m=p*4;h[m]=Math.round(Rt(128+v/c*127,0,255)),h[m+1]=Math.round(Rt(128+f/c*127,0,255)),h[m+2]=0,h[m+3]=255}return{width:e,height:s,data:h,shift:c}}var it={brightness:[-100,100],contrast:[-100,100],saturation:[-100,100],exposure:[-100,100],warmth:[-100,100],vignette:[0,100],highlights:[-100,100],shadows:[-100,100],whites:[-100,100],blacks:[-100,100],tint:[-100,100],vibrance:[-100,100],gamma:[-100,100],clarity:[-100,100],sharpen:[0,100],denoise:[0,100],smoothSkin:[0,100],blemish:[0,100],skinTexture:[0,100],skinTone:[-100,100],faceSlim:[-100,100],jawline:[-100,100],chin:[-100,100],eyeSize:[-100,100],noseSize:[-100,100],mouthSize:[-100,100]},ee=Object.keys(it),Nt=["red","orange","yellow","green","aqua","blue","purple","magenta"];function ie(){return{brightness:0,contrast:0,saturation:0,exposure:0,warmth:0,vignette:0,highlights:0,shadows:0,whites:0,blacks:0,tint:0,vibrance:0,gamma:0,clarity:0,sharpen:0,denoise:0,smoothSkin:0,blemish:0,skinTexture:55,skinTone:0,faceSlim:0,jawline:0,chin:0,eyeSize:0,noseSize:0,mouthSize:0}}function ae(){return{zoom:1,turn:0,rotation:0,flipH:!1,flipV:!1,offsetX:0,offsetY:0,perspectiveX:0,perspectiveY:0}}function re(){return{aspect:"free",ratio:3/2,scale:1}}function mt(){return[{x:0,y:0},{x:1,y:1}]}function se(){return{rgb:mt(),r:mt(),g:mt(),b:mt()}}function pt(){return{hue:0,saturation:0,luminance:0}}function Xt(){return{red:pt(),orange:pt(),yellow:pt(),green:pt(),aqua:pt(),blue:pt(),purple:pt(),magenta:pt()}}function Ct(){return{curves:se(),hsl:Xt(),lut:"none",lutStrength:100,auto:!1}}function Yt(){return{liquify:[]}}function di(a){let i=Yt();if(!a||typeof a!="object")return i;let t=a;if(!Array.isArray(t.liquify))return i;let e=[],r=Math.max(0,t.liquify.length-640);for(let s=r;s<t.liquify.length;s+=1){let o=t.liquify[s];if(!o||typeof o!="object")continue;let n=o;!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.dx)||!Number.isFinite(n.dy)||!Number.isFinite(n.radius)||e.push({x:S(n.x,0,1),y:S(n.y,0,1),dx:S(n.dx,-.25,.25),dy:S(n.dy,-.25,.25),radius:S(n.radius,.002,.35)})}return i.liquify=e,i}function zt(){return{version:1,transform:ae(),crop:re(),adjust:ie(),filter:"original",enhance:Ct(),retouch:Yt()}}function te(a){return a.map(i=>({x:i.x,y:i.y}))}function ut(a){let i=a.enhance||Ct(),t=a.retouch||Yt(),e=Xt();for(let r of Nt)e[r]={...i.hsl[r]||e[r]};return{version:1,transform:{...a.transform},crop:{...a.crop},adjust:{...a.adjust},filter:a.filter,enhance:{curves:{rgb:te(i.curves.rgb),r:te(i.curves.r),g:te(i.curves.g),b:te(i.curves.b)},hsl:e,lut:i.lut,lutStrength:i.lutStrength,auto:i.auto},retouch:{liquify:t.liquify.map(r=>({...r}))}}}function S(a,i,t){return a<i?i:a>t?t:a}function et(a,i){return typeof a=="number"&&Number.isFinite(a)?a:i}function ke(a,i){return typeof a=="boolean"?a:i}var $i=["free","1:1","4:3","3:4","16:9","9:16","screen"];function Me(a){return typeof a=="string"&&$i.includes(a)}function Et(a){let i=[];if(Array.isArray(a))for(let r of a){if(!r||typeof r!="object")continue;let s=r;!Number.isFinite(s.x)||!Number.isFinite(s.y)||i.push({x:S(s.x,0,1),y:S(s.y,0,1)})}i.sort((r,s)=>r.x-s.x);let t=[];for(let r of i){let s=t[t.length-1];s&&Math.abs(s.x-r.x)<5e-4?s.y=r.y:t.push(r)}if(t.length<2)return mt();t[0].x>5e-4&&t.unshift({x:0,y:t[0].y});let e=t[t.length-1];if(e.x<.9995&&t.push({x:1,y:e.y}),t.length>16){let r=[t[0]],s=t.length-2,o=14;for(let n=1;n<=o;n+=1){let u=1+Math.round(n*(s-1)/o),l=t[u];l&&l.x>r[r.length-1].x+5e-4&&r.push(l)}return r.push(t[t.length-1]),r}return t}function Ki(a){let i=a||{};return{hue:S(et(i.hue,0),-100,100),saturation:S(et(i.saturation,0),-100,100),luminance:S(et(i.luminance,0),-100,100)}}function oe(a){let i=Ct();if(!a||typeof a!="object")return i;let t=a,e=t.curves||{};i.curves={rgb:Et(e.rgb),r:Et(e.r),g:Et(e.g),b:Et(e.b)};let r=t.hsl||{};for(let s of Nt)i.hsl[s]=Ki(r[s]);return i.lut=typeof t.lut=="string"&&/^[a-z0-9-]{1,24}$/i.test(t.lut)?t.lut:"none",i.lutStrength=S(et(t.lutStrength,100),0,100),i.auto=ke(t.auto,!1),i}function Le(a){let i=zt();if(!a||typeof a!="object")return i;let t=a,e=t.transform||{},r=t.crop||{},s=t.adjust||{},o=et(e.rotation,i.transform.rotation),n=Math.round(et(e.turn,0));i.transform={zoom:S(et(e.zoom,1),.2,12),turn:(n%4+4)%4,rotation:((o+180)%360+360)%360-180,flipH:ke(e.flipH,!1),flipV:ke(e.flipV,!1),offsetX:S(et(e.offsetX,0),-4,4),offsetY:S(et(e.offsetY,0),-4,4),perspectiveX:S(et(e.perspectiveX,0),-100,100),perspectiveY:S(et(e.perspectiveY,0),-100,100)};let u=Me(r.aspect)?r.aspect:"free";i.crop={aspect:u,ratio:S(et(r.ratio,i.crop.ratio),.2,8),scale:S(et(r.scale,1),.2,1)},i.adjust={...i.adjust};for(let l of ee){let[c,h]=it[l];i.adjust[l]=S(et(s[l],i.adjust[l]),c,h)}return i.filter=typeof t.filter=="string"&&t.filter?t.filter:"original",i.enhance=oe(t.enhance),i.retouch=di(t.retouch),i}var Wt=class{constructor(i=60){d(this,"entries",[]);d(this,"index",-1);d(this,"limit");this.limit=Math.max(2,i)}reset(i){this.entries=[{state:ut(i),key:"",at:0}],this.index=0}push(i,t=""){let e=Date.now(),r=this.entries[this.index];if(r&&t&&t===r.key&&e-r.at<900){r.state=ut(i),r.at=e;return}this.entries=this.entries.slice(0,this.index+1),this.entries.push({state:ut(i),key:t,at:e}),this.entries.length>this.limit&&this.entries.shift(),this.index=this.entries.length-1}undo(){return this.index<=0?null:(this.index-=1,ut(this.entries[this.index].state))}redo(){return this.index>=this.entries.length-1?null:(this.index+=1,ut(this.entries[this.index].state))}get canUndo(){return this.index>0}get canRedo(){return this.index<this.entries.length-1}get depth(){return this.entries.length}};var Ee=Math.PI/180;function ht(a,i,t){return a<i?i:a>t?t:a}function Vi(a,i,t){switch(a){case"1:1":return 1;case"4:3":return 4/3;case"3:4":return 3/4;case"16:9":return 16/9;case"9:16":return 9/16;case"screen":return i.height>0?i.width/i.height:1;default:return ht(t,.2,8)}}function Zi(a){return ht(Math.min(a.width,a.height)*.018,2,8)}function jt(a){return(a.turn||0)*90+a.rotation}function ne(a,i){let t=Zi(a),e=Math.max(24,a.width-t*2),r=Math.max(24,a.height-t*2);return e/r>i?{width:r*i,height:r}:{width:e,height:e/i}}function vt(a,i){let t=Vi(i.aspect,a,i.ratio),e=ne(a,t),r=ht(i.scale,.2,1),s=e.width*r,o=e.height*r;return{x:(a.width-s)/2,y:(a.height-o)/2,width:s,height:o}}function Gt(a){let i=a.width/2,t=a.height/2;return[{x:-i,y:-t},{x:i,y:-t},{x:i,y:t},{x:-i,y:t}]}function pi(a,i){let t=Math.cos(i),e=Math.sin(i);return{x:t*a.x-e*a.y,y:e*a.x+t*a.y}}function at(a,i){let t=Math.cos(i),e=Math.sin(i);return{x:t*a.x+e*a.y,y:-e*a.x+t*a.y}}function rt(a,i,t,e){let r=Math.max(a.width/i,a.height/t)||1,s=Math.max(.01,e.zoom),o=i*r*s/2,n=t*r*s/2;return{sx:o*(e.flipH?-1:1),sy:n*(e.flipV?-1:1),cover:r,radians:jt(e)*Ee}}var fi=.32;function st(a){return{a:ht(a.perspectiveY,-100,100)/100*fi,b:ht(a.perspectiveX,-100,100)/100*fi}}function Bt(a,i){let t=1+i.a*a.y+i.b*a.x;return{x:a.x/t,y:a.y/t}}function St(a,i){let t=1-i.a*a.y-i.b*a.x;return{x:a.x/t,y:a.y/t}}function Qi(a,i,t,e,r){let s=Math.max(a.width/i,a.height/t)||1,o=e*Ee,n=Gt(r),u=0,l=0;for(let p of n){let v=at(p,o);u=Math.max(u,Math.abs(v.x)),l=Math.max(l,Math.abs(v.y))}let c=u/(i*s/2),h=l/(t*s/2);return Math.max(.2,c,h)}function Tt(a,i,t,e,r){let s=Qi(a,i,t,jt(e),r),o=st(e);if(Math.abs(o.a)<1e-4&&Math.abs(o.b)<1e-4)return s;let n=Math.max(a.width/i,a.height/t)||1,u=jt(e)*Ee,l=Gt(r),c=i*n/2,h=t*n/2,p=m=>{let g=c*m*(e.flipH?-1:1),x=h*m*(e.flipV?-1:1);for(let _ of l){let y=at(_,u),w=St({x:y.x/g,y:y.y/x},o);if(Math.abs(w.x)>1.00001||Math.abs(w.y)>1.00001)return!1}return!0};if(p(s))return s;let v=s,f=Math.max(s,12);if(!p(f))return f;for(let m=0;m<24;m+=1){let g=(v+f)/2;p(g)?f=g:v=g}return f}function Ae(a,i,t,e,r,s,o){let n=rt(a,i,t,e),u=st(e);for(let l of Gt(r)){let c=at(l,n.radians),h=St({x:c.x/n.sx-s,y:c.y/n.sy-o},u);if(Math.abs(h.x)>1.00001||Math.abs(h.y)>1.00001)return!1}return!0}function gt(a,i,t,e,r){let s=st(e);if(Math.abs(s.a)>1e-4||Math.abs(s.b)>1e-4){let p=e.offsetX,v=e.offsetY;if(Ae(a,i,t,e,r,p,v))return{x:p,y:v};if(!Ae(a,i,t,e,r,0,0))return{x:0,y:0};let f=0,m=1;for(let g=0;g<22;g+=1){let x=(f+m)/2;Ae(a,i,t,e,r,p*x,v*x)?f=x:m=x}return{x:p*f,y:v*f}}let o=rt(a,i,t,e),n=Gt(r),u=-1/0,l=1/0,c=-1/0,h=1/0;for(let p of n){let v=at(p,o.radians),f=v.x/o.sx,m=v.y/o.sy;u=Math.max(u,f-1),l=Math.min(l,f+1),c=Math.max(c,m-1),h=Math.min(h,m+1)}return u>l&&(u=l=(u+l)/2),c>h&&(c=h=(c+h)/2),{x:ht(e.offsetX,u,l),y:ht(e.offsetY,c,h)}}function mi(a,i,t){let e=at({x:a,y:i},t.radians);return{x:e.x/t.sx,y:e.y/t.sy}}function ue(a,i,t,e,r){let s=rt(a,i,t,e),o=st(e),u=Gt(r).map(l=>{let c=at(l,s.radians),h=c.x/s.sx-e.offsetX,p=c.y/s.sy-e.offsetY,v=St({x:h,y:p},o);return{x:(v.x+1)/2*i,y:(v.y+1)/2*t}});return{tl:u[0],tr:u[1],br:u[2],bl:u[3]}}function vi(a,i,t){let e=a.tl.x,r=a.tl.y,s=a.tr.x,o=a.tr.y,n=a.br.x,u=a.br.y,l=a.bl.x,c=a.bl.y,h=e-s+n-l,p=r-o+u-c,v,f,m,g,x,_,y=0,w=0;if(Math.abs(h)<1e-7&&Math.abs(p)<1e-7)v=s-e,f=n-s,m=e,g=o-r,x=u-o,_=r;else{let E=s-n,L=l-n,R=o-u,C=c-u,z=E*C-L*R;Math.abs(z)<1e-7?(v=s-e,f=n-s,m=e,g=o-r,x=u-o,_=r):(y=(h*C-L*p)/z,w=(E*p-h*R)/z,v=s-e+y*s,f=l-e+w*l,m=e,g=o-r+y*o,x=c-r+w*c,_=r)}let T=Math.max(1,i),k=Math.max(1,t);return[v/T,f/k,m,g/T,x/k,_,y/T,w/k,1]}function Ce(a,i,t){let e=a[6]*i+a[7]*t+a[8];return Math.abs(e)<1e-9?{x:0,y:0,w:1}:{x:(a[0]*i+a[1]*t+a[2])/e,y:(a[3]*i+a[4]*t+a[5])/e,w:e}}function Re(a,i){return Math.hypot(i.x-a.x,i.y-a.y)}function ze(a){return{width:Math.max(1,Math.round(Re(a.tl,a.tr))),height:Math.max(1,Math.round(Re(a.tl,a.bl)))}}function Be(a){return a.length<2?0:Re(a[0],a[1])}function Ie(a){if(!a.length)return{x:0,y:0};let i=0,t=0;for(let e of a)i+=e.x,t+=e.y;return{x:i/a.length,y:t/a.length}}var le=.24,ce=class{constructor(i){d(this,"host");d(this,"pointers",new Map);d(this,"panStart",null);d(this,"pinchStart",null);d(this,"lastTap",{at:0,x:0,y:0});d(this,"wheelTimer",null);d(this,"disposed",!1);d(this,"enabled",!0);d(this,"onPointerDown",i=>{if(!(!this.enabled||!i.isPrimary&&this.pointers.size===0||i.target?.closest("[data-gesture-ignore]"))&&!(i.pointerType==="mouse"&&i.button!==0)){if(this.pointers.set(i.pointerId,{x:i.clientX,y:i.clientY}),this.pointers.size===1){let e=this.host.state();this.panStart={id:i.pointerId,x:i.clientX,y:i.clientY,offsetX:e.transform.offsetX,offsetY:e.transform.offsetY,moved:!1},this.pinchStart=null}else this.pointers.size===2&&this.beginPinch();this.host.stage.setPointerCapture?.(i.pointerId),i.preventDefault()}});d(this,"onPointerMove",i=>{this.pointers.has(i.pointerId)&&(this.pointers.set(i.pointerId,{x:i.clientX,y:i.clientY}),this.pointers.size===1&&this.panStart?this.pan():this.pointers.size>=2&&this.pinchStart&&this.pinch(),i.preventDefault())});d(this,"onPointerUp",i=>{if(!this.pointers.has(i.pointerId))return;let t=this.pointers.size===1,e=this.panStart;if(this.pointers.delete(i.pointerId),this.pointers.size===0)this.panStart=null,this.pinchStart=null,this.finish(t,e,i);else if(this.pointers.size===1){let[r,s]=Array.from(this.pointers.entries())[0],o=this.host.state();this.panStart={id:r,x:s.x,y:s.y,offsetX:o.transform.offsetX,offsetY:o.transform.offsetY,moved:!0},this.pinchStart=null}});d(this,"onPointerCancel",i=>{this.pointers.delete(i.pointerId),this.pointers.size===0&&(this.panStart=null,this.pinchStart=null,this.settle())});d(this,"onWheel",i=>{if(!this.enabled)return;i.preventDefault();let t=this.host.stage.getBoundingClientRect(),e={x:i.clientX-t.left-t.width/2,y:i.clientY-t.top-t.height/2},r=this.host.state(),s=Math.exp(-i.deltaY*.0018),o=this.softZoom(r.transform.zoom*s),n=this.zoomAround(o,e,r.transform);this.host.setTransform(n),this.wheelTimer!==null&&window.clearTimeout(this.wheelTimer),this.wheelTimer=window.setTimeout(()=>{this.wheelTimer=null,this.settle()},220)});this.host=i;let t=i.stage;t.addEventListener("pointerdown",this.onPointerDown),t.addEventListener("pointermove",this.onPointerMove),t.addEventListener("pointerup",this.onPointerUp),t.addEventListener("pointercancel",this.onPointerCancel),t.addEventListener("wheel",this.onWheel,{passive:!1})}beginPinch(){let i=Array.from(this.pointers.values()),t=this.host.state(),e=this.host.stage.getBoundingClientRect(),r=Ie(i);this.pinchStart={distance:Math.max(1,Be(i)),mid:{x:r.x-e.left-e.width/2,y:r.y-e.top-e.height/2},zoom:t.transform.zoom,offsetX:t.transform.offsetX,offsetY:t.transform.offsetY},this.panStart=null}stagePoint(i,t){let e=this.host.stage.getBoundingClientRect();return{x:i-e.left-e.width/2,y:t-e.top-e.height/2}}pan(){let i=this.panStart;if(!i)return;let t=this.host.state(),e=rt(this.host.viewport(),this.host.source().width,this.host.source().height,t.transform),r=(this.pointers.get(i.id)?.x??i.x)-i.x,s=(this.pointers.get(i.id)?.y??i.y)-i.y;!i.moved&&Math.hypot(r,s)>2.5&&(i.moved=!0);let o=mi(r,s,e),n=i.offsetX+o.x,u=i.offsetY+o.y;this.applyOffsets(n,u,t.transform,!0)}pinch(){let i=this.pinchStart;if(!i)return;let t=Array.from(this.pointers.values()),e=Math.max(1,Be(t)),r=this.host.state(),s=this.softZoom(i.zoom*(e/i.distance)),o=this.pointers.values().next().value,n=this.host.stage.getBoundingClientRect(),u=Ie(t),l={x:u.x-n.left-n.width/2,y:u.y-n.top-n.height/2},c=this.zoomAround(s,l,{...r.transform,zoom:i.zoom,offsetX:i.offsetX,offsetY:i.offsetY},i.mid,o);this.host.setTransform(c)}zoomAround(i,t,e,r,s,o=!0){let n=this.host.viewport(),u=this.host.source(),l=r||t,c=rt(n,u.width,u.height,e),h=st(e),p=at(l,c.radians),v=St({x:p.x/c.sx-e.offsetX,y:p.y/c.sy-e.offsetY},h),f=Bt(v,h),m=rt(n,u.width,u.height,{...e,zoom:i}),g=at(t,m.radians),x=g.x/m.sx-f.x,_=g.y/m.sy-f.y,y=gt(n,u.width,u.height,{...e,zoom:i,offsetX:x,offsetY:_},this.host.frame());return o?(x=y.x+(x-y.x)*le,_=y.y+(_-y.y)*le):(x=y.x,_=y.y),{zoom:i,offsetX:x,offsetY:_}}softZoom(i){let t=this.minimum(),e=this.host.maxZoom;return i<t?Math.max(t*.6,t+(i-t)*.35):i>e?Math.min(e*1.15,e+(i-e)*.35):i}minimum(){let i=this.host.viewport(),t=this.host.source(),e=this.host.state();return Tt(i,t.width,t.height,e.transform,this.host.frame())}applyOffsets(i,t,e,r){let s=this.host.viewport(),o=this.host.source(),n=this.host.frame(),u={...e,offsetX:i,offsetY:t},l=gt(s,o.width,o.height,u,n),c=r?l.x+(i-l.x)*le:l.x,h=r?l.y+(t-l.y)*le:l.y;this.host.setTransform({offsetX:c,offsetY:h})}settle(){let i=this.host.state(),t=this.host.viewport(),e=this.host.source(),r=this.host.frame(),s=this.minimum(),o=ht(i.transform.zoom,s,this.host.maxZoom),n=gt(t,e.width,e.height,{...i.transform,zoom:o},r);Math.abs(o-i.transform.zoom)>.001||Math.abs(n.x-i.transform.offsetX)>5e-4||Math.abs(n.y-i.transform.offsetY)>5e-4?this.host.settle({zoom:o,offsetX:n.x,offsetY:n.y},420):this.host.commit()}finish(i,t,e){if(i&&t&&!t.moved){let r=Date.now(),s=Math.hypot(e.clientX-this.lastTap.x,e.clientY-this.lastTap.y);if(r-this.lastTap.at<320&&s<22){this.lastTap={at:0,x:0,y:0},this.doubleTap(this.stagePoint(e.clientX,e.clientY));return}this.lastTap={at:r,x:e.clientX,y:e.clientY}}this.settle()}doubleTap(i){let t=this.host.state(),e=this.minimum(),r=t.transform.zoom>e*1.35?e:Math.min(this.host.maxZoom,e*2.2),s=this.zoomAround(r,i,t.transform,void 0,void 0,!1);this.host.settle(s,380)}setEnabled(i){this.enabled!==i&&(this.enabled=i,i||(this.pointers.clear(),this.panStart=null,this.pinchStart=null))}destroy(){if(this.disposed)return;this.disposed=!0;let i=this.host.stage;i.removeEventListener("pointerdown",this.onPointerDown),i.removeEventListener("pointermove",this.onPointerMove),i.removeEventListener("pointerup",this.onPointerUp),i.removeEventListener("pointercancel",this.onPointerCancel),i.removeEventListener("wheel",this.onWheel),this.wheelTimer!==null&&window.clearTimeout(this.wheelTimer)}};function It(a="Aborted"){return typeof DOMException<"u"?new DOMException(a,"AbortError"):Object.assign(new Error(a),{name:"AbortError"})}function ot(a){return!!a&&typeof a=="object"&&a.name==="AbortError"}function dt(a){if(a?.aborted)throw It()}function he(){return new Promise(a=>{let i=!1,t=()=>{i||(i=!0,a())};typeof requestAnimationFrame=="function"&&requestAnimationFrame(t),setTimeout(t,250)})}var De=`attribute vec2 a_pos;
attribute vec2 a_uv;
attribute float a_w;
uniform mat3 u_matrix;
uniform vec2 u_warp;
varying vec2 v_uv;
varying vec2 v_screen;
void main() {
float w = a_w * (1.0 + u_warp.x * a_pos.y + u_warp.y * a_pos.x);
vec3 p = u_matrix * vec3(a_pos, w);
gl_Position = vec4(p.xy, 0.0, w);
v_uv = a_uv;
v_screen = p.xy / w;
}
`,de={base:`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D u_texture;
uniform sampler2D u_curve;
uniform sampler2D u_lut;
#ifdef AURUM_BEAUTY_MASK
uniform sampler2D u_mask;
uniform float u_hasMask;
#endif
#ifdef AURUM_LIQUIFY
uniform sampler2D u_liquify;
uniform float u_liquifyShift;
#endif
uniform mat3 u_color;
uniform vec3 u_offset;
uniform float u_vignette;
uniform float u_aspect;
uniform vec2 u_vigCenter;
uniform vec2 u_vigHalf;
uniform vec2 u_texel;
uniform float u_dither;
uniform float u_exposure;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_saturation;
uniform float u_highlights;
uniform float u_shadows;
uniform float u_whites;
uniform float u_blacks;
uniform float u_warmth;
uniform float u_tint;
uniform float u_vibrance;
uniform float u_gamma;
uniform float u_clarity;
uniform float u_sharpen;
uniform float u_denoise;
uniform float u_smoothSkin;
uniform float u_blemish;
uniform float u_skinTexture;
uniform float u_skinTone;
uniform float u_hasCurve;
uniform float u_lutStrength;
uniform float u_lutSize;
uniform float u_quality;
uniform vec4 u_faces[4];
uniform int u_faceCount;
uniform sampler2D u_anchors;
uniform float u_hasAnchors;
uniform vec3 u_hsl[8];
uniform float u_faceSlim;
uniform float u_jawline;
uniform float u_chin;
uniform float u_eyeSize;
uniform float u_noseSize;
uniform float u_mouthSize;
varying vec2 v_uv;
varying vec2 v_screen;
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
#ifdef AURUM_LINEAR
float srgbToLinear1(float v) {
v = clamp(v, 0.0, 1.0);
return v <= 0.04045 ? v / 12.92 : pow((v + 0.055) / 1.055, 2.4);
}
float linearToSrgb1(float v) {
v = clamp(v, 0.0, 1.0);
return v <= 0.0031308 ? v * 12.92 : 1.055 * pow(v, 1.0 / 2.4) - 0.055;
}
vec3 toLinear(vec3 c) {
return vec3(srgbToLinear1(c.r), srgbToLinear1(c.g), srgbToLinear1(c.b));
}
vec3 toSrgb(vec3 c) {
return vec3(linearToSrgb1(c.r), linearToSrgb1(c.g), linearToSrgb1(c.b));
}
#endif
vec2 warpFace(vec2 uv) {
#ifdef AURUM_LIQUIFY
if (u_liquifyShift > 0.00001) {
vec2 pushed = (texture2D(u_liquify, uv).rg * 255.0 - 128.0) * (u_liquifyShift / 127.0);
uv = clamp(uv + pushed, 0.0, 1.0);
}
#endif
if (
abs(u_faceSlim) + abs(u_jawline) + abs(u_chin) +
abs(u_eyeSize) + abs(u_noseSize) + abs(u_mouthSize) < 0.001
) return uv;
for (int i = 0; i < 4; i++) {
if (i >= u_faceCount) break;
vec4 f = u_faces[i];
vec2 halfSize = max(f.zw / vec2(1.24, 1.44), vec2(0.0001));
vec2 center = f.xy;
vec2 l = (uv - center) / halfSize;
float ell = clamp(1.0 - dot(l, l), 0.0, 1.0);
if (ell <= 0.0001) continue;
float soft = ell * ell;
vec2 eyeL = vec2(-0.34, -0.18);
vec2 eyeR = vec2(0.34, -0.18);
vec2 nose = vec2(0.0, 0.10);
vec2 mouth = vec2(0.0, 0.40);
vec2 eyeLR = vec2(0.22, 0.16);
vec2 eyeRR = vec2(0.22, 0.16);
vec2 noseR = vec2(0.20, 0.24);
vec2 mouthR = vec2(0.30, 0.16);
if (u_hasAnchors > 0.5) {
float ay = (float(i) + 0.5) * 0.25;
vec4 a0 = texture2D(u_anchors, vec2(0.125, ay));
vec4 a1 = texture2D(u_anchors, vec2(0.375, ay));
vec4 a2 = texture2D(u_anchors, vec2(0.625, ay));
vec4 a3 = texture2D(u_anchors, vec2(0.875, ay));
eyeL = a0.xy * 2.0 - 1.0;
eyeR = a0.zw * 2.0 - 1.0;
nose = a1.xy * 2.0 - 1.0;
mouth = a1.zw * 2.0 - 1.0;
eyeLR = max(a2.xy * 0.6, vec2(0.02));
eyeRR = max(a2.zw * 0.6, vec2(0.02));
noseR = max(a3.xy * 0.6, vec2(0.02));
mouthR = max(a3.zw * 0.6, vec2(0.02));
}
float squeeze =
u_faceSlim * 0.16 +
u_jawline * 0.14 * smoothstep(-0.05, 0.75, l.y);
uv.x += squeeze * l.x * soft * halfSize.x;
float chinBand = smoothstep(0.0, 0.65, l.y) * exp(-l.x * l.x * 3.0);
uv.y -= u_chin * 0.14 * chinBand * ell * halfSize.y;
if (abs(u_eyeSize) > 0.001) {
vec2 dL = (l - eyeL) / eyeLR;
vec2 dR = (l - eyeR) / eyeRR;
float fL = clamp(1.0 - dot(dL, dL), 0.0, 1.0);
float fR = clamp(1.0 - dot(dR, dR), 0.0, 1.0);
fL *= fL;
fR *= fR;
uv -= (uv - (center + eyeL * halfSize)) * u_eyeSize * 0.28 * fL;
uv -= (uv - (center + eyeR * halfSize)) * u_eyeSize * 0.28 * fR;
}
if (abs(u_noseSize) > 0.001) {
vec2 dN = (l - nose) / noseR;
float fN = clamp(1.0 - dot(dN, dN), 0.0, 1.0);
fN *= fN;
uv -= (uv - (center + nose * halfSize)) * u_noseSize * 0.26 * fN;
}
if (abs(u_mouthSize) > 0.001) {
vec2 dM = (l - mouth) / mouthR;
float fM = clamp(1.0 - dot(dM, dM), 0.0, 1.0);
fM *= fM;
uv -= (uv - (center + mouth * halfSize)) * u_mouthSize * 0.24 * fM;
}
}
return clamp(uv, 0.0, 1.0);
}
void addTap(vec2 base, vec2 offset, float centerLuma, float invSigma2, inout vec3 acc, inout float wsum) {
vec3 s = texture2D(u_texture, base + offset).rgb;
float dl = luma(s) - centerLuma;
float w = exp(-dl * dl * invSigma2);
acc += s * w;
wsum += w;
}
vec3 whiteBalance() {
return vec3(
1.0 + u_warmth * 0.16 + u_tint * 0.04,
1.0 + u_warmth * 0.03 - u_tint * 0.18,
1.0 - u_warmth * 0.16 + u_tint * 0.04
);
}
#ifndef AURUM_LINEAR
vec3 toneGamma(vec3 c) {
float lc = luma(clamp(c, 0.0, 1.0));
if (abs(u_highlights) > 0.001) {
float m = smoothstep(0.42, 1.0, lc);
c += u_highlights * m * (u_highlights > 0.0 ? (1.0 - c) : c) * 0.6;
}
if (abs(u_shadows) > 0.001) {
float m = 1.0 - smoothstep(0.0, 0.58, lc);
c += u_shadows * m * (u_shadows > 0.0 ? (1.0 - c) : c) * 0.6;
}
if (abs(u_whites) > 0.001 || abs(u_blacks) > 0.001) {
float black = -u_blacks * 0.16;
float white = 1.0 - u_whites * 0.16;
c = (c - black) / max(0.08, white - black);
}
return clamp(c, 0.0, 1.0);
}
#endif
#ifdef AURUM_LINEAR
vec3 toneLinear(vec3 c) {
c = clamp(c, 0.0, 1.0);
float lc = luma(c);
if (lc < 0.000001) return c;
float lp = linearToSrgb1(lc);
float t = lp;
if (abs(u_highlights) > 0.001) {
float m = smoothstep(0.42, 1.0, lp);
t += u_highlights * m * (u_highlights > 0.0 ? (1.0 - lp) : lp) * 0.6;
}
if (abs(u_shadows) > 0.001) {
float m = 1.0 - smoothstep(0.0, 0.58, lp);
t += u_shadows * m * (u_shadows > 0.0 ? (1.0 - lp) : lp) * 0.6;
}
if (abs(u_whites) > 0.001 || abs(u_blacks) > 0.001) {
float black = -u_blacks * 0.16;
float white = 1.0 - u_whites * 0.16;
t = (t - black) / max(0.08, white - black);
}
float target = srgbToLinear1(clamp(t, 0.0, 1.0));
c *= target / lc;
return clamp(c, 0.0, 1.0);
}
#endif
float skinWeight(vec3 c, vec2 uv) {
float y = luma(c);
float cb = -0.168736 * c.r - 0.331264 * c.g + 0.5 * c.b + 0.5;
float cr = 0.5 * c.r - 0.418688 * c.g - 0.081312 * c.b + 0.5;
float m =
smoothstep(0.30, 0.38, cr) * (1.0 - smoothstep(0.60, 0.70, cr)) *
smoothstep(0.28, 0.36, cb) * (1.0 - smoothstep(0.54, 0.64, cb)) *
smoothstep(0.10, 0.22, y) * (1.0 - smoothstep(0.90, 1.0, y));
float face = 0.0;
for (int i = 0; i < 4; i++) {
if (i >= u_faceCount) break;
vec4 f = u_faces[i];
vec2 p = (uv - f.xy) / max(f.zw, vec2(0.0001));
face = max(face, 1.0 - smoothstep(0.72, 1.0, length(p)));
}
return clamp(max(m, face * 0.9), 0.0, 1.0);
}
vec3 rgb2hsv(vec3 c) {
vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
float d = q.x - min(q.w, q.y);
float e = 1.0e-10;
return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c) {
vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
void addBand(
float hue, float center, float width, vec3 shift,
inout float dh, inout float ds, inout float dl, inout float wsum
) {
float d = abs(mod(hue - center + 540.0, 360.0) - 180.0);
float w = 1.0 - smoothstep(width * 0.55, width, d);
if (w > 0.0001) {
dh += shift.x * w;
ds += shift.y * w;
dl += shift.z * w;
wsum += w;
}
}
vec3 sampleLUT(vec3 c) {
float size = u_lutSize;
float slice = c.b * (size - 1.0);
float s0 = floor(slice);
float s1 = min(s0 + 1.0, size - 1.0);
float f = slice - s0;
float y = (c.g * (size - 1.0) + 0.5) / size;
float x0 = (s0 * size + c.r * (size - 1.0) + 0.5) / (size * size);
float x1 = (s1 * size + c.r * (size - 1.0) + 0.5) / (size * size);
vec3 a = texture2D(u_lut, vec2(x0, y)).rgb;
vec3 b = texture2D(u_lut, vec2(x1, y)).rgb;
return mix(a, b, f);
}
float bayer2(vec2 a) {
a = floor(a);
return fract(a.x * 0.5 + a.y * a.y * 0.75);
}
float bayer4(vec2 a) {
return bayer2(0.5 * a) * 0.25 + bayer2(a);
}
void main() {
vec2 uv = warpFace(v_uv);
vec4 texel = texture2D(u_texture, uv);
vec3 c = texel.rgb;
float lc = luma(c);
if (u_denoise > 0.001) {
float sigma = 0.022 + u_denoise * 0.09;
float invSigma2 = 1.0 / max(0.0001, sigma * sigma);
vec3 acc = c;
float wsum = 1.0;
vec2 o = u_texel * (1.0 + u_quality * 1.5);
addTap(uv, vec2(o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, -o.y), lc, invSigma2, acc, wsum);
if (u_quality > 0.5) {
addTap(uv, vec2(o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(o.x, -o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, -o.y), lc, invSigma2, acc, wsum);
}
c = mix(c, acc / wsum, u_denoise * 0.9);
lc = luma(c);
}
if (abs(u_clarity) > 0.001) {
vec2 o = u_texel * (4.0 + u_quality * 6.0);
vec3 blur = c;
blur += texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb;
blur += texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb;
blur += texture2D(u_texture, uv + vec2(0.0, o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb;
if (u_quality > 0.5) {
blur += texture2D(u_texture, uv + vec2(o.x, o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(-o.x, o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(o.x, -o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(-o.x, -o.y)).rgb;
blur /= 9.0;
} else {
blur /= 5.0;
}
float detail = clamp(lc - luma(blur), -0.18, 0.18);
float mid = 1.0 - smoothstep(0.72, 1.0, lc) * 0.55;
c += detail * u_clarity * 1.25 * mid;
lc = luma(c);
}
if (u_sharpen > 0.001) {
vec2 o = u_texel;
float lb =
luma(texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb) +
luma(texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb) +
luma(texture2D(u_texture, uv + vec2(0.0, o.y)).rgb) +
luma(texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb);
float detail = clamp(lc - lb * 0.25, -0.2, 0.2);
float mask = smoothstep(0.006, 0.022, abs(detail));
c += detail * mask * u_sharpen * 2.2;
lc = luma(c);
}
if (
u_smoothSkin > 0.001 ||
abs(u_skinTone) > 0.001 ||
u_blemish > 0.001
) {
float skin = skinWeight(c, uv);
float protect = 0.0;
float lips = 0.0;
#ifdef AURUM_BEAUTY_MASK
if (u_hasMask > 0.5) {
vec3 m = texture2D(u_mask, uv).rgb;
skin = m.r;
protect = m.g;
lips = m.b;
}
#endif
float mask = clamp(skin * (1.0 - protect), 0.0, 1.0);
if (mask > 0.01) {
vec3 base = c;
if (u_smoothSkin > 0.001) {
float invSigma2 = 1.0 / (0.045 * 0.045);
vec3 acc = c;
float wsum = 1.0;
vec2 o = vec2(0.0045);
addTap(uv, vec2(o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, -o.y), lc, invSigma2, acc, wsum);
if (u_quality > 0.5) {
addTap(uv, vec2(o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(o.x, -o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, -o.y), lc, invSigma2, acc, wsum);
}
vec3 soft = acc / wsum;
float detail = length(base - soft);
float keep = smoothstep(0.025, 0.14, detail);
float preserve = mix(0.35, 0.95, u_skinTexture);
float strength = mask * u_smoothSkin * 0.92;
c = mix(base, soft, strength * (1.0 - keep * preserve));
c += (base - soft) * (u_skinTexture * 0.3 * strength);
}
if (u_blemish > 0.001) {
vec2 o = vec2(0.011);
vec3 avg = texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb;
avg += texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb;
avg += texture2D(u_texture, uv + vec2(0.0, o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(o.x, o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(-o.x, o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(o.x, -o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(-o.x, -o.y)).rgb;
avg *= 0.125;
float dark = smoothstep(0.02, 0.07, luma(avg) - lc);
vec3 delta = c - avg;
float red = smoothstep(0.035, 0.11, delta.r - max(delta.g, delta.b));
float spot = max(dark, red * 0.85);
c = mix(c, avg, mask * u_blemish * spot * 0.85);
}
if (abs(u_skinTone) > 0.001) {
vec3 target = u_skinTone > 0.0
? c * vec3(1.035, 1.005, 0.965)
: c * vec3(0.975, 1.0, 1.025);
c = mix(c, target, mask * abs(u_skinTone) * 0.7 * (1.0 - lips * 0.45));
}
lc = luma(c);
}
}
c = clamp(u_color * c + u_offset, 0.0, 1.0);
vec3 wb = whiteBalance();
#ifdef AURUM_LINEAR
c = toLinear(c) * wb;
c *= pow(2.0, u_exposure);
float L = max(luma(c), 0.000001);
if (L > 1.0) {
c *= (1.0 - (1.0 - 1.0 / L) * 0.35) / L;
}
c = toneLinear(c);
c = toSrgb(c);
#else
c *= wb;
c *= pow(2.0, u_exposure);
#endif
c += u_brightness * 0.22;
c = (c - 0.5) * max(0.05, 1.0 + u_contrast) + 0.5;
c = clamp(c, 0.0, 1.0);
lc = luma(c);
c = mix(vec3(lc), c, max(0.0, 1.0 + u_saturation));
if (abs(u_vibrance) > 0.001) {
float mx = max(c.r, max(c.g, c.b));
float mn = min(c.r, min(c.g, c.b));
float sat = mx - mn;
float boost = 1.0 + u_vibrance * (1.0 - smoothstep(0.0, 0.55, sat)) * 0.9;
lc = luma(c);
c = mix(vec3(lc), c, max(0.0, boost));
}
#ifndef AURUM_LINEAR
c = toneGamma(c);
#endif
if (abs(u_gamma) > 0.001) {
c = pow(c, vec3(1.0 / max(0.2, 1.0 + u_gamma * 0.8)));
}
if (u_hasCurve > 0.5) {
c.r = texture2D(u_curve, vec2(clamp(c.r, 0.0, 1.0), 0.5)).r;
c.g = texture2D(u_curve, vec2(clamp(c.g, 0.0, 1.0), 0.5)).g;
c.b = texture2D(u_curve, vec2(clamp(c.b, 0.0, 1.0), 0.5)).b;
}
if (
abs(u_hsl[0].x) + abs(u_hsl[0].y) + abs(u_hsl[0].z) +
abs(u_hsl[1].x) + abs(u_hsl[1].y) + abs(u_hsl[1].z) +
abs(u_hsl[2].x) + abs(u_hsl[2].y) + abs(u_hsl[2].z) +
abs(u_hsl[3].x) + abs(u_hsl[3].y) + abs(u_hsl[3].z) +
abs(u_hsl[4].x) + abs(u_hsl[4].y) + abs(u_hsl[4].z) +
abs(u_hsl[5].x) + abs(u_hsl[5].y) + abs(u_hsl[5].z) +
abs(u_hsl[6].x) + abs(u_hsl[6].y) + abs(u_hsl[6].z) +
abs(u_hsl[7].x) + abs(u_hsl[7].y) + abs(u_hsl[7].z) > 0.001
) {
vec3 hsv = rgb2hsv(clamp(c, 0.0, 1.0));
float hue = hsv.x * 360.0;
float dh = 0.0;
float ds = 0.0;
float dl = 0.0;
float wsum = 0.0;
addBand(hue, 0.0, 42.0, u_hsl[0], dh, ds, dl, wsum);
addBand(hue, 30.0, 36.0, u_hsl[1], dh, ds, dl, wsum);
addBand(hue, 60.0, 42.0, u_hsl[2], dh, ds, dl, wsum);
addBand(hue, 120.0, 60.0, u_hsl[3], dh, ds, dl, wsum);
addBand(hue, 180.0, 54.0, u_hsl[4], dh, ds, dl, wsum);
addBand(hue, 240.0, 54.0, u_hsl[5], dh, ds, dl, wsum);
addBand(hue, 285.0, 42.0, u_hsl[6], dh, ds, dl, wsum);
addBand(hue, 320.0, 42.0, u_hsl[7], dh, ds, dl, wsum);
if (wsum > 0.001) {
hsv.x = fract(hsv.x + (dh / max(1.0, wsum)) * 0.0833);
hsv.y = clamp(hsv.y * (1.0 + (ds / max(1.0, wsum)) * 0.85), 0.0, 1.0);
hsv.z = clamp(hsv.z * (1.0 + (dl / max(1.0, wsum)) * 0.5), 0.0, 1.0);
c = hsv2rgb(hsv);
}
}
if (u_lutStrength > 0.001) {
c = mix(c, sampleLUT(clamp(c, 0.0, 1.0)), u_lutStrength);
}
c = clamp(c, 0.0, 1.0);
vec2 p = (v_screen - u_vigCenter) / max(u_vigHalf, vec2(0.0001));
float d = length(vec2(p.x * u_aspect, p.y)) / sqrt(u_aspect * u_aspect + 1.0);
float v = smoothstep(0.34, 1.0, d) * u_vignette * 0.88;
c *= (1.0 - v);
if (u_dither > 0.001) {
float b = bayer4(gl_FragCoord.xy) * 1.0666667 - 0.5;
c += b * (u_dither / 255.0);
}
gl_FragColor = vec4(clamp(c, 0.0, 1.0), texel.a);
}
`,"base-linear":`#define AURUM_LINEAR 1
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D u_texture;
uniform sampler2D u_curve;
uniform sampler2D u_lut;
#ifdef AURUM_BEAUTY_MASK
uniform sampler2D u_mask;
uniform float u_hasMask;
#endif
#ifdef AURUM_LIQUIFY
uniform sampler2D u_liquify;
uniform float u_liquifyShift;
#endif
uniform mat3 u_color;
uniform vec3 u_offset;
uniform float u_vignette;
uniform float u_aspect;
uniform vec2 u_vigCenter;
uniform vec2 u_vigHalf;
uniform vec2 u_texel;
uniform float u_dither;
uniform float u_exposure;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_saturation;
uniform float u_highlights;
uniform float u_shadows;
uniform float u_whites;
uniform float u_blacks;
uniform float u_warmth;
uniform float u_tint;
uniform float u_vibrance;
uniform float u_gamma;
uniform float u_clarity;
uniform float u_sharpen;
uniform float u_denoise;
uniform float u_smoothSkin;
uniform float u_blemish;
uniform float u_skinTexture;
uniform float u_skinTone;
uniform float u_hasCurve;
uniform float u_lutStrength;
uniform float u_lutSize;
uniform float u_quality;
uniform vec4 u_faces[4];
uniform int u_faceCount;
uniform sampler2D u_anchors;
uniform float u_hasAnchors;
uniform vec3 u_hsl[8];
uniform float u_faceSlim;
uniform float u_jawline;
uniform float u_chin;
uniform float u_eyeSize;
uniform float u_noseSize;
uniform float u_mouthSize;
varying vec2 v_uv;
varying vec2 v_screen;
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
#ifdef AURUM_LINEAR
float srgbToLinear1(float v) {
v = clamp(v, 0.0, 1.0);
return v <= 0.04045 ? v / 12.92 : pow((v + 0.055) / 1.055, 2.4);
}
float linearToSrgb1(float v) {
v = clamp(v, 0.0, 1.0);
return v <= 0.0031308 ? v * 12.92 : 1.055 * pow(v, 1.0 / 2.4) - 0.055;
}
vec3 toLinear(vec3 c) {
return vec3(srgbToLinear1(c.r), srgbToLinear1(c.g), srgbToLinear1(c.b));
}
vec3 toSrgb(vec3 c) {
return vec3(linearToSrgb1(c.r), linearToSrgb1(c.g), linearToSrgb1(c.b));
}
#endif
vec2 warpFace(vec2 uv) {
#ifdef AURUM_LIQUIFY
if (u_liquifyShift > 0.00001) {
vec2 pushed = (texture2D(u_liquify, uv).rg * 255.0 - 128.0) * (u_liquifyShift / 127.0);
uv = clamp(uv + pushed, 0.0, 1.0);
}
#endif
if (
abs(u_faceSlim) + abs(u_jawline) + abs(u_chin) +
abs(u_eyeSize) + abs(u_noseSize) + abs(u_mouthSize) < 0.001
) return uv;
for (int i = 0; i < 4; i++) {
if (i >= u_faceCount) break;
vec4 f = u_faces[i];
vec2 halfSize = max(f.zw / vec2(1.24, 1.44), vec2(0.0001));
vec2 center = f.xy;
vec2 l = (uv - center) / halfSize;
float ell = clamp(1.0 - dot(l, l), 0.0, 1.0);
if (ell <= 0.0001) continue;
float soft = ell * ell;
vec2 eyeL = vec2(-0.34, -0.18);
vec2 eyeR = vec2(0.34, -0.18);
vec2 nose = vec2(0.0, 0.10);
vec2 mouth = vec2(0.0, 0.40);
vec2 eyeLR = vec2(0.22, 0.16);
vec2 eyeRR = vec2(0.22, 0.16);
vec2 noseR = vec2(0.20, 0.24);
vec2 mouthR = vec2(0.30, 0.16);
if (u_hasAnchors > 0.5) {
float ay = (float(i) + 0.5) * 0.25;
vec4 a0 = texture2D(u_anchors, vec2(0.125, ay));
vec4 a1 = texture2D(u_anchors, vec2(0.375, ay));
vec4 a2 = texture2D(u_anchors, vec2(0.625, ay));
vec4 a3 = texture2D(u_anchors, vec2(0.875, ay));
eyeL = a0.xy * 2.0 - 1.0;
eyeR = a0.zw * 2.0 - 1.0;
nose = a1.xy * 2.0 - 1.0;
mouth = a1.zw * 2.0 - 1.0;
eyeLR = max(a2.xy * 0.6, vec2(0.02));
eyeRR = max(a2.zw * 0.6, vec2(0.02));
noseR = max(a3.xy * 0.6, vec2(0.02));
mouthR = max(a3.zw * 0.6, vec2(0.02));
}
float squeeze =
u_faceSlim * 0.16 +
u_jawline * 0.14 * smoothstep(-0.05, 0.75, l.y);
uv.x += squeeze * l.x * soft * halfSize.x;
float chinBand = smoothstep(0.0, 0.65, l.y) * exp(-l.x * l.x * 3.0);
uv.y -= u_chin * 0.14 * chinBand * ell * halfSize.y;
if (abs(u_eyeSize) > 0.001) {
vec2 dL = (l - eyeL) / eyeLR;
vec2 dR = (l - eyeR) / eyeRR;
float fL = clamp(1.0 - dot(dL, dL), 0.0, 1.0);
float fR = clamp(1.0 - dot(dR, dR), 0.0, 1.0);
fL *= fL;
fR *= fR;
uv -= (uv - (center + eyeL * halfSize)) * u_eyeSize * 0.28 * fL;
uv -= (uv - (center + eyeR * halfSize)) * u_eyeSize * 0.28 * fR;
}
if (abs(u_noseSize) > 0.001) {
vec2 dN = (l - nose) / noseR;
float fN = clamp(1.0 - dot(dN, dN), 0.0, 1.0);
fN *= fN;
uv -= (uv - (center + nose * halfSize)) * u_noseSize * 0.26 * fN;
}
if (abs(u_mouthSize) > 0.001) {
vec2 dM = (l - mouth) / mouthR;
float fM = clamp(1.0 - dot(dM, dM), 0.0, 1.0);
fM *= fM;
uv -= (uv - (center + mouth * halfSize)) * u_mouthSize * 0.24 * fM;
}
}
return clamp(uv, 0.0, 1.0);
}
void addTap(vec2 base, vec2 offset, float centerLuma, float invSigma2, inout vec3 acc, inout float wsum) {
vec3 s = texture2D(u_texture, base + offset).rgb;
float dl = luma(s) - centerLuma;
float w = exp(-dl * dl * invSigma2);
acc += s * w;
wsum += w;
}
vec3 whiteBalance() {
return vec3(
1.0 + u_warmth * 0.16 + u_tint * 0.04,
1.0 + u_warmth * 0.03 - u_tint * 0.18,
1.0 - u_warmth * 0.16 + u_tint * 0.04
);
}
#ifndef AURUM_LINEAR
vec3 toneGamma(vec3 c) {
float lc = luma(clamp(c, 0.0, 1.0));
if (abs(u_highlights) > 0.001) {
float m = smoothstep(0.42, 1.0, lc);
c += u_highlights * m * (u_highlights > 0.0 ? (1.0 - c) : c) * 0.6;
}
if (abs(u_shadows) > 0.001) {
float m = 1.0 - smoothstep(0.0, 0.58, lc);
c += u_shadows * m * (u_shadows > 0.0 ? (1.0 - c) : c) * 0.6;
}
if (abs(u_whites) > 0.001 || abs(u_blacks) > 0.001) {
float black = -u_blacks * 0.16;
float white = 1.0 - u_whites * 0.16;
c = (c - black) / max(0.08, white - black);
}
return clamp(c, 0.0, 1.0);
}
#endif
#ifdef AURUM_LINEAR
vec3 toneLinear(vec3 c) {
c = clamp(c, 0.0, 1.0);
float lc = luma(c);
if (lc < 0.000001) return c;
float lp = linearToSrgb1(lc);
float t = lp;
if (abs(u_highlights) > 0.001) {
float m = smoothstep(0.42, 1.0, lp);
t += u_highlights * m * (u_highlights > 0.0 ? (1.0 - lp) : lp) * 0.6;
}
if (abs(u_shadows) > 0.001) {
float m = 1.0 - smoothstep(0.0, 0.58, lp);
t += u_shadows * m * (u_shadows > 0.0 ? (1.0 - lp) : lp) * 0.6;
}
if (abs(u_whites) > 0.001 || abs(u_blacks) > 0.001) {
float black = -u_blacks * 0.16;
float white = 1.0 - u_whites * 0.16;
t = (t - black) / max(0.08, white - black);
}
float target = srgbToLinear1(clamp(t, 0.0, 1.0));
c *= target / lc;
return clamp(c, 0.0, 1.0);
}
#endif
float skinWeight(vec3 c, vec2 uv) {
float y = luma(c);
float cb = -0.168736 * c.r - 0.331264 * c.g + 0.5 * c.b + 0.5;
float cr = 0.5 * c.r - 0.418688 * c.g - 0.081312 * c.b + 0.5;
float m =
smoothstep(0.30, 0.38, cr) * (1.0 - smoothstep(0.60, 0.70, cr)) *
smoothstep(0.28, 0.36, cb) * (1.0 - smoothstep(0.54, 0.64, cb)) *
smoothstep(0.10, 0.22, y) * (1.0 - smoothstep(0.90, 1.0, y));
float face = 0.0;
for (int i = 0; i < 4; i++) {
if (i >= u_faceCount) break;
vec4 f = u_faces[i];
vec2 p = (uv - f.xy) / max(f.zw, vec2(0.0001));
face = max(face, 1.0 - smoothstep(0.72, 1.0, length(p)));
}
return clamp(max(m, face * 0.9), 0.0, 1.0);
}
vec3 rgb2hsv(vec3 c) {
vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
float d = q.x - min(q.w, q.y);
float e = 1.0e-10;
return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c) {
vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
void addBand(
float hue, float center, float width, vec3 shift,
inout float dh, inout float ds, inout float dl, inout float wsum
) {
float d = abs(mod(hue - center + 540.0, 360.0) - 180.0);
float w = 1.0 - smoothstep(width * 0.55, width, d);
if (w > 0.0001) {
dh += shift.x * w;
ds += shift.y * w;
dl += shift.z * w;
wsum += w;
}
}
vec3 sampleLUT(vec3 c) {
float size = u_lutSize;
float slice = c.b * (size - 1.0);
float s0 = floor(slice);
float s1 = min(s0 + 1.0, size - 1.0);
float f = slice - s0;
float y = (c.g * (size - 1.0) + 0.5) / size;
float x0 = (s0 * size + c.r * (size - 1.0) + 0.5) / (size * size);
float x1 = (s1 * size + c.r * (size - 1.0) + 0.5) / (size * size);
vec3 a = texture2D(u_lut, vec2(x0, y)).rgb;
vec3 b = texture2D(u_lut, vec2(x1, y)).rgb;
return mix(a, b, f);
}
float bayer2(vec2 a) {
a = floor(a);
return fract(a.x * 0.5 + a.y * a.y * 0.75);
}
float bayer4(vec2 a) {
return bayer2(0.5 * a) * 0.25 + bayer2(a);
}
void main() {
vec2 uv = warpFace(v_uv);
vec4 texel = texture2D(u_texture, uv);
vec3 c = texel.rgb;
float lc = luma(c);
if (u_denoise > 0.001) {
float sigma = 0.022 + u_denoise * 0.09;
float invSigma2 = 1.0 / max(0.0001, sigma * sigma);
vec3 acc = c;
float wsum = 1.0;
vec2 o = u_texel * (1.0 + u_quality * 1.5);
addTap(uv, vec2(o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, -o.y), lc, invSigma2, acc, wsum);
if (u_quality > 0.5) {
addTap(uv, vec2(o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(o.x, -o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, -o.y), lc, invSigma2, acc, wsum);
}
c = mix(c, acc / wsum, u_denoise * 0.9);
lc = luma(c);
}
if (abs(u_clarity) > 0.001) {
vec2 o = u_texel * (4.0 + u_quality * 6.0);
vec3 blur = c;
blur += texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb;
blur += texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb;
blur += texture2D(u_texture, uv + vec2(0.0, o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb;
if (u_quality > 0.5) {
blur += texture2D(u_texture, uv + vec2(o.x, o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(-o.x, o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(o.x, -o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(-o.x, -o.y)).rgb;
blur /= 9.0;
} else {
blur /= 5.0;
}
float detail = clamp(lc - luma(blur), -0.18, 0.18);
float mid = 1.0 - smoothstep(0.72, 1.0, lc) * 0.55;
c += detail * u_clarity * 1.25 * mid;
lc = luma(c);
}
if (u_sharpen > 0.001) {
vec2 o = u_texel;
float lb =
luma(texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb) +
luma(texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb) +
luma(texture2D(u_texture, uv + vec2(0.0, o.y)).rgb) +
luma(texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb);
float detail = clamp(lc - lb * 0.25, -0.2, 0.2);
float mask = smoothstep(0.006, 0.022, abs(detail));
c += detail * mask * u_sharpen * 2.2;
lc = luma(c);
}
if (
u_smoothSkin > 0.001 ||
abs(u_skinTone) > 0.001 ||
u_blemish > 0.001
) {
float skin = skinWeight(c, uv);
float protect = 0.0;
float lips = 0.0;
#ifdef AURUM_BEAUTY_MASK
if (u_hasMask > 0.5) {
vec3 m = texture2D(u_mask, uv).rgb;
skin = m.r;
protect = m.g;
lips = m.b;
}
#endif
float mask = clamp(skin * (1.0 - protect), 0.0, 1.0);
if (mask > 0.01) {
vec3 base = c;
if (u_smoothSkin > 0.001) {
float invSigma2 = 1.0 / (0.045 * 0.045);
vec3 acc = c;
float wsum = 1.0;
vec2 o = vec2(0.0045);
addTap(uv, vec2(o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, -o.y), lc, invSigma2, acc, wsum);
if (u_quality > 0.5) {
addTap(uv, vec2(o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(o.x, -o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, -o.y), lc, invSigma2, acc, wsum);
}
vec3 soft = acc / wsum;
float detail = length(base - soft);
float keep = smoothstep(0.025, 0.14, detail);
float preserve = mix(0.35, 0.95, u_skinTexture);
float strength = mask * u_smoothSkin * 0.92;
c = mix(base, soft, strength * (1.0 - keep * preserve));
c += (base - soft) * (u_skinTexture * 0.3 * strength);
}
if (u_blemish > 0.001) {
vec2 o = vec2(0.011);
vec3 avg = texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb;
avg += texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb;
avg += texture2D(u_texture, uv + vec2(0.0, o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(o.x, o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(-o.x, o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(o.x, -o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(-o.x, -o.y)).rgb;
avg *= 0.125;
float dark = smoothstep(0.02, 0.07, luma(avg) - lc);
vec3 delta = c - avg;
float red = smoothstep(0.035, 0.11, delta.r - max(delta.g, delta.b));
float spot = max(dark, red * 0.85);
c = mix(c, avg, mask * u_blemish * spot * 0.85);
}
if (abs(u_skinTone) > 0.001) {
vec3 target = u_skinTone > 0.0
? c * vec3(1.035, 1.005, 0.965)
: c * vec3(0.975, 1.0, 1.025);
c = mix(c, target, mask * abs(u_skinTone) * 0.7 * (1.0 - lips * 0.45));
}
lc = luma(c);
}
}
c = clamp(u_color * c + u_offset, 0.0, 1.0);
vec3 wb = whiteBalance();
#ifdef AURUM_LINEAR
c = toLinear(c) * wb;
c *= pow(2.0, u_exposure);
float L = max(luma(c), 0.000001);
if (L > 1.0) {
c *= (1.0 - (1.0 - 1.0 / L) * 0.35) / L;
}
c = toneLinear(c);
c = toSrgb(c);
#else
c *= wb;
c *= pow(2.0, u_exposure);
#endif
c += u_brightness * 0.22;
c = (c - 0.5) * max(0.05, 1.0 + u_contrast) + 0.5;
c = clamp(c, 0.0, 1.0);
lc = luma(c);
c = mix(vec3(lc), c, max(0.0, 1.0 + u_saturation));
if (abs(u_vibrance) > 0.001) {
float mx = max(c.r, max(c.g, c.b));
float mn = min(c.r, min(c.g, c.b));
float sat = mx - mn;
float boost = 1.0 + u_vibrance * (1.0 - smoothstep(0.0, 0.55, sat)) * 0.9;
lc = luma(c);
c = mix(vec3(lc), c, max(0.0, boost));
}
#ifndef AURUM_LINEAR
c = toneGamma(c);
#endif
if (abs(u_gamma) > 0.001) {
c = pow(c, vec3(1.0 / max(0.2, 1.0 + u_gamma * 0.8)));
}
if (u_hasCurve > 0.5) {
c.r = texture2D(u_curve, vec2(clamp(c.r, 0.0, 1.0), 0.5)).r;
c.g = texture2D(u_curve, vec2(clamp(c.g, 0.0, 1.0), 0.5)).g;
c.b = texture2D(u_curve, vec2(clamp(c.b, 0.0, 1.0), 0.5)).b;
}
if (
abs(u_hsl[0].x) + abs(u_hsl[0].y) + abs(u_hsl[0].z) +
abs(u_hsl[1].x) + abs(u_hsl[1].y) + abs(u_hsl[1].z) +
abs(u_hsl[2].x) + abs(u_hsl[2].y) + abs(u_hsl[2].z) +
abs(u_hsl[3].x) + abs(u_hsl[3].y) + abs(u_hsl[3].z) +
abs(u_hsl[4].x) + abs(u_hsl[4].y) + abs(u_hsl[4].z) +
abs(u_hsl[5].x) + abs(u_hsl[5].y) + abs(u_hsl[5].z) +
abs(u_hsl[6].x) + abs(u_hsl[6].y) + abs(u_hsl[6].z) +
abs(u_hsl[7].x) + abs(u_hsl[7].y) + abs(u_hsl[7].z) > 0.001
) {
vec3 hsv = rgb2hsv(clamp(c, 0.0, 1.0));
float hue = hsv.x * 360.0;
float dh = 0.0;
float ds = 0.0;
float dl = 0.0;
float wsum = 0.0;
addBand(hue, 0.0, 42.0, u_hsl[0], dh, ds, dl, wsum);
addBand(hue, 30.0, 36.0, u_hsl[1], dh, ds, dl, wsum);
addBand(hue, 60.0, 42.0, u_hsl[2], dh, ds, dl, wsum);
addBand(hue, 120.0, 60.0, u_hsl[3], dh, ds, dl, wsum);
addBand(hue, 180.0, 54.0, u_hsl[4], dh, ds, dl, wsum);
addBand(hue, 240.0, 54.0, u_hsl[5], dh, ds, dl, wsum);
addBand(hue, 285.0, 42.0, u_hsl[6], dh, ds, dl, wsum);
addBand(hue, 320.0, 42.0, u_hsl[7], dh, ds, dl, wsum);
if (wsum > 0.001) {
hsv.x = fract(hsv.x + (dh / max(1.0, wsum)) * 0.0833);
hsv.y = clamp(hsv.y * (1.0 + (ds / max(1.0, wsum)) * 0.85), 0.0, 1.0);
hsv.z = clamp(hsv.z * (1.0 + (dl / max(1.0, wsum)) * 0.5), 0.0, 1.0);
c = hsv2rgb(hsv);
}
}
if (u_lutStrength > 0.001) {
c = mix(c, sampleLUT(clamp(c, 0.0, 1.0)), u_lutStrength);
}
c = clamp(c, 0.0, 1.0);
vec2 p = (v_screen - u_vigCenter) / max(u_vigHalf, vec2(0.0001));
float d = length(vec2(p.x * u_aspect, p.y)) / sqrt(u_aspect * u_aspect + 1.0);
float v = smoothstep(0.34, 1.0, d) * u_vignette * 0.88;
c *= (1.0 - v);
if (u_dither > 0.001) {
float b = bayer4(gl_FragCoord.xy) * 1.0666667 - 0.5;
c += b * (u_dither / 255.0);
}
gl_FragColor = vec4(clamp(c, 0.0, 1.0), texel.a);
}
`,beauty:`#define AURUM_LINEAR 1
#define AURUM_BEAUTY_MASK 1
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D u_texture;
uniform sampler2D u_curve;
uniform sampler2D u_lut;
#ifdef AURUM_BEAUTY_MASK
uniform sampler2D u_mask;
uniform float u_hasMask;
#endif
#ifdef AURUM_LIQUIFY
uniform sampler2D u_liquify;
uniform float u_liquifyShift;
#endif
uniform mat3 u_color;
uniform vec3 u_offset;
uniform float u_vignette;
uniform float u_aspect;
uniform vec2 u_vigCenter;
uniform vec2 u_vigHalf;
uniform vec2 u_texel;
uniform float u_dither;
uniform float u_exposure;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_saturation;
uniform float u_highlights;
uniform float u_shadows;
uniform float u_whites;
uniform float u_blacks;
uniform float u_warmth;
uniform float u_tint;
uniform float u_vibrance;
uniform float u_gamma;
uniform float u_clarity;
uniform float u_sharpen;
uniform float u_denoise;
uniform float u_smoothSkin;
uniform float u_blemish;
uniform float u_skinTexture;
uniform float u_skinTone;
uniform float u_hasCurve;
uniform float u_lutStrength;
uniform float u_lutSize;
uniform float u_quality;
uniform vec4 u_faces[4];
uniform int u_faceCount;
uniform sampler2D u_anchors;
uniform float u_hasAnchors;
uniform vec3 u_hsl[8];
uniform float u_faceSlim;
uniform float u_jawline;
uniform float u_chin;
uniform float u_eyeSize;
uniform float u_noseSize;
uniform float u_mouthSize;
varying vec2 v_uv;
varying vec2 v_screen;
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
#ifdef AURUM_LINEAR
float srgbToLinear1(float v) {
v = clamp(v, 0.0, 1.0);
return v <= 0.04045 ? v / 12.92 : pow((v + 0.055) / 1.055, 2.4);
}
float linearToSrgb1(float v) {
v = clamp(v, 0.0, 1.0);
return v <= 0.0031308 ? v * 12.92 : 1.055 * pow(v, 1.0 / 2.4) - 0.055;
}
vec3 toLinear(vec3 c) {
return vec3(srgbToLinear1(c.r), srgbToLinear1(c.g), srgbToLinear1(c.b));
}
vec3 toSrgb(vec3 c) {
return vec3(linearToSrgb1(c.r), linearToSrgb1(c.g), linearToSrgb1(c.b));
}
#endif
vec2 warpFace(vec2 uv) {
#ifdef AURUM_LIQUIFY
if (u_liquifyShift > 0.00001) {
vec2 pushed = (texture2D(u_liquify, uv).rg * 255.0 - 128.0) * (u_liquifyShift / 127.0);
uv = clamp(uv + pushed, 0.0, 1.0);
}
#endif
if (
abs(u_faceSlim) + abs(u_jawline) + abs(u_chin) +
abs(u_eyeSize) + abs(u_noseSize) + abs(u_mouthSize) < 0.001
) return uv;
for (int i = 0; i < 4; i++) {
if (i >= u_faceCount) break;
vec4 f = u_faces[i];
vec2 halfSize = max(f.zw / vec2(1.24, 1.44), vec2(0.0001));
vec2 center = f.xy;
vec2 l = (uv - center) / halfSize;
float ell = clamp(1.0 - dot(l, l), 0.0, 1.0);
if (ell <= 0.0001) continue;
float soft = ell * ell;
vec2 eyeL = vec2(-0.34, -0.18);
vec2 eyeR = vec2(0.34, -0.18);
vec2 nose = vec2(0.0, 0.10);
vec2 mouth = vec2(0.0, 0.40);
vec2 eyeLR = vec2(0.22, 0.16);
vec2 eyeRR = vec2(0.22, 0.16);
vec2 noseR = vec2(0.20, 0.24);
vec2 mouthR = vec2(0.30, 0.16);
if (u_hasAnchors > 0.5) {
float ay = (float(i) + 0.5) * 0.25;
vec4 a0 = texture2D(u_anchors, vec2(0.125, ay));
vec4 a1 = texture2D(u_anchors, vec2(0.375, ay));
vec4 a2 = texture2D(u_anchors, vec2(0.625, ay));
vec4 a3 = texture2D(u_anchors, vec2(0.875, ay));
eyeL = a0.xy * 2.0 - 1.0;
eyeR = a0.zw * 2.0 - 1.0;
nose = a1.xy * 2.0 - 1.0;
mouth = a1.zw * 2.0 - 1.0;
eyeLR = max(a2.xy * 0.6, vec2(0.02));
eyeRR = max(a2.zw * 0.6, vec2(0.02));
noseR = max(a3.xy * 0.6, vec2(0.02));
mouthR = max(a3.zw * 0.6, vec2(0.02));
}
float squeeze =
u_faceSlim * 0.16 +
u_jawline * 0.14 * smoothstep(-0.05, 0.75, l.y);
uv.x += squeeze * l.x * soft * halfSize.x;
float chinBand = smoothstep(0.0, 0.65, l.y) * exp(-l.x * l.x * 3.0);
uv.y -= u_chin * 0.14 * chinBand * ell * halfSize.y;
if (abs(u_eyeSize) > 0.001) {
vec2 dL = (l - eyeL) / eyeLR;
vec2 dR = (l - eyeR) / eyeRR;
float fL = clamp(1.0 - dot(dL, dL), 0.0, 1.0);
float fR = clamp(1.0 - dot(dR, dR), 0.0, 1.0);
fL *= fL;
fR *= fR;
uv -= (uv - (center + eyeL * halfSize)) * u_eyeSize * 0.28 * fL;
uv -= (uv - (center + eyeR * halfSize)) * u_eyeSize * 0.28 * fR;
}
if (abs(u_noseSize) > 0.001) {
vec2 dN = (l - nose) / noseR;
float fN = clamp(1.0 - dot(dN, dN), 0.0, 1.0);
fN *= fN;
uv -= (uv - (center + nose * halfSize)) * u_noseSize * 0.26 * fN;
}
if (abs(u_mouthSize) > 0.001) {
vec2 dM = (l - mouth) / mouthR;
float fM = clamp(1.0 - dot(dM, dM), 0.0, 1.0);
fM *= fM;
uv -= (uv - (center + mouth * halfSize)) * u_mouthSize * 0.24 * fM;
}
}
return clamp(uv, 0.0, 1.0);
}
void addTap(vec2 base, vec2 offset, float centerLuma, float invSigma2, inout vec3 acc, inout float wsum) {
vec3 s = texture2D(u_texture, base + offset).rgb;
float dl = luma(s) - centerLuma;
float w = exp(-dl * dl * invSigma2);
acc += s * w;
wsum += w;
}
vec3 whiteBalance() {
return vec3(
1.0 + u_warmth * 0.16 + u_tint * 0.04,
1.0 + u_warmth * 0.03 - u_tint * 0.18,
1.0 - u_warmth * 0.16 + u_tint * 0.04
);
}
#ifndef AURUM_LINEAR
vec3 toneGamma(vec3 c) {
float lc = luma(clamp(c, 0.0, 1.0));
if (abs(u_highlights) > 0.001) {
float m = smoothstep(0.42, 1.0, lc);
c += u_highlights * m * (u_highlights > 0.0 ? (1.0 - c) : c) * 0.6;
}
if (abs(u_shadows) > 0.001) {
float m = 1.0 - smoothstep(0.0, 0.58, lc);
c += u_shadows * m * (u_shadows > 0.0 ? (1.0 - c) : c) * 0.6;
}
if (abs(u_whites) > 0.001 || abs(u_blacks) > 0.001) {
float black = -u_blacks * 0.16;
float white = 1.0 - u_whites * 0.16;
c = (c - black) / max(0.08, white - black);
}
return clamp(c, 0.0, 1.0);
}
#endif
#ifdef AURUM_LINEAR
vec3 toneLinear(vec3 c) {
c = clamp(c, 0.0, 1.0);
float lc = luma(c);
if (lc < 0.000001) return c;
float lp = linearToSrgb1(lc);
float t = lp;
if (abs(u_highlights) > 0.001) {
float m = smoothstep(0.42, 1.0, lp);
t += u_highlights * m * (u_highlights > 0.0 ? (1.0 - lp) : lp) * 0.6;
}
if (abs(u_shadows) > 0.001) {
float m = 1.0 - smoothstep(0.0, 0.58, lp);
t += u_shadows * m * (u_shadows > 0.0 ? (1.0 - lp) : lp) * 0.6;
}
if (abs(u_whites) > 0.001 || abs(u_blacks) > 0.001) {
float black = -u_blacks * 0.16;
float white = 1.0 - u_whites * 0.16;
t = (t - black) / max(0.08, white - black);
}
float target = srgbToLinear1(clamp(t, 0.0, 1.0));
c *= target / lc;
return clamp(c, 0.0, 1.0);
}
#endif
float skinWeight(vec3 c, vec2 uv) {
float y = luma(c);
float cb = -0.168736 * c.r - 0.331264 * c.g + 0.5 * c.b + 0.5;
float cr = 0.5 * c.r - 0.418688 * c.g - 0.081312 * c.b + 0.5;
float m =
smoothstep(0.30, 0.38, cr) * (1.0 - smoothstep(0.60, 0.70, cr)) *
smoothstep(0.28, 0.36, cb) * (1.0 - smoothstep(0.54, 0.64, cb)) *
smoothstep(0.10, 0.22, y) * (1.0 - smoothstep(0.90, 1.0, y));
float face = 0.0;
for (int i = 0; i < 4; i++) {
if (i >= u_faceCount) break;
vec4 f = u_faces[i];
vec2 p = (uv - f.xy) / max(f.zw, vec2(0.0001));
face = max(face, 1.0 - smoothstep(0.72, 1.0, length(p)));
}
return clamp(max(m, face * 0.9), 0.0, 1.0);
}
vec3 rgb2hsv(vec3 c) {
vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
float d = q.x - min(q.w, q.y);
float e = 1.0e-10;
return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c) {
vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
void addBand(
float hue, float center, float width, vec3 shift,
inout float dh, inout float ds, inout float dl, inout float wsum
) {
float d = abs(mod(hue - center + 540.0, 360.0) - 180.0);
float w = 1.0 - smoothstep(width * 0.55, width, d);
if (w > 0.0001) {
dh += shift.x * w;
ds += shift.y * w;
dl += shift.z * w;
wsum += w;
}
}
vec3 sampleLUT(vec3 c) {
float size = u_lutSize;
float slice = c.b * (size - 1.0);
float s0 = floor(slice);
float s1 = min(s0 + 1.0, size - 1.0);
float f = slice - s0;
float y = (c.g * (size - 1.0) + 0.5) / size;
float x0 = (s0 * size + c.r * (size - 1.0) + 0.5) / (size * size);
float x1 = (s1 * size + c.r * (size - 1.0) + 0.5) / (size * size);
vec3 a = texture2D(u_lut, vec2(x0, y)).rgb;
vec3 b = texture2D(u_lut, vec2(x1, y)).rgb;
return mix(a, b, f);
}
float bayer2(vec2 a) {
a = floor(a);
return fract(a.x * 0.5 + a.y * a.y * 0.75);
}
float bayer4(vec2 a) {
return bayer2(0.5 * a) * 0.25 + bayer2(a);
}
void main() {
vec2 uv = warpFace(v_uv);
vec4 texel = texture2D(u_texture, uv);
vec3 c = texel.rgb;
float lc = luma(c);
if (u_denoise > 0.001) {
float sigma = 0.022 + u_denoise * 0.09;
float invSigma2 = 1.0 / max(0.0001, sigma * sigma);
vec3 acc = c;
float wsum = 1.0;
vec2 o = u_texel * (1.0 + u_quality * 1.5);
addTap(uv, vec2(o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, -o.y), lc, invSigma2, acc, wsum);
if (u_quality > 0.5) {
addTap(uv, vec2(o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(o.x, -o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, -o.y), lc, invSigma2, acc, wsum);
}
c = mix(c, acc / wsum, u_denoise * 0.9);
lc = luma(c);
}
if (abs(u_clarity) > 0.001) {
vec2 o = u_texel * (4.0 + u_quality * 6.0);
vec3 blur = c;
blur += texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb;
blur += texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb;
blur += texture2D(u_texture, uv + vec2(0.0, o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb;
if (u_quality > 0.5) {
blur += texture2D(u_texture, uv + vec2(o.x, o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(-o.x, o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(o.x, -o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(-o.x, -o.y)).rgb;
blur /= 9.0;
} else {
blur /= 5.0;
}
float detail = clamp(lc - luma(blur), -0.18, 0.18);
float mid = 1.0 - smoothstep(0.72, 1.0, lc) * 0.55;
c += detail * u_clarity * 1.25 * mid;
lc = luma(c);
}
if (u_sharpen > 0.001) {
vec2 o = u_texel;
float lb =
luma(texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb) +
luma(texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb) +
luma(texture2D(u_texture, uv + vec2(0.0, o.y)).rgb) +
luma(texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb);
float detail = clamp(lc - lb * 0.25, -0.2, 0.2);
float mask = smoothstep(0.006, 0.022, abs(detail));
c += detail * mask * u_sharpen * 2.2;
lc = luma(c);
}
if (
u_smoothSkin > 0.001 ||
abs(u_skinTone) > 0.001 ||
u_blemish > 0.001
) {
float skin = skinWeight(c, uv);
float protect = 0.0;
float lips = 0.0;
#ifdef AURUM_BEAUTY_MASK
if (u_hasMask > 0.5) {
vec3 m = texture2D(u_mask, uv).rgb;
skin = m.r;
protect = m.g;
lips = m.b;
}
#endif
float mask = clamp(skin * (1.0 - protect), 0.0, 1.0);
if (mask > 0.01) {
vec3 base = c;
if (u_smoothSkin > 0.001) {
float invSigma2 = 1.0 / (0.045 * 0.045);
vec3 acc = c;
float wsum = 1.0;
vec2 o = vec2(0.0045);
addTap(uv, vec2(o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, -o.y), lc, invSigma2, acc, wsum);
if (u_quality > 0.5) {
addTap(uv, vec2(o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(o.x, -o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, -o.y), lc, invSigma2, acc, wsum);
}
vec3 soft = acc / wsum;
float detail = length(base - soft);
float keep = smoothstep(0.025, 0.14, detail);
float preserve = mix(0.35, 0.95, u_skinTexture);
float strength = mask * u_smoothSkin * 0.92;
c = mix(base, soft, strength * (1.0 - keep * preserve));
c += (base - soft) * (u_skinTexture * 0.3 * strength);
}
if (u_blemish > 0.001) {
vec2 o = vec2(0.011);
vec3 avg = texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb;
avg += texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb;
avg += texture2D(u_texture, uv + vec2(0.0, o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(o.x, o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(-o.x, o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(o.x, -o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(-o.x, -o.y)).rgb;
avg *= 0.125;
float dark = smoothstep(0.02, 0.07, luma(avg) - lc);
vec3 delta = c - avg;
float red = smoothstep(0.035, 0.11, delta.r - max(delta.g, delta.b));
float spot = max(dark, red * 0.85);
c = mix(c, avg, mask * u_blemish * spot * 0.85);
}
if (abs(u_skinTone) > 0.001) {
vec3 target = u_skinTone > 0.0
? c * vec3(1.035, 1.005, 0.965)
: c * vec3(0.975, 1.0, 1.025);
c = mix(c, target, mask * abs(u_skinTone) * 0.7 * (1.0 - lips * 0.45));
}
lc = luma(c);
}
}
c = clamp(u_color * c + u_offset, 0.0, 1.0);
vec3 wb = whiteBalance();
#ifdef AURUM_LINEAR
c = toLinear(c) * wb;
c *= pow(2.0, u_exposure);
float L = max(luma(c), 0.000001);
if (L > 1.0) {
c *= (1.0 - (1.0 - 1.0 / L) * 0.35) / L;
}
c = toneLinear(c);
c = toSrgb(c);
#else
c *= wb;
c *= pow(2.0, u_exposure);
#endif
c += u_brightness * 0.22;
c = (c - 0.5) * max(0.05, 1.0 + u_contrast) + 0.5;
c = clamp(c, 0.0, 1.0);
lc = luma(c);
c = mix(vec3(lc), c, max(0.0, 1.0 + u_saturation));
if (abs(u_vibrance) > 0.001) {
float mx = max(c.r, max(c.g, c.b));
float mn = min(c.r, min(c.g, c.b));
float sat = mx - mn;
float boost = 1.0 + u_vibrance * (1.0 - smoothstep(0.0, 0.55, sat)) * 0.9;
lc = luma(c);
c = mix(vec3(lc), c, max(0.0, boost));
}
#ifndef AURUM_LINEAR
c = toneGamma(c);
#endif
if (abs(u_gamma) > 0.001) {
c = pow(c, vec3(1.0 / max(0.2, 1.0 + u_gamma * 0.8)));
}
if (u_hasCurve > 0.5) {
c.r = texture2D(u_curve, vec2(clamp(c.r, 0.0, 1.0), 0.5)).r;
c.g = texture2D(u_curve, vec2(clamp(c.g, 0.0, 1.0), 0.5)).g;
c.b = texture2D(u_curve, vec2(clamp(c.b, 0.0, 1.0), 0.5)).b;
}
if (
abs(u_hsl[0].x) + abs(u_hsl[0].y) + abs(u_hsl[0].z) +
abs(u_hsl[1].x) + abs(u_hsl[1].y) + abs(u_hsl[1].z) +
abs(u_hsl[2].x) + abs(u_hsl[2].y) + abs(u_hsl[2].z) +
abs(u_hsl[3].x) + abs(u_hsl[3].y) + abs(u_hsl[3].z) +
abs(u_hsl[4].x) + abs(u_hsl[4].y) + abs(u_hsl[4].z) +
abs(u_hsl[5].x) + abs(u_hsl[5].y) + abs(u_hsl[5].z) +
abs(u_hsl[6].x) + abs(u_hsl[6].y) + abs(u_hsl[6].z) +
abs(u_hsl[7].x) + abs(u_hsl[7].y) + abs(u_hsl[7].z) > 0.001
) {
vec3 hsv = rgb2hsv(clamp(c, 0.0, 1.0));
float hue = hsv.x * 360.0;
float dh = 0.0;
float ds = 0.0;
float dl = 0.0;
float wsum = 0.0;
addBand(hue, 0.0, 42.0, u_hsl[0], dh, ds, dl, wsum);
addBand(hue, 30.0, 36.0, u_hsl[1], dh, ds, dl, wsum);
addBand(hue, 60.0, 42.0, u_hsl[2], dh, ds, dl, wsum);
addBand(hue, 120.0, 60.0, u_hsl[3], dh, ds, dl, wsum);
addBand(hue, 180.0, 54.0, u_hsl[4], dh, ds, dl, wsum);
addBand(hue, 240.0, 54.0, u_hsl[5], dh, ds, dl, wsum);
addBand(hue, 285.0, 42.0, u_hsl[6], dh, ds, dl, wsum);
addBand(hue, 320.0, 42.0, u_hsl[7], dh, ds, dl, wsum);
if (wsum > 0.001) {
hsv.x = fract(hsv.x + (dh / max(1.0, wsum)) * 0.0833);
hsv.y = clamp(hsv.y * (1.0 + (ds / max(1.0, wsum)) * 0.85), 0.0, 1.0);
hsv.z = clamp(hsv.z * (1.0 + (dl / max(1.0, wsum)) * 0.5), 0.0, 1.0);
c = hsv2rgb(hsv);
}
}
if (u_lutStrength > 0.001) {
c = mix(c, sampleLUT(clamp(c, 0.0, 1.0)), u_lutStrength);
}
c = clamp(c, 0.0, 1.0);
vec2 p = (v_screen - u_vigCenter) / max(u_vigHalf, vec2(0.0001));
float d = length(vec2(p.x * u_aspect, p.y)) / sqrt(u_aspect * u_aspect + 1.0);
float v = smoothstep(0.34, 1.0, d) * u_vignette * 0.88;
c *= (1.0 - v);
if (u_dither > 0.001) {
float b = bayer4(gl_FragCoord.xy) * 1.0666667 - 0.5;
c += b * (u_dither / 255.0);
}
gl_FragColor = vec4(clamp(c, 0.0, 1.0), texel.a);
}
`,"beauty-liquify":`#define AURUM_LINEAR 1
#define AURUM_BEAUTY_MASK 1
#define AURUM_LIQUIFY 1
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D u_texture;
uniform sampler2D u_curve;
uniform sampler2D u_lut;
#ifdef AURUM_BEAUTY_MASK
uniform sampler2D u_mask;
uniform float u_hasMask;
#endif
#ifdef AURUM_LIQUIFY
uniform sampler2D u_liquify;
uniform float u_liquifyShift;
#endif
uniform mat3 u_color;
uniform vec3 u_offset;
uniform float u_vignette;
uniform float u_aspect;
uniform vec2 u_vigCenter;
uniform vec2 u_vigHalf;
uniform vec2 u_texel;
uniform float u_dither;
uniform float u_exposure;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_saturation;
uniform float u_highlights;
uniform float u_shadows;
uniform float u_whites;
uniform float u_blacks;
uniform float u_warmth;
uniform float u_tint;
uniform float u_vibrance;
uniform float u_gamma;
uniform float u_clarity;
uniform float u_sharpen;
uniform float u_denoise;
uniform float u_smoothSkin;
uniform float u_blemish;
uniform float u_skinTexture;
uniform float u_skinTone;
uniform float u_hasCurve;
uniform float u_lutStrength;
uniform float u_lutSize;
uniform float u_quality;
uniform vec4 u_faces[4];
uniform int u_faceCount;
uniform sampler2D u_anchors;
uniform float u_hasAnchors;
uniform vec3 u_hsl[8];
uniform float u_faceSlim;
uniform float u_jawline;
uniform float u_chin;
uniform float u_eyeSize;
uniform float u_noseSize;
uniform float u_mouthSize;
varying vec2 v_uv;
varying vec2 v_screen;
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
#ifdef AURUM_LINEAR
float srgbToLinear1(float v) {
v = clamp(v, 0.0, 1.0);
return v <= 0.04045 ? v / 12.92 : pow((v + 0.055) / 1.055, 2.4);
}
float linearToSrgb1(float v) {
v = clamp(v, 0.0, 1.0);
return v <= 0.0031308 ? v * 12.92 : 1.055 * pow(v, 1.0 / 2.4) - 0.055;
}
vec3 toLinear(vec3 c) {
return vec3(srgbToLinear1(c.r), srgbToLinear1(c.g), srgbToLinear1(c.b));
}
vec3 toSrgb(vec3 c) {
return vec3(linearToSrgb1(c.r), linearToSrgb1(c.g), linearToSrgb1(c.b));
}
#endif
vec2 warpFace(vec2 uv) {
#ifdef AURUM_LIQUIFY
if (u_liquifyShift > 0.00001) {
vec2 pushed = (texture2D(u_liquify, uv).rg * 255.0 - 128.0) * (u_liquifyShift / 127.0);
uv = clamp(uv + pushed, 0.0, 1.0);
}
#endif
if (
abs(u_faceSlim) + abs(u_jawline) + abs(u_chin) +
abs(u_eyeSize) + abs(u_noseSize) + abs(u_mouthSize) < 0.001
) return uv;
for (int i = 0; i < 4; i++) {
if (i >= u_faceCount) break;
vec4 f = u_faces[i];
vec2 halfSize = max(f.zw / vec2(1.24, 1.44), vec2(0.0001));
vec2 center = f.xy;
vec2 l = (uv - center) / halfSize;
float ell = clamp(1.0 - dot(l, l), 0.0, 1.0);
if (ell <= 0.0001) continue;
float soft = ell * ell;
vec2 eyeL = vec2(-0.34, -0.18);
vec2 eyeR = vec2(0.34, -0.18);
vec2 nose = vec2(0.0, 0.10);
vec2 mouth = vec2(0.0, 0.40);
vec2 eyeLR = vec2(0.22, 0.16);
vec2 eyeRR = vec2(0.22, 0.16);
vec2 noseR = vec2(0.20, 0.24);
vec2 mouthR = vec2(0.30, 0.16);
if (u_hasAnchors > 0.5) {
float ay = (float(i) + 0.5) * 0.25;
vec4 a0 = texture2D(u_anchors, vec2(0.125, ay));
vec4 a1 = texture2D(u_anchors, vec2(0.375, ay));
vec4 a2 = texture2D(u_anchors, vec2(0.625, ay));
vec4 a3 = texture2D(u_anchors, vec2(0.875, ay));
eyeL = a0.xy * 2.0 - 1.0;
eyeR = a0.zw * 2.0 - 1.0;
nose = a1.xy * 2.0 - 1.0;
mouth = a1.zw * 2.0 - 1.0;
eyeLR = max(a2.xy * 0.6, vec2(0.02));
eyeRR = max(a2.zw * 0.6, vec2(0.02));
noseR = max(a3.xy * 0.6, vec2(0.02));
mouthR = max(a3.zw * 0.6, vec2(0.02));
}
float squeeze =
u_faceSlim * 0.16 +
u_jawline * 0.14 * smoothstep(-0.05, 0.75, l.y);
uv.x += squeeze * l.x * soft * halfSize.x;
float chinBand = smoothstep(0.0, 0.65, l.y) * exp(-l.x * l.x * 3.0);
uv.y -= u_chin * 0.14 * chinBand * ell * halfSize.y;
if (abs(u_eyeSize) > 0.001) {
vec2 dL = (l - eyeL) / eyeLR;
vec2 dR = (l - eyeR) / eyeRR;
float fL = clamp(1.0 - dot(dL, dL), 0.0, 1.0);
float fR = clamp(1.0 - dot(dR, dR), 0.0, 1.0);
fL *= fL;
fR *= fR;
uv -= (uv - (center + eyeL * halfSize)) * u_eyeSize * 0.28 * fL;
uv -= (uv - (center + eyeR * halfSize)) * u_eyeSize * 0.28 * fR;
}
if (abs(u_noseSize) > 0.001) {
vec2 dN = (l - nose) / noseR;
float fN = clamp(1.0 - dot(dN, dN), 0.0, 1.0);
fN *= fN;
uv -= (uv - (center + nose * halfSize)) * u_noseSize * 0.26 * fN;
}
if (abs(u_mouthSize) > 0.001) {
vec2 dM = (l - mouth) / mouthR;
float fM = clamp(1.0 - dot(dM, dM), 0.0, 1.0);
fM *= fM;
uv -= (uv - (center + mouth * halfSize)) * u_mouthSize * 0.24 * fM;
}
}
return clamp(uv, 0.0, 1.0);
}
void addTap(vec2 base, vec2 offset, float centerLuma, float invSigma2, inout vec3 acc, inout float wsum) {
vec3 s = texture2D(u_texture, base + offset).rgb;
float dl = luma(s) - centerLuma;
float w = exp(-dl * dl * invSigma2);
acc += s * w;
wsum += w;
}
vec3 whiteBalance() {
return vec3(
1.0 + u_warmth * 0.16 + u_tint * 0.04,
1.0 + u_warmth * 0.03 - u_tint * 0.18,
1.0 - u_warmth * 0.16 + u_tint * 0.04
);
}
#ifndef AURUM_LINEAR
vec3 toneGamma(vec3 c) {
float lc = luma(clamp(c, 0.0, 1.0));
if (abs(u_highlights) > 0.001) {
float m = smoothstep(0.42, 1.0, lc);
c += u_highlights * m * (u_highlights > 0.0 ? (1.0 - c) : c) * 0.6;
}
if (abs(u_shadows) > 0.001) {
float m = 1.0 - smoothstep(0.0, 0.58, lc);
c += u_shadows * m * (u_shadows > 0.0 ? (1.0 - c) : c) * 0.6;
}
if (abs(u_whites) > 0.001 || abs(u_blacks) > 0.001) {
float black = -u_blacks * 0.16;
float white = 1.0 - u_whites * 0.16;
c = (c - black) / max(0.08, white - black);
}
return clamp(c, 0.0, 1.0);
}
#endif
#ifdef AURUM_LINEAR
vec3 toneLinear(vec3 c) {
c = clamp(c, 0.0, 1.0);
float lc = luma(c);
if (lc < 0.000001) return c;
float lp = linearToSrgb1(lc);
float t = lp;
if (abs(u_highlights) > 0.001) {
float m = smoothstep(0.42, 1.0, lp);
t += u_highlights * m * (u_highlights > 0.0 ? (1.0 - lp) : lp) * 0.6;
}
if (abs(u_shadows) > 0.001) {
float m = 1.0 - smoothstep(0.0, 0.58, lp);
t += u_shadows * m * (u_shadows > 0.0 ? (1.0 - lp) : lp) * 0.6;
}
if (abs(u_whites) > 0.001 || abs(u_blacks) > 0.001) {
float black = -u_blacks * 0.16;
float white = 1.0 - u_whites * 0.16;
t = (t - black) / max(0.08, white - black);
}
float target = srgbToLinear1(clamp(t, 0.0, 1.0));
c *= target / lc;
return clamp(c, 0.0, 1.0);
}
#endif
float skinWeight(vec3 c, vec2 uv) {
float y = luma(c);
float cb = -0.168736 * c.r - 0.331264 * c.g + 0.5 * c.b + 0.5;
float cr = 0.5 * c.r - 0.418688 * c.g - 0.081312 * c.b + 0.5;
float m =
smoothstep(0.30, 0.38, cr) * (1.0 - smoothstep(0.60, 0.70, cr)) *
smoothstep(0.28, 0.36, cb) * (1.0 - smoothstep(0.54, 0.64, cb)) *
smoothstep(0.10, 0.22, y) * (1.0 - smoothstep(0.90, 1.0, y));
float face = 0.0;
for (int i = 0; i < 4; i++) {
if (i >= u_faceCount) break;
vec4 f = u_faces[i];
vec2 p = (uv - f.xy) / max(f.zw, vec2(0.0001));
face = max(face, 1.0 - smoothstep(0.72, 1.0, length(p)));
}
return clamp(max(m, face * 0.9), 0.0, 1.0);
}
vec3 rgb2hsv(vec3 c) {
vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
float d = q.x - min(q.w, q.y);
float e = 1.0e-10;
return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c) {
vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
void addBand(
float hue, float center, float width, vec3 shift,
inout float dh, inout float ds, inout float dl, inout float wsum
) {
float d = abs(mod(hue - center + 540.0, 360.0) - 180.0);
float w = 1.0 - smoothstep(width * 0.55, width, d);
if (w > 0.0001) {
dh += shift.x * w;
ds += shift.y * w;
dl += shift.z * w;
wsum += w;
}
}
vec3 sampleLUT(vec3 c) {
float size = u_lutSize;
float slice = c.b * (size - 1.0);
float s0 = floor(slice);
float s1 = min(s0 + 1.0, size - 1.0);
float f = slice - s0;
float y = (c.g * (size - 1.0) + 0.5) / size;
float x0 = (s0 * size + c.r * (size - 1.0) + 0.5) / (size * size);
float x1 = (s1 * size + c.r * (size - 1.0) + 0.5) / (size * size);
vec3 a = texture2D(u_lut, vec2(x0, y)).rgb;
vec3 b = texture2D(u_lut, vec2(x1, y)).rgb;
return mix(a, b, f);
}
float bayer2(vec2 a) {
a = floor(a);
return fract(a.x * 0.5 + a.y * a.y * 0.75);
}
float bayer4(vec2 a) {
return bayer2(0.5 * a) * 0.25 + bayer2(a);
}
void main() {
vec2 uv = warpFace(v_uv);
vec4 texel = texture2D(u_texture, uv);
vec3 c = texel.rgb;
float lc = luma(c);
if (u_denoise > 0.001) {
float sigma = 0.022 + u_denoise * 0.09;
float invSigma2 = 1.0 / max(0.0001, sigma * sigma);
vec3 acc = c;
float wsum = 1.0;
vec2 o = u_texel * (1.0 + u_quality * 1.5);
addTap(uv, vec2(o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, -o.y), lc, invSigma2, acc, wsum);
if (u_quality > 0.5) {
addTap(uv, vec2(o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(o.x, -o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, -o.y), lc, invSigma2, acc, wsum);
}
c = mix(c, acc / wsum, u_denoise * 0.9);
lc = luma(c);
}
if (abs(u_clarity) > 0.001) {
vec2 o = u_texel * (4.0 + u_quality * 6.0);
vec3 blur = c;
blur += texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb;
blur += texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb;
blur += texture2D(u_texture, uv + vec2(0.0, o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb;
if (u_quality > 0.5) {
blur += texture2D(u_texture, uv + vec2(o.x, o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(-o.x, o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(o.x, -o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(-o.x, -o.y)).rgb;
blur /= 9.0;
} else {
blur /= 5.0;
}
float detail = clamp(lc - luma(blur), -0.18, 0.18);
float mid = 1.0 - smoothstep(0.72, 1.0, lc) * 0.55;
c += detail * u_clarity * 1.25 * mid;
lc = luma(c);
}
if (u_sharpen > 0.001) {
vec2 o = u_texel;
float lb =
luma(texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb) +
luma(texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb) +
luma(texture2D(u_texture, uv + vec2(0.0, o.y)).rgb) +
luma(texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb);
float detail = clamp(lc - lb * 0.25, -0.2, 0.2);
float mask = smoothstep(0.006, 0.022, abs(detail));
c += detail * mask * u_sharpen * 2.2;
lc = luma(c);
}
if (
u_smoothSkin > 0.001 ||
abs(u_skinTone) > 0.001 ||
u_blemish > 0.001
) {
float skin = skinWeight(c, uv);
float protect = 0.0;
float lips = 0.0;
#ifdef AURUM_BEAUTY_MASK
if (u_hasMask > 0.5) {
vec3 m = texture2D(u_mask, uv).rgb;
skin = m.r;
protect = m.g;
lips = m.b;
}
#endif
float mask = clamp(skin * (1.0 - protect), 0.0, 1.0);
if (mask > 0.01) {
vec3 base = c;
if (u_smoothSkin > 0.001) {
float invSigma2 = 1.0 / (0.045 * 0.045);
vec3 acc = c;
float wsum = 1.0;
vec2 o = vec2(0.0045);
addTap(uv, vec2(o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, -o.y), lc, invSigma2, acc, wsum);
if (u_quality > 0.5) {
addTap(uv, vec2(o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(o.x, -o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, -o.y), lc, invSigma2, acc, wsum);
}
vec3 soft = acc / wsum;
float detail = length(base - soft);
float keep = smoothstep(0.025, 0.14, detail);
float preserve = mix(0.35, 0.95, u_skinTexture);
float strength = mask * u_smoothSkin * 0.92;
c = mix(base, soft, strength * (1.0 - keep * preserve));
c += (base - soft) * (u_skinTexture * 0.3 * strength);
}
if (u_blemish > 0.001) {
vec2 o = vec2(0.011);
vec3 avg = texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb;
avg += texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb;
avg += texture2D(u_texture, uv + vec2(0.0, o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(o.x, o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(-o.x, o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(o.x, -o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(-o.x, -o.y)).rgb;
avg *= 0.125;
float dark = smoothstep(0.02, 0.07, luma(avg) - lc);
vec3 delta = c - avg;
float red = smoothstep(0.035, 0.11, delta.r - max(delta.g, delta.b));
float spot = max(dark, red * 0.85);
c = mix(c, avg, mask * u_blemish * spot * 0.85);
}
if (abs(u_skinTone) > 0.001) {
vec3 target = u_skinTone > 0.0
? c * vec3(1.035, 1.005, 0.965)
: c * vec3(0.975, 1.0, 1.025);
c = mix(c, target, mask * abs(u_skinTone) * 0.7 * (1.0 - lips * 0.45));
}
lc = luma(c);
}
}
c = clamp(u_color * c + u_offset, 0.0, 1.0);
vec3 wb = whiteBalance();
#ifdef AURUM_LINEAR
c = toLinear(c) * wb;
c *= pow(2.0, u_exposure);
float L = max(luma(c), 0.000001);
if (L > 1.0) {
c *= (1.0 - (1.0 - 1.0 / L) * 0.35) / L;
}
c = toneLinear(c);
c = toSrgb(c);
#else
c *= wb;
c *= pow(2.0, u_exposure);
#endif
c += u_brightness * 0.22;
c = (c - 0.5) * max(0.05, 1.0 + u_contrast) + 0.5;
c = clamp(c, 0.0, 1.0);
lc = luma(c);
c = mix(vec3(lc), c, max(0.0, 1.0 + u_saturation));
if (abs(u_vibrance) > 0.001) {
float mx = max(c.r, max(c.g, c.b));
float mn = min(c.r, min(c.g, c.b));
float sat = mx - mn;
float boost = 1.0 + u_vibrance * (1.0 - smoothstep(0.0, 0.55, sat)) * 0.9;
lc = luma(c);
c = mix(vec3(lc), c, max(0.0, boost));
}
#ifndef AURUM_LINEAR
c = toneGamma(c);
#endif
if (abs(u_gamma) > 0.001) {
c = pow(c, vec3(1.0 / max(0.2, 1.0 + u_gamma * 0.8)));
}
if (u_hasCurve > 0.5) {
c.r = texture2D(u_curve, vec2(clamp(c.r, 0.0, 1.0), 0.5)).r;
c.g = texture2D(u_curve, vec2(clamp(c.g, 0.0, 1.0), 0.5)).g;
c.b = texture2D(u_curve, vec2(clamp(c.b, 0.0, 1.0), 0.5)).b;
}
if (
abs(u_hsl[0].x) + abs(u_hsl[0].y) + abs(u_hsl[0].z) +
abs(u_hsl[1].x) + abs(u_hsl[1].y) + abs(u_hsl[1].z) +
abs(u_hsl[2].x) + abs(u_hsl[2].y) + abs(u_hsl[2].z) +
abs(u_hsl[3].x) + abs(u_hsl[3].y) + abs(u_hsl[3].z) +
abs(u_hsl[4].x) + abs(u_hsl[4].y) + abs(u_hsl[4].z) +
abs(u_hsl[5].x) + abs(u_hsl[5].y) + abs(u_hsl[5].z) +
abs(u_hsl[6].x) + abs(u_hsl[6].y) + abs(u_hsl[6].z) +
abs(u_hsl[7].x) + abs(u_hsl[7].y) + abs(u_hsl[7].z) > 0.001
) {
vec3 hsv = rgb2hsv(clamp(c, 0.0, 1.0));
float hue = hsv.x * 360.0;
float dh = 0.0;
float ds = 0.0;
float dl = 0.0;
float wsum = 0.0;
addBand(hue, 0.0, 42.0, u_hsl[0], dh, ds, dl, wsum);
addBand(hue, 30.0, 36.0, u_hsl[1], dh, ds, dl, wsum);
addBand(hue, 60.0, 42.0, u_hsl[2], dh, ds, dl, wsum);
addBand(hue, 120.0, 60.0, u_hsl[3], dh, ds, dl, wsum);
addBand(hue, 180.0, 54.0, u_hsl[4], dh, ds, dl, wsum);
addBand(hue, 240.0, 54.0, u_hsl[5], dh, ds, dl, wsum);
addBand(hue, 285.0, 42.0, u_hsl[6], dh, ds, dl, wsum);
addBand(hue, 320.0, 42.0, u_hsl[7], dh, ds, dl, wsum);
if (wsum > 0.001) {
hsv.x = fract(hsv.x + (dh / max(1.0, wsum)) * 0.0833);
hsv.y = clamp(hsv.y * (1.0 + (ds / max(1.0, wsum)) * 0.85), 0.0, 1.0);
hsv.z = clamp(hsv.z * (1.0 + (dl / max(1.0, wsum)) * 0.5), 0.0, 1.0);
c = hsv2rgb(hsv);
}
}
if (u_lutStrength > 0.001) {
c = mix(c, sampleLUT(clamp(c, 0.0, 1.0)), u_lutStrength);
}
c = clamp(c, 0.0, 1.0);
vec2 p = (v_screen - u_vigCenter) / max(u_vigHalf, vec2(0.0001));
float d = length(vec2(p.x * u_aspect, p.y)) / sqrt(u_aspect * u_aspect + 1.0);
float v = smoothstep(0.34, 1.0, d) * u_vignette * 0.88;
c *= (1.0 - v);
if (u_dither > 0.001) {
float b = bayer4(gl_FragCoord.xy) * 1.0666667 - 0.5;
c += b * (u_dither / 255.0);
}
gl_FragColor = vec4(clamp(c, 0.0, 1.0), texel.a);
}
`,"base-liquify":`#define AURUM_LIQUIFY 1
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D u_texture;
uniform sampler2D u_curve;
uniform sampler2D u_lut;
#ifdef AURUM_BEAUTY_MASK
uniform sampler2D u_mask;
uniform float u_hasMask;
#endif
#ifdef AURUM_LIQUIFY
uniform sampler2D u_liquify;
uniform float u_liquifyShift;
#endif
uniform mat3 u_color;
uniform vec3 u_offset;
uniform float u_vignette;
uniform float u_aspect;
uniform vec2 u_vigCenter;
uniform vec2 u_vigHalf;
uniform vec2 u_texel;
uniform float u_dither;
uniform float u_exposure;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_saturation;
uniform float u_highlights;
uniform float u_shadows;
uniform float u_whites;
uniform float u_blacks;
uniform float u_warmth;
uniform float u_tint;
uniform float u_vibrance;
uniform float u_gamma;
uniform float u_clarity;
uniform float u_sharpen;
uniform float u_denoise;
uniform float u_smoothSkin;
uniform float u_blemish;
uniform float u_skinTexture;
uniform float u_skinTone;
uniform float u_hasCurve;
uniform float u_lutStrength;
uniform float u_lutSize;
uniform float u_quality;
uniform vec4 u_faces[4];
uniform int u_faceCount;
uniform sampler2D u_anchors;
uniform float u_hasAnchors;
uniform vec3 u_hsl[8];
uniform float u_faceSlim;
uniform float u_jawline;
uniform float u_chin;
uniform float u_eyeSize;
uniform float u_noseSize;
uniform float u_mouthSize;
varying vec2 v_uv;
varying vec2 v_screen;
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
#ifdef AURUM_LINEAR
float srgbToLinear1(float v) {
v = clamp(v, 0.0, 1.0);
return v <= 0.04045 ? v / 12.92 : pow((v + 0.055) / 1.055, 2.4);
}
float linearToSrgb1(float v) {
v = clamp(v, 0.0, 1.0);
return v <= 0.0031308 ? v * 12.92 : 1.055 * pow(v, 1.0 / 2.4) - 0.055;
}
vec3 toLinear(vec3 c) {
return vec3(srgbToLinear1(c.r), srgbToLinear1(c.g), srgbToLinear1(c.b));
}
vec3 toSrgb(vec3 c) {
return vec3(linearToSrgb1(c.r), linearToSrgb1(c.g), linearToSrgb1(c.b));
}
#endif
vec2 warpFace(vec2 uv) {
#ifdef AURUM_LIQUIFY
if (u_liquifyShift > 0.00001) {
vec2 pushed = (texture2D(u_liquify, uv).rg * 255.0 - 128.0) * (u_liquifyShift / 127.0);
uv = clamp(uv + pushed, 0.0, 1.0);
}
#endif
if (
abs(u_faceSlim) + abs(u_jawline) + abs(u_chin) +
abs(u_eyeSize) + abs(u_noseSize) + abs(u_mouthSize) < 0.001
) return uv;
for (int i = 0; i < 4; i++) {
if (i >= u_faceCount) break;
vec4 f = u_faces[i];
vec2 halfSize = max(f.zw / vec2(1.24, 1.44), vec2(0.0001));
vec2 center = f.xy;
vec2 l = (uv - center) / halfSize;
float ell = clamp(1.0 - dot(l, l), 0.0, 1.0);
if (ell <= 0.0001) continue;
float soft = ell * ell;
vec2 eyeL = vec2(-0.34, -0.18);
vec2 eyeR = vec2(0.34, -0.18);
vec2 nose = vec2(0.0, 0.10);
vec2 mouth = vec2(0.0, 0.40);
vec2 eyeLR = vec2(0.22, 0.16);
vec2 eyeRR = vec2(0.22, 0.16);
vec2 noseR = vec2(0.20, 0.24);
vec2 mouthR = vec2(0.30, 0.16);
if (u_hasAnchors > 0.5) {
float ay = (float(i) + 0.5) * 0.25;
vec4 a0 = texture2D(u_anchors, vec2(0.125, ay));
vec4 a1 = texture2D(u_anchors, vec2(0.375, ay));
vec4 a2 = texture2D(u_anchors, vec2(0.625, ay));
vec4 a3 = texture2D(u_anchors, vec2(0.875, ay));
eyeL = a0.xy * 2.0 - 1.0;
eyeR = a0.zw * 2.0 - 1.0;
nose = a1.xy * 2.0 - 1.0;
mouth = a1.zw * 2.0 - 1.0;
eyeLR = max(a2.xy * 0.6, vec2(0.02));
eyeRR = max(a2.zw * 0.6, vec2(0.02));
noseR = max(a3.xy * 0.6, vec2(0.02));
mouthR = max(a3.zw * 0.6, vec2(0.02));
}
float squeeze =
u_faceSlim * 0.16 +
u_jawline * 0.14 * smoothstep(-0.05, 0.75, l.y);
uv.x += squeeze * l.x * soft * halfSize.x;
float chinBand = smoothstep(0.0, 0.65, l.y) * exp(-l.x * l.x * 3.0);
uv.y -= u_chin * 0.14 * chinBand * ell * halfSize.y;
if (abs(u_eyeSize) > 0.001) {
vec2 dL = (l - eyeL) / eyeLR;
vec2 dR = (l - eyeR) / eyeRR;
float fL = clamp(1.0 - dot(dL, dL), 0.0, 1.0);
float fR = clamp(1.0 - dot(dR, dR), 0.0, 1.0);
fL *= fL;
fR *= fR;
uv -= (uv - (center + eyeL * halfSize)) * u_eyeSize * 0.28 * fL;
uv -= (uv - (center + eyeR * halfSize)) * u_eyeSize * 0.28 * fR;
}
if (abs(u_noseSize) > 0.001) {
vec2 dN = (l - nose) / noseR;
float fN = clamp(1.0 - dot(dN, dN), 0.0, 1.0);
fN *= fN;
uv -= (uv - (center + nose * halfSize)) * u_noseSize * 0.26 * fN;
}
if (abs(u_mouthSize) > 0.001) {
vec2 dM = (l - mouth) / mouthR;
float fM = clamp(1.0 - dot(dM, dM), 0.0, 1.0);
fM *= fM;
uv -= (uv - (center + mouth * halfSize)) * u_mouthSize * 0.24 * fM;
}
}
return clamp(uv, 0.0, 1.0);
}
void addTap(vec2 base, vec2 offset, float centerLuma, float invSigma2, inout vec3 acc, inout float wsum) {
vec3 s = texture2D(u_texture, base + offset).rgb;
float dl = luma(s) - centerLuma;
float w = exp(-dl * dl * invSigma2);
acc += s * w;
wsum += w;
}
vec3 whiteBalance() {
return vec3(
1.0 + u_warmth * 0.16 + u_tint * 0.04,
1.0 + u_warmth * 0.03 - u_tint * 0.18,
1.0 - u_warmth * 0.16 + u_tint * 0.04
);
}
#ifndef AURUM_LINEAR
vec3 toneGamma(vec3 c) {
float lc = luma(clamp(c, 0.0, 1.0));
if (abs(u_highlights) > 0.001) {
float m = smoothstep(0.42, 1.0, lc);
c += u_highlights * m * (u_highlights > 0.0 ? (1.0 - c) : c) * 0.6;
}
if (abs(u_shadows) > 0.001) {
float m = 1.0 - smoothstep(0.0, 0.58, lc);
c += u_shadows * m * (u_shadows > 0.0 ? (1.0 - c) : c) * 0.6;
}
if (abs(u_whites) > 0.001 || abs(u_blacks) > 0.001) {
float black = -u_blacks * 0.16;
float white = 1.0 - u_whites * 0.16;
c = (c - black) / max(0.08, white - black);
}
return clamp(c, 0.0, 1.0);
}
#endif
#ifdef AURUM_LINEAR
vec3 toneLinear(vec3 c) {
c = clamp(c, 0.0, 1.0);
float lc = luma(c);
if (lc < 0.000001) return c;
float lp = linearToSrgb1(lc);
float t = lp;
if (abs(u_highlights) > 0.001) {
float m = smoothstep(0.42, 1.0, lp);
t += u_highlights * m * (u_highlights > 0.0 ? (1.0 - lp) : lp) * 0.6;
}
if (abs(u_shadows) > 0.001) {
float m = 1.0 - smoothstep(0.0, 0.58, lp);
t += u_shadows * m * (u_shadows > 0.0 ? (1.0 - lp) : lp) * 0.6;
}
if (abs(u_whites) > 0.001 || abs(u_blacks) > 0.001) {
float black = -u_blacks * 0.16;
float white = 1.0 - u_whites * 0.16;
t = (t - black) / max(0.08, white - black);
}
float target = srgbToLinear1(clamp(t, 0.0, 1.0));
c *= target / lc;
return clamp(c, 0.0, 1.0);
}
#endif
float skinWeight(vec3 c, vec2 uv) {
float y = luma(c);
float cb = -0.168736 * c.r - 0.331264 * c.g + 0.5 * c.b + 0.5;
float cr = 0.5 * c.r - 0.418688 * c.g - 0.081312 * c.b + 0.5;
float m =
smoothstep(0.30, 0.38, cr) * (1.0 - smoothstep(0.60, 0.70, cr)) *
smoothstep(0.28, 0.36, cb) * (1.0 - smoothstep(0.54, 0.64, cb)) *
smoothstep(0.10, 0.22, y) * (1.0 - smoothstep(0.90, 1.0, y));
float face = 0.0;
for (int i = 0; i < 4; i++) {
if (i >= u_faceCount) break;
vec4 f = u_faces[i];
vec2 p = (uv - f.xy) / max(f.zw, vec2(0.0001));
face = max(face, 1.0 - smoothstep(0.72, 1.0, length(p)));
}
return clamp(max(m, face * 0.9), 0.0, 1.0);
}
vec3 rgb2hsv(vec3 c) {
vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
float d = q.x - min(q.w, q.y);
float e = 1.0e-10;
return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c) {
vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
void addBand(
float hue, float center, float width, vec3 shift,
inout float dh, inout float ds, inout float dl, inout float wsum
) {
float d = abs(mod(hue - center + 540.0, 360.0) - 180.0);
float w = 1.0 - smoothstep(width * 0.55, width, d);
if (w > 0.0001) {
dh += shift.x * w;
ds += shift.y * w;
dl += shift.z * w;
wsum += w;
}
}
vec3 sampleLUT(vec3 c) {
float size = u_lutSize;
float slice = c.b * (size - 1.0);
float s0 = floor(slice);
float s1 = min(s0 + 1.0, size - 1.0);
float f = slice - s0;
float y = (c.g * (size - 1.0) + 0.5) / size;
float x0 = (s0 * size + c.r * (size - 1.0) + 0.5) / (size * size);
float x1 = (s1 * size + c.r * (size - 1.0) + 0.5) / (size * size);
vec3 a = texture2D(u_lut, vec2(x0, y)).rgb;
vec3 b = texture2D(u_lut, vec2(x1, y)).rgb;
return mix(a, b, f);
}
float bayer2(vec2 a) {
a = floor(a);
return fract(a.x * 0.5 + a.y * a.y * 0.75);
}
float bayer4(vec2 a) {
return bayer2(0.5 * a) * 0.25 + bayer2(a);
}
void main() {
vec2 uv = warpFace(v_uv);
vec4 texel = texture2D(u_texture, uv);
vec3 c = texel.rgb;
float lc = luma(c);
if (u_denoise > 0.001) {
float sigma = 0.022 + u_denoise * 0.09;
float invSigma2 = 1.0 / max(0.0001, sigma * sigma);
vec3 acc = c;
float wsum = 1.0;
vec2 o = u_texel * (1.0 + u_quality * 1.5);
addTap(uv, vec2(o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, -o.y), lc, invSigma2, acc, wsum);
if (u_quality > 0.5) {
addTap(uv, vec2(o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(o.x, -o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, -o.y), lc, invSigma2, acc, wsum);
}
c = mix(c, acc / wsum, u_denoise * 0.9);
lc = luma(c);
}
if (abs(u_clarity) > 0.001) {
vec2 o = u_texel * (4.0 + u_quality * 6.0);
vec3 blur = c;
blur += texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb;
blur += texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb;
blur += texture2D(u_texture, uv + vec2(0.0, o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb;
if (u_quality > 0.5) {
blur += texture2D(u_texture, uv + vec2(o.x, o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(-o.x, o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(o.x, -o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(-o.x, -o.y)).rgb;
blur /= 9.0;
} else {
blur /= 5.0;
}
float detail = clamp(lc - luma(blur), -0.18, 0.18);
float mid = 1.0 - smoothstep(0.72, 1.0, lc) * 0.55;
c += detail * u_clarity * 1.25 * mid;
lc = luma(c);
}
if (u_sharpen > 0.001) {
vec2 o = u_texel;
float lb =
luma(texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb) +
luma(texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb) +
luma(texture2D(u_texture, uv + vec2(0.0, o.y)).rgb) +
luma(texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb);
float detail = clamp(lc - lb * 0.25, -0.2, 0.2);
float mask = smoothstep(0.006, 0.022, abs(detail));
c += detail * mask * u_sharpen * 2.2;
lc = luma(c);
}
if (
u_smoothSkin > 0.001 ||
abs(u_skinTone) > 0.001 ||
u_blemish > 0.001
) {
float skin = skinWeight(c, uv);
float protect = 0.0;
float lips = 0.0;
#ifdef AURUM_BEAUTY_MASK
if (u_hasMask > 0.5) {
vec3 m = texture2D(u_mask, uv).rgb;
skin = m.r;
protect = m.g;
lips = m.b;
}
#endif
float mask = clamp(skin * (1.0 - protect), 0.0, 1.0);
if (mask > 0.01) {
vec3 base = c;
if (u_smoothSkin > 0.001) {
float invSigma2 = 1.0 / (0.045 * 0.045);
vec3 acc = c;
float wsum = 1.0;
vec2 o = vec2(0.0045);
addTap(uv, vec2(o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, -o.y), lc, invSigma2, acc, wsum);
if (u_quality > 0.5) {
addTap(uv, vec2(o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(o.x, -o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, -o.y), lc, invSigma2, acc, wsum);
}
vec3 soft = acc / wsum;
float detail = length(base - soft);
float keep = smoothstep(0.025, 0.14, detail);
float preserve = mix(0.35, 0.95, u_skinTexture);
float strength = mask * u_smoothSkin * 0.92;
c = mix(base, soft, strength * (1.0 - keep * preserve));
c += (base - soft) * (u_skinTexture * 0.3 * strength);
}
if (u_blemish > 0.001) {
vec2 o = vec2(0.011);
vec3 avg = texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb;
avg += texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb;
avg += texture2D(u_texture, uv + vec2(0.0, o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(o.x, o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(-o.x, o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(o.x, -o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(-o.x, -o.y)).rgb;
avg *= 0.125;
float dark = smoothstep(0.02, 0.07, luma(avg) - lc);
vec3 delta = c - avg;
float red = smoothstep(0.035, 0.11, delta.r - max(delta.g, delta.b));
float spot = max(dark, red * 0.85);
c = mix(c, avg, mask * u_blemish * spot * 0.85);
}
if (abs(u_skinTone) > 0.001) {
vec3 target = u_skinTone > 0.0
? c * vec3(1.035, 1.005, 0.965)
: c * vec3(0.975, 1.0, 1.025);
c = mix(c, target, mask * abs(u_skinTone) * 0.7 * (1.0 - lips * 0.45));
}
lc = luma(c);
}
}
c = clamp(u_color * c + u_offset, 0.0, 1.0);
vec3 wb = whiteBalance();
#ifdef AURUM_LINEAR
c = toLinear(c) * wb;
c *= pow(2.0, u_exposure);
float L = max(luma(c), 0.000001);
if (L > 1.0) {
c *= (1.0 - (1.0 - 1.0 / L) * 0.35) / L;
}
c = toneLinear(c);
c = toSrgb(c);
#else
c *= wb;
c *= pow(2.0, u_exposure);
#endif
c += u_brightness * 0.22;
c = (c - 0.5) * max(0.05, 1.0 + u_contrast) + 0.5;
c = clamp(c, 0.0, 1.0);
lc = luma(c);
c = mix(vec3(lc), c, max(0.0, 1.0 + u_saturation));
if (abs(u_vibrance) > 0.001) {
float mx = max(c.r, max(c.g, c.b));
float mn = min(c.r, min(c.g, c.b));
float sat = mx - mn;
float boost = 1.0 + u_vibrance * (1.0 - smoothstep(0.0, 0.55, sat)) * 0.9;
lc = luma(c);
c = mix(vec3(lc), c, max(0.0, boost));
}
#ifndef AURUM_LINEAR
c = toneGamma(c);
#endif
if (abs(u_gamma) > 0.001) {
c = pow(c, vec3(1.0 / max(0.2, 1.0 + u_gamma * 0.8)));
}
if (u_hasCurve > 0.5) {
c.r = texture2D(u_curve, vec2(clamp(c.r, 0.0, 1.0), 0.5)).r;
c.g = texture2D(u_curve, vec2(clamp(c.g, 0.0, 1.0), 0.5)).g;
c.b = texture2D(u_curve, vec2(clamp(c.b, 0.0, 1.0), 0.5)).b;
}
if (
abs(u_hsl[0].x) + abs(u_hsl[0].y) + abs(u_hsl[0].z) +
abs(u_hsl[1].x) + abs(u_hsl[1].y) + abs(u_hsl[1].z) +
abs(u_hsl[2].x) + abs(u_hsl[2].y) + abs(u_hsl[2].z) +
abs(u_hsl[3].x) + abs(u_hsl[3].y) + abs(u_hsl[3].z) +
abs(u_hsl[4].x) + abs(u_hsl[4].y) + abs(u_hsl[4].z) +
abs(u_hsl[5].x) + abs(u_hsl[5].y) + abs(u_hsl[5].z) +
abs(u_hsl[6].x) + abs(u_hsl[6].y) + abs(u_hsl[6].z) +
abs(u_hsl[7].x) + abs(u_hsl[7].y) + abs(u_hsl[7].z) > 0.001
) {
vec3 hsv = rgb2hsv(clamp(c, 0.0, 1.0));
float hue = hsv.x * 360.0;
float dh = 0.0;
float ds = 0.0;
float dl = 0.0;
float wsum = 0.0;
addBand(hue, 0.0, 42.0, u_hsl[0], dh, ds, dl, wsum);
addBand(hue, 30.0, 36.0, u_hsl[1], dh, ds, dl, wsum);
addBand(hue, 60.0, 42.0, u_hsl[2], dh, ds, dl, wsum);
addBand(hue, 120.0, 60.0, u_hsl[3], dh, ds, dl, wsum);
addBand(hue, 180.0, 54.0, u_hsl[4], dh, ds, dl, wsum);
addBand(hue, 240.0, 54.0, u_hsl[5], dh, ds, dl, wsum);
addBand(hue, 285.0, 42.0, u_hsl[6], dh, ds, dl, wsum);
addBand(hue, 320.0, 42.0, u_hsl[7], dh, ds, dl, wsum);
if (wsum > 0.001) {
hsv.x = fract(hsv.x + (dh / max(1.0, wsum)) * 0.0833);
hsv.y = clamp(hsv.y * (1.0 + (ds / max(1.0, wsum)) * 0.85), 0.0, 1.0);
hsv.z = clamp(hsv.z * (1.0 + (dl / max(1.0, wsum)) * 0.5), 0.0, 1.0);
c = hsv2rgb(hsv);
}
}
if (u_lutStrength > 0.001) {
c = mix(c, sampleLUT(clamp(c, 0.0, 1.0)), u_lutStrength);
}
c = clamp(c, 0.0, 1.0);
vec2 p = (v_screen - u_vigCenter) / max(u_vigHalf, vec2(0.0001));
float d = length(vec2(p.x * u_aspect, p.y)) / sqrt(u_aspect * u_aspect + 1.0);
float v = smoothstep(0.34, 1.0, d) * u_vignette * 0.88;
c *= (1.0 - v);
if (u_dither > 0.001) {
float b = bayer4(gl_FragCoord.xy) * 1.0666667 - 0.5;
c += b * (u_dither / 255.0);
}
gl_FragColor = vec4(clamp(c, 0.0, 1.0), texel.a);
}
`,"base-linear-liquify":`#define AURUM_LINEAR 1
#define AURUM_LIQUIFY 1
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D u_texture;
uniform sampler2D u_curve;
uniform sampler2D u_lut;
#ifdef AURUM_BEAUTY_MASK
uniform sampler2D u_mask;
uniform float u_hasMask;
#endif
#ifdef AURUM_LIQUIFY
uniform sampler2D u_liquify;
uniform float u_liquifyShift;
#endif
uniform mat3 u_color;
uniform vec3 u_offset;
uniform float u_vignette;
uniform float u_aspect;
uniform vec2 u_vigCenter;
uniform vec2 u_vigHalf;
uniform vec2 u_texel;
uniform float u_dither;
uniform float u_exposure;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_saturation;
uniform float u_highlights;
uniform float u_shadows;
uniform float u_whites;
uniform float u_blacks;
uniform float u_warmth;
uniform float u_tint;
uniform float u_vibrance;
uniform float u_gamma;
uniform float u_clarity;
uniform float u_sharpen;
uniform float u_denoise;
uniform float u_smoothSkin;
uniform float u_blemish;
uniform float u_skinTexture;
uniform float u_skinTone;
uniform float u_hasCurve;
uniform float u_lutStrength;
uniform float u_lutSize;
uniform float u_quality;
uniform vec4 u_faces[4];
uniform int u_faceCount;
uniform sampler2D u_anchors;
uniform float u_hasAnchors;
uniform vec3 u_hsl[8];
uniform float u_faceSlim;
uniform float u_jawline;
uniform float u_chin;
uniform float u_eyeSize;
uniform float u_noseSize;
uniform float u_mouthSize;
varying vec2 v_uv;
varying vec2 v_screen;
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
#ifdef AURUM_LINEAR
float srgbToLinear1(float v) {
v = clamp(v, 0.0, 1.0);
return v <= 0.04045 ? v / 12.92 : pow((v + 0.055) / 1.055, 2.4);
}
float linearToSrgb1(float v) {
v = clamp(v, 0.0, 1.0);
return v <= 0.0031308 ? v * 12.92 : 1.055 * pow(v, 1.0 / 2.4) - 0.055;
}
vec3 toLinear(vec3 c) {
return vec3(srgbToLinear1(c.r), srgbToLinear1(c.g), srgbToLinear1(c.b));
}
vec3 toSrgb(vec3 c) {
return vec3(linearToSrgb1(c.r), linearToSrgb1(c.g), linearToSrgb1(c.b));
}
#endif
vec2 warpFace(vec2 uv) {
#ifdef AURUM_LIQUIFY
if (u_liquifyShift > 0.00001) {
vec2 pushed = (texture2D(u_liquify, uv).rg * 255.0 - 128.0) * (u_liquifyShift / 127.0);
uv = clamp(uv + pushed, 0.0, 1.0);
}
#endif
if (
abs(u_faceSlim) + abs(u_jawline) + abs(u_chin) +
abs(u_eyeSize) + abs(u_noseSize) + abs(u_mouthSize) < 0.001
) return uv;
for (int i = 0; i < 4; i++) {
if (i >= u_faceCount) break;
vec4 f = u_faces[i];
vec2 halfSize = max(f.zw / vec2(1.24, 1.44), vec2(0.0001));
vec2 center = f.xy;
vec2 l = (uv - center) / halfSize;
float ell = clamp(1.0 - dot(l, l), 0.0, 1.0);
if (ell <= 0.0001) continue;
float soft = ell * ell;
vec2 eyeL = vec2(-0.34, -0.18);
vec2 eyeR = vec2(0.34, -0.18);
vec2 nose = vec2(0.0, 0.10);
vec2 mouth = vec2(0.0, 0.40);
vec2 eyeLR = vec2(0.22, 0.16);
vec2 eyeRR = vec2(0.22, 0.16);
vec2 noseR = vec2(0.20, 0.24);
vec2 mouthR = vec2(0.30, 0.16);
if (u_hasAnchors > 0.5) {
float ay = (float(i) + 0.5) * 0.25;
vec4 a0 = texture2D(u_anchors, vec2(0.125, ay));
vec4 a1 = texture2D(u_anchors, vec2(0.375, ay));
vec4 a2 = texture2D(u_anchors, vec2(0.625, ay));
vec4 a3 = texture2D(u_anchors, vec2(0.875, ay));
eyeL = a0.xy * 2.0 - 1.0;
eyeR = a0.zw * 2.0 - 1.0;
nose = a1.xy * 2.0 - 1.0;
mouth = a1.zw * 2.0 - 1.0;
eyeLR = max(a2.xy * 0.6, vec2(0.02));
eyeRR = max(a2.zw * 0.6, vec2(0.02));
noseR = max(a3.xy * 0.6, vec2(0.02));
mouthR = max(a3.zw * 0.6, vec2(0.02));
}
float squeeze =
u_faceSlim * 0.16 +
u_jawline * 0.14 * smoothstep(-0.05, 0.75, l.y);
uv.x += squeeze * l.x * soft * halfSize.x;
float chinBand = smoothstep(0.0, 0.65, l.y) * exp(-l.x * l.x * 3.0);
uv.y -= u_chin * 0.14 * chinBand * ell * halfSize.y;
if (abs(u_eyeSize) > 0.001) {
vec2 dL = (l - eyeL) / eyeLR;
vec2 dR = (l - eyeR) / eyeRR;
float fL = clamp(1.0 - dot(dL, dL), 0.0, 1.0);
float fR = clamp(1.0 - dot(dR, dR), 0.0, 1.0);
fL *= fL;
fR *= fR;
uv -= (uv - (center + eyeL * halfSize)) * u_eyeSize * 0.28 * fL;
uv -= (uv - (center + eyeR * halfSize)) * u_eyeSize * 0.28 * fR;
}
if (abs(u_noseSize) > 0.001) {
vec2 dN = (l - nose) / noseR;
float fN = clamp(1.0 - dot(dN, dN), 0.0, 1.0);
fN *= fN;
uv -= (uv - (center + nose * halfSize)) * u_noseSize * 0.26 * fN;
}
if (abs(u_mouthSize) > 0.001) {
vec2 dM = (l - mouth) / mouthR;
float fM = clamp(1.0 - dot(dM, dM), 0.0, 1.0);
fM *= fM;
uv -= (uv - (center + mouth * halfSize)) * u_mouthSize * 0.24 * fM;
}
}
return clamp(uv, 0.0, 1.0);
}
void addTap(vec2 base, vec2 offset, float centerLuma, float invSigma2, inout vec3 acc, inout float wsum) {
vec3 s = texture2D(u_texture, base + offset).rgb;
float dl = luma(s) - centerLuma;
float w = exp(-dl * dl * invSigma2);
acc += s * w;
wsum += w;
}
vec3 whiteBalance() {
return vec3(
1.0 + u_warmth * 0.16 + u_tint * 0.04,
1.0 + u_warmth * 0.03 - u_tint * 0.18,
1.0 - u_warmth * 0.16 + u_tint * 0.04
);
}
#ifndef AURUM_LINEAR
vec3 toneGamma(vec3 c) {
float lc = luma(clamp(c, 0.0, 1.0));
if (abs(u_highlights) > 0.001) {
float m = smoothstep(0.42, 1.0, lc);
c += u_highlights * m * (u_highlights > 0.0 ? (1.0 - c) : c) * 0.6;
}
if (abs(u_shadows) > 0.001) {
float m = 1.0 - smoothstep(0.0, 0.58, lc);
c += u_shadows * m * (u_shadows > 0.0 ? (1.0 - c) : c) * 0.6;
}
if (abs(u_whites) > 0.001 || abs(u_blacks) > 0.001) {
float black = -u_blacks * 0.16;
float white = 1.0 - u_whites * 0.16;
c = (c - black) / max(0.08, white - black);
}
return clamp(c, 0.0, 1.0);
}
#endif
#ifdef AURUM_LINEAR
vec3 toneLinear(vec3 c) {
c = clamp(c, 0.0, 1.0);
float lc = luma(c);
if (lc < 0.000001) return c;
float lp = linearToSrgb1(lc);
float t = lp;
if (abs(u_highlights) > 0.001) {
float m = smoothstep(0.42, 1.0, lp);
t += u_highlights * m * (u_highlights > 0.0 ? (1.0 - lp) : lp) * 0.6;
}
if (abs(u_shadows) > 0.001) {
float m = 1.0 - smoothstep(0.0, 0.58, lp);
t += u_shadows * m * (u_shadows > 0.0 ? (1.0 - lp) : lp) * 0.6;
}
if (abs(u_whites) > 0.001 || abs(u_blacks) > 0.001) {
float black = -u_blacks * 0.16;
float white = 1.0 - u_whites * 0.16;
t = (t - black) / max(0.08, white - black);
}
float target = srgbToLinear1(clamp(t, 0.0, 1.0));
c *= target / lc;
return clamp(c, 0.0, 1.0);
}
#endif
float skinWeight(vec3 c, vec2 uv) {
float y = luma(c);
float cb = -0.168736 * c.r - 0.331264 * c.g + 0.5 * c.b + 0.5;
float cr = 0.5 * c.r - 0.418688 * c.g - 0.081312 * c.b + 0.5;
float m =
smoothstep(0.30, 0.38, cr) * (1.0 - smoothstep(0.60, 0.70, cr)) *
smoothstep(0.28, 0.36, cb) * (1.0 - smoothstep(0.54, 0.64, cb)) *
smoothstep(0.10, 0.22, y) * (1.0 - smoothstep(0.90, 1.0, y));
float face = 0.0;
for (int i = 0; i < 4; i++) {
if (i >= u_faceCount) break;
vec4 f = u_faces[i];
vec2 p = (uv - f.xy) / max(f.zw, vec2(0.0001));
face = max(face, 1.0 - smoothstep(0.72, 1.0, length(p)));
}
return clamp(max(m, face * 0.9), 0.0, 1.0);
}
vec3 rgb2hsv(vec3 c) {
vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
float d = q.x - min(q.w, q.y);
float e = 1.0e-10;
return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c) {
vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
void addBand(
float hue, float center, float width, vec3 shift,
inout float dh, inout float ds, inout float dl, inout float wsum
) {
float d = abs(mod(hue - center + 540.0, 360.0) - 180.0);
float w = 1.0 - smoothstep(width * 0.55, width, d);
if (w > 0.0001) {
dh += shift.x * w;
ds += shift.y * w;
dl += shift.z * w;
wsum += w;
}
}
vec3 sampleLUT(vec3 c) {
float size = u_lutSize;
float slice = c.b * (size - 1.0);
float s0 = floor(slice);
float s1 = min(s0 + 1.0, size - 1.0);
float f = slice - s0;
float y = (c.g * (size - 1.0) + 0.5) / size;
float x0 = (s0 * size + c.r * (size - 1.0) + 0.5) / (size * size);
float x1 = (s1 * size + c.r * (size - 1.0) + 0.5) / (size * size);
vec3 a = texture2D(u_lut, vec2(x0, y)).rgb;
vec3 b = texture2D(u_lut, vec2(x1, y)).rgb;
return mix(a, b, f);
}
float bayer2(vec2 a) {
a = floor(a);
return fract(a.x * 0.5 + a.y * a.y * 0.75);
}
float bayer4(vec2 a) {
return bayer2(0.5 * a) * 0.25 + bayer2(a);
}
void main() {
vec2 uv = warpFace(v_uv);
vec4 texel = texture2D(u_texture, uv);
vec3 c = texel.rgb;
float lc = luma(c);
if (u_denoise > 0.001) {
float sigma = 0.022 + u_denoise * 0.09;
float invSigma2 = 1.0 / max(0.0001, sigma * sigma);
vec3 acc = c;
float wsum = 1.0;
vec2 o = u_texel * (1.0 + u_quality * 1.5);
addTap(uv, vec2(o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, -o.y), lc, invSigma2, acc, wsum);
if (u_quality > 0.5) {
addTap(uv, vec2(o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(o.x, -o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, -o.y), lc, invSigma2, acc, wsum);
}
c = mix(c, acc / wsum, u_denoise * 0.9);
lc = luma(c);
}
if (abs(u_clarity) > 0.001) {
vec2 o = u_texel * (4.0 + u_quality * 6.0);
vec3 blur = c;
blur += texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb;
blur += texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb;
blur += texture2D(u_texture, uv + vec2(0.0, o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb;
if (u_quality > 0.5) {
blur += texture2D(u_texture, uv + vec2(o.x, o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(-o.x, o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(o.x, -o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(-o.x, -o.y)).rgb;
blur /= 9.0;
} else {
blur /= 5.0;
}
float detail = clamp(lc - luma(blur), -0.18, 0.18);
float mid = 1.0 - smoothstep(0.72, 1.0, lc) * 0.55;
c += detail * u_clarity * 1.25 * mid;
lc = luma(c);
}
if (u_sharpen > 0.001) {
vec2 o = u_texel;
float lb =
luma(texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb) +
luma(texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb) +
luma(texture2D(u_texture, uv + vec2(0.0, o.y)).rgb) +
luma(texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb);
float detail = clamp(lc - lb * 0.25, -0.2, 0.2);
float mask = smoothstep(0.006, 0.022, abs(detail));
c += detail * mask * u_sharpen * 2.2;
lc = luma(c);
}
if (
u_smoothSkin > 0.001 ||
abs(u_skinTone) > 0.001 ||
u_blemish > 0.001
) {
float skin = skinWeight(c, uv);
float protect = 0.0;
float lips = 0.0;
#ifdef AURUM_BEAUTY_MASK
if (u_hasMask > 0.5) {
vec3 m = texture2D(u_mask, uv).rgb;
skin = m.r;
protect = m.g;
lips = m.b;
}
#endif
float mask = clamp(skin * (1.0 - protect), 0.0, 1.0);
if (mask > 0.01) {
vec3 base = c;
if (u_smoothSkin > 0.001) {
float invSigma2 = 1.0 / (0.045 * 0.045);
vec3 acc = c;
float wsum = 1.0;
vec2 o = vec2(0.0045);
addTap(uv, vec2(o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, -o.y), lc, invSigma2, acc, wsum);
if (u_quality > 0.5) {
addTap(uv, vec2(o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(o.x, -o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, -o.y), lc, invSigma2, acc, wsum);
}
vec3 soft = acc / wsum;
float detail = length(base - soft);
float keep = smoothstep(0.025, 0.14, detail);
float preserve = mix(0.35, 0.95, u_skinTexture);
float strength = mask * u_smoothSkin * 0.92;
c = mix(base, soft, strength * (1.0 - keep * preserve));
c += (base - soft) * (u_skinTexture * 0.3 * strength);
}
if (u_blemish > 0.001) {
vec2 o = vec2(0.011);
vec3 avg = texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb;
avg += texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb;
avg += texture2D(u_texture, uv + vec2(0.0, o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(o.x, o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(-o.x, o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(o.x, -o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(-o.x, -o.y)).rgb;
avg *= 0.125;
float dark = smoothstep(0.02, 0.07, luma(avg) - lc);
vec3 delta = c - avg;
float red = smoothstep(0.035, 0.11, delta.r - max(delta.g, delta.b));
float spot = max(dark, red * 0.85);
c = mix(c, avg, mask * u_blemish * spot * 0.85);
}
if (abs(u_skinTone) > 0.001) {
vec3 target = u_skinTone > 0.0
? c * vec3(1.035, 1.005, 0.965)
: c * vec3(0.975, 1.0, 1.025);
c = mix(c, target, mask * abs(u_skinTone) * 0.7 * (1.0 - lips * 0.45));
}
lc = luma(c);
}
}
c = clamp(u_color * c + u_offset, 0.0, 1.0);
vec3 wb = whiteBalance();
#ifdef AURUM_LINEAR
c = toLinear(c) * wb;
c *= pow(2.0, u_exposure);
float L = max(luma(c), 0.000001);
if (L > 1.0) {
c *= (1.0 - (1.0 - 1.0 / L) * 0.35) / L;
}
c = toneLinear(c);
c = toSrgb(c);
#else
c *= wb;
c *= pow(2.0, u_exposure);
#endif
c += u_brightness * 0.22;
c = (c - 0.5) * max(0.05, 1.0 + u_contrast) + 0.5;
c = clamp(c, 0.0, 1.0);
lc = luma(c);
c = mix(vec3(lc), c, max(0.0, 1.0 + u_saturation));
if (abs(u_vibrance) > 0.001) {
float mx = max(c.r, max(c.g, c.b));
float mn = min(c.r, min(c.g, c.b));
float sat = mx - mn;
float boost = 1.0 + u_vibrance * (1.0 - smoothstep(0.0, 0.55, sat)) * 0.9;
lc = luma(c);
c = mix(vec3(lc), c, max(0.0, boost));
}
#ifndef AURUM_LINEAR
c = toneGamma(c);
#endif
if (abs(u_gamma) > 0.001) {
c = pow(c, vec3(1.0 / max(0.2, 1.0 + u_gamma * 0.8)));
}
if (u_hasCurve > 0.5) {
c.r = texture2D(u_curve, vec2(clamp(c.r, 0.0, 1.0), 0.5)).r;
c.g = texture2D(u_curve, vec2(clamp(c.g, 0.0, 1.0), 0.5)).g;
c.b = texture2D(u_curve, vec2(clamp(c.b, 0.0, 1.0), 0.5)).b;
}
if (
abs(u_hsl[0].x) + abs(u_hsl[0].y) + abs(u_hsl[0].z) +
abs(u_hsl[1].x) + abs(u_hsl[1].y) + abs(u_hsl[1].z) +
abs(u_hsl[2].x) + abs(u_hsl[2].y) + abs(u_hsl[2].z) +
abs(u_hsl[3].x) + abs(u_hsl[3].y) + abs(u_hsl[3].z) +
abs(u_hsl[4].x) + abs(u_hsl[4].y) + abs(u_hsl[4].z) +
abs(u_hsl[5].x) + abs(u_hsl[5].y) + abs(u_hsl[5].z) +
abs(u_hsl[6].x) + abs(u_hsl[6].y) + abs(u_hsl[6].z) +
abs(u_hsl[7].x) + abs(u_hsl[7].y) + abs(u_hsl[7].z) > 0.001
) {
vec3 hsv = rgb2hsv(clamp(c, 0.0, 1.0));
float hue = hsv.x * 360.0;
float dh = 0.0;
float ds = 0.0;
float dl = 0.0;
float wsum = 0.0;
addBand(hue, 0.0, 42.0, u_hsl[0], dh, ds, dl, wsum);
addBand(hue, 30.0, 36.0, u_hsl[1], dh, ds, dl, wsum);
addBand(hue, 60.0, 42.0, u_hsl[2], dh, ds, dl, wsum);
addBand(hue, 120.0, 60.0, u_hsl[3], dh, ds, dl, wsum);
addBand(hue, 180.0, 54.0, u_hsl[4], dh, ds, dl, wsum);
addBand(hue, 240.0, 54.0, u_hsl[5], dh, ds, dl, wsum);
addBand(hue, 285.0, 42.0, u_hsl[6], dh, ds, dl, wsum);
addBand(hue, 320.0, 42.0, u_hsl[7], dh, ds, dl, wsum);
if (wsum > 0.001) {
hsv.x = fract(hsv.x + (dh / max(1.0, wsum)) * 0.0833);
hsv.y = clamp(hsv.y * (1.0 + (ds / max(1.0, wsum)) * 0.85), 0.0, 1.0);
hsv.z = clamp(hsv.z * (1.0 + (dl / max(1.0, wsum)) * 0.5), 0.0, 1.0);
c = hsv2rgb(hsv);
}
}
if (u_lutStrength > 0.001) {
c = mix(c, sampleLUT(clamp(c, 0.0, 1.0)), u_lutStrength);
}
c = clamp(c, 0.0, 1.0);
vec2 p = (v_screen - u_vigCenter) / max(u_vigHalf, vec2(0.0001));
float d = length(vec2(p.x * u_aspect, p.y)) / sqrt(u_aspect * u_aspect + 1.0);
float v = smoothstep(0.34, 1.0, d) * u_vignette * 0.88;
c *= (1.0 - v);
if (u_dither > 0.001) {
float b = bayer4(gl_FragCoord.xy) * 1.0666667 - 0.5;
c += b * (u_dither / 255.0);
}
gl_FragColor = vec4(clamp(c, 0.0, 1.0), texel.a);
}
`,"beauty-gamma":`#define AURUM_BEAUTY_MASK 1
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D u_texture;
uniform sampler2D u_curve;
uniform sampler2D u_lut;
#ifdef AURUM_BEAUTY_MASK
uniform sampler2D u_mask;
uniform float u_hasMask;
#endif
#ifdef AURUM_LIQUIFY
uniform sampler2D u_liquify;
uniform float u_liquifyShift;
#endif
uniform mat3 u_color;
uniform vec3 u_offset;
uniform float u_vignette;
uniform float u_aspect;
uniform vec2 u_vigCenter;
uniform vec2 u_vigHalf;
uniform vec2 u_texel;
uniform float u_dither;
uniform float u_exposure;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_saturation;
uniform float u_highlights;
uniform float u_shadows;
uniform float u_whites;
uniform float u_blacks;
uniform float u_warmth;
uniform float u_tint;
uniform float u_vibrance;
uniform float u_gamma;
uniform float u_clarity;
uniform float u_sharpen;
uniform float u_denoise;
uniform float u_smoothSkin;
uniform float u_blemish;
uniform float u_skinTexture;
uniform float u_skinTone;
uniform float u_hasCurve;
uniform float u_lutStrength;
uniform float u_lutSize;
uniform float u_quality;
uniform vec4 u_faces[4];
uniform int u_faceCount;
uniform sampler2D u_anchors;
uniform float u_hasAnchors;
uniform vec3 u_hsl[8];
uniform float u_faceSlim;
uniform float u_jawline;
uniform float u_chin;
uniform float u_eyeSize;
uniform float u_noseSize;
uniform float u_mouthSize;
varying vec2 v_uv;
varying vec2 v_screen;
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
#ifdef AURUM_LINEAR
float srgbToLinear1(float v) {
v = clamp(v, 0.0, 1.0);
return v <= 0.04045 ? v / 12.92 : pow((v + 0.055) / 1.055, 2.4);
}
float linearToSrgb1(float v) {
v = clamp(v, 0.0, 1.0);
return v <= 0.0031308 ? v * 12.92 : 1.055 * pow(v, 1.0 / 2.4) - 0.055;
}
vec3 toLinear(vec3 c) {
return vec3(srgbToLinear1(c.r), srgbToLinear1(c.g), srgbToLinear1(c.b));
}
vec3 toSrgb(vec3 c) {
return vec3(linearToSrgb1(c.r), linearToSrgb1(c.g), linearToSrgb1(c.b));
}
#endif
vec2 warpFace(vec2 uv) {
#ifdef AURUM_LIQUIFY
if (u_liquifyShift > 0.00001) {
vec2 pushed = (texture2D(u_liquify, uv).rg * 255.0 - 128.0) * (u_liquifyShift / 127.0);
uv = clamp(uv + pushed, 0.0, 1.0);
}
#endif
if (
abs(u_faceSlim) + abs(u_jawline) + abs(u_chin) +
abs(u_eyeSize) + abs(u_noseSize) + abs(u_mouthSize) < 0.001
) return uv;
for (int i = 0; i < 4; i++) {
if (i >= u_faceCount) break;
vec4 f = u_faces[i];
vec2 halfSize = max(f.zw / vec2(1.24, 1.44), vec2(0.0001));
vec2 center = f.xy;
vec2 l = (uv - center) / halfSize;
float ell = clamp(1.0 - dot(l, l), 0.0, 1.0);
if (ell <= 0.0001) continue;
float soft = ell * ell;
vec2 eyeL = vec2(-0.34, -0.18);
vec2 eyeR = vec2(0.34, -0.18);
vec2 nose = vec2(0.0, 0.10);
vec2 mouth = vec2(0.0, 0.40);
vec2 eyeLR = vec2(0.22, 0.16);
vec2 eyeRR = vec2(0.22, 0.16);
vec2 noseR = vec2(0.20, 0.24);
vec2 mouthR = vec2(0.30, 0.16);
if (u_hasAnchors > 0.5) {
float ay = (float(i) + 0.5) * 0.25;
vec4 a0 = texture2D(u_anchors, vec2(0.125, ay));
vec4 a1 = texture2D(u_anchors, vec2(0.375, ay));
vec4 a2 = texture2D(u_anchors, vec2(0.625, ay));
vec4 a3 = texture2D(u_anchors, vec2(0.875, ay));
eyeL = a0.xy * 2.0 - 1.0;
eyeR = a0.zw * 2.0 - 1.0;
nose = a1.xy * 2.0 - 1.0;
mouth = a1.zw * 2.0 - 1.0;
eyeLR = max(a2.xy * 0.6, vec2(0.02));
eyeRR = max(a2.zw * 0.6, vec2(0.02));
noseR = max(a3.xy * 0.6, vec2(0.02));
mouthR = max(a3.zw * 0.6, vec2(0.02));
}
float squeeze =
u_faceSlim * 0.16 +
u_jawline * 0.14 * smoothstep(-0.05, 0.75, l.y);
uv.x += squeeze * l.x * soft * halfSize.x;
float chinBand = smoothstep(0.0, 0.65, l.y) * exp(-l.x * l.x * 3.0);
uv.y -= u_chin * 0.14 * chinBand * ell * halfSize.y;
if (abs(u_eyeSize) > 0.001) {
vec2 dL = (l - eyeL) / eyeLR;
vec2 dR = (l - eyeR) / eyeRR;
float fL = clamp(1.0 - dot(dL, dL), 0.0, 1.0);
float fR = clamp(1.0 - dot(dR, dR), 0.0, 1.0);
fL *= fL;
fR *= fR;
uv -= (uv - (center + eyeL * halfSize)) * u_eyeSize * 0.28 * fL;
uv -= (uv - (center + eyeR * halfSize)) * u_eyeSize * 0.28 * fR;
}
if (abs(u_noseSize) > 0.001) {
vec2 dN = (l - nose) / noseR;
float fN = clamp(1.0 - dot(dN, dN), 0.0, 1.0);
fN *= fN;
uv -= (uv - (center + nose * halfSize)) * u_noseSize * 0.26 * fN;
}
if (abs(u_mouthSize) > 0.001) {
vec2 dM = (l - mouth) / mouthR;
float fM = clamp(1.0 - dot(dM, dM), 0.0, 1.0);
fM *= fM;
uv -= (uv - (center + mouth * halfSize)) * u_mouthSize * 0.24 * fM;
}
}
return clamp(uv, 0.0, 1.0);
}
void addTap(vec2 base, vec2 offset, float centerLuma, float invSigma2, inout vec3 acc, inout float wsum) {
vec3 s = texture2D(u_texture, base + offset).rgb;
float dl = luma(s) - centerLuma;
float w = exp(-dl * dl * invSigma2);
acc += s * w;
wsum += w;
}
vec3 whiteBalance() {
return vec3(
1.0 + u_warmth * 0.16 + u_tint * 0.04,
1.0 + u_warmth * 0.03 - u_tint * 0.18,
1.0 - u_warmth * 0.16 + u_tint * 0.04
);
}
#ifndef AURUM_LINEAR
vec3 toneGamma(vec3 c) {
float lc = luma(clamp(c, 0.0, 1.0));
if (abs(u_highlights) > 0.001) {
float m = smoothstep(0.42, 1.0, lc);
c += u_highlights * m * (u_highlights > 0.0 ? (1.0 - c) : c) * 0.6;
}
if (abs(u_shadows) > 0.001) {
float m = 1.0 - smoothstep(0.0, 0.58, lc);
c += u_shadows * m * (u_shadows > 0.0 ? (1.0 - c) : c) * 0.6;
}
if (abs(u_whites) > 0.001 || abs(u_blacks) > 0.001) {
float black = -u_blacks * 0.16;
float white = 1.0 - u_whites * 0.16;
c = (c - black) / max(0.08, white - black);
}
return clamp(c, 0.0, 1.0);
}
#endif
#ifdef AURUM_LINEAR
vec3 toneLinear(vec3 c) {
c = clamp(c, 0.0, 1.0);
float lc = luma(c);
if (lc < 0.000001) return c;
float lp = linearToSrgb1(lc);
float t = lp;
if (abs(u_highlights) > 0.001) {
float m = smoothstep(0.42, 1.0, lp);
t += u_highlights * m * (u_highlights > 0.0 ? (1.0 - lp) : lp) * 0.6;
}
if (abs(u_shadows) > 0.001) {
float m = 1.0 - smoothstep(0.0, 0.58, lp);
t += u_shadows * m * (u_shadows > 0.0 ? (1.0 - lp) : lp) * 0.6;
}
if (abs(u_whites) > 0.001 || abs(u_blacks) > 0.001) {
float black = -u_blacks * 0.16;
float white = 1.0 - u_whites * 0.16;
t = (t - black) / max(0.08, white - black);
}
float target = srgbToLinear1(clamp(t, 0.0, 1.0));
c *= target / lc;
return clamp(c, 0.0, 1.0);
}
#endif
float skinWeight(vec3 c, vec2 uv) {
float y = luma(c);
float cb = -0.168736 * c.r - 0.331264 * c.g + 0.5 * c.b + 0.5;
float cr = 0.5 * c.r - 0.418688 * c.g - 0.081312 * c.b + 0.5;
float m =
smoothstep(0.30, 0.38, cr) * (1.0 - smoothstep(0.60, 0.70, cr)) *
smoothstep(0.28, 0.36, cb) * (1.0 - smoothstep(0.54, 0.64, cb)) *
smoothstep(0.10, 0.22, y) * (1.0 - smoothstep(0.90, 1.0, y));
float face = 0.0;
for (int i = 0; i < 4; i++) {
if (i >= u_faceCount) break;
vec4 f = u_faces[i];
vec2 p = (uv - f.xy) / max(f.zw, vec2(0.0001));
face = max(face, 1.0 - smoothstep(0.72, 1.0, length(p)));
}
return clamp(max(m, face * 0.9), 0.0, 1.0);
}
vec3 rgb2hsv(vec3 c) {
vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
float d = q.x - min(q.w, q.y);
float e = 1.0e-10;
return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c) {
vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
void addBand(
float hue, float center, float width, vec3 shift,
inout float dh, inout float ds, inout float dl, inout float wsum
) {
float d = abs(mod(hue - center + 540.0, 360.0) - 180.0);
float w = 1.0 - smoothstep(width * 0.55, width, d);
if (w > 0.0001) {
dh += shift.x * w;
ds += shift.y * w;
dl += shift.z * w;
wsum += w;
}
}
vec3 sampleLUT(vec3 c) {
float size = u_lutSize;
float slice = c.b * (size - 1.0);
float s0 = floor(slice);
float s1 = min(s0 + 1.0, size - 1.0);
float f = slice - s0;
float y = (c.g * (size - 1.0) + 0.5) / size;
float x0 = (s0 * size + c.r * (size - 1.0) + 0.5) / (size * size);
float x1 = (s1 * size + c.r * (size - 1.0) + 0.5) / (size * size);
vec3 a = texture2D(u_lut, vec2(x0, y)).rgb;
vec3 b = texture2D(u_lut, vec2(x1, y)).rgb;
return mix(a, b, f);
}
float bayer2(vec2 a) {
a = floor(a);
return fract(a.x * 0.5 + a.y * a.y * 0.75);
}
float bayer4(vec2 a) {
return bayer2(0.5 * a) * 0.25 + bayer2(a);
}
void main() {
vec2 uv = warpFace(v_uv);
vec4 texel = texture2D(u_texture, uv);
vec3 c = texel.rgb;
float lc = luma(c);
if (u_denoise > 0.001) {
float sigma = 0.022 + u_denoise * 0.09;
float invSigma2 = 1.0 / max(0.0001, sigma * sigma);
vec3 acc = c;
float wsum = 1.0;
vec2 o = u_texel * (1.0 + u_quality * 1.5);
addTap(uv, vec2(o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, -o.y), lc, invSigma2, acc, wsum);
if (u_quality > 0.5) {
addTap(uv, vec2(o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(o.x, -o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, -o.y), lc, invSigma2, acc, wsum);
}
c = mix(c, acc / wsum, u_denoise * 0.9);
lc = luma(c);
}
if (abs(u_clarity) > 0.001) {
vec2 o = u_texel * (4.0 + u_quality * 6.0);
vec3 blur = c;
blur += texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb;
blur += texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb;
blur += texture2D(u_texture, uv + vec2(0.0, o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb;
if (u_quality > 0.5) {
blur += texture2D(u_texture, uv + vec2(o.x, o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(-o.x, o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(o.x, -o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(-o.x, -o.y)).rgb;
blur /= 9.0;
} else {
blur /= 5.0;
}
float detail = clamp(lc - luma(blur), -0.18, 0.18);
float mid = 1.0 - smoothstep(0.72, 1.0, lc) * 0.55;
c += detail * u_clarity * 1.25 * mid;
lc = luma(c);
}
if (u_sharpen > 0.001) {
vec2 o = u_texel;
float lb =
luma(texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb) +
luma(texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb) +
luma(texture2D(u_texture, uv + vec2(0.0, o.y)).rgb) +
luma(texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb);
float detail = clamp(lc - lb * 0.25, -0.2, 0.2);
float mask = smoothstep(0.006, 0.022, abs(detail));
c += detail * mask * u_sharpen * 2.2;
lc = luma(c);
}
if (
u_smoothSkin > 0.001 ||
abs(u_skinTone) > 0.001 ||
u_blemish > 0.001
) {
float skin = skinWeight(c, uv);
float protect = 0.0;
float lips = 0.0;
#ifdef AURUM_BEAUTY_MASK
if (u_hasMask > 0.5) {
vec3 m = texture2D(u_mask, uv).rgb;
skin = m.r;
protect = m.g;
lips = m.b;
}
#endif
float mask = clamp(skin * (1.0 - protect), 0.0, 1.0);
if (mask > 0.01) {
vec3 base = c;
if (u_smoothSkin > 0.001) {
float invSigma2 = 1.0 / (0.045 * 0.045);
vec3 acc = c;
float wsum = 1.0;
vec2 o = vec2(0.0045);
addTap(uv, vec2(o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, -o.y), lc, invSigma2, acc, wsum);
if (u_quality > 0.5) {
addTap(uv, vec2(o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(o.x, -o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, -o.y), lc, invSigma2, acc, wsum);
}
vec3 soft = acc / wsum;
float detail = length(base - soft);
float keep = smoothstep(0.025, 0.14, detail);
float preserve = mix(0.35, 0.95, u_skinTexture);
float strength = mask * u_smoothSkin * 0.92;
c = mix(base, soft, strength * (1.0 - keep * preserve));
c += (base - soft) * (u_skinTexture * 0.3 * strength);
}
if (u_blemish > 0.001) {
vec2 o = vec2(0.011);
vec3 avg = texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb;
avg += texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb;
avg += texture2D(u_texture, uv + vec2(0.0, o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(o.x, o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(-o.x, o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(o.x, -o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(-o.x, -o.y)).rgb;
avg *= 0.125;
float dark = smoothstep(0.02, 0.07, luma(avg) - lc);
vec3 delta = c - avg;
float red = smoothstep(0.035, 0.11, delta.r - max(delta.g, delta.b));
float spot = max(dark, red * 0.85);
c = mix(c, avg, mask * u_blemish * spot * 0.85);
}
if (abs(u_skinTone) > 0.001) {
vec3 target = u_skinTone > 0.0
? c * vec3(1.035, 1.005, 0.965)
: c * vec3(0.975, 1.0, 1.025);
c = mix(c, target, mask * abs(u_skinTone) * 0.7 * (1.0 - lips * 0.45));
}
lc = luma(c);
}
}
c = clamp(u_color * c + u_offset, 0.0, 1.0);
vec3 wb = whiteBalance();
#ifdef AURUM_LINEAR
c = toLinear(c) * wb;
c *= pow(2.0, u_exposure);
float L = max(luma(c), 0.000001);
if (L > 1.0) {
c *= (1.0 - (1.0 - 1.0 / L) * 0.35) / L;
}
c = toneLinear(c);
c = toSrgb(c);
#else
c *= wb;
c *= pow(2.0, u_exposure);
#endif
c += u_brightness * 0.22;
c = (c - 0.5) * max(0.05, 1.0 + u_contrast) + 0.5;
c = clamp(c, 0.0, 1.0);
lc = luma(c);
c = mix(vec3(lc), c, max(0.0, 1.0 + u_saturation));
if (abs(u_vibrance) > 0.001) {
float mx = max(c.r, max(c.g, c.b));
float mn = min(c.r, min(c.g, c.b));
float sat = mx - mn;
float boost = 1.0 + u_vibrance * (1.0 - smoothstep(0.0, 0.55, sat)) * 0.9;
lc = luma(c);
c = mix(vec3(lc), c, max(0.0, boost));
}
#ifndef AURUM_LINEAR
c = toneGamma(c);
#endif
if (abs(u_gamma) > 0.001) {
c = pow(c, vec3(1.0 / max(0.2, 1.0 + u_gamma * 0.8)));
}
if (u_hasCurve > 0.5) {
c.r = texture2D(u_curve, vec2(clamp(c.r, 0.0, 1.0), 0.5)).r;
c.g = texture2D(u_curve, vec2(clamp(c.g, 0.0, 1.0), 0.5)).g;
c.b = texture2D(u_curve, vec2(clamp(c.b, 0.0, 1.0), 0.5)).b;
}
if (
abs(u_hsl[0].x) + abs(u_hsl[0].y) + abs(u_hsl[0].z) +
abs(u_hsl[1].x) + abs(u_hsl[1].y) + abs(u_hsl[1].z) +
abs(u_hsl[2].x) + abs(u_hsl[2].y) + abs(u_hsl[2].z) +
abs(u_hsl[3].x) + abs(u_hsl[3].y) + abs(u_hsl[3].z) +
abs(u_hsl[4].x) + abs(u_hsl[4].y) + abs(u_hsl[4].z) +
abs(u_hsl[5].x) + abs(u_hsl[5].y) + abs(u_hsl[5].z) +
abs(u_hsl[6].x) + abs(u_hsl[6].y) + abs(u_hsl[6].z) +
abs(u_hsl[7].x) + abs(u_hsl[7].y) + abs(u_hsl[7].z) > 0.001
) {
vec3 hsv = rgb2hsv(clamp(c, 0.0, 1.0));
float hue = hsv.x * 360.0;
float dh = 0.0;
float ds = 0.0;
float dl = 0.0;
float wsum = 0.0;
addBand(hue, 0.0, 42.0, u_hsl[0], dh, ds, dl, wsum);
addBand(hue, 30.0, 36.0, u_hsl[1], dh, ds, dl, wsum);
addBand(hue, 60.0, 42.0, u_hsl[2], dh, ds, dl, wsum);
addBand(hue, 120.0, 60.0, u_hsl[3], dh, ds, dl, wsum);
addBand(hue, 180.0, 54.0, u_hsl[4], dh, ds, dl, wsum);
addBand(hue, 240.0, 54.0, u_hsl[5], dh, ds, dl, wsum);
addBand(hue, 285.0, 42.0, u_hsl[6], dh, ds, dl, wsum);
addBand(hue, 320.0, 42.0, u_hsl[7], dh, ds, dl, wsum);
if (wsum > 0.001) {
hsv.x = fract(hsv.x + (dh / max(1.0, wsum)) * 0.0833);
hsv.y = clamp(hsv.y * (1.0 + (ds / max(1.0, wsum)) * 0.85), 0.0, 1.0);
hsv.z = clamp(hsv.z * (1.0 + (dl / max(1.0, wsum)) * 0.5), 0.0, 1.0);
c = hsv2rgb(hsv);
}
}
if (u_lutStrength > 0.001) {
c = mix(c, sampleLUT(clamp(c, 0.0, 1.0)), u_lutStrength);
}
c = clamp(c, 0.0, 1.0);
vec2 p = (v_screen - u_vigCenter) / max(u_vigHalf, vec2(0.0001));
float d = length(vec2(p.x * u_aspect, p.y)) / sqrt(u_aspect * u_aspect + 1.0);
float v = smoothstep(0.34, 1.0, d) * u_vignette * 0.88;
c *= (1.0 - v);
if (u_dither > 0.001) {
float b = bayer4(gl_FragCoord.xy) * 1.0666667 - 0.5;
c += b * (u_dither / 255.0);
}
gl_FragColor = vec4(clamp(c, 0.0, 1.0), texel.a);
}
`,"beauty-gamma-liquify":`#define AURUM_BEAUTY_MASK 1
#define AURUM_LIQUIFY 1
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D u_texture;
uniform sampler2D u_curve;
uniform sampler2D u_lut;
#ifdef AURUM_BEAUTY_MASK
uniform sampler2D u_mask;
uniform float u_hasMask;
#endif
#ifdef AURUM_LIQUIFY
uniform sampler2D u_liquify;
uniform float u_liquifyShift;
#endif
uniform mat3 u_color;
uniform vec3 u_offset;
uniform float u_vignette;
uniform float u_aspect;
uniform vec2 u_vigCenter;
uniform vec2 u_vigHalf;
uniform vec2 u_texel;
uniform float u_dither;
uniform float u_exposure;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_saturation;
uniform float u_highlights;
uniform float u_shadows;
uniform float u_whites;
uniform float u_blacks;
uniform float u_warmth;
uniform float u_tint;
uniform float u_vibrance;
uniform float u_gamma;
uniform float u_clarity;
uniform float u_sharpen;
uniform float u_denoise;
uniform float u_smoothSkin;
uniform float u_blemish;
uniform float u_skinTexture;
uniform float u_skinTone;
uniform float u_hasCurve;
uniform float u_lutStrength;
uniform float u_lutSize;
uniform float u_quality;
uniform vec4 u_faces[4];
uniform int u_faceCount;
uniform sampler2D u_anchors;
uniform float u_hasAnchors;
uniform vec3 u_hsl[8];
uniform float u_faceSlim;
uniform float u_jawline;
uniform float u_chin;
uniform float u_eyeSize;
uniform float u_noseSize;
uniform float u_mouthSize;
varying vec2 v_uv;
varying vec2 v_screen;
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
#ifdef AURUM_LINEAR
float srgbToLinear1(float v) {
v = clamp(v, 0.0, 1.0);
return v <= 0.04045 ? v / 12.92 : pow((v + 0.055) / 1.055, 2.4);
}
float linearToSrgb1(float v) {
v = clamp(v, 0.0, 1.0);
return v <= 0.0031308 ? v * 12.92 : 1.055 * pow(v, 1.0 / 2.4) - 0.055;
}
vec3 toLinear(vec3 c) {
return vec3(srgbToLinear1(c.r), srgbToLinear1(c.g), srgbToLinear1(c.b));
}
vec3 toSrgb(vec3 c) {
return vec3(linearToSrgb1(c.r), linearToSrgb1(c.g), linearToSrgb1(c.b));
}
#endif
vec2 warpFace(vec2 uv) {
#ifdef AURUM_LIQUIFY
if (u_liquifyShift > 0.00001) {
vec2 pushed = (texture2D(u_liquify, uv).rg * 255.0 - 128.0) * (u_liquifyShift / 127.0);
uv = clamp(uv + pushed, 0.0, 1.0);
}
#endif
if (
abs(u_faceSlim) + abs(u_jawline) + abs(u_chin) +
abs(u_eyeSize) + abs(u_noseSize) + abs(u_mouthSize) < 0.001
) return uv;
for (int i = 0; i < 4; i++) {
if (i >= u_faceCount) break;
vec4 f = u_faces[i];
vec2 halfSize = max(f.zw / vec2(1.24, 1.44), vec2(0.0001));
vec2 center = f.xy;
vec2 l = (uv - center) / halfSize;
float ell = clamp(1.0 - dot(l, l), 0.0, 1.0);
if (ell <= 0.0001) continue;
float soft = ell * ell;
vec2 eyeL = vec2(-0.34, -0.18);
vec2 eyeR = vec2(0.34, -0.18);
vec2 nose = vec2(0.0, 0.10);
vec2 mouth = vec2(0.0, 0.40);
vec2 eyeLR = vec2(0.22, 0.16);
vec2 eyeRR = vec2(0.22, 0.16);
vec2 noseR = vec2(0.20, 0.24);
vec2 mouthR = vec2(0.30, 0.16);
if (u_hasAnchors > 0.5) {
float ay = (float(i) + 0.5) * 0.25;
vec4 a0 = texture2D(u_anchors, vec2(0.125, ay));
vec4 a1 = texture2D(u_anchors, vec2(0.375, ay));
vec4 a2 = texture2D(u_anchors, vec2(0.625, ay));
vec4 a3 = texture2D(u_anchors, vec2(0.875, ay));
eyeL = a0.xy * 2.0 - 1.0;
eyeR = a0.zw * 2.0 - 1.0;
nose = a1.xy * 2.0 - 1.0;
mouth = a1.zw * 2.0 - 1.0;
eyeLR = max(a2.xy * 0.6, vec2(0.02));
eyeRR = max(a2.zw * 0.6, vec2(0.02));
noseR = max(a3.xy * 0.6, vec2(0.02));
mouthR = max(a3.zw * 0.6, vec2(0.02));
}
float squeeze =
u_faceSlim * 0.16 +
u_jawline * 0.14 * smoothstep(-0.05, 0.75, l.y);
uv.x += squeeze * l.x * soft * halfSize.x;
float chinBand = smoothstep(0.0, 0.65, l.y) * exp(-l.x * l.x * 3.0);
uv.y -= u_chin * 0.14 * chinBand * ell * halfSize.y;
if (abs(u_eyeSize) > 0.001) {
vec2 dL = (l - eyeL) / eyeLR;
vec2 dR = (l - eyeR) / eyeRR;
float fL = clamp(1.0 - dot(dL, dL), 0.0, 1.0);
float fR = clamp(1.0 - dot(dR, dR), 0.0, 1.0);
fL *= fL;
fR *= fR;
uv -= (uv - (center + eyeL * halfSize)) * u_eyeSize * 0.28 * fL;
uv -= (uv - (center + eyeR * halfSize)) * u_eyeSize * 0.28 * fR;
}
if (abs(u_noseSize) > 0.001) {
vec2 dN = (l - nose) / noseR;
float fN = clamp(1.0 - dot(dN, dN), 0.0, 1.0);
fN *= fN;
uv -= (uv - (center + nose * halfSize)) * u_noseSize * 0.26 * fN;
}
if (abs(u_mouthSize) > 0.001) {
vec2 dM = (l - mouth) / mouthR;
float fM = clamp(1.0 - dot(dM, dM), 0.0, 1.0);
fM *= fM;
uv -= (uv - (center + mouth * halfSize)) * u_mouthSize * 0.24 * fM;
}
}
return clamp(uv, 0.0, 1.0);
}
void addTap(vec2 base, vec2 offset, float centerLuma, float invSigma2, inout vec3 acc, inout float wsum) {
vec3 s = texture2D(u_texture, base + offset).rgb;
float dl = luma(s) - centerLuma;
float w = exp(-dl * dl * invSigma2);
acc += s * w;
wsum += w;
}
vec3 whiteBalance() {
return vec3(
1.0 + u_warmth * 0.16 + u_tint * 0.04,
1.0 + u_warmth * 0.03 - u_tint * 0.18,
1.0 - u_warmth * 0.16 + u_tint * 0.04
);
}
#ifndef AURUM_LINEAR
vec3 toneGamma(vec3 c) {
float lc = luma(clamp(c, 0.0, 1.0));
if (abs(u_highlights) > 0.001) {
float m = smoothstep(0.42, 1.0, lc);
c += u_highlights * m * (u_highlights > 0.0 ? (1.0 - c) : c) * 0.6;
}
if (abs(u_shadows) > 0.001) {
float m = 1.0 - smoothstep(0.0, 0.58, lc);
c += u_shadows * m * (u_shadows > 0.0 ? (1.0 - c) : c) * 0.6;
}
if (abs(u_whites) > 0.001 || abs(u_blacks) > 0.001) {
float black = -u_blacks * 0.16;
float white = 1.0 - u_whites * 0.16;
c = (c - black) / max(0.08, white - black);
}
return clamp(c, 0.0, 1.0);
}
#endif
#ifdef AURUM_LINEAR
vec3 toneLinear(vec3 c) {
c = clamp(c, 0.0, 1.0);
float lc = luma(c);
if (lc < 0.000001) return c;
float lp = linearToSrgb1(lc);
float t = lp;
if (abs(u_highlights) > 0.001) {
float m = smoothstep(0.42, 1.0, lp);
t += u_highlights * m * (u_highlights > 0.0 ? (1.0 - lp) : lp) * 0.6;
}
if (abs(u_shadows) > 0.001) {
float m = 1.0 - smoothstep(0.0, 0.58, lp);
t += u_shadows * m * (u_shadows > 0.0 ? (1.0 - lp) : lp) * 0.6;
}
if (abs(u_whites) > 0.001 || abs(u_blacks) > 0.001) {
float black = -u_blacks * 0.16;
float white = 1.0 - u_whites * 0.16;
t = (t - black) / max(0.08, white - black);
}
float target = srgbToLinear1(clamp(t, 0.0, 1.0));
c *= target / lc;
return clamp(c, 0.0, 1.0);
}
#endif
float skinWeight(vec3 c, vec2 uv) {
float y = luma(c);
float cb = -0.168736 * c.r - 0.331264 * c.g + 0.5 * c.b + 0.5;
float cr = 0.5 * c.r - 0.418688 * c.g - 0.081312 * c.b + 0.5;
float m =
smoothstep(0.30, 0.38, cr) * (1.0 - smoothstep(0.60, 0.70, cr)) *
smoothstep(0.28, 0.36, cb) * (1.0 - smoothstep(0.54, 0.64, cb)) *
smoothstep(0.10, 0.22, y) * (1.0 - smoothstep(0.90, 1.0, y));
float face = 0.0;
for (int i = 0; i < 4; i++) {
if (i >= u_faceCount) break;
vec4 f = u_faces[i];
vec2 p = (uv - f.xy) / max(f.zw, vec2(0.0001));
face = max(face, 1.0 - smoothstep(0.72, 1.0, length(p)));
}
return clamp(max(m, face * 0.9), 0.0, 1.0);
}
vec3 rgb2hsv(vec3 c) {
vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
float d = q.x - min(q.w, q.y);
float e = 1.0e-10;
return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c) {
vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
void addBand(
float hue, float center, float width, vec3 shift,
inout float dh, inout float ds, inout float dl, inout float wsum
) {
float d = abs(mod(hue - center + 540.0, 360.0) - 180.0);
float w = 1.0 - smoothstep(width * 0.55, width, d);
if (w > 0.0001) {
dh += shift.x * w;
ds += shift.y * w;
dl += shift.z * w;
wsum += w;
}
}
vec3 sampleLUT(vec3 c) {
float size = u_lutSize;
float slice = c.b * (size - 1.0);
float s0 = floor(slice);
float s1 = min(s0 + 1.0, size - 1.0);
float f = slice - s0;
float y = (c.g * (size - 1.0) + 0.5) / size;
float x0 = (s0 * size + c.r * (size - 1.0) + 0.5) / (size * size);
float x1 = (s1 * size + c.r * (size - 1.0) + 0.5) / (size * size);
vec3 a = texture2D(u_lut, vec2(x0, y)).rgb;
vec3 b = texture2D(u_lut, vec2(x1, y)).rgb;
return mix(a, b, f);
}
float bayer2(vec2 a) {
a = floor(a);
return fract(a.x * 0.5 + a.y * a.y * 0.75);
}
float bayer4(vec2 a) {
return bayer2(0.5 * a) * 0.25 + bayer2(a);
}
void main() {
vec2 uv = warpFace(v_uv);
vec4 texel = texture2D(u_texture, uv);
vec3 c = texel.rgb;
float lc = luma(c);
if (u_denoise > 0.001) {
float sigma = 0.022 + u_denoise * 0.09;
float invSigma2 = 1.0 / max(0.0001, sigma * sigma);
vec3 acc = c;
float wsum = 1.0;
vec2 o = u_texel * (1.0 + u_quality * 1.5);
addTap(uv, vec2(o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, -o.y), lc, invSigma2, acc, wsum);
if (u_quality > 0.5) {
addTap(uv, vec2(o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(o.x, -o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, -o.y), lc, invSigma2, acc, wsum);
}
c = mix(c, acc / wsum, u_denoise * 0.9);
lc = luma(c);
}
if (abs(u_clarity) > 0.001) {
vec2 o = u_texel * (4.0 + u_quality * 6.0);
vec3 blur = c;
blur += texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb;
blur += texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb;
blur += texture2D(u_texture, uv + vec2(0.0, o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb;
if (u_quality > 0.5) {
blur += texture2D(u_texture, uv + vec2(o.x, o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(-o.x, o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(o.x, -o.y)).rgb;
blur += texture2D(u_texture, uv + vec2(-o.x, -o.y)).rgb;
blur /= 9.0;
} else {
blur /= 5.0;
}
float detail = clamp(lc - luma(blur), -0.18, 0.18);
float mid = 1.0 - smoothstep(0.72, 1.0, lc) * 0.55;
c += detail * u_clarity * 1.25 * mid;
lc = luma(c);
}
if (u_sharpen > 0.001) {
vec2 o = u_texel;
float lb =
luma(texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb) +
luma(texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb) +
luma(texture2D(u_texture, uv + vec2(0.0, o.y)).rgb) +
luma(texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb);
float detail = clamp(lc - lb * 0.25, -0.2, 0.2);
float mask = smoothstep(0.006, 0.022, abs(detail));
c += detail * mask * u_sharpen * 2.2;
lc = luma(c);
}
if (
u_smoothSkin > 0.001 ||
abs(u_skinTone) > 0.001 ||
u_blemish > 0.001
) {
float skin = skinWeight(c, uv);
float protect = 0.0;
float lips = 0.0;
#ifdef AURUM_BEAUTY_MASK
if (u_hasMask > 0.5) {
vec3 m = texture2D(u_mask, uv).rgb;
skin = m.r;
protect = m.g;
lips = m.b;
}
#endif
float mask = clamp(skin * (1.0 - protect), 0.0, 1.0);
if (mask > 0.01) {
vec3 base = c;
if (u_smoothSkin > 0.001) {
float invSigma2 = 1.0 / (0.045 * 0.045);
vec3 acc = c;
float wsum = 1.0;
vec2 o = vec2(0.0045);
addTap(uv, vec2(o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, 0.0), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(0.0, -o.y), lc, invSigma2, acc, wsum);
if (u_quality > 0.5) {
addTap(uv, vec2(o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(o.x, -o.y), lc, invSigma2, acc, wsum);
addTap(uv, vec2(-o.x, -o.y), lc, invSigma2, acc, wsum);
}
vec3 soft = acc / wsum;
float detail = length(base - soft);
float keep = smoothstep(0.025, 0.14, detail);
float preserve = mix(0.35, 0.95, u_skinTexture);
float strength = mask * u_smoothSkin * 0.92;
c = mix(base, soft, strength * (1.0 - keep * preserve));
c += (base - soft) * (u_skinTexture * 0.3 * strength);
}
if (u_blemish > 0.001) {
vec2 o = vec2(0.011);
vec3 avg = texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb;
avg += texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb;
avg += texture2D(u_texture, uv + vec2(0.0, o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(o.x, o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(-o.x, o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(o.x, -o.y)).rgb;
avg += texture2D(u_texture, uv + vec2(-o.x, -o.y)).rgb;
avg *= 0.125;
float dark = smoothstep(0.02, 0.07, luma(avg) - lc);
vec3 delta = c - avg;
float red = smoothstep(0.035, 0.11, delta.r - max(delta.g, delta.b));
float spot = max(dark, red * 0.85);
c = mix(c, avg, mask * u_blemish * spot * 0.85);
}
if (abs(u_skinTone) > 0.001) {
vec3 target = u_skinTone > 0.0
? c * vec3(1.035, 1.005, 0.965)
: c * vec3(0.975, 1.0, 1.025);
c = mix(c, target, mask * abs(u_skinTone) * 0.7 * (1.0 - lips * 0.45));
}
lc = luma(c);
}
}
c = clamp(u_color * c + u_offset, 0.0, 1.0);
vec3 wb = whiteBalance();
#ifdef AURUM_LINEAR
c = toLinear(c) * wb;
c *= pow(2.0, u_exposure);
float L = max(luma(c), 0.000001);
if (L > 1.0) {
c *= (1.0 - (1.0 - 1.0 / L) * 0.35) / L;
}
c = toneLinear(c);
c = toSrgb(c);
#else
c *= wb;
c *= pow(2.0, u_exposure);
#endif
c += u_brightness * 0.22;
c = (c - 0.5) * max(0.05, 1.0 + u_contrast) + 0.5;
c = clamp(c, 0.0, 1.0);
lc = luma(c);
c = mix(vec3(lc), c, max(0.0, 1.0 + u_saturation));
if (abs(u_vibrance) > 0.001) {
float mx = max(c.r, max(c.g, c.b));
float mn = min(c.r, min(c.g, c.b));
float sat = mx - mn;
float boost = 1.0 + u_vibrance * (1.0 - smoothstep(0.0, 0.55, sat)) * 0.9;
lc = luma(c);
c = mix(vec3(lc), c, max(0.0, boost));
}
#ifndef AURUM_LINEAR
c = toneGamma(c);
#endif
if (abs(u_gamma) > 0.001) {
c = pow(c, vec3(1.0 / max(0.2, 1.0 + u_gamma * 0.8)));
}
if (u_hasCurve > 0.5) {
c.r = texture2D(u_curve, vec2(clamp(c.r, 0.0, 1.0), 0.5)).r;
c.g = texture2D(u_curve, vec2(clamp(c.g, 0.0, 1.0), 0.5)).g;
c.b = texture2D(u_curve, vec2(clamp(c.b, 0.0, 1.0), 0.5)).b;
}
if (
abs(u_hsl[0].x) + abs(u_hsl[0].y) + abs(u_hsl[0].z) +
abs(u_hsl[1].x) + abs(u_hsl[1].y) + abs(u_hsl[1].z) +
abs(u_hsl[2].x) + abs(u_hsl[2].y) + abs(u_hsl[2].z) +
abs(u_hsl[3].x) + abs(u_hsl[3].y) + abs(u_hsl[3].z) +
abs(u_hsl[4].x) + abs(u_hsl[4].y) + abs(u_hsl[4].z) +
abs(u_hsl[5].x) + abs(u_hsl[5].y) + abs(u_hsl[5].z) +
abs(u_hsl[6].x) + abs(u_hsl[6].y) + abs(u_hsl[6].z) +
abs(u_hsl[7].x) + abs(u_hsl[7].y) + abs(u_hsl[7].z) > 0.001
) {
vec3 hsv = rgb2hsv(clamp(c, 0.0, 1.0));
float hue = hsv.x * 360.0;
float dh = 0.0;
float ds = 0.0;
float dl = 0.0;
float wsum = 0.0;
addBand(hue, 0.0, 42.0, u_hsl[0], dh, ds, dl, wsum);
addBand(hue, 30.0, 36.0, u_hsl[1], dh, ds, dl, wsum);
addBand(hue, 60.0, 42.0, u_hsl[2], dh, ds, dl, wsum);
addBand(hue, 120.0, 60.0, u_hsl[3], dh, ds, dl, wsum);
addBand(hue, 180.0, 54.0, u_hsl[4], dh, ds, dl, wsum);
addBand(hue, 240.0, 54.0, u_hsl[5], dh, ds, dl, wsum);
addBand(hue, 285.0, 42.0, u_hsl[6], dh, ds, dl, wsum);
addBand(hue, 320.0, 42.0, u_hsl[7], dh, ds, dl, wsum);
if (wsum > 0.001) {
hsv.x = fract(hsv.x + (dh / max(1.0, wsum)) * 0.0833);
hsv.y = clamp(hsv.y * (1.0 + (ds / max(1.0, wsum)) * 0.85), 0.0, 1.0);
hsv.z = clamp(hsv.z * (1.0 + (dl / max(1.0, wsum)) * 0.5), 0.0, 1.0);
c = hsv2rgb(hsv);
}
}
if (u_lutStrength > 0.001) {
c = mix(c, sampleLUT(clamp(c, 0.0, 1.0)), u_lutStrength);
}
c = clamp(c, 0.0, 1.0);
vec2 p = (v_screen - u_vigCenter) / max(u_vigHalf, vec2(0.0001));
float d = length(vec2(p.x * u_aspect, p.y)) / sqrt(u_aspect * u_aspect + 1.0);
float v = smoothstep(0.34, 1.0, d) * u_vignette * 0.88;
c *= (1.0 - v);
if (u_dither > 0.001) {
float b = bayer4(gl_FragCoord.xy) * 1.0666667 - 0.5;
c += b * (u_dither / 255.0);
}
gl_FragColor = vec4(clamp(c, 0.0, 1.0), texel.a);
}
`,fallback:`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D u_texture;
uniform mat3 u_color;
uniform vec3 u_offset;
uniform float u_exposure;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_saturation;
uniform float u_gamma;
uniform float u_vignette;
uniform float u_aspect;
uniform vec2 u_vigCenter;
uniform vec2 u_vigHalf;
uniform float u_dither;
varying vec2 v_uv;
varying vec2 v_screen;
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
float bayer2(vec2 a) {
a = floor(a);
return fract(a.x * 0.5 + a.y * a.y * 0.75);
}
float bayer4(vec2 a) {
return bayer2(0.5 * a) * 0.25 + bayer2(a);
}
void main() {
vec4 texel = texture2D(u_texture, v_uv);
vec3 c = clamp(u_color * texel.rgb + u_offset, 0.0, 1.0);
c *= pow(2.0, u_exposure);
c += u_brightness * 0.22;
c = (c - 0.5) * max(0.05, 1.0 + u_contrast) + 0.5;
c = clamp(c, 0.0, 1.0);
float lc = luma(c);
c = mix(vec3(lc), c, max(0.0, 1.0 + u_saturation));
if (abs(u_gamma) > 0.001) {
c = pow(c, vec3(1.0 / max(0.2, 1.0 + u_gamma * 0.8)));
}
c = clamp(c, 0.0, 1.0);
vec2 p = (v_screen - u_vigCenter) / max(u_vigHalf, vec2(0.0001));
float d = length(vec2(p.x * u_aspect, p.y)) / sqrt(u_aspect * u_aspect + 1.0);
float v = smoothstep(0.34, 1.0, d) * u_vignette * 0.88;
c *= (1.0 - v);
if (u_dither > 0.001) {
float b = bayer4(gl_FragCoord.xy) * 1.0666667 - 0.5;
c += b * (u_dither / 255.0);
}
gl_FragColor = vec4(clamp(c, 0.0, 1.0), texel.a);
}
`},Ji=Object.keys(de);function gi(a,i,t){return a?i?t?"beauty-liquify":"beauty":t?"base-linear-liquify":"base-linear":i?t?"beauty-gamma-liquify":"beauty-gamma":t?"base-liquify":"base"}var Pe=0,He=1,Ue=2,ta=new Float32Array(16),ea=new Float32Array(24),ia=new Float32Array([1,0,0,0,1,0,0,0,1]),aa=[0,0],lt=10,ra=24;function bi(a,i,t,e){let r=a.createShader(i);if(!r)return null;if(a.shaderSource(r,t),a.compileShader(r),!a.getShaderParameter(r,a.COMPILE_STATUS)){let s=a.getShaderInfoLog(r)||"unknown compile error";return console.warn(`[aurum] ${e} shader failed: ${s}`),a.deleteShader(r),null}return r}function sa(a,i){let t=e=>a.getUniformLocation(i,e);return{matrix:t("u_matrix"),warp:t("u_warp"),color:t("u_color"),offset:t("u_offset"),vignette:t("u_vignette"),aspect:t("u_aspect"),vigCenter:t("u_vigCenter"),vigHalf:t("u_vigHalf"),texel:t("u_texel"),textureLoc:t("u_texture"),curveLoc:t("u_curve"),lutLoc:t("u_lut"),maskLoc:t("u_mask"),liquifyLoc:t("u_liquify"),liquifyShift:t("u_liquifyShift"),dither:t("u_dither"),exposure:t("u_exposure"),brightness:t("u_brightness"),contrast:t("u_contrast"),saturation:t("u_saturation"),highlights:t("u_highlights"),shadows:t("u_shadows"),whites:t("u_whites"),blacks:t("u_blacks"),warmth:t("u_warmth"),tint:t("u_tint"),vibrance:t("u_vibrance"),gamma:t("u_gamma"),clarity:t("u_clarity"),sharpen:t("u_sharpen"),denoise:t("u_denoise"),smoothSkin:t("u_smoothSkin"),blemish:t("u_blemish"),skinTexture:t("u_skinTexture"),skinTone:t("u_skinTone"),hasMask:t("u_hasMask"),hasCurve:t("u_hasCurve"),lutStrength:t("u_lutStrength"),lutSize:t("u_lutSize"),quality:t("u_quality"),faces:t("u_faces"),faceCount:t("u_faceCount"),anchors:t("u_anchors"),hasAnchors:t("u_hasAnchors"),hsl:t("u_hsl"),faceSlim:t("u_faceSlim"),jawline:t("u_jawline"),chin:t("u_chin"),eyeSize:t("u_eyeSize"),noseSize:t("u_noseSize"),mouthSize:t("u_mouthSize")}}function qe(a,i){let t=bi(a,a.VERTEX_SHADER,De,`${i} vertex`);if(!t)return null;let e=bi(a,a.FRAGMENT_SHADER,de[i],`${i} fragment`);if(!e)return a.deleteShader(t),null;let r=a.createProgram();if(!r)return a.deleteShader(t),a.deleteShader(e),null;if(a.attachShader(r,t),a.attachShader(r,e),a.bindAttribLocation(r,Pe,"a_pos"),a.bindAttribLocation(r,He,"a_uv"),a.bindAttribLocation(r,Ue,"a_w"),a.linkProgram(r),a.deleteShader(t),a.deleteShader(e),!a.getProgramParameter(r,a.LINK_STATUS)){let s=a.getProgramInfoLog(r)||"unknown link error";return console.warn(`[aurum] ${i} program failed: ${s}`),a.deleteProgram(r),null}return{program:r,u:sa(a,r)}}function oa(a,i){if(a.programs.has(i))return a.programs.get(i)??a.fallback;let t=qe(a.gl,i);return a.programs.set(i,t),t||(console.warn(`[aurum] shader variant "${i}" unavailable; using the fallback program`),a.fallback)}function Fe(a,i){for(let t of i.values())t&&a.deleteProgram(t.program);i.clear()}function na(a){a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.LINEAR)}function kt(a){let i=a.createTexture();return i?(a.bindTexture(a.TEXTURE_2D,i),na(a),i):null}function Ne(a,i=!1){let t=null;try{t=a.getContext("webgl",{alpha:!0,premultipliedAlpha:!1,antialias:!1,depth:!1,stencil:!1,preserveDrawingBuffer:i,powerPreference:"high-performance"})}catch{t=null}if(!t)return null;let e=new Map,r=qe(t,"base");e.set("base",r);let s=r;if(!s){let m=qe(t,"fallback");e.set("fallback",m),s=m}if(!s)return null;let o=t.createBuffer();if(!o)return Fe(t,e),null;let n=new Float32Array([-1,-1,0,0,1,1,-1,1,0,1,1,1,1,1,1,-1,-1,0,0,1,1,1,1,1,1,-1,1,0,1,1]);t.bindBuffer(t.ARRAY_BUFFER,o),t.bufferData(t.ARRAY_BUFFER,n,t.STATIC_DRAW);let u=kt(t),l=kt(t),c=kt(t),h=kt(t),p=kt(t),v=kt(t),f=kt(t);if(!u||!l||!c||!h||!p||!v||!f){t.deleteBuffer(o);for(let m of[u,l,c,h,p,v,f])m&&t.deleteTexture(m);return Fe(t,e),null}return t.bindTexture(t.TEXTURE_2D,v),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.bindTexture(t.TEXTURE_2D,f),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([255,255,255,255])),{gl:t,buffer:o,texture:u,curveTexture:l,lutTexture:c,maskTexture:h,liquifyTexture:p,anchorTexture:v,whiteTexture:f,programs:e,active:s,fallback:s,maxTexture:Math.min(8192,t.getParameter(t.MAX_TEXTURE_SIZE)),texWidth:1,texHeight:1,curveRef:null,lutRef:null,maskRef:null,liquifyRef:null,anchorRef:null,lutSize:0}}function Ye(a){return a instanceof HTMLImageElement?{width:a.naturalWidth||a.width,height:a.naturalHeight||a.height}:{width:a.width,height:a.height}}function yi(a,i){let{gl:t}=a;try{let e=Ye(i);return t.bindTexture(t.TEXTURE_2D,a.texture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,i),a.texWidth=e.width,a.texHeight=e.height,!0}catch{return!1}}function _i(a,i){let{gl:t}=a;if(i.curve!==a.curveRef&&(i.curve&&(t.bindTexture(t.TEXTURE_2D,a.curveTexture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,256,1,0,t.RGBA,t.UNSIGNED_BYTE,i.curve)),a.curveRef=i.curve),i.lut!==a.lutRef||i.lutSize!==a.lutSize){if(i.lut){let e=Math.max(2,Math.round(i.lutSize));t.bindTexture(t.TEXTURE_2D,a.lutTexture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,e*e,e,0,t.RGBA,t.UNSIGNED_BYTE,i.lut)}a.lutRef=i.lut,a.lutSize=i.lutSize}i.mask!==a.maskRef&&(i.mask&&(t.bindTexture(t.TEXTURE_2D,a.maskTexture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,i.mask.width,i.mask.height,0,t.RGBA,t.UNSIGNED_BYTE,i.mask.data)),a.maskRef=i.mask),i.liquify!==a.liquifyRef&&(i.liquify&&(t.bindTexture(t.TEXTURE_2D,a.liquifyTexture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,i.liquify.width,i.liquify.height,0,t.RGBA,t.UNSIGNED_BYTE,i.liquify.data)),a.liquifyRef=i.liquify)}function ua(a){let i=a.matrix;return{matrix:new Float32Array([i[0],i[3],i[6],i[1],i[4],i[7],i[2],i[5],i[8]]),offset:new Float32Array([a.offset[0],a.offset[1],a.offset[2]])}}function la(a){let i=a.rotation*Math.PI/180,t=Math.cos(i),e=Math.sin(i),r=Math.max(1,a.width/2),s=Math.max(1,a.height/2),o=a.view.scale,n=t*a.sx*o,u=e*a.sx*o,l=-e*a.sy*o,c=t*a.sy*o,h=t*(a.sx*a.offsetX)-e*(a.sy*a.offsetY),p=e*(a.sx*a.offsetX)+t*(a.sy*a.offsetY),v=r+h,f=s+p,m=v*o+a.view.x,g=f*o+a.view.y;return new Float32Array([n/r,-u/s,0,l/r,-c/s,0,(m-r)/r,(s-g)/s,1])}function ca(a){let{gl:i}=a;i.bindBuffer(i.ARRAY_BUFFER,a.buffer),i.enableVertexAttribArray(Pe),i.vertexAttribPointer(Pe,2,i.FLOAT,!1,20,0),i.enableVertexAttribArray(He),i.vertexAttribPointer(He,2,i.FLOAT,!1,20,8),i.enableVertexAttribArray(Ue),i.vertexAttribPointer(Ue,1,i.FLOAT,!1,20,16)}function wi(a,i){let{gl:t}=a,e=ua(i.color),r=i.enhance,s=oa(a,gi(r.linear>.5,!!r.mask,!!r.liquify));a.active=s;let o=s.u;t.useProgram(s.program),ca(a),t.uniformMatrix3fv(o.matrix,!1,i.matrix),t.uniform2f(o.warp,i.warp[0],i.warp[1]),t.uniformMatrix3fv(o.color,!1,e.matrix),t.uniform3fv(o.offset,e.offset),t.uniform1f(o.vignette,Math.max(0,Math.min(1,i.vignette))),t.uniform1f(o.aspect,i.aspect),t.uniform2f(o.vigCenter,i.vigCenter[0],i.vigCenter[1]),t.uniform2f(o.vigHalf,i.vigHalf[0],i.vigHalf[1]),t.uniform2f(o.texel,i.texel[0],i.texel[1]),t.uniform1f(o.dither,r.dither),t.uniform1f(o.exposure,r.exposure),t.uniform1f(o.brightness,r.brightness),t.uniform1f(o.contrast,r.contrast),t.uniform1f(o.saturation,r.saturation),t.uniform1f(o.highlights,r.highlights),t.uniform1f(o.shadows,r.shadows),t.uniform1f(o.whites,r.whites),t.uniform1f(o.blacks,r.blacks),t.uniform1f(o.warmth,r.warmth),t.uniform1f(o.tint,r.tint),t.uniform1f(o.vibrance,r.vibrance),t.uniform1f(o.gamma,r.gamma),t.uniform1f(o.clarity,r.clarity),t.uniform1f(o.sharpen,r.sharpen),t.uniform1f(o.denoise,r.denoise),t.uniform1f(o.smoothSkin,r.smoothSkin),t.uniform1f(o.blemish,r.blemish),t.uniform1f(o.skinTexture,r.skinTexture),t.uniform1f(o.skinTone,r.skinTone),t.uniform1f(o.hasMask,r.mask?1:0),t.uniform1f(o.liquifyShift,r.liquify?r.liquify.shift:0),t.uniform1f(o.hasCurve,r.curve?1:0),t.uniform1f(o.lutStrength,r.lut?r.lutStrength:0),t.uniform1f(o.lutSize,Math.max(2,r.lutSize)),t.uniform1f(o.quality,r.quality),t.uniform4fv(o.faces,r.faces||ta),t.uniform1i(o.faceCount,Math.max(0,Math.min(4,r.faceCount))),t.uniform1f(o.hasAnchors,r.anchors?1:0),t.uniform3fv(o.hsl,r.hsl||ea),t.uniform1f(o.faceSlim,r.faceSlim),t.uniform1f(o.jawline,r.jawline),t.uniform1f(o.chin,r.chin),t.uniform1f(o.eyeSize,r.eyeSize),t.uniform1f(o.noseSize,r.noseSize),t.uniform1f(o.mouthSize,r.mouthSize),t.uniform1i(o.textureLoc,0),t.uniform1i(o.curveLoc,1),t.uniform1i(o.lutLoc,2),t.uniform1i(o.maskLoc,3),t.uniform1i(o.liquifyLoc,4),t.uniform1i(o.anchors,5),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,a.texture),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,r.curve?a.curveTexture:a.whiteTexture),t.activeTexture(t.TEXTURE2),t.bindTexture(t.TEXTURE_2D,r.lut?a.lutTexture:a.whiteTexture),t.activeTexture(t.TEXTURE3),t.bindTexture(t.TEXTURE_2D,r.mask?a.maskTexture:a.whiteTexture),t.activeTexture(t.TEXTURE4),t.bindTexture(t.TEXTURE_2D,r.liquify?a.liquifyTexture:a.whiteTexture),t.activeTexture(t.TEXTURE5),t.bindTexture(t.TEXTURE_2D,r.anchors?a.anchorTexture:a.whiteTexture),r.anchors&&a.anchorRef!==r.anchors&&(t.texImage2D(t.TEXTURE_2D,0,t.RGBA,4,4,0,t.RGBA,t.UNSIGNED_BYTE,r.anchors),a.anchorRef=r.anchors),t.drawArrays(t.TRIANGLES,0,6)}function ha(a){let i=Math.max(1,a.width),t=Math.max(1,a.height),e=a.vignetteRect;return{center:[(e.x+e.width/2)/i*2-1,1-(e.y+e.height/2)/t*2],half:[Math.max(1e-4,e.width/i),Math.max(1e-4,e.height/t)],aspect:e.width/Math.max(1,e.height)}}function Si(a){return!a||Math.abs(a.a)<1e-4&&Math.abs(a.b)<1e-4}function da(a,i,t,e,r,s){let o=i.x-a.x,n=i.y-a.y,u=t.x-a.x,l=t.y-a.y,c=o*l-n*u;if(Math.abs(c)<1e-8)return null;let h=r.x-e.x,p=s.x-e.x,v=r.y-e.y,f=s.y-e.y,m=(h*l-p*n)/c,g=(-h*u+p*o)/c,x=(v*l-f*n)/c,_=(-v*u+f*o)/c;return[m,x,g,_,e.x-m*a.x-g*a.y,e.y-x*a.x-_*a.y]}function fe(a,i,t,e,r,s,o,n,u){let l=da(t,e,r,s,o,n);l&&(a.save(),a.beginPath(),a.moveTo(s.x,s.y),a.lineTo(o.x,o.y),a.lineTo(n.x,n.y),a.closePath(),a.clip(),a.setTransform(u*l[0],u*l[1],u*l[2],u*l[3],u*l[4],u*l[5]),a.drawImage(i,0,0),a.restore())}function fa(a,i,t){let e=Ye(i),r=Math.max(1,e.width),s=Math.max(1,e.height),o=t.rotation*Math.PI/180,n=Math.cos(o),u=Math.sin(o),l=t.view,c=t.width/2,h=t.height/2,p=(f,m)=>{let g=Bt({x:f*2-1,y:m*2-1},t.warp),x=(g.x+t.offsetX)*t.sx,_=(g.y+t.offsetY)*t.sy;return{x:l.x+l.scale*(c+n*x-u*_),y:l.y+l.scale*(h+u*x+n*_)}},v=[];for(let f=0;f<=lt;f+=1){let m=[];for(let g=0;g<=lt;g+=1)m.push(p(g/lt,f/lt));v.push(m)}a.imageSmoothingEnabled=!0,a.imageSmoothingQuality="high";for(let f=0;f<lt;f+=1)for(let m=0;m<lt;m+=1){let g=m/lt,x=(m+1)/lt,_=f/lt,y=(f+1)/lt,w={x:g*r,y:_*s},T={x:x*r,y:_*s},k={x:x*r,y:y*s},E={x:g*r,y:y*s},L=v[f][m],R=v[f][m+1],C=v[f+1][m+1],z=v[f+1][m];fe(a,i,w,T,k,L,R,C,t.dpr),fe(a,i,w,k,E,L,C,z,t.dpr)}}function pa(a,i,t){a.save(),a.setTransform(t.dpr,0,0,t.dpr,0,0),a.clearRect(0,0,t.width,t.height),t.clipRect&&t.clipRect.width>0&&t.clipRect.height>0&&(a.beginPath(),a.rect(t.clipRect.x,t.clipRect.y,t.clipRect.width,t.clipRect.height),a.clip()),a.filter=t.css||"none",Si(t.warp)?(a.translate(t.view.x,t.view.y),a.scale(t.view.scale,t.view.scale),a.translate(t.width/2,t.height/2),a.rotate(t.rotation*Math.PI/180),a.scale(t.sx,t.sy),a.translate(t.offsetX,t.offsetY),a.imageSmoothingEnabled=!0,a.imageSmoothingQuality="high",a.drawImage(i,-1,-1,2,2)):fa(a,i,t),a.filter="none",a.restore();let e=t.vignetteRect;if(t.vignette>0&&e.width>0&&e.height>0){a.save(),a.setTransform(t.dpr,0,0,t.dpr,0,0),a.beginPath(),a.rect(e.x,e.y,e.width,e.height),a.clip();let r=e.x+e.width/2,s=e.y+e.height/2,o=Math.max(e.width,e.height)*.74,n=a.createRadialGradient(r,s,Math.min(e.width,e.height)*.22,r,s,o);n.addColorStop(0,"rgba(0,0,0,0)"),n.addColorStop(.62,`rgba(0,0,0,${t.vignette*.25})`),n.addColorStop(1,`rgba(0,0,0,${t.vignette*.88})`),a.fillStyle=n,a.fillRect(e.x,e.y,e.width,e.height),a.restore()}}function ma(a,i,t,e){if(e<=0)return;let r=a.createRadialGradient(i/2,t/2,Math.min(i,t)*.2,i/2,t/2,Math.max(i,t)*.74);r.addColorStop(0,"rgba(0,0,0,0)"),r.addColorStop(.62,`rgba(0,0,0,${e*.25})`),r.addColorStop(1,`rgba(0,0,0,${e*.88})`),a.fillStyle=r,a.fillRect(0,0,i,t)}function Xe(a,i,t){return new Promise((e,r)=>{a.toBlob(s=>s?e(s):r(new Error("Export failed: canvas is empty")),i,t)})}var pe=class{constructor(i){d(this,"canvas");d(this,"glState",null);d(this,"ctx2d",null);d(this,"bitmap",null);d(this,"cssWidth",0);d(this,"cssHeight",0);d(this,"dpr",1);d(this,"textureDirty",!0);d(this,"lastSpec",null);d(this,"contextLost",!1);d(this,"onContextLost",i=>{i.preventDefault(),this.contextLost=!0});d(this,"onContextRestored",()=>{this.contextLost=!1,this.glState=Ne(this.canvas),this.ctx2d=null,this.textureDirty=!0,this.lastSpec&&this.render(this.lastSpec)});this.canvas=i,this.glState=Ne(i),this.glState||(this.ctx2d=i.getContext("2d",{alpha:!0})),i.addEventListener("webglcontextlost",this.onContextLost),i.addEventListener("webglcontextrestored",this.onContextRestored)}get accelerated(){return this.glState!==null&&!this.contextLost}setBitmap(i){this.bitmap=i,this.textureDirty=!0}resize(i,t,e){this.cssWidth=Math.max(1,i),this.cssHeight=Math.max(1,t),this.dpr=Math.max(1,Math.min(3,e||1));let r=Math.max(1,Math.round(this.cssWidth*this.dpr)),s=Math.max(1,Math.round(this.cssHeight*this.dpr));(this.canvas.width!==r||this.canvas.height!==s)&&(this.canvas.width=r,this.canvas.height=s)}render(i){if(!this.bitmap||(this.lastSpec=i,this.contextLost))return;let t=this.glState;if(t){let{gl:r}=t;if(r.isContextLost()){this.contextLost=!0;return}if(this.textureDirty){if(!yi(t,this.bitmap)){this.textureDirty=!1;return}this.textureDirty=!1}_i(t,i.enhance),r.viewport(0,0,this.canvas.width,this.canvas.height),r.clearColor(0,0,0,0),r.clear(r.COLOR_BUFFER_BIT),r.disable(r.BLEND);let s=i.clipRect,o=!!s&&s.width>0&&s.height>0;o&&(r.enable(r.SCISSOR_TEST),r.scissor(Math.round(s.x*this.dpr),Math.round((i.height-s.y-s.height)*this.dpr),Math.max(1,Math.round(s.width*this.dpr)),Math.max(1,Math.round(s.height*this.dpr))));let n=ha(i);wi(t,{matrix:la(i),warp:[i.warp.a,i.warp.b],color:i.color,vignette:i.vignette,aspect:n.aspect,vigCenter:n.center,vigHalf:n.half,texel:[1/Math.max(1,t.texWidth),1/Math.max(1,t.texHeight)],enhance:i.enhance}),o&&r.disable(r.SCISSOR_TEST);return}let e=this.ctx2d;e&&pa(e,this.bitmap,i)}dispose(){this.canvas.removeEventListener("webglcontextlost",this.onContextLost),this.canvas.removeEventListener("webglcontextrestored",this.onContextRestored);let i=this.glState;i&&Ti(i),this.glState=null,this.ctx2d=null,this.bitmap=null,this.lastSpec=null,this.contextLost=!1}};function Ti(a){let{gl:i}=a;i.deleteBuffer(a.buffer),i.deleteTexture(a.texture),i.deleteTexture(a.curveTexture),i.deleteTexture(a.lutTexture),i.deleteTexture(a.maskTexture),i.deleteTexture(a.liquifyTexture),i.deleteTexture(a.anchorTexture),i.deleteTexture(a.whiteTexture),Fe(i,a.programs)}function va(a,i){let t=Ye(a);if(!t.width||!t.height||Math.max(t.width,t.height)<=i)return a;let e=i/Math.max(t.width,t.height),r=document.createElement("canvas");r.width=Math.max(1,Math.round(t.width*e)),r.height=Math.max(1,Math.round(t.height*e));let s=r.getContext("2d");return s?(s.imageSmoothingQuality="high",s.drawImage(a,0,0,r.width,r.height),r):a}function ki(a,i,t){let e=vi(a,i,t),r=e[8],s=e[6]*i+e[8],o=e[7]*t+e[8],n=e[6]*i+e[7]*t+e[8];return r+s+o+n<0?[-e[0],-e[1],-e[2],-e[3],-e[4],-e[5],-e[6],-e[7],-e[8]]:e}function ga(a,i,t,e){let r=ra,s=[];for(let o=0;o<=r;o+=1){let n=[];for(let u=0;u<=r;u+=1){let l=Ce(e,u/r*t.width,o/r*t.height);n.push({x:l.x,y:l.y})}s.push(n)}a.imageSmoothingEnabled=!0,a.imageSmoothingQuality="high";for(let o=0;o<r;o+=1)for(let n=0;n<r;n+=1){let u={x:n/r*t.width,y:o/r*t.height},l={x:(n+1)/r*t.width,y:o/r*t.height},c={x:(n+1)/r*t.width,y:(o+1)/r*t.height},h={x:n/r*t.width,y:(o+1)/r*t.height},p=s[o][n],v=s[o][n+1],f=s[o+1][n+1],m=s[o+1][n];fe(a,i,p,v,f,u,l,c,1),fe(a,i,p,f,m,u,c,h,1)}}function ba(a,i,t,e,r){dt(r.signal);let s=document.createElement("canvas");s.width=i.width,s.height=i.height;let o=s.getContext("2d");if(!o)return Promise.reject(new Error("2D canvas is unavailable"));let n=ki(i.quad,i.width,i.height);if(o.save(),o.beginPath(),o.rect(0,0,i.width,i.height),o.clip(),o.filter=i.css||"none",Si(i.warp)){let{tl:u,tr:l,bl:c}=i.quad,h=(l.x-u.x)/i.width,p=(l.y-u.y)/i.width,v=(c.x-u.x)/i.height,f=(c.y-u.y)/i.height,m=h*f-p*v;if(Math.abs(m)>1e-8){let g=f/m,x=-v/m,_=-p/m,y=h/m,w=-(g*u.x+x*u.y),T=-(_*u.x+y*u.y);o.setTransform(g,_,x,y,w,T),o.imageSmoothingQuality="high",o.drawImage(a,0,0)}}else ga(o,a,i,n);return o.filter="none",o.restore(),o.setTransform(1,0,0,1,0,0),ma(o,i.width,i.height,i.vignette),r.onProgress?.({phase:"encode",progress:.9,tile:1,tiles:1}),Xe(s,t,e).then(u=>(r.onProgress?.({phase:"encode",progress:1,tile:1,tiles:1}),u))}function xa(a,i,t,e,r,s){let{gl:o}=a,n=ki(i.quad,i.width,i.height),u=Math.max(1,i.srcWidth),l=Math.max(1,i.srcHeight),c=[[t,e],[t+r,e],[t+r,e+s],[t,e+s]],h=(f,m)=>{let g=Ce(n,f,m),x=g.w>1e-4?g.w:1e-4,_=2*(f-t)/Math.max(1,r)-1,y=1-2*(m-e)/Math.max(1,s);return[_*x,y*x,g.x/u,g.y/l,x]},p=c.map(([f,m])=>h(f,m)),v=new Float32Array([...p[0],...p[1],...p[2],...p[0],...p[2],...p[3]]);o.bindBuffer(o.ARRAY_BUFFER,a.buffer),o.bufferData(o.ARRAY_BUFFER,v,o.DYNAMIC_DRAW)}function ya(a,i,t,e,r,s){let o=r/a,u=-(2*t/a-1+o)/o,l=1/o,c=s/i,p=-(1-2*e/i-c)/c,v=1/c;return{center:[u,p],half:[l,v]}}function xi(a,i,t,e,r,s){let{gl:o}=a;o.viewport(0,0,r,s),o.clearColor(0,0,0,0),o.clear(o.COLOR_BUFFER_BIT),o.disable(o.BLEND),xa(a,i,t,e,r,s);let n=ya(i.width,i.height,t,e,r,s);wi(a,{matrix:ia,warp:aa,color:i.color,vignette:i.vignette,aspect:i.width/Math.max(1,i.height),vigCenter:n.center,vigHalf:n.half,texel:[1/Math.max(1,a.texWidth),1/Math.max(1,a.texHeight)],enhance:{...i.enhance,quality:1}})}async function _a(a,i,t,e,r){let s=Math.max(256,Math.min(8192,Math.round(r.tileSize??2048))),o=Math.ceil(i.width/s),n=Math.ceil(i.height/s),u=o*n,l=u===1,c=document.createElement("canvas");c.width=l?i.width:Math.min(s,i.width),c.height=l?i.height:Math.min(s,i.height);let h=Ne(c,!0);if(!h)throw new Error("WebGL unavailable");try{let p=va(a,h.maxTexture);if(!yi(h,p))throw new Error("Texture upload failed");if(_i(h,i.enhance),l){xi(h,i,0,0,i.width,i.height),r.onProgress?.({phase:"encode",progress:.9,tile:1,tiles:1});let x=await Xe(c,t,e);return r.onProgress?.({phase:"encode",progress:1,tile:1,tiles:1}),x}let v=document.createElement("canvas");v.width=i.width,v.height=i.height;let f=v.getContext("2d");if(!f)throw new Error("2D canvas is unavailable");let m=0;for(let x=0;x<n;x+=1)for(let _=0;_<o;_+=1){dt(r.signal);let y=_*s,w=x*s,T=Math.min(s,i.width-y),k=Math.min(s,i.height-w);c.width=T,c.height=k,xi(h,i,y,w,T,k),f.drawImage(c,y,w),m+=1,r.onProgress?.({phase:"render",progress:m/u*.9,tile:m,tiles:u}),await he()}dt(r.signal),r.onProgress?.({phase:"encode",progress:.95,tile:u,tiles:u});let g=await Xe(v,t,e);return r.onProgress?.({phase:"encode",progress:1,tile:u,tiles:u}),g}finally{Ti(h)}}async function Mi(a,i,t,e,r={}){dt(r.signal);try{if(typeof WebGLRenderingContext<"u"&&document.createElement("canvas").getContext("webgl"))return await _a(a,i,t,e,r)}catch(s){if(ot(s))throw s}return ba(a,i,t,e,r)}function wa(a){let i=a.length;if(i<2)return[0];let t=new Array(i-1);for(let r=0;r<i-1;r+=1){let s=Math.max(1e-6,a[r+1].x-a[r].x);t[r]=(a[r+1].y-a[r].y)/s}let e=new Array(i);e[0]=t[0],e[i-1]=t[i-2];for(let r=1;r<i-1;r+=1)e[r]=(t[r-1]+t[r])*.5;for(let r=0;r<i-1;r+=1){if(Math.abs(t[r])<1e-9){e[r]=0,e[r+1]=0;continue}let s=e[r]/t[r],o=e[r+1]/t[r],n=s*s+o*o;if(n>9){let u=3/Math.sqrt(n);e[r]=u*s*t[r],e[r+1]=u*o*t[r]}}return e}function Dt(a,i){let t=a.length;if(t===0)return S(i,0,1);if(t===1)return S(a[0].y,0,1);if(i<=a[0].x)return S(a[0].y,0,1);if(i>=a[t-1].x)return S(a[t-1].y,0,1);let e=0,r=t-1;for(;r-e>1;){let g=e+r>>1;a[g].x<=i?e=g:r=g}let s=a[e],o=a[r],n=Math.max(1e-6,o.x-s.x),u=(i-s.x)/n,l=wa(a),c=u*u,h=c*u,p=2*h-3*c+1,v=h-2*c+u,f=-2*h+3*c,m=h-c;return S(p*s.y+v*n*l[e]+f*o.y+m*n*l[r],0,1)}function me(a){if(a.length!==2){for(let i=0;i<=16;i+=1){let t=i/16;if(Math.abs(Dt(a,t)-t)>1/255)return!1}return!0}return Math.abs(a[0].x)<1e-6&&Math.abs(a[0].y)<1e-6&&Math.abs(a[1].x-1)<1e-6&&Math.abs(a[1].y-1)<1e-6}function Li(a){return me(a.rgb)&&me(a.r)&&me(a.g)&&me(a.b)}function je(a){if(Li(a))return null;let i=new Uint8Array(256*4);for(let t=0;t<256;t+=1){let e=t/255,r=Dt(a.rgb,e);i[t*4]=Math.round(S(Dt(a.r,r),0,1)*255),i[t*4+1]=Math.round(S(Dt(a.g,r),0,1)*255),i[t*4+2]=Math.round(S(Dt(a.b,r),0,1)*255),i[t*4+3]=255}return i}var Q=(a,i)=>({x:a,y:i}),We=[{id:"linear",label:"Tuyến tính",labelEn:"Linear",points:mt()},{id:"soft",label:"Mềm",labelEn:"Soft",points:[Q(0,.03),Q(.25,.22),Q(.5,.5),Q(.75,.79),Q(1,.98)]},{id:"contrast",label:"Tương phản",labelEn:"Contrast",points:[Q(0,0),Q(.22,.16),Q(.5,.5),Q(.78,.85),Q(1,1)]},{id:"fade",label:"Bạc màu",labelEn:"Fade",points:[Q(0,.1),Q(.28,.3),Q(.5,.52),Q(.74,.73),Q(1,.9)]}];function Sa(a,i="rgb"){let t=We.find(e=>e.id===a)||We[0];return i==="rgb"?t.points.map(e=>({...e})):mt()}var Ri=17,Ge=[{id:"none",label:"Không",labelEn:"None"},{id:"cinema",label:"Điện ảnh",labelEn:"Cinema"},{id:"teal",label:"Xanh ngọc",labelEn:"Teal & Orange"},{id:"fade",label:"Bạc màu",labelEn:"Fade"},{id:"noir",label:"Đen trắng",labelEn:"Noir"},{id:"warm",label:"Ấm",labelEn:"Warm"},{id:"cool",label:"Lạnh",labelEn:"Cool"}],Mt=a=>a<0?0:a>1?1:a,ve=(a,i,t)=>a*.2126+i*.7152+t*.0722;function Ta(a,i,t){let e=Mt((t-a)/Math.max(1e-6,i-a));return e*e*(3-2*e)}function Ot(a,i){let t=ve(a[0],a[1],a[2]);return[t+(a[0]-t)*i,t+(a[1]-t)*i,t+(a[2]-t)*i]}function Ai(a,i,t=.5){return[(a[0]-t)*i+t,(a[1]-t)*i+t,(a[2]-t)*i+t]}function $t(a){return[Mt(a[0]),Mt(a[1]),Mt(a[2])]}var ka={cinema(a,i,t){let e=ve(a,i,t),r=[a+.032*e-.018*(1-e),i+.006*e+.008*(1-e),t-.03*e+.045*(1-e)];return r=Ai(r,1.06,.46),r=Ot(r,1.06),$t(r)},teal(a,i,t){let e=ve(a,i,t),r=[a+.06*e-.035*(1-e),i+.012*e+.022*(1-e),t-.05*e+.075*(1-e)];return r=Ai(r,1.08,.47),r=Ot(r,1.1),$t(r)},fade(a,i,t){let e=[a*.82+.11,i*.82+.105,t*.82+.1];return e=Ot(e,.82),e=[e[0]*1.015,e[1],e[2]*.99],$t(e)},noir(a,i,t){let e=ve(a,i,t);return e=Ta(.06,.94,e),[e*.995,e,e*1.012]},warm(a,i,t){let e=[a*1.06,i*1.012,t*.915];return e=Ot(e,1.05),$t(e)},cool(a,i,t){let e=[a*.93,i*.995,t*1.075];return e=Ot(e,.97),$t(e)}};function Oe(a){return Ge.find(i=>i.id===a)||Ge[0]}function $e(a,i=17){if(a==="none")return null;let t=ka[a];if(!t)return null;let e=Math.max(2,Math.round(i)),r=e*e,s=e,o=new Uint8Array(r*s*4),n=e-1;for(let u=0;u<e;u+=1)for(let l=0;l<e;l+=1)for(let c=0;c<e;c+=1){let h=t(c/n,l/n,u/n),p=((u*e+l)*r+(u*e+c))*4;o[p]=Math.round(Mt(h[0])*255),o[p+1]=Math.round(Mt(h[1])*255),o[p+2]=Math.round(Mt(h[2])*255),o[p+3]=255}return o}var Ci=[1,0,0,0,1,0,0,0,1],xe=[0,0,0];function Ma(a,i){let t=new Array(9);for(let e=0;e<3;e+=1){let r=e*3;for(let s=0;s<3;s+=1)t[r+s]=(a[r]||0)*(i[s]||0)+(a[r+1]||0)*(i[3+s]||0)+(a[r+2]||0)*(i[6+s]||0)}return t}function La(a,i){return[(a[0]||0)*i[0]+(a[1]||0)*i[1]+(a[2]||0)*i[2],(a[3]||0)*i[0]+(a[4]||0)*i[1]+(a[5]||0)*i[2],(a[6]||0)*i[0]+(a[7]||0)*i[1]+(a[8]||0)*i[2]]}function H(a,i){let t=Ma(a.matrix,i.matrix),e=La(a.matrix,i.offset);return{matrix:t,offset:[e[0]+a.offset[0],e[1]+a.offset[1],e[2]+a.offset[2]]}}function Aa(){return{matrix:Ci.slice(),offset:xe.slice()}}function G(a,i,t,e=xe){return{matrix:[a,0,0,0,i,0,0,0,t],offset:e.slice()}}function j(a){let i=Math.max(0,1+a),t=.2126,e=.7152,r=.0722,s=1-i;return{matrix:[t*s+i,e*s,r*s,t*s,e*s+i,r*s,t*s,e*s,r*s+i],offset:xe.slice()}}function J(a){let i=Math.max(.05,1+a);return{matrix:[i,0,0,0,i,0,0,0,i],offset:[.5*(1-i),.5*(1-i),.5*(1-i)]}}function zi(a){let i=a*.22;return{matrix:Ci.slice(),offset:[i,i,i]}}function Ra(a){let i=Math.pow(2,a);return{matrix:[i,0,0,0,i,0,0,0,i],offset:xe.slice()}}function Ea(a){return G(1+a*.16,1+a*.03,1-a*.16)}function q(a,i,t,e,r,s,o){return{id:a,label:i,labelEn:t,color:e,css:r,category:s,hint:o}}var Lt=[q("original","Nguyên bản","Original",Aa(),"","root","Không đổi màu"),q("vivid","Sống động","Vivid",H(J(.08),j(.38)),"saturate(1.38) contrast(1.08)","root"),q("dramatic","Kịch tính","Dramatic",H({matrix:[1.05,0,0,0,1.02,0,0,0,1.08],offset:[-.012,-.008,.012]},H(J(.27),j(-.18))),"contrast(1.27) saturate(0.82)","root"),q("mono","Đen trắng","Mono",H(J(.1),j(-1)),"grayscale(1) contrast(1.1)","mono"),q("vintage","Cổ điển","Vintage",{matrix:[.92,.32,.08,.14,.86,.11,.06,.19,.72],offset:[.035,.02,0]},"sepia(0.42) saturate(0.86) contrast(0.95)","root"),q("warm","Ấm","Warm",G(1.12,1.02,.88),"sepia(0.18) saturate(1.06) brightness(1.02)","root"),q("cool","Lạnh","Cool",G(.9,1,1.16),"saturate(0.96) hue-rotate(-8deg) brightness(1.01)","root"),q("meitu-natural","Tự nhiên","Natural",H(G(1.04,1.02,.98),j(.12)),"brightness(1.03) saturate(1.12) sepia(0.08)","meitu","Meitu · Sáng nhẹ, giữ tông da tự nhiên"),q("meitu-korea","Hàn Quốc","Korea",H(G(1.06,1,.98),j(.15)),"brightness(1.06) saturate(1.15) contrast(0.97)","meitu","Meitu · Da hồng sáng, tương phản mềm"),q("meitu-japan","Nhật Bản","Japan",H(G(1.03,1.01,1.02),J(-.08)),"brightness(1.03) saturate(1.06) contrast(0.92)","meitu","Meitu · Trong vắt, đỡ gắt"),q("meitu-skin","Sáng da","Bright Skin",H(G(1.05,1.03,.99),zi(.14)),"brightness(1.07) saturate(1.05)","meitu","Meitu · Nâng sáng vùng da, giữ chi tiết"),q("meitu-pink","Hồng đào","Peach Pink",H(G(1.07,.99,.97),j(.2)),"saturate(1.2) brightness(1.04)","meitu","Meitu · Hồng ấm, hợp chân dung"),q("meitu-white","Trắng sáng","Bright White",H(G(1.08,1.08,1.08),j(-.05)),"brightness(1.08) saturate(0.95)","meitu","Meitu · Sáng tinh khôi, giảm bão hoà nhẹ"),q("xingtu-film","Điện ảnh","Cinematic",H(G(.97,1.02,1.07),H(J(.12),j(.05))),"contrast(1.12) saturate(1.05) hue-rotate(-6deg)","xingtu","Xingtu · Teal–orange mềm, hợp đường phố"),q("xingtu-hk","Hồng Kông","Hong Kong",H(G(1.02,1,1.04),H(J(.1),j(-.08))),"contrast(1.1) saturate(0.92) hue-rotate(4deg)","xingtu","Xingtu · Đêm đô thị, xanh lạnh"),q("xingtu-showa","Chiêu Hoà","Showa",H(G(1.04,1,.93),H(J(-.05),j(-.15))),"sepia(0.22) saturate(0.85) contrast(0.95)","xingtu","Xingtu · Hoài cổ, phai màu nhẹ"),q("xingtu-kama","Kamakura","Kamakura",H(G(1.06,1.02,.9),j(.1)),"brightness(1.05) sepia(0.2) saturate(1.1)","xingtu","Xingtu · Bình minh biển, ấm sáng"),q("xingtu-night","Ban đêm","Night",H(G(.94,.98,1.08),H(J(.08),j(-.05))),"brightness(0.96) contrast(1.08) hue-rotate(-10deg)","xingtu","Xingtu · Đêm sâu, giữ bóng tối"),q("xingtu-morning","Buổi sáng","Morning",H(G(1.07,1.04,.93),j(.08)),"brightness(1.05) sepia(0.14) saturate(1.08)","xingtu","Xingtu · Nắng sớm, ấm và trong"),q("lr-cinema","Cinematic","Cinematic",H(G(.98,1.02,1.06),H(J(.15),j(.05))),"contrast(1.15) saturate(1.05) hue-rotate(-8deg)","lr","Lightroom · Điện ảnh tương phản mạnh"),q("lr-moody","Moody","Moody",H(G(.97,.98,1.02),H(J(.18),j(-.15))),"contrast(1.18) saturate(0.85) brightness(0.97)","lr","Lightroom · Ẩm ướt, bóng gắt"),q("lr-vibrant","Vibrant","Vibrant",H(J(.05),j(.35)),"saturate(1.35) contrast(1.05)","lr","Lightroom · Màu rực, hợp phong cảnh"),q("lr-pastel","Pastel","Pastel",H(G(1.03,1.03,1.03),H(J(-.1),j(.1))),"brightness(1.04) contrast(0.9) saturate(1.1)","lr","Lightroom · Nhẹ, trong, chữ chụp đồ"),q("lr-desert","Sa mạc","Desert",H(G(1.08,1,.88),j(.15)),"sepia(0.28) saturate(1.15) contrast(1.04)","lr","Lightroom · Vàng cát ấm"),q("lr-street","Đường phố","Street",H(J(.2),j(-.1)),"contrast(1.2) saturate(0.9)","lr","Lightroom · Grit, hợp street life"),q("lr-faded","Mờ phai","Faded",H(G(1.02,1.02,1.02),H(J(-.12),j(-.15))),"brightness(1.03) contrast(0.88) saturate(0.85)","lr","Lightroom · Film phai, giảm tương phản"),q("lr-teal","Teal","Teal",H(G(.93,1.04,1.07),j(.1)),"hue-rotate(-14deg) saturate(1.1) contrast(1.05)","lr","Lightroom · Xanh teal mát"),q("mono-warm","Đen trắng ấm","Mono Warm",H(G(1.06,1.02,.94),j(-1)),"grayscale(1) sepia(0.18) contrast(1.06)","mono","Đen trắng · Ấm hạt"),q("mono-cool","Đen trắng lạnh","Mono Cool",H(G(.94,.98,1.06),j(-1)),"grayscale(1) hue-rotate(-10deg) contrast(1.06)","mono","Đen trắng · Lạnh, gắt")];function yt(a){return Lt.find(i=>i.id===a)||Lt[0]}function Ca(a,i){let t=yt(i).color;return t=H(Ra(a.exposure/100),t),t=H(zi(a.brightness/100),t),t=H(J(a.contrast/100),t),t=H(j(a.saturation/100),t),t=H(Ea(a.warmth/100),t),t}function Ve(a){return S(a.vignette/100,0,1)}function Ze(a,i,t=!0){let e=[];if(t){let n=yt(i).css;n&&e.push(n)}let r=Math.pow(2,a.exposure/100),s=1+a.brightness/200;Math.abs(r*s-1)>.005&&e.push(`brightness(${(r*s).toFixed(4)})`),a.contrast!==0&&e.push(`contrast(${Math.max(.05,1+a.contrast/100).toFixed(4)})`);let o=Math.max(0,1+a.saturation/100+a.vibrance/260);return Math.abs(o-1)>.005&&e.push(`saturate(${o.toFixed(4)})`),a.warmth!==0&&e.push(`sepia(${(Math.abs(a.warmth)*.0015).toFixed(4)})`),a.tint!==0&&e.push(`hue-rotate(${(a.tint*.045).toFixed(3)}deg)`),e.join(" ")||"none"}function za(a,i){let t=a.data,e=i.matrix,r=i.offset;for(let s=0;s<t.length;s+=4){if(t[s+3]===0)continue;let o=t[s]/255,n=t[s+1]/255,u=t[s+2]/255;t[s]=S((e[0]*o+e[1]*n+e[2]*u+r[0])*255,0,255),t[s+1]=S((e[3]*o+e[4]*n+e[5]*u+r[1])*255,0,255),t[s+2]=S((e[6]*o+e[7]*n+e[8]*u+r[2])*255,0,255)}}function Qe(a,i,t,e){let s=document.createElement("canvas");s.width=128,s.height=128;let o=s.getContext("2d",{willReadFrequently:!0});if(!o)return s;let n=Math.max(128/i,128/t),u=i*n,l=t*n;o.drawImage(a,(128-u)/2,(128-l)/2,u,l);try{let c=o.getImageData(0,0,128,128);za(c,yt(e).color),o.putImageData(c,0,0)}catch{}return s}function Ba(a){let i=[a.hsl.red,a.hsl.orange,a.hsl.yellow,a.hsl.green,a.hsl.aqua,a.hsl.blue,a.hsl.purple,a.hsl.magenta],t=new Float32Array(24);for(let e=0;e<i.length;e+=1){let r=i[e];t[e*3]=S(r.hue/100,-1,1),t[e*3+1]=S(r.saturation/100,-1,1),t[e*3+2]=S(r.luminance/100,-1,1)}return t}function ye(a){let i=a.filter(e=>e.w>0&&e.h>0).slice().sort((e,r)=>(r.confidence??0)-(e.confidence??0)).slice(0,4),t=new Float32Array(16);for(let e=0;e<i.length;e+=1){let r=i[e];t[e*4]=S(r.x+r.w/2,0,1),t[e*4+1]=S(r.y+r.h/2,0,1),t[e*4+2]=S(r.w*.62,.01,1),t[e*4+3]=S(r.h*.72,.01,1)}return{data:t,count:i.length}}var Ke=.6,Ia={x:-.34,y:-.18},Da={x:.34,y:-.18},Pa={x:0,y:.1},Ha={x:0,y:.4},Ei={x:.22,y:.16},Ua={x:.2,y:.24},qa={x:.3,y:.16};function ge(a,i){return!a||!Number.isFinite(a.x)||!Number.isFinite(a.y)?i:{x:S(a.x,-.92,.92),y:S(a.y,-.92,.92)}}function be(a,i){return!a||!Number.isFinite(a.x)||!Number.isFinite(a.y)?i:{x:S(a.x,.02,Ke),y:S(a.y,.02,Ke)}}function bt(a){return Math.round(S(a*.5+.5,0,1)*255)}function xt(a){return Math.round(S(a/Ke,0,1)*255)}function Bi(a){let i=a.filter(s=>s&&s.box&&Number.isFinite(s.box.x)&&Number.isFinite(s.box.y)&&Number.isFinite(s.box.w)&&Number.isFinite(s.box.h)&&s.box.w>0&&s.box.h>0).slice().sort((s,o)=>{let n=s.box.w*s.box.h,u=o.box.w*o.box.h;return(o.confidence??u)-(s.confidence??n)}).slice(0,4),t=new Float32Array(16),e=new Uint8Array(64),r=[];for(let s=0;s<i.length;s+=1){let o=i[s],n=S(o.box.x,0,1),u=S(o.box.y,0,1),l=S(o.box.w,0,1),c=S(o.box.h,0,1);t[s*4]=S(n+l/2,0,1),t[s*4+1]=S(u+c/2,0,1),t[s*4+2]=S(l*.62,.01,1),t[s*4+3]=S(c*.72,.01,1),r.push({x:n,y:u,w:l,h:c,confidence:o.confidence??l*c});let h=ge(o.eyeL,Ia),p=ge(o.eyeR,Da),v=ge(o.nose,Pa),f=ge(o.mouth,Ha),m=be(o.eyeLRadius,Ei),g=be(o.eyeRRadius,Ei),x=be(o.noseRadius,Ua),_=be(o.mouthRadius,qa),y=s*16;e[y]=bt(h.x),e[y+1]=bt(h.y),e[y+2]=bt(p.x),e[y+3]=bt(p.y),e[y+4]=bt(v.x),e[y+5]=bt(v.y),e[y+6]=bt(f.x),e[y+7]=bt(f.y),e[y+8]=xt(m.x),e[y+9]=xt(m.y),e[y+10]=xt(g.x),e[y+11]=xt(g.y),e[y+12]=xt(x.x),e[y+13]=xt(x.y),e[y+14]=xt(_.x),e[y+15]=xt(_.y)}return{data:t,anchors:e,count:i.length,boxes:r}}function Ii(a){let i=a.adjust;return{exposure:i.exposure/100,brightness:i.brightness/100,contrast:i.contrast/100,saturation:i.saturation/100,highlights:i.highlights/100,shadows:i.shadows/100,whites:i.whites/100,blacks:i.blacks/100,warmth:i.warmth/100,tint:i.tint/100,vibrance:i.vibrance/100,gamma:i.gamma/100,clarity:i.clarity/100,sharpen:i.sharpen/100,denoise:i.denoise/100,smoothSkin:i.smoothSkin/100,blemish:i.blemish/100,skinTexture:i.skinTexture/100,skinTone:i.skinTone/100,faceSlim:i.faceSlim/100,jawline:i.jawline/100,chin:i.chin/100,eyeSize:i.eyeSize/100,noseSize:i.noseSize/100,mouthSize:i.mouthSize/100,curve:a.curve,lut:a.lut,lutSize:17,lutStrength:a.enhance.lutStrength/100,faces:a.faces.count?a.faces.data:null,faceCount:a.faces.count,anchors:a.faces.count?a.anchors??null:null,hsl:Ba(a.enhance),mask:a.mask??null,liquify:a.liquify??null,linear:a.linear?1:0,dither:a.dither??0,quality:a.quality}}var _e={webgl:0,highp:!1,maxTexture:2048,maxVaryings:8,maxUniforms:16,gpuVendor:"",gpuRenderer:"",deviceMemoryGB:null,hardwareConcurrency:2,dpr:1,mobile:!1,ios:!1,saveData:!1,reducedMotion:!1,tier:"low"},Pt=null;function Fa(a,i,t,e,r,s,o){let n=a===2?2:a===1?1:0;i&&(n+=2),t>=8192?n+=2:t>=4096&&(n+=1),e!==null?e>=8?n+=2:e>=4&&(n+=1):r>=8&&(n+=1),s||(n+=1),o&&(n-=1);let u=n>=8?"ultra":n>=6?"high":n>=4?"mid":"low";return u==="ultra"&&(a<2||!i)?"high":u}function Je(){if(Pt)return Pt;if(typeof document>"u"||typeof navigator>"u")return Pt=_e,Pt;let a=navigator.userAgent||"",i=/Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(a),t=/iP(hone|ad|od)/.test(a)||a.includes("Macintosh")&&"ontouchend"in document,e=typeof navigator.deviceMemory=="number"?navigator.deviceMemory:null,r=navigator.hardwareConcurrency||2,s=navigator.connection?.saveData===!0,o=typeof window<"u"&&typeof window.matchMedia=="function"?window.matchMedia("(prefers-reduced-motion: reduce)").matches:!1,n=typeof window<"u"?Math.min(3,Math.max(1,window.devicePixelRatio||1)):1,u=0,l=!1,c=_e.maxTexture,h=_e.maxVaryings,p=_e.maxUniforms,v="",f="",m=document.createElement("canvas");m.width=1,m.height=1;let g={alpha:!1,antialias:!1,depth:!1,stencil:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"},x=null;try{x=m.getContext("webgl2",g),x&&(u=2),x||(x=m.getContext("webgl",g),x&&(u=1))}catch{x=null}if(x){try{let _=x.getShaderPrecisionFormat(x.FRAGMENT_SHADER,x.HIGH_FLOAT);l=!!_&&_.precision>0,c=x.getParameter(x.MAX_TEXTURE_SIZE)||c,h=x.getParameter(x.MAX_VARYING_VECTORS)||h,p=x.getParameter(x.MAX_FRAGMENT_UNIFORM_VECTORS)||p;let y=x.getExtension("WEBGL_debug_renderer_info");y?(v=String(x.getParameter(y.UNMASKED_VENDOR_WEBGL)||""),f=String(x.getParameter(y.UNMASKED_RENDERER_WEBGL)||"")):(v=String(x.getParameter(x.VENDOR)||""),f=String(x.getParameter(x.RENDERER)||""))}catch{}try{x.getExtension("WEBGL_lose_context")?.loseContext()}catch{}}return Pt={webgl:u,highp:l,maxTexture:c,maxVaryings:h,maxUniforms:p,gpuVendor:v,gpuRenderer:f,deviceMemoryGB:e,hardwareConcurrency:r,dpr:n,mobile:i,ios:t,saveData:s,reducedMotion:o,tier:Fa(u,l,c,e,r,i,s)},Pt}function we(a,i){return a==="linear"?"linear":a==="srgb"?"srgb":i.webgl>0&&i.highp&&i.tier!=="low"?"linear":"srgb"}function Kt(a,i,t){return typeof a=="boolean"?a:i==="linear"||t.tier==="low"}function Na(a,i,t){return a*.2126+i*.7152+t*.0722}function Vt(a,i,t){let e=i*t,r=0;for(let s=0;s<256;s+=1)if(r+=a[s],r>=e)return s/255;return 1}function Xa(a){if(!a.length)return 0;a.sort((t,e)=>t-e);let i=a.length>>1;return a.length%2?a[i]:(a[i-1]+a[i])*.5}async function ti(a,i=256,t=0){let e="width"in a?a.width:0,r="height"in a?a.height:0;if(!e||!r)throw new Error("Cannot analyse an empty image");let s=Math.min(1,i/Math.max(e,r)),o=Math.max(8,Math.round(e*s)),n=Math.max(8,Math.round(r*s)),u=document.createElement("canvas");u.width=o,u.height=n;let l=u.getContext("2d",{willReadFrequently:!0});if(!l)throw new Error("2D canvas is unavailable");l.imageSmoothingQuality="high",l.drawImage(a,0,0,o,n);let c;try{c=l.getImageData(0,0,o,n).data}catch{throw new Error("Cannot analyse a cross-origin image without CORS")}await new Promise(F=>{typeof requestAnimationFrame=="function"?requestAnimationFrame(()=>F()):setTimeout(F,0)});let h=o*n,p=new Uint32Array(256),v=new Float32Array(h),f=0,m=0,g=0,x=0,_=0,y=0,w=0,T=0;for(let F=0,O=0;F<h;F+=1,O+=4){let N=c[O]/255,A=c[O+1]/255,D=c[O+2]/255,X=Na(N,A,D);v[F]=X,p[Math.round(X*255)]+=1,f+=N,m+=A,g+=D,X<.02&&(w+=1),X>.98&&(T+=1);let Z=Math.max(N,A,D),M=Math.min(N,A,D);Z>.04&&(x+=(Z-M)/Z,_+=1);let P=-.168736*N-.331264*A+.5*D+.5,B=.5*N-.418688*A-.081312*D+.5;B>.34&&B<.66&&P>.31&&P<.6&&X>.12&&X<.95&&(y+=1)}let k=0,E=0,L=8,R=[],C=[];for(let F=0;F+L<=n;F+=L)for(let O=0;O+L<=o;O+=L){let N=0,A=0,D=0,X=0;for(let P=F;P<F+L;P+=1)for(let B=O;B<O+L;B+=1){let Y=P*o+B,K=v[Y];if(N+=K,A+=K*K,B>0&&P>0&&B<o-1&&P<n-1){let tt=4*K-v[Y-1]-v[Y+1]-v[Y-o]-v[Y+o];D+=Math.abs(tt),k+=Math.abs(tt),E+=1}X+=1}let Z=N/Math.max(1,X),M=Math.max(0,A/Math.max(1,X)-Z*Z);R.push(Math.sqrt(M)),C.push(D/Math.max(1,X))}let z=[];if(C.length){let F=C.slice().sort((N,A)=>N-A),O=F[Math.floor(F.length*.3)]??0;for(let N=0;N<C.length;N+=1)C[N]<=O&&z.push(R[N])}let I=z.length?Xa(z):0,$=E?k/E:0;return{width:o,height:n,mean:(f+m+g)/(h*3),median:Vt(p,h,.5),p1:Vt(p,h,.01),p5:Vt(p,h,.05),p95:Vt(p,h,.95),p99:Vt(p,h,.99),clipLow:w/h,clipHigh:T/h,meanR:f/h,meanG:m/h,meanB:g/h,saturation:_?x/_:0,noise:I,sharpness:$,skinRatio:y/h,faceCount:Math.max(0,Math.round(t))}}function ei(a){let i=ie(),t=[],e=(l,c)=>{let[h,p]=it[l];i[l]=S(Math.round(c),h,p)},r=Math.max(.035,a.median),s=S(Math.log2(.46/r),-.75,.75);e("exposure",s*100),a.median<.3&&t.push("low-light"),a.clipHigh>.03&&t.push("overexposed"),a.clipLow>.05&&t.push("underexposed");let o=a.p95-a.p5;e("contrast",S((.62-o)*90,-18,30)),o<.45&&t.push("flat"),a.clipHigh>.015?e("highlights",-S(a.clipHigh*900,10,65)):a.p95>.94?e("highlights",-15):a.p95<.78&&e("highlights",10),a.p5<.08&&e("shadows",S((.08-a.p5)*420,8,55)),a.p99<.88?e("whites",S((.88-a.p99)*120,0,20)):a.clipHigh>.03&&e("whites",-12),a.p1>.1?e("blacks",-S((a.p1-.1)*180,0,20)):a.p1<.01&&e("blacks",6);let n=(a.meanB-a.meanR)*90;e("warmth",S(n,-22,22)),n>8&&t.push("cool-cast"),n<-8&&t.push("warm-cast");let u=(a.meanG-(a.meanR+a.meanB)*.5)*120;return e("tint",S(u,-18,18)),u>8&&t.push("green-cast"),u<-8&&t.push("magenta-cast"),e("saturation",S((.3-a.saturation)*70,-12,22)),e("vibrance",S((.34-a.saturation)*55,-8,26)),a.sharpness<.025&&e("sharpen",S((.025-a.sharpness)*600,0,30)),a.sharpness<.012&&t.push("soft"),a.noise>.008&&e("denoise",S((a.noise-.008)*700,0,40)),a.noise>.02&&t.push("noisy"),e("clarity",S((.62-o)*40,0,18)),(a.skinRatio>.015||a.faceCount>0)&&(e("smoothSkin",S(a.skinRatio*120+a.faceCount*3,0,24)),t.push("portrait")),{adjust:i,analysis:a,notes:t}}var Se=new Map;function Ya(a){Se.set(a.id,a)}function Wa(a){Se.delete(a)}function ja(){return Array.from(Se.values())}function ri(a){return Se.get(a)}function ii(a,i){let t=document.createElement("canvas");return t.width=Math.max(1,Math.round(a)),t.height=Math.max(1,Math.round(i)),t}function ai(a,i=!1){let t=a.getContext("2d",{willReadFrequently:i});if(!t)throw new Error("2D canvas is unavailable");return t}function Ga(a){return typeof HTMLImageElement<"u"&&a instanceof HTMLImageElement?{width:a.naturalWidth||a.width,height:a.naturalHeight||a.height}:{width:a.width,height:a.height}}function Oa(a,i,t,e,r=1){if(!t&&!e)return{width:a,height:i,k:1};let s=t?Math.sqrt(Math.max(1,t)/Math.max(1,a*i)):1,o=e?Math.sqrt(Math.max(1,e)/Math.max(1,a*i*r*r)):1,n=Math.min(1,s,o);return{width:Math.max(1,Math.floor(a*n)),height:Math.max(1,Math.floor(i*n)),k:n}}function $a(a,i,t,e,r,s,o,n,u){let l=r-u,c=s-u,h=o+u*2,p=n+u*2,v=Math.max(0,l),f=Math.max(0,c),m=Math.min(t,l+h)-v,g=Math.min(e,c+p)-f;a.clearRect(0,0,h,p),a.drawImage(i,v,f,m,g,v-l,f-c,m,g),f>c&&a.drawImage(i,v,0,m,1,v-l,0,m,f-c),f+g<c+p&&a.drawImage(i,v,e-1,m,1,v-l,f+g-c,m,c+p-(f+g)),v>l&&a.drawImage(i,0,f,1,g,0,f-c,v-l,g),v+m<l+h&&a.drawImage(i,t-1,f,1,g,v+m-l,f-c,l+h-(v+m),g),v>l&&f>c&&a.drawImage(i,0,0,1,1,0,0,v-l,f-c),v+m<l+h&&f>c&&a.drawImage(i,t-1,0,1,1,v+m-l,0,l+h-(v+m),f-c),v>l&&f+g<c+p&&a.drawImage(i,0,e-1,1,1,0,f+g-c,v-l,c+p-(f+g)),v+m<l+h&&f+g<c+p&&a.drawImage(i,t-1,e-1,1,1,v+m-l,f+g-c,l+h-(v+m),c+p-(f+g))}async function si(a,i,t={}){let{width:e,height:r}=Ga(i);if(!e||!r)throw new Error("AI pipeline needs a non-empty image");let s=Math.max(.25,Math.min(4,t.scale??1)),o=Math.max(32,Math.min(2048,Math.round(t.tileSize??512))),n=Math.max(0,Math.min(128,Math.round(t.halo??t.overlap??8))),u=Oa(e,r,t.maxInputPixels,t.maxOutputPixels,s),l=i,c=e,h=r;if(u.k<1){t.onStage?.("resize");let T=ii(u.width,u.height),k=ai(T);k.imageSmoothingEnabled=!0,k.imageSmoothingQuality="high",k.drawImage(i,0,0,e,r,0,0,u.width,u.height),l=T,c=u.width,h=u.height}let p=Math.max(1,Math.round(c*s)),v=Math.max(1,Math.round(h*s)),f=ii(p,v),m=ai(f);m.imageSmoothingEnabled=!0,m.imageSmoothingQuality="high";let g=ii(o+n*2,o+n*2),x=ai(g,!0),_=Math.ceil(c/o),y=Math.ceil(h/o),w=_*y;try{t.onStage?.("load"),await a.load(t.signal);let T=0;for(let k=0;k<y;k+=1)for(let E=0;E<_;E+=1){dt(t.signal);let L=E*o,R=k*o,C=Math.min(o,c-L),z=Math.min(o,h-R),I=C+n*2,$=z+n*2;(g.width!==I||g.height!==$)&&(g.width=I,g.height=$),$a(x,l,c,h,L,R,C,z,n);let V=await a.run(g,t.signal);dt(t.signal);let F="width"in V?V.width:I,O="height"in V?V.height:$,N=F/Math.max(1,I),A=O/Math.max(1,$),D=Math.min(F-1,n*N),X=Math.min(O-1,n*A),Z=Math.min(F-D,C*N),M=Math.min(O-X,z*A),P=Math.round(L*s),B=Math.round(R*s),Y=Math.max(1,Math.round((L+C)*s)-P),K=Math.max(1,Math.round((R+z)*s)-B);m.drawImage(V,D,X,Z,M,P,B,Y,K),"close"in V&&typeof V.close=="function"&&V.close(),T+=1,t.onStage?.("tile",T,w),t.onProgress?.(T/w),await he()}t.onStage?.("done",w,w)}finally{a.dispose()}return f}var ft={maxPreview:1080,maxHistory:60,maxZoom:8,maxExport:8192,maxPixels:67108864,previewQuality:"fast",colorSpace:"auto",dither:"auto"};function Ka(){if(typeof navigator>"u")return ft.maxPixels;let a=navigator.userAgent||"";return/iP(hone|ad|od)/.test(a)||navigator.platform==="MacIntel"&&(navigator.maxTouchPoints||0)>1?16777216:ft.maxPixels}function Va(a){if(typeof a=="string"){let i=document.querySelector(a);if(!i)throw new Error(`Aurum: container "${a}" was not found`);return i}return a}function Ht(a){return a instanceof HTMLImageElement?{width:a.naturalWidth||a.width,height:a.naturalHeight||a.height}:{width:a.width,height:a.height}}async function oi(a){return new Promise((i,t)=>{let e=new Image;e.crossOrigin="anonymous",e.decoding="async",e.onload=()=>i(e),e.onerror=()=>t(new Error("Could not load the image (check the URL and CORS headers).")),e.src=a})}async function Za(a){if(typeof a=="string")try{let i=await fetch(a,{mode:"cors",credentials:"same-origin"});if(!i.ok)throw new Error(`HTTP ${i.status}`);let t=await i.blob();if(typeof createImageBitmap=="function")try{return{bitmap:await createImageBitmap(t,{imageOrientation:"from-image"}),owned:!0}}catch{}let e=URL.createObjectURL(t);try{return{bitmap:await oi(e),owned:!0}}finally{URL.revokeObjectURL(e)}}catch(i){if(a.startsWith("data:")||a.startsWith("blob:"))return{bitmap:await oi(a),owned:!0};throw i}if(a instanceof Blob){if(typeof createImageBitmap=="function")try{return{bitmap:await createImageBitmap(a,{imageOrientation:"from-image"}),owned:!0}}catch{}let i=URL.createObjectURL(a);try{return{bitmap:await oi(i),owned:!0}}finally{URL.revokeObjectURL(i)}}if(a instanceof HTMLImageElement){if(a.complete||await new Promise((i,t)=>{a.addEventListener("load",()=>i(),{once:!0}),a.addEventListener("error",()=>t(new Error("Could not load the image")),{once:!0})}),!a.naturalWidth)throw new Error("The image has no pixels");return{bitmap:a,owned:!1}}return{bitmap:a,owned:!1}}async function Di(a,i){let t=Ht(a),e=Math.max(t.width,t.height);if(e<=i)return{bitmap:a,owned:!1};let r=i/e,s=Math.max(1,Math.round(t.width*r)),o=Math.max(1,Math.round(t.height*r));if(typeof createImageBitmap=="function")try{return{bitmap:await createImageBitmap(a,{resizeWidth:s,resizeHeight:o,resizeQuality:"high"}),owned:!0}}catch{}let n=document.createElement("canvas");n.width=s,n.height=o;let u=n.getContext("2d");if(!u)throw new Error("Could not create the preview canvas");return u.imageSmoothingQuality="high",u.drawImage(a,0,0,s,o),{bitmap:n,owned:!0}}var At=class{constructor(i){d(this,"stage");d(this,"canvas");d(this,"maxZoom");d(this,"state",zt());d(this,"history");d(this,"renderer");d(this,"gesture");d(this,"options");d(this,"original",null);d(this,"preview",null);d(this,"ownsOriginal",!1);d(this,"ownsPreview",!1);d(this,"ready",!1);d(this,"loading",!1);d(this,"loadSeq",0);d(this,"lastFrame",{x:0,y:0,width:0,height:0});d(this,"lastViewport",{width:0,height:0});d(this,"dpr",1);d(this,"renderPending",!1);d(this,"raf",0);d(this,"animation",null);d(this,"animationSeq",0);d(this,"resizeObserver",null);d(this,"listeners",new Map);d(this,"destroyed",!1);d(this,"commitKey","");d(this,"resultMode",!1);d(this,"faces",[]);d(this,"serverFaces",[]);d(this,"faceAnchors",[]);d(this,"beautyMask",null);d(this,"facePack",{data:new Float32Array(16),count:0});d(this,"anchorPack",null);d(this,"curveCache",{source:null,data:null});d(this,"lutCache",new Map);d(this,"liquifyCache",{source:null,width:0,height:0,field:null});d(this,"previewQuality",0);d(this,"colorMode");d(this,"ditherEnabled");d(this,"capabilities");d(this,"aiSeq",0);d(this,"aiController",null);d(this,"aiBefore",null);d(this,"resize",()=>{if(this.destroyed)return;let i=this.viewport();this.dpr=Math.min(3,window.devicePixelRatio||1),this.renderer.resize(i.width,i.height,this.dpr),this.ready?(this.syncViewport(i),this.renderNow()):this.lastViewport=i});let t=Va(i.container);this.options={maxPreview:i.maxPreview??ft.maxPreview,maxHistory:i.maxHistory??ft.maxHistory,maxZoom:i.maxZoom??ft.maxZoom,maxExport:i.maxExport??ft.maxExport,maxPixels:i.maxPixels??Ka(),previewQuality:i.previewQuality??ft.previewQuality,colorSpace:i.colorSpace??ft.colorSpace,dither:i.dither??ft.dither,background:i.background??"#08080a"},this.capabilities=Je(),this.colorMode=we(this.options.colorSpace,this.capabilities),this.ditherEnabled=Kt(this.options.dither,this.colorMode,this.capabilities),this.maxZoom=this.options.maxZoom,this.previewQuality=this.options.previewQuality==="high"?1:0,this.history=new Wt(this.options.maxHistory),getComputedStyle(t).position==="static"&&(t.style.position="relative"),this.stage=document.createElement("div"),this.stage.className="au-stage",Object.assign(this.stage.style,{position:"absolute",inset:"0",overflow:"hidden",width:"100%",height:"100%",background:this.options.background,touchAction:"none",userSelect:"none",WebkitUserSelect:"none",cursor:"grab"}),this.canvas=document.createElement("canvas"),this.canvas.className="au-canvas",Object.assign(this.canvas.style,{position:"absolute",inset:"0",width:"100%",height:"100%",display:"block"}),this.stage.appendChild(this.canvas),t.appendChild(this.stage),this.renderer=new pe(this.canvas);let e={stage:this.stage,maxZoom:this.maxZoom,viewport:()=>this.viewport(),frame:()=>this.currentFrame(),source:()=>this.source(),state:()=>this.state,setTransform:r=>this.applyTransform(r),commit:()=>this.commit("transform"),settle:(r,s)=>this.settle(r,s)};this.gesture=new ce(e),typeof ResizeObserver<"u"?(this.resizeObserver=new ResizeObserver(()=>this.resize()),this.resizeObserver.observe(this.stage)):window.addEventListener("resize",this.resize),this.resize(),i.image&&this.load(i.image).catch(()=>{})}on(i,t){let e=this.listeners.get(i);return e||(e=new Set,this.listeners.set(i,e)),e.add(t),()=>this.off(i,t)}off(i,t){this.listeners.get(i)?.delete(t)}emit(i,t){let e=this.listeners.get(i);if(e)for(let r of e)try{r(t)}catch{}}get isReady(){return this.ready}get isLoading(){return this.loading}get accelerated(){return this.renderer.accelerated}viewport(){return{width:Math.max(1,this.stage.clientWidth),height:Math.max(1,this.stage.clientHeight)}}source(){return this.original?Ht(this.original):{width:1,height:1}}sourceBitmap(){return this.original}currentFrame(){return vt(this.viewport(),this.state.crop)}getFrame(){return this.ready?this.currentFrame():{...this.lastFrame}}paintView(){let i=this.viewport(),t=this.currentFrame();if(this.resultMode&&t.width>1&&t.height>1){let e=Math.min(i.width/t.width,i.height/t.height);return{scale:e,x:(i.width-t.width*e)/2-t.x*e,y:(i.height-t.height*e)/2-t.y*e}}return{scale:1,x:0,y:0}}sourcePointAt(i,t){if(!this.ready)return null;let e=this.stage.getBoundingClientRect(),r=this.viewport(),s=this.source(),o=this.state.transform,n=this.paintView(),u=i-e.left-r.width/2,l=t-e.top-r.height/2,c=rt(r,s.width,s.height,o),h=at({x:(u-n.x)/n.scale,y:(l-n.y)/n.scale},c.radians),p={x:h.x/c.sx-o.offsetX,y:h.y/c.sy-o.offsetY},v=St(p,st(o)),f=(v.x+1)/2,m=(v.y+1)/2;return f<0||f>1||m<0||m>1?null:{x:f,y:m}}screenPointAt(i,t){if(!this.ready)return null;let e=this.viewport(),r=this.source(),s=this.state.transform,o=this.paintView(),n=rt(e,r.width,r.height,s),u=Bt({x:i*2-1,y:t*2-1},st(s)),l=pi({x:(u.x+s.offsetX)*n.sx,y:(u.y+s.offsetY)*n.sy},n.radians);return{x:e.width/2+l.x*o.scale+o.x,y:e.height/2+l.y*o.scale+o.y}}getPreviewBitmap(){return this.preview}async load(i){let t=++this.loadSeq;this.loading=!0,this.emit("loading",{loading:!0});try{let{bitmap:e,owned:r}=await Za(i);if(t!==this.loadSeq){r&&e instanceof ImageBitmap&&e.close();return}let s=await Di(e,this.options.maxPreview);if(t!==this.loadSeq){r&&e instanceof ImageBitmap&&e.close(),s.owned&&s.bitmap instanceof ImageBitmap&&s.bitmap.close();return}this.releaseBitmaps(),this.original=e,this.ownsOriginal=r,this.preview=s.bitmap,this.ownsPreview=s.owned,this.beautyMask=null,this.renderer.setBitmap(s.bitmap),this.ready=!0,this.loading=!1;let o=Ht(e);this.state=zt(),this.lastViewport={width:0,height:0},this.lastFrame={x:0,y:0,width:0,height:0},this.curveCache.source=null,this.state.crop.ratio=o.width/o.height,this.state.transform.zoom=.2,this.ensureCoverage(),this.history.reset(this.state),await new Promise(n=>{let u=!1,l=()=>{u||(u=!0,n())};requestAnimationFrame(l),window.setTimeout(l,120)}),this.resize(),this.renderNow(),this.emit("ready",o),this.emit("loading",{loading:!1}),this.emitState(),this.emitHistory()}catch(e){this.loading=!1,this.emit("loading",{loading:!1});let r=e instanceof Error?e:new Error(String(e));throw this.emit("error",{error:r}),r}}setImage(i){return this.load(i)}releaseBitmaps(){this.disposeAIBefore(),this.ownsOriginal&&this.original instanceof ImageBitmap&&this.original.close(),this.ownsPreview&&this.preview instanceof ImageBitmap&&this.preview!==this.original&&this.preview.close(),this.original=null,this.preview=null,this.ownsOriginal=!1,this.ownsPreview=!1}getState(){return ut(this.state)}setState(i,t={}){this.state=Le(i),this.curveCache.source=null,this.ready&&(this.ensureCoverage(),t.history!==!1&&this.history.push(this.state,"set-state"),this.scheduleRender()),t.silent||(this.emitState(),this.emitHistory())}exportState(){return JSON.stringify({version:1,state:this.getState()},null,2)}importState(i){let t=typeof i=="string"?JSON.parse(i):i,e=t&&typeof t=="object"&&"state"in t?t.state:t;this.setState(e)}setAdjust(i,t,e){let r=it[i];if(!r||!Number.isFinite(t))return;let s=S(t,r[0],r[1]);this.state.adjust[i]!==s&&(this.state.adjust[i]=s,this.scheduleRender(),this.commit(e||`adjust:${i}`))}resetAdjust(i){this.setAdjust(i,0,`reset:${i}`)}resetAdjustments(){let i=!1;for(let t of ee)this.state.adjust[t]!==0&&(this.state.adjust[t]=0,i=!0);i&&(this.scheduleRender(),this.commit("reset-adjust"))}setFilter(i){let t=yt(i);this.state.filter!==t.id&&(this.state.filter=t.id,this.scheduleRender(),this.commit("filter"))}setCurve(i,t,e="curve"){let r=this.state.enhance.curves;if(!(i in r))return;let s=Et(t),o=r[i];o.length===s.length&&o.every((n,u)=>Math.abs(n.x-s[u].x)<1e-5&&Math.abs(n.y-s[u].y)<1e-5)||(r[i]=s,this.curveCache.source=null,this.scheduleRender(),this.commit(e))}resetCurves(){this.state.enhance.curves=se(),this.curveCache.source=null,this.scheduleRender(),this.commit("reset-curves")}setHSL(i,t,e="hsl"){if(!Nt.includes(i))return;let r=this.state.enhance.hsl[i],s={hue:S(t.hue??r.hue,-100,100),saturation:S(t.saturation??r.saturation,-100,100),luminance:S(t.luminance??r.luminance,-100,100)};s.hue===r.hue&&s.saturation===r.saturation&&s.luminance===r.luminance||(this.state.enhance.hsl[i]=s,this.scheduleRender(),this.commit(e))}resetHSL(){this.state.enhance.hsl=Xt(),this.scheduleRender(),this.commit("reset-hsl")}setLUT(i,t){let e=Oe(i),r=t===void 0?this.state.enhance.lutStrength:S(t,0,100);this.state.enhance.lut===e.id&&this.state.enhance.lutStrength===r||(this.state.enhance.lut=e.id,this.state.enhance.lutStrength=r,this.scheduleRender(),this.commit("lut"))}setLUTStrength(i,t="lut-strength"){let e=S(i,0,100);this.state.enhance.lutStrength!==e&&(this.state.enhance.lutStrength=e,this.scheduleRender(),this.commit(t))}setEnhance(i,t="enhance"){let e=JSON.stringify(this.state.enhance),r=oe({...this.state.enhance,...i,curves:{...this.state.enhance.curves,...i.curves||{}},hsl:{...this.state.enhance.hsl,...i.hsl||{}}});JSON.stringify(r)!==e&&(this.state.enhance=r,this.curveCache.source=null,this.scheduleRender(),this.commit(t))}resetEnhance(){this.state.enhance=oe(null),this.curveCache.source=null,this.scheduleRender(),this.commit("reset-enhance")}setPreviewQuality(i){this.previewQuality=i==="high"?1:0,this.options.previewQuality=i,this.scheduleRender()}get colorSpace(){return this.colorMode}get dither(){return this.ditherEnabled}setColorSpace(i){this.options.colorSpace=i;let t=we(i,this.capabilities);this.ditherEnabled=Kt(this.options.dither,t,this.capabilities),t!==this.colorMode&&(this.colorMode=t,this.scheduleRender())}setDither(i){this.options.dither=i,this.ditherEnabled=Kt(i,this.colorMode,this.capabilities),this.scheduleRender()}setFaces(i){this.serverFaces=this.normalizeFaceBoxes(i),this.faceAnchors=[],this.anchorPack=null,this.faces=this.serverFaces.map(t=>({...t})),this.facePack=ye(this.faces),this.scheduleRender()}setFaceAnchors(i){if(!Array.isArray(i)||!i.length){this.faceAnchors=[],this.anchorPack=null,this.faces=this.serverFaces.map(e=>({...e})),this.facePack=ye(this.faces),this.scheduleRender();return}let t=Bi(i);t.count?(this.faceAnchors=i.slice(),this.faces=t.boxes.map(e=>({...e})),this.facePack={data:t.data,count:t.count},this.anchorPack=t.anchors):(this.faceAnchors=[],this.anchorPack=null,this.faces=this.serverFaces.map(e=>({...e})),this.facePack=ye(this.faces)),this.scheduleRender()}clearFaceAnchors(){this.setFaceAnchors(null)}normalizeFaceBoxes(i){return i.filter(t=>Number.isFinite(t.x)&&Number.isFinite(t.y)&&Number.isFinite(t.w)&&Number.isFinite(t.h)&&t.w>0&&t.h>0).map(t=>({x:S(t.x,0,1),y:S(t.y,0,1),w:S(t.w,0,1),h:S(t.h,0,1),confidence:Number.isFinite(t.confidence)?t.confidence:0}))}clearFaces(){this.serverFaces=[],this.faceAnchors=[],this.faces=[],this.facePack={data:new Float32Array(16),count:0},this.anchorPack=null,this.scheduleRender()}getFaces(){return this.faces.map(i=>({...i}))}hasFaceAnchors(){return this.faceAnchors.length>0}setBeautyMask(i){i&&(!Number.isFinite(i.width)||!Number.isFinite(i.height)||i.width<1||i.height<1||i.data.length!==i.width*i.height*4)||(this.beautyMask=i,this.scheduleRender())}getBeautyMask(){return this.beautyMask}addLiquifyDab(i,t="liquify"){if(!this.ready||!i||!Number.isFinite(i.x)||!Number.isFinite(i.y)||!Number.isFinite(i.dx)||!Number.isFinite(i.dy)||!Number.isFinite(i.radius)||Math.abs(i.dx)+Math.abs(i.dy)<1e-6)return;let e=this.state.retouch||(this.state.retouch=Yt());e.liquify.push({x:S(i.x,0,1),y:S(i.y,0,1),dx:S(i.dx,-.25,.25),dy:S(i.dy,-.25,.25),radius:S(i.radius,.002,.35)}),e.liquify.length>640&&e.liquify.splice(0,e.liquify.length-640),this.liquifyCache.source=null,this.scheduleRender(),this.commit(t||"liquify")}clearLiquify(i="liquify-clear"){let t=this.state.retouch?.liquify;!t||t.length===0||(this.state.retouch={liquify:[]},this.liquifyCache.source=null,this.scheduleRender(),this.commit(i))}getLiquify(){return(this.state.retouch?.liquify||[]).map(i=>({...i}))}hasLiquify(){return(this.state.retouch?.liquify.length||0)>0}async analyze(){let i=this.original||this.preview;if(!i)throw new Error("No image loaded");return ti(i,256,this.faces.length)}async autoEnhance(){let i=await this.analyze(),t=ei(i);return this.state.adjust=t.adjust,this.state.enhance.auto=!0,this.scheduleRender(),this.commit("auto"),this.emit("auto",t),t}cancelAI(){this.aiSeq+=1,this.aiController&&(this.aiController.abort(),this.aiController=null)}async runAI(i,t={}){let e=ri(i);if(!e)throw new Error(`AI adapter "${i}" is not registered`);if(!this.ready||!this.original)throw new Error("No image loaded");this.cancelAI();let r=new AbortController;this.aiController=r;let s=this.aiSeq,o=this.linkAbort(r,t.signal);try{let n=await e.load();if(s!==this.aiSeq)throw n.dispose(),It();let u=await si(n,this.original,{...t,signal:o});if(s!==this.aiSeq)throw It();let l=this.original,c=this.preview,h=this.ownsOriginal,p=this.ownsPreview;this.original=u,this.ownsOriginal=!0,this.beautyMask=null;let v=await Di(u,this.options.maxPreview);if(s!==this.aiSeq)throw v.owned&&v.bitmap instanceof ImageBitmap&&v.bitmap.close(),It();this.preview=v.bitmap,this.ownsPreview=v.owned,this.renderer.setBitmap(v.bitmap),this.disposeAIBefore(),l&&c?this.aiBefore={original:l,preview:c,ownsOriginal:h,ownsPreview:p,state:ut(this.state),history:this.history}:h&&l instanceof ImageBitmap&&l.close(),this.state.transform=ae(),this.state.crop={...re(),ratio:u.width/u.height},this.lastViewport={width:0,height:0},this.lastFrame={x:0,y:0,width:0,height:0},this.curveCache.source=null,this.ensureCoverage(),this.history=new Wt(this.options.maxHistory),this.history.reset(this.state),this.resize(),this.fitToFrame(),this.renderNow(),this.emit("ready",Ht(u)),this.emitState(),this.emitHistory()}catch(n){if(!ot(n))throw n}finally{this.aiController===r&&(this.aiController=null)}}canRevertAI(){return this.aiBefore!==null}setCompareAI(i){let t=this.aiBefore;if(!t||!this.ready)return;let e=i?t.preview:this.preview;e&&(this.renderer.setBitmap(e),this.renderNow())}revertAI(){let i=this.aiBefore;return i?(this.ownsOriginal&&this.original instanceof ImageBitmap&&this.original.close(),this.ownsPreview&&this.preview instanceof ImageBitmap&&this.preview!==this.original&&this.preview.close(),this.original=i.original,this.preview=i.preview,this.ownsOriginal=i.ownsOriginal,this.ownsPreview=i.ownsPreview,this.beautyMask=null,this.state=i.state,this.history=i.history,this.aiBefore=null,this.curveCache.source=null,this.renderer.setBitmap(i.preview),this.lastViewport={width:0,height:0},this.lastFrame={x:0,y:0,width:0,height:0},this.resize(),this.fitToFrame(),this.renderNow(),this.emit("ready",Ht(i.original)),this.emitState(),this.emitHistory(),!0):!1}disposeAIBefore(){let i=this.aiBefore;i&&(this.aiBefore=null,i.ownsOriginal&&i.original instanceof ImageBitmap&&i.original.close(),i.ownsPreview&&i.preview instanceof ImageBitmap&&i.preview!==i.original&&i.preview.close())}linkAbort(i,t){return t?t.aborted?(i.abort(),i.signal):(t.addEventListener("abort",()=>i.abort(),{once:!0}),i.signal):i.signal}enhanceSpec(i){let t=this.state.enhance;this.curveCache.source!==t.curves&&(this.curveCache.source=t.curves,this.curveCache.data=je(t.curves));let e=this.lutCache.get(t.lut);e===void 0&&(e=$e(t.lut),this.lutCache.set(t.lut,e));let r=this.state.retouch?.liquify,s=null;if(r&&r.length){let o=this.source(),n=this.liquifyCache;(n.source!==r||n.width!==o.width||n.height!==o.height)&&(this.liquifyCache={source:r,width:o.width,height:o.height,field:Te(r,o.width,o.height)}),s=this.liquifyCache.field}return Ii({adjust:this.state.adjust,enhance:t,curve:this.curveCache.data,lut:e,faces:this.facePack,quality:i,linear:this.colorMode==="linear",dither:this.ditherEnabled?1:0,mask:this.beautyMask,liquify:s,anchors:this.anchorPack})}setAspect(i){let t=this.currentFrame();this.state.crop.aspect===i&&i!=="free"||(i==="free"?this.state.crop.ratio=t.width/Math.max(1,t.height):this.state.crop.scale=1,this.state.crop.aspect=i,this.ensureCoverage(),this.scheduleRender(),this.commit("aspect"))}setCrop(i,t="crop"){let e=this.state.crop;i.ratio!==void 0&&Number.isFinite(i.ratio)&&(e.ratio=S(i.ratio,.2,8)),i.scale!==void 0&&Number.isFinite(i.scale)&&(e.scale=S(i.scale,.2,1)),i.aspect!==void 0&&Me(i.aspect)&&(e.aspect=i.aspect),this.ensureCoverage(),this.scheduleRender(),this.commit(t)}setRotation(i,t="rotation"){if(!Number.isFinite(i))return;let e=((i+180)%360+360)%360-180;Math.abs(e-this.state.transform.rotation)<.01||(this.state.transform.rotation=e,this.ensureCoverage(),this.scheduleRender(),this.commit(t))}rotateBy(i){if(!Number.isFinite(i)||i===0)return;let t=i/90;if(Number.isInteger(t)){this.state.transform.turn=((this.state.transform.turn+t)%4+4)%4,this.state.crop.aspect==="free"&&Math.abs(t)%2===1?(this.state.crop.ratio=S(1/this.state.crop.ratio,.2,8),this.fitToFrame()):(this.ensureCoverage(),this.scheduleRender()),this.commit(`turn:${Date.now()}`);return}this.setRotation(this.state.transform.rotation+i,`rotate:${Date.now()}`)}resetRotation(){let i=this.state.transform;i.turn===0&&i.rotation===0||(i.turn=0,i.rotation=0,this.ensureCoverage(),this.scheduleRender(),this.commit("reset-rotation"))}flip(i){i==="h"?this.state.transform.flipH=!this.state.transform.flipH:this.state.transform.flipV=!this.state.transform.flipV,this.ensureCoverage(),this.scheduleRender(),this.commit(`flip:${i}`)}resetCrop(){let i=this.source();this.state.transform={zoom:.2,turn:0,rotation:0,flipH:!1,flipV:!1,offsetX:0,offsetY:0,perspectiveX:0,perspectiveY:0},this.state.crop={aspect:"free",ratio:i.width/Math.max(1,i.height),scale:1},this.ensureCoverage(),this.scheduleRender(),this.commit("reset-crop")}setPerspective(i,t="perspective"){let e=this.state.transform,r=S(i.perspectiveX??e.perspectiveX,-100,100),s=S(i.perspectiveY??e.perspectiveY,-100,100);if(r===e.perspectiveX&&s===e.perspectiveY)return;let o=this.viewport(),n=this.source();if(this.ready&&o.width>=8&&o.height>=8){let l=vt(o,this.state.crop),c=Tt(o,n.width,n.height,e,l),h=c>0?e.zoom/c:1;e.perspectiveX=r,e.perspectiveY=s;let p=Tt(o,n.width,n.height,e,l);e.zoom=S(h*p,p,this.maxZoom);let v=gt(o,n.width,n.height,e,l);e.offsetX=v.x,e.offsetY=v.y}else e.perspectiveX=r,e.perspectiveY=s;this.scheduleRender(),this.commit(t)}resetPerspective(){this.state.transform.perspectiveX===0&&this.state.transform.perspectiveY===0||this.setPerspective({perspectiveX:0,perspectiveY:0},"reset-perspective")}reset(){let i=this.source();this.state=zt(),this.state.crop.ratio=i.width/Math.max(1,i.height),this.state.transform.zoom=.2,this.ensureCoverage(),this.scheduleRender(),this.commit("reset")}applyHistoryState(i){let t=this.state,e=t.transform.turn===i.transform.turn&&t.transform.rotation===i.transform.rotation&&t.transform.flipH===i.transform.flipH&&t.transform.flipV===i.transform.flipV&&t.transform.perspectiveX===i.transform.perspectiveX&&t.transform.perspectiveY===i.transform.perspectiveY&&t.crop.aspect===i.crop.aspect&&Math.abs(t.crop.ratio-i.crop.ratio)<1e-4&&Math.abs(t.crop.scale-i.crop.scale)<1e-4;if(this.state=i,e)this.state.transform.zoom=t.transform.zoom,this.state.transform.offsetX=t.transform.offsetX,this.state.transform.offsetY=t.transform.offsetY;else if(this.state.transform.zoom=S(i.transform.zoom,.2,this.maxZoom),this.ready){let r=this.viewport();if(r.width>=8&&r.height>=8){let s=this.source();if(s.width>=2&&s.height>=2){let o=vt(r,this.state.crop),n=gt(r,s.width,s.height,this.state.transform,o);this.state.transform.offsetX=n.x,this.state.transform.offsetY=n.y}}}if(this.ready){let r=this.viewport();r.width>=8&&r.height>=8&&(this.lastViewport=r)}}undo(){if(this.aiBefore&&!this.history.canUndo)return this.revertAI();let i=this.history.undo();return i?(this.applyHistoryState(i),this.scheduleRender(),this.emitState(),this.emitHistory(),!0):!1}redo(){let i=this.history.redo();return i?(this.applyHistoryState(i),this.scheduleRender(),this.emitState(),this.emitHistory(),!0):!1}canUndo(){return this.history.canUndo||this.aiBefore!==null}canRedo(){return this.history.canRedo}setResultMode(i){this.resultMode!==i&&(this.resultMode=i,this.cancelAnimation(),this.gesture.setEnabled(!i),this.scheduleRender())}get isResultMode(){return this.resultMode}getExportSize(){if(!this.ready)return{width:0,height:0};let i=this.viewport();if(i.width<8||i.height<8)return{width:0,height:0};let t=this.source(),e=this.currentFrame(),r=ze(ue(i,t.width,t.height,{...this.state.transform,perspectiveX:0,perspectiveY:0},e)),s=this.exportScale(r.width,r.height);return{width:Math.max(1,Math.round(r.width*s)),height:Math.max(1,Math.round(r.height*s))}}exportScale(i,t){let e=Math.max(1,i,t),r=Math.max(1,i*t);return Math.min(1,this.options.maxExport/e,Math.sqrt(this.options.maxPixels/r))}async export(i={}){if(!this.ready||!this.original)throw new Error("No image loaded");let t=i.type||"image/jpeg",e=S(Number.isFinite(i.quality)?i.quality:.92,.05,1),r=this.viewport(),s=this.source(),o=this.currentFrame(),n=ue(r,s.width,s.height,this.state.transform,o),u=ze(ue(r,s.width,s.height,{...this.state.transform,perspectiveX:0,perspectiveY:0},o)),l=this.exportScale(u.width,u.height),c=Math.max(1,Math.round(u.width*l)),h=Math.max(1,Math.round(u.height*l)),p=await Mi(this.original,{width:c,height:h,quad:n,warp:st(this.state.transform),srcWidth:s.width,srcHeight:s.height,color:yt(this.state.filter).color,css:Ze(this.state.adjust,this.state.filter),vignette:Ve(this.state.adjust),enhance:this.enhanceSpec(1),texel:[1/Math.max(1,s.width),1/Math.max(1,s.height)]},t,e,i);if(p.type!==t)throw new Error(`This browser cannot encode ${t}. Choose JPEG or PNG.`);return this.emit("export",{blob:p}),p}async toDataURL(i={}){let t=await this.export(i);return new Promise((e,r)=>{let s=new FileReader;s.onload=()=>e(String(s.result)),s.onerror=()=>r(s.error||new Error("Could not encode the image")),s.readAsDataURL(t)})}async toFile(i="aurum-edited.jpg",t={}){let e=await this.export(t),r=e.type||t.type||"image/jpeg";return new File([e],i,{type:r})}async getImageData(i={}){let t=await this.export({type:"image/png",...i});if(typeof createImageBitmap!="function")throw new Error("createImageBitmap is unavailable");let e=await createImageBitmap(t),r=document.createElement("canvas");r.width=e.width,r.height=e.height;let s=r.getContext("2d",{willReadFrequently:!0});if(!s)throw new Error("2D canvas is unavailable");s.drawImage(e,0,0);let o=s.getImageData(0,0,r.width,r.height);return e.close(),o}applyTransform(i){this.cancelAnimation(),Object.assign(this.state.transform,i),this.scheduleRender()}settle(i,t=420){this.cancelAnimation();let e=performance.now(),r={zoom:i.zoom??this.state.transform.zoom,offsetX:i.offsetX??this.state.transform.offsetX,offsetY:i.offsetY??this.state.transform.offsetY},s=++this.animationSeq;this.animation={id:s,target:r,velocity:{zoom:0,offsetX:0,offsetY:0},last:e,duration:t,started:e,commit:!0};let o=n=>{if(!this.animation||this.animation.id!==s)return;let u=Math.min(.04,Math.max(.001,(n-this.animation.last)/1e3));this.animation.last=n;let l=this.state.transform,c=(p,v,f)=>{let m=this.animation.velocity[f],g=(v-p)*220-m*26,x=m+g*u;return this.animation.velocity[f]=x,p+x*u};if(l.zoom=c(l.zoom,this.animation.target.zoom,"zoom"),l.offsetX=c(l.offsetX,this.animation.target.offsetX,"offsetX"),l.offsetY=c(l.offsetY,this.animation.target.offsetY,"offsetY"),Math.abs(l.zoom-this.animation.target.zoom)<8e-4&&Math.abs(l.offsetX-this.animation.target.offsetX)<4e-4&&Math.abs(l.offsetY-this.animation.target.offsetY)<4e-4||n-this.animation.started>this.animation.duration){l.zoom=this.animation.target.zoom,l.offsetX=this.animation.target.offsetX,l.offsetY=this.animation.target.offsetY,this.animation=null,this.scheduleRender(),this.commit("transform");return}this.scheduleRender(),requestAnimationFrame(o)};requestAnimationFrame(o)}cancelAnimation(){this.animation&&(this.animation=null)}fitToFrame(){if(!this.ready)return;let i=this.viewport();if(i.width<8||i.height<8)return;let t=this.source(),e=vt(i,this.state.crop);this.state.transform.zoom=Tt(i,t.width,t.height,this.state.transform,e),this.state.transform.offsetX=0,this.state.transform.offsetY=0,this.ensureCoverage(),this.scheduleRender()}ensureCoverage(){if(!this.ready)return;let i=this.viewport();if(i.width<8||i.height<8)return;let t=this.source(),e=vt(i,this.state.crop),r=Tt(i,t.width,t.height,this.state.transform,e);this.state.transform.zoom=S(this.state.transform.zoom,r,this.maxZoom);let s=gt(i,t.width,t.height,this.state.transform,e);this.state.transform.offsetX=s.x,this.state.transform.offsetY=s.y,this.lastViewport=i}commit(i=""){this.commitKey=i,this.history.push(this.state,i),this.emitState(),this.emitHistory()}emitState(){this.emit("change",this.getState())}emitHistory(){this.emit("history",{canUndo:this.history.canUndo,canRedo:this.history.canRedo})}syncViewport(i){if(!this.ready){this.lastViewport=i;return}if(i.width<8||i.height<8)return;let t=this.lastViewport;t.width===i.width&&t.height===i.height||(this.preserveCropOnResize(t,i),this.ensureCoverage(),this.lastViewport=i)}preserveCropOnResize(i,t){if(i.width<8||i.height<8||t.width<8||t.height<8)return;let e=vt(i,this.state.crop),r=vt(t,this.state.crop);if(e.width<1||r.width<1)return;let s=this.source();if(s.width<2||s.height<2)return;let o=Math.max(i.width/s.width,i.height/s.height)||1,n=Math.max(t.width/s.width,t.height/s.height)||1,u=r.width/e.width;this.state.transform.zoom=S(this.state.transform.zoom*u*(o/n),.2,this.maxZoom)}scheduleRender(){this.renderPending||this.destroyed||(this.renderPending=!0,this.raf=requestAnimationFrame(()=>{this.renderPending=!1,this.renderNow()}))}renderNow(){if(!this.ready||!this.preview)return;let i=this.viewport();this.syncViewport(i);let t=this.source(),e=this.state.transform,r=this.currentFrame();this.lastFrame=r;let s=rt(i,t.width,t.height,e),o={scale:1,x:0,y:0},n=r,u=null;if(this.resultMode&&r.width>1&&r.height>1){let c=Math.min(i.width/r.width,i.height/r.height),h=(i.width-r.width*c)/2-r.x*c,p=(i.height-r.height*c)/2-r.y*c;o={scale:c,x:h,y:p},n={x:r.x*c+h,y:r.y*c+p,width:r.width*c,height:r.height*c},u=n}this.renderer.resize(i.width,i.height,this.dpr);let l=this.preview?Ht(this.preview):t;this.renderer.render({width:i.width,height:i.height,srcWidth:t.width,srcHeight:t.height,sx:s.sx,sy:s.sy,rotation:jt(e),offsetX:e.offsetX,offsetY:e.offsetY,warp:st(e),view:o,vignetteRect:n,clipRect:u,color:yt(this.state.filter).color,css:Ze(this.state.adjust,this.state.filter),vignette:Ve(this.state.adjust),enhance:this.enhanceSpec(this.previewQuality),texel:[1/Math.max(1,l.width),1/Math.max(1,l.height)],dpr:this.dpr}),this.lastViewport=i,this.emit("render",{frame:r})}destroy(){this.destroyed||(this.destroyed=!0,this.cancelAI(),this.cancelAnimation(),cancelAnimationFrame(this.raf),this.gesture.destroy(),this.resizeObserver?.disconnect(),this.resizeObserver=null,window.removeEventListener("resize",this.resize),this.releaseBitmaps(),this.renderer.dispose(),this.stage.remove(),this.listeners.clear())}};var Pi=`.au-root{
  --au-bg:#08080a;
  --au-bg-2:#121216;
  --au-panel:rgba(19,19,23,.93);
  --au-line:rgba(255,255,255,.08);
  --au-text:#f4f2ec;
  --au-muted:#8f8c98;
  --au-gold:#f3c77b;
  --au-gold-strong:#e2ad52;
  --au-gold-soft:rgba(243,199,123,.15);
  --au-danger:#ff6b6b;
  --au-glass-line:rgba(255,255,255,.14);
  --au-tick:rgba(255,255,255,.58);
  position:relative;
  display:flex;
  flex-direction:column;
  width:100%;
  height:100%;
  min-height:min(420px,100%);
  overflow:hidden;
  background:radial-gradient(120% 80% at 50% 0%,#15151a 0%,#08080a 62%,#050506 100%);
  color:var(--au-text);
  font:13px/1.35 -apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  -webkit-font-smoothing:antialiased;
  -webkit-tap-highlight-color:transparent;
  /* iOS Safari zooms on a double tap unless the control opts out. Sliders set
     \`touch-action:none\`; everything else uses manipulation so pinch still works. */
  touch-action:manipulation;
  -webkit-user-select:none;user-select:none;
  -webkit-touch-callout:none;
}
.au-root *{box-sizing:border-box}
:where(.au-root) :where(button){
  margin:0;padding:0;border:0;background:none;color:inherit;font:inherit;
  cursor:pointer;-webkit-appearance:none;appearance:none;
  touch-action:manipulation;
  -webkit-user-select:none;user-select:none;-webkit-touch-callout:none;
}
.au-root button:focus{outline:none}
.au-root button:focus-visible,
.au-root input:focus-visible,
.au-root [role="slider"]:focus-visible{
  outline:2px solid var(--au-gold);outline-offset:2px;
}
.au-root [hidden]{display:none!important}

/* ------------------------------------------------------------ liquid glass */
.au-glass{
  background:
    linear-gradient(120deg,rgba(255,255,255,.18),transparent 42%),
    linear-gradient(180deg,rgba(255,255,255,.11),rgba(255,255,255,.035));
  border:1px solid var(--au-glass-line);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.22),
    inset 0 -1px 0 rgba(0,0,0,.22),
    0 6px 18px rgba(0,0,0,.28);
  -webkit-backdrop-filter:blur(20px) saturate(1.5);
  backdrop-filter:blur(20px) saturate(1.5);
}
.au-glass--gold{
  background:
    linear-gradient(120deg,rgba(255,235,190,.3),transparent 45%),
    linear-gradient(180deg,rgba(243,199,123,.32),rgba(226,173,82,.16));
  border-color:rgba(243,199,123,.42);
  color:#ffe8bd;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.32),
    inset 0 -1px 0 rgba(120,80,20,.18),
    0 6px 20px rgba(226,173,82,.18);
}

/* ---------------------------------------------------------------- header */
.au-top{
  position:relative;z-index:6;flex:0 0 auto;
  display:flex;flex-direction:column;gap:5px;
  padding:calc(env(safe-area-inset-top) + 6px) 10px 6px;
  /* The header is part of the canvas surface: no separate bar colour, so it
     always matches the background around the image. */
  background:transparent;
  transition:opacity .18s ease;
}
.au-top__row{
  width:100%;max-width:760px;margin:0 auto;display:flex;align-items:center;
  justify-content:space-between;gap:8px;
}
.au-top__row--primary{height:36px}
.au-top__row--tools{height:34px}
.au-top__group{display:flex;align-items:center;gap:6px}
.au-top__ai{
  display:inline-flex;align-items:center;justify-content:center;gap:5px;
  height:30px;padding:0 10px;border-radius:999px;
  color:#f6e2b8;font-size:11.5px;font-weight:750;letter-spacing:.1px;
  border-color:rgba(243,199,123,.38);
  background:linear-gradient(180deg,rgba(243,199,123,.16),rgba(243,199,123,.05));
  box-shadow:inset 0 1px 0 rgba(255,255,255,.16),0 4px 14px rgba(226,173,82,.12);
  transition:filter .16s ease,transform .16s ease,opacity .16s ease;
}
.au-top__ai svg{width:15px;height:15px;flex:0 0 auto;display:block;color:var(--au-gold)}
.au-top__ai:hover{filter:brightness(1.1)}
.au-top__ai:active{transform:scale(.97)}
.au-top__ai[disabled]{opacity:.55;pointer-events:none}
.au-top__ai.is-busy svg{animation:au-spin 1.1s linear infinite}
.au-top__cancel,.au-top__save{
  height:34px;padding:0 16px;border-radius:999px;font-size:12.5px;font-weight:700;
  letter-spacing:.1px;transition:transform .16s ease,filter .16s ease,opacity .16s ease;
}
.au-top__cancel{color:#f4f2ec}
.au-top__cancel:hover{filter:brightness(1.1)}
.au-top__save{
  display:inline-flex;align-items:center;gap:6px;
  color:#2a1c06;
  background:
    linear-gradient(120deg,rgba(255,255,255,.35),transparent 45%),
    linear-gradient(180deg,rgba(249,214,147,.94),rgba(226,173,82,.8));
  border-color:rgba(255,235,190,.65);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.55),0 6px 20px rgba(226,173,82,.28);
}
.au-top__save svg{width:16px;height:16px;display:block}
.au-top__save:hover{filter:brightness(1.04)}
.au-top__cancel:active,.au-top__save:active{transform:scale(.97)}
.au-top__save[disabled]{opacity:.3;pointer-events:none}
.au-icon{
  display:inline-flex;align-items:center;justify-content:center;
  width:32px;height:32px;flex:0 0 32px;border-radius:11px;color:#ece9f2;
  transition:filter .16s ease,transform .16s ease,color .16s ease,opacity .16s ease;
}
.au-icon svg{width:18px;height:18px;display:block}
.au-icon:hover{filter:brightness(1.16)}
.au-icon:active{transform:scale(.94)}
.au-icon[disabled]{opacity:.28;pointer-events:none}
.au-icon.is-on{
  color:var(--au-gold);border-color:rgba(243,199,123,.4);
  background:
    linear-gradient(120deg,rgba(255,235,190,.2),transparent 45%),
    linear-gradient(180deg,rgba(243,199,123,.24),rgba(226,173,82,.12));
}
.au-reset{width:36px;height:36px;flex:0 0 36px;border-radius:13px;color:#e6e2ee}

/* ------------------------------------------------------------------ work */
.au-work{
  position:relative;flex:1 1 auto;min-height:0;overflow:hidden;
  touch-action:none;-webkit-user-select:none;user-select:none;
  background:transparent;
}
.au-canvas{touch-action:none}
.au-overlay{position:absolute;inset:0;z-index:2;pointer-events:none;opacity:0;transition:opacity .2s ease,visibility .2s ease}
.au-root.au-ready .au-overlay{opacity:1}
/* Adjust/Filter render the cropped result; the crop frame is not part of it. */
.au-root.au-ready.is-result .au-overlay{opacity:0;visibility:hidden}
.au-scrim{
  position:absolute;inset:0;z-index:1;pointer-events:none;
  background:rgba(6,6,8,.26);
  -webkit-backdrop-filter:blur(20px) saturate(.78) brightness(.7);
  backdrop-filter:blur(20px) saturate(.78) brightness(.7);
  /* A real glass scrim: the crop frame is a hole, not a transparent shadow. */
  -webkit-clip-path:polygon(evenodd,0 0,100% 0,100% 100%,0 100%,0 0,
    var(--au-crop-x,0px) var(--au-crop-y,0px),
    var(--au-crop-x,0px) calc(var(--au-crop-y,0px) + var(--au-crop-h,100px)),
    calc(var(--au-crop-x,0px) + var(--au-crop-w,100px)) calc(var(--au-crop-y,0px) + var(--au-crop-h,100px)),
    calc(var(--au-crop-x,0px) + var(--au-crop-w,100px)) var(--au-crop-y,0px),
    var(--au-crop-x,0px) var(--au-crop-y,0px));
  clip-path:polygon(evenodd,0 0,100% 0,100% 100%,0 100%,0 0,
    var(--au-crop-x,0px) var(--au-crop-y,0px),
    var(--au-crop-x,0px) calc(var(--au-crop-y,0px) + var(--au-crop-h,100px)),
    calc(var(--au-crop-x,0px) + var(--au-crop-w,100px)) calc(var(--au-crop-y,0px) + var(--au-crop-h,100px)),
    calc(var(--au-crop-x,0px) + var(--au-crop-w,100px)) var(--au-crop-y,0px),
    var(--au-crop-x,0px) var(--au-crop-y,0px));
  transition:opacity .18s ease,background-color .24s ease;
}
/* Rotation drag: focus the frame and let the glass scrim dim the rest with a
   soft transition instead of snapping it on. The blur is removed for the
   duration of the drag so the photo outside the frame stays legible; only the
   dim animates back in when the finger lifts. */
.au-root.au-rotating .au-scrim{
  opacity:1;background-color:rgba(6,6,8,.4);
  -webkit-backdrop-filter:none;backdrop-filter:none;
}
.au-frame{
  position:absolute;left:0;top:0;width:100px;height:100px;z-index:2;
  will-change:transform,width,height;
  border:1px solid rgba(255,255,255,.7);
  box-shadow:0 10px 40px rgba(0,0,0,.18);
  transition:border-color .16s ease,box-shadow .2s ease;
}
.au-frame::before{
  content:"";position:absolute;inset:-1px;border:1px solid rgba(0,0,0,.18);
  pointer-events:none;
}
.au-frame.is-dragging,.au-frame.is-rotating{border-color:var(--au-gold)}
.au-frame:focus-visible{outline:2px solid var(--au-gold);outline-offset:4px}
/* Outside the frame is glass-blurred by default. The scrim clears while the
   frame is dragged/resized or the ratio is changing, so the whole photo shows. */
.au-root.au-cropping .au-scrim,
.au-root.au-ratioing .au-scrim{opacity:0}
/* The composition grid only appears while the frame is actively used. */
.au-grid{
  position:absolute;background:rgba(255,255,255,.17);pointer-events:none;
  opacity:0;transition:opacity .16s ease;
}
.au-frame.is-dragging .au-grid,
.au-frame.is-rotating .au-grid,
.au-root.au-cropping .au-grid,
.au-root.au-rotating .au-grid,
.au-frame:focus-visible .au-grid{opacity:1}
.au-grid.v{top:0;bottom:0;width:1px}
.au-grid.h{left:0;right:0;height:1px}
.au-corner{
  position:absolute;width:24px;height:24px;z-index:2;pointer-events:auto;touch-action:none;
  background-repeat:no-repeat;border-radius:3px;
  filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.65)) drop-shadow(0 0 5px rgba(243,199,123,.3));
  transition:filter .16s ease,opacity .16s ease;
}
/* Two bevelled gold bars per corner: a bright top face, a darker side face
   and a soft cast shadow give the handle a raised 3D look. */
.au-corner::before{content:"";position:absolute;inset:-10px}
.au-corner.tl{
  left:-1px;top:-1px;cursor:nwse-resize;
  background-image:
    linear-gradient(180deg,#fff3d4 0%,#f7d392 32%,#e2ad52 64%,#8f5e1b 100%),
    linear-gradient(90deg,#fff3d4 0%,#f7d392 32%,#e2ad52 64%,#8f5e1b 100%);
  background-size:100% 3.5px,3.5px 100%;
  background-position:left top,left top;
}
.au-corner.tr{
  right:-1px;top:-1px;cursor:nesw-resize;
  background-image:
    linear-gradient(180deg,#fff3d4 0%,#f7d392 32%,#e2ad52 64%,#8f5e1b 100%),
    linear-gradient(90deg,#8f5e1b 0%,#e2ad52 36%,#f7d392 68%,#fff3d4 100%);
  background-size:100% 3.5px,3.5px 100%;
  background-position:right top,right top;
}
.au-corner.br{
  right:-1px;bottom:-1px;cursor:nwse-resize;
  background-image:
    linear-gradient(180deg,#8f5e1b 0%,#e2ad52 36%,#f7d392 68%,#fff3d4 100%),
    linear-gradient(90deg,#8f5e1b 0%,#e2ad52 36%,#f7d392 68%,#fff3d4 100%);
  background-size:100% 3.5px,3.5px 100%;
  background-position:right bottom,right bottom;
}
.au-corner.bl{
  left:-1px;bottom:-1px;cursor:nesw-resize;
  background-image:
    linear-gradient(180deg,#8f5e1b 0%,#e2ad52 36%,#f7d392 68%,#fff3d4 100%),
    linear-gradient(90deg,#fff3d4 0%,#f7d392 32%,#e2ad52 64%,#8f5e1b 100%);
  background-size:100% 3.5px,3.5px 100%;
  background-position:left bottom,left bottom;
}
.au-corner:hover,.au-corner.is-dragging,.au-frame.is-dragging .au-corner{
  filter:drop-shadow(0 2px 3px rgba(0,0,0,.7)) drop-shadow(0 0 9px rgba(243,199,123,.8));
}
.au-frame.is-locked .au-corner:not(.is-dragging),
.au-frame.is-locked .au-edge:not(.is-dragging){pointer-events:none;opacity:.22;filter:none}
.au-edge{
  position:absolute;z-index:1;display:grid;place-items:center;width:30px;height:30px;
  pointer-events:auto;touch-action:none;transition:filter .16s ease;
}
.au-edge::before{
  content:"";display:block;background:var(--au-gold);border-radius:2px;
  box-shadow:0 0 6px rgba(0,0,0,.55);
}
.au-edge.n,.au-edge.s{left:50%;transform:translate(-50%,-50%)}
.au-edge.n{top:0;cursor:ns-resize}
.au-edge.s{bottom:0;transform:translate(-50%,50%);cursor:ns-resize}
.au-edge.e,.au-edge.w{top:50%;transform:translate(50%,-50%)}
.au-edge.e{right:0;cursor:ew-resize}
.au-edge.w{left:0;transform:translate(-50%,-50%);cursor:ew-resize}
.au-edge.n::before,.au-edge.s::before{width:20px;height:2px}
.au-edge.e::before,.au-edge.w::before{width:2px;height:20px}
.au-edge:hover,.au-edge.is-dragging,.au-frame.is-dragging .au-edge{filter:drop-shadow(0 0 7px rgba(243,199,123,.7))}

/* ------------------------------------------------------------ empty/load */
.au-empty{
  position:absolute;inset:0;z-index:3;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:6px;padding:30px;text-align:center;
  transition:opacity .2s ease,visibility .2s ease;
}
.au-root.au-ready .au-empty,.au-root.au-busy .au-empty{opacity:0;visibility:hidden}
.au-empty__icon{
  display:flex;align-items:center;justify-content:center;width:68px;height:68px;
  margin-bottom:10px;border-radius:22px;color:var(--au-gold);
  background:linear-gradient(145deg,rgba(243,199,123,.16),rgba(243,199,123,.04));
  border:1px solid rgba(243,199,123,.26);
  box-shadow:0 16px 48px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.09);
}
.au-empty__icon svg{width:28px;height:28px}
.au-empty h3{margin:0;font-size:17px;font-weight:650;letter-spacing:.1px}
.au-empty p{margin:0 0 12px;color:var(--au-muted);font-size:12.5px;max-width:250px}
.au-ghost{
  height:38px;padding:0 18px;border-radius:999px;font-size:12.5px;font-weight:650;
  color:var(--au-gold);background:var(--au-gold-soft);
  border:1px solid rgba(243,199,123,.3);
}
.au-ghost:hover{background:rgba(243,199,123,.22)}
.au-loading{
  position:absolute;inset:0;z-index:4;display:none;align-items:center;justify-content:center;
  background:rgba(5,5,7,.35);
}
.au-root.au-busy .au-loading{display:flex}
.au-spinner{
  width:30px;height:30px;border-radius:50%;border:2px solid rgba(255,255,255,.14);
  border-top-color:var(--au-gold);animation:au-spin .8s linear infinite;
}
@keyframes au-spin{to{transform:rotate(360deg)}}
.au-root.au-dragover::after{
  content:"";position:absolute;inset:10px;z-index:9;border:1.5px dashed rgba(243,199,123,.65);
  border-radius:18px;background:rgba(243,199,123,.045);pointer-events:none;
}

/* ------------------------------------------------------------------ dock */
.au-dock{
  position:relative;z-index:7;flex:0 0 auto;width:100%;max-width:760px;
  margin:0 auto;padding:0 10px calc(8px + env(safe-area-inset-bottom));
  background:none;border:0;box-shadow:none;
  /* No fill-mode: once the entrance finishes it must not pin opacity, or the
     crop-drag rule below could never fade the dock. */
  animation:au-rise .24s cubic-bezier(.2,.8,.2,1) backwards;
}
.au-root:not(.au-ready) .au-dock{display:none}
@keyframes au-rise{from{transform:translateY(16px);opacity:0}to{transform:none;opacity:1}}
.au-deck{display:flex;flex-direction:column;gap:6px;padding:4px 0 6px}
.au-deck__row{display:flex;align-items:center;gap:6px;width:100%}
.au-deck__row--top{position:relative;height:36px;transition:opacity .18s ease}
/* Frame drag: fade the chrome so the photo and frame own the screen. Layout
   space is preserved, so the stage does not jump while dragging. */
.au-root.au-cropping .au-top,
.au-root.au-cropping .au-dock{opacity:0;pointer-events:none}
/* Ratio change: keep the ratio chips, hide the rest of the chrome. */
.au-root.au-ratioing .au-top,
.au-root.au-ratioing .au-tabs,
.au-root.au-ratioing .au-deck__row--top{opacity:0;pointer-events:none}
/* Rotation drag: the frame grid appears and the rest of the chrome fades,
   while the ruler stays visible under the finger. */
.au-root.au-rotating .au-top,
.au-root.au-rotating .au-tabs,
.au-root.au-rotating .au-deck__row--top{opacity:0;pointer-events:none}
.au-deck__row--context{min-height:44px;min-width:0}
.au-deck__row--filters{min-height:70px}
.au-context{display:none;width:100%;min-width:0}
.au-context.is-active{display:block}
.au-pane{display:none}
.au-pane.is-active{display:block;animation:au-fade .18s ease both}
@keyframes au-fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}

/* ------------------------------------------------------------------ tabs */
.au-tabs{
  position:relative;display:flex;align-items:center;justify-content:space-around;
  height:54px;padding:8px 8px 6px;border-radius:20px;overflow:visible;
  background:linear-gradient(180deg,rgba(255,255,255,.12),rgba(255,255,255,.035));
  border:1px solid rgba(255,255,255,.13);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.2),0 10px 30px rgba(0,0,0,.38);
  -webkit-backdrop-filter:blur(24px) saturate(1.6);
  backdrop-filter:blur(24px) saturate(1.6);
  transition:opacity .18s ease;
}
.au-tab{
  position:relative;display:flex;flex:1 1 0;flex-direction:column;align-items:center;
  justify-content:center;gap:2px;height:40px;border-radius:13px;
  color:var(--au-muted);font-size:10px;font-weight:600;letter-spacing:.2px;
  transition:color .16s ease,background .16s ease;
}
.au-tab svg{width:20px;height:20px;display:block}
.au-tab:hover{background:rgba(255,255,255,.05)}
.au-tab[aria-selected="true"]{color:var(--au-gold);background:rgba(243,199,123,.08)}
.au-tab[aria-selected="true"]::before{
  content:"";position:absolute;top:-6px;left:50%;transform:translateX(-50%);
  width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;
  border-top:6px solid var(--au-gold);
  filter:drop-shadow(0 0 6px rgba(243,199,123,.6));
}

/* ----------------------------------------------------------------- modes */
.au-modes{
  position:relative;flex:1 1 auto;min-width:0;height:36px;overflow:hidden;
  -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 16px,#000 calc(100% - 16px),transparent 100%);
  mask-image:linear-gradient(90deg,transparent 0,#000 16px,#000 calc(100% - 16px),transparent 100%);
}
.au-modes__track{
  position:absolute;left:0;top:0;display:flex;align-items:center;gap:6px;height:100%;
  transition:transform .28s cubic-bezier(.2,.8,.2,1);will-change:transform;
}
.au-mode{
  display:flex;align-items:center;justify-content:center;gap:7px;flex:0 0 auto;
  min-width:126px;height:36px;padding:0 16px;border-radius:13px;color:#e9e6ef;
  text-align:left;white-space:nowrap;
  transition:filter .16s ease,border-color .16s ease,background .16s ease;
}
.au-mode svg{width:17px;height:17px;color:var(--au-gold);flex:0 0 auto;display:block}
.au-mode__value{
  font-size:12px;font-weight:700;color:var(--au-gold);
  white-space:nowrap;font-variant-numeric:tabular-nums;
}
.au-mode--persp{min-width:98px;padding:0 12px;gap:5px}
.au-mode:hover{filter:brightness(1.1)}
.au-mode.is-active{
  border-color:rgba(243,199,123,.4);
  background:
    linear-gradient(120deg,rgba(255,235,190,.2),transparent 45%),
    linear-gradient(180deg,rgba(243,199,123,.22),rgba(226,173,82,.1));
}
/* Keep the reset in the flex row instead of floating it over the mode track.
   The track gets the remaining width, so it can never slide under the button. */
.au-deck__row--top .au-reset{
  flex:0 0 auto;margin-left:auto;
  transition:filter .16s ease,transform .16s ease,color .16s ease,opacity .16s ease;
}
.au-deck__row--top .au-reset.is-left{order:-1;margin-left:0}

/* ----------------------------------------------------------------- chips */
.au-chipsrail{position:relative;width:100%;min-width:0;padding:2px 0 7px}
.au-chipsrail::after{
  content:"";position:absolute;left:50%;bottom:0;transform:translateX(-50%);
  width:2px;height:7px;border-radius:2px;background:var(--au-gold);
  box-shadow:0 0 8px rgba(243,199,123,.65);pointer-events:none;
}
.au-chips{
  position:relative;display:flex;align-items:center;gap:6px;width:100%;overflow-x:auto;
  padding:2px 0;scrollbar-width:none;scroll-behavior:smooth;
}
.au-chips::before,.au-chips::after{content:"";flex:0 0 50%}
.au-chips::-webkit-scrollbar{display:none}
.au-chip{
  flex:0 0 auto;height:30px;padding:0 12px;border-radius:10px;
  background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.08);
  color:#d8d5df;font-size:11.5px;font-weight:600;white-space:nowrap;
  transition:background .15s ease,color .15s ease,border-color .15s ease;
}
.au-chip:hover{background:rgba(255,255,255,.1)}
.au-chip[aria-pressed="true"]{
  background:rgba(243,199,123,.16);border-color:rgba(243,199,123,.4);
  color:var(--au-gold);
}

/* ---------------------------------------------------------------- params */
.au-deck__row--adjust{gap:5px}
.au-auto{
  display:flex;align-items:center;justify-content:center;gap:5px;flex:0 0 auto;
  height:32px;padding:0 10px;border-radius:11px;color:var(--au-gold);
  font-size:10.5px;font-weight:700;letter-spacing:.2px;white-space:nowrap;
  transition:filter .16s ease,opacity .16s ease;
}
.au-auto svg{width:15px;height:15px;flex:0 0 auto;display:block}
.au-auto:hover{filter:brightness(1.12)}
.au-auto[disabled]{opacity:.55;pointer-events:none}
.au-auto.is-busy svg{animation:au-spin 1.1s linear infinite}
@keyframes au-spin{to{transform:rotate(360deg)}}
.au-params{
  display:flex;align-items:center;gap:5px;flex:1 1 auto;min-width:0;
  overflow-x:auto;padding:2px 0;scrollbar-width:none;
  -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 10px,#000 calc(100% - 10px),transparent 100%);
  mask-image:linear-gradient(90deg,transparent 0,#000 10px,#000 calc(100% - 10px),transparent 100%);
}
.au-params::-webkit-scrollbar{display:none}
/* Group captions ride along in the rail so 18 chips stay readable without a
   second row: a hairline and a 7 px caption mark the start of each family. */
.au-param-sep{
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;
  flex:0 0 auto;padding:0 2px;color:rgba(255,255,255,.32);
  font-size:7px;font-weight:700;letter-spacing:.35px;text-transform:uppercase;
  white-space:nowrap;pointer-events:none;
}
.au-param-sep::before{
  content:"";width:1px;height:13px;border-radius:1px;
  background:linear-gradient(180deg,transparent,rgba(255,255,255,.3),transparent);
}
.au-param-sep b{font:inherit}
.au-param-sep[data-group="portrait"]{color:rgba(243,199,123,.58)}
.au-param-sep[data-group="portrait"]::before{
  background:linear-gradient(180deg,transparent,rgba(243,199,123,.55),transparent);
}
.au-param{
  flex:0 0 auto;height:30px;padding:0 11px;border-radius:10px;
  background:rgba(255,255,255,.055);border:1px solid transparent;
  color:#cfccd6;font-size:11px;font-weight:600;white-space:nowrap;
  transition:background .15s ease,color .15s ease,border-color .15s ease;
}
.au-param:hover{background:rgba(255,255,255,.1)}
.au-param[aria-pressed="true"]{
  background:rgba(243,199,123,.16);border-color:rgba(243,199,123,.38);
  color:var(--au-gold);
}
.au-param--liquify{
  display:inline-flex;align-items:center;gap:4px;
  color:var(--au-gold);background:rgba(243,199,123,.08);
  border-color:rgba(243,199,123,.22);
}
.au-param--liquify svg{width:13px;height:13px;display:block;flex:0 0 auto}
.au-param--liquify[aria-pressed="true"]{
  background:rgba(243,199,123,.2);border-color:rgba(243,199,123,.55);
}
.au-liquify-row .au-ticksrow{flex:1 1 auto;width:auto;min-width:0}
.au-liquify-row .au-value{
  height:40px;min-width:44px;padding:0 7px;display:flex;
  align-items:center;justify-content:center;flex:0 0 auto;
}
.au-liquify-row .au-reset{width:40px;height:40px;flex-basis:40px}
.au-brush-ring{
  position:absolute;left:0;top:0;z-index:2;display:none;border-radius:50%;
  border:1.5px solid rgba(255,255,255,.92);pointer-events:none;
  box-shadow:0 0 0 1px rgba(0,0,0,.35),inset 0 0 0 1px rgba(0,0,0,.2);
  will-change:transform,width,height;
}
.au-mask-ring{z-index:6;border-color:rgba(243,199,123,.95);box-shadow:0 0 0 1px rgba(0,0,0,.45),0 0 12px rgba(243,199,123,.35)}
.au-mask-ring::after{content:"";position:absolute;left:50%;top:50%;width:3px;height:3px;border-radius:50%;background:rgba(243,199,123,.95);transform:translate(-50%,-50%)}
.au-value{
  flex:0 0 auto;min-width:48px;height:32px;padding:0 9px;border-radius:11px;
  color:var(--au-gold);font-size:11.5px;font-weight:700;
  font-variant-numeric:tabular-nums;transition:filter .16s ease;
}
.au-value:hover{filter:brightness(1.12)}

/* --------------------------------------------------------------- sliders */
.au-ticksrow{width:100%}
.au-slider{margin-top:5px}
.au-slider__head{display:flex;align-items:center;justify-content:space-between;gap:10px;height:20px}
.au-slider__label{color:#d2cfd9;font-size:12px;font-weight:520;letter-spacing:.05px}
.au-slider__value{
  min-width:36px;padding:2px 7px;border-radius:6px;text-align:center;
  background:rgba(243,199,123,.1);color:var(--au-gold);
  font-size:11px;font-weight:650;font-variant-numeric:tabular-nums;
}
.au-slider__value:hover{background:rgba(243,199,123,.18)}
.au-slider__value[disabled]{opacity:.45;pointer-events:none}
.au-slider.is-disabled{opacity:.4}
.au-ticks{
  position:relative;display:flex;align-items:center;width:100%;height:40px;
  padding:5px 10px;border-radius:12px;cursor:ew-resize;touch-action:none;
  overflow:hidden;
  background:rgba(8,8,10,.26);border:1px solid rgba(255,255,255,.08);
  -webkit-backdrop-filter:blur(14px) saturate(1.3);
  backdrop-filter:blur(14px) saturate(1.3);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 4px 14px rgba(0,0,0,.18);
  outline:none;
}
.au-ticks__track{
  display:flex;align-items:center;justify-content:space-between;
  width:100%;height:28px;pointer-events:none;
}
/* Ruler mode: the white ticks slide under a fixed gold centre line. */
.au-ticks--ruler .au-ticks__track{
  position:absolute;left:50%;top:50%;width:135%;height:28px;
  transform:translate3d(0,-50%,0);will-change:transform;
}
.au-ticks__center{
  position:absolute;left:50%;top:50%;z-index:2;pointer-events:none;
  width:2px;height:30px;border-radius:2px;background:var(--au-gold);
  transform:translate(-50%,-50%);
  box-shadow:0 0 10px rgba(243,199,123,.72),0 0 2px rgba(255,238,200,.95);
}
/* Ruler: denser + taller ticks, synced across all sliders.
   gap reduced via tickStep (JS) and visual weight via heights.
   zero/major marks are taller; active is a raised gold/white pill. */
.au-ticks--ruler .au-ticks__track{width:118%;gap:0}
.au-tick{
  --tick-h:14px;--au-tick:rgba(255,255,255,.58);
  width:2px;height:var(--tick-h);flex:0 0 2px;border-radius:1px;
  background:var(--au-tick);will-change:height;
  transition:height .16s cubic-bezier(.2,.8,.2,1),background-color .14s ease,opacity .16s ease,box-shadow .16s ease;
}
.au-tick.is-zero{--tick-h:20px;opacity:.92}
.au-tick.is-major{--tick-h:20px}
.au-ticks--ruler .au-tick.is-major{--tick-h:22px}
.au-tick.is-active{height:30px;background:var(--au-gold);box-shadow:0 0 9px rgba(243,199,123,.55)}
.au-tick.is-wave{animation:au-tick-wave .3s cubic-bezier(.2,.8,.2,1) var(--wave-delay,0ms) both}
.au-ticks--ruler .au-tick{--tick-h:15px;background:rgba(255,255,255,.72);width:2px;flex-basis:2px}
.au-ticks--ruler .au-tick.is-zero{--tick-h:24px;opacity:.98}
.au-ticks--ruler .au-tick.is-active{height:30px;background:#fff;box-shadow:none}
.au-ticks--ruler .au-tick.is-wave{animation:none}
@keyframes au-tick-wave{
  0%{height:24px;background:var(--au-gold);opacity:.9;box-shadow:0 0 9px rgba(243,199,123,.45)}
  100%{height:var(--tick-h);background:var(--au-tick);opacity:1;box-shadow:none}
}
.au-ticks:focus-visible{outline:2px solid var(--au-gold);outline-offset:2px}
.au-ticks.is-disabled,.au-ticksrow.is-disabled{opacity:.4;pointer-events:none}

/* --------------------------------------------------------------- filters */
.au-filters{
  display:flex;align-items:flex-start;gap:10px;width:100%;overflow-x:auto;
  padding:2px 0;scroll-snap-type:x proximity;scrollbar-width:none;
}
.au-filters::-webkit-scrollbar{display:none}
.au-filter{
  flex:0 0 auto;width:54px;display:flex;flex-direction:column;align-items:center;
  gap:4px;color:var(--au-muted);font-size:9.5px;font-weight:600;
  scroll-snap-align:start;
}
.au-filter canvas{
  width:52px;height:52px;display:block;border-radius:12px;border:2px solid transparent;
  background:#1c1c21;box-shadow:0 5px 16px rgba(0,0,0,.35);
  transition:border-color .15s ease,box-shadow .15s ease,transform .15s ease;
}
.au-filter:hover canvas{transform:translateY(-1px)}
.au-filter[aria-pressed="true"]{color:var(--au-gold)}
.au-filter[aria-pressed="true"] canvas{
  border-color:var(--au-gold);
  box-shadow:0 0 0 1px rgba(243,199,123,.5),0 8px 22px rgba(226,173,82,.22);
}
.au-filter span{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.au-filter-sep{flex:0 0 auto;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;color:rgba(255,255,255,.45);font-size:7px;font-weight:700;letter-spacing:.35px;text-transform:uppercase;white-space:nowrap;pointer-events:none}
.au-filter-sep::before{content:"";width:1px;height:20px;border-radius:1px;background:linear-gradient(180deg,transparent,rgba(255,255,255,.35),transparent)}
.au-filter-sep b{font:inherit}
.au-filter--saved{border-style:dashed!important}
.au-filter--saved canvas{box-shadow:0 5px 16px rgba(0,0,0,.35),inset 0 0 0 1px rgba(243,199,123,.25)}
.au-filter--saved-del{position:absolute;top:-4px;right:-4px;width:16px;height:16px;border-radius:50%;background:#3a3a40;color:#f0a390;display:grid;place-items:center;font-size:10px;font-weight:800;line-height:1}
.au-filter--saved{position:relative}
.au-saved__head--inline{border-top:1px solid rgba(255,255,255,.07);padding-top:8px;margin-top:8px}
.au-filter--reset{position:sticky;left:0;z-index:3;background:rgba(20,20,24,.92);border-radius:12px;border:1px solid rgba(243,199,123,.35);box-shadow:0 5px 16px rgba(0,0,0,.35)}
.au-filter--reset svg{width:18px;height:18px;color:var(--au-gold)}
.au-filter--reset:active{transform:scale(.96)}
.au-model-coll{border-top:0;margin-top:0;padding-top:2px}
.au-model-head{padding:2px 0}
.au-model-head .au-model-label{margin:0}

/* ------------------------------------------------------------------ sheet */
.au-sheetwrap{
  position:absolute;inset:0;z-index:20;display:flex;align-items:flex-end;justify-content:center;
  background:rgba(0,0,0,.55);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);
  opacity:0;visibility:hidden;transition:opacity .2s ease;
}
.au-sheetwrap.is-open{opacity:1;visibility:visible}
.au-sheet{
  width:100%;max-width:760px;max-height:88%;overflow-y:auto;
  padding:10px 20px calc(18px + env(safe-area-inset-bottom));
  background:linear-gradient(180deg,#1a1a1f,#101013 70%);
  border-top:1px solid rgba(243,199,123,.28);border-radius:24px 24px 0 0;
  box-shadow:0 -24px 70px rgba(0,0,0,.6);
  transform:translateY(18px);transition:transform .24s cubic-bezier(.2,.8,.2,1);
}
.au-sheetwrap.is-open .au-sheet{transform:none}
.au-sheet .au-grabber{width:34px;height:4px;margin:0 auto 10px;border-radius:4px;background:rgba(255,255,255,.16)}
.au-sheet__title{font-size:17px;font-weight:650;letter-spacing:.1px;margin-bottom:2px}
.au-sheet__sub{color:var(--au-muted);font-size:11.5px;margin-bottom:14px}
.au-meta{
  display:flex;align-items:center;gap:14px;padding:11px 13px;margin-bottom:14px;
  border:1px solid var(--au-line);border-radius:13px;background:rgba(255,255,255,.035);
}
.au-meta svg{width:22px;height:22px;color:var(--au-gold);flex:0 0 auto}
.au-meta div{min-width:0}
.au-meta b{display:block;font-size:12.5px;font-weight:600;letter-spacing:.1px}
.au-meta span{display:block;color:var(--au-muted);font-size:10.5px;font-variant-numeric:tabular-nums}
.au-label{
  display:block;margin:0 0 7px;color:var(--au-muted);font-size:10px;font-weight:700;
  letter-spacing:1px;text-transform:uppercase;
}
.au-seg{
  display:grid;grid-template-columns:repeat(3,1fr);gap:3px;padding:3px;margin-bottom:14px;
  border-radius:12px;background:rgba(255,255,255,.055);
}
.au-seg button{
  height:34px;border-radius:9px;color:var(--au-muted);font-size:12px;font-weight:650;
  transition:background .15s ease,color .15s ease;
}
.au-seg button[aria-pressed="true"]{background:var(--au-gold-soft);color:var(--au-gold)}
.au-seg button:hover{color:var(--au-text)}
.au-seg button[aria-pressed="true"]:hover{color:var(--au-gold)}
.au-progress{display:flex;flex-direction:column;gap:5px;margin:2px 0 6px}
.au-progress[hidden]{display:none}
.au-progress__head{display:flex;align-items:center;gap:8px;min-width:0}
.au-progress__label{
  flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
  color:var(--au-muted);font-size:11px;
}
.au-progress__pct{
  color:var(--au-gold);font-size:11px;font-weight:700;font-variant-numeric:tabular-nums;
}
.au-progress__cancel{
  height:24px;padding:0 8px;border-radius:8px;color:var(--au-muted);
  font-size:10px;font-weight:650;white-space:nowrap;
}
.au-progress__cancel:hover{color:var(--au-text);background:rgba(255,255,255,.07)}
.au-progress__track{
  height:4px;border-radius:999px;overflow:hidden;background:rgba(255,255,255,.1);
}
.au-progress__track span{
  display:block;width:0;height:100%;border-radius:inherit;
  background:linear-gradient(90deg,#f3c77b,var(--au-gold-strong));
  transition:width .16s linear;
}
.au-sheet__actions{display:grid;grid-template-columns:1fr;gap:8px;margin-top:8px}
.au-sheet__actions.has-copy{grid-template-columns:1fr 1fr}
.au-primary,.au-copy{
  display:flex;align-items:center;justify-content:center;gap:8px;width:100%;height:48px;
  border-radius:14px;font-size:14px;font-weight:700;
  transition:transform .16s ease,filter .16s ease,opacity .16s ease;
}
.au-primary{
  background:linear-gradient(180deg,#f9d693,var(--au-gold-strong));
  color:#241a07;
  box-shadow:0 8px 26px rgba(226,173,82,.24),inset 0 1px 0 rgba(255,255,255,.5);
}
.au-primary:hover{filter:brightness(1.04)}
.au-primary:active{transform:scale(.99)}
.au-primary[disabled]{opacity:.55;pointer-events:none}
.au-primary svg{width:18px;height:18px}
.au-copy{
  color:var(--au-gold);
  background:rgba(255,255,255,.055);
  border:1px solid rgba(243,199,123,.3);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.08);
}
.au-copy:hover{background:rgba(243,199,123,.12)}
.au-copy:active{transform:scale(.99)}
.au-copy[disabled]{opacity:.55;pointer-events:none}
.au-copy svg{width:18px;height:18px}
.au-cancel{
  display:block;width:100%;height:42px;margin-top:4px;color:var(--au-muted);
  font-size:12.5px;font-weight:600;
}
.au-cancel:hover{color:var(--au-text)}

/* ------------------------------------------------------------------- AI */
.au-ai{
  position:fixed;inset:0;z-index:60;display:grid;place-items:center;
  padding:24px;background:rgba(8,8,10,.52);
  -webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);
  opacity:0;transition:opacity .18s ease;
}
.au-ai.is-open{opacity:1}
.au-ai[hidden]{display:none}
.au-ai__panel{
  width:min(360px,100%);padding:18px;border-radius:22px;
  display:flex;flex-direction:column;gap:14px;
  box-shadow:0 24px 80px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.1);
}
.au-ai__head{display:flex;align-items:center;gap:12px}
.au-ai__badge{
  width:40px;height:40px;flex:0 0 40px;border-radius:14px;
  display:grid;place-items:center;color:#2a1c06;
  background:
    linear-gradient(120deg,rgba(255,255,255,.35),transparent 45%),
    linear-gradient(180deg,rgba(249,214,147,.95),rgba(226,173,82,.82));
  box-shadow:inset 0 1px 0 rgba(255,255,255,.5),0 6px 20px rgba(226,173,82,.22);
}
.au-ai__badge svg{width:20px;height:20px;display:block}
.au-ai__copy{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}
.au-ai__copy strong{font-size:14px;line-height:1.3}
.au-ai__detail{
  font-size:11.5px;color:var(--au-muted);line-height:1.35;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
.au-ai__cancel{
  height:30px;padding:0 11px;border-radius:999px;
  font-size:11px;font-weight:700;color:var(--au-muted);
}
.au-ai__cancel:hover{color:var(--au-text)}
.au-ai__track{height:5px;border-radius:999px;background:rgba(255,255,255,.1);overflow:hidden}
.au-ai__track span{
  display:block;height:100%;width:0;border-radius:inherit;
  background:linear-gradient(90deg,#e2ad52,#f3c77b);
  transition:width .25s ease;
}
.au-ai.is-indeterminate .au-ai__track span{
  width:40%!important;animation:au-ai-slide 1.1s ease-in-out infinite;
}
@keyframes au-ai-slide{
  0%{transform:translateX(-110%)}
  100%{transform:translateX(310%)}
}
/* AI result bar: hold to see the pre-AI pixels, or undo the whole pass. */
.au-aicmp{
  display:flex;align-items:center;justify-content:flex-end;gap:6px;margin:2px 0 4px;
  padding:4px 5px;border-radius:999px;
  border:1px solid rgba(243,199,123,.22);
  background:linear-gradient(180deg,rgba(255,255,255,.09),rgba(255,255,255,.03));
}
.au-aicmp[hidden]{display:none}
.au-aicmp__hold,.au-aicmp__undo{
  height:26px;padding:0 11px;border-radius:999px;font-size:11px;font-weight:650;
  color:var(--au-text);border:1px solid rgba(255,255,255,.14);
  background:rgba(255,255,255,.06);white-space:nowrap;
  touch-action:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;
}
.au-aicmp__hold.is-on{
  color:#2a1c06;border-color:rgba(243,199,123,.7);
  background:linear-gradient(180deg,#f9d693,#e2ad52);
}
.au-aicmp__undo{color:var(--au-muted);background:none;border-color:rgba(255,255,255,.1)}
.au-aicmp__undo:hover{color:var(--au-text)}

/* ------------------------------------------------------------------ toast */
.au-toast{
  position:absolute;left:50%;top:calc(env(safe-area-inset-top) + 94px);z-index:40;
  display:flex;align-items:center;gap:7px;max-width:calc(100% - 32px);
  padding:9px 14px;border-radius:999px;
  background:rgba(24,24,28,.95);border:1px solid rgba(243,199,123,.28);
  color:var(--au-text);font-size:11.5px;font-weight:550;
  box-shadow:0 12px 40px rgba(0,0,0,.5);
  transform:translate(-50%,-8px);opacity:0;pointer-events:none;
  transition:opacity .2s ease,transform .2s ease;
}
.au-toast.is-open{opacity:1;transform:translate(-50%,0)}
.au-toast svg{width:15px;height:15px;color:var(--au-gold);flex:0 0 auto}
.au-toast.is-error{border-color:rgba(255,107,107,.38)}
.au-toast.is-error svg{color:var(--au-danger)}

/* ------------------------------------------------------------ wide/height */
@media (min-width:820px){
  .au-top{padding-left:18px;padding-right:18px}
  .au-dock{padding-left:18px;padding-right:18px}
  .au-sheet{padding-left:24px;padding-right:24px}
}
@media (max-width:420px){
  .au-mode{min-width:0;padding:0 11px;gap:5px}
  .au-mode--persp{min-width:84px;padding:0 9px}
}
@media (max-width:380px){
  .au-top__ai span{display:none}
  .au-top__ai{width:30px;padding:0}
  .au-top__row--tools{gap:4px}
}
@media (max-height:560px){
  /* Short screens: keep both export actions visible without scrolling. */
  .au-sheet{padding-top:8px;padding-bottom:calc(10px + env(safe-area-inset-bottom))}
  .au-sheet .au-grabber{margin-bottom:6px}
  .au-sheet__title{font-size:16px}
  .au-sheet__sub{margin-bottom:8px}
  .au-meta{padding:8px 11px;margin-bottom:8px}
  .au-label{margin-bottom:5px}
  .au-seg{margin-bottom:8px}
  .au-seg button{height:30px}
  .au-slider{margin-top:2px}
  .au-sheet__actions{margin-top:4px;gap:6px}
  .au-primary,.au-copy{height:44px}
  .au-cancel{height:36px;margin-top:0}
}
@media (max-height:620px){
  .au-top{gap:4px;padding-top:calc(env(safe-area-inset-top) + 4px);padding-bottom:4px}
  .au-top__row--primary{height:32px}
  .au-top__row--tools{height:30px}
  .au-top__cancel,.au-top__save{height:30px;font-size:12px}
  .au-icon{width:28px;height:28px;flex-basis:28px;border-radius:10px}
  .au-icon svg{width:16px;height:16px}
  .au-reset{width:32px;height:32px;flex-basis:32px;border-radius:11px}
  .au-deck{gap:4px;padding:2px 0 4px}
  .au-deck__row--top{height:32px}
  .au-deck__row--context{min-height:38px}
  .au-deck__row--filters{min-height:60px}
  .au-mode{height:32px;min-width:112px;padding:0 12px}
  .au-modes{height:32px}
  .au-ticks{height:36px}
  .au-tick.is-active{height:23px}
  .au-tabs{height:48px;padding:6px 6px 5px}
  .au-tab{height:37px}
  .au-tab svg{width:18px;height:18px}
  .au-filter{width:46px}
  .au-filter canvas{width:44px;height:44px}
  .au-empty__icon{width:54px;height:54px;border-radius:18px}
}
/* Short landscape screens: put the dock beside the canvas instead of stacking,
   otherwise the preview is squeezed to a strip. */
@media (min-width:640px) and (max-height:560px) and (orientation:landscape){
  .au-root{
    display:grid;
    grid-template-columns:minmax(0,1fr) clamp(320px,42vw,380px);
    grid-template-rows:auto minmax(0,1fr);
  }
  .au-top{grid-column:1/-1;grid-row:1}
  .au-work{grid-column:1;grid-row:2}
  .au-dock{
    grid-column:2;grid-row:2;display:flex;flex-direction:column;justify-content:flex-end;
    width:100%;max-width:none;height:100%;
    padding:0 10px calc(8px + env(safe-area-inset-bottom));
  }
  .au-deck{flex:0 0 auto}
  .au-tabs{flex:0 0 auto}
  .au-sheet{max-width:560px}
}
@media (prefers-reduced-motion:reduce){
  .au-root *,.au-root *::before,.au-root *::after{
    animation-duration:.001ms!important;transition-duration:.001ms!important;
  }
}
@media (prefers-reduced-transparency:reduce){
  .au-top{
    background:transparent;
    -webkit-backdrop-filter:none;backdrop-filter:none;
  }
  .au-scrim{
    background:rgba(6,6,8,.72);
    -webkit-backdrop-filter:none;backdrop-filter:none;
  }
  .au-glass,.au-tabs,.au-ticks,.au-chip,.au-param,.au-icon,.au-value,.au-mode{
    -webkit-backdrop-filter:none;backdrop-filter:none;
    background:rgba(22,22,27,.95);
  }
  .au-top__save{
    background:linear-gradient(180deg,#f9d693,#e2ad52);
    color:#241a07;
  }
  .au-tab[aria-selected="true"]{background:rgba(243,199,123,.14)}
}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){
  .au-glass,.au-tabs,.au-ticks,.au-chip,.au-param,.au-icon,.au-value,.au-mode{
    background:rgba(20,20,24,.9);
  }
  .au-scrim{background:rgba(6,6,8,.72)}
  .au-top{background:transparent}
}
@media (prefers-contrast:more){
  .au-glass,.au-tabs,.au-ticks,.au-mode,.au-chip,.au-param,.au-icon,.au-value{
    border-color:rgba(255,255,255,.4);
  }
  .au-tick{--au-tick:rgba(255,255,255,.9)}
}

/* ------------------------------------------------- tones / saved / text / ai */
/* Apple motion: feedback on pointer-down, 1:1 drag, interruptible springs via
   cubic-bezier(0.32,0.72,0,1). Emil gate: fast + subtle for frequent taps,
   richer only for rare first-time actions (add text). */
.au-filter-cats{padding:2px 0 2px}
.au-tone-hint{
  min-height:16px;margin:2px 2px 0;color:var(--au-muted);
  font-size:10.5px;letter-spacing:.1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  opacity:.75;
}
.au-tone-hint.is-visible{opacity:1;color:#d8cfb8}
.au-filter:active canvas{transform:scale(.96)}
.au-filter[aria-pressed="true"] canvas{transition:transform .18s cubic-bezier(0.32,0.72,0,1)}
.au-saved{margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.07)}
.au-saved__head{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.au-saved__title{color:#d2cfd9;font-size:11px;font-weight:700;letter-spacing:.3px;text-transform:uppercase}
.au-saved__input{
  flex:1 1 90px;min-width:80px;height:30px;padding:0 10px;border-radius:10px;
  background:rgba(8,8,10,.5);border:1px solid rgba(255,255,255,.12);color:var(--au-text);
  font:600 11px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
  outline:none;
}
.au-saved__input:focus{border-color:rgba(243,199,123,.5)}
.au-save-preset{
  display:inline-flex;align-items:center;gap:5px;height:30px;padding:0 10px;border-radius:10px;
  color:var(--au-gold);font-size:11px;font-weight:700;white-space:nowrap;
  transition:transform .12s ease,filter .12s ease;
}
.au-save-preset svg{width:13px;height:13px}
.au-save-preset:active{transform:scale(.96)}
.au-saved__list{display:flex;gap:6px;overflow-x:auto;padding:8px 0 2px;scrollbar-width:none}
.au-saved__list::-webkit-scrollbar{display:none}
.au-saved__empty{color:var(--au-muted);font-size:10.5px;padding:4px 2px}
.au-saved-card{
  display:flex;align-items:center;gap:6px;flex:0 0 auto;
  padding:5px 6px 5px 10px;border-radius:999px;
  background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.09);
}
.au-saved-card__label{font-size:11px;font-weight:650;color:#e8e4db;max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.au-saved-card__apply{
  height:22px;padding:0 9px;border-radius:999px;font-size:10px;font-weight:700;
  color:var(--au-gold);background:rgba(243,199,123,.14);
  transition:transform .12s ease;
}
.au-saved-card__apply:active{transform:scale(.94)}
.au-saved-card__del{width:22px;height:22px;border-radius:50%;flex:0 0 22px}
.au-saved-card__del svg{width:11px;height:11px}
.au-chip--danger{color:#f0a390}
.au-chip--danger:active{transform:scale(.96)}

.au-text-top{justify-content:space-between}
.au-text-hint{color:#d2cfd9;font-size:12px;font-weight:600}
.au-add-text{
  display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 13px;border-radius:999px;
  color:var(--au-gold);font-size:12px;font-weight:750;
  transition:transform .12s ease,filter .12s ease;
}
.au-add-text svg{width:14px;height:14px}
.au-add-text:active{transform:scale(.96)}
.au-text-body{padding:2px 0}
.au-text-input{
  width:100%;padding:10px 12px;border-radius:12px;resize:none;
  background:rgba(8,8,10,.5);border:1px solid rgba(255,255,255,.12);color:var(--au-text);
  font:600 14px/1.35 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
  outline:none;
}
.au-text-input:focus{border-color:rgba(243,199,123,.5)}
.au-text-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:6px}
.au-text-fonts{grid-template-columns:repeat(5,1fr)!important;flex:1 1 140px;margin:0}
.au-font-btn{height:30px;border-radius:8px;font-size:11px;font-weight:600;color:var(--au-muted)}
.au-font-btn[aria-pressed="true"]{background:rgba(243,199,123,.16);color:var(--au-gold)}
.au-text-color{display:flex;align-items:center;gap:6px;color:var(--au-muted);font-size:11px;font-weight:600}
.au-text-colordot{width:16px;height:16px;border-radius:50%;border:1px solid rgba(255,255,255,.3)}
.au-text-color input[type="color"]{width:26px;height:26px;padding:0;border:0;background:none;cursor:pointer}
.au-text-toggles{display:flex;gap:5px;overflow-x:auto;padding:6px 0 2px;scrollbar-width:none}
.au-text-toggles::-webkit-scrollbar{display:none}
.au-text-toggles .au-chip{display:inline-flex;align-items:center;gap:4px}
.au-text-toggles .au-chip svg{width:12px;height:12px}
.au-text-sliders{display:flex;flex-direction:column;gap:2px}
.au-textlayer{position:absolute;inset:0;z-index:3;pointer-events:none}
.au-textnode{
  position:absolute;left:0;top:0;pointer-events:auto;touch-action:none;
  white-space:pre-wrap;max-width:70%;padding:2px 8px;border-radius:8px;
  will-change:transform;
  transition:border-color .15s ease;
  border:1px solid transparent;
}
.au-textnode.is-selected{border-color:rgba(243,199,123,.75)}
.au-textnode.is-outline{text-shadow:-1.5px 0 0 rgba(0,0,0,.9),1.5px 0 0 rgba(0,0,0,.9),0 -1.5px 0 rgba(0,0,0,.9),0 1.5px 0 rgba(0,0,0,.9),-1px -1px 0 rgba(0,0,0,.9),1px -1px 0 rgba(0,0,0,.9),-1px 1px 0 rgba(0,0,0,.9),1px 1px 0 rgba(0,0,0,.9)}
.au-textnode.is-shadow{text-shadow:0 2px 8px rgba(0,0,0,.6)}

.au-avatar{position:fixed;inset:0;z-index:70;display:grid;place-items:center;background:rgba(8,8,10,.6);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}
.au-collapsible{margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.07)}
.au-collapsible__head{width:100%;display:flex;align-items:center;gap:8px;text-align:left;padding:4px 2px;color:inherit}
.au-collapsible__body[hidden]{display:none!important}
.au-chev{margin-left:auto;color:var(--au-muted);font-size:12px;flex:0 0 auto}
.au-tune{margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.07)}
.au-tune__head{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.au-tune__title{color:#f0ead8;font-size:11px;font-weight:700;letter-spacing:.3px;text-transform:uppercase}
.au-tune__hint{color:var(--au-muted);font-size:10px;flex:1 1 auto}
.au-tune__reset{height:24px;padding:0 9px;border-radius:999px;font-size:10px;font-weight:650;color:var(--au-muted)}
.au-tune__row{display:flex;align-items:center;gap:6px;margin-top:6px}
.au-tune__chips{flex:1 1 auto;min-width:0}
.au-tune__slider{margin-top:2px}
.au-model-label{color:var(--au-muted);font-size:10px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;margin-top:10px}
.au-model-seg{grid-template-columns:repeat(3,1fr)!important;margin-top:4px;margin-bottom:0}
.au-model-btn{height:auto!important;min-height:44px;padding:7px 6px!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:2px}
.au-model-btn__name{font-size:11.5px;font-weight:750;color:var(--au-text)}
.au-model-btn__detail{font-size:9px;color:var(--au-muted);line-height:1.25}
.au-model-btn__badge{margin-top:2px;font-size:8px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;color:#2a1c06;background:#f3c77b;border-radius:999px;padding:2px 6px}
.au-model-btn[aria-pressed="true"]{background:var(--au-gold-soft)!important}
.au-model-btn[aria-pressed="true"] .au-model-btn__name{color:var(--au-gold)}
.au-model-detail{color:#d8cfb8;font-size:10px;margin-top:4px}
.au-ai-pane__head{display:flex;gap:10px;align-items:flex-start}
.au-ai-pane__icon{width:34px;height:34px;flex:0 0 34px;border-radius:11px;display:grid;place-items:center;color:#2a1c06;background:linear-gradient(180deg,#f9d693,#e2ad52);box-shadow:0 6px 18px rgba(226,173,82,.22)}
.au-ai-pane__icon svg{width:18px;height:18px}
.au-ai-pane__texts{flex:1 1 auto;min-width:0}
.au-maskprev{position:absolute;inset:auto;z-index:4;display:none;border-radius:0;box-shadow:none;touch-action:none;cursor:crosshair}
.au-peekprev{position:absolute;inset:auto;z-index:5;display:none;pointer-events:none;border-radius:0;box-shadow:none}
.au-top__ai.is-on{background:linear-gradient(180deg,#f9d693,#e2ad52);color:#2a1c06;border-color:rgba(255,235,190,.65)}
.au-top__ai.is-on svg{color:#2a1c06}
.au-mask-tools{margin-top:10px;padding:10px;border-radius:14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09)}
.au-mask-tools__label{font-size:11px;font-weight:750;color:#f0ead8}
.au-mask-seg{grid-template-columns:repeat(3,1fr)!important;margin-top:6px}
.au-mask-quickrow{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.au-mask-btn{display:flex;align-items:center;justify-content:center;gap:6px;height:34px;border-radius:9px;color:var(--au-muted);font-size:11px;font-weight:700}
.au-mask-btn svg{width:14px;height:14px;flex:0 0 14px}
.au-mask-btn[aria-pressed="true"]{background:var(--au-gold-soft);color:var(--au-gold)}
.au-mask-tools .au-chip{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 12px;vertical-align:middle}
.au-mask-tools .au-chip svg{width:14px;height:14px;flex:0 0 auto;display:block}
.au-mask-tools .au-chip span{line-height:1;white-space:nowrap}
.au-mask-quickrow .au-chip{margin:0}
.au-mask-tools .au-chip[aria-pressed="true"]{background:rgba(243,199,123,.16);border-color:rgba(243,199,123,.4);color:var(--au-gold)}
.au-filter.is-active{color:var(--au-gold)}
.au-filter--saved.is-active canvas{border-color:var(--au-gold)!important;box-shadow:0 0 0 1px rgba(243,199,123,.5),0 8px 22px rgba(226,173,82,.22)!important}
.au-mask-hint{color:var(--au-muted);font-size:10px;line-height:1.4;margin:6px 0}
.au-hair-row{display:flex;gap:7px;margin-top:7px;padding:2px 0;overflow-x:auto;scrollbar-width:none}
.au-hair-row::-webkit-scrollbar{display:none}
.au-hair-swatch{flex:0 0 auto;width:30px;height:30px;border-radius:50%;border:2px solid rgba(255,255,255,.25);box-shadow:0 3px 10px rgba(0,0,0,.4)}
.au-hair-swatch.is-active{border-color:var(--au-gold);box-shadow:0 0 0 2px rgba(243,199,123,.45),0 3px 10px rgba(0,0,0,.4)}
.au-mask-actions{display:grid;grid-template-columns:1fr 1.4fr;gap:6px;margin-top:6px}
.au-mask-apply{height:38px;border-radius:11px;font-size:12px}
.au-tab svg.wand{stroke-width:1.9}
.au-ai-pane__title{font-size:13px;font-weight:700;color:#f0ead8}
.au-text-sub{display:flex;align-items:center;gap:6px;color:var(--au-muted);font-size:10px;margin:2px 2px 0}
.au-text-dot{opacity:.6}
.au-quick-styles{margin-top:8px}
.au-quick-label{color:#d2cfd9;font-size:10px;font-weight:700;letter-spacing:.4px;text-transform:uppercase}
.au-quick-row{display:flex;gap:6px;overflow-x:auto;padding:6px 0 2px;scrollbar-width:none}
.au-quick-row::-webkit-scrollbar{display:none}
.au-quick-chip{flex:0 0 auto;height:36px;padding:0 14px;border-radius:11px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.09);color:#e8e4db;font-size:12px;font-weight:650}
.au-quick-chip[aria-pressed="true"]{background:rgba(243,199,123,.16);border-color:rgba(243,199,123,.45);color:var(--au-gold)}
.au-quick-chip--icon{display:inline-flex;align-items:center;gap:6px}
.au-quick-chip--icon svg{width:14px;height:14px}
.au-quick-chip--icon.is-active{background:linear-gradient(180deg,#f9d693,#e2ad52);color:#2a1c06;border-color:rgba(255,235,190,.6)}
.au-root.au-text-placing .au-canvas{cursor:copy}
.au-text-arrange{display:flex;align-items:center;gap:8px;margin-top:4px}
.au-align-seg{grid-template-columns:repeat(3,1fr)!important;flex:1 1 auto;margin:0}
.au-textnode .au-text-hud{position:absolute;inset:-6px;border:1px dashed rgba(243,199,123,.7);border-radius:10px;pointer-events:none;opacity:0}
.au-textnode.show-frame .au-text-hud{opacity:.55}
.au-textnode.is-selected .au-text-hud{opacity:1}
.au-textnode.is-selected .au-text-hud::before,.au-textnode.is-selected .au-text-hud::after{content:"";position:absolute;width:10px;height:10px;border-radius:50%;background:#f3c77b;border:1.5px solid rgba(0,0,0,.6)}
.au-textnode.is-selected .au-text-hud::before{left:-4px;top:-4px}
.au-textnode.is-selected .au-text-hud::after{right:-4px;bottom:-4px}
.au-text-handle{position:absolute;width:28px;height:28px;border-radius:50%;background:#f3c77b;border:2px solid rgba(0,0,0,.6);box-shadow:0 3px 10px rgba(0,0,0,.5);display:none;place-items:center;cursor:nwse-resize;touch-action:none;z-index:3}
.au-textnode.is-selected .au-text-handle{display:block}
.au-text-handle--scale{right:-14px;bottom:-14px}
.au-text-handle--rotate{left:50%;top:-42px;transform:translateX(-50%);cursor:grab}
.au-text-handle-stem{position:absolute;left:50%;top:-28px;width:2px;height:14px;background:rgba(243,199,123,.9);transform:translateX(-50%);display:none}
.au-textnode.is-selected .au-text-handle-stem{display:block}
.au-text-inline{width:100%;min-width:140px;margin-top:4px;padding:8px 10px;border-radius:10px;border:1px solid rgba(243,199,123,.7);background:rgba(20,20,24,.96);color:#f4f2ec;font:13px/1.4 system-ui;outline:none;resize:none;pointer-events:auto}
.au-text-tap-hint{color:var(--au-muted);font-size:10.5px}
.au-ai-pane__sub{color:var(--au-muted);font-size:10.5px;margin-top:2px;line-height:1.4}
.au-ai-pane__list{display:flex;flex-direction:column;gap:6px;margin-top:8px}
.au-ai-pane__list--row{flex-direction:row;align-items:stretch}
.au-ai-pane__list--row .au-param-sep{flex:0 0 auto;align-self:stretch;justify-content:center}
.au-ai-pane__list--row{flex-direction:row;overflow-x:auto;scroll-snap-type:x proximity;padding:2px 0 4px;scrollbar-width:none;gap:8px}
.au-ai-pane__list--row::-webkit-scrollbar{display:none}
.au-ai-pill{flex:0 0 auto;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-width:68px;min-height:52px;padding:7px 8px;border-radius:13px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.09);scroll-snap-align:start;transition:transform .12s ease,border-color .15s ease,background .15s ease}
.au-ai-pill svg{width:17px;height:17px;flex:0 0 17px;color:#d8d5df}
.au-ai-pill span{font-size:10px;font-weight:650;color:#e8e4db;white-space:nowrap}
.au-ai-pill:active{transform:scale(.96)}
.au-ai-pill.is-primary{border-color:rgba(243,199,123,.4);background:rgba(243,199,123,.09)}
.au-ai-pill.is-primary svg{color:var(--au-gold)}
.au-ai-pill.is-primary span{color:var(--au-gold)}
.au-ai-pane__note{color:var(--au-muted);font-size:10.5px;line-height:1.4;padding:4px 2px}
.au-bg-panel{z-index:70}

`;var Hi=Pi,ni=!1;function ui(){if(ni||typeof document>"u")return;if(document.querySelector("style[data-aurum],link[data-aurum]")){ni=!0;return}let a=document.createElement("style");a.setAttribute("data-aurum",""),a.textContent=Hi,document.head.appendChild(a),ni=!0}var Ja={close:'<path d="M6 6l12 12M18 6L6 18"/>',undo:'<path d="M9 14 4.5 9.5 9 5"/><path d="M4.5 9.5H14a5.5 5.5 0 0 1 0 11H9.5"/>',redo:'<path d="M15 14l4.5-4.5L15 5"/><path d="M19.5 9.5H10a5.5 5.5 0 0 0 0 11h4.5"/>',crop:'<path d="M6 2.5v14A1.5 1.5 0 0 0 7.5 18h14"/><path d="M2.5 6h14A1.5 1.5 0 0 1 18 7.5v14"/>',perspective:'<path d="M5 5h14l-2.1 14H7.1L5 5Z"/><path d="M9.5 12h5M12 9.5v5"/>',tiltY:'<path d="M12 3.4v17.2"/><path d="m8.2 7.2 3.8-3.8 3.8 3.8"/><path d="m8.2 16.8 3.8 3.8 3.8-3.8"/>',tiltX:'<path d="M3.4 12h17.2"/><path d="m7.2 8.2-3.8 3.8 3.8 3.8"/><path d="m16.8 8.2 3.8 3.8-3.8 3.8"/>',adjust:'<path d="M4 6h7M15 6h5M4 12h3M11 12h9M4 18h9M17 18h3"/><circle cx="13" cy="6" r="1.9"/><circle cx="9" cy="12" r="1.9"/><circle cx="15" cy="18" r="1.9"/>',filter:'<circle cx="9.2" cy="9.2" r="5.7"/><circle cx="14.8" cy="9.2" r="5.7"/><circle cx="12" cy="14.4" r="5.7"/>',rotateLeft:'<path d="M4.2 10.2a8 8 0 1 1 2.2 6.9"/><path d="M4 4.5v6h6"/>',rotateRight:'<path d="M19.8 10.2a8 8 0 1 0-2.2 6.9"/><path d="M20 4.5v6h-6"/>',flipH:'<path d="M12 3v18" stroke-dasharray="2 3"/><path d="M9 6 4 12l5 6V6Z"/><path d="M15 6l5 6-5 6V6Z"/>',flipV:'<path d="M3 12h18" stroke-dasharray="2 3"/><path d="M6 9l6-5 6 5H6Z"/><path d="M6 15l6 5 6-5H6Z"/>',image:'<rect x="3" y="3" width="18" height="18" rx="4.5"/><circle cx="8.6" cy="8.6" r="1.4"/><path d="m21 15-5-5L5 21"/>',download:'<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v2.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V17"/>',save:'<path d="M5 3.5h11l3 3V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 3 19V5a1.5 1.5 0 0 1 1.5-1.5Z"/><path d="M7.5 3.5v6h8v-6"/><path d="M7.5 20.5v-6h9v6"/>',copy:'<rect x="8" y="8" width="12.5" height="12.5" rx="2.4"/><path d="M16 8V5.5A2.5 2.5 0 0 0 13.5 3h-8A2.5 2.5 0 0 0 3 5.5v8A2.5 2.5 0 0 0 5.5 16H8"/>',auto:'<path d="M12 3.2l1.55 4.25L17.8 9l-4.25 1.55L12 14.8l-1.55-4.25L6.2 9l4.25-1.55L12 3.2Z"/><path d="M18.4 14.4l.72 1.98 1.98.72-1.98.72-.72 1.98-.72-1.98-1.98-.72 1.98-.72.72-1.98Z"/><path d="M5.4 14.8l.55 1.5 1.5.55-1.5.55-.55 1.5-.55-1.5-1.5-.55 1.5-.55.55-1.5Z"/>',ai:'<path d="M12 2.8l2.05 5.15L19.2 10l-5.15 2.05L12 17.2l-2.05-5.15L4.8 10l5.15-2.05L12 2.8Z"/><path d="M18.6 15.4v3.2M17 17h3.2"/><path d="M5.4 4.2v2.4M4.2 5.4h2.4"/>',wand:'<path d="M5 19.2 15.4 8.8"/><path d="M14.5 3.5l1.7 1.7M17.2 6.2l1.7 1.7M19 3.5l.9.9M14.5 3.5l.9-.9M19 3.5l.9 1.7M18.5 13.5l1.2 1.2M18.1 10.2l1.9.5M13.2 4.1l.4 2.1M9.8 3.2l.4 2.1M5.5 5.5l1.7 1.7"/>',brush:'<path d="M16.5 3.5l4 4L11 17 6.5 17.8 7 13.2 16.5 3.5Z"/><path d="M6.5 17.8l1.7 1.7"/><path d="M12.5 13.5l-1.5 1.5"/>',eraser:'<path d="M6 13.5 13.5 6l4.5 4.5L12.5 16 6 13.5Z"/><path d="M6 13.5v4.5h3"/>',magic:'<path d="M12 2.8l2.05 5.15L19.2 10l-5.15 2.05L12 17.2l-2.05-5.15L4.8 10l5.15-2.05L12 2.8Z"/><circle cx="12" cy="10" r="2.3"/>',layers:'<path d="M12 3.5 21 8.5l-9 5-9-5 9-5Z"/><path d="M3 12.5l9 5 9-5"/>',contrast:'<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17Z" fill="currentColor" stroke="none"/>',slider:'<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',liquify:'<path d="M3.5 15.8c3.4-7.2 7.9 5.6 11.5-.9 1.4-2.5 3.3-3.1 5.5-1.8"/><path d="M3.5 9.6c3.4-7.2 7.9 5.6 11.5-.9 1.4-2.5 3.3-3.1 5.5-1.8"/>',reset:'<path d="M20 12a8 8 0 1 1-2.35-5.65"/><path d="M20 4.5V10h-5.5"/>',check:'<path d="m5 12 4.5 4.5L19 7"/>',alert:'<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><circle cx="12" cy="16.5" r=".9" fill="currentColor" stroke="none"/>',text:'<path d="M5 6h14M12 6v13.2"/><path d="M9.5 19.2h5"/>',bg:'<path d="M12 12a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"/><path d="M6.5 19.2c.6-2.3 2.8-3.6 5.5-3.6s4.9 1.3 5.5 3.6"/>',bookmark:'<path d="M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v15l-6.5-4.2L5.5 20V5A1.5 1.5 0 0 1 7 3.5Z"/>',trash:'<path d="M4 6.5h16"/><path d="M9 6V4.8A1.3 1.3 0 0 1 10.3 3.5h3.4A1.3 1.3 0 0 1 15 4.8V6"/><path d="M6.5 6.5 7.3 19a1.6 1.6 0 0 0 1.6 1.5h6.2a1.6 1.6 0 0 0 1.6-1.5l.8-12.5"/><path d="M10 10.5v6M14 10.5v6"/>',plus:'<path d="M12 5.5v13M5.5 12h13"/>',duplicate:'<rect x="8.5" y="8.5" width="12" height="12" rx="2.3"/><path d="M15.5 8.5v-3A2.5 2.5 0 0 0 13 3H6a2.5 2.5 0 0 0-2.5 2.5v7A2.5 2.5 0 0 0 6 15h2.5"/>'};function U(a){return`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Ja[a]}</svg>`}var tr={vi:{title:"Chỉnh ảnh",undo:"Hoàn tác",redo:"Làm lại",save:"Lưu",cancel:"Hủy",cancelled:"Đã hủy thay đổi",holdOriginal:"Nguyên bản",emptyTitle:"Chỉnh ảnh của bạn",emptyHint:"Kéo ảnh vào đây hoặc chọn từ thiết bị. Hỗ trợ JPEG, PNG, WebP.",openImage:"Mở ảnh",tabCrop:"Cắt",tabAdjust:"Tinh chỉnh",tabFilter:"Bộ lọc",aspect:"Tỷ lệ khung",ratioLabel:"Tỷ lệ",aspectFree:"Tự do",aspectScreen:"Màn hình",rotateLeft:"Xoay trái",rotateRight:"Xoay phải",flipH:"Lật ngang",flipV:"Lật dọc",rotation:"Góc xoay",reset:"Đặt lại",adjustTitle:"Tinh chỉnh",brightness:"Độ sáng",contrast:"Độ tương phản",saturation:"Độ bão hòa",exposure:"Phơi sáng",warmth:"Độ ấm",vignette:"Mờ góc",highlights:"Vùng sáng",shadows:"Vùng tối",whites:"Điểm trắng",blacks:"Điểm đen",tint:"Sắc thái màu",vibrance:"Độ sống động",gamma:"Gamma",clarity:"Độ rõ nét",sharpen:"Làm nét",denoise:"Khử nhiễu",smoothSkin:"Làm mịn da",blemish:"Xóa mụn / đốm",skinTexture:"Giữ chi tiết da",skinTone:"Tông da",faceSlim:"Thon gọng mặt",jawline:"Hàm",chin:"Cằm",eyeSize:"Mắt",noseSize:"Mũi",mouthSize:"Miệng",liquify:"Bóp méo",liquifyTitle:"Bóp méo vùng ảnh bằng cọ",brushSize:"Cỡ cọ",clearLiquify:"Xóa bóp méo",brightnessShort:"Sáng",contrastShort:"Tương phản",saturationShort:"Bão hòa",exposureShort:"Phơi sáng",warmthShort:"Ấm",vignetteShort:"Mờ góc",highlightsShort:"Vùng sáng",shadowsShort:"Vùng tối",whitesShort:"Trắng",blacksShort:"Đen",tintShort:"Sắc thái",vibranceShort:"Sống động",gammaShort:"Gamma",clarityShort:"Rõ nét",sharpenShort:"Nét",denoiseShort:"Khử nhiễu",smoothSkinShort:"Mịn da",blemishShort:"Xóa mụn",skinTextureShort:"Chi tiết",skinToneShort:"Tông da",faceSlimShort:"Thon mặt",jawlineShort:"Hàm",chinShort:"Cằm",eyeSizeShort:"Mắt",noseSizeShort:"Mũi",mouthSizeShort:"Miệng",groupLight:"Ánh sáng",groupColor:"Màu",groupDetail:"Chi tiết",groupPortrait:"Chân dung",groupShape:"Dáng mặt",groupEffect:"Hiệu ứng",auto:"Tự động",autoTitle:"Tự động tối ưu ảnh",autoRunning:"Đang phân tích…",autoDone:"Đã tối ưu tự động",autoFailed:"Không thể tối ưu tự động",ai:"AI 4×",aiTitle:"Phóng to và làm nét bằng AI (Real-ESRGAN)",aiRunning:"Đang chạy AI…",aiDone:"Đã làm nét bằng AI",aiFailed:"Không thể chạy AI",aiCancelled:"Đã hủy AI",aiCancel:"Hủy AI",aiPreparing:"Đang kiểm tra thiết bị…",aiTiles:"Đang xử lý từng vùng ảnh…",aiCompare:"Giữ để so sánh",aiBefore:"Bản trước AI",aiUndo:"Hoàn tác AI",aiUndoConfirm:"Hoàn tác AI sẽ bỏ các chỉnh sửa sau đó. Tiếp tục?",aiReverted:"Đã hoàn tác AI",filterTitle:"Bộ lọc màu",cropFrame:"Khung cắt",cropKeys:"Dùng phím mũi tên để đổi kích thước, giữ Shift để đổi nhanh.",perspective:"Phối cảnh",tiltVertical:"Trên / dưới",tiltHorizontal:"Trái / phải",perspectiveHint:"Kéo thanh để chỉnh độ nghiêng. Nhấn đúp vào thanh để đặt lại.",resetCrop:"Đặt lại khung cắt",resetRotation:"Đặt lại góc xoay",resetPerspective:"Đặt lại phối cảnh",resetPerspectiveY:"Đặt lại nghiêng trên / dưới",resetPerspectiveX:"Đặt lại nghiêng trái / phải",resetFilter:"Đặt lại bộ lọc",exportTitle:"Lưu ảnh",exportSub:"Kết xuất từ file gốc ở độ phân giải đầy đủ.",format:"Định dạng",quality:"Chất lượng",saveImage:"Lưu ảnh",overwrite:"Lưu đè",saveCopy:"Lưu bản sao",saving:"Đang lưu…",rendering:"Đang kết xuất ảnh…",encoding:"Đang mã hóa ảnh…",uploading:"Đang tải lên…",cancelExport:"Hủy xuất ảnh",exportCancelled:"Đã hủy xuất ảnh",saved:"Đã lưu ảnh",savedCopy:"Đã lưu bản sao",exportFailed:"Không thể xuất ảnh",notImage:"Tệp này không phải là ảnh",tabText:"Chữ",tabAi:"AI",catAll:"Tất cả",catRoot:"Chuẩn",catMeitu:"Meitu",catXingtu:"Xingtu",catLr:"Lightroom",catMono:"Đen trắng",savePreset:"Lưu bộ lọc",presetName:"Tên bộ lọc…",savedPresets:"Đã lưu",defaultFilters:"Mặc định",noSaved:"Chưa có bộ lọc đã lưu. Tuỳ chỉnh màu rồi bấm Lưu.",apply:"Áp dụng",deletePreset:"Xoá",presetSaved:"Đã lưu bộ lọc",presetApplied:"Đã áp dụng bộ lọc",presetDeleted:"Đã xoá bộ lọc",presetExists:"Tên này đã có — chọn tên khác",textTitle:"Thêm chữ lên ảnh",addText:"Thêm chữ",textInput:"Nội dung chữ…",fontSize:"Cỡ chữ",textOpacity:"Độ mờ",textRotate:"Xoay",bold:"Đậm",italic:"Nghiêng",outline:"Viền",shadow:"Bóng đổ",textColor:"Màu chữ",tapTextHint:"Chạm vào chữ trên ảnh để kéo • Kéo 2 tay không có — dùng thanh trượt",deleteText:"Xoá chữ",duplicateText:"Nhân đôi",bgTitle:"AI tách nền",bgSub:"Chạy offline trên máy. Model tải 1 lần (kiểm tra SHA-256), inference không dùng mạng.",bgRemove:"Xoá phông (trong suốt)",bgBlur:"Mờ phông",bgReplace:"Đổi nền trắng",bgPerson:"Tách người (MODNet)",bgRemoveShort:"Xoá phông",bgBlurShort:"Mờ phông",bgReplaceShort:"Nền trắng",bgPersonShort:"Tách người",bgNeedHost:"Bản dựng này chưa bật AI tách nền. Mở demo/ai-panel.html để thử engine offline-first.",bgRunning:"Đang tách nền…",bgDone:"Đã tách nền — cảnh báo: lịch sử chỉnh sửa được đặt lại.",bgFailed:"Chưa tách được nền",tuneTitle:"Tùy chỉnh tone",tuneHint:"Chọn tone, kéo slider để tinh chỉnh rồi Lưu.",collapse:"Thu gọn",expand:"Mở rộng",tuneStrength:"Độ đậm",tuneBright:"Sáng",tuneContrast:"Tương phản",tuneSat:"Bão hòa",tuneWarm:"Ấm",tuneTint:"Sắc thái",tuneVig:"Mờ góc",tuneReset:"Reset tone",modelLabel:"Model",modelFast:"MODNet · Nhanh",modelBalanced:"BiRefNet · Cân bằng",modelQuality:"ISNet · Chất lượng",modelRecommended:"Khuyến nghị",modelDetailFast:"13 MB · Tách người · iPhone siêu nhẹ",modelDetailBalanced:"98 MB · Đa dụng · Chân dung + vật",modelDetailQuality:"88 MB · Tốt nhất · Edge tóc mịn",brushLabel:"Cọ",brushAdd:"Giữ (thêm)",brushErase:"Xoá",brushZoom:"Thu phóng",zoomHint:"Thu phóng: chụm 2 ngón để phóng/xoay, kéo 1 ngón để di, chạm đúp để phóng to.",zoomIn:"Phóng to",zoomOut:"Thu nhỏ",brushSizeMask:"Kích thước cọ",retouchStrength:"Độ trắng",brushUndo:"Hoàn tác nét",brushInvert:"Đảo mask",brushTransparent:"Nền trong suốt",brushApply:"Hoàn tất",brushCancel:"Huỷ",brushHint:"Chạm kéo trên ảnh để chỉnh viền. Thêm = giữ chủ thể, Xoá = bỏ nền.",textPinch:"Chụm 2 ngón để co giãn · Xoay bằng ngón xoay",textDoubleTap:"Chạm đúp vào chữ để sửa",textStyleTitle:"Kiểu chữ",textStyleTitle2:"Chữ đậm",textStyleCaption:"Chú thích",textStyleOutline:"Viền nổi",textQuick:"Mẫu nhanh",textArrange:"Căn chỉnh",textAlignLeft:"Trái",textAlignCenter:"Giữa",textAlignRight:"Phải",textShowFrame:"Khung chữ",retouchTitle:"AI Retouch",retouchWhiten:"Trắng da",retouchSmooth:"Mịn da",retouchBlemish:"Xóa mụn",retouchTone:"Tông da",retouchHair:"Đổi màu tóc",retouchDone:"Đã retouch AI",retouchFailed:"Chưa retouch được",retouchBrushHint:"Cọ để tăng/giảm hiệu ứng: Giữ = thêm, Xoá = hoàn tác.",retouchBrushReady:"AI xong — cọ chỉnh hiệu ứng rồi Hoàn tất",retouchWarm:"Ấm / Lạnh",retouchHue:"Đổi màu"},en:{title:"Edit photo",undo:"Undo",redo:"Redo",save:"Save",cancel:"Cancel",cancelled:"Changes discarded",holdOriginal:"Original",emptyTitle:"Edit your photo",emptyHint:"Drop an image here or choose one from your device. JPEG, PNG and WebP are supported.",openImage:"Open image",tabCrop:"Crop",tabAdjust:"Adjust",tabFilter:"Filters",aspect:"Aspect ratio",ratioLabel:"Ratio",aspectFree:"Free",aspectScreen:"Screen",rotateLeft:"Rotate left",rotateRight:"Rotate right",flipH:"Flip H",flipV:"Flip V",rotation:"Rotation",reset:"Reset",adjustTitle:"Adjust",brightness:"Brightness",contrast:"Contrast",saturation:"Saturation",exposure:"Exposure",warmth:"Warmth",vignette:"Vignette",highlights:"Highlights",shadows:"Shadows",whites:"Whites",blacks:"Blacks",tint:"Tint",vibrance:"Vibrance",gamma:"Gamma",clarity:"Clarity",sharpen:"Sharpen",denoise:"Denoise",smoothSkin:"Skin smoothing",blemish:"Blemish removal",skinTexture:"Skin texture",skinTone:"Skin tone",faceSlim:"Face slim",jawline:"Jawline",chin:"Chin",eyeSize:"Eyes",noseSize:"Nose",mouthSize:"Mouth",liquify:"Liquify",liquifyTitle:"Push pixels with a brush",brushSize:"Brush size",clearLiquify:"Clear liquify",brightnessShort:"Bright",contrastShort:"Contrast",saturationShort:"Color",exposureShort:"Exposure",warmthShort:"Warmth",vignetteShort:"Vignette",highlightsShort:"Highlights",shadowsShort:"Shadows",whitesShort:"Whites",blacksShort:"Blacks",tintShort:"Tint",vibranceShort:"Vibrance",gammaShort:"Gamma",clarityShort:"Clarity",sharpenShort:"Sharpen",denoiseShort:"Denoise",smoothSkinShort:"Smooth skin",blemishShort:"Blemish",skinTextureShort:"Texture",skinToneShort:"Skin tone",faceSlimShort:"Face",jawlineShort:"Jaw",chinShort:"Chin",eyeSizeShort:"Eyes",noseSizeShort:"Nose",mouthSizeShort:"Mouth",groupLight:"Light",groupColor:"Color",groupDetail:"Detail",groupPortrait:"Portrait",groupShape:"Face shape",groupEffect:"Effect",auto:"Auto",autoTitle:"Auto enhance",autoRunning:"Analyzing…",autoDone:"Auto enhance applied",autoFailed:"Could not auto enhance",ai:"AI 4×",aiTitle:"Upscale and sharpen with AI (Real-ESRGAN)",aiRunning:"Running AI…",aiDone:"AI enhancement complete",aiFailed:"AI processing failed",aiCancelled:"AI cancelled",aiCancel:"Cancel AI",aiPreparing:"Checking device…",aiTiles:"Processing image tiles…",aiCompare:"Hold to compare",aiBefore:"Before AI",aiUndo:"Undo AI",aiUndoConfirm:"Undo AI will discard edits made after it. Continue?",aiReverted:"AI reverted",filterTitle:"Color presets",cropFrame:"Crop frame",cropKeys:"Use the arrow keys to resize, hold Shift for larger steps.",perspective:"Perspective",tiltVertical:"Top / bottom",tiltHorizontal:"Left / right",perspectiveHint:"Drag the ruler to adjust the tilt. Double-tap it to reset.",resetCrop:"Reset crop frame",resetRotation:"Reset rotation",resetPerspective:"Reset perspective",resetPerspectiveY:"Reset top / bottom tilt",resetPerspectiveX:"Reset left / right tilt",resetFilter:"Reset filters",exportTitle:"Save image",exportSub:"Rendered from the original file at full resolution.",format:"Format",quality:"Quality",saveImage:"Save image",overwrite:"Overwrite",saveCopy:"Save copy",saving:"Saving…",rendering:"Rendering image…",encoding:"Encoding image…",uploading:"Uploading…",cancelExport:"Cancel export",exportCancelled:"Export cancelled",saved:"Image saved",savedCopy:"Copy saved",exportFailed:"Could not export the image",notImage:"That file is not an image",tabText:"Text",tabAi:"AI",catAll:"All",catRoot:"Basic",catMeitu:"Meitu",catXingtu:"Xingtu",catLr:"Lightroom",catMono:"Mono",savePreset:"Save filter",presetName:"Filter name…",savedPresets:"Saved",defaultFilters:"Default",noSaved:"No saved filters yet. Tune the look, then tap Save.",apply:"Apply",deletePreset:"Delete",presetSaved:"Filter saved",presetApplied:"Filter applied",presetDeleted:"Filter deleted",presetExists:"That name exists — pick another",textTitle:"Add text to photo",addText:"Add text",textInput:"Text content…",fontSize:"Size",textOpacity:"Opacity",textRotate:"Rotate",bold:"Bold",italic:"Italic",outline:"Outline",shadow:"Shadow",textColor:"Text color",tapTextHint:"Drag the text on the photo • Use sliders to size/rotate",deleteText:"Delete text",duplicateText:"Duplicate",bgTitle:"AI background",bgSub:"Runs offline on-device. Model downloads once (SHA-256 checked); inference never uses the network.",bgRemove:"Remove background (transparent)",bgBlur:"Blur background",bgReplace:"White background",bgPerson:"Person matte (MODNet)",bgRemoveShort:"Remove",bgBlurShort:"Blur",bgReplaceShort:"White bg",bgPersonShort:"Person",bgNeedHost:"This build has no AI background action. Open demo/ai-panel.html to try the offline engine.",bgRunning:"Removing background…",bgDone:"Background removed — note: edit history is reset.",bgFailed:"Could not remove background",tuneTitle:"Tone tune",tuneHint:"Pick a tone, drag sliders to refine, then Save.",collapse:"Collapse",expand:"Expand",tuneStrength:"Strength",tuneBright:"Brightness",tuneContrast:"Contrast",tuneSat:"Saturation",tuneWarm:"Warmth",tuneTint:"Tint",tuneVig:"Vignette",tuneReset:"Reset tune",modelLabel:"Model",modelFast:"MODNet · Fast",modelBalanced:"BiRefNet · Balanced",modelQuality:"ISNet · Quality",modelRecommended:"Recommended",modelDetailFast:"13 MB · Portrait · iPhone light",modelDetailBalanced:"98 MB · General · Portrait + object",modelDetailQuality:"88 MB · Best · Fine hair edge",brushLabel:"Brush",brushAdd:"Keep (add)",brushErase:"Erase",brushZoom:"Zoom",zoomHint:"Zoom: pinch to zoom/rotate, drag to pan, double-tap to zoom in.",zoomIn:"Zoom in",zoomOut:"Zoom out",brushSizeMask:"Brush size",retouchStrength:"Whiten strength",brushUndo:"Undo stroke",brushInvert:"Invert mask",brushTransparent:"Transparent",brushApply:"Done",brushCancel:"Cancel",brushHint:"Drag on the photo to fix edges. Keep = foreground, Erase = background.",textPinch:"Pinch to resize · Twist to rotate",textDoubleTap:"Double-tap text to edit",textStyleTitle:"Title",textStyleTitle2:"Bold title",textStyleCaption:"Caption",textStyleOutline:"Outline",textQuick:"Quick styles",textArrange:"Align",textAlignLeft:"Left",textAlignCenter:"Center",textAlignRight:"Right",textShowFrame:"Frame",retouchTitle:"AI Retouch",retouchWhiten:"Whiten",retouchSmooth:"Smooth",retouchBlemish:"Blemish",retouchTone:"Tone",retouchHair:"Hair color",retouchDone:"AI retouch done",retouchFailed:"Could not retouch",retouchBrushHint:"Brush to add/remove the effect: Keep = add, Erase = undo.",retouchBrushReady:"AI done — brush the effect, then Done",retouchWarm:"Warm / Cool",retouchHue:"Hue shift"}},li=[{id:"black",name:"Đen",nameEn:"Black",hue:0,sat:0,bright:.72,css:"#1c1a18"},{id:"brown",name:"Nâu",nameEn:"Brown",hue:25,sat:.62,bright:1,css:"#5a3a22"},{id:"blonde",name:"Vàng",nameEn:"Blonde",hue:45,sat:.82,bright:1.25,css:"#c9a04a"},{id:"red",name:"Đỏ",nameEn:"Red",hue:358,sat:.72,bright:1,css:"#7a2e1f"},{id:"purple",name:"Tím",nameEn:"Purple",hue:278,sat:.68,bright:.95,css:"#5a2e6a"},{id:"blue",name:"Xanh",nameEn:"Blue",hue:205,sat:.7,bright:.95,css:"#2e4a6a"},{id:"ash",name:"Khói",nameEn:"Ash",hue:35,sat:.28,bright:1.3,css:"#b8b0a8"}],Ui=[{id:"adjust",icon:"adjust",label:"tabAdjust"},{id:"filter",icon:"filter",label:"tabFilter"},{id:"text",icon:"text",label:"tabText"},{id:"ai",icon:"wand",label:"tabAi"},{id:"crop",icon:"crop",label:"tabCrop"}],er=[{id:"free",label:"free"},{id:"1:1",label:"1:1"},{id:"4:3",label:"4:3"},{id:"3:4",label:"3:4"},{id:"16:9",label:"16:9"},{id:"9:16",label:"9:16"},{id:"screen",label:"screen"}],ir={brightness:"brightnessShort",contrast:"contrastShort",saturation:"saturationShort",exposure:"exposureShort",warmth:"warmthShort",vignette:"vignetteShort",highlights:"highlightsShort",shadows:"shadowsShort",whites:"whitesShort",blacks:"blacksShort",tint:"tintShort",vibrance:"vibranceShort",gamma:"gammaShort",clarity:"clarityShort",sharpen:"sharpenShort",denoise:"denoiseShort",smoothSkin:"smoothSkinShort",blemish:"blemishShort",skinTexture:"skinTextureShort",skinTone:"skinToneShort",faceSlim:"faceSlimShort",jawline:"jawlineShort",chin:"chinShort",eyeSize:"eyeSizeShort",noseSize:"noseSizeShort",mouthSize:"mouthSizeShort"},ar=[{id:"light",label:"groupLight",keys:["brightness","exposure","contrast","highlights","shadows","whites","blacks"]},{id:"color",label:"groupColor",keys:["saturation","vibrance","warmth","tint","gamma"]},{id:"detail",label:"groupDetail",keys:["clarity","sharpen","denoise"]},{id:"portrait",label:"groupPortrait",keys:["smoothSkin","skinTexture","blemish","skinTone"]},{id:"shape",label:"groupShape",keys:["faceSlim","jawline","chin","eyeSize","noseSize","mouthSize"]},{id:"effect",label:"groupEffect",keys:["vignette"]}],Ut=[{type:"image/jpeg",label:"JPEG"},{type:"image/webp",label:"WebP"},{type:"image/png",label:"PNG"}],rr=0,Zt=[{id:"sys",label:"San",stack:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"},{id:"serif",label:"Serif",stack:"Georgia,'Times New Roman',serif"},{id:"mono",label:"Mono",stack:"'SF Mono',Menlo,Consolas,monospace"},{id:"round",label:"Rounded",stack:"'Arial Rounded MT Bold','Helvetica Neue',sans-serif"},{id:"heavy",label:"Heavy",stack:"'Arial Black',Impact,sans-serif"},{id:"title",label:"Title",stack:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"},{id:"caption",label:"Caption",stack:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"}];function qi(){return{id:`t${Date.now().toString(36)}${Math.floor(Math.random()*1e4).toString(36)}`,text:"",x:.5,y:.5,size:.07,color:"#ffffff",bold:!1,italic:!1,outline:!1,shadow:!0,align:"center",rotation:0,opacity:1,font:"sys"}}function sr(a,i){i==="title"?(a.font="sys",a.bold=!0,a.size=.11,a.outline=!1,a.shadow=!0,a.color="#ffffff"):i==="bold"?(a.font="heavy",a.bold=!0,a.size=.09,a.outline=!1,a.shadow=!1):i==="caption"?(a.font="sys",a.bold=!1,a.italic=!1,a.size=.045,a.outline=!1,a.shadow=!1):i==="outline"&&(a.font="heavy",a.bold=!0,a.size=.09,a.outline=!0,a.shadow=!1,a.color="#ffffff")}var Xi="aurum:user-presets:v1";function or(){try{let a=localStorage.getItem(Xi);if(!a)return[];let i=JSON.parse(a);return Array.isArray(i)?i.filter(t=>!!t&&typeof t=="object"&&typeof t.name=="string"):[]}catch{return[]}}function Fi(a){try{localStorage.setItem(Xi,JSON.stringify(a))}catch{}}function nt(a){return a<0?0:a>1?1:a}function Ni(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function b(a,i){let t=document.createElement(a);return i&&(t.className=i),t}function W(a,i){let t=a.querySelector(i);if(!t)throw new Error(`Aurum: missing UI node ${i}`);return t}function _t(a,i,t){let e=b("button","au-icon au-glass");return e.type="button",e.title=i,e.setAttribute("aria-label",i),e.innerHTML=U(a),e.addEventListener("click",t),e}function nr(a,i){let t=URL.createObjectURL(a),e=b("a");e.href=t,e.download=i,document.body.appendChild(e),e.click(),e.remove(),window.setTimeout(()=>URL.revokeObjectURL(t),4e3)}function ur(a,i){let t=i||"";if(!t&&typeof a=="string")try{let e=new URL(a,location.href);t=decodeURIComponent(e.pathname.split("/").pop()||"")}catch{t=""}return!t&&a instanceof File&&(t=a.name),t=t.replace(/\.[a-z0-9]{1,5}$/i,"").replace(/[\\/:*?"<>|]+/g,"").trim(),t.slice(0,64)||"aurum"}function wt(a){return a>0?`+${a}`:String(a)}var Qt=class extends At{constructor(t){let e=typeof t.container=="string"?document.querySelector(t.container):t.container;if(!e)throw new Error(`Aurum: container "${String(t.container)}" was not found`);t.injectStyles!==!1&&ui();let r=b("div","au-root");r.tabIndex=-1;let s=b("div","au-work");r.appendChild(s),e.appendChild(r);let{image:o,locale:n,title:u,fileName:l,theme:c,onSave:h,onSaveCopy:p,onClose:v,autoDownload:f,startTab:m,exportTypes:g,aiAction:x,backgroundAction:_,retouchAction:y,...w}=t;super({...w,container:s,background:w.background??"transparent"});d(this,"root");d(this,"work");d(this,"frameEl");d(this,"sheetWrap");d(this,"toastEl");d(this,"undoBtn");d(this,"redoBtn");d(this,"saveBtn");d(this,"ratioBtn");d(this,"rotationBtn");d(this,"perspectiveYBtn");d(this,"perspectiveXBtn");d(this,"ratioValue");d(this,"rotationValue");d(this,"perspectiveYValue");d(this,"perspectiveXValue");d(this,"ratioContext");d(this,"rotationContext");d(this,"perspectiveYContext");d(this,"perspectiveXContext");d(this,"perspectiveYControl");d(this,"perspectiveXControl");d(this,"modesWrap");d(this,"modesTrack");d(this,"chipsEl");d(this,"scrimEl");d(this,"cropResetBtn");d(this,"adjustValue");d(this,"autoBtn");d(this,"autoLabel");d(this,"aiAction");d(this,"aiBtn",null);d(this,"aiPanel");d(this,"aiDetail");d(this,"aiBar");d(this,"aiBusy",!1);d(this,"aiAbort",null);d(this,"aiCompareBar",null);d(this,"aiCompareHold",null);d(this,"aiCompareOn",!1);d(this,"peekBtn",null);d(this,"peekCanvas",null);d(this,"peekOn",!1);d(this,"peekSavedState",null);d(this,"paramsEl");d(this,"filterWrap");d(this,"filterCats");d(this,"filterCat","all");d(this,"filterHint");d(this,"savedWrap");d(this,"filterNameInput");d(this,"filterSaveBtn");d(this,"savedList");d(this,"userPresets",or());d(this,"savedFilterButtons",new Map);d(this,"activeSavedId",null);d(this,"savedReturnState",null);d(this,"filterTuneKey","brightness");d(this,"filterTuneTicks");d(this,"filterTuneValue");d(this,"filterTuneButtons",new Map);d(this,"filterTuneWrap");d(this,"backgroundAction");d(this,"retouchAction");d(this,"bgBusy",!1);d(this,"bgAbort",null);d(this,"bgDetail");d(this,"bgPanel");d(this,"bgModelLabelEl");d(this,"bgModelSegEl");d(this,"bgListEl");d(this,"retouchListEl");d(this,"retouchLabelEl");d(this,"bgModel",(()=>{try{let t=localStorage.getItem("aurum:ai-model");return t==="isnet-fp16"||t==="birefnet-lite-512-fp16"||t==="modnet-fp16"?t:"isnet-fp16"}catch{return"isnet-fp16"}})());d(this,"bgModelButtons",new Map);d(this,"bgModelDetail");d(this,"refineCanvas");d(this,"refineOn",!1);d(this,"refineSource",null);d(this,"refineWidth",0);d(this,"refineHeight",0);d(this,"refineMaskWidth",0);d(this,"refineMaskHeight",0);d(this,"refineMask",null);d(this,"refineOriginalMask",null);d(this,"refineMode","remove");d(this,"refineBaseMode","remove");d(this,"refineModelId","");d(this,"savedTransform",null);d(this,"refineKind","bg");d(this,"retouchEffect","whiten");d(this,"refineWhitened",null);d(this,"refineWhitenedW",0);d(this,"refineWhitenedH",0);d(this,"whitenStrength",.6);d(this,"toneWarm",30);d(this,"hairHue",0);d(this,"hairColorId","brown");d(this,"brushMode","add");d(this,"brushZoom",!1);d(this,"brushSize",7);d(this,"brushRingEl",null);d(this,"brushPointer",null);d(this,"brushPreview",!1);d(this,"zoomBtn",null);d(this,"zoomInBtn",null);d(this,"zoomOutBtn",null);d(this,"addBtn",null);d(this,"eraseBtn",null);d(this,"refineHistory",[]);d(this,"refineStroke",null);d(this,"maskToolbar");d(this,"maskBrushTicks");d(this,"whitenStrengthTicks",null);d(this,"whitenStrengthRow",null);d(this,"auxTicks",null);d(this,"auxRow",null);d(this,"hairRow",null);d(this,"hairSwatches",[]);d(this,"maskTransparentBtn",null);d(this,"maskInvertBtn",null);d(this,"maskHintEl",null);d(this,"maskToolLabelEl",null);d(this,"textLayer");d(this,"texts",[]);d(this,"selectedTextId",null);d(this,"textPlacing",!1);d(this,"textPlaceBtn");d(this,"textShowFrame",(()=>{try{return localStorage.getItem("aurum:text-frame")!=="0"}catch{return!0}})());d(this,"textInput");d(this,"textSizeTicks");d(this,"textOpacityTicks");d(this,"textRotateTicks");d(this,"textControls");d(this,"qualityRow");d(this,"progressEl");d(this,"progressBar");d(this,"progressText");d(this,"progressLabel");d(this,"progressCancel");d(this,"exportAbort",null);d(this,"saveLabel");d(this,"saveImageBtn");d(this,"saveCopyBtn",null);d(this,"saveCopyLabel",null);d(this,"metaName");d(this,"metaInfo");d(this,"exportSubEl");d(this,"s");d(this,"locale");d(this,"fileBase");d(this,"customTitle");d(this,"onSaveCb");d(this,"onSaveCopyCb");d(this,"onCloseCb");d(this,"autoDownload");d(this,"quality",92);d(this,"exportType","image/jpeg");d(this,"exportTypes",Ut.map(t=>t.type));d(this,"currentTab","adjust");d(this,"cropMode","ratio");d(this,"lastAspect",null);d(this,"adjustKey","brightness");d(this,"liquifyOn",!1);d(this,"liquifySize",5);d(this,"liquifyGesture",0);d(this,"liquifyButton",null);d(this,"adjustContext",null);d(this,"liquifyContext",null);d(this,"liquifyTicks",null);d(this,"liquifyValue",null);d(this,"liquifyRing",null);d(this,"liquifyStroke",null);d(this,"saving",!1);d(this,"autoBusy",!1);d(this,"uiDestroyed",!1);d(this,"dragDepth",0);d(this,"toastTimer",0);d(this,"ratioTimer",0);d(this,"cropKeyTimer",0);d(this,"cropDrag",null);d(this,"frameBox",{x:NaN,y:NaN,w:NaN,h:NaN});d(this,"uid",`au${++rr}`);d(this,"tabButtons",new Map);d(this,"panes",new Map);d(this,"aspectButtons",new Map);d(this,"flipButtons",new Map);d(this,"adjustButtons",new Map);d(this,"filterButtons",new Map);d(this,"formatButtons",new Map);d(this,"rotationControl");d(this,"adjustTicks");d(this,"qualityControl");d(this,"fileInput");d(this,"tapToPlaceText",t=>{if(this.currentTab!=="text"||!this.isReady||t.target?.closest(".au-textnode, .au-ticks, .au-tabs, .au-deck"))return;if(!this.textPlacing){this.selectedTextId=null;for(let c of Array.from(this.textLayer.querySelectorAll(".au-textnode"))){let h=this.texts.find(p=>p.id===c.dataset.textId);h&&this.syncTextLayerStyle(c,h)}return}let r=this.displayCropRect();if(!r)return;let s=this.stage.getBoundingClientRect(),o=(t.clientX-s.left-r.x)/r.width,n=(t.clientY-s.top-r.y)/r.height;if(o<.05||o>.95||n<.05||n>.95)return;t.preventDefault();let u=qi();u.x=nt(o),u.y=nt(n),u.text="",this.texts.push(u),this.selectedTextId=u.id;let l=this.createTextNode(u);this.textLayer.appendChild(l),this.syncTextControls(u),this.positionTexts(),this.openInlineTextEditor(l,u),this.textPlacing=!1,this.textPlaceBtn?.setAttribute("aria-pressed","false"),this.textPlaceBtn?.classList.remove("is-active"),this.root.classList.remove("au-text-placing")});d(this,"onLiquifyPointerDown",t=>{if(!this.liquifyOn||!this.isReady||t.pointerType==="mouse"&&t.button!==0)return;let e=this.sourcePointAt(t.clientX,t.clientY);if(e){t.preventDefault(),t.stopPropagation();try{this.stage.setPointerCapture(t.pointerId)}catch{}this.liquifyStroke={pointerId:t.pointerId,key:`liquify:${++this.liquifyGesture}`,x:t.clientX,y:t.clientY,u:e.x,v:e.y},this.previewLiquifyRing(t.clientX,t.clientY)}});d(this,"onLiquifyPointerMove",t=>{if(!this.liquifyOn)return;this.previewLiquifyRing(t.clientX,t.clientY);let e=this.liquifyStroke;if(!e||e.pointerId!==t.pointerId)return;t.preventDefault(),t.stopPropagation();let r=Math.max(1.5,this.liquifyScreenRadius()*.35),s=Math.hypot(t.clientX-e.x,t.clientY-e.y);if(s<r)return;let o=(t.clientX-e.x)/s,n=(t.clientY-e.y)/s,u=Math.min(48,Math.floor(s/r));for(;u>0;){u-=1,e.x+=o*r,e.y+=n*r,s-=r;let l=this.sourcePointAt(e.x,e.y);if(!l)continue;let c=l.x-e.u,h=l.y-e.v;Math.abs(c)+Math.abs(h)>1e-5&&this.addLiquifyDab({x:e.u,y:e.v,dx:c,dy:h,radius:this.liquifyRadius()},e.key),e.u=l.x,e.v=l.y}});d(this,"onLiquifyPointerUp",t=>{if(!(!this.liquifyStroke||this.liquifyStroke.pointerId!==t.pointerId)){this.liquifyStroke=null;try{this.stage.releasePointerCapture(t.pointerId)}catch{}}});d(this,"onCropKeyDown",t=>{if(!this.isReady)return;let e=t.key==="ArrowRight"||t.key==="ArrowDown",r=t.key==="ArrowLeft"||t.key==="ArrowUp";if(!e&&!r)return;t.preventDefault();let s=this.currentFrame();if(s.width<2||s.height<2)return;let o=t.shiftKey?24:8,n=this.getState(),u=n.crop.aspect!=="free"&&n.crop.aspect!=="screen",l=`crop-key:${Date.now()}`;if(u){let c=1+(e?1:-1)*o*2/Math.max(1,s.width);this.setCrop({scale:S(n.crop.scale*c,.2,1)},l)}else{let c=t.key==="ArrowRight"?o:t.key==="ArrowLeft"?-o:0,h=t.key==="ArrowDown"?o:t.key==="ArrowUp"?-o:0,p=Math.max(24,s.width+c*2),v=Math.max(24,s.height+h*2),f=S(p/v,.2,8),m=ne(this.viewport(),f),g=S(p/Math.max(1,m.width),.2,1);this.setCrop({aspect:"free",ratio:f,scale:g},l)}this.markCropKeying(),this.positionFrame(this.currentFrame())});d(this,"onCropPointerDown",t=>{let r=t.target?.closest("[data-crop-handle]");if(!r||!this.frameEl.contains(r)||t.pointerType==="mouse"&&t.button!==0||!this.isReady||this.cropDrag)return;t.preventDefault(),t.stopPropagation();let s=this.currentFrame();if(s.width<2||s.height<2)return;let o=this.getState(),n=this.viewport(),u=t.pointerId,l=h=>{h.pointerId===u&&this.dragCrop(h)},c=h=>{h.pointerId===u&&this.endCropDrag()};this.cropDrag={pointerId:u,handle:r.dataset.cropHandle||"",startX:t.clientX,startY:t.clientY,frame:s,viewport:n,aspect:o.crop.aspect,startScale:o.crop.scale,startRatio:s.width/Math.max(1,s.height),key:`crop-drag:${Date.now()}`,handleEl:r,move:l,end:c},this.frameEl.classList.add("is-locked"),r.classList.add("is-dragging");try{r.setPointerCapture(u)}catch{}r.addEventListener("pointermove",l),r.addEventListener("pointerup",c),r.addEventListener("pointercancel",c),this.cropKeyTimer&&(window.clearTimeout(this.cropKeyTimer),this.cropKeyTimer=0),this.frameEl.classList.add("is-dragging"),this.root.classList.add("au-cropping")});if(this.root=r,this.work=s,this.locale=n==="en"?"en":"vi",this.s=tr[this.locale],this.fileBase=ur(o,l),this.customTitle=u,this.onSaveCb=h,this.onSaveCopyCb=p,this.onCloseCb=v,this.autoDownload=f!==!1,this.aiAction=x,this.backgroundAction=_,this.retouchAction=y,g&&g.length&&(this.exportTypes=g.filter((T,k)=>Ut.some(E=>E.type===T)&&g.indexOf(T)===k),this.exportTypes.length||(this.exportTypes=Ut.map(T=>T.type)),this.exportType=this.exportTypes[0]),c)for(let[T,k]of Object.entries(c))r.style.setProperty(T.startsWith("--")?T:`--au-${T}`,k);this.buildChrome(),this.syncUI(),this.setCropMode("ratio"),this.setTab(m||"adjust"),o&&this.openSource(o)}showTab(t){this.setTab(t)}openExport(){this.openSheet()}undo(){let t=this.canRevertAI(),e=super.undo();return e&&t&&!this.canRevertAI()&&(this.setAICompareVisible(!1),this.toast(this.s.aiReverted)),e}destroy(){this.uiDestroyed||(this.uiDestroyed=!0,this.setLiquify(!1),this.toastTimer&&window.clearTimeout(this.toastTimer),this.clearTransient(),this.cropDrag&&this.endCropDrag(),super.destroy(),this.root.remove())}buildChrome(){this.buildOverlay(),this.buildTextLayer(),this.buildEmpty(),this.buildLoading(),this.buildHeader(),this.buildDock(),this.buildSheet(),this.buildAI(),this.buildBG(),this.buildToast(),this.buildLiquifyOverlay(),this.bindEvents()}buildOverlay(){let t=b("div","au-overlay"),e=b("div","au-scrim");e.setAttribute("aria-hidden","true");let r=b("div","au-frame");r.setAttribute("role","group"),r.tabIndex=0,r.setAttribute("aria-label",`${this.s.cropFrame}. ${this.s.cropKeys}`);for(let s of["33.333%","66.666%"]){let o=b("span","au-grid v");o.style.left=s,o.setAttribute("aria-hidden","true"),r.appendChild(o);let n=b("span","au-grid h");n.style.top=s,n.setAttribute("aria-hidden","true"),r.appendChild(n)}for(let s of["tl","tr","br","bl"]){let o=b("span",`au-corner ${s}`);o.dataset.cropHandle=s,o.setAttribute("aria-hidden","true"),r.appendChild(o)}for(let s of["n","e","s","w"]){let o=b("span",`au-edge ${s}`);o.dataset.cropHandle=s,o.setAttribute("aria-hidden","true"),r.appendChild(o)}t.appendChild(e),t.appendChild(r),this.work.appendChild(t),this.frameEl=r,this.scrimEl=e}buildEmpty(){let t=b("div","au-empty");t.innerHTML=`<div class="au-empty__icon">${U("image")}</div><h3></h3><p></p><button class="au-ghost" type="button"></button>`,W(t,"h3").textContent=this.s.emptyTitle,W(t,"p").textContent=this.s.emptyHint;let e=W(t,"button");e.textContent=this.s.openImage,e.addEventListener("click",()=>this.fileInput?.click());let r=document.createElement("input");r.type="file",r.accept="image/*",r.hidden=!0,r.addEventListener("change",()=>{let s=r.files?.[0];r.value="",s&&this.openSource(s)}),this.fileInput=r,t.appendChild(r),this.work.appendChild(t),this.work.addEventListener("dragenter",s=>{s.preventDefault(),this.dragDepth+=1,this.root.classList.add("au-dragover")}),this.work.addEventListener("dragover",s=>{s.preventDefault(),s.dataTransfer&&(s.dataTransfer.dropEffect="copy")}),this.work.addEventListener("dragleave",()=>{this.dragDepth=Math.max(0,this.dragDepth-1),this.dragDepth||this.root.classList.remove("au-dragover")}),this.work.addEventListener("drop",s=>{s.preventDefault(),this.dragDepth=0,this.root.classList.remove("au-dragover");let o=s.dataTransfer?.files?.[0];if(o){if(!o.type.startsWith("image/")){this.toast(this.s.notImage,!0);return}this.openSource(o)}})}buildLoading(){let t=b("div","au-loading");t.innerHTML='<div class="au-spinner"></div>',this.work.appendChild(t)}buildHeader(){let t=b("header","au-top");t.setAttribute("aria-label",this.customTitle||this.s.title);let e=b("div","au-top__row au-top__row--primary"),r=b("button","au-top__cancel au-glass");r.type="button",r.textContent=this.s.cancel,r.addEventListener("click",()=>this.cancel()),this.saveBtn=b("button","au-top__save au-glass au-glass--gold"),this.saveBtn.type="button",this.saveBtn.innerHTML=`${U("save")}<span></span>`;let s=this.saveBtn.querySelector("span");s&&(s.textContent=this.s.save),this.saveBtn.disabled=!0,this.saveBtn.addEventListener("click",()=>this.openSheet()),e.append(r,this.saveBtn);let o=b("div","au-top__row au-top__row--tools"),n=b("div","au-top__group");this.undoBtn=_t("undo",this.s.undo,()=>this.undo()),this.redoBtn=_t("redo",this.s.redo,()=>this.redo()),this.undoBtn.disabled=!0,this.redoBtn.disabled=!0,n.append(this.undoBtn,this.redoBtn);let u=b("div","au-top__group"),l=_t("rotateLeft",this.s.rotateLeft,()=>this.rotateBy(-90)),c=_t("rotateRight",this.s.rotateRight,()=>this.rotateBy(90)),h=_t("flipH",this.s.flipH,()=>this.flip("h")),p=_t("flipV",this.s.flipV,()=>this.flip("v"));if(this.flipButtons.set("flipH",h),this.flipButtons.set("flipV",p),u.append(l,c,h,p),o.append(n,u),this.aiAction){let _=b("div","au-top__group"),y=b("button","au-top__ai au-glass");y.type="button",y.title=this.aiAction.title,y.setAttribute("aria-label",this.aiAction.title),y.innerHTML=`${U("ai")}<span></span>`;let w=y.querySelector("span");w&&(w.textContent=this.aiAction.label),y.addEventListener("click",()=>{this.runAIAction()}),this.aiBtn=y,_.appendChild(y),o.appendChild(_)}let v=b("div","au-top__group"),f=b("button","au-top__ai au-glass au-peek");f.type="button",f.title=this.s.holdOriginal,f.setAttribute("aria-label",this.s.holdOriginal),f.setAttribute("aria-pressed","false"),f.innerHTML=`${U("layers")}<span></span>`;let m=f.querySelector("span");m&&(m.textContent=this.s.holdOriginal);let g=_=>this.setPeekOriginal(_),x=()=>g(!1);f.addEventListener("pointerdown",_=>{if(_.button===0){try{f.setPointerCapture(_.pointerId)}catch{}g(!0),_.preventDefault()}}),f.addEventListener("pointerup",x),f.addEventListener("pointercancel",x),f.addEventListener("keydown",_=>{_.key!==" "&&_.key!=="Enter"||(_.preventDefault(),_.repeat||g(!0))}),f.addEventListener("keyup",_=>{(_.key===" "||_.key==="Enter")&&g(!1)}),f.addEventListener("contextmenu",_=>_.preventDefault()),this.peekBtn=f,v.appendChild(f),o.appendChild(v),t.append(e,o),this.root.insertBefore(t,this.work)}buildDock(){let t=b("div","au-dock"),e=b("div","au-deck"),r=b("div","au-tabs");r.setAttribute("role","tablist"),r.setAttribute("aria-label",this.s.title);for(let o of Ui){let n=`${this.uid}-pane-${o.id}`,u=`${this.uid}-tab-${o.id}`,l=b("button","au-tab");l.type="button",l.id=u,l.setAttribute("role","tab"),l.setAttribute("aria-selected","false"),l.setAttribute("aria-controls",n),l.innerHTML=U(o.icon);let c=b("span");c.textContent=this.s[o.label],l.appendChild(c),l.addEventListener("click",()=>this.setTab(o.id)),this.tabButtons.set(o.id,l),r.appendChild(l);let h=b("section","au-pane");h.id=n,h.setAttribute("role","tabpanel"),h.setAttribute("aria-labelledby",u),o.id==="crop"&&this.buildCropPane(h),o.id==="adjust"&&this.buildAdjustPane(h),o.id==="filter"&&this.buildFilterPane(h),o.id==="text"&&this.buildTextPane(h),o.id==="ai"&&this.buildAIPane(h),this.panes.set(o.id,h),e.appendChild(h)}r.addEventListener("keydown",o=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(o.key))return;o.preventDefault();let u=Ui.map(h=>h.id),l=Math.max(0,u.indexOf(this.currentTab)),c=o.key==="Home"?u[0]:o.key==="End"?u[u.length-1]:u[(l+(o.key==="ArrowRight"?1:-1)+u.length)%u.length];this.setTab(c),this.tabButtons.get(c)?.focus()});let s=this.buildAICompare();t.append(e,...s?[s]:[],r),this.root.appendChild(t)}buildAICompare(){if(!this.aiAction)return null;let t=b("div","au-aicmp au-glass");t.hidden=!0;let e=b("button","au-aicmp__hold");e.type="button",e.textContent=this.s.aiCompare,e.setAttribute("aria-pressed","false");let r=b("button","au-aicmp__undo");r.type="button",r.textContent=this.s.aiUndo;let s=n=>{this.aiCompareOn!==n&&(this.aiCompareOn=n,this.setCompareAI(n),e.classList.toggle("is-on",n),e.setAttribute("aria-pressed",String(n)),e.textContent=n?this.s.aiBefore:this.s.aiCompare)},o=()=>s(!1);return e.addEventListener("pointerdown",n=>{if(n.button===0){try{e.setPointerCapture(n.pointerId)}catch{}s(!0),n.preventDefault()}}),e.addEventListener("pointerup",o),e.addEventListener("pointercancel",o),e.addEventListener("keydown",n=>{n.key!==" "&&n.key!=="Enter"||(n.preventDefault(),s(!0))}),e.addEventListener("keyup",n=>{(n.key===" "||n.key==="Enter")&&s(!1)}),e.addEventListener("contextmenu",n=>n.preventDefault()),r.addEventListener("click",()=>{this.history.canUndo&&!window.confirm(this.s.aiUndoConfirm)||this.revertAI()&&(this.setAICompareVisible(!1),this.toast(this.s.aiReverted))}),t.append(e,r),this.aiCompareBar=t,this.aiCompareHold=e,t}setAICompareVisible(t){this.aiCompareBar&&(!t&&this.aiCompareOn&&(this.aiCompareOn=!1,this.setCompareAI(!1),this.aiCompareHold&&(this.aiCompareHold.textContent=this.s.aiCompare,this.aiCompareHold.classList.remove("is-on"),this.aiCompareHold.setAttribute("aria-pressed","false"))),this.aiCompareBar.hidden=!t)}buildCropPane(t){let e=b("div","au-deck__row au-deck__row--top");this.ratioBtn=b("button","au-mode au-glass"),this.ratioBtn.type="button",this.ratioBtn.innerHTML=`${U("crop")}<span class="au-mode__value"></span>`,this.ratioValue=W(this.ratioBtn,".au-mode__value"),this.ratioBtn.setAttribute("aria-pressed","true"),this.ratioBtn.addEventListener("click",()=>this.setCropMode("ratio")),this.rotationBtn=b("button","au-mode au-glass"),this.rotationBtn.type="button",this.rotationBtn.innerHTML=`${U("rotateRight")}<span class="au-mode__value"></span>`,this.rotationValue=W(this.rotationBtn,".au-mode__value"),this.rotationBtn.setAttribute("aria-pressed","false"),this.rotationBtn.addEventListener("click",()=>this.setCropMode("rotation")),this.perspectiveYBtn=b("button","au-mode au-mode--persp au-glass"),this.perspectiveYBtn.type="button",this.perspectiveYBtn.innerHTML=`${U("tiltY")}<span class="au-mode__value"></span>`,this.perspectiveYBtn.title=`${this.s.tiltVertical} · ${this.s.perspectiveHint}`,this.perspectiveYValue=W(this.perspectiveYBtn,".au-mode__value"),this.perspectiveYBtn.setAttribute("aria-pressed","false"),this.perspectiveYBtn.addEventListener("click",()=>this.setCropMode("perspectiveY")),this.perspectiveXBtn=b("button","au-mode au-mode--persp au-glass"),this.perspectiveXBtn.type="button",this.perspectiveXBtn.innerHTML=`${U("tiltX")}<span class="au-mode__value"></span>`,this.perspectiveXBtn.title=`${this.s.tiltHorizontal} · ${this.s.perspectiveHint}`,this.perspectiveXValue=W(this.perspectiveXBtn,".au-mode__value"),this.perspectiveXBtn.setAttribute("aria-pressed","false"),this.perspectiveXBtn.addEventListener("click",()=>this.setCropMode("perspectiveX")),this.modesWrap=b("div","au-modes"),this.modesTrack=b("div","au-modes__track"),this.modesTrack.append(this.ratioBtn,this.rotationBtn,this.perspectiveYBtn,this.perspectiveXBtn),this.modesWrap.appendChild(this.modesTrack);let r=_t("reset",this.s.resetCrop,()=>this.resetCropMode());r.classList.add("au-reset"),this.cropResetBtn=r,e.append(this.modesWrap,r),t.appendChild(e);let s=b("div","au-deck__row au-deck__row--context");this.ratioContext=b("div","au-context is-active"),this.ratioContext.dataset.context="ratio";let o=b("div","au-chipsrail"),n=b("div","au-chips");n.setAttribute("role","group"),n.setAttribute("aria-label",this.s.aspect);for(let u of er){let l=b("button","au-chip");l.type="button",l.textContent=this.aspectLabel(u.id),l.setAttribute("aria-pressed","false"),l.addEventListener("click",()=>this.chooseAspect(u.id)),this.aspectButtons.set(u.id,l),n.appendChild(l)}o.appendChild(n),this.chipsEl=n,this.ratioContext.appendChild(o),this.rotationContext=b("div","au-context"),this.rotationContext.dataset.context="rotation",this.rotationControl=this.makeTicks({label:this.s.rotation,min:-180,max:180,step:1,tickStep:3,defaultValue:0,zero:!0,head:!1,ruler:!0,format:u=>`${Math.round(u)}°`,onInput:u=>this.setRotation(u),onDragStart:()=>this.beginRotationDrag(),onDragEnd:()=>this.endRotationDrag()}),this.rotationContext.appendChild(this.rotationControl.row),this.perspectiveYContext=b("div","au-context"),this.perspectiveYContext.dataset.context="perspectiveY",this.perspectiveYControl=this.makeTicks({label:this.s.tiltVertical,min:-100,max:100,step:1,tickStep:2,defaultValue:0,zero:!0,head:!1,ruler:!0,format:u=>wt(Math.round(u)),onInput:u=>this.setPerspective({perspectiveY:u})}),this.perspectiveYControl.rail.addEventListener("dblclick",()=>{this.setPerspective({perspectiveY:0},"perspective")}),this.perspectiveYContext.appendChild(this.perspectiveYControl.row),this.perspectiveXContext=b("div","au-context"),this.perspectiveXContext.dataset.context="perspectiveX",this.perspectiveXControl=this.makeTicks({label:this.s.tiltHorizontal,min:-100,max:100,step:1,tickStep:2,defaultValue:0,zero:!0,head:!1,ruler:!0,format:u=>wt(Math.round(u)),onInput:u=>this.setPerspective({perspectiveX:u})}),this.perspectiveXControl.rail.addEventListener("dblclick",()=>{this.setPerspective({perspectiveX:0},"perspective")}),this.perspectiveXContext.appendChild(this.perspectiveXControl.row),s.append(this.ratioContext,this.rotationContext,this.perspectiveYContext,this.perspectiveXContext),t.appendChild(s)}buildAdjustPane(t){let e=b("div","au-deck__row au-deck__row--top au-deck__row--adjust");this.autoBtn=b("button","au-auto au-glass au-glass--gold"),this.autoBtn.type="button",this.autoBtn.title=this.s.autoTitle,this.autoBtn.setAttribute("aria-label",this.s.autoTitle),this.autoBtn.innerHTML=`${U("auto")}<span data-auto-label></span>`,this.autoLabel=W(this.autoBtn,"[data-auto-label]"),this.autoLabel.textContent=this.s.auto,this.autoBtn.addEventListener("click",()=>{this.runAuto()});let r=b("div","au-params");this.paramsEl=r,r.setAttribute("role","group"),r.setAttribute("aria-label",this.s.adjustTitle);for(let u of ar){let l=b("span","au-param-sep");l.dataset.group=u.id;let c=b("b");c.textContent=this.s[u.label],l.appendChild(c),r.appendChild(l);for(let h of u.keys){let p=b("button","au-param");p.type="button",p.dataset.adjust=h,p.textContent=this.s[ir[h]],p.setAttribute("aria-pressed","false"),p.addEventListener("click",()=>this.selectAdjust(h)),this.adjustButtons.set(h,p),r.appendChild(p)}if(u.id==="shape"){let h=b("button","au-param au-param--liquify");h.type="button",h.title=this.s.liquifyTitle,h.setAttribute("aria-label",this.s.liquifyTitle),h.setAttribute("aria-pressed","false"),h.innerHTML=`${U("liquify")}<span>${this.s.liquify}</span>`,h.addEventListener("click",()=>this.setLiquify(!this.liquifyOn)),this.liquifyButton=h,r.appendChild(h)}}this.adjustValue=b("button","au-value au-glass au-glass--gold"),this.adjustValue.type="button",this.adjustValue.addEventListener("click",()=>this.resetAdjust(this.adjustKey)),e.append(this.autoBtn,r,this.adjustValue),t.appendChild(e);let s=b("div","au-deck__row au-deck__row--context");this.adjustContext=s,this.adjustTicks=this.makeTicks({label:this.s[this.adjustKey],min:-100,max:100,step:1,tickStep:2,defaultValue:0,zero:!0,head:!1,ruler:!0,format:u=>this.formatAdjust(u),onInput:u=>this.setAdjust(this.adjustKey,u)}),s.appendChild(this.adjustTicks.row),t.appendChild(s);let o=b("div","au-deck__row au-deck__row--context au-liquify-row");o.style.display="none",this.liquifyContext=o,this.liquifyTicks=this.makeTicks({label:this.s.brushSize,min:1,max:20,step:1,tickStep:1,defaultValue:this.liquifySize,head:!1,ruler:!1,format:u=>`${Math.round(u)}%`,onInput:u=>this.setLiquifySize(u,!1),onReset:()=>this.setLiquifySize(5)}),this.liquifyValue=b("button","au-value au-glass au-glass--gold"),this.liquifyValue.type="button",this.liquifyValue.textContent=`${this.liquifySize}%`,this.liquifyValue.title=`${this.s.reset}: ${this.s.brushSize}`,this.liquifyValue.setAttribute("aria-label",`${this.s.reset}: ${this.s.brushSize}`),this.liquifyValue.addEventListener("click",()=>this.setLiquifySize(5));let n=_t("reset",this.s.clearLiquify,()=>this.clearLiquifyDabs());n.classList.add("au-reset"),o.append(this.liquifyTicks.row,this.liquifyValue,n),t.appendChild(o),this.selectAdjust(this.adjustKey)}buildFilterPane(t){let e=b("div","au-chips au-filter-cats");e.setAttribute("role","group"),e.setAttribute("aria-label",this.s.filterTitle);let r=[{id:"all",label:"catAll"},{id:"root",label:"catRoot"},{id:"meitu",label:"catMeitu"},{id:"xingtu",label:"catXingtu"},{id:"lr",label:"catLr"},{id:"mono",label:"catMono"}];for(let L of r){let R=b("button","au-chip");R.type="button",R.textContent=this.s[L.label],R.setAttribute("aria-pressed",String(this.filterCat===L.id)),R.addEventListener("click",()=>{this.filterCat=L.id;for(let C of Array.from(e.children))C.setAttribute("aria-pressed",String(C===R));this.buildFilters()}),e.appendChild(R)}this.filterCats=e,t.appendChild(e);let s=b("div","au-tone-hint");s.setAttribute("aria-live","polite"),this.filterHint=s,t.appendChild(s);let o=b("div","au-deck__row au-deck__row--context au-deck__row--filters");this.filterWrap=b("div","au-filters"),this.filterWrap.setAttribute("role","group"),this.filterWrap.setAttribute("aria-label",this.s.filterTitle),o.appendChild(this.filterWrap),t.appendChild(o);let n=b("div","au-tune au-collapsible");n.setAttribute("aria-label",this.s.tuneTitle);let u=b("button","au-tune__head au-collapsible__head");u.type="button",u.setAttribute("aria-expanded","false");let l=b("span","au-tune__title");l.textContent=this.s.tuneTitle;let c=b("span","au-tune__hint");c.textContent=this.s.tuneHint;let h=b("div","au-collapsible__body");h.hidden=!0;let p=b("span","au-chev");p.textContent="▾",u.append(l,c,p);let v=b("button","au-chip au-tune__reset");v.type="button",v.textContent=this.s.tuneReset,v.addEventListener("click",L=>{L.stopPropagation();for(let R of["brightness","contrast","saturation","warmth","tint","vignette","vibrance"])this.setAdjust(R,0);this.syncTuneUI()});let f=b("div","au-tune__row"),m=b("div","au-params au-tune__chips"),g=["brightness","contrast","saturation","warmth","tint","vibrance","vignette"],x={brightness:"brightnessShort",contrast:"contrastShort",saturation:"saturationShort",warmth:"warmthShort",tint:"tintShort",vibrance:"vibranceShort",vignette:"vignetteShort"};for(let L of g){let R=b("button","au-param");R.type="button",R.dataset.tune=L;let C=this.s[x[L]];R.textContent=C??L,R.setAttribute("aria-pressed",String(L===this.filterTuneKey)),R.addEventListener("click",()=>this.selectFilterTune(L)),this.filterTuneButtons.set(L,R),m.appendChild(R)}this.filterTuneValue=b("button","au-value au-glass au-glass--gold"),this.filterTuneValue.type="button",this.filterTuneValue.setAttribute("aria-label",this.s.tuneTitle),this.filterTuneValue.addEventListener("click",()=>{this.resetAdjust(this.filterTuneKey),this.syncTuneUI()}),f.append(m,this.filterTuneValue);let _=b("div","au-tune__slider");this.filterTuneTicks=this.makeTicks({label:this.s.tuneTitle,min:-100,max:100,step:1,tickStep:2,defaultValue:0,zero:!0,head:!1,ruler:!0,format:L=>this.formatTune(L),onInput:L=>{this.filterTuneKey==="vignette"?this.setAdjust("vignette",S(L,0,100)):this.setAdjust(this.filterTuneKey,L),this.syncTuneUI()}}),_.appendChild(this.filterTuneTicks.row);let y=b("div","au-saved__head au-saved__head--inline"),w=b("span","au-saved__title");w.textContent=this.s.savedPresets;let T=document.createElement("input");T.className="au-saved__input",T.type="text",T.maxLength=32,T.spellcheck=!1,T.autocomplete="off",T.setAttribute("aria-label",this.s.presetName),T.placeholder=this.s.presetName;let k=b("button","au-save-preset au-glass au-glass--gold");k.type="button",k.innerHTML=`${U("bookmark")}<span>${this.s.savePreset}</span>`,k.setAttribute("aria-label",this.s.savePreset),k.addEventListener("click",()=>this.saveCurrentPreset(T)),T.addEventListener("keydown",L=>{L.key==="Enter"&&this.saveCurrentPreset(T)}),y.append(w,T,k);let E=b("div","au-saved__list");E.style.display="none",this.savedList=E,this.savedWrap=E,this.filterNameInput=T,this.filterSaveBtn=k,h.append(y,E,v,f,_),u.addEventListener("click",L=>{if(L.target.closest(".au-tune__reset"))return;let R=h.hidden;h.hidden=!R,u.setAttribute("aria-expanded",String(R)),p.textContent=R?"▴":"▾",n.classList.toggle("is-open",R),R&&window.requestAnimationFrame(()=>this.selectFilterTune(this.filterTuneKey))}),this.filterTuneWrap=n,n.append(u,h),t.appendChild(n),this.selectFilterTune(this.filterTuneKey)}selectFilterTune(t){this.filterTuneKey=t;for(let[u,l]of this.filterTuneButtons)l.setAttribute("aria-pressed",String(u===t));let[e,r]=it[t];this.filterTuneTicks.setRange(e,r,1,2,e<0),this.filterTuneTicks.setLabel(`${this.s.tuneTitle} · ${t}`);let s=this.isReady?this.getState():null,o=s?Math.round(s.adjust[t]):0;this.filterTuneTicks.set(o,!1),this.syncTuneUI();let n=this.filterTuneButtons.get(t);n&&window.requestAnimationFrame(()=>{let u=n.parentElement;if(!u)return;let l=n.getBoundingClientRect(),c=u.getBoundingClientRect();if(!l.width||!c.width)return;let h=l.left-c.left-(c.width-l.width)/2;Math.abs(h)>1&&u.scrollBy({left:h,behavior:"smooth"})})}formatTune(t){let[e]=it[this.filterTuneKey];return e>=0?String(Math.round(t)):wt(Math.round(t))}syncTuneUI(){if(!this.isReady||!this.filterTuneTicks)return;let t=this.getState(),e=document.activeElement,r=Math.round(t.adjust[this.filterTuneKey]);e!==this.filterTuneTicks.rail&&this.filterTuneTicks.set(r,!1),this.filterTuneValue&&(this.filterTuneValue.textContent=this.formatTune(r))}buildTextPane(t){let e=document.createElement("textarea");e.className="au-text-input",e.style.display="none",e.rows=1,e.maxLength=120,e.spellcheck=!1,e.setAttribute("aria-label",this.s.textInput),e.placeholder=this.s.textInput,e.addEventListener("input",()=>{let y=this.selectedLayer();y&&(y.text=e.value,this.positionTexts(),this.syncTextLayerEl(y))}),this.textInput=e,t.appendChild(e);let r=b("div","au-quick-styles"),s=b("div","au-quick-row"),o=b("button","au-quick-chip au-quick-chip--icon");o.type="button",o.innerHTML=`${U("plus")}<span>${this.locale==="vi"?"Chạm đặt":"Place"}</span>`,o.setAttribute("aria-pressed","false"),o.title=this.locale==="vi"?"Bật chế độ: chạm vào ảnh để đặt chữ":"Toggle: tap photo to place text",o.addEventListener("click",()=>{this.textPlacing=!this.textPlacing,o.setAttribute("aria-pressed",String(this.textPlacing)),o.classList.toggle("is-active",this.textPlacing),this.root.classList.toggle("au-text-placing",this.textPlacing),this.toast(this.textPlacing?this.locale==="vi"?"Chạm vào ảnh để đặt chữ mới":"Tap photo to place text":this.locale==="vi"?"Tắt chế độ đặt chữ":"Place mode off",!1)}),this.textPlaceBtn=o,s.appendChild(o);let n=[{id:"title",label:this.s.textStyleTitle},{id:"bold",label:this.s.textStyleTitle2},{id:"caption",label:this.s.textStyleCaption},{id:"outline",label:this.s.textStyleOutline}];for(let y of n){let w=b("button","au-quick-chip");w.type="button",w.textContent=y.label,w.dataset.style=y.id,w.setAttribute("aria-pressed","false"),w.addEventListener("click",()=>{let T=this.selectedLayer();if(T){sr(T,y.id);for(let k of Array.from(s.children))k.setAttribute("aria-pressed",String(k===w));this.syncTextControls(T),this.syncTextLayerEl(T),this.positionTexts()}}),s.appendChild(w)}r.appendChild(s),t.appendChild(r);let u=b("div","au-text-meta"),l=b("div","au-seg au-text-fonts");l.setAttribute("role","group"),l.setAttribute("aria-label",this.s.textStyleTitle);for(let y of Zt.slice(0,5)){let w=b("button","au-font-btn");w.type="button",w.textContent=y.label,w.style.fontFamily=y.stack,w.dataset.font=y.id,w.setAttribute("aria-pressed",String(y.id==="sys")),w.addEventListener("click",()=>{let T=this.selectedLayer();if(T){T.font=y.id;for(let k of Array.from(l.children))k.setAttribute("aria-pressed",String(k===w));this.syncTextLayerEl(T)}}),l.appendChild(w)}let c=b("label","au-text-color"),h=b("span","au-text-colordot");h.style.background="#ffffff";let p=document.createElement("input");p.type="color",p.value="#ffffff",p.setAttribute("aria-label",this.s.textColor),p.addEventListener("input",()=>{let y=this.selectedLayer();y&&(y.color=p.value,h.style.background=p.value,this.syncTextLayerEl(y))});let v=b("span");v.textContent=this.s.textColor,c.append(h,p,v),u.append(l,c),t.appendChild(u);let f=b("div","au-text-toggles"),m=(y,w,T)=>{let k=b("button","au-chip");return k.type="button",k.textContent=y,k.setAttribute("aria-pressed",String(w())),k.addEventListener("click",()=>{T(!w()),k.setAttribute("aria-pressed",String(w()));let E=this.selectedLayer();E&&this.syncTextLayerEl(E)}),f.appendChild(k),k};m(this.s.bold,()=>this.selectedLayer()?.bold??!1,y=>{let w=this.selectedLayer();w&&(w.bold=y)}),m(this.s.italic,()=>this.selectedLayer()?.italic??!1,y=>{let w=this.selectedLayer();w&&(w.italic=y)}),m(this.s.outline,()=>this.selectedLayer()?.outline??!1,y=>{let w=this.selectedLayer();w&&(w.outline=y)}),m(this.s.shadow,()=>this.selectedLayer()?.shadow??!0,y=>{let w=this.selectedLayer();w&&(w.shadow=y)}),m(this.s.textShowFrame,()=>this.textShowFrame,y=>{this.textShowFrame=y;try{localStorage.setItem("aurum:text-frame",y?"1":"0")}catch{}let w=this.selectedLayer();w&&this.syncTextLayerEl(w);for(let T of Array.from(this.textLayer.querySelectorAll(".au-textnode"))){let k=this.texts.find(E=>E.id===T.dataset.textId);k&&this.syncTextLayerStyle(T,k)}});let g=b("button","au-chip");g.type="button",g.innerHTML=`${U("duplicate")}<span>${this.s.duplicateText}</span>`,g.addEventListener("click",()=>this.duplicateSelectedText());let x=b("button","au-chip au-chip--danger");x.type="button",x.innerHTML=`${U("trash")}<span>${this.s.deleteText}</span>`,x.addEventListener("click",()=>this.deleteSelectedText()),f.append(g,x),t.appendChild(f);let _=b("div","au-text-sliders");this.textOpacityTicks=this.makeTicks({label:this.s.textOpacity,min:10,max:100,step:1,tickStep:2,defaultValue:100,ruler:!0,format:y=>`${y}%`,onInput:y=>{let w=this.selectedLayer();w&&(w.opacity=y/100,this.syncTextLayerEl(w))}}),this.textSizeTicks=this.makeTicks({label:this.s.fontSize,min:2,max:24,step:1,tickStep:2,defaultValue:7,format:y=>`${y}%`,onInput:()=>{}}),this.textRotateTicks=this.makeTicks({label:this.s.textRotate,min:-180,max:180,step:1,tickStep:10,defaultValue:0,zero:!0,ruler:!0,format:y=>`${Math.round(y)}°`,onInput:()=>{}}),_.append(this.textOpacityTicks.row),this.textControls=_,t.appendChild(_)}buildAIPane(t){let e=b("div","au-collapsible au-model-coll"),r=b("button","au-collapsible__head au-model-head");r.type="button",r.setAttribute("aria-expanded","false");let s=b("span","au-model-label");s.textContent=this.s.modelLabel,this.bgModelLabelEl=s;let o=b("span","au-chev");o.textContent="▾",r.append(s,o);let n=b("div","au-collapsible__body");n.hidden=!0;let u=b("div","au-seg au-model-seg");this.bgModelSegEl=u,u.setAttribute("role","group");let l=[{id:"isnet-fp16",label:"modelQuality",detail:"modelDetailQuality",recommended:!0},{id:"birefnet-lite-512-fp16",label:"modelBalanced",detail:"modelDetailBalanced"},{id:"modnet-fp16",label:"modelFast",detail:"modelDetailFast"}];for(let A of l){let D=b("button","au-model-btn");D.type="button",D.dataset.model=A.id,D.setAttribute("aria-pressed",String(this.bgModel===A.id));let X=b("span","au-model-btn__name");X.textContent=this.s[A.label];let Z=b("span","au-model-btn__detail");if(Z.textContent=this.s[A.detail],D.append(X,Z),A.recommended){let M=b("span","au-model-btn__badge");M.textContent=this.s.modelRecommended||"Khuyến nghị",D.appendChild(M)}D.addEventListener("click",()=>{this.bgModel=A.id;try{localStorage.setItem("aurum:ai-model",A.id)}catch{}for(let M of Array.from(u.children))M.setAttribute("aria-pressed",String(M===D));if(this.bgModelDetail){let M=l.find(P=>P.id===A.id);M&&(this.bgModelDetail.textContent=`${this.s[M.label]} · ${this.s[M.detail]}`)}}),this.bgModelButtons.set(A.id,D),u.appendChild(D)}n.append(u),this.bgModelDetail=b("div","au-model-detail");let c=l.find(A=>A.id===this.bgModel)??l[0];this.bgModelDetail.textContent=`${this.s[c.label]} · ${this.s[c.detail]}`,n.append(this.bgModelDetail),r.addEventListener("click",()=>{let A=n.hidden;n.hidden=!A,r.setAttribute("aria-expanded",String(A)),o.textContent=A?"▴":"▾",e.classList.toggle("is-open",A)}),e.append(r,n),t.appendChild(e);let h=b("div","au-ai-pane__list au-ai-pane__list--row");this.bgListEl=h;let p=(A,D,X,Z=!1)=>{let M=b("button",`au-ai-pill ${Z?"is-primary":""}`);M.type="button",M.innerHTML=`${U(X)}<span>${Ni(D)}</span>`,M.setAttribute("aria-label",D),M.addEventListener("click",()=>{this.runBackground(A)}),h.appendChild(M)};p("remove",this.s.bgRemoveShort,"eraser",!0),p("person",this.s.bgPersonShort,"bg"),p("blur",this.s.bgBlurShort,"filter"),p("replace",this.s.bgReplaceShort,"image");let v=b("span","au-param-sep");v.dataset.group="retouch";let f=b("b");f.textContent=this.s.retouchTitle,v.appendChild(f),h.appendChild(v);let m=(A,D,X,Z=!1)=>{let M=b("button",`au-ai-pill ${Z?"is-primary":""}`);M.type="button",M.innerHTML=`${U(X)}<span>${Ni(D)}</span>`,M.setAttribute("aria-label",D),M.addEventListener("click",()=>{this.runRetouch(A)}),h.appendChild(M)};if(m("whiten",this.s.retouchWhiten,"wand",!0),m("smooth",this.s.retouchSmooth,"filter"),m("blemish",this.s.retouchBlemish,"brush"),m("tone",this.s.retouchTone,"contrast"),m("hair",this.s.retouchHair,"layers"),this.retouchListEl=h,this.retouchLabelEl=v,!this.backgroundAction){let A=b("div","au-ai-pane__note");A.textContent=this.s.bgNeedHost,h.appendChild(A)}t.appendChild(h);let g=b("div","au-mask-tools");g.style.display="none";let x=b("div","au-mask-tools__label");x.textContent=this.s.brushLabel,this.maskToolLabelEl=x;let _=b("div","au-seg au-mask-seg");_.setAttribute("role","group");let y=b("button","au-mask-btn");y.type="button",y.innerHTML=`${U("brush")}<span>${this.s.brushAdd}</span>`,y.setAttribute("aria-pressed","true");let w=b("button","au-mask-btn");w.type="button",w.innerHTML=`${U("eraser")}<span>${this.s.brushErase}</span>`,w.setAttribute("aria-pressed","false");let T=b("button","au-mask-btn");T.type="button",T.innerHTML=`${U("image")}<span>${this.s.brushZoom}</span>`,T.setAttribute("aria-pressed","false"),T.setAttribute("aria-label",this.s.brushZoom),this.addBtn=y,this.eraseBtn=w,this.zoomBtn=T;let k=()=>{y.setAttribute("aria-pressed",String(!this.brushZoom&&this.brushMode==="add")),w.setAttribute("aria-pressed",String(!this.brushZoom&&this.brushMode==="erase")),T.setAttribute("aria-pressed",String(this.brushZoom)),this.refineCanvas&&(this.refineCanvas.style.pointerEvents=this.brushZoom?"none":"auto");try{this.gesture.setEnabled(this.brushZoom)}catch{}this.brushZoom&&this.hideBrushRing(),this.updateBrushRing()};y.addEventListener("click",()=>{this.setBrushZoom(!1),this.brushMode="add",k()}),w.addEventListener("click",()=>{this.setBrushZoom(!1),this.brushMode="erase",k()}),T.addEventListener("click",()=>{this.setBrushZoom(!this.brushZoom),k()}),_.append(y,w,T);let E=b("div","au-mask-quickrow"),L=b("button","au-chip");L.type="button",L.innerHTML=`${U("image")}<span>${this.s.zoomOut}</span>`,L.setAttribute("aria-label",this.s.zoomOut),L.style.display="none",L.addEventListener("click",()=>this.stepZoom(1/1.5));let R=b("button","au-chip");R.type="button",R.innerHTML=`${U("image")}<span>${this.s.zoomIn}</span>`,R.setAttribute("aria-label",this.s.zoomIn),R.style.display="none",R.addEventListener("click",()=>this.stepZoom(1.5)),this.zoomOutBtn=L,this.zoomInBtn=R;let C=b("button","au-chip");C.type="button",C.innerHTML=`${U("undo")}<span>${this.s.brushUndo}</span>`,C.addEventListener("click",()=>this.refineUndo());let z=b("button","au-chip");z.type="button",z.innerHTML=`${U("contrast")}<span>${this.s.brushInvert}</span>`,z.setAttribute("aria-label",this.s.brushInvert),z.title=this.s.brushInvert,z.addEventListener("click",()=>this.refineInvert());let I=b("button","au-chip");I.type="button",I.innerHTML=`${U("layers")}<span>${this.s.brushTransparent}</span>`,I.setAttribute("aria-pressed","false"),I.setAttribute("aria-label",this.s.brushTransparent),I.title=this.s.brushTransparent,I.addEventListener("click",()=>this.refineToggleTransparent()),this.maskTransparentBtn=I,this.maskInvertBtn=z,E.append(L,R,C,z,I);let $=b("div","au-mask-hint");$.textContent=this.s.brushHint,this.maskHintEl=$,this.maskBrushTicks=this.makeTicks({label:this.s.brushSizeMask,min:1,max:50,step:1,tickStep:1,defaultValue:this.brushSize,format:A=>`${Math.round(A)}px`,onInput:A=>{this.brushSize=Math.round(A),this.showCenterBrushRing()}}),this.whitenStrengthTicks=this.makeTicks({label:this.s.retouchStrength,min:0,max:100,step:1,tickStep:5,defaultValue:Math.round(this.whitenStrength*100),format:A=>`${Math.round(A)}%`,onInput:A=>{this.whitenStrength=Math.min(1,Math.max(0,A/100)),this.drawRefinePreview()}}),this.whitenStrengthRow=this.whitenStrengthTicks.row,this.whitenStrengthRow.style.display="none",this.auxTicks=this.makeTicks({label:this.s.retouchWarm,min:-100,max:100,step:1,tickStep:10,defaultValue:this.toneWarm,format:A=>`${Math.round(A)}`,onInput:A=>{this.retouchEffect==="hair"?this.hairHue=Math.round(A):this.toneWarm=Math.round(A),this.drawRefinePreview()}}),this.auxRow=this.auxTicks.row,this.auxRow.style.display="none";let V=b("div","au-hair-row");V.style.display="none",this.hairSwatches=[];for(let A of li){let D=b("button","au-hair-swatch");D.type="button",D.style.background=A.css,D.setAttribute("aria-label",this.locale==="en"?A.nameEn:A.name),D.title=this.locale==="en"?A.nameEn:A.name,D.setAttribute("aria-pressed",String(this.hairColorId===A.id)),D.classList.toggle("is-active",this.hairColorId===A.id),D.addEventListener("click",()=>{this.hairColorId=A.id,this.hairHue=0;for(let X of this.hairSwatches)X.classList.toggle("is-active",X===D);this.drawRefinePreview()}),V.appendChild(D),this.hairSwatches.push(D)}this.hairRow=V;let F=b("div","au-mask-actions"),O=b("button","au-chip au-chip--danger");O.type="button",O.innerHTML=`<span>${this.s.brushCancel}</span>`,O.addEventListener("click",()=>this.cancelRefine());let N=b("button","au-primary au-mask-apply");N.type="button",N.innerHTML=`<span>${this.s.brushApply}</span>`,N.addEventListener("click",()=>{this.applyRefine()}),F.append(O,N),g.append(x,_,E,$,this.maskBrushTicks.row,this.whitenStrengthRow,this.hairRow,this.auxRow,F),this.maskToolbar=g,t.appendChild(g)}brushDabLocal(t,e,r,s){if(!this.refineMask)return;let o=this.refineMaskWidth,n=this.refineMaskHeight,u=this.refineMask,l=Math.max(1,r),c=Math.max(0,Math.floor(t-l)),h=Math.min(o-1,Math.ceil(t+l)),p=Math.max(0,Math.floor(e-l)),v=Math.min(n-1,Math.ceil(e+l));for(let f=p;f<=v;f++)for(let m=c;m<=h;m++){let g=m-t,x=f-e,_=Math.sqrt(g*g+x*x)/l;if(_>=1)continue;let y=1-_,w=y*y*(3-2*y),T=f*o+m,k=s*w;u[T]=this.brushMode==="add"?Math.min(1,(u[T]??0)+k):Math.max(0,(u[T]??0)-k)}}resizeMaskLocal(t,e,r,s,o){if(e===s&&r===o)return new Float32Array(t);let n=new Float32Array(s*o),u=e/s,l=r/o;for(let c=0;c<o;c++){let h=(c+.5)*l-.5,p=Math.max(0,Math.floor(h)),v=Math.min(r-1,p+1),f=Math.min(1,Math.max(0,h-p));for(let m=0;m<s;m++){let g=(m+.5)*u-.5,x=Math.max(0,Math.floor(g)),_=Math.min(e-1,x+1),y=Math.min(1,Math.max(0,g-x)),w=(t[p*e+x]??0)*(1-y)+(t[p*e+_]??0)*y,T=(t[v*e+x]??0)*(1-y)+(t[v*e+_]??0)*y;n[c*s+m]=w*(1-f)+T*f}}return n}mixWhitenInto(t,e){let r=this.whitenStrength;for(let s=0,o=0;s<e.length;s++,o+=4){let n=Math.min(1,Math.max(0,e[s]??0));if(n<=.002)continue;let u=t[o]??0,l=t[o+1]??0,c=t[o+2]??0,h=(.2126*u+.7152*l+.0722*c)/255,p=Math.min(1,h*(1+r*.7*(1-h))),v=h<=1e-4?1:p/h,f=1-n;t[o]=Math.round(u*f+u*v*n),t[o+1]=Math.round(l*f+l*v*n),t[o+2]=Math.round(c*f+c*v*n),t[o+3]=255}}mixRetouchInto(t,e,r,s){let o=this.retouchEffect;if(o==="whiten"){this.mixWhitenInto(t,s);return}if(o==="smooth"){this.mixSmoothInto(t,e,r,s);return}if(o==="blemish"){this.mixBlemishInto(t,e,r,s);return}if(o==="tone"){this.mixToneInto(t,s);return}this.mixHairInto(t,s)}blurredCopy(t,e,r){let s=document.createElement("canvas");s.width=e,s.height=r;let o=s.getContext("2d",{willReadFrequently:!0});if(!o)return new Uint8ClampedArray(t);let n=document.createElement("canvas");n.width=Math.max(1,e>>3),n.height=Math.max(1,r>>3);let u=n.getContext("2d");if(!u)return new Uint8ClampedArray(t);let l=new ImageData(new Uint8ClampedArray(t),e,r);return o.putImageData(l,0,0),u.imageSmoothingEnabled=!0,u.imageSmoothingQuality="high",u.drawImage(s,0,0,n.width,n.height),o.imageSmoothingEnabled=!0,o.imageSmoothingQuality="high",o.clearRect(0,0,e,r),o.drawImage(n,0,0,e,r),o.getImageData(0,0,e,r).data}mixSmoothInto(t,e,r,s){let o=this.blurredCopy(t,e,r),n=this.whitenStrength;for(let u=0,l=0;u<s.length;u++,l+=4){let c=Math.min(1,Math.max(0,s[u]??0));if(c<=.002)continue;let h=1-n*c,p=t[l]??0,v=t[l+1]??0,f=t[l+2]??0,m=o[l]??p,g=o[l+1]??v,x=o[l+2]??f;t[l]=Math.round(m+(p-m)*h),t[l+1]=Math.round(g+(v-g)*h),t[l+2]=Math.round(x+(f-x)*h),t[l+3]=255}}mixBlemishInto(t,e,r,s){let o=this.blurredCopy(t,e,r),n=this.whitenStrength;for(let u=0,l=0;u<s.length;u++,l+=4){let c=Math.min(1,Math.max(0,s[u]??0))*n;if(c<=.002)continue;let h=1-c;t[l]=Math.round((t[l]??0)*h+(o[l]??0)*c),t[l+1]=Math.round((t[l+1]??0)*h+(o[l+1]??0)*c),t[l+2]=Math.round((t[l+2]??0)*h+(o[l+2]??0)*c),t[l+3]=255}}mixToneInto(t,e){let r=this.toneWarm/100,s=this.whitenStrength;for(let o=0,n=0;o<e.length;o++,n+=4){let u=Math.min(1,Math.max(0,e[o]??0));if(u<=.002)continue;let l=t[n]??0,c=t[n+1]??0,h=t[n+2]??0,p=(.2126*l+.7152*c+.0722*h)/255,v=Math.min(1,p*(1+s*.35*(1-p))),f=p<=1e-4?1:v/p,m=Math.min(255,Math.max(0,l*f*(1+r*.22))),g=Math.min(255,Math.max(0,c*f*(1+r*.03))),x=Math.min(255,Math.max(0,h*f*(1-r*.2))),_=1-u;t[n]=Math.round(l*_+m*u),t[n+1]=Math.round(c*_+g*u),t[n+2]=Math.round(h*_+x*u),t[n+3]=255}}mixHairInto(t,e){let r=li.find(l=>l.id===this.hairColorId)??li[1],s=((r.hue+this.hairHue)%360+360)%360,o=r.sat,n=r.bright,u=this.whitenStrength;for(let l=0,c=0;l<e.length;l++,c+=4){let h=Math.min(1,Math.max(0,e[l]??0))*(.35+.65*u);if(h<=.002)continue;let p=(t[c]??0)/255,v=(t[c+1]??0)/255,f=(t[c+2]??0)/255,m=Math.max(p,v,f),g=Math.min(p,v,f),x=m-g,_=0;x>1e-6&&(m===p?_=(v-f)/x%6:m===v?_=(f-p)/x+2:_=(p-v)/x+4,_*=60,_<0&&(_+=360));let y=m<=1e-6?0:x/m,w=s,T=Math.max(y,o),k=Math.min(1,Math.max(0,m*n)),E=k*T,L=E*(1-Math.abs(w/60%2-1)),R=k-E,C=0,z=0,I=0;w<60?(C=E,z=L):w<120?(C=L,z=E):w<180?(z=E,I=L):w<240?(z=L,I=E):w<300?(C=L,I=E):(C=E,I=L),C=(C+R)*255,z=(z+R)*255,I=(I+R)*255;let $=1-h;t[c]=Math.round((t[c]??0)*$+C*h),t[c+1]=Math.round((t[c+1]??0)*$+z*h),t[c+2]=Math.round((t[c+2]??0)*$+I*h),t[c+3]=255}}positionRefineCanvas(){if(!this.refineOn||!this.refineCanvas)return;let t=this.stage.clientWidth||1,e=this.stage.clientHeight||1,r=this.displayCropRect()??{x:0,y:0,width:t,height:e};this.refineCanvas.style.left=`${r.x}px`,this.refineCanvas.style.top=`${r.y}px`,this.refineCanvas.style.width=`${r.width}px`,this.refineCanvas.style.height=`${r.height}px`}drawRefinePreview(){if(!this.refineOn||!this.refineCanvas||!this.refineSource||!this.refineMask)return;let t=this.refineCanvas,e=t.getContext("2d");if(!e)return;let r=this.cropUVRect(),s=Math.max(1,Math.round((r.u1-r.u0)*this.refineWidth)),o=Math.max(1,Math.round((r.v1-r.v0)*this.refineHeight)),u=Math.min(1,1080/Math.max(s,o)),l=Math.max(1,Math.round(s*u)),c=Math.max(1,Math.round(o*u));(t.width!==l||t.height!==c)&&(t.width=l,t.height=c),this.positionRefineCanvas();let h=Math.round(r.u0*this.refineWidth),p=Math.round(r.v0*this.refineHeight),v=Math.max(1,Math.round((r.u1-r.u0)*this.refineWidth)),f=Math.max(1,Math.round((r.v1-r.v0)*this.refineHeight));if(this.peekOn){e.drawImage(this.refineSource,h,p,v,f,0,0,l,c);return}let m=this.resizeMaskCrop(this.refineMask,this.refineMaskWidth,this.refineMaskHeight,r,l,c);if(this.refineKind==="retouch"){e.drawImage(this.refineSource,h,p,v,f,0,0,l,c);let w=e.getImageData(0,0,l,c);this.mixRetouchInto(w.data,l,c,m),e.putImageData(w,0,0);return}if(this.refineMode==="replace")e.fillStyle="#ffffff",e.fillRect(0,0,l,c);else if(this.refineMode==="blur"){let w=document.createElement("canvas"),T=Math.max(1,l>>3),k=Math.max(1,c>>3);w.width=T,w.height=k;let E=w.getContext("2d");E&&(E.imageSmoothingEnabled=!0,E.imageSmoothingQuality="high",E.drawImage(this.refineSource,h,p,v,f,0,0,T,k),e.imageSmoothingEnabled=!0,e.imageSmoothingQuality="high",e.drawImage(w,0,0,l,c))}else{let w=Math.max(4,Math.round(l/24));for(let T=0;T<c;T+=w)for(let k=0;k<l;k+=w)e.fillStyle=(Math.floor(k/w)+Math.floor(T/w))%2===0?"#3a3a3f":"#232327",e.fillRect(k,T,w,w)}let g=document.createElement("canvas");g.width=l,g.height=c;let x=g.getContext("2d");if(!x)return;x.drawImage(this.refineSource,h,p,v,f,0,0,l,c);let _=x.getImageData(0,0,l,c),y=_.data;for(let w=0,T=0;w<m.length;w++,T+=4)y[T+3]=Math.round(Math.min(1,Math.max(0,m[w]??0))*255);x.putImageData(_,0,0),e.drawImage(g,0,0)}syncBrushChrome(){let t=this.refineKind==="retouch";this.maskInvertBtn&&(this.maskInvertBtn.style.display=t||this.brushZoom?"none":""),this.maskTransparentBtn&&(this.maskTransparentBtn.style.display=t||this.brushZoom?"none":""),this.zoomInBtn&&(this.zoomInBtn.style.display=this.brushZoom?"":"none"),this.zoomOutBtn&&(this.zoomOutBtn.style.display=this.brushZoom?"":"none"),this.whitenStrengthRow&&(this.whitenStrengthRow.style.display=t?"":"none"),this.hairRow&&(this.hairRow.style.display=t&&this.retouchEffect==="hair"?"":"none");let e=t&&(this.retouchEffect==="tone"||this.retouchEffect==="hair");this.auxRow&&(this.auxRow.style.display=e?"":"none"),e&&this.auxTicks&&(this.retouchEffect==="hair"?(this.auxTicks.setRange(-180,180,1,10,!0),this.auxTicks.setLabel(this.s.retouchHue),this.auxTicks.set(this.hairHue,!1)):(this.auxTicks.setRange(-100,100,1,10,!0),this.auxTicks.setLabel(this.s.retouchWarm),this.auxTicks.set(this.toneWarm,!1))),this.maskHintEl&&(this.maskHintEl.textContent=this.brushZoom?this.s.zoomHint:t?this.s.retouchBrushHint:this.s.brushHint),this.maskToolLabelEl&&(this.maskToolLabelEl.textContent=this.s.brushLabel),t||this.syncMaskTransparentBtn()}stepZoom(t){if(!this.isReady)return;let e=this.getState().transform.zoom,r=S(e*t,.2,this.maxZoom);try{this.settle({zoom:r},300)}catch{try{this.applyTransform({zoom:r})}catch{}}}brushRadiusMask(){return Math.max(1,this.brushSize*1)}updateBrushRing(){if(!this.brushRingEl)return;if(!this.refineOn||!this.brushPreview&&this.brushZoom||!this.brushPointer||!this.refineCanvas){this.brushRingEl.style.display="none";return}let t=this.refineCanvas.getBoundingClientRect();if(t.width<2||t.height<2)return;let e=t.width/Math.max(1,this.refineMaskWidth),r=t.height/Math.max(1,this.refineMaskHeight),s=this.brushRadiusMask(),n=Math.max(3,s*Math.min(e,r))*2,u=this.brushPointer.x,l=this.brushPointer.y;this.brushRingEl.style.width=`${n}px`,this.brushRingEl.style.height=`${n}px`,this.brushRingEl.style.transform=`translate(-50%,-50%) translate(${u}px,${l}px)`,this.brushRingEl.style.display="block"}hideBrushRing(){this.brushPointer=null,this.brushPreview=!1,this.brushRingEl&&(this.brushRingEl.style.display="none")}showCenterBrushRing(){if(!this.refineOn)return;let t=this.stage.clientWidth||1,e=this.stage.clientHeight||1;this.brushPointer={x:t/2,y:e/2},this.brushPreview=!0,this.updateBrushRing()}ensureRefineCanvas(){if(this.refineCanvas)return;let t=document.createElement("canvas");t.className="au-maskprev",t.setAttribute("aria-hidden","true"),t.dataset.gestureIgnore="true",t.style.pointerEvents=this.brushZoom?"none":"auto";let e=b("div","au-brush-ring au-mask-ring");e.setAttribute("aria-hidden","true"),this.stage.appendChild(e),this.brushRingEl=e;let r=n=>{if(!(!this.refineOn||this.brushZoom)){n.preventDefault();try{t.setPointerCapture(n.pointerId)}catch{}this.refineMask&&this.refineHistory.push(new Float32Array(this.refineMask)),this.refineHistory.length>20&&this.refineHistory.shift(),this.refineStroke={pointerId:n.pointerId,snapshotTaken:!0},this.brushAt(n)}},s=n=>{if(!this.brushZoom){if(n.pointerType==="mouse"&&!this.refineStroke){let u=this.stage.getBoundingClientRect();this.brushPointer={x:n.clientX-u.left,y:n.clientY-u.top},this.updateBrushRing();return}!this.refineStroke||this.refineStroke.pointerId!==n.pointerId||(n.preventDefault(),this.brushAt(n))}},o=()=>{this.refineStroke=null,this.drawRefinePreview(),this.hideBrushRing()};t.addEventListener("pointerdown",r),t.addEventListener("pointermove",s),t.addEventListener("pointerup",o),t.addEventListener("pointercancel",o),t.addEventListener("pointerleave",()=>{this.refineStroke||this.hideBrushRing()}),this.stage.appendChild(t),this.refineCanvas=t}syncToolButtons(){this.addBtn?.setAttribute("aria-pressed",String(!this.brushZoom&&this.brushMode==="add")),this.eraseBtn?.setAttribute("aria-pressed",String(!this.brushZoom&&this.brushMode==="erase")),this.zoomBtn?.setAttribute("aria-pressed",String(this.brushZoom)),this.refineCanvas&&(this.refineCanvas.style.pointerEvents=this.brushZoom?"none":"auto");try{this.gesture.setEnabled(this.brushZoom)}catch{}this.brushZoom&&this.hideBrushRing(),this.updateBrushRing()}setBrushZoom(t){if(this.brushZoom=t,t&&this.isReady){let e=this.getState().transform.zoom;if(e<1.4)try{this.settle({zoom:Math.min(this.maxZoom,e*1.8)},300)}catch{try{this.applyTransform({zoom:Math.min(this.maxZoom,e*1.8)})}catch{}}}this.syncToolButtons(),this.syncBrushChrome()}showBrush(){if(this.ensureRefineCanvas(),!this.savedTransform&&this.isReady){let t=this.getState().transform;this.savedTransform={zoom:t.zoom,offsetX:t.offsetX,offsetY:t.offsetY}}this.canvas.style.visibility="hidden",this.brushZoom=!1,this.syncToolButtons(),this.refineCanvas.style.display="block",this.refineCanvas.style.pointerEvents=this.brushZoom?"none":"auto",this.maskToolbar.style.display="block";for(let t of[this.bgModelLabelEl,this.bgModelSegEl,this.bgModelDetail,this.bgListEl])t&&(t.style.display="none");this.syncBrushChrome(),this.positionTexts(),this.drawRefinePreview(),this.showTab("ai")}enterRefine(t,e,r,s,o,n,u,l){this.refineOn=!0,this.refineKind="bg",this.refineWhitened=null,this.refineSource=t,this.refineWidth=e,this.refineHeight=r,this.refineMaskWidth=o,this.refineMaskHeight=n,this.refineMask=new Float32Array(s),this.refineOriginalMask=new Float32Array(s),this.refineMode=u,this.refineBaseMode=u,this.refineModelId=l,this.refineHistory=[],this.showBrush()}enterRetouchBrush(t,e,r,s,o,n,u,l,c,h="whiten"){this.refineOn=!0,this.refineKind="retouch",this.retouchEffect=h,this.refineWhitened=u,this.refineWhitenedW=l,this.refineWhitenedH=c,this.refineSource=t,this.refineWidth=e,this.refineHeight=r,this.refineMaskWidth=o,this.refineMaskHeight=n,this.refineMask=new Float32Array(s),this.refineOriginalMask=new Float32Array(s),this.refineModelId="blazeface-onnx",this.refineHistory=[],this.showBrush()}brushAt(t){if(!this.refineCanvas||!this.refineMask||this.brushZoom)return;let e=this.refineCanvas.getBoundingClientRect();if(e.width<2||e.height<2)return;let r=this.stage.getBoundingClientRect();this.brushPointer={x:t.clientX-r.left,y:t.clientY-r.top};let s=nt((t.clientX-e.left)/e.width),o=nt((t.clientY-e.top)/e.height),n=this.cropUVRect(),u=(n.u0+s*(n.u1-n.u0))*this.refineMaskWidth,l=(n.v0+o*(n.v1-n.v0))*this.refineMaskHeight,c=this.brushRadiusMask()/Math.max(.1,Math.max(n.u1-n.u0,n.v1-n.v0));this.brushDabLocal(u,l,c,.9),this.drawRefinePreview(),this.updateBrushRing()}refineUndo(){let t=this.refineHistory.pop();!t||!this.refineMask||(this.refineMask=t,this.drawRefinePreview())}syncMaskTransparentBtn(){if(!this.maskTransparentBtn)return;let t=this.refineMode==="remove"||this.refineMode==="person";this.maskTransparentBtn.setAttribute("aria-pressed",String(t))}refineInvert(){if(!this.refineOn||!this.refineMask||this.refineKind==="retouch")return;this.refineHistory.push(new Float32Array(this.refineMask)),this.refineHistory.length>20&&this.refineHistory.shift();let t=this.refineMask;for(let e=0;e<t.length;e++)t[e]=1-(t[e]??0);this.drawRefinePreview()}refineToggleTransparent(){if(!this.refineOn||!this.refineMask||this.refineKind==="retouch")return;this.refineMode==="remove"||this.refineMode==="person"?(this.refineBaseMode==="blur"||this.refineBaseMode==="replace")&&(this.refineMode=this.refineBaseMode):this.refineMode="remove",this.syncMaskTransparentBtn(),this.drawRefinePreview()}cancelRefine(){if(this.refineOn=!1,this.refineKind="bg",this.refineWhitened=null,this.refineMask=null,this.refineHistory=[],this.brushZoom=!1,this.syncToolButtons(),this.hideBrushRing(),this.canvas.style.visibility="",this.savedTransform){let t=this.savedTransform;this.savedTransform=null;try{this.settle(t,250)}catch{try{this.applyTransform(t)}catch{}}}this.refineCanvas&&(this.refineCanvas.style.display="none"),this.maskToolbar&&(this.maskToolbar.style.display="none");for(let t of[this.bgModelLabelEl,this.bgModelSegEl,this.bgModelDetail,this.bgListEl])t&&(t.style.display="");this.positionTexts()}async applyRefine(){if(!this.refineOn||!this.refineSource||!this.refineMask)return;let t=this.cropUVRect(),e=Math.round(t.u0*this.refineWidth),r=Math.round(t.v0*this.refineHeight),s=Math.max(1,Math.round((t.u1-t.u0)*this.refineWidth)),o=Math.max(1,Math.round((t.v1-t.v0)*this.refineHeight)),n=this.resizeMaskCrop(this.refineMask,this.refineMaskWidth,this.refineMaskHeight,t,s,o),u=document.createElement("canvas");u.width=s,u.height=o;let l=u.getContext("2d");if(!l)return;if(this.refineKind==="retouch"){l.drawImage(this.refineSource,e,r,s,o,0,0,s,o);let v=l.getImageData(0,0,s,o);this.mixRetouchInto(v.data,s,o,n),l.putImageData(v,0,0)}else{if(this.refineMode==="replace")l.fillStyle="#ffffff",l.fillRect(0,0,s,o);else if(this.refineMode==="blur"){let x=document.createElement("canvas");x.width=Math.max(1,s>>3),x.height=Math.max(1,o>>3);let _=x.getContext("2d");_&&(_.imageSmoothingEnabled=!0,_.imageSmoothingQuality="high",_.drawImage(this.refineSource,e,r,s,o,0,0,x.width,x.height),l.imageSmoothingEnabled=!0,l.imageSmoothingQuality="high",l.drawImage(x,0,0,s,o))}let v=document.createElement("canvas");v.width=s,v.height=o;let f=v.getContext("2d");if(!f)return;f.drawImage(this.refineSource,e,r,s,o,0,0,s,o);let m=f.getImageData(0,0,s,o),g=m.data;for(let x=0,_=0;x<n.length;x++,_+=4)g[_+3]=Math.round(Math.min(1,Math.max(0,n[x]??0))*255);f.putImageData(m,0,0),l.drawImage(v,0,0)}let c=await new Promise(v=>u.toBlob(v,"image/png"));if(!c){this.toast(this.s.bgFailed,!0);return}let h=this.refineKind==="retouch",p=this.getState();this.cancelRefine(),await this.load(c);try{this.setState({...p,transform:this.getState().transform,crop:this.getState().crop},{history:!0})}catch{}this.showTab("adjust"),this.toast(h?this.s.retouchDone:this.s.bgDone)}makeTicks(t){let e=b("div","au-ticksrow"),r=null,s=null;if(t.head){let M=b("div","au-slider__head");r=b("span","au-slider__label"),r.textContent=t.label,s=b("button","au-slider__value"),s.type="button",s.title=`${this.s.reset}: ${t.label}`,s.setAttribute("aria-label",`${this.s.reset}: ${t.label}`),s.addEventListener("click",()=>t.onReset?.()),M.append(r,s),e.appendChild(M)}let o=b("div","au-ticks"),n=t.ruler===!0;n&&o.classList.add("au-ticks--ruler"),o.tabIndex=0,o.setAttribute("role","slider"),o.setAttribute("aria-orientation","horizontal"),o.setAttribute("aria-label",t.label);let u=b("div","au-ticks__track");if(u.setAttribute("aria-hidden","true"),o.appendChild(u),n){let M=b("span","au-ticks__center");M.setAttribute("aria-hidden","true"),o.appendChild(M)}e.appendChild(o);let l=t.min,c=t.max,h=Math.max(1e-4,t.step??1),p=Math.max(h,t.tickStep??5),v=t.zero??!1,f=[],m=-1,g=t.defaultValue,x=!1,_=null,y=g,w=0,T=0,k=new WeakMap,E=()=>typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,L=M=>{let P=Math.round((M-l)/h)*h+l;return S(Number(P.toFixed(6)),l,c)},R=()=>{let M=Math.max(2,Math.round((c-l)/p)+1);u.replaceChildren(),f=[];for(let P=0;P<M;P+=1){let B=b("span","au-tick"),Y=l+P*p;v&&Math.abs(Y)<p/2&&B.classList.add("is-zero"),(P%5===0||v&&Math.abs(Y)<p/2)&&B.classList.add("is-major"),u.appendChild(B),f.push(B)}m=-1},C=M=>S(Math.round((M-l)/p),0,f.length-1),z=()=>{if(!n)return;let M=Math.max(1,f.length-1),P=S((m>=0?m:C(g))/M,0,1);u.style.transform=`translate3d(${-P*100}%,-50%,0)`},I=(M,P=!1)=>{g=S(Number.isFinite(M)?M:l,l,c);let B=C(g),Y=m;if(B!==Y){if(Y>=0&&f[Y]?.classList.remove("is-active"),P&&Y>=0&&!E()){let tt=Math.max(1,Math.abs(B-Y)),Yi=Math.min(Y,B),Wi=Math.max(Y,B);for(let qt=Yi;qt<=Wi;qt+=1){if(qt===B)continue;let ct=f[qt];if(!ct)continue;let ci=Math.round(Math.abs(qt-Y)/tt*120);ct.style.setProperty("--wave-delay",`${ci}ms`),ct.classList.remove("is-wave"),ct.offsetWidth,ct.classList.add("is-wave");let hi=k.get(ct);hi&&window.clearTimeout(hi),k.set(ct,window.setTimeout(()=>{ct.classList.remove("is-wave"),k.delete(ct)},340+ci))}}let K=f[B];if(K){K.classList.remove("is-wave");let tt=k.get(K);tt&&(window.clearTimeout(tt),k.delete(K)),K.classList.add("is-active")}if(m=B,P){let tt=performance.now();if(tt-T>26&&typeof navigator.vibrate=="function"){try{navigator.vibrate(3)}catch{}T=tt}}}o.setAttribute("aria-valuenow",String(Math.round(g))),o.setAttribute("aria-valuetext",t.format(g)),s&&(s.textContent=t.format(g)),z()},$=(M,P,B,Y,K=v)=>{l=M,c=P,h=Math.max(1e-4,B),p=Math.max(h,Y),v=K,R(),o.setAttribute("aria-valuemin",String(l)),o.setAttribute("aria-valuemax",String(c)),I(S(g,l,c),!1)},V=M=>{o.setAttribute("aria-label",M),r&&(r.textContent=M)},F=M=>{x=M,e.classList.toggle("is-disabled",x),o.tabIndex=x?-1:0,o.setAttribute("aria-disabled",String(x)),s&&(s.disabled=x),x&&(_=null)},O=()=>{o.focus({preventScroll:!0})},N=M=>{let P=o.getBoundingClientRect(),B=10,Y=Math.max(1,P.width-B*2),K=S((M-P.left-B)/Y,0,1);return L(l+K*(c-l))},A=M=>{if(!x&&!(M.pointerType==="mouse"&&M.button!==0)){M.preventDefault(),M.stopPropagation(),o.focus({preventScroll:!0}),_=M.pointerId,y=g,w=M.clientX;try{o.setPointerCapture(M.pointerId)}catch{}if(!n){let P=N(M.clientX);I(P,!0),t.onInput(P,"pointer")}t.onDragStart?.()}},D=M=>{if(x||_!==M.pointerId)return;if(M.preventDefault(),n){let B=o.getBoundingClientRect(),Y=Math.max(1,B.width-20),K=(M.clientX-w)/Y,tt=L(y-K*(c-l));if(Math.abs(tt-g)<.001)return;I(tt,!0),t.onInput(tt,"pointer");return}let P=N(M.clientX);Math.abs(P-g)<.001||(I(P,!0),t.onInput(P,"pointer"))},X=M=>{if(_===M.pointerId){_=null;try{o.releasePointerCapture(M.pointerId)}catch{}t.onDragEnd?.()}},Z=M=>{if(x)return;let P=Math.max(h,h*10),B=g;switch(M.key){case"ArrowLeft":case"ArrowDown":B-=h;break;case"ArrowRight":case"ArrowUp":B+=h;break;case"PageDown":B-=P;break;case"PageUp":B+=P;break;case"Home":B=l;break;case"End":B=c;break;default:return}M.preventDefault(),B=L(B),I(B,!0),t.onInput(B,"keyboard")};return o.addEventListener("pointerdown",A),o.addEventListener("pointermove",D),o.addEventListener("pointerup",X),o.addEventListener("pointercancel",X),o.addEventListener("keydown",Z),R(),o.setAttribute("aria-valuemin",String(l)),o.setAttribute("aria-valuemax",String(c)),I(S(t.defaultValue,l,c),!1),{row:e,rail:o,set:I,setRange:$,setLabel:V,setDisabled:F,focus:O}}buildSheet(){let t=b("div","au-sheetwrap");t.setAttribute("aria-hidden","true");let e=b("div","au-sheet");e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-label",this.s.exportTitle);let r=Ut.filter(u=>this.exportTypes.includes(u.type)),s=r.map(u=>`<button type="button" data-format="${u.type}" aria-pressed="false">${u.label}</button>`).join(""),o=!!this.onSaveCopyCb;e.innerHTML=`
      <div class="au-grabber"></div>
      <div class="au-sheet__title"></div>
      <div class="au-sheet__sub"></div>
      <div class="au-meta">${U("image")}<div><b data-meta-name></b><span data-meta-info></span></div></div>
      <span class="au-label" data-format-label></span>
      <div class="au-seg" role="group" style="grid-template-columns:repeat(${r.length},1fr)">${s}</div>
      <div class="au-slider" data-quality-row></div>
      <div class="au-progress" data-progress hidden>
        <div class="au-progress__head">
          <span class="au-progress__label" data-progress-label></span>
          <span class="au-progress__pct" data-progress-pct>0%</span>
          <button class="au-progress__cancel" type="button" data-progress-cancel></button>
        </div>
        <div class="au-progress__track"><span data-progress-bar></span></div>
      </div>
      <div class="au-sheet__actions${o?" has-copy":""}">
        <button class="au-primary" type="button"><span data-save-label></span></button>
        ${o?'<button class="au-copy" type="button"><span data-copy-label></span></button>':""}
      </div>
      <button class="au-cancel" type="button"></button>
    `,W(e,".au-sheet__title").textContent=this.s.exportTitle,this.exportSubEl=W(e,".au-sheet__sub"),this.exportSubEl.textContent=this.s.exportSub,W(e,"[data-format-label]").textContent=this.s.format,this.metaName=W(e,"[data-meta-name]"),this.metaInfo=W(e,"[data-meta-info]"),this.qualityRow=W(e,"[data-quality-row]"),this.progressEl=W(e,"[data-progress]"),this.progressBar=W(e,"[data-progress-bar]"),this.progressText=W(e,"[data-progress-pct]"),this.progressLabel=W(e,"[data-progress-label]"),this.progressCancel=W(e,"[data-progress-cancel]"),this.progressCancel.textContent=this.s.cancelExport,this.progressCancel.addEventListener("click",()=>this.exportAbort?.abort()),this.qualityControl=this.makeTicks({label:this.s.quality,min:10,max:100,step:1,tickStep:3,defaultValue:92,head:!0,format:u=>`${Math.round(u)}%`,onInput:u=>this.applyQuality(u),onReset:()=>this.applyQuality(92)}),this.qualityRow.appendChild(this.qualityControl.row),this.saveImageBtn=W(e,".au-primary"),this.saveImageBtn.insertAdjacentHTML("afterbegin",U("save")),this.saveLabel=W(e,"[data-save-label]"),this.saveLabel.textContent=o?this.s.overwrite:this.s.saveImage,o&&(this.saveCopyBtn=W(e,".au-copy"),this.saveCopyBtn.insertAdjacentHTML("afterbegin",U("copy")),this.saveCopyLabel=W(e,"[data-copy-label]"),this.saveCopyLabel.textContent=this.s.saveCopy);let n=W(e,".au-cancel");n.textContent=this.s.cancel;for(let u of r){let l=W(e,`[data-format="${u.type}"]`);l.addEventListener("click",()=>{this.exportType=u.type,this.updateSheet()}),this.formatButtons.set(u.type,l)}this.saveImageBtn.addEventListener("click",()=>{this.saveImage("overwrite")}),this.saveCopyBtn?.addEventListener("click",()=>{this.saveImage("copy")}),n.addEventListener("click",()=>this.closeSheet()),t.addEventListener("click",u=>{u.target===t&&this.closeSheet()}),t.appendChild(e),this.root.appendChild(t),this.sheetWrap=t,this.applyQuality(92)}buildTextLayer(){let t=b("div","au-textlayer");t.setAttribute("aria-hidden","true"),this.work.appendChild(t),this.textLayer=t}buildBG(){let t=b("div","au-ai au-bg-panel");t.hidden=!0,t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label",this.s.bgTitle);let e=b("div","au-ai__panel au-glass"),r=b("div","au-ai__head"),s=b("span","au-ai__badge");s.innerHTML=U("bg");let o=b("div","au-ai__copy"),n=b("strong");n.textContent=this.s.bgRunning;let u=b("span","au-ai__detail");u.textContent=this.s.bgRunning,o.append(n,u),r.append(s,o);let l=b("button","au-ai__cancel au-glass");l.type="button",l.textContent=this.s.aiCancel,l.addEventListener("click",()=>this.bgAbort?.abort()),r.appendChild(l),e.appendChild(r),t.appendChild(e),this.root.appendChild(t),this.bgPanel=t,this.bgDetail=u}buildAI(){if(!this.aiAction)return;let t=b("div","au-ai");t.hidden=!0,t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label",this.s.aiRunning);let e=b("div","au-ai__panel au-glass"),r=b("div","au-ai__head"),s=b("span","au-ai__badge");s.innerHTML=U("ai");let o=b("div","au-ai__copy"),n=b("strong");n.textContent=this.s.aiRunning;let u=b("span","au-ai__detail");u.textContent=this.s.aiPreparing,o.append(n,u),r.append(s,o);let l=b("button","au-ai__cancel au-glass");l.type="button",l.textContent=this.s.aiCancel,l.addEventListener("click",()=>this.aiAbort?.abort()),r.appendChild(l);let c=b("div","au-ai__track"),h=b("span");c.appendChild(h),e.append(r,c),t.appendChild(e),this.root.appendChild(t),this.aiPanel=t,this.aiDetail=u,this.aiBar=h}reportAI(t,e){if(!this.aiPanel||this.aiPanel.hidden)return;let r=!Number.isFinite(t)||t<0;this.aiPanel.classList.toggle("is-indeterminate",r),this.aiBar.style.width=r?"100%":`${Math.round(S(t,0,1)*100)}%`,e?this.aiDetail.textContent=e:r||(this.aiDetail.textContent=`${Math.round(t*100)}%`)}saveCurrentPreset(t){if(!this.isReady)return;let e=t??this.filterNameInput,r=(e?.value??"").trim()||`${this.s.filterTitle} ${new Date().toLocaleTimeString(this.locale==="vi"?"vi-VN":"en-US",{hour:"2-digit",minute:"2-digit"})}`;if(this.userPresets.some(n=>n.name.toLowerCase()===r.toLowerCase())){this.toast(this.s.presetExists,!0),e?.focus();return}let s=this.getState(),o={id:`u${Date.now().toString(36)}`,name:r,createdAt:Date.now(),filter:s.filter,adjust:{...s.adjust},enhance:JSON.parse(JSON.stringify(s.enhance))};this.userPresets=[o,...this.userPresets].slice(0,24),Fi(this.userPresets),e&&(e.value=""),this.renderSavedPresets(),this.toast(this.s.presetSaved)}renderSavedPresets(){this.savedList&&this.buildFilters()}applyUserPreset(t){if(!this.isReady)return;if(this.activeSavedId===t.id){let s=this.savedReturnState;this.activeSavedId=null,this.savedReturnState=null,s?this.setState(s):this.setFilter("original"),this.syncUI(),this.buildFilters(),this.toast(this.s.resetFilter);return}this.savedReturnState=this.getState(),this.activeSavedId=t.id;let r={...this.getState(),filter:t.filter,adjust:{...t.adjust},enhance:JSON.parse(JSON.stringify(t.enhance))};this.setState(r),this.syncUI(),this.buildFilters(),this.toast(this.s.presetApplied)}selectedLayer(){return this.texts.find(t=>t.id===this.selectedTextId)}addTextLayer(){if(!this.isReady)return;let t=qi(),e=this.texts.length;t.x=.5+(e%3-1)*.06,t.y=.42+e%4*.08,this.texts.push(t),this.selectedTextId=t.id;let r=this.createTextNode(t);this.textLayer.appendChild(r),this.syncTextControls(t),this.positionTexts(),this.openInlineTextEditor(r,t)}createTextNode(t){let e=b("div","au-textnode");e.dataset.textId=t.id,e.setAttribute("aria-hidden","true");let r=document.createElement("span");r.className="au-text-span",r.textContent=t.text,e.appendChild(r);let s=document.createElement("span");s.className="au-text-hud",s.setAttribute("aria-hidden","true"),e.appendChild(s);let o=document.createElement("span");o.className="au-text-handle au-text-handle--scale",o.setAttribute("aria-hidden","true");let n=document.createElement("span");n.className="au-text-handle au-text-handle--rotate",n.setAttribute("aria-hidden","true");let u=document.createElement("span");u.className="au-text-handle-stem",u.setAttribute("aria-hidden","true"),e.append(u,o,n);let l=(f,m)=>{f.addEventListener("pointerdown",g=>{if(g.target!==f&&!f.contains(g.target))return;g.preventDefault(),g.stopPropagation(),this.selectedTextId=t.id,this.syncTextControls(t);try{f.setPointerCapture(g.pointerId)}catch{}let x=this.displayCropRect(),_=x?{x:x.x+t.x*x.width,y:x.y+t.y*x.height}:null;if(!_||!x)return;let y=g.clientX,w=g.clientY,T=t.size,k=t.rotation,E=Math.max(1,Math.hypot(g.clientX-(this.stage.getBoundingClientRect().left+_.x),g.clientY-(this.stage.getBoundingClientRect().top+_.y))),L=Math.atan2(g.clientY-(this.stage.getBoundingClientRect().top+_.y),g.clientX-(this.stage.getBoundingClientRect().left+_.x)),R=z=>{if(z.pointerId!==g.pointerId)return;z.preventDefault(),z.stopPropagation();let I=this.stage.getBoundingClientRect(),$=Math.max(1,Math.hypot(z.clientX-(I.left+_.x),z.clientY-(I.top+_.y))),V=Math.atan2(z.clientY-(I.top+_.y),z.clientX-(I.left+_.x));if(m==="scale"){let F=$/E;t.size=S(T*F,.02,.24),this.positionTexts()}else{let F=(V-L)*180/Math.PI;t.rotation=Math.round((k+F+540)%360-180),this.positionTexts()}},C=z=>{z.pointerId===g.pointerId&&(f.removeEventListener("pointermove",R),f.removeEventListener("pointerup",C),f.removeEventListener("pointercancel",C),this.syncTextControls(t))};f.addEventListener("pointermove",R),f.addEventListener("pointerup",C),f.addEventListener("pointercancel",C)})};l(o,"scale"),l(n,"rotate");let c=new Map,h=null,p=0;e.addEventListener("pointerdown",f=>{f.preventDefault(),f.stopPropagation();let m=performance.now();if(m-p<320){this.selectedTextId=t.id,this.syncTextControls(t),this.openInlineTextEditor(e,t),p=0;return}p=m,this.selectedTextId=t.id,this.syncTextControls(t);try{e.setPointerCapture(f.pointerId)}catch{}if(c.set(f.pointerId,{x:f.clientX,y:f.clientY}),c.size===1)h={mode:"drag",ox:f.clientX,oy:f.clientY,startOX:t.x,startOY:t.y,startDist:0,startAngle:0,startSize:t.size,startRot:t.rotation,midX:f.clientX,midY:f.clientY,lastX:f.clientX,lastY:f.clientY,velX:0,velY:0};else if(c.size===2){let[g,x]=Array.from(c.values()),_=x.x-g.x,y=x.y-g.y;h={mode:"pinch",ox:0,oy:0,startOX:t.x,startOY:t.y,startDist:Math.max(1,Math.hypot(_,y)),startAngle:Math.atan2(y,_),startSize:t.size,startRot:t.rotation,midX:(g.x+x.x)/2,midY:(g.y+x.y)/2,lastX:f.clientX,lastY:f.clientY,velX:0,velY:0}}}),e.addEventListener("pointermove",f=>{if(!h)return;c.set(f.pointerId,{x:f.clientX,y:f.clientY});let m=this.displayCropRect();if(!(!m||m.width<2||m.height<2)){if(h.mode==="drag"){let g=f.clientX-h.ox,x=f.clientY-h.oy,_=h.startOX+g/m.width,y=h.startOY+x/m.height;_=_<0?_*.55:_>1?1+(_-1)*.55:_,y=y<0?y*.55:y>1?1+(y-1)*.55:y,t.x=nt(_),t.y=nt(y),h.velX=f.clientX-h.lastX,h.velY=f.clientY-h.lastY,h.lastX=f.clientX,h.lastY=f.clientY,this.positionTexts()}else if(h.mode==="pinch"){let[g,x]=Array.from(c.values()),_=x.x-g.x,y=x.y-g.y,w=Math.max(1,Math.hypot(_,y)),T=Math.atan2(y,_),k=w/h.startDist,E=h.startSize*k;t.size=E,t.size<.02&&(t.size=.02+(t.size-.02)*.5),t.size>.24&&(t.size=.24+(t.size-.24)*.5),t.size=S(t.size,.015,.3);let L=(T-h.startAngle)*180/Math.PI;t.rotation=Math.round((h.startRot+L+540)%360-180);let R=(g.x+x.x)/2,C=(g.y+x.y)/2,z=R-h.midX,I=C-h.midY;t.x=nt(h.startOX+z/m.width),t.y=nt(h.startOY+I/m.height),this.positionTexts()}}});let v=f=>{if(c.delete(f.pointerId),c.size===0&&h){let m=t.size,g=S(m,.02,.24);if(Math.abs(m-g)>.001){let x=0,_=m,y=performance.now(),w=T=>{let k=Math.min(.032,(T-y)/1e3);y=T;let E=120,L=22,R=1,C=-E*(_-g)-L*x;x+=C/R*k,_+=x*k,t.size=_,this.positionTexts(),Math.abs(_-g)>5e-4||Math.abs(x)>.5?requestAnimationFrame(w):(t.size=g,this.positionTexts())};requestAnimationFrame(w)}this.syncTextControls(t),h=null}else if(c.size===1&&h){let[m]=Array.from(c.values());h={mode:"drag",ox:m.x,oy:m.y,startOX:t.x,startOY:t.y,startDist:0,startAngle:0,startSize:t.size,startRot:t.rotation,midX:m.x,midY:m.y,lastX:m.x,lastY:m.y,velX:0,velY:0}}};return e.addEventListener("pointerup",v),e.addEventListener("pointercancel",v),e.addEventListener("dblclick",f=>{f.preventDefault(),this.selectedTextId=t.id,this.syncTextControls(t),this.openInlineTextEditor(e,t)}),this.syncTextLayerStyle(e,t),e}syncTextLayerEl(t){let e=this.textLayer?.querySelector(`[data-text-id="${t.id}"]`);if(!e)return;let r=e.querySelector(".au-text-span");r?r.textContent=t.text:e.textContent=t.text,e.querySelector(".au-text-handle--scale"),this.syncTextLayerStyle(e,t),this.positionTexts()}openInlineTextEditor(t,e){let r=t.querySelector(".au-text-inline");if(r){r.focus();return}let s=document.createElement("textarea");s.className="au-text-inline",s.value=e.text,s.rows=1,s.maxLength=120,s.spellcheck=!1,s.placeholder=this.s.textInput,s.setAttribute("aria-label",this.s.textInput),s.addEventListener("pointerdown",n=>n.stopPropagation()),s.addEventListener("input",()=>{e.text=s.value;let n=t.querySelector(".au-text-span");n&&(n.textContent=e.text),this.positionTexts()});let o=()=>{e.text=s.value;let n=t.querySelector(".au-text-span");n&&(n.textContent=e.text),s.remove(),this.syncTextLayerEl(e),this.positionTexts()};s.addEventListener("keydown",n=>{n.key==="Enter"&&!n.shiftKey&&(n.preventDefault(),o()),n.key==="Escape"&&(n.preventDefault(),o())}),s.addEventListener("blur",o),t.appendChild(s),requestAnimationFrame(()=>{s.focus(),s.select()})}syncTextLayerStyle(t,e){let r=Zt.find(n=>n.id===e.font)??Zt[0],s=this.displayCropRect(),o=Math.max(10,(s?s.height:320)*e.size);t.style.fontFamily=r.stack,t.style.fontSize=`${o}px`,t.style.color=e.color,t.style.fontWeight=e.bold?"700":"400",t.style.fontStyle=e.italic?"italic":"normal",t.style.textAlign=e.align,t.style.opacity=String(e.opacity),t.classList.toggle("is-selected",e.id===this.selectedTextId),t.classList.toggle("is-outline",e.outline),t.classList.toggle("is-shadow",e.shadow&&!e.outline),t.classList.toggle("show-frame",this.textShowFrame)}syncTextControls(t){this.textInput&&(this.textInput.value=t.text),this.textSizeTicks&&this.textSizeTicks.set(Math.round(t.size*100),!1),this.textOpacityTicks&&(document.activeElement===this.textOpacityTicks.rail||this.textOpacityTicks.set(Math.round(t.opacity*100),!1)),this.textRotateTicks&&this.textRotateTicks.set(Math.round(t.rotation),!1);for(let e of Array.from(this.textLayer.querySelectorAll(".au-textnode"))){let r=this.texts.find(s=>s.id===e.dataset.textId);r&&this.syncTextLayerStyle(e,r)}}setPeekOriginal(t){if(this.peekOn===t)return;if(this.peekOn=t,this.peekBtn?.classList.toggle("is-on",t),this.peekBtn?.setAttribute("aria-pressed",String(t)),this.peekCanvas&&(this.peekCanvas.style.display="none"),!t){if(this.peekSavedState){let s=this.peekSavedState;this.peekSavedState=null;try{this.setState(s,{history:!1,silent:!0})}catch{}this.syncUI()}this.refineOn&&this.drawRefinePreview();return}if(!this.isReady)return;if(this.refineOn){this.drawRefinePreview();return}let e=this.getState();this.peekSavedState=e;let r=Object.fromEntries(Object.keys(e.adjust).map(s=>[s,0]));try{this.setState({...e,filter:"original",adjust:r,enhance:Ct(),retouch:{liquify:[]}},{history:!1,silent:!0})}catch{this.peekSavedState=null}}imageDisplayRect(){if(!this.isReady)return null;let t=this.screenPointAt(0,0),e=this.screenPointAt(1,0),r=this.screenPointAt(0,1),s=this.screenPointAt(1,1);if(!t||!e||!r||!s)return this.displayCropRect();let o=Math.min(t.x,e.x,r.x,s.x),n=Math.min(t.y,e.y,r.y,s.y),u=Math.max(t.x,e.x,r.x,s.x),l=Math.max(t.y,e.y,r.y,s.y);return{x:o,y:n,width:Math.max(1,u-o),height:Math.max(1,l-n)}}cropUVRect(){let t={u0:0,v0:0,u1:1,v1:1};if(!this.isReady)return t;let e=this.currentFrame(),r=this.stage.getBoundingClientRect(),o=[{x:e.x,y:e.y},{x:e.x+e.width,y:e.y},{x:e.x,y:e.y+e.height},{x:e.x+e.width,y:e.y+e.height}].map(l=>this.sourcePointAt(r.left+l.x,r.top+l.y));if(o.some(l=>!l))return t;let n=o.map(l=>l.x),u=o.map(l=>l.y);return{u0:Math.min(...n),v0:Math.min(...u),u1:Math.max(...n),v1:Math.max(...u)}}resizeMaskCrop(t,e,r,s,o,n){let u=new Float32Array(o*n);for(let l=0;l<n;l++){let h=(s.v0+(l+.5)/n*(s.v1-s.v0))*r-.5,p=Math.max(0,Math.floor(h)),v=Math.min(r-1,p+1),f=Math.min(1,Math.max(0,h-p));for(let m=0;m<o;m++){let x=(s.u0+(m+.5)/o*(s.u1-s.u0))*e-.5,_=Math.max(0,Math.floor(x)),y=Math.min(e-1,_+1),w=Math.min(1,Math.max(0,x-_)),T=(t[p*e+_]??0)*(1-w)+(t[p*e+y]??0)*w,k=(t[v*e+_]??0)*(1-w)+(t[v*e+y]??0)*w;u[l*o+m]=T*(1-f)+k*f}}return u}displayCropRect(){if(!this.isReady)return null;let t=this.viewport(),e=this.currentFrame();if(e.width<2||e.height<2)return null;let r=Math.min(t.width/e.width,t.height/e.height),s=e.width*r,o=e.height*r;return{x:(t.width-s)/2,y:(t.height-o)/2,width:s,height:o}}positionTexts(){if(!this.textLayer)return;let t=this.isReady&&this.currentTab!=="crop";if(this.textLayer.style.display=t?"block":"none",!t)return;let e=this.imageDisplayRect()??this.displayCropRect();if(e)for(let r of Array.from(this.textLayer.querySelectorAll(".au-textnode"))){let s=this.texts.find(c=>c.id===r.dataset.textId);if(!s)continue;let o=this.screenPointAt(s.x,s.y),n=o?o.x:e.x+s.x*e.width,u=o?o.y:e.y+s.y*e.height;r.style.transform=`translate(-50%,-50%) translate(${n}px,${u}px) rotate(${s.rotation}deg)`;let l=Math.max(10,e.height*s.size);r.style.fontSize!==`${l}px`&&(r.style.fontSize=`${l}px`)}}deleteSelectedText(){if(!this.selectedTextId)return;this.texts=this.texts.filter(e=>e.id!==this.selectedTextId),this.selectedTextId=this.texts[0]?.id??null,this.textLayer?.querySelector(`[data-text-id="${this.selectedTextId}"]`),this.textLayer.replaceChildren();for(let e of this.texts)this.textLayer.appendChild(this.createTextNode(e));let t=this.selectedLayer();t?this.syncTextControls(t):this.textInput&&(this.textInput.value=""),this.positionTexts()}duplicateSelectedText(){let t=this.selectedLayer();if(!t)return;let e={...t,id:`t${Date.now().toString(36)}${Math.floor(Math.random()*1e4).toString(36)}`,x:nt(t.x+.05),y:nt(t.y+.05)};this.texts.push(e),this.selectedTextId=e.id,this.textLayer.appendChild(this.createTextNode(e)),this.syncTextControls(e),this.positionTexts()}async runBackground(t){if(this.bgBusy||!this.isReady)return;if(!this.backgroundAction){this.toast(this.s.bgNeedHost,!0);return}let e=new AbortController;this.bgBusy=!0,this.bgAbort=e,this.bgPanel.hidden=!1,this.bgPanel.classList.add("is-open"),this.bgDetail.textContent=this.s.bgRunning;let r=this.sourceBitmap(),s=this.source();try{let o=await this.backgroundAction.run(this,{signal:e.signal,report:(n,u)=>{u&&(this.bgDetail.textContent=u)},modelId:this.bgModel},t,this.bgModel);if(e.signal.aborted)return;if(o&&o.mask){let n=o;r?(this.enterRefine(r,s.width,s.height,n.mask,n.maskWidth,n.maskHeight,t,n.modelId),this.toast("AI xong — chỉnh cọ rồi Hoàn tất")):this.toast(this.s.bgDone);return}e.signal.aborted||this.toast(this.s.bgDone)}catch(o){ot(o)||e.signal.aborted?this.toast(this.s.aiCancelled):this.toast(this.s.bgFailed,!0)}finally{this.bgBusy=!1,this.bgAbort=null,this.bgPanel.classList.remove("is-open"),this.bgPanel.hidden=!0}}async runRetouch(t){if(this.bgBusy||!this.isReady)return;if(!this.retouchAction){this.toast(this.s.bgNeedHost,!0);return}let e=new AbortController;this.bgBusy=!0,this.bgAbort=e,this.bgPanel.hidden=!1,this.bgPanel.classList.add("is-open"),this.bgDetail.textContent=this.s.bgRunning;let r=this.sourceBitmap(),s=this.source();try{let o=await this.retouchAction.run(this,{signal:e.signal,report:(n,u)=>{u&&(this.bgDetail.textContent=u)}},t);if(e.signal.aborted)return;if(o&&o.mask&&o.whitened){let n=o;if(r){this.enterRetouchBrush(r,s.width,s.height,n.mask,n.maskWidth,n.maskHeight,n.whitened,n.whitenWidth,n.whitenHeight,t),this.toast(this.s.retouchBrushReady);return}}e.signal.aborted||this.toast(this.s.retouchDone)}catch(o){if(ot(o)||e.signal.aborted)this.toast(this.s.aiCancelled);else{console.error("[aurum] retouch failed:",o);let n=o instanceof Error?o.message:String(o??"");this.bgDetail.textContent=`${this.s.retouchFailed} — ${n.slice(0,120)}`,this.bgPanel.classList.add("is-open"),this.bgPanel.hidden=!1,this.toast(n?`${this.s.retouchFailed} — ${n.slice(0,60)}`:this.s.retouchFailed,!0);return}}finally{this.bgBusy=!1,this.bgAbort=null,this.bgPanel.classList.remove("is-open"),this.bgPanel.hidden=!0}}async compositeTexts(t){if(!this.texts.length)return t;let e=null;try{e=await createImageBitmap(t)}catch{let h=URL.createObjectURL(t),p=new Image;p.src=h;try{await p.decode(),e=p}catch{e=null}window.setTimeout(()=>URL.revokeObjectURL(h),4e3)}if(!e)return t;let r=document.createElement("canvas");r.width=e.width,r.height=e.height;let s=r.getContext("2d");if(!s)return t;s.drawImage(e,0,0);let o=r.width,n=r.height;for(let h of this.texts){let p=h.text.trim();if(!p)continue;let v=Zt.find(m=>m.id===h.font)??Zt[0],f=Math.max(8,n*h.size);s.save(),s.translate(h.x*o,h.y*n),s.rotate((h.rotation||0)*Math.PI/180),s.globalAlpha=nt(h.opacity),s.font=`${h.italic?"italic ":""}${h.bold?"700 ":"400 "}${f}px ${v.stack}`,s.textAlign=h.align,s.textBaseline="middle",h.outline?(s.lineWidth=Math.max(1,f*.09),s.strokeStyle="rgba(0,0,0,.85)",s.lineJoin="round",s.strokeText(p,0,0)):h.shadow&&(s.shadowColor="rgba(0,0,0,.45)",s.shadowBlur=f*.18,s.shadowOffsetY=f*.04),s.fillStyle=h.color,s.fillText(p,0,0),s.restore()}let u=t.type||this.exportType,l=u==="image/png"?void 0:this.quality/100;return await new Promise(h=>{u==="image/png"?r.toBlob(h,u):r.toBlob(h,u,l)})??t}async runAIAction(){if(!this.aiAction||this.aiBusy||!this.isReady||this.saving)return;let t=new AbortController;this.aiBusy=!0,this.aiAbort=t,this.aiBtn&&(this.aiBtn.disabled=!0,this.aiBtn.classList.add("is-busy")),this.setAICompareVisible(!1),this.aiPanel.hidden=!1,this.aiPanel.classList.add("is-open"),this.reportAI(-1,this.s.aiPreparing);try{await this.aiAction.run(this,{signal:t.signal,report:(e,r)=>this.reportAI(e,r)}),t.signal.aborted||(this.setAICompareVisible(this.canRevertAI()),this.toast(this.s.aiDone))}catch(e){ot(e)||t.signal.aborted?this.toast(this.s.aiCancelled):this.toast(e instanceof Error&&e.message?e.message:this.s.aiFailed,!0)}finally{this.aiBusy=!1,this.aiAbort=null,this.aiBtn&&(this.aiBtn.disabled=!1,this.aiBtn.classList.remove("is-busy")),this.aiPanel.classList.remove("is-open"),this.aiPanel.hidden=!0,this.aiPanel.classList.remove("is-indeterminate"),this.aiBar.style.width="0%"}}buildToast(){let t=b("div","au-toast");t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),this.root.appendChild(t),this.toastEl=t}bindEvents(){this.on("ready",()=>{this.root.classList.add("au-ready"),this.setLiquify(!1),this.texts=[],this.selectedTextId=null,this.textLayer?.replaceChildren(),this.textInput&&(this.textInput.value=""),this.positionTexts(),this.setAICompareVisible(!1),this.buildFilters(),this.fitToFrame(),this.positionFrame(this.currentFrame()),this.syncUI(),this.setCropMode(this.cropMode),window.requestAnimationFrame(()=>{this.centerMode(this.cropMode),this.centerAspectChip(this.getState().crop.aspect,!1)})}),this.on("loading",({loading:t})=>{this.root.classList.toggle("au-busy",t),t&&this.root.classList.remove("au-dragover")}),this.on("change",()=>{this.syncUI(),this.positionFrame(this.currentFrame())}),this.on("history",()=>this.syncHistory()),this.on("render",({frame:t})=>{if(this.positionFrame(t),this.positionTexts(),this.refineOn&&this.currentTab==="ai"?this.drawRefinePreview():this.positionRefineCanvas(),this.peekOn&&this.peekCanvas){let e=this.imageDisplayRect()??this.displayCropRect();e&&(this.peekCanvas.style.left=`${e.x}px`,this.peekCanvas.style.top=`${e.y}px`,this.peekCanvas.style.width=`${e.width}px`,this.peekCanvas.style.height=`${e.height}px`)}}),this.on("error",({error:t})=>this.toast(t.message||this.s.exportFailed,!0)),this.frameEl.addEventListener("pointerdown",this.onCropPointerDown),this.frameEl.addEventListener("keydown",this.onCropKeyDown),this.stage.addEventListener("pointerdown",this.tapToPlaceText),this.root.addEventListener("keydown",t=>{if(t.key==="Escape"&&this.sheetWrap.classList.contains("is-open")){t.preventDefault(),this.closeSheet();return}if(t.key==="Tab"&&this.sheetWrap.classList.contains("is-open")){let r=Array.from(this.sheetWrap.querySelectorAll('button:not([disabled]),input:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')).filter(u=>u.getClientRects().length>0);if(!r.length)return;let s=r[0],o=r[r.length-1],n=document.activeElement;t.shiftKey&&(n===s||!this.sheetWrap.contains(n))?(t.preventDefault(),o.focus()):!t.shiftKey&&(n===o||!this.sheetWrap.contains(n))&&(t.preventDefault(),s.focus());return}if(!t.metaKey&&!t.ctrlKey)return;let e=t.key.toLowerCase();e==="z"?(t.preventDefault(),t.shiftKey?this.redo():this.undo()):e==="y"&&(t.preventDefault(),this.redo())})}aspectLabel(t){return t==="free"?this.s.aspectFree:t==="screen"?this.s.aspectScreen:t}cancel(){if(this.onCloseCb){this.onCloseCb();return}this.root.dispatchEvent(new CustomEvent("aurum:cancel",{bubbles:!0})),this.reset(),this.setTab("crop"),this.toast(this.s.cancelled)}async openSource(t){try{await this.load(t)}catch{}}setTab(t){t!=="adjust"&&this.setLiquify(!1),t!=="text"&&this.textPlacing&&(this.textPlacing=!1,this.textPlaceBtn?.setAttribute("aria-pressed","false"),this.textPlaceBtn?.classList.remove("is-active"),this.root.classList.remove("au-text-placing")),t!=="crop"&&(this.cropDrag&&this.endCropDrag(),this.clearTransient()),this.currentTab=t;for(let[r,s]of this.tabButtons){let o=r===t;s.setAttribute("aria-selected",String(o)),s.tabIndex=o?0:-1}for(let[r,s]of this.panes)s.classList.toggle("is-active",r===t);let e=t!=="crop";if(this.setResultMode(e),this.root.classList.toggle("is-result",e),this.refineOn&&t==="ai"&&this.brushZoom)try{this.gesture.setEnabled(!0)}catch{}this.refineCanvas&&(this.refineCanvas.style.display=this.refineOn&&t==="ai"?"block":"none"),this.refineOn&&t==="ai"&&this.drawRefinePreview(),this.positionTexts(),e||(this.positionFrame(this.currentFrame()),window.requestAnimationFrame(()=>{this.centerMode(this.cropMode),this.isReady&&this.centerAspectChip(this.getState().crop.aspect,!1)}))}clearTransient(){this.root.classList.remove("au-cropping","au-ratioing","au-rotating"),this.frameEl?.classList.remove("is-rotating"),this.ratioTimer&&(window.clearTimeout(this.ratioTimer),this.ratioTimer=0),this.cropKeyTimer&&(window.clearTimeout(this.cropKeyTimer),this.cropKeyTimer=0)}beginRotationDrag(){this.root.classList.add("au-rotating"),this.frameEl.classList.add("is-rotating")}endRotationDrag(){this.root.classList.remove("au-rotating"),this.frameEl.classList.remove("is-rotating")}centerMode(t){let e=t==="ratio"?this.ratioBtn:t==="rotation"?this.rotationBtn:t==="perspectiveY"?this.perspectiveYBtn:this.perspectiveXBtn;if(!this.modesWrap||!this.modesTrack||!e)return;let r=this.modesWrap.clientWidth;if(r<=0)return;let s=this.modesTrack.scrollWidth,o=s<=r?(r-s)/2:S(r/2-(e.offsetLeft+e.offsetWidth/2),r-s,0);this.modesTrack.style.transform=`translate3d(${o}px,0,0)`}centerAspectChip(t,e=!0){let r=this.aspectButtons.get(t),s=this.chipsEl;if(!r||!s)return;let o=s.clientWidth;if(o<=0)return;let n=r.offsetLeft-(o-r.offsetWidth)/2,u=S(n,0,Math.max(0,s.scrollWidth-o)),l=typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;e&&!l&&typeof s.scrollTo=="function"?s.scrollTo({left:u,behavior:"smooth"}):s.scrollLeft=u}markRatioing(){this.root.classList.add("au-ratioing"),this.ratioTimer&&window.clearTimeout(this.ratioTimer),this.ratioTimer=window.setTimeout(()=>{this.root.classList.remove("au-ratioing"),this.ratioTimer=0},520)}markCropKeying(){this.root.classList.add("au-cropping"),this.cropKeyTimer&&window.clearTimeout(this.cropKeyTimer),this.cropKeyTimer=window.setTimeout(()=>{this.root.classList.remove("au-cropping"),this.cropKeyTimer=0},420)}chooseAspect(t){this.isReady&&(this.setAspect(t),this.markRatioing(),this.positionFrame(this.currentFrame()))}setCropMode(t){this.cropMode=t;let e=t==="ratio",r=t==="rotation",s=t==="perspectiveY",o=t==="perspectiveX";this.ratioBtn.classList.toggle("is-active",e),this.ratioBtn.setAttribute("aria-pressed",String(e)),this.rotationBtn.classList.toggle("is-active",r),this.rotationBtn.setAttribute("aria-pressed",String(r)),this.perspectiveYBtn.classList.toggle("is-active",s),this.perspectiveYBtn.setAttribute("aria-pressed",String(s)),this.perspectiveXBtn.classList.toggle("is-active",o),this.perspectiveXBtn.setAttribute("aria-pressed",String(o)),this.ratioContext.classList.toggle("is-active",e),this.rotationContext.classList.toggle("is-active",r),this.perspectiveYContext.classList.toggle("is-active",s),this.perspectiveXContext.classList.toggle("is-active",o),this.cropResetBtn.classList.toggle("is-left",e);let n=e?this.s.resetCrop:r?this.s.resetRotation:s?this.s.resetPerspectiveY:this.s.resetPerspectiveX;this.cropResetBtn.title=n,this.cropResetBtn.setAttribute("aria-label",n),window.requestAnimationFrame(()=>{this.centerMode(t),e&&this.isReady&&this.centerAspectChip(this.getState().crop.aspect,!0)})}resetCropMode(){this.cropMode==="rotation"?this.resetRotation():this.cropMode==="perspectiveY"?(this.setPerspective({perspectiveY:0},"perspective"),this.syncUI()):this.cropMode==="perspectiveX"?(this.setPerspective({perspectiveX:0},"perspective"),this.syncUI()):(this.resetCrop(),this.markRatioing(),this.positionFrame(this.currentFrame()))}buildLiquifyOverlay(){let t=b("div","au-brush-ring");t.setAttribute("aria-hidden","true"),this.stage.appendChild(t),this.liquifyRing=t,this.stage.addEventListener("pointerdown",this.onLiquifyPointerDown,{passive:!1}),this.stage.addEventListener("pointermove",this.onLiquifyPointerMove,{passive:!1}),this.stage.addEventListener("pointerup",this.onLiquifyPointerUp),this.stage.addEventListener("pointercancel",this.onLiquifyPointerUp),this.stage.addEventListener("pointerleave",()=>{!this.liquifyStroke&&this.liquifyRing&&(this.liquifyRing.style.display="none")})}setLiquify(t){t&&!this.isReady||this.liquifyOn!==t&&(this.liquifyOn=t,this.root.classList.toggle("au-liquify",t),this.liquifyButton?.setAttribute("aria-pressed",String(t)),this.adjustContext&&(this.adjustContext.style.display=t?"none":""),this.liquifyContext&&(this.liquifyContext.style.display=t?"":"none"),this.stage.style.cursor=t?"crosshair":"grab",t?(this.liquifyTicks?.set(this.liquifySize,!1),this.liquifyValue&&(this.liquifyValue.textContent=`${this.liquifySize}%`),this.liquifyButton&&window.requestAnimationFrame(()=>this.centerAdjustChip(this.liquifyButton))):(this.liquifyStroke=null,this.liquifyRing&&(this.liquifyRing.style.display="none")))}setLiquifySize(t,e=!0){let r=S(Math.round(t),1,20);this.liquifySize=r,e&&this.liquifyTicks?.set(r,!1),this.liquifyValue&&(this.liquifyValue.textContent=`${r}%`)}clearLiquifyDabs(){!this.isReady||!this.hasLiquify()||(this.clearLiquify(),this.syncUI())}liquifyRadius(){return this.liquifySize/100}liquifyScreenRadius(){let t=this.liquifyRadius(),e=this.screenPointAt(.5,.5),r=this.screenPointAt(Math.min(1,.5+t),.5);return!e||!r?24:Math.max(4,Math.hypot(r.x-e.x,r.y-e.y))}previewLiquifyRing(t,e){let r=this.liquifyRing;if(!r)return;if(!this.liquifyOn){r.style.display="none";return}let s=this.sourcePointAt(t,e),o=s?this.screenPointAt(s.x,s.y):null;if(!o){r.style.display="none";return}let n=this.liquifyScreenRadius();r.style.display="block",r.style.width=`${n*2}px`,r.style.height=`${n*2}px`,r.style.transform=`translate3d(${o.x-n}px,${o.y-n}px,0)`}selectAdjust(t){this.liquifyOn&&this.setLiquify(!1),this.adjustKey=t;for(let[n,u]of this.adjustButtons)u.setAttribute("aria-pressed",String(n===t));let[e,r]=it[t];this.adjustTicks.setRange(e,r,1,2,e<0),this.adjustTicks.setLabel(this.s[t]);let s=this.isReady?Math.round(this.getState().adjust[t]):0;this.adjustTicks.set(s,!1),this.adjustValue.textContent=this.formatAdjust(s),this.adjustValue.title=`${this.s.reset}: ${this.s[t]}`,this.adjustValue.setAttribute("aria-label",`${this.s.reset}: ${this.s[t]}`);let o=this.adjustButtons.get(t);o&&window.requestAnimationFrame(()=>this.centerAdjustChip(o))}centerAdjustChip(t){let e=this.paramsEl;if(!e||this.currentTab!=="adjust")return;let r=t.getBoundingClientRect(),s=e.getBoundingClientRect();if(!r.width||!s.width)return;let o=r.left-s.left-(s.width-r.width)/2;Math.abs(o)<1||e.scrollBy({left:o,behavior:"smooth"})}async runAuto(){if(this.autoBusy||!this.isReady)return;this.autoBusy=!0,this.autoBtn.disabled=!0,this.autoBtn.classList.add("is-busy");let t=this.autoLabel.textContent||this.s.auto;this.autoLabel.textContent=this.s.autoRunning;try{await this.autoEnhance(),this.syncUI(),this.toast(this.s.autoDone)}catch(e){ot(e)||this.toast(this.s.autoFailed,!0)}finally{this.autoBusy=!1,this.autoBtn.disabled=!1,this.autoBtn.classList.remove("is-busy"),this.autoLabel.textContent=t}}formatAdjust(t){let[e]=it[this.adjustKey];return e>=0?String(Math.round(t)):wt(Math.round(t))}buildFilters(){let t=this.getPreviewBitmap();if(!t)return;let e=this.source(),r=this.getState().filter;if(this.filterWrap.replaceChildren(),this.filterButtons.clear(),this.savedFilterButtons.clear(),this.userPresets.length){for(let l of this.userPresets){let c=b("button","au-filter au-filter--saved");c.type="button";let h=Qe(t,e.width,e.height,l.filter||"original"),p=b("span");p.textContent=l.name,c.append(h,p),c.setAttribute("aria-pressed",String(this.activeSavedId===l.id)),c.setAttribute("aria-label",`${l.name}`),c.title=`${l.name}`,this.savedFilterButtons.set(l.id,c);let v=()=>{this.userPresets=this.userPresets.filter(m=>m.id!==l.id),this.activeSavedId===l.id&&(this.activeSavedId=null,this.savedReturnState=null),Fi(this.userPresets),this.renderSavedPresets(),this.buildFilters(),this.toast(this.s.presetDeleted)};c.addEventListener("click",()=>this.applyUserPreset(l)),c.addEventListener("contextmenu",m=>{m.preventDefault(),v()});let f=b("span","au-filter--saved-del");f.textContent="×",f.setAttribute("aria-hidden","true"),f.addEventListener("click",m=>{m.stopPropagation(),v()}),c.appendChild(f),this.filterWrap.appendChild(c)}let n=b("span","au-filter-sep"),u=b("b");u.textContent=this.s.defaultFilters,n.appendChild(u),this.filterWrap.appendChild(n)}let s=Lt.filter(n=>this.filterCat==="all"||n.category===this.filterCat);for(let n of s){let u=b("button","au-filter");u.type="button";let l=Qe(t,e.width,e.height,n.id),c=b("span"),h=this.locale==="en"?n.labelEn:n.label;c.textContent=h,u.append(l,c),u.setAttribute("aria-pressed",String(r===n.id)),u.setAttribute("aria-label",h),u.addEventListener("click",()=>{r===n.id&&n.id!=="original"?(this.activeSavedId=null,this.savedReturnState=null,this.setFilter("original"),this.syncUI(),this.buildFilters(),this.toast(this.s.resetFilter)):(this.activeSavedId=null,this.savedReturnState=null,this.setFilter(n.id));let p=Lt.find(v=>v.id===n.id);this.filterHint&&p?.hint&&(this.filterHint.textContent=p.hint,this.filterHint.classList.add("is-visible"))}),this.filterWrap.appendChild(u),this.filterButtons.set(n.id,u)}let o=Lt.find(n=>n.id===r);this.filterHint&&o?.hint?this.filterHint.textContent=o.hint:this.filterHint&&(this.filterHint.textContent="")}syncUI(){let t=this.isReady;if(this.root.classList.toggle("au-ready",t),this.saveBtn.disabled=!t,!t)return;let e=this.getState(),r=document.activeElement;for(let[u,l]of this.aspectButtons)l.setAttribute("aria-pressed",String(e.crop.aspect===u));this.lastAspect!==e.crop.aspect&&(this.lastAspect=e.crop.aspect,this.currentTab==="crop"&&this.centerAspectChip(e.crop.aspect,!0)),this.flipButtons.get("flipH")?.classList.toggle("is-on",e.transform.flipH),this.flipButtons.get("flipV")?.classList.toggle("is-on",e.transform.flipV);let s=Math.round(e.adjust[this.adjustKey]);r!==this.adjustTicks.rail&&this.adjustTicks.set(s,!1),this.adjustValue.textContent=this.formatAdjust(s);let o=Math.round(e.transform.rotation);r!==this.rotationControl.rail&&this.rotationControl.set(o,!1),this.rotationValue.textContent=`${o}°`,this.rotationBtn.setAttribute("aria-label",`${this.s.rotation}: ${o}°`),this.syncPerspective();let n=this.aspectLabel(e.crop.aspect);this.ratioValue.textContent=n,this.ratioBtn.setAttribute("aria-label",`${this.s.ratioLabel}: ${n}`);for(let[u,l]of this.filterButtons)l.setAttribute("aria-pressed",String(e.filter===u));for(let[u,l]of this.savedFilterButtons)l.setAttribute("aria-pressed",String(this.activeSavedId===u)),l.classList.toggle("is-active",this.activeSavedId===u);this.syncTuneUI(),this.positionTexts(),this.syncHistory()}syncPerspective(){let t=this.getState().transform,e=Math.round(t.perspectiveX),r=Math.round(t.perspectiveY);this.perspectiveYControl.set(r,!1),this.perspectiveXControl.set(e,!1),this.perspectiveYValue.textContent=wt(r),this.perspectiveXValue.textContent=wt(e),this.perspectiveYBtn.setAttribute("aria-label",`${this.s.perspective}: ${this.s.tiltVertical} ${wt(r)}`),this.perspectiveXBtn.setAttribute("aria-label",`${this.s.perspective}: ${this.s.tiltHorizontal} ${wt(e)}`)}syncHistory(){this.undoBtn.disabled=!this.canUndo(),this.redoBtn.disabled=!this.canRedo()}positionFrame(t){let e=this.frameBox;t.x===e.x&&t.y===e.y&&t.width===e.w&&t.height===e.h||((t.x!==e.x||t.y!==e.y)&&(this.frameEl.style.transform=`translate3d(${t.x}px,${t.y}px,0)`),t.width!==e.w&&(this.frameEl.style.width=`${t.width}px`),t.height!==e.h&&(this.frameEl.style.height=`${t.height}px`),e.x=t.x,e.y=t.y,e.w=t.width,e.h=t.height,this.scrimEl.style.setProperty("--au-crop-x",`${t.x}px`),this.scrimEl.style.setProperty("--au-crop-y",`${t.y}px`),this.scrimEl.style.setProperty("--au-crop-w",`${t.width}px`),this.scrimEl.style.setProperty("--au-crop-h",`${t.height}px`))}dragCrop(t){let e=this.cropDrag;if(!e)return;t.preventDefault();let r=t.clientX-e.startX,s=t.clientY-e.startY,o=e.handle==="e"||e.handle==="tr"||e.handle==="br"?1:e.handle==="w"||e.handle==="tl"||e.handle==="bl"?-1:0,n=e.handle==="s"||e.handle==="br"||e.handle==="bl"?1:e.handle==="n"||e.handle==="tl"||e.handle==="tr"?-1:0;if(e.aspect!=="free"&&e.aspect!=="screen"){let l=1;if(o&&n){let h=Math.max(1,e.frame.width*e.frame.width+e.frame.height*e.frame.height);l=1+(o*r*2*e.frame.width+n*s*2*e.frame.height)/h}else o?l=1+o*r*2/Math.max(1,e.frame.width):n&&(l=1+n*s*2/Math.max(1,e.frame.height));let c=S(e.startScale*l,.2,1);this.setCrop({scale:c},e.key)}else{let l=Math.max(24,e.frame.width+o*r*2),c=Math.max(24,e.frame.height+n*s*2),h=S(l/c,.2,8),p=ne(e.viewport,h),v=S(l/Math.max(1,p.width),.2,1);this.setCrop({aspect:"free",ratio:h,scale:v},e.key)}this.positionFrame(this.currentFrame())}endCropDrag(){let t=this.cropDrag;if(t){this.cropDrag=null,t.handleEl.removeEventListener("pointermove",t.move),t.handleEl.removeEventListener("pointerup",t.end),t.handleEl.removeEventListener("pointercancel",t.end);try{t.handleEl.releasePointerCapture(t.pointerId)}catch{}this.frameEl.classList.remove("is-dragging"),this.frameEl.classList.remove("is-locked"),t.handleEl.classList.remove("is-dragging"),this.root.classList.remove("au-cropping")}}openSheet(){this.isReady&&(this.updateSheet(),this.sheetWrap.classList.add("is-open"),this.sheetWrap.setAttribute("aria-hidden","false"),this.saveImageBtn.focus({preventScroll:!0}))}closeSheet(){this.sheetWrap.classList.remove("is-open"),this.sheetWrap.setAttribute("aria-hidden","true"),this.saveBtn.focus({preventScroll:!0})}updateSheet(){let t=this.getExportSize(),e=Ut.find(n=>n.type===this.exportType)||Ut[0];this.metaName.textContent=this.fileName();let r=this.detectAlpha(),s=this.estimateBytes(t.width,t.height);this.metaInfo.textContent=`${t.width} × ${t.height} px · ${e.label} · ~${s}`,this.exportSubEl.textContent=r&&e.type!=="image/png"?this.locale==="vi"?"Nền trong suốt sẽ bị bẹt trên JPEG/WebP — chọn PNG để giữ.":"Transparency will be flattened on JPEG/WebP — choose PNG to keep it.":this.s.exportSub;for(let[n,u]of this.formatButtons)u.setAttribute("aria-pressed",String(n===this.exportType));let o=this.exportType==="image/png";this.qualityRow.hidden=o,this.qualityControl.setDisabled(o),this.applyQuality(this.quality)}detectAlpha(){try{let t=this.getPreviewBitmap();if(!t)return!1;let e=document.createElement("canvas"),r=Math.min(1,128/Math.max(1,Math.max(t.width,t.height)));e.width=Math.max(1,Math.round(t.width*r)),e.height=Math.max(1,Math.round(t.height*r));let s=e.getContext("2d",{willReadFrequently:!0});if(!s)return!1;s.drawImage(t,0,0,e.width,e.height);let o=s.getImageData(0,0,e.width,e.height).data;for(let n=3;n<o.length;n+=4)if((o[n]??255)<250)return!0;return!1}catch{return!1}}estimateBytes(t,e){let r=t*e,s=this.quality/100,o=0;return this.exportType==="image/png"?o=r*2.2:this.exportType==="image/webp"?o=r*(.08+s*.18):o=r*(.08+s*.22),o<1024*1024?`${Math.max(1,Math.round(o/1024))} KB`:`${(o/(1024*1024)).toFixed(1)} MB`}applyQuality(t){this.quality=S(Math.round(t),10,100),this.qualityControl.set(this.quality,!1)}fileName(){let t=this.exportType==="image/png"?"png":this.exportType==="image/webp"?"webp":"jpg";return`${this.fileBase}.${t}`}async saveImage(t="overwrite"){if(this.saving||!this.isReady)return;let e=t==="copy"?this.onSaveCopyCb:this.onSaveCb;if(t==="copy"&&!e)return;this.saving=!0,this.saveImageBtn.disabled=!0,this.saveCopyBtn&&(this.saveCopyBtn.disabled=!0);let r=t==="copy"?this.saveCopyLabel:this.saveLabel,s=r?.textContent||"",o=t==="copy"?this.saveCopyBtn:this.saveImageBtn;r&&(r.textContent=this.s.saving),o?.setAttribute("aria-busy","true");let n=new AbortController;this.exportAbort=n,this.updateProgress({phase:"render",progress:0,tile:0,tiles:0}),this.progressEl.hidden=!1;try{let u=await this.export({type:this.exportType,quality:this.quality/100,signal:n.signal,onProgress:c=>this.updateProgress(c)});u=await this.compositeTexts(u);let l=this.fileName();this.updateProgress({phase:"encode",progress:1,tile:0,tiles:0}),e?(this.progressLabel.textContent=this.s.uploading,await e(u,l)):this.autoDownload&&nr(u,l),this.closeSheet(),this.toast(t==="copy"?this.s.savedCopy:this.s.saved)}catch(u){if(ot(u))this.toast(this.s.exportCancelled);else{let l=u instanceof Error&&u.message?`: ${u.message}`:"";this.toast(`${this.s.exportFailed}${l}`,!0)}}finally{this.exportAbort=null,this.progressEl.hidden=!0,this.saving=!1,this.saveImageBtn.disabled=!1,this.saveCopyBtn&&(this.saveCopyBtn.disabled=!1),r&&(r.textContent=s),o?.removeAttribute("aria-busy")}}updateProgress(t){let e=Math.round(S(t.progress,0,1)*100);this.progressBar.style.width=`${e}%`,this.progressText.textContent=`${e}%`,this.progressLabel.textContent=t.progress>=1?this.s.encoding:t.phase==="encode"?this.s.encoding:this.s.rendering}toast(t,e=!1){this.toastEl.className=`au-toast${e?" is-error":""}`,this.toastEl.innerHTML=`${U(e?"alert":"check")}<span></span>`;let r=this.toastEl.querySelector("span");r&&(r.textContent=t),this.toastEl.classList.add("is-open"),this.toastTimer&&window.clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>{this.toastEl.classList.remove("is-open"),this.toastTimer=0},2400)}};function lr(a){let i=a<0?0:a>1?1:a;return i<=.04045?i/12.92:Math.pow((i+.055)/1.055,2.4)}function cr(a){let i=a<0?0:a>1?1:a;return i<=.0031308?i*12.92:1.055*Math.pow(i,1/2.4)-.055}var gs="1.0.0";function bs(a){return new Qt(a)}function xs(a){return new At(a)}export{ee as ADJUST_KEYS,it as ADJUST_RANGES,At as AurumCore,Qt as AurumEditor,We as CURVE_PRESETS,Nt as HSL_BANDS,Ge as LUTS,Ri as LUT_SIZE,Ft as MAX_LIQUIFY_DABS,Jt as MAX_LIQUIFY_RADIUS,Oi as MAX_LIQUIFY_SHIFT,Lt as PRESETS,Hi as UI_CSS,ti as analyzeBitmap,ei as autoAdjust,Ca as buildColorTransform,je as buildCurveLUT,$e as buildLUT,Te as buildLiquifyField,ut as cloneState,xs as createCore,bs as createEditor,Sa as curvePreset,Li as curvesAreIdentity,ie as defaultAdjust,re as defaultCrop,se as defaultCurves,Ct as defaultEnhance,Xt as defaultHSL,zt as defaultState,ae as defaultTransform,ui as ensureStyles,ri as getAIAdapter,cr as linearToSrgb,ja as listAIAdapters,Oe as lutById,di as normalizeRetouch,Le as normalizeState,yt as presetById,Je as probeCapabilities,Ya as registerAIAdapter,we as resolveColorSpace,Kt as resolveDither,si as runAIPipeline,Dt as sampleCurve,lr as srgbToLinear,Wa as unregisterAIAdapter,gs as version};
