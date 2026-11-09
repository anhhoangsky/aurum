/*! aurum-image-editor v1.0.0 | MIT | headless core + optional iOS dark/gold UI */
var Ya=Object.defineProperty;var Ga=(i,e,t)=>e in i?Ya(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var d=(i,e,t)=>Ga(i,typeof e!="symbol"?e+"":e,t);var Ht=640,Zt=.35,ja=.09;function Ct(i,e,t){return i<e?e:i>t?t:i}function ke(i,e,t){if(!i.length)return null;let a=64,r=Ct(t/Math.max(1,e),.05,20),o=Math.max(24,Math.min(128,Math.round(a*r))),s=a*o,n=new Float32Array(s),u=new Float32Array(s);for(let f of i){let m=Ct(f.radius,.002,.35),p=m/r,g=Math.max(0,Math.floor((f.x-m)*a)),b=Math.min(a-1,Math.ceil((f.x+m)*a)),y=Math.max(0,Math.floor((f.y-p)*o)),w=Math.min(o-1,Math.ceil((f.y+p)*o));for(let _=y;_<=w;_+=1){let R=((_+.5)/o-f.y)/p;for(let L=g;L<=b;L+=1){let D=((L+.5)/a-f.x)/m,k=D*D+R*R;if(k>=1)continue;let A=1-k,S=A*A,T=_*a+L;n[T]+=f.dx*S,u[T]+=f.dy*S}}}let l=0;for(let f=0;f<s;f+=1)l=Math.max(l,Math.abs(n[f]),Math.abs(u[f]));if(l<1e-6)return null;let c=Math.min(.09,l*1.02),h=new Uint8Array(s*4);for(let f=0;f<s;f+=1){let m=Ct(n[f],-c,c),p=Ct(u[f],-c,c),g=f*4;h[g]=Math.round(Ct(128+m/c*127,0,255)),h[g+1]=Math.round(Ct(128+p/c*127,0,255)),h[g+2]=0,h[g+3]=255}return{width:a,height:o,data:h,shift:c}}var et={brightness:[-100,100],contrast:[-100,100],saturation:[-100,100],exposure:[-100,100],warmth:[-100,100],vignette:[0,100],highlights:[-100,100],shadows:[-100,100],whites:[-100,100],blacks:[-100,100],tint:[-100,100],vibrance:[-100,100],gamma:[-100,100],clarity:[-100,100],sharpen:[0,100],denoise:[0,100],smoothSkin:[0,100],blemish:[0,100],skinTexture:[0,100],skinTone:[-100,100],faceSlim:[-100,100],jawline:[-100,100],chin:[-100,100],eyeSize:[-100,100],noseSize:[-100,100],mouthSize:[-100,100]},te=Object.keys(et),Ft=["red","orange","yellow","green","aqua","blue","purple","magenta"];function ee(){return{brightness:0,contrast:0,saturation:0,exposure:0,warmth:0,vignette:0,highlights:0,shadows:0,whites:0,blacks:0,tint:0,vibrance:0,gamma:0,clarity:0,sharpen:0,denoise:0,smoothSkin:0,blemish:0,skinTexture:55,skinTone:0,faceSlim:0,jawline:0,chin:0,eyeSize:0,noseSize:0,mouthSize:0}}function ae(){return{zoom:1,turn:0,rotation:0,flipH:!1,flipV:!1,offsetX:0,offsetY:0,perspectiveX:0,perspectiveY:0}}function ie(){return{aspect:"free",ratio:3/2,scale:1}}function vt(){return[{x:0,y:0},{x:1,y:1}]}function re(){return{rgb:vt(),r:vt(),g:vt(),b:vt()}}function mt(){return{hue:0,saturation:0,luminance:0}}function Nt(){return{red:mt(),orange:mt(),yellow:mt(),green:mt(),aqua:mt(),blue:mt(),purple:mt(),magenta:mt()}}function oe(){return{curves:re(),hsl:Nt(),lut:"none",lutStrength:100,auto:!1}}function Xt(){return{liquify:[]}}function ha(i){let e=Xt();if(!i||typeof i!="object")return e;let t=i;if(!Array.isArray(t.liquify))return e;let a=[],r=Math.max(0,t.liquify.length-640);for(let o=r;o<t.liquify.length;o+=1){let s=t.liquify[o];if(!s||typeof s!="object")continue;let n=s;!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.dx)||!Number.isFinite(n.dy)||!Number.isFinite(n.radius)||a.push({x:x(n.x,0,1),y:x(n.y,0,1),dx:x(n.dx,-.25,.25),dy:x(n.dy,-.25,.25),radius:x(n.radius,.002,.35)})}return e.liquify=a,e}function Et(){return{version:1,transform:ae(),crop:ie(),adjust:ee(),filter:"original",enhance:oe(),retouch:Xt()}}function Jt(i){return i.map(e=>({x:e.x,y:e.y}))}function st(i){let e=i.enhance||oe(),t=i.retouch||Xt(),a=Nt();for(let r of Ft)a[r]={...e.hsl[r]||a[r]};return{version:1,transform:{...i.transform},crop:{...i.crop},adjust:{...i.adjust},filter:i.filter,enhance:{curves:{rgb:Jt(e.curves.rgb),r:Jt(e.curves.r),g:Jt(e.curves.g),b:Jt(e.curves.b)},hsl:a,lut:e.lut,lutStrength:e.lutStrength,auto:e.auto},retouch:{liquify:t.liquify.map(r=>({...r}))}}}function x(i,e,t){return i<e?e:i>t?t:i}function tt(i,e){return typeof i=="number"&&Number.isFinite(i)?i:e}function Le(i,e){return typeof i=="boolean"?i:e}var Wa=["free","1:1","4:3","3:4","16:9","9:16","screen"];function Me(i){return typeof i=="string"&&Wa.includes(i)}function Rt(i){let e=[];if(Array.isArray(i))for(let r of i){if(!r||typeof r!="object")continue;let o=r;!Number.isFinite(o.x)||!Number.isFinite(o.y)||e.push({x:x(o.x,0,1),y:x(o.y,0,1)})}e.sort((r,o)=>r.x-o.x);let t=[];for(let r of e){let o=t[t.length-1];o&&Math.abs(o.x-r.x)<5e-4?o.y=r.y:t.push(r)}if(t.length<2)return vt();t[0].x>5e-4&&t.unshift({x:0,y:t[0].y});let a=t[t.length-1];if(a.x<.9995&&t.push({x:1,y:a.y}),t.length>16){let r=[t[0]],o=t.length-2,s=14;for(let n=1;n<=s;n+=1){let u=1+Math.round(n*(o-1)/s),l=t[u];l&&l.x>r[r.length-1].x+5e-4&&r.push(l)}return r.push(t[t.length-1]),r}return t}function Oa(i){let e=i||{};return{hue:x(tt(e.hue,0),-100,100),saturation:x(tt(e.saturation,0),-100,100),luminance:x(tt(e.luminance,0),-100,100)}}function se(i){let e=oe();if(!i||typeof i!="object")return e;let t=i,a=t.curves||{};e.curves={rgb:Rt(a.rgb),r:Rt(a.r),g:Rt(a.g),b:Rt(a.b)};let r=t.hsl||{};for(let o of Ft)e.hsl[o]=Oa(r[o]);return e.lut=typeof t.lut=="string"&&/^[a-z0-9-]{1,24}$/i.test(t.lut)?t.lut:"none",e.lutStrength=x(tt(t.lutStrength,100),0,100),e.auto=Le(t.auto,!1),e}function Ae(i){let e=Et();if(!i||typeof i!="object")return e;let t=i,a=t.transform||{},r=t.crop||{},o=t.adjust||{},s=tt(a.rotation,e.transform.rotation),n=Math.round(tt(a.turn,0));e.transform={zoom:x(tt(a.zoom,1),.2,12),turn:(n%4+4)%4,rotation:((s+180)%360+360)%360-180,flipH:Le(a.flipH,!1),flipV:Le(a.flipV,!1),offsetX:x(tt(a.offsetX,0),-4,4),offsetY:x(tt(a.offsetY,0),-4,4),perspectiveX:x(tt(a.perspectiveX,0),-100,100),perspectiveY:x(tt(a.perspectiveY,0),-100,100)};let u=Me(r.aspect)?r.aspect:"free";e.crop={aspect:u,ratio:x(tt(r.ratio,e.crop.ratio),.2,8),scale:x(tt(r.scale,1),.2,1)},e.adjust={...e.adjust};for(let l of te){let[c,h]=et[l];e.adjust[l]=x(tt(o[l],e.adjust[l]),c,h)}return e.filter=typeof t.filter=="string"&&t.filter?t.filter:"original",e.enhance=se(t.enhance),e.retouch=ha(t.retouch),e}var Yt=class{constructor(e=60){d(this,"entries",[]);d(this,"index",-1);d(this,"limit");this.limit=Math.max(2,e)}reset(e){this.entries=[{state:st(e),key:"",at:0}],this.index=0}push(e,t=""){let a=Date.now(),r=this.entries[this.index];if(r&&t&&t===r.key&&a-r.at<900){r.state=st(e),r.at=a;return}this.entries=this.entries.slice(0,this.index+1),this.entries.push({state:st(e),key:t,at:a}),this.entries.length>this.limit&&this.entries.shift(),this.index=this.entries.length-1}undo(){return this.index<=0?null:(this.index-=1,st(this.entries[this.index].state))}redo(){return this.index>=this.entries.length-1?null:(this.index+=1,st(this.entries[this.index].state))}get canUndo(){return this.index>0}get canRedo(){return this.index<this.entries.length-1}get depth(){return this.entries.length}};var Ee=Math.PI/180;function ct(i,e,t){return i<e?e:i>t?t:i}function Ka(i,e,t){switch(i){case"1:1":return 1;case"4:3":return 4/3;case"3:4":return 3/4;case"16:9":return 16/9;case"9:16":return 9/16;case"screen":return e.height>0?e.width/e.height:1;default:return ct(t,.2,8)}}function $a(i){return ct(Math.min(i.width,i.height)*.018,2,8)}function Gt(i){return(i.turn||0)*90+i.rotation}function ne(i,e){let t=$a(i),a=Math.max(24,i.width-t*2),r=Math.max(24,i.height-t*2);return a/r>e?{width:r*e,height:r}:{width:a,height:a/e}}function _t(i,e){let t=Ka(e.aspect,i,e.ratio),a=ne(i,t),r=ct(e.scale,.2,1),o=a.width*r,s=a.height*r;return{x:(i.width-o)/2,y:(i.height-s)/2,width:o,height:s}}function jt(i){let e=i.width/2,t=i.height/2;return[{x:-e,y:-t},{x:e,y:-t},{x:e,y:t},{x:-e,y:t}]}function fa(i,e){let t=Math.cos(e),a=Math.sin(e);return{x:t*i.x-a*i.y,y:a*i.x+t*i.y}}function at(i,e){let t=Math.cos(e),a=Math.sin(e);return{x:t*i.x+a*i.y,y:-a*i.x+t*i.y}}function it(i,e,t,a){let r=Math.max(i.width/e,i.height/t)||1,o=Math.max(.01,a.zoom),s=e*r*o/2,n=t*r*o/2;return{sx:s*(a.flipH?-1:1),sy:n*(a.flipV?-1:1),cover:r,radians:Gt(a)*Ee}}var da=.32;function rt(i){return{a:ct(i.perspectiveY,-100,100)/100*da,b:ct(i.perspectiveX,-100,100)/100*da}}function zt(i,e){let t=1+e.a*i.y+e.b*i.x;return{x:i.x/t,y:i.y/t}}function wt(i,e){let t=1-e.a*i.y-e.b*i.x;return{x:i.x/t,y:i.y/t}}function Va(i,e,t,a,r){let o=Math.max(i.width/e,i.height/t)||1,s=a*Ee,n=jt(r),u=0,l=0;for(let f of n){let m=at(f,s);u=Math.max(u,Math.abs(m.x)),l=Math.max(l,Math.abs(m.y))}let c=u/(e*o/2),h=l/(t*o/2);return Math.max(.2,c,h)}function St(i,e,t,a,r){let o=Va(i,e,t,Gt(a),r),s=rt(a);if(Math.abs(s.a)<1e-4&&Math.abs(s.b)<1e-4)return o;let n=Math.max(i.width/e,i.height/t)||1,u=Gt(a)*Ee,l=jt(r),c=e*n/2,h=t*n/2,f=g=>{let b=c*g*(a.flipH?-1:1),y=h*g*(a.flipV?-1:1);for(let w of l){let _=at(w,u),M=wt({x:_.x/b,y:_.y/y},s);if(Math.abs(M.x)>1.00001||Math.abs(M.y)>1.00001)return!1}return!0};if(f(o))return o;let m=o,p=Math.max(o,12);if(!f(p))return p;for(let g=0;g<24;g+=1){let b=(m+p)/2;f(b)?p=b:m=b}return p}function Ce(i,e,t,a,r,o,s){let n=it(i,e,t,a),u=rt(a);for(let l of jt(r)){let c=at(l,n.radians),h=wt({x:c.x/n.sx-o,y:c.y/n.sy-s},u);if(Math.abs(h.x)>1.00001||Math.abs(h.y)>1.00001)return!1}return!0}function Tt(i,e,t,a,r){let o=rt(a);if(Math.abs(o.a)>1e-4||Math.abs(o.b)>1e-4){let f=a.offsetX,m=a.offsetY;if(Ce(i,e,t,a,r,f,m))return{x:f,y:m};if(!Ce(i,e,t,a,r,0,0))return{x:0,y:0};let p=0,g=1;for(let b=0;b<22;b+=1){let y=(p+g)/2;Ce(i,e,t,a,r,f*y,m*y)?p=y:g=y}return{x:f*p,y:m*p}}let s=it(i,e,t,a),n=jt(r),u=-1/0,l=1/0,c=-1/0,h=1/0;for(let f of n){let m=at(f,s.radians),p=m.x/s.sx,g=m.y/s.sy;u=Math.max(u,p-1),l=Math.min(l,p+1),c=Math.max(c,g-1),h=Math.min(h,g+1)}return u>l&&(u=l=(u+l)/2),c>h&&(c=h=(c+h)/2),{x:ct(a.offsetX,u,l),y:ct(a.offsetY,c,h)}}function pa(i,e,t){let a=at({x:i,y:e},t.radians);return{x:a.x/t.sx,y:a.y/t.sy}}function ue(i,e,t,a,r){let o=it(i,e,t,a),s=rt(a),u=jt(r).map(l=>{let c=at(l,o.radians),h=c.x/o.sx-a.offsetX,f=c.y/o.sy-a.offsetY,m=wt({x:h,y:f},s);return{x:(m.x+1)/2*e,y:(m.y+1)/2*t}});return{tl:u[0],tr:u[1],br:u[2],bl:u[3]}}function ma(i,e,t){let a=i.tl.x,r=i.tl.y,o=i.tr.x,s=i.tr.y,n=i.br.x,u=i.br.y,l=i.bl.x,c=i.bl.y,h=a-o+n-l,f=r-s+u-c,m,p,g,b,y,w,_=0,M=0;if(Math.abs(h)<1e-7&&Math.abs(f)<1e-7)m=o-a,p=n-o,g=a,b=s-r,y=u-s,w=r;else{let P=o-n,D=l-n,k=s-u,A=c-u,S=P*A-D*k;Math.abs(S)<1e-7?(m=o-a,p=n-o,g=a,b=s-r,y=u-s,w=r):(_=(h*A-D*f)/S,M=(P*f-h*k)/S,m=o-a+_*o,p=l-a+M*l,g=a,b=s-r+_*s,y=c-r+M*c,w=r)}let R=Math.max(1,e),L=Math.max(1,t);return[m/R,p/L,g,b/R,y/L,w,_/R,M/L,1]}function ze(i,e,t){let a=i[6]*e+i[7]*t+i[8];return Math.abs(a)<1e-9?{x:0,y:0,w:1}:{x:(i[0]*e+i[1]*t+i[2])/a,y:(i[3]*e+i[4]*t+i[5])/a,w:a}}function Re(i,e){return Math.hypot(e.x-i.x,e.y-i.y)}function Be(i){return{width:Math.max(1,Math.round(Re(i.tl,i.tr))),height:Math.max(1,Math.round(Re(i.tl,i.bl)))}}function De(i){return i.length<2?0:Re(i[0],i[1])}function Ie(i){if(!i.length)return{x:0,y:0};let e=0,t=0;for(let a of i)e+=a.x,t+=a.y;return{x:e/i.length,y:t/i.length}}var le=.24,ce=class{constructor(e){d(this,"host");d(this,"pointers",new Map);d(this,"panStart",null);d(this,"pinchStart",null);d(this,"lastTap",{at:0,x:0,y:0});d(this,"wheelTimer",null);d(this,"disposed",!1);d(this,"enabled",!0);d(this,"onPointerDown",e=>{if(!(!this.enabled||!e.isPrimary&&this.pointers.size===0||e.target?.closest("[data-gesture-ignore]"))&&!(e.pointerType==="mouse"&&e.button!==0)){if(this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}),this.pointers.size===1){let a=this.host.state();this.panStart={id:e.pointerId,x:e.clientX,y:e.clientY,offsetX:a.transform.offsetX,offsetY:a.transform.offsetY,moved:!1},this.pinchStart=null}else this.pointers.size===2&&this.beginPinch();this.host.stage.setPointerCapture?.(e.pointerId),e.preventDefault()}});d(this,"onPointerMove",e=>{this.pointers.has(e.pointerId)&&(this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}),this.pointers.size===1&&this.panStart?this.pan():this.pointers.size>=2&&this.pinchStart&&this.pinch(),e.preventDefault())});d(this,"onPointerUp",e=>{if(!this.pointers.has(e.pointerId))return;let t=this.pointers.size===1,a=this.panStart;if(this.pointers.delete(e.pointerId),this.pointers.size===0)this.panStart=null,this.pinchStart=null,this.finish(t,a,e);else if(this.pointers.size===1){let[r,o]=Array.from(this.pointers.entries())[0],s=this.host.state();this.panStart={id:r,x:o.x,y:o.y,offsetX:s.transform.offsetX,offsetY:s.transform.offsetY,moved:!0},this.pinchStart=null}});d(this,"onPointerCancel",e=>{this.pointers.delete(e.pointerId),this.pointers.size===0&&(this.panStart=null,this.pinchStart=null,this.settle())});d(this,"onWheel",e=>{if(!this.enabled)return;e.preventDefault();let t=this.host.stage.getBoundingClientRect(),a={x:e.clientX-t.left-t.width/2,y:e.clientY-t.top-t.height/2},r=this.host.state(),o=Math.exp(-e.deltaY*.0018),s=this.softZoom(r.transform.zoom*o),n=this.zoomAround(s,a,r.transform);this.host.setTransform(n),this.wheelTimer!==null&&window.clearTimeout(this.wheelTimer),this.wheelTimer=window.setTimeout(()=>{this.wheelTimer=null,this.settle()},220)});this.host=e;let t=e.stage;t.addEventListener("pointerdown",this.onPointerDown),t.addEventListener("pointermove",this.onPointerMove),t.addEventListener("pointerup",this.onPointerUp),t.addEventListener("pointercancel",this.onPointerCancel),t.addEventListener("wheel",this.onWheel,{passive:!1})}beginPinch(){let e=Array.from(this.pointers.values()),t=this.host.state(),a=this.host.stage.getBoundingClientRect(),r=Ie(e);this.pinchStart={distance:Math.max(1,De(e)),mid:{x:r.x-a.left-a.width/2,y:r.y-a.top-a.height/2},zoom:t.transform.zoom,offsetX:t.transform.offsetX,offsetY:t.transform.offsetY},this.panStart=null}stagePoint(e,t){let a=this.host.stage.getBoundingClientRect();return{x:e-a.left-a.width/2,y:t-a.top-a.height/2}}pan(){let e=this.panStart;if(!e)return;let t=this.host.state(),a=it(this.host.viewport(),this.host.source().width,this.host.source().height,t.transform),r=(this.pointers.get(e.id)?.x??e.x)-e.x,o=(this.pointers.get(e.id)?.y??e.y)-e.y;!e.moved&&Math.hypot(r,o)>2.5&&(e.moved=!0);let s=pa(r,o,a),n=e.offsetX+s.x,u=e.offsetY+s.y;this.applyOffsets(n,u,t.transform,!0)}pinch(){let e=this.pinchStart;if(!e)return;let t=Array.from(this.pointers.values()),a=Math.max(1,De(t)),r=this.host.state(),o=this.softZoom(e.zoom*(a/e.distance)),s=this.pointers.values().next().value,n=this.host.stage.getBoundingClientRect(),u=Ie(t),l={x:u.x-n.left-n.width/2,y:u.y-n.top-n.height/2},c=this.zoomAround(o,l,{...r.transform,zoom:e.zoom,offsetX:e.offsetX,offsetY:e.offsetY},e.mid,s);this.host.setTransform(c)}zoomAround(e,t,a,r,o,s=!0){let n=this.host.viewport(),u=this.host.source(),l=r||t,c=it(n,u.width,u.height,a),h=rt(a),f=at(l,c.radians),m=wt({x:f.x/c.sx-a.offsetX,y:f.y/c.sy-a.offsetY},h),p=zt(m,h),g=it(n,u.width,u.height,{...a,zoom:e}),b=at(t,g.radians),y=b.x/g.sx-p.x,w=b.y/g.sy-p.y,_=Tt(n,u.width,u.height,{...a,zoom:e,offsetX:y,offsetY:w},this.host.frame());return s?(y=_.x+(y-_.x)*le,w=_.y+(w-_.y)*le):(y=_.x,w=_.y),{zoom:e,offsetX:y,offsetY:w}}softZoom(e){let t=this.minimum(),a=this.host.maxZoom;return e<t?Math.max(t*.6,t+(e-t)*.35):e>a?Math.min(a*1.15,a+(e-a)*.35):e}minimum(){let e=this.host.viewport(),t=this.host.source(),a=this.host.state();return St(e,t.width,t.height,a.transform,this.host.frame())}applyOffsets(e,t,a,r){let o=this.host.viewport(),s=this.host.source(),n=this.host.frame(),u={...a,offsetX:e,offsetY:t},l=Tt(o,s.width,s.height,u,n),c=r?l.x+(e-l.x)*le:l.x,h=r?l.y+(t-l.y)*le:l.y;this.host.setTransform({offsetX:c,offsetY:h})}settle(){let e=this.host.state(),t=this.host.viewport(),a=this.host.source(),r=this.host.frame(),o=this.minimum(),s=ct(e.transform.zoom,o,this.host.maxZoom),n=Tt(t,a.width,a.height,{...e.transform,zoom:s},r);Math.abs(s-e.transform.zoom)>.001||Math.abs(n.x-e.transform.offsetX)>5e-4||Math.abs(n.y-e.transform.offsetY)>5e-4?this.host.settle({zoom:s,offsetX:n.x,offsetY:n.y},420):this.host.commit()}finish(e,t,a){if(e&&t&&!t.moved){let r=Date.now(),o=Math.hypot(a.clientX-this.lastTap.x,a.clientY-this.lastTap.y);if(r-this.lastTap.at<320&&o<22){this.lastTap={at:0,x:0,y:0},this.doubleTap(this.stagePoint(a.clientX,a.clientY));return}this.lastTap={at:r,x:a.clientX,y:a.clientY}}this.settle()}doubleTap(e){let t=this.host.state(),a=this.minimum(),r=t.transform.zoom>a*1.35?a:Math.min(this.host.maxZoom,a*2.2),o=this.zoomAround(r,e,t.transform,void 0,void 0,!1);this.host.settle(o,380)}setEnabled(e){this.enabled!==e&&(this.enabled=e,e||(this.pointers.clear(),this.panStart=null,this.pinchStart=null))}destroy(){if(this.disposed)return;this.disposed=!0;let e=this.host.stage;e.removeEventListener("pointerdown",this.onPointerDown),e.removeEventListener("pointermove",this.onPointerMove),e.removeEventListener("pointerup",this.onPointerUp),e.removeEventListener("pointercancel",this.onPointerCancel),e.removeEventListener("wheel",this.onWheel),this.wheelTimer!==null&&window.clearTimeout(this.wheelTimer)}};function Bt(i="Aborted"){return typeof DOMException<"u"?new DOMException(i,"AbortError"):Object.assign(new Error(i),{name:"AbortError"})}function nt(i){return!!i&&typeof i=="object"&&i.name==="AbortError"}function ht(i){if(i?.aborted)throw Bt()}function he(){return new Promise(i=>{let e=!1,t=()=>{e||(e=!0,i())};typeof requestAnimationFrame=="function"&&requestAnimationFrame(t),setTimeout(t,250)})}var Pe=`attribute vec2 a_pos;
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
`},Qa=Object.keys(de);function va(i,e,t){return i?e?t?"beauty-liquify":"beauty":t?"base-linear-liquify":"base-linear":e?t?"beauty-gamma-liquify":"beauty-gamma":t?"base-liquify":"base"}var Ue=0,qe=1,He=2,Za=new Float32Array(16),Ja=new Float32Array(24),ti=new Float32Array([1,0,0,0,1,0,0,0,1]),ei=[0,0],ut=10,ai=24;function ga(i,e,t,a){let r=i.createShader(e);if(!r)return null;if(i.shaderSource(r,t),i.compileShader(r),!i.getShaderParameter(r,i.COMPILE_STATUS)){let o=i.getShaderInfoLog(r)||"unknown compile error";return console.warn(`[aurum] ${a} shader failed: ${o}`),i.deleteShader(r),null}return r}function ii(i,e){let t=a=>i.getUniformLocation(e,a);return{matrix:t("u_matrix"),warp:t("u_warp"),color:t("u_color"),offset:t("u_offset"),vignette:t("u_vignette"),aspect:t("u_aspect"),vigCenter:t("u_vigCenter"),vigHalf:t("u_vigHalf"),texel:t("u_texel"),textureLoc:t("u_texture"),curveLoc:t("u_curve"),lutLoc:t("u_lut"),maskLoc:t("u_mask"),liquifyLoc:t("u_liquify"),liquifyShift:t("u_liquifyShift"),dither:t("u_dither"),exposure:t("u_exposure"),brightness:t("u_brightness"),contrast:t("u_contrast"),saturation:t("u_saturation"),highlights:t("u_highlights"),shadows:t("u_shadows"),whites:t("u_whites"),blacks:t("u_blacks"),warmth:t("u_warmth"),tint:t("u_tint"),vibrance:t("u_vibrance"),gamma:t("u_gamma"),clarity:t("u_clarity"),sharpen:t("u_sharpen"),denoise:t("u_denoise"),smoothSkin:t("u_smoothSkin"),blemish:t("u_blemish"),skinTexture:t("u_skinTexture"),skinTone:t("u_skinTone"),hasMask:t("u_hasMask"),hasCurve:t("u_hasCurve"),lutStrength:t("u_lutStrength"),lutSize:t("u_lutSize"),quality:t("u_quality"),faces:t("u_faces"),faceCount:t("u_faceCount"),anchors:t("u_anchors"),hasAnchors:t("u_hasAnchors"),hsl:t("u_hsl"),faceSlim:t("u_faceSlim"),jawline:t("u_jawline"),chin:t("u_chin"),eyeSize:t("u_eyeSize"),noseSize:t("u_noseSize"),mouthSize:t("u_mouthSize")}}function Fe(i,e){let t=ga(i,i.VERTEX_SHADER,Pe,`${e} vertex`);if(!t)return null;let a=ga(i,i.FRAGMENT_SHADER,de[e],`${e} fragment`);if(!a)return i.deleteShader(t),null;let r=i.createProgram();if(!r)return i.deleteShader(t),i.deleteShader(a),null;if(i.attachShader(r,t),i.attachShader(r,a),i.bindAttribLocation(r,Ue,"a_pos"),i.bindAttribLocation(r,qe,"a_uv"),i.bindAttribLocation(r,He,"a_w"),i.linkProgram(r),i.deleteShader(t),i.deleteShader(a),!i.getProgramParameter(r,i.LINK_STATUS)){let o=i.getProgramInfoLog(r)||"unknown link error";return console.warn(`[aurum] ${e} program failed: ${o}`),i.deleteProgram(r),null}return{program:r,u:ii(i,r)}}function ri(i,e){if(i.programs.has(e))return i.programs.get(e)??i.fallback;let t=Fe(i.gl,e);return i.programs.set(e,t),t||(console.warn(`[aurum] shader variant "${e}" unavailable; using the fallback program`),i.fallback)}function Ne(i,e){for(let t of e.values())t&&i.deleteProgram(t.program);e.clear()}function oi(i){i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.LINEAR)}function kt(i){let e=i.createTexture();return e?(i.bindTexture(i.TEXTURE_2D,e),oi(i),e):null}function Xe(i,e=!1){let t=null;try{t=i.getContext("webgl",{alpha:!0,premultipliedAlpha:!1,antialias:!1,depth:!1,stencil:!1,preserveDrawingBuffer:e,powerPreference:"high-performance"})}catch{t=null}if(!t)return null;let a=new Map,r=Fe(t,"base");a.set("base",r);let o=r;if(!o){let g=Fe(t,"fallback");a.set("fallback",g),o=g}if(!o)return null;let s=t.createBuffer();if(!s)return Ne(t,a),null;let n=new Float32Array([-1,-1,0,0,1,1,-1,1,0,1,1,1,1,1,1,-1,-1,0,0,1,1,1,1,1,1,-1,1,0,1,1]);t.bindBuffer(t.ARRAY_BUFFER,s),t.bufferData(t.ARRAY_BUFFER,n,t.STATIC_DRAW);let u=kt(t),l=kt(t),c=kt(t),h=kt(t),f=kt(t),m=kt(t),p=kt(t);if(!u||!l||!c||!h||!f||!m||!p){t.deleteBuffer(s);for(let g of[u,l,c,h,f,m,p])g&&t.deleteTexture(g);return Ne(t,a),null}return t.bindTexture(t.TEXTURE_2D,m),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.bindTexture(t.TEXTURE_2D,p),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([255,255,255,255])),{gl:t,buffer:s,texture:u,curveTexture:l,lutTexture:c,maskTexture:h,liquifyTexture:f,anchorTexture:m,whiteTexture:p,programs:a,active:o,fallback:o,maxTexture:Math.min(8192,t.getParameter(t.MAX_TEXTURE_SIZE)),texWidth:1,texHeight:1,curveRef:null,lutRef:null,maskRef:null,liquifyRef:null,anchorRef:null,lutSize:0}}function Ge(i){return i instanceof HTMLImageElement?{width:i.naturalWidth||i.width,height:i.naturalHeight||i.height}:{width:i.width,height:i.height}}function xa(i,e){let{gl:t}=i;try{let a=Ge(e);return t.bindTexture(t.TEXTURE_2D,i.texture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,e),i.texWidth=a.width,i.texHeight=a.height,!0}catch{return!1}}function ya(i,e){let{gl:t}=i;if(e.curve!==i.curveRef&&(e.curve&&(t.bindTexture(t.TEXTURE_2D,i.curveTexture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,256,1,0,t.RGBA,t.UNSIGNED_BYTE,e.curve)),i.curveRef=e.curve),e.lut!==i.lutRef||e.lutSize!==i.lutSize){if(e.lut){let a=Math.max(2,Math.round(e.lutSize));t.bindTexture(t.TEXTURE_2D,i.lutTexture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,a*a,a,0,t.RGBA,t.UNSIGNED_BYTE,e.lut)}i.lutRef=e.lut,i.lutSize=e.lutSize}e.mask!==i.maskRef&&(e.mask&&(t.bindTexture(t.TEXTURE_2D,i.maskTexture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,e.mask.width,e.mask.height,0,t.RGBA,t.UNSIGNED_BYTE,e.mask.data)),i.maskRef=e.mask),e.liquify!==i.liquifyRef&&(e.liquify&&(t.bindTexture(t.TEXTURE_2D,i.liquifyTexture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,e.liquify.width,e.liquify.height,0,t.RGBA,t.UNSIGNED_BYTE,e.liquify.data)),i.liquifyRef=e.liquify)}function si(i){let e=i.matrix;return{matrix:new Float32Array([e[0],e[3],e[6],e[1],e[4],e[7],e[2],e[5],e[8]]),offset:new Float32Array([i.offset[0],i.offset[1],i.offset[2]])}}function ni(i){let e=i.rotation*Math.PI/180,t=Math.cos(e),a=Math.sin(e),r=Math.max(1,i.width/2),o=Math.max(1,i.height/2),s=i.view.scale,n=t*i.sx*s,u=a*i.sx*s,l=-a*i.sy*s,c=t*i.sy*s,h=t*(i.sx*i.offsetX)-a*(i.sy*i.offsetY),f=a*(i.sx*i.offsetX)+t*(i.sy*i.offsetY),m=r+h,p=o+f,g=m*s+i.view.x,b=p*s+i.view.y;return new Float32Array([n/r,-u/o,0,l/r,-c/o,0,(g-r)/r,(o-b)/o,1])}function ui(i){let{gl:e}=i;e.bindBuffer(e.ARRAY_BUFFER,i.buffer),e.enableVertexAttribArray(Ue),e.vertexAttribPointer(Ue,2,e.FLOAT,!1,20,0),e.enableVertexAttribArray(qe),e.vertexAttribPointer(qe,2,e.FLOAT,!1,20,8),e.enableVertexAttribArray(He),e.vertexAttribPointer(He,1,e.FLOAT,!1,20,16)}function _a(i,e){let{gl:t}=i,a=si(e.color),r=e.enhance,o=ri(i,va(r.linear>.5,!!r.mask,!!r.liquify));i.active=o;let s=o.u;t.useProgram(o.program),ui(i),t.uniformMatrix3fv(s.matrix,!1,e.matrix),t.uniform2f(s.warp,e.warp[0],e.warp[1]),t.uniformMatrix3fv(s.color,!1,a.matrix),t.uniform3fv(s.offset,a.offset),t.uniform1f(s.vignette,Math.max(0,Math.min(1,e.vignette))),t.uniform1f(s.aspect,e.aspect),t.uniform2f(s.vigCenter,e.vigCenter[0],e.vigCenter[1]),t.uniform2f(s.vigHalf,e.vigHalf[0],e.vigHalf[1]),t.uniform2f(s.texel,e.texel[0],e.texel[1]),t.uniform1f(s.dither,r.dither),t.uniform1f(s.exposure,r.exposure),t.uniform1f(s.brightness,r.brightness),t.uniform1f(s.contrast,r.contrast),t.uniform1f(s.saturation,r.saturation),t.uniform1f(s.highlights,r.highlights),t.uniform1f(s.shadows,r.shadows),t.uniform1f(s.whites,r.whites),t.uniform1f(s.blacks,r.blacks),t.uniform1f(s.warmth,r.warmth),t.uniform1f(s.tint,r.tint),t.uniform1f(s.vibrance,r.vibrance),t.uniform1f(s.gamma,r.gamma),t.uniform1f(s.clarity,r.clarity),t.uniform1f(s.sharpen,r.sharpen),t.uniform1f(s.denoise,r.denoise),t.uniform1f(s.smoothSkin,r.smoothSkin),t.uniform1f(s.blemish,r.blemish),t.uniform1f(s.skinTexture,r.skinTexture),t.uniform1f(s.skinTone,r.skinTone),t.uniform1f(s.hasMask,r.mask?1:0),t.uniform1f(s.liquifyShift,r.liquify?r.liquify.shift:0),t.uniform1f(s.hasCurve,r.curve?1:0),t.uniform1f(s.lutStrength,r.lut?r.lutStrength:0),t.uniform1f(s.lutSize,Math.max(2,r.lutSize)),t.uniform1f(s.quality,r.quality),t.uniform4fv(s.faces,r.faces||Za),t.uniform1i(s.faceCount,Math.max(0,Math.min(4,r.faceCount))),t.uniform1f(s.hasAnchors,r.anchors?1:0),t.uniform3fv(s.hsl,r.hsl||Ja),t.uniform1f(s.faceSlim,r.faceSlim),t.uniform1f(s.jawline,r.jawline),t.uniform1f(s.chin,r.chin),t.uniform1f(s.eyeSize,r.eyeSize),t.uniform1f(s.noseSize,r.noseSize),t.uniform1f(s.mouthSize,r.mouthSize),t.uniform1i(s.textureLoc,0),t.uniform1i(s.curveLoc,1),t.uniform1i(s.lutLoc,2),t.uniform1i(s.maskLoc,3),t.uniform1i(s.liquifyLoc,4),t.uniform1i(s.anchors,5),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,i.texture),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,r.curve?i.curveTexture:i.whiteTexture),t.activeTexture(t.TEXTURE2),t.bindTexture(t.TEXTURE_2D,r.lut?i.lutTexture:i.whiteTexture),t.activeTexture(t.TEXTURE3),t.bindTexture(t.TEXTURE_2D,r.mask?i.maskTexture:i.whiteTexture),t.activeTexture(t.TEXTURE4),t.bindTexture(t.TEXTURE_2D,r.liquify?i.liquifyTexture:i.whiteTexture),t.activeTexture(t.TEXTURE5),t.bindTexture(t.TEXTURE_2D,r.anchors?i.anchorTexture:i.whiteTexture),r.anchors&&i.anchorRef!==r.anchors&&(t.texImage2D(t.TEXTURE_2D,0,t.RGBA,4,4,0,t.RGBA,t.UNSIGNED_BYTE,r.anchors),i.anchorRef=r.anchors),t.drawArrays(t.TRIANGLES,0,6)}function li(i){let e=Math.max(1,i.width),t=Math.max(1,i.height),a=i.vignetteRect;return{center:[(a.x+a.width/2)/e*2-1,1-(a.y+a.height/2)/t*2],half:[Math.max(1e-4,a.width/e),Math.max(1e-4,a.height/t)],aspect:a.width/Math.max(1,a.height)}}function wa(i){return!i||Math.abs(i.a)<1e-4&&Math.abs(i.b)<1e-4}function ci(i,e,t,a,r,o){let s=e.x-i.x,n=e.y-i.y,u=t.x-i.x,l=t.y-i.y,c=s*l-n*u;if(Math.abs(c)<1e-8)return null;let h=r.x-a.x,f=o.x-a.x,m=r.y-a.y,p=o.y-a.y,g=(h*l-f*n)/c,b=(-h*u+f*s)/c,y=(m*l-p*n)/c,w=(-m*u+p*s)/c;return[g,y,b,w,a.x-g*i.x-b*i.y,a.y-y*i.x-w*i.y]}function fe(i,e,t,a,r,o,s,n,u){let l=ci(t,a,r,o,s,n);l&&(i.save(),i.beginPath(),i.moveTo(o.x,o.y),i.lineTo(s.x,s.y),i.lineTo(n.x,n.y),i.closePath(),i.clip(),i.setTransform(u*l[0],u*l[1],u*l[2],u*l[3],u*l[4],u*l[5]),i.drawImage(e,0,0),i.restore())}function hi(i,e,t){let a=Ge(e),r=Math.max(1,a.width),o=Math.max(1,a.height),s=t.rotation*Math.PI/180,n=Math.cos(s),u=Math.sin(s),l=t.view,c=t.width/2,h=t.height/2,f=(p,g)=>{let b=zt({x:p*2-1,y:g*2-1},t.warp),y=(b.x+t.offsetX)*t.sx,w=(b.y+t.offsetY)*t.sy;return{x:l.x+l.scale*(c+n*y-u*w),y:l.y+l.scale*(h+u*y+n*w)}},m=[];for(let p=0;p<=ut;p+=1){let g=[];for(let b=0;b<=ut;b+=1)g.push(f(b/ut,p/ut));m.push(g)}i.imageSmoothingEnabled=!0,i.imageSmoothingQuality="high";for(let p=0;p<ut;p+=1)for(let g=0;g<ut;g+=1){let b=g/ut,y=(g+1)/ut,w=p/ut,_=(p+1)/ut,M={x:b*r,y:w*o},R={x:y*r,y:w*o},L={x:y*r,y:_*o},P={x:b*r,y:_*o},D=m[p][g],k=m[p][g+1],A=m[p+1][g+1],S=m[p+1][g];fe(i,e,M,R,L,D,k,A,t.dpr),fe(i,e,M,L,P,D,A,S,t.dpr)}}function di(i,e,t){i.save(),i.setTransform(t.dpr,0,0,t.dpr,0,0),i.clearRect(0,0,t.width,t.height),t.clipRect&&t.clipRect.width>0&&t.clipRect.height>0&&(i.beginPath(),i.rect(t.clipRect.x,t.clipRect.y,t.clipRect.width,t.clipRect.height),i.clip()),i.filter=t.css||"none",wa(t.warp)?(i.translate(t.view.x,t.view.y),i.scale(t.view.scale,t.view.scale),i.translate(t.width/2,t.height/2),i.rotate(t.rotation*Math.PI/180),i.scale(t.sx,t.sy),i.translate(t.offsetX,t.offsetY),i.imageSmoothingEnabled=!0,i.imageSmoothingQuality="high",i.drawImage(e,-1,-1,2,2)):hi(i,e,t),i.filter="none",i.restore();let a=t.vignetteRect;if(t.vignette>0&&a.width>0&&a.height>0){i.save(),i.setTransform(t.dpr,0,0,t.dpr,0,0),i.beginPath(),i.rect(a.x,a.y,a.width,a.height),i.clip();let r=a.x+a.width/2,o=a.y+a.height/2,s=Math.max(a.width,a.height)*.74,n=i.createRadialGradient(r,o,Math.min(a.width,a.height)*.22,r,o,s);n.addColorStop(0,"rgba(0,0,0,0)"),n.addColorStop(.62,`rgba(0,0,0,${t.vignette*.25})`),n.addColorStop(1,`rgba(0,0,0,${t.vignette*.88})`),i.fillStyle=n,i.fillRect(a.x,a.y,a.width,a.height),i.restore()}}function fi(i,e,t,a){if(a<=0)return;let r=i.createRadialGradient(e/2,t/2,Math.min(e,t)*.2,e/2,t/2,Math.max(e,t)*.74);r.addColorStop(0,"rgba(0,0,0,0)"),r.addColorStop(.62,`rgba(0,0,0,${a*.25})`),r.addColorStop(1,`rgba(0,0,0,${a*.88})`),i.fillStyle=r,i.fillRect(0,0,e,t)}function Ye(i,e,t){return new Promise((a,r)=>{i.toBlob(o=>o?a(o):r(new Error("Export failed: canvas is empty")),e,t)})}var pe=class{constructor(e){d(this,"canvas");d(this,"glState",null);d(this,"ctx2d",null);d(this,"bitmap",null);d(this,"cssWidth",0);d(this,"cssHeight",0);d(this,"dpr",1);d(this,"textureDirty",!0);d(this,"lastSpec",null);d(this,"contextLost",!1);d(this,"onContextLost",e=>{e.preventDefault(),this.contextLost=!0});d(this,"onContextRestored",()=>{this.contextLost=!1,this.glState=Xe(this.canvas),this.ctx2d=null,this.textureDirty=!0,this.lastSpec&&this.render(this.lastSpec)});this.canvas=e,this.glState=Xe(e),this.glState||(this.ctx2d=e.getContext("2d",{alpha:!0})),e.addEventListener("webglcontextlost",this.onContextLost),e.addEventListener("webglcontextrestored",this.onContextRestored)}get accelerated(){return this.glState!==null&&!this.contextLost}setBitmap(e){this.bitmap=e,this.textureDirty=!0}resize(e,t,a){this.cssWidth=Math.max(1,e),this.cssHeight=Math.max(1,t),this.dpr=Math.max(1,Math.min(3,a||1));let r=Math.max(1,Math.round(this.cssWidth*this.dpr)),o=Math.max(1,Math.round(this.cssHeight*this.dpr));(this.canvas.width!==r||this.canvas.height!==o)&&(this.canvas.width=r,this.canvas.height=o)}render(e){if(!this.bitmap||(this.lastSpec=e,this.contextLost))return;let t=this.glState;if(t){let{gl:r}=t;if(r.isContextLost()){this.contextLost=!0;return}if(this.textureDirty){if(!xa(t,this.bitmap)){this.textureDirty=!1;return}this.textureDirty=!1}ya(t,e.enhance),r.viewport(0,0,this.canvas.width,this.canvas.height),r.clearColor(0,0,0,0),r.clear(r.COLOR_BUFFER_BIT),r.disable(r.BLEND);let o=e.clipRect,s=!!o&&o.width>0&&o.height>0;s&&(r.enable(r.SCISSOR_TEST),r.scissor(Math.round(o.x*this.dpr),Math.round((e.height-o.y-o.height)*this.dpr),Math.max(1,Math.round(o.width*this.dpr)),Math.max(1,Math.round(o.height*this.dpr))));let n=li(e);_a(t,{matrix:ni(e),warp:[e.warp.a,e.warp.b],color:e.color,vignette:e.vignette,aspect:n.aspect,vigCenter:n.center,vigHalf:n.half,texel:[1/Math.max(1,t.texWidth),1/Math.max(1,t.texHeight)],enhance:e.enhance}),s&&r.disable(r.SCISSOR_TEST);return}let a=this.ctx2d;a&&di(a,this.bitmap,e)}dispose(){this.canvas.removeEventListener("webglcontextlost",this.onContextLost),this.canvas.removeEventListener("webglcontextrestored",this.onContextRestored);let e=this.glState;e&&Sa(e),this.glState=null,this.ctx2d=null,this.bitmap=null,this.lastSpec=null,this.contextLost=!1}};function Sa(i){let{gl:e}=i;e.deleteBuffer(i.buffer),e.deleteTexture(i.texture),e.deleteTexture(i.curveTexture),e.deleteTexture(i.lutTexture),e.deleteTexture(i.maskTexture),e.deleteTexture(i.liquifyTexture),e.deleteTexture(i.anchorTexture),e.deleteTexture(i.whiteTexture),Ne(e,i.programs)}function pi(i,e){let t=Ge(i);if(!t.width||!t.height||Math.max(t.width,t.height)<=e)return i;let a=e/Math.max(t.width,t.height),r=document.createElement("canvas");r.width=Math.max(1,Math.round(t.width*a)),r.height=Math.max(1,Math.round(t.height*a));let o=r.getContext("2d");return o?(o.imageSmoothingQuality="high",o.drawImage(i,0,0,r.width,r.height),r):i}function Ta(i,e,t){let a=ma(i,e,t),r=a[8],o=a[6]*e+a[8],s=a[7]*t+a[8],n=a[6]*e+a[7]*t+a[8];return r+o+s+n<0?[-a[0],-a[1],-a[2],-a[3],-a[4],-a[5],-a[6],-a[7],-a[8]]:a}function mi(i,e,t,a){let r=ai,o=[];for(let s=0;s<=r;s+=1){let n=[];for(let u=0;u<=r;u+=1){let l=ze(a,u/r*t.width,s/r*t.height);n.push({x:l.x,y:l.y})}o.push(n)}i.imageSmoothingEnabled=!0,i.imageSmoothingQuality="high";for(let s=0;s<r;s+=1)for(let n=0;n<r;n+=1){let u={x:n/r*t.width,y:s/r*t.height},l={x:(n+1)/r*t.width,y:s/r*t.height},c={x:(n+1)/r*t.width,y:(s+1)/r*t.height},h={x:n/r*t.width,y:(s+1)/r*t.height},f=o[s][n],m=o[s][n+1],p=o[s+1][n+1],g=o[s+1][n];fe(i,e,f,m,p,u,l,c,1),fe(i,e,f,p,g,u,c,h,1)}}function vi(i,e,t,a,r){ht(r.signal);let o=document.createElement("canvas");o.width=e.width,o.height=e.height;let s=o.getContext("2d");if(!s)return Promise.reject(new Error("2D canvas is unavailable"));let n=Ta(e.quad,e.width,e.height);if(s.save(),s.beginPath(),s.rect(0,0,e.width,e.height),s.clip(),s.filter=e.css||"none",wa(e.warp)){let{tl:u,tr:l,bl:c}=e.quad,h=(l.x-u.x)/e.width,f=(l.y-u.y)/e.width,m=(c.x-u.x)/e.height,p=(c.y-u.y)/e.height,g=h*p-f*m;if(Math.abs(g)>1e-8){let b=p/g,y=-m/g,w=-f/g,_=h/g,M=-(b*u.x+y*u.y),R=-(w*u.x+_*u.y);s.setTransform(b,w,y,_,M,R),s.imageSmoothingQuality="high",s.drawImage(i,0,0)}}else mi(s,i,e,n);return s.filter="none",s.restore(),s.setTransform(1,0,0,1,0,0),fi(s,e.width,e.height,e.vignette),r.onProgress?.({phase:"encode",progress:.9,tile:1,tiles:1}),Ye(o,t,a).then(u=>(r.onProgress?.({phase:"encode",progress:1,tile:1,tiles:1}),u))}function gi(i,e,t,a,r,o){let{gl:s}=i,n=Ta(e.quad,e.width,e.height),u=Math.max(1,e.srcWidth),l=Math.max(1,e.srcHeight),c=[[t,a],[t+r,a],[t+r,a+o],[t,a+o]],h=(p,g)=>{let b=ze(n,p,g),y=b.w>1e-4?b.w:1e-4,w=2*(p-t)/Math.max(1,r)-1,_=1-2*(g-a)/Math.max(1,o);return[w*y,_*y,b.x/u,b.y/l,y]},f=c.map(([p,g])=>h(p,g)),m=new Float32Array([...f[0],...f[1],...f[2],...f[0],...f[2],...f[3]]);s.bindBuffer(s.ARRAY_BUFFER,i.buffer),s.bufferData(s.ARRAY_BUFFER,m,s.DYNAMIC_DRAW)}function bi(i,e,t,a,r,o){let s=r/i,u=-(2*t/i-1+s)/s,l=1/s,c=o/e,f=-(1-2*a/e-c)/c,m=1/c;return{center:[u,f],half:[l,m]}}function ba(i,e,t,a,r,o){let{gl:s}=i;s.viewport(0,0,r,o),s.clearColor(0,0,0,0),s.clear(s.COLOR_BUFFER_BIT),s.disable(s.BLEND),gi(i,e,t,a,r,o);let n=bi(e.width,e.height,t,a,r,o);_a(i,{matrix:ti,warp:ei,color:e.color,vignette:e.vignette,aspect:e.width/Math.max(1,e.height),vigCenter:n.center,vigHalf:n.half,texel:[1/Math.max(1,i.texWidth),1/Math.max(1,i.texHeight)],enhance:{...e.enhance,quality:1}})}async function xi(i,e,t,a,r){let o=Math.max(256,Math.min(8192,Math.round(r.tileSize??2048))),s=Math.ceil(e.width/o),n=Math.ceil(e.height/o),u=s*n,l=u===1,c=document.createElement("canvas");c.width=l?e.width:Math.min(o,e.width),c.height=l?e.height:Math.min(o,e.height);let h=Xe(c,!0);if(!h)throw new Error("WebGL unavailable");try{let f=pi(i,h.maxTexture);if(!xa(h,f))throw new Error("Texture upload failed");if(ya(h,e.enhance),l){ba(h,e,0,0,e.width,e.height),r.onProgress?.({phase:"encode",progress:.9,tile:1,tiles:1});let y=await Ye(c,t,a);return r.onProgress?.({phase:"encode",progress:1,tile:1,tiles:1}),y}let m=document.createElement("canvas");m.width=e.width,m.height=e.height;let p=m.getContext("2d");if(!p)throw new Error("2D canvas is unavailable");let g=0;for(let y=0;y<n;y+=1)for(let w=0;w<s;w+=1){ht(r.signal);let _=w*o,M=y*o,R=Math.min(o,e.width-_),L=Math.min(o,e.height-M);c.width=R,c.height=L,ba(h,e,_,M,R,L),p.drawImage(c,_,M),g+=1,r.onProgress?.({phase:"render",progress:g/u*.9,tile:g,tiles:u}),await he()}ht(r.signal),r.onProgress?.({phase:"encode",progress:.95,tile:u,tiles:u});let b=await Ye(m,t,a);return r.onProgress?.({phase:"encode",progress:1,tile:u,tiles:u}),b}finally{Sa(h)}}async function ka(i,e,t,a,r={}){ht(r.signal);try{if(typeof WebGLRenderingContext<"u"&&document.createElement("canvas").getContext("webgl"))return await xi(i,e,t,a,r)}catch(o){if(nt(o))throw o}return vi(i,e,t,a,r)}function yi(i){let e=i.length;if(e<2)return[0];let t=new Array(e-1);for(let r=0;r<e-1;r+=1){let o=Math.max(1e-6,i[r+1].x-i[r].x);t[r]=(i[r+1].y-i[r].y)/o}let a=new Array(e);a[0]=t[0],a[e-1]=t[e-2];for(let r=1;r<e-1;r+=1)a[r]=(t[r-1]+t[r])*.5;for(let r=0;r<e-1;r+=1){if(Math.abs(t[r])<1e-9){a[r]=0,a[r+1]=0;continue}let o=a[r]/t[r],s=a[r+1]/t[r],n=o*o+s*s;if(n>9){let u=3/Math.sqrt(n);a[r]=u*o*t[r],a[r+1]=u*s*t[r]}}return a}function Dt(i,e){let t=i.length;if(t===0)return x(e,0,1);if(t===1)return x(i[0].y,0,1);if(e<=i[0].x)return x(i[0].y,0,1);if(e>=i[t-1].x)return x(i[t-1].y,0,1);let a=0,r=t-1;for(;r-a>1;){let b=a+r>>1;i[b].x<=e?a=b:r=b}let o=i[a],s=i[r],n=Math.max(1e-6,s.x-o.x),u=(e-o.x)/n,l=yi(i),c=u*u,h=c*u,f=2*h-3*c+1,m=h-2*c+u,p=-2*h+3*c,g=h-c;return x(f*o.y+m*n*l[a]+p*s.y+g*n*l[r],0,1)}function me(i){if(i.length!==2){for(let e=0;e<=16;e+=1){let t=e/16;if(Math.abs(Dt(i,t)-t)>1/255)return!1}return!0}return Math.abs(i[0].x)<1e-6&&Math.abs(i[0].y)<1e-6&&Math.abs(i[1].x-1)<1e-6&&Math.abs(i[1].y-1)<1e-6}function La(i){return me(i.rgb)&&me(i.r)&&me(i.g)&&me(i.b)}function We(i){if(La(i))return null;let e=new Uint8Array(256*4);for(let t=0;t<256;t+=1){let a=t/255,r=Dt(i.rgb,a);e[t*4]=Math.round(x(Dt(i.r,r),0,1)*255),e[t*4+1]=Math.round(x(Dt(i.g,r),0,1)*255),e[t*4+2]=Math.round(x(Dt(i.b,r),0,1)*255),e[t*4+3]=255}return e}var V=(i,e)=>({x:i,y:e}),je=[{id:"linear",label:"Tuyến tính",labelEn:"Linear",points:vt()},{id:"soft",label:"Mềm",labelEn:"Soft",points:[V(0,.03),V(.25,.22),V(.5,.5),V(.75,.79),V(1,.98)]},{id:"contrast",label:"Tương phản",labelEn:"Contrast",points:[V(0,0),V(.22,.16),V(.5,.5),V(.78,.85),V(1,1)]},{id:"fade",label:"Bạc màu",labelEn:"Fade",points:[V(0,.1),V(.28,.3),V(.5,.52),V(.74,.73),V(1,.9)]}];function _i(i,e="rgb"){let t=je.find(a=>a.id===i)||je[0];return e==="rgb"?t.points.map(a=>({...a})):vt()}var Aa=17,Oe=[{id:"none",label:"Không",labelEn:"None"},{id:"cinema",label:"Điện ảnh",labelEn:"Cinema"},{id:"teal",label:"Xanh ngọc",labelEn:"Teal & Orange"},{id:"fade",label:"Bạc màu",labelEn:"Fade"},{id:"noir",label:"Đen trắng",labelEn:"Noir"},{id:"warm",label:"Ấm",labelEn:"Warm"},{id:"cool",label:"Lạnh",labelEn:"Cool"}],Lt=i=>i<0?0:i>1?1:i,ve=(i,e,t)=>i*.2126+e*.7152+t*.0722;function wi(i,e,t){let a=Lt((t-i)/Math.max(1e-6,e-i));return a*a*(3-2*a)}function Wt(i,e){let t=ve(i[0],i[1],i[2]);return[t+(i[0]-t)*e,t+(i[1]-t)*e,t+(i[2]-t)*e]}function Ma(i,e,t=.5){return[(i[0]-t)*e+t,(i[1]-t)*e+t,(i[2]-t)*e+t]}function Ot(i){return[Lt(i[0]),Lt(i[1]),Lt(i[2])]}var Si={cinema(i,e,t){let a=ve(i,e,t),r=[i+.032*a-.018*(1-a),e+.006*a+.008*(1-a),t-.03*a+.045*(1-a)];return r=Ma(r,1.06,.46),r=Wt(r,1.06),Ot(r)},teal(i,e,t){let a=ve(i,e,t),r=[i+.06*a-.035*(1-a),e+.012*a+.022*(1-a),t-.05*a+.075*(1-a)];return r=Ma(r,1.08,.47),r=Wt(r,1.1),Ot(r)},fade(i,e,t){let a=[i*.82+.11,e*.82+.105,t*.82+.1];return a=Wt(a,.82),a=[a[0]*1.015,a[1],a[2]*.99],Ot(a)},noir(i,e,t){let a=ve(i,e,t);return a=wi(.06,.94,a),[a*.995,a,a*1.012]},warm(i,e,t){let a=[i*1.06,e*1.012,t*.915];return a=Wt(a,1.05),Ot(a)},cool(i,e,t){let a=[i*.93,e*.995,t*1.075];return a=Wt(a,.97),Ot(a)}};function Ke(i){return Oe.find(e=>e.id===i)||Oe[0]}function $e(i,e=17){if(i==="none")return null;let t=Si[i];if(!t)return null;let a=Math.max(2,Math.round(e)),r=a*a,o=a,s=new Uint8Array(r*o*4),n=a-1;for(let u=0;u<a;u+=1)for(let l=0;l<a;l+=1)for(let c=0;c<a;c+=1){let h=t(c/n,l/n,u/n),f=((u*a+l)*r+(u*a+c))*4;s[f]=Math.round(Lt(h[0])*255),s[f+1]=Math.round(Lt(h[1])*255),s[f+2]=Math.round(Lt(h[2])*255),s[f+3]=255}return s}var Ra=[1,0,0,0,1,0,0,0,1],xe=[0,0,0];function Ti(i,e){let t=new Array(9);for(let a=0;a<3;a+=1){let r=a*3;for(let o=0;o<3;o+=1)t[r+o]=(i[r]||0)*(e[o]||0)+(i[r+1]||0)*(e[3+o]||0)+(i[r+2]||0)*(e[6+o]||0)}return t}function ki(i,e){return[(i[0]||0)*e[0]+(i[1]||0)*e[1]+(i[2]||0)*e[2],(i[3]||0)*e[0]+(i[4]||0)*e[1]+(i[5]||0)*e[2],(i[6]||0)*e[0]+(i[7]||0)*e[1]+(i[8]||0)*e[2]]}function z(i,e){let t=Ti(i.matrix,e.matrix),a=ki(i.matrix,e.offset);return{matrix:t,offset:[a[0]+i.offset[0],a[1]+i.offset[1],a[2]+i.offset[2]]}}function Li(){return{matrix:Ra.slice(),offset:xe.slice()}}function G(i,e,t,a=xe){return{matrix:[i,0,0,0,e,0,0,0,t],offset:a.slice()}}function X(i){let e=Math.max(0,1+i),t=.2126,a=.7152,r=.0722,o=1-e;return{matrix:[t*o+e,a*o,r*o,t*o,a*o+e,r*o,t*o,a*o,r*o+e],offset:xe.slice()}}function Q(i){let e=Math.max(.05,1+i);return{matrix:[e,0,0,0,e,0,0,0,e],offset:[.5*(1-e),.5*(1-e),.5*(1-e)]}}function Ea(i){let e=i*.22;return{matrix:Ra.slice(),offset:[e,e,e]}}function Mi(i){let e=Math.pow(2,i);return{matrix:[e,0,0,0,e,0,0,0,e],offset:xe.slice()}}function Ai(i){return G(1+i*.16,1+i*.03,1-i*.16)}function q(i,e,t,a,r,o,s){return{id:i,label:e,labelEn:t,color:a,css:r,category:o,hint:s}}var Mt=[q("original","Nguyên bản","Original",Li(),"","root","Không đổi màu"),q("vivid","Sống động","Vivid",z(Q(.08),X(.38)),"saturate(1.38) contrast(1.08)","root"),q("dramatic","Kịch tính","Dramatic",z({matrix:[1.05,0,0,0,1.02,0,0,0,1.08],offset:[-.012,-.008,.012]},z(Q(.27),X(-.18))),"contrast(1.27) saturate(0.82)","root"),q("mono","Đen trắng","Mono",z(Q(.1),X(-1)),"grayscale(1) contrast(1.1)","mono"),q("vintage","Cổ điển","Vintage",{matrix:[.92,.32,.08,.14,.86,.11,.06,.19,.72],offset:[.035,.02,0]},"sepia(0.42) saturate(0.86) contrast(0.95)","root"),q("warm","Ấm","Warm",G(1.12,1.02,.88),"sepia(0.18) saturate(1.06) brightness(1.02)","root"),q("cool","Lạnh","Cool",G(.9,1,1.16),"saturate(0.96) hue-rotate(-8deg) brightness(1.01)","root"),q("meitu-natural","Tự nhiên","Natural",z(G(1.04,1.02,.98),X(.12)),"brightness(1.03) saturate(1.12) sepia(0.08)","meitu","Meitu · Sáng nhẹ, giữ tông da tự nhiên"),q("meitu-korea","Hàn Quốc","Korea",z(G(1.06,1,.98),X(.15)),"brightness(1.06) saturate(1.15) contrast(0.97)","meitu","Meitu · Da hồng sáng, tương phản mềm"),q("meitu-japan","Nhật Bản","Japan",z(G(1.03,1.01,1.02),Q(-.08)),"brightness(1.03) saturate(1.06) contrast(0.92)","meitu","Meitu · Trong vắt, đỡ gắt"),q("meitu-skin","Sáng da","Bright Skin",z(G(1.05,1.03,.99),Ea(.14)),"brightness(1.07) saturate(1.05)","meitu","Meitu · Nâng sáng vùng da, giữ chi tiết"),q("meitu-pink","Hồng đào","Peach Pink",z(G(1.07,.99,.97),X(.2)),"saturate(1.2) brightness(1.04)","meitu","Meitu · Hồng ấm, hợp chân dung"),q("meitu-white","Trắng sáng","Bright White",z(G(1.08,1.08,1.08),X(-.05)),"brightness(1.08) saturate(0.95)","meitu","Meitu · Sáng tinh khôi, giảm bão hoà nhẹ"),q("xingtu-film","Điện ảnh","Cinematic",z(G(.97,1.02,1.07),z(Q(.12),X(.05))),"contrast(1.12) saturate(1.05) hue-rotate(-6deg)","xingtu","Xingtu · Teal–orange mềm, hợp đường phố"),q("xingtu-hk","Hồng Kông","Hong Kong",z(G(1.02,1,1.04),z(Q(.1),X(-.08))),"contrast(1.1) saturate(0.92) hue-rotate(4deg)","xingtu","Xingtu · Đêm đô thị, xanh lạnh"),q("xingtu-showa","Chiêu Hoà","Showa",z(G(1.04,1,.93),z(Q(-.05),X(-.15))),"sepia(0.22) saturate(0.85) contrast(0.95)","xingtu","Xingtu · Hoài cổ, phai màu nhẹ"),q("xingtu-kama","Kamakura","Kamakura",z(G(1.06,1.02,.9),X(.1)),"brightness(1.05) sepia(0.2) saturate(1.1)","xingtu","Xingtu · Bình minh biển, ấm sáng"),q("xingtu-night","Ban đêm","Night",z(G(.94,.98,1.08),z(Q(.08),X(-.05))),"brightness(0.96) contrast(1.08) hue-rotate(-10deg)","xingtu","Xingtu · Đêm sâu, giữ bóng tối"),q("xingtu-morning","Buổi sáng","Morning",z(G(1.07,1.04,.93),X(.08)),"brightness(1.05) sepia(0.14) saturate(1.08)","xingtu","Xingtu · Nắng sớm, ấm và trong"),q("lr-cinema","Cinematic","Cinematic",z(G(.98,1.02,1.06),z(Q(.15),X(.05))),"contrast(1.15) saturate(1.05) hue-rotate(-8deg)","lr","Lightroom · Điện ảnh tương phản mạnh"),q("lr-moody","Moody","Moody",z(G(.97,.98,1.02),z(Q(.18),X(-.15))),"contrast(1.18) saturate(0.85) brightness(0.97)","lr","Lightroom · Ẩm ướt, bóng gắt"),q("lr-vibrant","Vibrant","Vibrant",z(Q(.05),X(.35)),"saturate(1.35) contrast(1.05)","lr","Lightroom · Màu rực, hợp phong cảnh"),q("lr-pastel","Pastel","Pastel",z(G(1.03,1.03,1.03),z(Q(-.1),X(.1))),"brightness(1.04) contrast(0.9) saturate(1.1)","lr","Lightroom · Nhẹ, trong, chữ chụp đồ"),q("lr-desert","Sa mạc","Desert",z(G(1.08,1,.88),X(.15)),"sepia(0.28) saturate(1.15) contrast(1.04)","lr","Lightroom · Vàng cát ấm"),q("lr-street","Đường phố","Street",z(Q(.2),X(-.1)),"contrast(1.2) saturate(0.9)","lr","Lightroom · Grit, hợp street life"),q("lr-faded","Mờ phai","Faded",z(G(1.02,1.02,1.02),z(Q(-.12),X(-.15))),"brightness(1.03) contrast(0.88) saturate(0.85)","lr","Lightroom · Film phai, giảm tương phản"),q("lr-teal","Teal","Teal",z(G(.93,1.04,1.07),X(.1)),"hue-rotate(-14deg) saturate(1.1) contrast(1.05)","lr","Lightroom · Xanh teal mát"),q("mono-warm","Đen trắng ấm","Mono Warm",z(G(1.06,1.02,.94),X(-1)),"grayscale(1) sepia(0.18) contrast(1.06)","mono","Đen trắng · Ấm hạt"),q("mono-cool","Đen trắng lạnh","Mono Cool",z(G(.94,.98,1.06),X(-1)),"grayscale(1) hue-rotate(-10deg) contrast(1.06)","mono","Đen trắng · Lạnh, gắt")];function xt(i){return Mt.find(e=>e.id===i)||Mt[0]}function Ci(i,e){let t=xt(e).color;return t=z(Mi(i.exposure/100),t),t=z(Ea(i.brightness/100),t),t=z(Q(i.contrast/100),t),t=z(X(i.saturation/100),t),t=z(Ai(i.warmth/100),t),t}function Qe(i){return x(i.vignette/100,0,1)}function Ze(i,e,t=!0){let a=[];if(t){let n=xt(e).css;n&&a.push(n)}let r=Math.pow(2,i.exposure/100),o=1+i.brightness/200;Math.abs(r*o-1)>.005&&a.push(`brightness(${(r*o).toFixed(4)})`),i.contrast!==0&&a.push(`contrast(${Math.max(.05,1+i.contrast/100).toFixed(4)})`);let s=Math.max(0,1+i.saturation/100+i.vibrance/260);return Math.abs(s-1)>.005&&a.push(`saturate(${s.toFixed(4)})`),i.warmth!==0&&a.push(`sepia(${(Math.abs(i.warmth)*.0015).toFixed(4)})`),i.tint!==0&&a.push(`hue-rotate(${(i.tint*.045).toFixed(3)}deg)`),a.join(" ")||"none"}function Ri(i,e){let t=i.data,a=e.matrix,r=e.offset;for(let o=0;o<t.length;o+=4){if(t[o+3]===0)continue;let s=t[o]/255,n=t[o+1]/255,u=t[o+2]/255;t[o]=x((a[0]*s+a[1]*n+a[2]*u+r[0])*255,0,255),t[o+1]=x((a[3]*s+a[4]*n+a[5]*u+r[1])*255,0,255),t[o+2]=x((a[6]*s+a[7]*n+a[8]*u+r[2])*255,0,255)}}function za(i,e,t,a){let o=document.createElement("canvas");o.width=128,o.height=128;let s=o.getContext("2d",{willReadFrequently:!0});if(!s)return o;let n=Math.max(128/e,128/t),u=e*n,l=t*n;s.drawImage(i,(128-u)/2,(128-l)/2,u,l);try{let c=s.getImageData(0,0,128,128);Ri(c,xt(a).color),s.putImageData(c,0,0)}catch{}return o}function Ei(i){let e=[i.hsl.red,i.hsl.orange,i.hsl.yellow,i.hsl.green,i.hsl.aqua,i.hsl.blue,i.hsl.purple,i.hsl.magenta],t=new Float32Array(24);for(let a=0;a<e.length;a+=1){let r=e[a];t[a*3]=x(r.hue/100,-1,1),t[a*3+1]=x(r.saturation/100,-1,1),t[a*3+2]=x(r.luminance/100,-1,1)}return t}function ye(i){let e=i.filter(a=>a.w>0&&a.h>0).slice().sort((a,r)=>(r.confidence??0)-(a.confidence??0)).slice(0,4),t=new Float32Array(16);for(let a=0;a<e.length;a+=1){let r=e[a];t[a*4]=x(r.x+r.w/2,0,1),t[a*4+1]=x(r.y+r.h/2,0,1),t[a*4+2]=x(r.w*.62,.01,1),t[a*4+3]=x(r.h*.72,.01,1)}return{data:t,count:e.length}}var Ve=.6,zi={x:-.34,y:-.18},Bi={x:.34,y:-.18},Di={x:0,y:.1},Ii={x:0,y:.4},Ca={x:.22,y:.16},Pi={x:.2,y:.24},Ui={x:.3,y:.16};function ge(i,e){return!i||!Number.isFinite(i.x)||!Number.isFinite(i.y)?e:{x:x(i.x,-.92,.92),y:x(i.y,-.92,.92)}}function be(i,e){return!i||!Number.isFinite(i.x)||!Number.isFinite(i.y)?e:{x:x(i.x,.02,Ve),y:x(i.y,.02,Ve)}}function gt(i){return Math.round(x(i*.5+.5,0,1)*255)}function bt(i){return Math.round(x(i/Ve,0,1)*255)}function Ba(i){let e=i.filter(o=>o&&o.box&&Number.isFinite(o.box.x)&&Number.isFinite(o.box.y)&&Number.isFinite(o.box.w)&&Number.isFinite(o.box.h)&&o.box.w>0&&o.box.h>0).slice().sort((o,s)=>{let n=o.box.w*o.box.h,u=s.box.w*s.box.h;return(s.confidence??u)-(o.confidence??n)}).slice(0,4),t=new Float32Array(16),a=new Uint8Array(64),r=[];for(let o=0;o<e.length;o+=1){let s=e[o],n=x(s.box.x,0,1),u=x(s.box.y,0,1),l=x(s.box.w,0,1),c=x(s.box.h,0,1);t[o*4]=x(n+l/2,0,1),t[o*4+1]=x(u+c/2,0,1),t[o*4+2]=x(l*.62,.01,1),t[o*4+3]=x(c*.72,.01,1),r.push({x:n,y:u,w:l,h:c,confidence:s.confidence??l*c});let h=ge(s.eyeL,zi),f=ge(s.eyeR,Bi),m=ge(s.nose,Di),p=ge(s.mouth,Ii),g=be(s.eyeLRadius,Ca),b=be(s.eyeRRadius,Ca),y=be(s.noseRadius,Pi),w=be(s.mouthRadius,Ui),_=o*16;a[_]=gt(h.x),a[_+1]=gt(h.y),a[_+2]=gt(f.x),a[_+3]=gt(f.y),a[_+4]=gt(m.x),a[_+5]=gt(m.y),a[_+6]=gt(p.x),a[_+7]=gt(p.y),a[_+8]=bt(g.x),a[_+9]=bt(g.y),a[_+10]=bt(b.x),a[_+11]=bt(b.y),a[_+12]=bt(y.x),a[_+13]=bt(y.y),a[_+14]=bt(w.x),a[_+15]=bt(w.y)}return{data:t,anchors:a,count:e.length,boxes:r}}function Da(i){let e=i.adjust;return{exposure:e.exposure/100,brightness:e.brightness/100,contrast:e.contrast/100,saturation:e.saturation/100,highlights:e.highlights/100,shadows:e.shadows/100,whites:e.whites/100,blacks:e.blacks/100,warmth:e.warmth/100,tint:e.tint/100,vibrance:e.vibrance/100,gamma:e.gamma/100,clarity:e.clarity/100,sharpen:e.sharpen/100,denoise:e.denoise/100,smoothSkin:e.smoothSkin/100,blemish:e.blemish/100,skinTexture:e.skinTexture/100,skinTone:e.skinTone/100,faceSlim:e.faceSlim/100,jawline:e.jawline/100,chin:e.chin/100,eyeSize:e.eyeSize/100,noseSize:e.noseSize/100,mouthSize:e.mouthSize/100,curve:i.curve,lut:i.lut,lutSize:17,lutStrength:i.enhance.lutStrength/100,faces:i.faces.count?i.faces.data:null,faceCount:i.faces.count,anchors:i.faces.count?i.anchors??null:null,hsl:Ei(i.enhance),mask:i.mask??null,liquify:i.liquify??null,linear:i.linear?1:0,dither:i.dither??0,quality:i.quality}}var _e={webgl:0,highp:!1,maxTexture:2048,maxVaryings:8,maxUniforms:16,gpuVendor:"",gpuRenderer:"",deviceMemoryGB:null,hardwareConcurrency:2,dpr:1,mobile:!1,ios:!1,saveData:!1,reducedMotion:!1,tier:"low"},It=null;function qi(i,e,t,a,r,o,s){let n=i===2?2:i===1?1:0;e&&(n+=2),t>=8192?n+=2:t>=4096&&(n+=1),a!==null?a>=8?n+=2:a>=4&&(n+=1):r>=8&&(n+=1),o||(n+=1),s&&(n-=1);let u=n>=8?"ultra":n>=6?"high":n>=4?"mid":"low";return u==="ultra"&&(i<2||!e)?"high":u}function Je(){if(It)return It;if(typeof document>"u"||typeof navigator>"u")return It=_e,It;let i=navigator.userAgent||"",e=/Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(i),t=/iP(hone|ad|od)/.test(i)||i.includes("Macintosh")&&"ontouchend"in document,a=typeof navigator.deviceMemory=="number"?navigator.deviceMemory:null,r=navigator.hardwareConcurrency||2,o=navigator.connection?.saveData===!0,s=typeof window<"u"&&typeof window.matchMedia=="function"?window.matchMedia("(prefers-reduced-motion: reduce)").matches:!1,n=typeof window<"u"?Math.min(3,Math.max(1,window.devicePixelRatio||1)):1,u=0,l=!1,c=_e.maxTexture,h=_e.maxVaryings,f=_e.maxUniforms,m="",p="",g=document.createElement("canvas");g.width=1,g.height=1;let b={alpha:!1,antialias:!1,depth:!1,stencil:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"},y=null;try{y=g.getContext("webgl2",b),y&&(u=2),y||(y=g.getContext("webgl",b),y&&(u=1))}catch{y=null}if(y){try{let w=y.getShaderPrecisionFormat(y.FRAGMENT_SHADER,y.HIGH_FLOAT);l=!!w&&w.precision>0,c=y.getParameter(y.MAX_TEXTURE_SIZE)||c,h=y.getParameter(y.MAX_VARYING_VECTORS)||h,f=y.getParameter(y.MAX_FRAGMENT_UNIFORM_VECTORS)||f;let _=y.getExtension("WEBGL_debug_renderer_info");_?(m=String(y.getParameter(_.UNMASKED_VENDOR_WEBGL)||""),p=String(y.getParameter(_.UNMASKED_RENDERER_WEBGL)||"")):(m=String(y.getParameter(y.VENDOR)||""),p=String(y.getParameter(y.RENDERER)||""))}catch{}try{y.getExtension("WEBGL_lose_context")?.loseContext()}catch{}}return It={webgl:u,highp:l,maxTexture:c,maxVaryings:h,maxUniforms:f,gpuVendor:m,gpuRenderer:p,deviceMemoryGB:a,hardwareConcurrency:r,dpr:n,mobile:e,ios:t,saveData:o,reducedMotion:s,tier:qi(u,l,c,a,r,e,o)},It}function we(i,e){return i==="linear"?"linear":i==="srgb"?"srgb":e.webgl>0&&e.highp&&e.tier!=="low"?"linear":"srgb"}function Kt(i,e,t){return typeof i=="boolean"?i:e==="linear"||t.tier==="low"}function Hi(i,e,t){return i*.2126+e*.7152+t*.0722}function $t(i,e,t){let a=e*t,r=0;for(let o=0;o<256;o+=1)if(r+=i[o],r>=a)return o/255;return 1}function Fi(i){if(!i.length)return 0;i.sort((t,a)=>t-a);let e=i.length>>1;return i.length%2?i[e]:(i[e-1]+i[e])*.5}async function ta(i,e=256,t=0){let a="width"in i?i.width:0,r="height"in i?i.height:0;if(!a||!r)throw new Error("Cannot analyse an empty image");let o=Math.min(1,e/Math.max(a,r)),s=Math.max(8,Math.round(a*o)),n=Math.max(8,Math.round(r*o)),u=document.createElement("canvas");u.width=s,u.height=n;let l=u.getContext("2d",{willReadFrequently:!0});if(!l)throw new Error("2D canvas is unavailable");l.imageSmoothingQuality="high",l.drawImage(i,0,0,s,n);let c;try{c=l.getImageData(0,0,s,n).data}catch{throw new Error("Cannot analyse a cross-origin image without CORS")}await new Promise(Y=>{typeof requestAnimationFrame=="function"?requestAnimationFrame(()=>Y()):setTimeout(Y,0)});let h=s*n,f=new Uint32Array(256),m=new Float32Array(h),p=0,g=0,b=0,y=0,w=0,_=0,M=0,R=0;for(let Y=0,O=0;Y<h;Y+=1,O+=4){let j=c[O]/255,$=c[O+1]/255,Z=c[O+2]/255,K=Hi(j,$,Z);m[Y]=K,f[Math.round(K*255)]+=1,p+=j,g+=$,b+=Z,K<.02&&(M+=1),K>.98&&(R+=1);let ot=Math.max(j,$,Z),C=Math.min(j,$,Z);ot>.04&&(y+=(ot-C)/ot,w+=1);let I=-.168736*j-.331264*$+.5*Z+.5,E=.5*j-.418688*$-.081312*Z+.5;E>.34&&E<.66&&I>.31&&I<.6&&K>.12&&K<.95&&(_+=1)}let L=0,P=0,D=8,k=[],A=[];for(let Y=0;Y+D<=n;Y+=D)for(let O=0;O+D<=s;O+=D){let j=0,$=0,Z=0,K=0;for(let I=Y;I<Y+D;I+=1)for(let E=O;E<O+D;E+=1){let N=I*s+E,W=m[N];if(j+=W,$+=W*W,E>0&&I>0&&E<s-1&&I<n-1){let J=4*W-m[N-1]-m[N+1]-m[N-s]-m[N+s];Z+=Math.abs(J),L+=Math.abs(J),P+=1}K+=1}let ot=j/Math.max(1,K),C=Math.max(0,$/Math.max(1,K)-ot*ot);k.push(Math.sqrt(C)),A.push(Z/Math.max(1,K))}let S=[];if(A.length){let Y=A.slice().sort((j,$)=>j-$),O=Y[Math.floor(Y.length*.3)]??0;for(let j=0;j<A.length;j+=1)A[j]<=O&&S.push(k[j])}let T=S.length?Fi(S):0,B=P?L/P:0;return{width:s,height:n,mean:(p+g+b)/(h*3),median:$t(f,h,.5),p1:$t(f,h,.01),p5:$t(f,h,.05),p95:$t(f,h,.95),p99:$t(f,h,.99),clipLow:M/h,clipHigh:R/h,meanR:p/h,meanG:g/h,meanB:b/h,saturation:w?y/w:0,noise:T,sharpness:B,skinRatio:_/h,faceCount:Math.max(0,Math.round(t))}}function ea(i){let e=ee(),t=[],a=(l,c)=>{let[h,f]=et[l];e[l]=x(Math.round(c),h,f)},r=Math.max(.035,i.median),o=x(Math.log2(.46/r),-.75,.75);a("exposure",o*100),i.median<.3&&t.push("low-light"),i.clipHigh>.03&&t.push("overexposed"),i.clipLow>.05&&t.push("underexposed");let s=i.p95-i.p5;a("contrast",x((.62-s)*90,-18,30)),s<.45&&t.push("flat"),i.clipHigh>.015?a("highlights",-x(i.clipHigh*900,10,65)):i.p95>.94?a("highlights",-15):i.p95<.78&&a("highlights",10),i.p5<.08&&a("shadows",x((.08-i.p5)*420,8,55)),i.p99<.88?a("whites",x((.88-i.p99)*120,0,20)):i.clipHigh>.03&&a("whites",-12),i.p1>.1?a("blacks",-x((i.p1-.1)*180,0,20)):i.p1<.01&&a("blacks",6);let n=(i.meanB-i.meanR)*90;a("warmth",x(n,-22,22)),n>8&&t.push("cool-cast"),n<-8&&t.push("warm-cast");let u=(i.meanG-(i.meanR+i.meanB)*.5)*120;return a("tint",x(u,-18,18)),u>8&&t.push("green-cast"),u<-8&&t.push("magenta-cast"),a("saturation",x((.3-i.saturation)*70,-12,22)),a("vibrance",x((.34-i.saturation)*55,-8,26)),i.sharpness<.025&&a("sharpen",x((.025-i.sharpness)*600,0,30)),i.sharpness<.012&&t.push("soft"),i.noise>.008&&a("denoise",x((i.noise-.008)*700,0,40)),i.noise>.02&&t.push("noisy"),a("clarity",x((.62-s)*40,0,18)),(i.skinRatio>.015||i.faceCount>0)&&(a("smoothSkin",x(i.skinRatio*120+i.faceCount*3,0,24)),t.push("portrait")),{adjust:e,analysis:i,notes:t}}var Se=new Map;function Ni(i){Se.set(i.id,i)}function Xi(i){Se.delete(i)}function Yi(){return Array.from(Se.values())}function ra(i){return Se.get(i)}function aa(i,e){let t=document.createElement("canvas");return t.width=Math.max(1,Math.round(i)),t.height=Math.max(1,Math.round(e)),t}function ia(i,e=!1){let t=i.getContext("2d",{willReadFrequently:e});if(!t)throw new Error("2D canvas is unavailable");return t}function Gi(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement?{width:i.naturalWidth||i.width,height:i.naturalHeight||i.height}:{width:i.width,height:i.height}}function ji(i,e,t,a,r=1){if(!t&&!a)return{width:i,height:e,k:1};let o=t?Math.sqrt(Math.max(1,t)/Math.max(1,i*e)):1,s=a?Math.sqrt(Math.max(1,a)/Math.max(1,i*e*r*r)):1,n=Math.min(1,o,s);return{width:Math.max(1,Math.floor(i*n)),height:Math.max(1,Math.floor(e*n)),k:n}}function Wi(i,e,t,a,r,o,s,n,u){let l=r-u,c=o-u,h=s+u*2,f=n+u*2,m=Math.max(0,l),p=Math.max(0,c),g=Math.min(t,l+h)-m,b=Math.min(a,c+f)-p;i.clearRect(0,0,h,f),i.drawImage(e,m,p,g,b,m-l,p-c,g,b),p>c&&i.drawImage(e,m,0,g,1,m-l,0,g,p-c),p+b<c+f&&i.drawImage(e,m,a-1,g,1,m-l,p+b-c,g,c+f-(p+b)),m>l&&i.drawImage(e,0,p,1,b,0,p-c,m-l,b),m+g<l+h&&i.drawImage(e,t-1,p,1,b,m+g-l,p-c,l+h-(m+g),b),m>l&&p>c&&i.drawImage(e,0,0,1,1,0,0,m-l,p-c),m+g<l+h&&p>c&&i.drawImage(e,t-1,0,1,1,m+g-l,0,l+h-(m+g),p-c),m>l&&p+b<c+f&&i.drawImage(e,0,a-1,1,1,0,p+b-c,m-l,c+f-(p+b)),m+g<l+h&&p+b<c+f&&i.drawImage(e,t-1,a-1,1,1,m+g-l,p+b-c,l+h-(m+g),c+f-(p+b))}async function oa(i,e,t={}){let{width:a,height:r}=Gi(e);if(!a||!r)throw new Error("AI pipeline needs a non-empty image");let o=Math.max(.25,Math.min(4,t.scale??1)),s=Math.max(32,Math.min(2048,Math.round(t.tileSize??512))),n=Math.max(0,Math.min(128,Math.round(t.halo??t.overlap??8))),u=ji(a,r,t.maxInputPixels,t.maxOutputPixels,o),l=e,c=a,h=r;if(u.k<1){t.onStage?.("resize");let R=aa(u.width,u.height),L=ia(R);L.imageSmoothingEnabled=!0,L.imageSmoothingQuality="high",L.drawImage(e,0,0,a,r,0,0,u.width,u.height),l=R,c=u.width,h=u.height}let f=Math.max(1,Math.round(c*o)),m=Math.max(1,Math.round(h*o)),p=aa(f,m),g=ia(p);g.imageSmoothingEnabled=!0,g.imageSmoothingQuality="high";let b=aa(s+n*2,s+n*2),y=ia(b,!0),w=Math.ceil(c/s),_=Math.ceil(h/s),M=w*_;try{t.onStage?.("load"),await i.load(t.signal);let R=0;for(let L=0;L<_;L+=1)for(let P=0;P<w;P+=1){ht(t.signal);let D=P*s,k=L*s,A=Math.min(s,c-D),S=Math.min(s,h-k),T=A+n*2,B=S+n*2;(b.width!==T||b.height!==B)&&(b.width=T,b.height=B),Wi(y,l,c,h,D,k,A,S,n);let U=await i.run(b,t.signal);ht(t.signal);let Y="width"in U?U.width:T,O="height"in U?U.height:B,j=Y/Math.max(1,T),$=O/Math.max(1,B),Z=Math.min(Y-1,n*j),K=Math.min(O-1,n*$),ot=Math.min(Y-Z,A*j),C=Math.min(O-K,S*$),I=Math.round(D*o),E=Math.round(k*o),N=Math.max(1,Math.round((D+A)*o)-I),W=Math.max(1,Math.round((k+S)*o)-E);g.drawImage(U,Z,K,ot,C,I,E,N,W),"close"in U&&typeof U.close=="function"&&U.close(),R+=1,t.onStage?.("tile",R,M),t.onProgress?.(R/M),await he()}t.onStage?.("done",M,M)}finally{i.dispose()}return p}var dt={maxPreview:1080,maxHistory:60,maxZoom:8,maxExport:8192,maxPixels:67108864,previewQuality:"fast",colorSpace:"auto",dither:"auto"};function Oi(){if(typeof navigator>"u")return dt.maxPixels;let i=navigator.userAgent||"";return/iP(hone|ad|od)/.test(i)||navigator.platform==="MacIntel"&&(navigator.maxTouchPoints||0)>1?16777216:dt.maxPixels}function Ki(i){if(typeof i=="string"){let e=document.querySelector(i);if(!e)throw new Error(`Aurum: container "${i}" was not found`);return e}return i}function Pt(i){return i instanceof HTMLImageElement?{width:i.naturalWidth||i.width,height:i.naturalHeight||i.height}:{width:i.width,height:i.height}}async function sa(i){return new Promise((e,t)=>{let a=new Image;a.crossOrigin="anonymous",a.decoding="async",a.onload=()=>e(a),a.onerror=()=>t(new Error("Could not load the image (check the URL and CORS headers).")),a.src=i})}async function $i(i){if(typeof i=="string")try{let e=await fetch(i,{mode:"cors",credentials:"same-origin"});if(!e.ok)throw new Error(`HTTP ${e.status}`);let t=await e.blob();if(typeof createImageBitmap=="function")try{return{bitmap:await createImageBitmap(t,{imageOrientation:"from-image"}),owned:!0}}catch{}let a=URL.createObjectURL(t);try{return{bitmap:await sa(a),owned:!0}}finally{URL.revokeObjectURL(a)}}catch(e){if(i.startsWith("data:")||i.startsWith("blob:"))return{bitmap:await sa(i),owned:!0};throw e}if(i instanceof Blob){if(typeof createImageBitmap=="function")try{return{bitmap:await createImageBitmap(i,{imageOrientation:"from-image"}),owned:!0}}catch{}let e=URL.createObjectURL(i);try{return{bitmap:await sa(e),owned:!0}}finally{URL.revokeObjectURL(e)}}if(i instanceof HTMLImageElement){if(i.complete||await new Promise((e,t)=>{i.addEventListener("load",()=>e(),{once:!0}),i.addEventListener("error",()=>t(new Error("Could not load the image")),{once:!0})}),!i.naturalWidth)throw new Error("The image has no pixels");return{bitmap:i,owned:!1}}return{bitmap:i,owned:!1}}async function Ia(i,e){let t=Pt(i),a=Math.max(t.width,t.height);if(a<=e)return{bitmap:i,owned:!1};let r=e/a,o=Math.max(1,Math.round(t.width*r)),s=Math.max(1,Math.round(t.height*r));if(typeof createImageBitmap=="function")try{return{bitmap:await createImageBitmap(i,{resizeWidth:o,resizeHeight:s,resizeQuality:"high"}),owned:!0}}catch{}let n=document.createElement("canvas");n.width=o,n.height=s;let u=n.getContext("2d");if(!u)throw new Error("Could not create the preview canvas");return u.imageSmoothingQuality="high",u.drawImage(i,0,0,o,s),{bitmap:n,owned:!0}}var At=class{constructor(e){d(this,"stage");d(this,"canvas");d(this,"maxZoom");d(this,"state",Et());d(this,"history");d(this,"renderer");d(this,"gesture");d(this,"options");d(this,"original",null);d(this,"preview",null);d(this,"ownsOriginal",!1);d(this,"ownsPreview",!1);d(this,"ready",!1);d(this,"loading",!1);d(this,"loadSeq",0);d(this,"lastFrame",{x:0,y:0,width:0,height:0});d(this,"lastViewport",{width:0,height:0});d(this,"dpr",1);d(this,"renderPending",!1);d(this,"raf",0);d(this,"animation",null);d(this,"animationSeq",0);d(this,"resizeObserver",null);d(this,"listeners",new Map);d(this,"destroyed",!1);d(this,"commitKey","");d(this,"resultMode",!1);d(this,"faces",[]);d(this,"serverFaces",[]);d(this,"faceAnchors",[]);d(this,"beautyMask",null);d(this,"facePack",{data:new Float32Array(16),count:0});d(this,"anchorPack",null);d(this,"curveCache",{source:null,data:null});d(this,"lutCache",new Map);d(this,"liquifyCache",{source:null,width:0,height:0,field:null});d(this,"previewQuality",0);d(this,"colorMode");d(this,"ditherEnabled");d(this,"capabilities");d(this,"aiSeq",0);d(this,"aiController",null);d(this,"aiBefore",null);d(this,"resize",()=>{if(this.destroyed)return;let e=this.viewport();this.dpr=Math.min(3,window.devicePixelRatio||1),this.renderer.resize(e.width,e.height,this.dpr),this.ready?(this.syncViewport(e),this.renderNow()):this.lastViewport=e});let t=Ki(e.container);this.options={maxPreview:e.maxPreview??dt.maxPreview,maxHistory:e.maxHistory??dt.maxHistory,maxZoom:e.maxZoom??dt.maxZoom,maxExport:e.maxExport??dt.maxExport,maxPixels:e.maxPixels??Oi(),previewQuality:e.previewQuality??dt.previewQuality,colorSpace:e.colorSpace??dt.colorSpace,dither:e.dither??dt.dither,background:e.background??"#08080a"},this.capabilities=Je(),this.colorMode=we(this.options.colorSpace,this.capabilities),this.ditherEnabled=Kt(this.options.dither,this.colorMode,this.capabilities),this.maxZoom=this.options.maxZoom,this.previewQuality=this.options.previewQuality==="high"?1:0,this.history=new Yt(this.options.maxHistory),getComputedStyle(t).position==="static"&&(t.style.position="relative"),this.stage=document.createElement("div"),this.stage.className="au-stage",Object.assign(this.stage.style,{position:"absolute",inset:"0",overflow:"hidden",width:"100%",height:"100%",background:this.options.background,touchAction:"none",userSelect:"none",WebkitUserSelect:"none",cursor:"grab"}),this.canvas=document.createElement("canvas"),this.canvas.className="au-canvas",Object.assign(this.canvas.style,{position:"absolute",inset:"0",width:"100%",height:"100%",display:"block"}),this.stage.appendChild(this.canvas),t.appendChild(this.stage),this.renderer=new pe(this.canvas);let a={stage:this.stage,maxZoom:this.maxZoom,viewport:()=>this.viewport(),frame:()=>this.currentFrame(),source:()=>this.source(),state:()=>this.state,setTransform:r=>this.applyTransform(r),commit:()=>this.commit("transform"),settle:(r,o)=>this.settle(r,o)};this.gesture=new ce(a),typeof ResizeObserver<"u"?(this.resizeObserver=new ResizeObserver(()=>this.resize()),this.resizeObserver.observe(this.stage)):window.addEventListener("resize",this.resize),this.resize(),e.image&&this.load(e.image).catch(()=>{})}on(e,t){let a=this.listeners.get(e);return a||(a=new Set,this.listeners.set(e,a)),a.add(t),()=>this.off(e,t)}off(e,t){this.listeners.get(e)?.delete(t)}emit(e,t){let a=this.listeners.get(e);if(a)for(let r of a)try{r(t)}catch{}}get isReady(){return this.ready}get isLoading(){return this.loading}get accelerated(){return this.renderer.accelerated}viewport(){return{width:Math.max(1,this.stage.clientWidth),height:Math.max(1,this.stage.clientHeight)}}source(){return this.original?Pt(this.original):{width:1,height:1}}sourceBitmap(){return this.original}currentFrame(){return _t(this.viewport(),this.state.crop)}getFrame(){return this.ready?this.currentFrame():{...this.lastFrame}}paintView(){let e=this.viewport(),t=this.currentFrame();if(this.resultMode&&t.width>1&&t.height>1){let a=Math.min(e.width/t.width,e.height/t.height);return{scale:a,x:(e.width-t.width*a)/2-t.x*a,y:(e.height-t.height*a)/2-t.y*a}}return{scale:1,x:0,y:0}}sourcePointAt(e,t){if(!this.ready)return null;let a=this.stage.getBoundingClientRect(),r=this.viewport(),o=this.source(),s=this.state.transform,n=this.paintView(),u=e-a.left-r.width/2,l=t-a.top-r.height/2,c=it(r,o.width,o.height,s),h=at({x:(u-n.x)/n.scale,y:(l-n.y)/n.scale},c.radians),f={x:h.x/c.sx-s.offsetX,y:h.y/c.sy-s.offsetY},m=wt(f,rt(s)),p=(m.x+1)/2,g=(m.y+1)/2;return p<0||p>1||g<0||g>1?null:{x:p,y:g}}screenPointAt(e,t){if(!this.ready)return null;let a=this.viewport(),r=this.source(),o=this.state.transform,s=this.paintView(),n=it(a,r.width,r.height,o),u=zt({x:e*2-1,y:t*2-1},rt(o)),l=fa({x:(u.x+o.offsetX)*n.sx,y:(u.y+o.offsetY)*n.sy},n.radians);return{x:a.width/2+l.x*s.scale+s.x,y:a.height/2+l.y*s.scale+s.y}}getPreviewBitmap(){return this.preview}async load(e){let t=++this.loadSeq;this.loading=!0,this.emit("loading",{loading:!0});try{let{bitmap:a,owned:r}=await $i(e);if(t!==this.loadSeq){r&&a instanceof ImageBitmap&&a.close();return}let o=await Ia(a,this.options.maxPreview);if(t!==this.loadSeq){r&&a instanceof ImageBitmap&&a.close(),o.owned&&o.bitmap instanceof ImageBitmap&&o.bitmap.close();return}this.releaseBitmaps(),this.original=a,this.ownsOriginal=r,this.preview=o.bitmap,this.ownsPreview=o.owned,this.beautyMask=null,this.renderer.setBitmap(o.bitmap),this.ready=!0,this.loading=!1;let s=Pt(a);this.state=Et(),this.lastViewport={width:0,height:0},this.lastFrame={x:0,y:0,width:0,height:0},this.curveCache.source=null,this.state.crop.ratio=s.width/s.height,this.state.transform.zoom=.2,this.ensureCoverage(),this.history.reset(this.state),await new Promise(n=>{let u=!1,l=()=>{u||(u=!0,n())};requestAnimationFrame(l),window.setTimeout(l,120)}),this.resize(),this.renderNow(),this.emit("ready",s),this.emit("loading",{loading:!1}),this.emitState(),this.emitHistory()}catch(a){this.loading=!1,this.emit("loading",{loading:!1});let r=a instanceof Error?a:new Error(String(a));throw this.emit("error",{error:r}),r}}setImage(e){return this.load(e)}releaseBitmaps(){this.disposeAIBefore(),this.ownsOriginal&&this.original instanceof ImageBitmap&&this.original.close(),this.ownsPreview&&this.preview instanceof ImageBitmap&&this.preview!==this.original&&this.preview.close(),this.original=null,this.preview=null,this.ownsOriginal=!1,this.ownsPreview=!1}getState(){return st(this.state)}setState(e,t={}){this.state=Ae(e),this.curveCache.source=null,this.ready&&(this.ensureCoverage(),t.history!==!1&&this.history.push(this.state,"set-state"),this.scheduleRender()),t.silent||(this.emitState(),this.emitHistory())}exportState(){return JSON.stringify({version:1,state:this.getState()},null,2)}importState(e){let t=typeof e=="string"?JSON.parse(e):e,a=t&&typeof t=="object"&&"state"in t?t.state:t;this.setState(a)}setAdjust(e,t,a){let r=et[e];if(!r||!Number.isFinite(t))return;let o=x(t,r[0],r[1]);this.state.adjust[e]!==o&&(this.state.adjust[e]=o,this.scheduleRender(),this.commit(a||`adjust:${e}`))}resetAdjust(e){this.setAdjust(e,0,`reset:${e}`)}resetAdjustments(){let e=!1;for(let t of te)this.state.adjust[t]!==0&&(this.state.adjust[t]=0,e=!0);e&&(this.scheduleRender(),this.commit("reset-adjust"))}setFilter(e){let t=xt(e);this.state.filter!==t.id&&(this.state.filter=t.id,this.scheduleRender(),this.commit("filter"))}setCurve(e,t,a="curve"){let r=this.state.enhance.curves;if(!(e in r))return;let o=Rt(t),s=r[e];s.length===o.length&&s.every((n,u)=>Math.abs(n.x-o[u].x)<1e-5&&Math.abs(n.y-o[u].y)<1e-5)||(r[e]=o,this.curveCache.source=null,this.scheduleRender(),this.commit(a))}resetCurves(){this.state.enhance.curves=re(),this.curveCache.source=null,this.scheduleRender(),this.commit("reset-curves")}setHSL(e,t,a="hsl"){if(!Ft.includes(e))return;let r=this.state.enhance.hsl[e],o={hue:x(t.hue??r.hue,-100,100),saturation:x(t.saturation??r.saturation,-100,100),luminance:x(t.luminance??r.luminance,-100,100)};o.hue===r.hue&&o.saturation===r.saturation&&o.luminance===r.luminance||(this.state.enhance.hsl[e]=o,this.scheduleRender(),this.commit(a))}resetHSL(){this.state.enhance.hsl=Nt(),this.scheduleRender(),this.commit("reset-hsl")}setLUT(e,t){let a=Ke(e),r=t===void 0?this.state.enhance.lutStrength:x(t,0,100);this.state.enhance.lut===a.id&&this.state.enhance.lutStrength===r||(this.state.enhance.lut=a.id,this.state.enhance.lutStrength=r,this.scheduleRender(),this.commit("lut"))}setLUTStrength(e,t="lut-strength"){let a=x(e,0,100);this.state.enhance.lutStrength!==a&&(this.state.enhance.lutStrength=a,this.scheduleRender(),this.commit(t))}setEnhance(e,t="enhance"){let a=JSON.stringify(this.state.enhance),r=se({...this.state.enhance,...e,curves:{...this.state.enhance.curves,...e.curves||{}},hsl:{...this.state.enhance.hsl,...e.hsl||{}}});JSON.stringify(r)!==a&&(this.state.enhance=r,this.curveCache.source=null,this.scheduleRender(),this.commit(t))}resetEnhance(){this.state.enhance=se(null),this.curveCache.source=null,this.scheduleRender(),this.commit("reset-enhance")}setPreviewQuality(e){this.previewQuality=e==="high"?1:0,this.options.previewQuality=e,this.scheduleRender()}get colorSpace(){return this.colorMode}get dither(){return this.ditherEnabled}setColorSpace(e){this.options.colorSpace=e;let t=we(e,this.capabilities);this.ditherEnabled=Kt(this.options.dither,t,this.capabilities),t!==this.colorMode&&(this.colorMode=t,this.scheduleRender())}setDither(e){this.options.dither=e,this.ditherEnabled=Kt(e,this.colorMode,this.capabilities),this.scheduleRender()}setFaces(e){this.serverFaces=this.normalizeFaceBoxes(e),this.faceAnchors=[],this.anchorPack=null,this.faces=this.serverFaces.map(t=>({...t})),this.facePack=ye(this.faces),this.scheduleRender()}setFaceAnchors(e){if(!Array.isArray(e)||!e.length){this.faceAnchors=[],this.anchorPack=null,this.faces=this.serverFaces.map(a=>({...a})),this.facePack=ye(this.faces),this.scheduleRender();return}let t=Ba(e);t.count?(this.faceAnchors=e.slice(),this.faces=t.boxes.map(a=>({...a})),this.facePack={data:t.data,count:t.count},this.anchorPack=t.anchors):(this.faceAnchors=[],this.anchorPack=null,this.faces=this.serverFaces.map(a=>({...a})),this.facePack=ye(this.faces)),this.scheduleRender()}clearFaceAnchors(){this.setFaceAnchors(null)}normalizeFaceBoxes(e){return e.filter(t=>Number.isFinite(t.x)&&Number.isFinite(t.y)&&Number.isFinite(t.w)&&Number.isFinite(t.h)&&t.w>0&&t.h>0).map(t=>({x:x(t.x,0,1),y:x(t.y,0,1),w:x(t.w,0,1),h:x(t.h,0,1),confidence:Number.isFinite(t.confidence)?t.confidence:0}))}clearFaces(){this.serverFaces=[],this.faceAnchors=[],this.faces=[],this.facePack={data:new Float32Array(16),count:0},this.anchorPack=null,this.scheduleRender()}getFaces(){return this.faces.map(e=>({...e}))}hasFaceAnchors(){return this.faceAnchors.length>0}setBeautyMask(e){e&&(!Number.isFinite(e.width)||!Number.isFinite(e.height)||e.width<1||e.height<1||e.data.length!==e.width*e.height*4)||(this.beautyMask=e,this.scheduleRender())}getBeautyMask(){return this.beautyMask}addLiquifyDab(e,t="liquify"){if(!this.ready||!e||!Number.isFinite(e.x)||!Number.isFinite(e.y)||!Number.isFinite(e.dx)||!Number.isFinite(e.dy)||!Number.isFinite(e.radius)||Math.abs(e.dx)+Math.abs(e.dy)<1e-6)return;let a=this.state.retouch||(this.state.retouch=Xt());a.liquify.push({x:x(e.x,0,1),y:x(e.y,0,1),dx:x(e.dx,-.25,.25),dy:x(e.dy,-.25,.25),radius:x(e.radius,.002,.35)}),a.liquify.length>640&&a.liquify.splice(0,a.liquify.length-640),this.liquifyCache.source=null,this.scheduleRender(),this.commit(t||"liquify")}clearLiquify(e="liquify-clear"){let t=this.state.retouch?.liquify;!t||t.length===0||(this.state.retouch={liquify:[]},this.liquifyCache.source=null,this.scheduleRender(),this.commit(e))}getLiquify(){return(this.state.retouch?.liquify||[]).map(e=>({...e}))}hasLiquify(){return(this.state.retouch?.liquify.length||0)>0}async analyze(){let e=this.original||this.preview;if(!e)throw new Error("No image loaded");return ta(e,256,this.faces.length)}async autoEnhance(){let e=await this.analyze(),t=ea(e);return this.state.adjust=t.adjust,this.state.enhance.auto=!0,this.scheduleRender(),this.commit("auto"),this.emit("auto",t),t}cancelAI(){this.aiSeq+=1,this.aiController&&(this.aiController.abort(),this.aiController=null)}async runAI(e,t={}){let a=ra(e);if(!a)throw new Error(`AI adapter "${e}" is not registered`);if(!this.ready||!this.original)throw new Error("No image loaded");this.cancelAI();let r=new AbortController;this.aiController=r;let o=this.aiSeq,s=this.linkAbort(r,t.signal);try{let n=await a.load();if(o!==this.aiSeq)throw n.dispose(),Bt();let u=await oa(n,this.original,{...t,signal:s});if(o!==this.aiSeq)throw Bt();let l=this.original,c=this.preview,h=this.ownsOriginal,f=this.ownsPreview;this.original=u,this.ownsOriginal=!0,this.beautyMask=null;let m=await Ia(u,this.options.maxPreview);if(o!==this.aiSeq)throw m.owned&&m.bitmap instanceof ImageBitmap&&m.bitmap.close(),Bt();this.preview=m.bitmap,this.ownsPreview=m.owned,this.renderer.setBitmap(m.bitmap),this.disposeAIBefore(),l&&c?this.aiBefore={original:l,preview:c,ownsOriginal:h,ownsPreview:f,state:st(this.state),history:this.history}:h&&l instanceof ImageBitmap&&l.close(),this.state.transform=ae(),this.state.crop={...ie(),ratio:u.width/u.height},this.lastViewport={width:0,height:0},this.lastFrame={x:0,y:0,width:0,height:0},this.curveCache.source=null,this.ensureCoverage(),this.history=new Yt(this.options.maxHistory),this.history.reset(this.state),this.resize(),this.fitToFrame(),this.renderNow(),this.emit("ready",Pt(u)),this.emitState(),this.emitHistory()}catch(n){if(!nt(n))throw n}finally{this.aiController===r&&(this.aiController=null)}}canRevertAI(){return this.aiBefore!==null}setCompareAI(e){let t=this.aiBefore;if(!t||!this.ready)return;let a=e?t.preview:this.preview;a&&(this.renderer.setBitmap(a),this.renderNow())}revertAI(){let e=this.aiBefore;return e?(this.ownsOriginal&&this.original instanceof ImageBitmap&&this.original.close(),this.ownsPreview&&this.preview instanceof ImageBitmap&&this.preview!==this.original&&this.preview.close(),this.original=e.original,this.preview=e.preview,this.ownsOriginal=e.ownsOriginal,this.ownsPreview=e.ownsPreview,this.beautyMask=null,this.state=e.state,this.history=e.history,this.aiBefore=null,this.curveCache.source=null,this.renderer.setBitmap(e.preview),this.lastViewport={width:0,height:0},this.lastFrame={x:0,y:0,width:0,height:0},this.resize(),this.fitToFrame(),this.renderNow(),this.emit("ready",Pt(e.original)),this.emitState(),this.emitHistory(),!0):!1}disposeAIBefore(){let e=this.aiBefore;e&&(this.aiBefore=null,e.ownsOriginal&&e.original instanceof ImageBitmap&&e.original.close(),e.ownsPreview&&e.preview instanceof ImageBitmap&&e.preview!==e.original&&e.preview.close())}linkAbort(e,t){return t?t.aborted?(e.abort(),e.signal):(t.addEventListener("abort",()=>e.abort(),{once:!0}),e.signal):e.signal}enhanceSpec(e){let t=this.state.enhance;this.curveCache.source!==t.curves&&(this.curveCache.source=t.curves,this.curveCache.data=We(t.curves));let a=this.lutCache.get(t.lut);a===void 0&&(a=$e(t.lut),this.lutCache.set(t.lut,a));let r=this.state.retouch?.liquify,o=null;if(r&&r.length){let s=this.source(),n=this.liquifyCache;(n.source!==r||n.width!==s.width||n.height!==s.height)&&(this.liquifyCache={source:r,width:s.width,height:s.height,field:ke(r,s.width,s.height)}),o=this.liquifyCache.field}return Da({adjust:this.state.adjust,enhance:t,curve:this.curveCache.data,lut:a,faces:this.facePack,quality:e,linear:this.colorMode==="linear",dither:this.ditherEnabled?1:0,mask:this.beautyMask,liquify:o,anchors:this.anchorPack})}setAspect(e){let t=this.currentFrame();this.state.crop.aspect===e&&e!=="free"||(e==="free"?this.state.crop.ratio=t.width/Math.max(1,t.height):this.state.crop.scale=1,this.state.crop.aspect=e,this.ensureCoverage(),this.scheduleRender(),this.commit("aspect"))}setCrop(e,t="crop"){let a=this.state.crop;e.ratio!==void 0&&Number.isFinite(e.ratio)&&(a.ratio=x(e.ratio,.2,8)),e.scale!==void 0&&Number.isFinite(e.scale)&&(a.scale=x(e.scale,.2,1)),e.aspect!==void 0&&Me(e.aspect)&&(a.aspect=e.aspect),this.ensureCoverage(),this.scheduleRender(),this.commit(t)}setRotation(e,t="rotation"){if(!Number.isFinite(e))return;let a=((e+180)%360+360)%360-180;Math.abs(a-this.state.transform.rotation)<.01||(this.state.transform.rotation=a,this.ensureCoverage(),this.scheduleRender(),this.commit(t))}rotateBy(e){if(!Number.isFinite(e)||e===0)return;let t=e/90;if(Number.isInteger(t)){this.state.transform.turn=((this.state.transform.turn+t)%4+4)%4,this.state.crop.aspect==="free"&&Math.abs(t)%2===1?(this.state.crop.ratio=x(1/this.state.crop.ratio,.2,8),this.fitToFrame()):(this.ensureCoverage(),this.scheduleRender()),this.commit(`turn:${Date.now()}`);return}this.setRotation(this.state.transform.rotation+e,`rotate:${Date.now()}`)}resetRotation(){let e=this.state.transform;e.turn===0&&e.rotation===0||(e.turn=0,e.rotation=0,this.ensureCoverage(),this.scheduleRender(),this.commit("reset-rotation"))}flip(e){e==="h"?this.state.transform.flipH=!this.state.transform.flipH:this.state.transform.flipV=!this.state.transform.flipV,this.ensureCoverage(),this.scheduleRender(),this.commit(`flip:${e}`)}resetCrop(){let e=this.source();this.state.transform={zoom:.2,turn:0,rotation:0,flipH:!1,flipV:!1,offsetX:0,offsetY:0,perspectiveX:0,perspectiveY:0},this.state.crop={aspect:"free",ratio:e.width/Math.max(1,e.height),scale:1},this.ensureCoverage(),this.scheduleRender(),this.commit("reset-crop")}setPerspective(e,t="perspective"){let a=this.state.transform,r=x(e.perspectiveX??a.perspectiveX,-100,100),o=x(e.perspectiveY??a.perspectiveY,-100,100);if(r===a.perspectiveX&&o===a.perspectiveY)return;let s=this.viewport(),n=this.source();if(this.ready&&s.width>=8&&s.height>=8){let l=_t(s,this.state.crop),c=St(s,n.width,n.height,a,l),h=c>0?a.zoom/c:1;a.perspectiveX=r,a.perspectiveY=o;let f=St(s,n.width,n.height,a,l);a.zoom=x(h*f,f,this.maxZoom);let m=Tt(s,n.width,n.height,a,l);a.offsetX=m.x,a.offsetY=m.y}else a.perspectiveX=r,a.perspectiveY=o;this.scheduleRender(),this.commit(t)}resetPerspective(){this.state.transform.perspectiveX===0&&this.state.transform.perspectiveY===0||this.setPerspective({perspectiveX:0,perspectiveY:0},"reset-perspective")}reset(){let e=this.source();this.state=Et(),this.state.crop.ratio=e.width/Math.max(1,e.height),this.state.transform.zoom=.2,this.ensureCoverage(),this.scheduleRender(),this.commit("reset")}undo(){if(this.aiBefore&&!this.history.canUndo)return this.revertAI();let e=this.history.undo();return e?(this.state=e,this.ensureCoverage(),this.scheduleRender(),this.emitState(),this.emitHistory(),!0):!1}redo(){let e=this.history.redo();return e?(this.state=e,this.ensureCoverage(),this.scheduleRender(),this.emitState(),this.emitHistory(),!0):!1}canUndo(){return this.history.canUndo||this.aiBefore!==null}canRedo(){return this.history.canRedo}setResultMode(e){this.resultMode!==e&&(this.resultMode=e,this.cancelAnimation(),this.gesture.setEnabled(!e),this.scheduleRender())}get isResultMode(){return this.resultMode}getExportSize(){if(!this.ready)return{width:0,height:0};let e=this.viewport();if(e.width<8||e.height<8)return{width:0,height:0};let t=this.source(),a=this.currentFrame(),r=Be(ue(e,t.width,t.height,{...this.state.transform,perspectiveX:0,perspectiveY:0},a)),o=this.exportScale(r.width,r.height);return{width:Math.max(1,Math.round(r.width*o)),height:Math.max(1,Math.round(r.height*o))}}exportScale(e,t){let a=Math.max(1,e,t),r=Math.max(1,e*t);return Math.min(1,this.options.maxExport/a,Math.sqrt(this.options.maxPixels/r))}async export(e={}){if(!this.ready||!this.original)throw new Error("No image loaded");let t=e.type||"image/jpeg",a=x(Number.isFinite(e.quality)?e.quality:.92,.05,1),r=this.viewport(),o=this.source(),s=this.currentFrame(),n=ue(r,o.width,o.height,this.state.transform,s),u=Be(ue(r,o.width,o.height,{...this.state.transform,perspectiveX:0,perspectiveY:0},s)),l=this.exportScale(u.width,u.height),c=Math.max(1,Math.round(u.width*l)),h=Math.max(1,Math.round(u.height*l)),f=await ka(this.original,{width:c,height:h,quad:n,warp:rt(this.state.transform),srcWidth:o.width,srcHeight:o.height,color:xt(this.state.filter).color,css:Ze(this.state.adjust,this.state.filter),vignette:Qe(this.state.adjust),enhance:this.enhanceSpec(1),texel:[1/Math.max(1,o.width),1/Math.max(1,o.height)]},t,a,e);if(f.type!==t)throw new Error(`This browser cannot encode ${t}. Choose JPEG or PNG.`);return this.emit("export",{blob:f}),f}async toDataURL(e={}){let t=await this.export(e);return new Promise((a,r)=>{let o=new FileReader;o.onload=()=>a(String(o.result)),o.onerror=()=>r(o.error||new Error("Could not encode the image")),o.readAsDataURL(t)})}async toFile(e="aurum-edited.jpg",t={}){let a=await this.export(t),r=a.type||t.type||"image/jpeg";return new File([a],e,{type:r})}async getImageData(e={}){let t=await this.export({type:"image/png",...e});if(typeof createImageBitmap!="function")throw new Error("createImageBitmap is unavailable");let a=await createImageBitmap(t),r=document.createElement("canvas");r.width=a.width,r.height=a.height;let o=r.getContext("2d",{willReadFrequently:!0});if(!o)throw new Error("2D canvas is unavailable");o.drawImage(a,0,0);let s=o.getImageData(0,0,r.width,r.height);return a.close(),s}applyTransform(e){this.cancelAnimation(),Object.assign(this.state.transform,e),this.scheduleRender()}settle(e,t=420){this.cancelAnimation();let a=performance.now(),r={zoom:e.zoom??this.state.transform.zoom,offsetX:e.offsetX??this.state.transform.offsetX,offsetY:e.offsetY??this.state.transform.offsetY},o=++this.animationSeq;this.animation={id:o,target:r,velocity:{zoom:0,offsetX:0,offsetY:0},last:a,duration:t,started:a,commit:!0};let s=n=>{if(!this.animation||this.animation.id!==o)return;let u=Math.min(.04,Math.max(.001,(n-this.animation.last)/1e3));this.animation.last=n;let l=this.state.transform,c=(f,m,p)=>{let g=this.animation.velocity[p],b=(m-f)*220-g*26,y=g+b*u;return this.animation.velocity[p]=y,f+y*u};if(l.zoom=c(l.zoom,this.animation.target.zoom,"zoom"),l.offsetX=c(l.offsetX,this.animation.target.offsetX,"offsetX"),l.offsetY=c(l.offsetY,this.animation.target.offsetY,"offsetY"),Math.abs(l.zoom-this.animation.target.zoom)<8e-4&&Math.abs(l.offsetX-this.animation.target.offsetX)<4e-4&&Math.abs(l.offsetY-this.animation.target.offsetY)<4e-4||n-this.animation.started>this.animation.duration){l.zoom=this.animation.target.zoom,l.offsetX=this.animation.target.offsetX,l.offsetY=this.animation.target.offsetY,this.animation=null,this.scheduleRender(),this.commit("transform");return}this.scheduleRender(),requestAnimationFrame(s)};requestAnimationFrame(s)}cancelAnimation(){this.animation&&(this.animation=null)}fitToFrame(){if(!this.ready)return;let e=this.viewport();if(e.width<8||e.height<8)return;let t=this.source(),a=_t(e,this.state.crop);this.state.transform.zoom=St(e,t.width,t.height,this.state.transform,a),this.state.transform.offsetX=0,this.state.transform.offsetY=0,this.ensureCoverage(),this.scheduleRender()}ensureCoverage(){if(!this.ready)return;let e=this.viewport();if(e.width<8||e.height<8)return;let t=this.source(),a=_t(e,this.state.crop),r=St(e,t.width,t.height,this.state.transform,a);this.state.transform.zoom=x(this.state.transform.zoom,r,this.maxZoom);let o=Tt(e,t.width,t.height,this.state.transform,a);this.state.transform.offsetX=o.x,this.state.transform.offsetY=o.y,this.lastViewport=e}commit(e=""){this.commitKey=e,this.history.push(this.state,e),this.emitState(),this.emitHistory()}emitState(){this.emit("change",this.getState())}emitHistory(){this.emit("history",{canUndo:this.history.canUndo,canRedo:this.history.canRedo})}syncViewport(e){if(!this.ready){this.lastViewport=e;return}if(e.width<8||e.height<8)return;let t=this.lastViewport;t.width===e.width&&t.height===e.height||(this.preserveCropOnResize(t,e),this.ensureCoverage(),this.lastViewport=e)}preserveCropOnResize(e,t){if(e.width<8||e.height<8||t.width<8||t.height<8)return;let a=_t(e,this.state.crop),r=_t(t,this.state.crop);if(a.width<1||r.width<1)return;let o=this.source();if(o.width<2||o.height<2)return;let s=Math.max(e.width/o.width,e.height/o.height)||1,n=Math.max(t.width/o.width,t.height/o.height)||1,u=r.width/a.width;this.state.transform.zoom=x(this.state.transform.zoom*u*(s/n),.2,this.maxZoom)}scheduleRender(){this.renderPending||this.destroyed||(this.renderPending=!0,this.raf=requestAnimationFrame(()=>{this.renderPending=!1,this.renderNow()}))}renderNow(){if(!this.ready||!this.preview)return;let e=this.viewport();this.syncViewport(e);let t=this.source(),a=this.state.transform,r=this.currentFrame();this.lastFrame=r;let o=it(e,t.width,t.height,a),s={scale:1,x:0,y:0},n=r,u=null;if(this.resultMode&&r.width>1&&r.height>1){let c=Math.min(e.width/r.width,e.height/r.height),h=(e.width-r.width*c)/2-r.x*c,f=(e.height-r.height*c)/2-r.y*c;s={scale:c,x:h,y:f},n={x:r.x*c+h,y:r.y*c+f,width:r.width*c,height:r.height*c},u=n}this.renderer.resize(e.width,e.height,this.dpr);let l=this.preview?Pt(this.preview):t;this.renderer.render({width:e.width,height:e.height,srcWidth:t.width,srcHeight:t.height,sx:o.sx,sy:o.sy,rotation:Gt(a),offsetX:a.offsetX,offsetY:a.offsetY,warp:rt(a),view:s,vignetteRect:n,clipRect:u,color:xt(this.state.filter).color,css:Ze(this.state.adjust,this.state.filter),vignette:Qe(this.state.adjust),enhance:this.enhanceSpec(this.previewQuality),texel:[1/Math.max(1,l.width),1/Math.max(1,l.height)],dpr:this.dpr}),this.lastViewport=e,this.emit("render",{frame:r})}destroy(){this.destroyed||(this.destroyed=!0,this.cancelAI(),this.cancelAnimation(),cancelAnimationFrame(this.raf),this.gesture.destroy(),this.resizeObserver?.disconnect(),this.resizeObserver=null,window.removeEventListener("resize",this.resize),this.releaseBitmaps(),this.renderer.dispose(),this.stage.remove(),this.listeners.clear())}};var Pa=`.au-root{
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
.au-tick{
  --tick-h:12px;--au-tick:rgba(255,255,255,.58);
  width:1px;height:var(--tick-h);flex:0 0 1px;border-radius:1px;
  background:var(--au-tick);will-change:height;
  transition:height .16s cubic-bezier(.2,.8,.2,1),background-color .14s ease,opacity .16s ease,box-shadow .16s ease;
}
.au-tick.is-zero{--tick-h:16px;opacity:.82}
.au-tick.is-active{height:26px;background:var(--au-gold);box-shadow:0 0 9px rgba(243,199,123,.55)}
.au-tick.is-wave{animation:au-tick-wave .3s cubic-bezier(.2,.8,.2,1) var(--wave-delay,0ms) both}
.au-ticks--ruler .au-tick{--tick-h:13px;background:rgba(255,255,255,.72)}
.au-ticks--ruler .au-tick.is-zero{--tick-h:18px;opacity:.95}
.au-ticks--ruler .au-tick.is-active{height:23px;background:#fff;box-shadow:none}
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
.au-maskprev{position:absolute;inset:auto;z-index:4;display:none;border-radius:8px;box-shadow:0 8px 30px rgba(0,0,0,.4);touch-action:none;cursor:crosshair}
.au-mask-tools{margin-top:10px;padding:10px;border-radius:14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09)}
.au-mask-tools__label{font-size:11px;font-weight:750;color:#f0ead8}
.au-mask-seg{grid-template-columns:1fr 1fr!important;margin-top:6px}
.au-mask-btn{display:flex;align-items:center;justify-content:center;gap:6px;height:34px;border-radius:9px;color:var(--au-muted);font-size:11px;font-weight:700}
.au-mask-btn svg{width:15px;height:15px}
.au-mask-btn[aria-pressed="true"]{background:var(--au-gold-soft);color:var(--au-gold)}
.au-mask-hint{color:var(--au-muted);font-size:10px;line-height:1.4;margin:6px 0}
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
.au-text-arrange{display:flex;align-items:center;gap:8px;margin-top:4px}
.au-align-seg{grid-template-columns:repeat(3,1fr)!important;flex:1 1 auto;margin:0}
.au-textnode .au-text-hud{position:absolute;inset:-6px;border:1px dashed rgba(243,199,123,.7);border-radius:10px;pointer-events:none;opacity:0}
.au-textnode.is-selected .au-text-hud{opacity:1}
.au-textnode.is-selected .au-text-hud::before,.au-textnode.is-selected .au-text-hud::after{content:"";position:absolute;width:10px;height:10px;border-radius:50%;background:#f3c77b;border:1.5px solid rgba(0,0,0,.6)}
.au-textnode.is-selected .au-text-hud::before{left:-4px;top:-4px}
.au-textnode.is-selected .au-text-hud::after{right:-4px;bottom:-4px}
.au-ai-pane__sub{color:var(--au-muted);font-size:10.5px;margin-top:2px;line-height:1.4}
.au-ai-pane__list{display:flex;flex-direction:column;gap:6px;margin-top:8px}
.au-ai-row{
  text-align:left;padding:10px 12px;border-radius:13px;
  background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.09);
  transition:transform .12s ease,border-color .15s ease,background .15s ease;
}
.au-ai-row b{display:block;font-size:12.5px;font-weight:700}
.au-ai-row span{display:block;font-size:10.5px;color:var(--au-muted);margin-top:2px}
.au-ai-row:active{transform:scale(.98)}
.au-ai-row.is-primary{border-color:rgba(243,199,123,.4);background:rgba(243,199,123,.09)}
.au-ai-row.is-primary b{color:var(--au-gold)}
.au-ai-pane__note{color:var(--au-muted);font-size:10.5px;line-height:1.4;padding:4px 2px}
.au-bg-panel{z-index:70}

`;var Ua=Pa,na=!1;function ua(){if(na||typeof document>"u")return;if(document.querySelector("style[data-aurum],link[data-aurum]")){na=!0;return}let i=document.createElement("style");i.setAttribute("data-aurum",""),i.textContent=Ua,document.head.appendChild(i),na=!0}var Qi={close:'<path d="M6 6l12 12M18 6L6 18"/>',undo:'<path d="M9 14 4.5 9.5 9 5"/><path d="M4.5 9.5H14a5.5 5.5 0 0 1 0 11H9.5"/>',redo:'<path d="M15 14l4.5-4.5L15 5"/><path d="M19.5 9.5H10a5.5 5.5 0 0 0 0 11h4.5"/>',crop:'<path d="M6 2.5v14A1.5 1.5 0 0 0 7.5 18h14"/><path d="M2.5 6h14A1.5 1.5 0 0 1 18 7.5v14"/>',perspective:'<path d="M5 5h14l-2.1 14H7.1L5 5Z"/><path d="M9.5 12h5M12 9.5v5"/>',tiltY:'<path d="M12 3.4v17.2"/><path d="m8.2 7.2 3.8-3.8 3.8 3.8"/><path d="m8.2 16.8 3.8 3.8 3.8-3.8"/>',tiltX:'<path d="M3.4 12h17.2"/><path d="m7.2 8.2-3.8 3.8 3.8 3.8"/><path d="m16.8 8.2 3.8 3.8-3.8 3.8"/>',adjust:'<path d="M4 6h7M15 6h5M4 12h3M11 12h9M4 18h9M17 18h3"/><circle cx="13" cy="6" r="1.9"/><circle cx="9" cy="12" r="1.9"/><circle cx="15" cy="18" r="1.9"/>',filter:'<circle cx="9.2" cy="9.2" r="5.7"/><circle cx="14.8" cy="9.2" r="5.7"/><circle cx="12" cy="14.4" r="5.7"/>',rotateLeft:'<path d="M4.2 10.2a8 8 0 1 1 2.2 6.9"/><path d="M4 4.5v6h6"/>',rotateRight:'<path d="M19.8 10.2a8 8 0 1 0-2.2 6.9"/><path d="M20 4.5v6h-6"/>',flipH:'<path d="M12 3v18" stroke-dasharray="2 3"/><path d="M9 6 4 12l5 6V6Z"/><path d="M15 6l5 6-5 6V6Z"/>',flipV:'<path d="M3 12h18" stroke-dasharray="2 3"/><path d="M6 9l6-5 6 5H6Z"/><path d="M6 15l6 5 6-5H6Z"/>',image:'<rect x="3" y="3" width="18" height="18" rx="4.5"/><circle cx="8.6" cy="8.6" r="1.4"/><path d="m21 15-5-5L5 21"/>',download:'<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v2.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V17"/>',save:'<path d="M5 3.5h11l3 3V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 3 19V5a1.5 1.5 0 0 1 1.5-1.5Z"/><path d="M7.5 3.5v6h8v-6"/><path d="M7.5 20.5v-6h9v6"/>',copy:'<rect x="8" y="8" width="12.5" height="12.5" rx="2.4"/><path d="M16 8V5.5A2.5 2.5 0 0 0 13.5 3h-8A2.5 2.5 0 0 0 3 5.5v8A2.5 2.5 0 0 0 5.5 16H8"/>',auto:'<path d="M12 3.2l1.55 4.25L17.8 9l-4.25 1.55L12 14.8l-1.55-4.25L6.2 9l4.25-1.55L12 3.2Z"/><path d="M18.4 14.4l.72 1.98 1.98.72-1.98.72-.72 1.98-.72-1.98-1.98-.72 1.98-.72.72-1.98Z"/><path d="M5.4 14.8l.55 1.5 1.5.55-1.5.55-.55 1.5-.55-1.5-1.5-.55 1.5-.55.55-1.5Z"/>',ai:'<path d="M12 2.8l2.05 5.15L19.2 10l-5.15 2.05L12 17.2l-2.05-5.15L4.8 10l5.15-2.05L12 2.8Z"/><path d="M18.6 15.4v3.2M17 17h3.2"/><path d="M5.4 4.2v2.4M4.2 5.4h2.4"/>',wand:'<path d="M5 19.2 15.4 8.8"/><path d="M14.5 3.5l1.7 1.7M17.2 6.2l1.7 1.7M19 3.5l.9.9M14.5 3.5l.9-.9M19 3.5l.9 1.7M18.5 13.5l1.2 1.2M18.1 10.2l1.9.5M13.2 4.1l.4 2.1M9.8 3.2l.4 2.1M5.5 5.5l1.7 1.7"/>',brush:'<path d="M16.5 3.5l4 4L11 17 6.5 17.8 7 13.2 16.5 3.5Z"/><path d="M6.5 17.8l1.7 1.7"/><path d="M12.5 13.5l-1.5 1.5"/>',eraser:'<path d="M6 13.5 13.5 6l4.5 4.5L12.5 16 6 13.5Z"/><path d="M6 13.5v4.5h3"/>',magic:'<path d="M12 2.8l2.05 5.15L19.2 10l-5.15 2.05L12 17.2l-2.05-5.15L4.8 10l5.15-2.05L12 2.8Z"/><circle cx="12" cy="10" r="2.3"/>',layers:'<path d="M12 3.5 21 8.5l-9 5-9-5 9-5Z"/><path d="M3 12.5l9 5 9-5"/>',contrast:'<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17Z" fill="currentColor" stroke="none"/>',slider:'<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',liquify:'<path d="M3.5 15.8c3.4-7.2 7.9 5.6 11.5-.9 1.4-2.5 3.3-3.1 5.5-1.8"/><path d="M3.5 9.6c3.4-7.2 7.9 5.6 11.5-.9 1.4-2.5 3.3-3.1 5.5-1.8"/>',reset:'<path d="M20 12a8 8 0 1 1-2.35-5.65"/><path d="M20 4.5V10h-5.5"/>',check:'<path d="m5 12 4.5 4.5L19 7"/>',alert:'<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><circle cx="12" cy="16.5" r=".9" fill="currentColor" stroke="none"/>',text:'<path d="M5 6h14M12 6v13.2"/><path d="M9.5 19.2h5"/>',bg:'<path d="M12 12a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"/><path d="M6.5 19.2c.6-2.3 2.8-3.6 5.5-3.6s4.9 1.3 5.5 3.6"/>',bookmark:'<path d="M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v15l-6.5-4.2L5.5 20V5A1.5 1.5 0 0 1 7 3.5Z"/>',trash:'<path d="M4 6.5h16"/><path d="M9 6V4.8A1.3 1.3 0 0 1 10.3 3.5h3.4A1.3 1.3 0 0 1 15 4.8V6"/><path d="M6.5 6.5 7.3 19a1.6 1.6 0 0 0 1.6 1.5h6.2a1.6 1.6 0 0 0 1.6-1.5l.8-12.5"/><path d="M10 10.5v6M14 10.5v6"/>',plus:'<path d="M12 5.5v13M5.5 12h13"/>',duplicate:'<rect x="8.5" y="8.5" width="12" height="12" rx="2.3"/><path d="M15.5 8.5v-3A2.5 2.5 0 0 0 13 3H6a2.5 2.5 0 0 0-2.5 2.5v7A2.5 2.5 0 0 0 6 15h2.5"/>'};function H(i){return`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Qi[i]}</svg>`}var Zi={vi:{title:"Chỉnh ảnh",undo:"Hoàn tác",redo:"Làm lại",save:"Lưu",cancel:"Hủy",cancelled:"Đã hủy thay đổi",emptyTitle:"Chỉnh ảnh của bạn",emptyHint:"Kéo ảnh vào đây hoặc chọn từ thiết bị. Hỗ trợ JPEG, PNG, WebP.",openImage:"Mở ảnh",tabCrop:"Cắt",tabAdjust:"Tinh chỉnh",tabFilter:"Bộ lọc",aspect:"Tỷ lệ khung",ratioLabel:"Tỷ lệ",aspectFree:"Tự do",aspectScreen:"Màn hình",rotateLeft:"Xoay trái",rotateRight:"Xoay phải",flipH:"Lật ngang",flipV:"Lật dọc",rotation:"Góc xoay",reset:"Đặt lại",adjustTitle:"Tinh chỉnh",brightness:"Độ sáng",contrast:"Độ tương phản",saturation:"Độ bão hòa",exposure:"Phơi sáng",warmth:"Độ ấm",vignette:"Mờ góc",highlights:"Vùng sáng",shadows:"Vùng tối",whites:"Điểm trắng",blacks:"Điểm đen",tint:"Sắc thái màu",vibrance:"Độ sống động",gamma:"Gamma",clarity:"Độ rõ nét",sharpen:"Làm nét",denoise:"Khử nhiễu",smoothSkin:"Làm mịn da",blemish:"Xóa mụn / đốm",skinTexture:"Giữ chi tiết da",skinTone:"Tông da",faceSlim:"Thon gọng mặt",jawline:"Hàm",chin:"Cằm",eyeSize:"Mắt",noseSize:"Mũi",mouthSize:"Miệng",liquify:"Bóp méo",liquifyTitle:"Bóp méo vùng ảnh bằng cọ",brushSize:"Cỡ cọ",clearLiquify:"Xóa bóp méo",brightnessShort:"Sáng",contrastShort:"Tương phản",saturationShort:"Bão hòa",exposureShort:"Phơi sáng",warmthShort:"Ấm",vignetteShort:"Mờ góc",highlightsShort:"Vùng sáng",shadowsShort:"Vùng tối",whitesShort:"Trắng",blacksShort:"Đen",tintShort:"Sắc thái",vibranceShort:"Sống động",gammaShort:"Gamma",clarityShort:"Rõ nét",sharpenShort:"Nét",denoiseShort:"Khử nhiễu",smoothSkinShort:"Mịn da",blemishShort:"Xóa mụn",skinTextureShort:"Chi tiết",skinToneShort:"Tông da",faceSlimShort:"Thon mặt",jawlineShort:"Hàm",chinShort:"Cằm",eyeSizeShort:"Mắt",noseSizeShort:"Mũi",mouthSizeShort:"Miệng",groupLight:"Ánh sáng",groupColor:"Màu",groupDetail:"Chi tiết",groupPortrait:"Chân dung",groupShape:"Dáng mặt",groupEffect:"Hiệu ứng",auto:"Tự động",autoTitle:"Tự động tối ưu ảnh",autoRunning:"Đang phân tích…",autoDone:"Đã tối ưu tự động",autoFailed:"Không thể tối ưu tự động",ai:"AI 4×",aiTitle:"Phóng to và làm nét bằng AI (Real-ESRGAN)",aiRunning:"Đang chạy AI…",aiDone:"Đã làm nét bằng AI",aiFailed:"Không thể chạy AI",aiCancelled:"Đã hủy AI",aiCancel:"Hủy AI",aiPreparing:"Đang kiểm tra thiết bị…",aiTiles:"Đang xử lý từng vùng ảnh…",aiCompare:"Giữ để so sánh",aiBefore:"Bản trước AI",aiUndo:"Hoàn tác AI",aiUndoConfirm:"Hoàn tác AI sẽ bỏ các chỉnh sửa sau đó. Tiếp tục?",aiReverted:"Đã hoàn tác AI",filterTitle:"Bộ lọc màu",cropFrame:"Khung cắt",cropKeys:"Dùng phím mũi tên để đổi kích thước, giữ Shift để đổi nhanh.",perspective:"Phối cảnh",tiltVertical:"Trên / dưới",tiltHorizontal:"Trái / phải",perspectiveHint:"Kéo thanh để chỉnh độ nghiêng. Nhấn đúp vào thanh để đặt lại.",resetCrop:"Đặt lại khung cắt",resetRotation:"Đặt lại góc xoay",resetPerspective:"Đặt lại phối cảnh",resetPerspectiveY:"Đặt lại nghiêng trên / dưới",resetPerspectiveX:"Đặt lại nghiêng trái / phải",resetFilter:"Đặt lại bộ lọc",exportTitle:"Lưu ảnh",exportSub:"Kết xuất từ file gốc ở độ phân giải đầy đủ.",format:"Định dạng",quality:"Chất lượng",saveImage:"Lưu ảnh",overwrite:"Lưu đè",saveCopy:"Lưu bản sao",saving:"Đang lưu…",rendering:"Đang kết xuất ảnh…",encoding:"Đang mã hóa ảnh…",uploading:"Đang tải lên…",cancelExport:"Hủy xuất ảnh",exportCancelled:"Đã hủy xuất ảnh",saved:"Đã lưu ảnh",savedCopy:"Đã lưu bản sao",exportFailed:"Không thể xuất ảnh",notImage:"Tệp này không phải là ảnh",tabText:"Chữ",tabAi:"AI",catAll:"Tất cả",catRoot:"Chuẩn",catMeitu:"Meitu",catXingtu:"Xingtu",catLr:"Lightroom",catMono:"Đen trắng",savePreset:"Lưu bộ lọc",presetName:"Tên bộ lọc…",savedPresets:"Đã lưu",noSaved:"Chưa có bộ lọc đã lưu. Tuỳ chỉnh màu rồi bấm Lưu.",apply:"Áp dụng",deletePreset:"Xoá",presetSaved:"Đã lưu bộ lọc",presetApplied:"Đã áp dụng bộ lọc",presetDeleted:"Đã xoá bộ lọc",presetExists:"Tên này đã có — chọn tên khác",textTitle:"Thêm chữ lên ảnh",addText:"Thêm chữ",textInput:"Nội dung chữ…",fontSize:"Cỡ chữ",textOpacity:"Độ mờ",textRotate:"Xoay",bold:"Đậm",italic:"Nghiêng",outline:"Viền",shadow:"Bóng đổ",textColor:"Màu chữ",tapTextHint:"Chạm vào chữ trên ảnh để kéo • Kéo 2 tay không có — dùng thanh trượt",deleteText:"Xoá chữ",duplicateText:"Nhân đôi",bgTitle:"AI tách nền",bgSub:"Chạy offline trên máy. Model tải 1 lần (kiểm tra SHA-256), inference không dùng mạng.",bgRemove:"Xoá phông (trong suốt)",bgBlur:"Mờ phông",bgReplace:"Đổi nền trắng",bgPerson:"Tách người (MODNet)",bgNeedHost:"Bản dựng này chưa bật AI tách nền. Mở demo/ai-panel.html để thử engine offline-first.",bgRunning:"Đang tách nền…",bgDone:"Đã tách nền — cảnh báo: lịch sử chỉnh sửa được đặt lại.",bgFailed:"Chưa tách được nền",tuneTitle:"Tùy chỉnh tone",tuneHint:"Chọn tone, kéo slider để tinh chỉnh rồi Lưu.",tuneStrength:"Độ đậm",tuneBright:"Sáng",tuneContrast:"Tương phản",tuneSat:"Bão hòa",tuneWarm:"Ấm",tuneTint:"Sắc thái",tuneVig:"Mờ góc",tuneReset:"Reset tone",modelLabel:"Model",modelFast:"MODNet · Nhanh",modelBalanced:"BiRefNet · Cân bằng",modelQuality:"ISNet · Chất lượng",modelRecommended:"Khuyến nghị",modelDetailFast:"13 MB · Tách người · iPhone siêu nhẹ",modelDetailBalanced:"98 MB · Đa dụng · Chân dung + vật",modelDetailQuality:"88 MB · Tốt nhất · Edge tóc mịn",brushLabel:"Cọ",brushAdd:"Giữ (thêm)",brushErase:"Xoá",brushSizeMask:"Kích thước cọ",brushUndo:"Hoàn tác nét",brushApply:"Hoàn tất",brushCancel:"Huỷ",brushHint:"Chạm kéo trên ảnh để chỉnh viền. Thêm = giữ chủ thể, Xoá = bỏ nền.",textPinch:"Chụm 2 ngón để co giãn · Xoay bằng ngón xoay",textDoubleTap:"Chạm đúp vào chữ để sửa",textStyleTitle:"Kiểu chữ",textStyleTitle2:"Chữ đậm",textStyleCaption:"Chú thích",textStyleOutline:"Viền nổi",textQuick:"Mẫu nhanh",textArrange:"Căn chỉnh",textAlignLeft:"Trái",textAlignCenter:"Giữa",textAlignRight:"Phải"},en:{title:"Edit photo",undo:"Undo",redo:"Redo",save:"Save",cancel:"Cancel",cancelled:"Changes discarded",emptyTitle:"Edit your photo",emptyHint:"Drop an image here or choose one from your device. JPEG, PNG and WebP are supported.",openImage:"Open image",tabCrop:"Crop",tabAdjust:"Adjust",tabFilter:"Filters",aspect:"Aspect ratio",ratioLabel:"Ratio",aspectFree:"Free",aspectScreen:"Screen",rotateLeft:"Rotate left",rotateRight:"Rotate right",flipH:"Flip H",flipV:"Flip V",rotation:"Rotation",reset:"Reset",adjustTitle:"Adjust",brightness:"Brightness",contrast:"Contrast",saturation:"Saturation",exposure:"Exposure",warmth:"Warmth",vignette:"Vignette",highlights:"Highlights",shadows:"Shadows",whites:"Whites",blacks:"Blacks",tint:"Tint",vibrance:"Vibrance",gamma:"Gamma",clarity:"Clarity",sharpen:"Sharpen",denoise:"Denoise",smoothSkin:"Skin smoothing",blemish:"Blemish removal",skinTexture:"Skin texture",skinTone:"Skin tone",faceSlim:"Face slim",jawline:"Jawline",chin:"Chin",eyeSize:"Eyes",noseSize:"Nose",mouthSize:"Mouth",liquify:"Liquify",liquifyTitle:"Push pixels with a brush",brushSize:"Brush size",clearLiquify:"Clear liquify",brightnessShort:"Bright",contrastShort:"Contrast",saturationShort:"Color",exposureShort:"Exposure",warmthShort:"Warmth",vignetteShort:"Vignette",highlightsShort:"Highlights",shadowsShort:"Shadows",whitesShort:"Whites",blacksShort:"Blacks",tintShort:"Tint",vibranceShort:"Vibrance",gammaShort:"Gamma",clarityShort:"Clarity",sharpenShort:"Sharpen",denoiseShort:"Denoise",smoothSkinShort:"Smooth skin",blemishShort:"Blemish",skinTextureShort:"Texture",skinToneShort:"Skin tone",faceSlimShort:"Face",jawlineShort:"Jaw",chinShort:"Chin",eyeSizeShort:"Eyes",noseSizeShort:"Nose",mouthSizeShort:"Mouth",groupLight:"Light",groupColor:"Color",groupDetail:"Detail",groupPortrait:"Portrait",groupShape:"Face shape",groupEffect:"Effect",auto:"Auto",autoTitle:"Auto enhance",autoRunning:"Analyzing…",autoDone:"Auto enhance applied",autoFailed:"Could not auto enhance",ai:"AI 4×",aiTitle:"Upscale and sharpen with AI (Real-ESRGAN)",aiRunning:"Running AI…",aiDone:"AI enhancement complete",aiFailed:"AI processing failed",aiCancelled:"AI cancelled",aiCancel:"Cancel AI",aiPreparing:"Checking device…",aiTiles:"Processing image tiles…",aiCompare:"Hold to compare",aiBefore:"Before AI",aiUndo:"Undo AI",aiUndoConfirm:"Undo AI will discard edits made after it. Continue?",aiReverted:"AI reverted",filterTitle:"Color presets",cropFrame:"Crop frame",cropKeys:"Use the arrow keys to resize, hold Shift for larger steps.",perspective:"Perspective",tiltVertical:"Top / bottom",tiltHorizontal:"Left / right",perspectiveHint:"Drag the ruler to adjust the tilt. Double-tap it to reset.",resetCrop:"Reset crop frame",resetRotation:"Reset rotation",resetPerspective:"Reset perspective",resetPerspectiveY:"Reset top / bottom tilt",resetPerspectiveX:"Reset left / right tilt",resetFilter:"Reset filters",exportTitle:"Save image",exportSub:"Rendered from the original file at full resolution.",format:"Format",quality:"Quality",saveImage:"Save image",overwrite:"Overwrite",saveCopy:"Save copy",saving:"Saving…",rendering:"Rendering image…",encoding:"Encoding image…",uploading:"Uploading…",cancelExport:"Cancel export",exportCancelled:"Export cancelled",saved:"Image saved",savedCopy:"Copy saved",exportFailed:"Could not export the image",notImage:"That file is not an image",tabText:"Text",tabAi:"AI",catAll:"All",catRoot:"Basic",catMeitu:"Meitu",catXingtu:"Xingtu",catLr:"Lightroom",catMono:"Mono",savePreset:"Save filter",presetName:"Filter name…",savedPresets:"Saved",noSaved:"No saved filters yet. Tune the look, then tap Save.",apply:"Apply",deletePreset:"Delete",presetSaved:"Filter saved",presetApplied:"Filter applied",presetDeleted:"Filter deleted",presetExists:"That name exists — pick another",textTitle:"Add text to photo",addText:"Add text",textInput:"Text content…",fontSize:"Size",textOpacity:"Opacity",textRotate:"Rotate",bold:"Bold",italic:"Italic",outline:"Outline",shadow:"Shadow",textColor:"Text color",tapTextHint:"Drag the text on the photo • Use sliders to size/rotate",deleteText:"Delete text",duplicateText:"Duplicate",bgTitle:"AI background",bgSub:"Runs offline on-device. Model downloads once (SHA-256 checked); inference never uses the network.",bgRemove:"Remove background (transparent)",bgBlur:"Blur background",bgReplace:"White background",bgPerson:"Person matte (MODNet)",bgNeedHost:"This build has no AI background action. Open demo/ai-panel.html to try the offline engine.",bgRunning:"Removing background…",bgDone:"Background removed — note: edit history is reset.",bgFailed:"Could not remove background",tuneTitle:"Tone tune",tuneHint:"Pick a tone, drag sliders to refine, then Save.",tuneStrength:"Strength",tuneBright:"Brightness",tuneContrast:"Contrast",tuneSat:"Saturation",tuneWarm:"Warmth",tuneTint:"Tint",tuneVig:"Vignette",tuneReset:"Reset tune",modelLabel:"Model",modelFast:"MODNet · Fast",modelBalanced:"BiRefNet · Balanced",modelQuality:"ISNet · Quality",modelRecommended:"Recommended",modelDetailFast:"13 MB · Portrait · iPhone light",modelDetailBalanced:"98 MB · General · Portrait + object",modelDetailQuality:"88 MB · Best · Fine hair edge",brushLabel:"Brush",brushAdd:"Keep (add)",brushErase:"Erase",brushSizeMask:"Brush size",brushUndo:"Undo stroke",brushApply:"Done",brushCancel:"Cancel",brushHint:"Drag on the photo to fix edges. Keep = foreground, Erase = background.",textPinch:"Pinch to resize · Twist to rotate",textDoubleTap:"Double-tap text to edit",textStyleTitle:"Title",textStyleTitle2:"Bold title",textStyleCaption:"Caption",textStyleOutline:"Outline",textQuick:"Quick styles",textArrange:"Align",textAlignLeft:"Left",textAlignCenter:"Center",textAlignRight:"Right"}},qa=[{id:"adjust",icon:"adjust",label:"tabAdjust"},{id:"filter",icon:"filter",label:"tabFilter"},{id:"text",icon:"text",label:"tabText"},{id:"ai",icon:"wand",label:"tabAi"},{id:"crop",icon:"crop",label:"tabCrop"}],Ji=[{id:"free",label:"free"},{id:"1:1",label:"1:1"},{id:"4:3",label:"4:3"},{id:"3:4",label:"3:4"},{id:"16:9",label:"16:9"},{id:"9:16",label:"9:16"},{id:"screen",label:"screen"}],tr={brightness:"brightnessShort",contrast:"contrastShort",saturation:"saturationShort",exposure:"exposureShort",warmth:"warmthShort",vignette:"vignetteShort",highlights:"highlightsShort",shadows:"shadowsShort",whites:"whitesShort",blacks:"blacksShort",tint:"tintShort",vibrance:"vibranceShort",gamma:"gammaShort",clarity:"clarityShort",sharpen:"sharpenShort",denoise:"denoiseShort",smoothSkin:"smoothSkinShort",blemish:"blemishShort",skinTexture:"skinTextureShort",skinTone:"skinToneShort",faceSlim:"faceSlimShort",jawline:"jawlineShort",chin:"chinShort",eyeSize:"eyeSizeShort",noseSize:"noseSizeShort",mouthSize:"mouthSizeShort"},er=[{id:"light",label:"groupLight",keys:["brightness","exposure","contrast","highlights","shadows","whites","blacks"]},{id:"color",label:"groupColor",keys:["saturation","vibrance","warmth","tint","gamma"]},{id:"detail",label:"groupDetail",keys:["clarity","sharpen","denoise"]},{id:"portrait",label:"groupPortrait",keys:["smoothSkin","skinTexture","blemish","skinTone"]},{id:"shape",label:"groupShape",keys:["faceSlim","jawline","chin","eyeSize","noseSize","mouthSize"]},{id:"effect",label:"groupEffect",keys:["vignette"]}],Ut=[{type:"image/jpeg",label:"JPEG"},{type:"image/webp",label:"WebP"},{type:"image/png",label:"PNG"}],ar=0,Vt=[{id:"sys",label:"San",stack:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"},{id:"serif",label:"Serif",stack:"Georgia,'Times New Roman',serif"},{id:"mono",label:"Mono",stack:"'SF Mono',Menlo,Consolas,monospace"},{id:"round",label:"Rounded",stack:"'Arial Rounded MT Bold','Helvetica Neue',sans-serif"},{id:"heavy",label:"Heavy",stack:"'Arial Black',Impact,sans-serif"},{id:"title",label:"Title",stack:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"},{id:"caption",label:"Caption",stack:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"}];function ir(){return{id:`t${Date.now().toString(36)}${Math.floor(Math.random()*1e4).toString(36)}`,text:"",x:.5,y:.5,size:.07,color:"#ffffff",bold:!1,italic:!1,outline:!1,shadow:!0,align:"center",rotation:0,opacity:1,font:"sys"}}function rr(i,e){e==="title"?(i.font="sys",i.bold=!0,i.size=.11,i.outline=!1,i.shadow=!0,i.color="#ffffff"):e==="bold"?(i.font="heavy",i.bold=!0,i.size=.09,i.outline=!1,i.shadow=!1):e==="caption"?(i.font="sys",i.bold=!1,i.italic=!1,i.size=.045,i.outline=!1,i.shadow=!1):e==="outline"&&(i.font="heavy",i.bold=!0,i.size=.09,i.outline=!0,i.shadow=!1,i.color="#ffffff")}var Fa="aurum:user-presets:v1";function or(){try{let i=localStorage.getItem(Fa);if(!i)return[];let e=JSON.parse(i);return Array.isArray(e)?e.filter(t=>!!t&&typeof t=="object"&&typeof t.name=="string"):[]}catch{return[]}}function Ha(i){try{localStorage.setItem(Fa,JSON.stringify(i))}catch{}}function ft(i){return i<0?0:i>1?1:i}function Te(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function v(i,e){let t=document.createElement(i);return e&&(t.className=e),t}function F(i,e){let t=i.querySelector(e);if(!t)throw new Error(`Aurum: missing UI node ${e}`);return t}function pt(i,e,t){let a=v("button","au-icon au-glass");return a.type="button",a.title=e,a.setAttribute("aria-label",e),a.innerHTML=H(i),a.addEventListener("click",t),a}function sr(i,e){let t=URL.createObjectURL(i),a=v("a");a.href=t,a.download=e,document.body.appendChild(a),a.click(),a.remove(),window.setTimeout(()=>URL.revokeObjectURL(t),4e3)}function nr(i,e){let t=e||"";if(!t&&typeof i=="string")try{let a=new URL(i,location.href);t=decodeURIComponent(a.pathname.split("/").pop()||"")}catch{t=""}return!t&&i instanceof File&&(t=i.name),t=t.replace(/\.[a-z0-9]{1,5}$/i,"").replace(/[\\/:*?"<>|]+/g,"").trim(),t.slice(0,64)||"aurum"}function yt(i){return i>0?`+${i}`:String(i)}var Qt=class extends At{constructor(t){let a=typeof t.container=="string"?document.querySelector(t.container):t.container;if(!a)throw new Error(`Aurum: container "${String(t.container)}" was not found`);t.injectStyles!==!1&&ua();let r=v("div","au-root");r.tabIndex=-1;let o=v("div","au-work");r.appendChild(o),a.appendChild(r);let{image:s,locale:n,title:u,fileName:l,theme:c,onSave:h,onSaveCopy:f,onClose:m,autoDownload:p,startTab:g,exportTypes:b,aiAction:y,backgroundAction:w,..._}=t;super({..._,container:o,background:_.background??"transparent"});d(this,"root");d(this,"work");d(this,"frameEl");d(this,"sheetWrap");d(this,"toastEl");d(this,"undoBtn");d(this,"redoBtn");d(this,"saveBtn");d(this,"ratioBtn");d(this,"rotationBtn");d(this,"perspectiveYBtn");d(this,"perspectiveXBtn");d(this,"ratioValue");d(this,"rotationValue");d(this,"perspectiveYValue");d(this,"perspectiveXValue");d(this,"ratioContext");d(this,"rotationContext");d(this,"perspectiveYContext");d(this,"perspectiveXContext");d(this,"perspectiveYControl");d(this,"perspectiveXControl");d(this,"modesWrap");d(this,"modesTrack");d(this,"chipsEl");d(this,"scrimEl");d(this,"cropResetBtn");d(this,"adjustValue");d(this,"autoBtn");d(this,"autoLabel");d(this,"aiAction");d(this,"aiBtn",null);d(this,"aiPanel");d(this,"aiDetail");d(this,"aiBar");d(this,"aiBusy",!1);d(this,"aiAbort",null);d(this,"aiCompareBar",null);d(this,"aiCompareHold",null);d(this,"aiCompareOn",!1);d(this,"paramsEl");d(this,"filterWrap");d(this,"filterCats");d(this,"filterCat","all");d(this,"filterHint");d(this,"savedWrap");d(this,"filterNameInput");d(this,"filterSaveBtn");d(this,"savedList");d(this,"userPresets",or());d(this,"filterTuneKey","brightness");d(this,"filterTuneTicks");d(this,"filterTuneValue");d(this,"filterTuneButtons",new Map);d(this,"filterTuneWrap");d(this,"backgroundAction");d(this,"bgBusy",!1);d(this,"bgAbort",null);d(this,"bgDetail");d(this,"bgPanel");d(this,"bgModel",(()=>{try{let t=localStorage.getItem("aurum:ai-model");return t==="isnet-fp16"||t==="birefnet-lite-512-fp16"||t==="modnet-fp16"?t:"isnet-fp16"}catch{return"isnet-fp16"}})());d(this,"bgModelButtons",new Map);d(this,"bgModelDetail");d(this,"refineCanvas");d(this,"refineOn",!1);d(this,"refineSource",null);d(this,"refineWidth",0);d(this,"refineHeight",0);d(this,"refineMaskWidth",0);d(this,"refineMaskHeight",0);d(this,"refineMask",null);d(this,"refineOriginalMask",null);d(this,"refineMode","remove");d(this,"refineModelId","");d(this,"brushMode","add");d(this,"brushSize",7);d(this,"refineHistory",[]);d(this,"refineStroke",null);d(this,"maskToolbar");d(this,"maskBrushTicks");d(this,"textLayer");d(this,"texts",[]);d(this,"selectedTextId",null);d(this,"textInput");d(this,"textSizeTicks");d(this,"textOpacityTicks");d(this,"textRotateTicks");d(this,"textControls");d(this,"qualityRow");d(this,"progressEl");d(this,"progressBar");d(this,"progressText");d(this,"progressLabel");d(this,"progressCancel");d(this,"exportAbort",null);d(this,"saveLabel");d(this,"saveImageBtn");d(this,"saveCopyBtn",null);d(this,"saveCopyLabel",null);d(this,"metaName");d(this,"metaInfo");d(this,"s");d(this,"locale");d(this,"fileBase");d(this,"customTitle");d(this,"onSaveCb");d(this,"onSaveCopyCb");d(this,"onCloseCb");d(this,"autoDownload");d(this,"quality",92);d(this,"exportType","image/jpeg");d(this,"exportTypes",Ut.map(t=>t.type));d(this,"currentTab","adjust");d(this,"cropMode","ratio");d(this,"lastAspect",null);d(this,"adjustKey","brightness");d(this,"liquifyOn",!1);d(this,"liquifySize",5);d(this,"liquifyGesture",0);d(this,"liquifyButton",null);d(this,"adjustContext",null);d(this,"liquifyContext",null);d(this,"liquifyTicks",null);d(this,"liquifyValue",null);d(this,"liquifyRing",null);d(this,"liquifyStroke",null);d(this,"saving",!1);d(this,"autoBusy",!1);d(this,"uiDestroyed",!1);d(this,"dragDepth",0);d(this,"toastTimer",0);d(this,"ratioTimer",0);d(this,"cropKeyTimer",0);d(this,"cropDrag",null);d(this,"frameBox",{x:NaN,y:NaN,w:NaN,h:NaN});d(this,"uid",`au${++ar}`);d(this,"tabButtons",new Map);d(this,"panes",new Map);d(this,"aspectButtons",new Map);d(this,"flipButtons",new Map);d(this,"adjustButtons",new Map);d(this,"filterButtons",new Map);d(this,"formatButtons",new Map);d(this,"rotationControl");d(this,"adjustTicks");d(this,"qualityControl");d(this,"fileInput");d(this,"onLiquifyPointerDown",t=>{if(!this.liquifyOn||!this.isReady||t.pointerType==="mouse"&&t.button!==0)return;let a=this.sourcePointAt(t.clientX,t.clientY);if(a){t.preventDefault(),t.stopPropagation();try{this.stage.setPointerCapture(t.pointerId)}catch{}this.liquifyStroke={pointerId:t.pointerId,key:`liquify:${++this.liquifyGesture}`,x:t.clientX,y:t.clientY,u:a.x,v:a.y},this.previewLiquifyRing(t.clientX,t.clientY)}});d(this,"onLiquifyPointerMove",t=>{if(!this.liquifyOn)return;this.previewLiquifyRing(t.clientX,t.clientY);let a=this.liquifyStroke;if(!a||a.pointerId!==t.pointerId)return;t.preventDefault(),t.stopPropagation();let r=Math.max(1.5,this.liquifyScreenRadius()*.35),o=Math.hypot(t.clientX-a.x,t.clientY-a.y);if(o<r)return;let s=(t.clientX-a.x)/o,n=(t.clientY-a.y)/o,u=Math.min(48,Math.floor(o/r));for(;u>0;){u-=1,a.x+=s*r,a.y+=n*r,o-=r;let l=this.sourcePointAt(a.x,a.y);if(!l)continue;let c=l.x-a.u,h=l.y-a.v;Math.abs(c)+Math.abs(h)>1e-5&&this.addLiquifyDab({x:a.u,y:a.v,dx:c,dy:h,radius:this.liquifyRadius()},a.key),a.u=l.x,a.v=l.y}});d(this,"onLiquifyPointerUp",t=>{if(!(!this.liquifyStroke||this.liquifyStroke.pointerId!==t.pointerId)){this.liquifyStroke=null;try{this.stage.releasePointerCapture(t.pointerId)}catch{}}});d(this,"onCropKeyDown",t=>{if(!this.isReady)return;let a=t.key==="ArrowRight"||t.key==="ArrowDown",r=t.key==="ArrowLeft"||t.key==="ArrowUp";if(!a&&!r)return;t.preventDefault();let o=this.currentFrame();if(o.width<2||o.height<2)return;let s=t.shiftKey?24:8,n=this.getState(),u=n.crop.aspect!=="free"&&n.crop.aspect!=="screen",l=`crop-key:${Date.now()}`;if(u){let c=1+(a?1:-1)*s*2/Math.max(1,o.width);this.setCrop({scale:x(n.crop.scale*c,.2,1)},l)}else{let c=t.key==="ArrowRight"?s:t.key==="ArrowLeft"?-s:0,h=t.key==="ArrowDown"?s:t.key==="ArrowUp"?-s:0,f=Math.max(24,o.width+c*2),m=Math.max(24,o.height+h*2),p=x(f/m,.2,8),g=ne(this.viewport(),p),b=x(f/Math.max(1,g.width),.2,1);this.setCrop({aspect:"free",ratio:p,scale:b},l)}this.markCropKeying(),this.positionFrame(this.currentFrame())});d(this,"onCropPointerDown",t=>{let r=t.target?.closest("[data-crop-handle]");if(!r||!this.frameEl.contains(r)||t.pointerType==="mouse"&&t.button!==0||!this.isReady||this.cropDrag)return;t.preventDefault(),t.stopPropagation();let o=this.currentFrame();if(o.width<2||o.height<2)return;let s=this.getState(),n=this.viewport(),u=t.pointerId,l=h=>{h.pointerId===u&&this.dragCrop(h)},c=h=>{h.pointerId===u&&this.endCropDrag()};this.cropDrag={pointerId:u,handle:r.dataset.cropHandle||"",startX:t.clientX,startY:t.clientY,frame:o,viewport:n,aspect:s.crop.aspect,startScale:s.crop.scale,startRatio:o.width/Math.max(1,o.height),key:`crop-drag:${Date.now()}`,handleEl:r,move:l,end:c},this.frameEl.classList.add("is-locked"),r.classList.add("is-dragging");try{r.setPointerCapture(u)}catch{}r.addEventListener("pointermove",l),r.addEventListener("pointerup",c),r.addEventListener("pointercancel",c),this.cropKeyTimer&&(window.clearTimeout(this.cropKeyTimer),this.cropKeyTimer=0),this.frameEl.classList.add("is-dragging"),this.root.classList.add("au-cropping")});if(this.root=r,this.work=o,this.locale=n==="en"?"en":"vi",this.s=Zi[this.locale],this.fileBase=nr(s,l),this.customTitle=u,this.onSaveCb=h,this.onSaveCopyCb=f,this.onCloseCb=m,this.autoDownload=p!==!1,this.aiAction=y,this.backgroundAction=w,b&&b.length&&(this.exportTypes=b.filter((M,R)=>Ut.some(L=>L.type===M)&&b.indexOf(M)===R),this.exportTypes.length||(this.exportTypes=Ut.map(M=>M.type)),this.exportType=this.exportTypes[0]),c)for(let[M,R]of Object.entries(c))r.style.setProperty(M.startsWith("--")?M:`--au-${M}`,R);this.buildChrome(),this.syncUI(),this.setCropMode("ratio"),this.setTab(g||"adjust"),s&&this.openSource(s)}showTab(t){this.setTab(t)}openExport(){this.openSheet()}undo(){let t=this.canRevertAI(),a=super.undo();return a&&t&&!this.canRevertAI()&&(this.setAICompareVisible(!1),this.toast(this.s.aiReverted)),a}destroy(){this.uiDestroyed||(this.uiDestroyed=!0,this.setLiquify(!1),this.toastTimer&&window.clearTimeout(this.toastTimer),this.clearTransient(),this.cropDrag&&this.endCropDrag(),super.destroy(),this.root.remove())}buildChrome(){this.buildOverlay(),this.buildTextLayer(),this.buildEmpty(),this.buildLoading(),this.buildHeader(),this.buildDock(),this.buildSheet(),this.buildAI(),this.buildBG(),this.buildToast(),this.buildLiquifyOverlay(),this.bindEvents()}buildOverlay(){let t=v("div","au-overlay"),a=v("div","au-scrim");a.setAttribute("aria-hidden","true");let r=v("div","au-frame");r.setAttribute("role","group"),r.tabIndex=0,r.setAttribute("aria-label",`${this.s.cropFrame}. ${this.s.cropKeys}`);for(let o of["33.333%","66.666%"]){let s=v("span","au-grid v");s.style.left=o,s.setAttribute("aria-hidden","true"),r.appendChild(s);let n=v("span","au-grid h");n.style.top=o,n.setAttribute("aria-hidden","true"),r.appendChild(n)}for(let o of["tl","tr","br","bl"]){let s=v("span",`au-corner ${o}`);s.dataset.cropHandle=o,s.setAttribute("aria-hidden","true"),r.appendChild(s)}for(let o of["n","e","s","w"]){let s=v("span",`au-edge ${o}`);s.dataset.cropHandle=o,s.setAttribute("aria-hidden","true"),r.appendChild(s)}t.appendChild(a),t.appendChild(r),this.work.appendChild(t),this.frameEl=r,this.scrimEl=a}buildEmpty(){let t=v("div","au-empty");t.innerHTML=`<div class="au-empty__icon">${H("image")}</div><h3></h3><p></p><button class="au-ghost" type="button"></button>`,F(t,"h3").textContent=this.s.emptyTitle,F(t,"p").textContent=this.s.emptyHint;let a=F(t,"button");a.textContent=this.s.openImage,a.addEventListener("click",()=>this.fileInput?.click());let r=document.createElement("input");r.type="file",r.accept="image/*",r.hidden=!0,r.addEventListener("change",()=>{let o=r.files?.[0];r.value="",o&&this.openSource(o)}),this.fileInput=r,t.appendChild(r),this.work.appendChild(t),this.work.addEventListener("dragenter",o=>{o.preventDefault(),this.dragDepth+=1,this.root.classList.add("au-dragover")}),this.work.addEventListener("dragover",o=>{o.preventDefault(),o.dataTransfer&&(o.dataTransfer.dropEffect="copy")}),this.work.addEventListener("dragleave",()=>{this.dragDepth=Math.max(0,this.dragDepth-1),this.dragDepth||this.root.classList.remove("au-dragover")}),this.work.addEventListener("drop",o=>{o.preventDefault(),this.dragDepth=0,this.root.classList.remove("au-dragover");let s=o.dataTransfer?.files?.[0];if(s){if(!s.type.startsWith("image/")){this.toast(this.s.notImage,!0);return}this.openSource(s)}})}buildLoading(){let t=v("div","au-loading");t.innerHTML='<div class="au-spinner"></div>',this.work.appendChild(t)}buildHeader(){let t=v("header","au-top");t.setAttribute("aria-label",this.customTitle||this.s.title);let a=v("div","au-top__row au-top__row--primary"),r=v("button","au-top__cancel au-glass");r.type="button",r.textContent=this.s.cancel,r.addEventListener("click",()=>this.cancel()),this.saveBtn=v("button","au-top__save au-glass au-glass--gold"),this.saveBtn.type="button",this.saveBtn.innerHTML=`${H("save")}<span></span>`;let o=this.saveBtn.querySelector("span");o&&(o.textContent=this.s.save),this.saveBtn.disabled=!0,this.saveBtn.addEventListener("click",()=>this.openSheet()),a.append(r,this.saveBtn);let s=v("div","au-top__row au-top__row--tools"),n=v("div","au-top__group");this.undoBtn=pt("undo",this.s.undo,()=>this.undo()),this.redoBtn=pt("redo",this.s.redo,()=>this.redo()),this.undoBtn.disabled=!0,this.redoBtn.disabled=!0,n.append(this.undoBtn,this.redoBtn);let u=v("div","au-top__group"),l=pt("rotateLeft",this.s.rotateLeft,()=>this.rotateBy(-90)),c=pt("rotateRight",this.s.rotateRight,()=>this.rotateBy(90)),h=pt("flipH",this.s.flipH,()=>this.flip("h")),f=pt("flipV",this.s.flipV,()=>this.flip("v"));if(this.flipButtons.set("flipH",h),this.flipButtons.set("flipV",f),u.append(l,c,h,f),s.append(n,u),this.aiAction){let m=v("div","au-top__group"),p=v("button","au-top__ai au-glass");p.type="button",p.title=this.aiAction.title,p.setAttribute("aria-label",this.aiAction.title),p.innerHTML=`${H("ai")}<span></span>`;let g=p.querySelector("span");g&&(g.textContent=this.aiAction.label),p.addEventListener("click",()=>{this.runAIAction()}),this.aiBtn=p,m.appendChild(p),s.appendChild(m)}t.append(a,s),this.root.insertBefore(t,this.work)}buildDock(){let t=v("div","au-dock"),a=v("div","au-deck"),r=v("div","au-tabs");r.setAttribute("role","tablist"),r.setAttribute("aria-label",this.s.title);for(let s of qa){let n=`${this.uid}-pane-${s.id}`,u=`${this.uid}-tab-${s.id}`,l=v("button","au-tab");l.type="button",l.id=u,l.setAttribute("role","tab"),l.setAttribute("aria-selected","false"),l.setAttribute("aria-controls",n),l.innerHTML=H(s.icon);let c=v("span");c.textContent=this.s[s.label],l.appendChild(c),l.addEventListener("click",()=>this.setTab(s.id)),this.tabButtons.set(s.id,l),r.appendChild(l);let h=v("section","au-pane");h.id=n,h.setAttribute("role","tabpanel"),h.setAttribute("aria-labelledby",u),s.id==="crop"&&this.buildCropPane(h),s.id==="adjust"&&this.buildAdjustPane(h),s.id==="filter"&&this.buildFilterPane(h),s.id==="text"&&this.buildTextPane(h),s.id==="ai"&&this.buildAIPane(h),this.panes.set(s.id,h),a.appendChild(h)}r.addEventListener("keydown",s=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(s.key))return;s.preventDefault();let u=qa.map(h=>h.id),l=Math.max(0,u.indexOf(this.currentTab)),c=s.key==="Home"?u[0]:s.key==="End"?u[u.length-1]:u[(l+(s.key==="ArrowRight"?1:-1)+u.length)%u.length];this.setTab(c),this.tabButtons.get(c)?.focus()});let o=this.buildAICompare();t.append(a,...o?[o]:[],r),this.root.appendChild(t)}buildAICompare(){if(!this.aiAction)return null;let t=v("div","au-aicmp au-glass");t.hidden=!0;let a=v("button","au-aicmp__hold");a.type="button",a.textContent=this.s.aiCompare,a.setAttribute("aria-pressed","false");let r=v("button","au-aicmp__undo");r.type="button",r.textContent=this.s.aiUndo;let o=n=>{this.aiCompareOn!==n&&(this.aiCompareOn=n,this.setCompareAI(n),a.classList.toggle("is-on",n),a.setAttribute("aria-pressed",String(n)),a.textContent=n?this.s.aiBefore:this.s.aiCompare)},s=()=>o(!1);return a.addEventListener("pointerdown",n=>{if(n.button===0){try{a.setPointerCapture(n.pointerId)}catch{}o(!0),n.preventDefault()}}),a.addEventListener("pointerup",s),a.addEventListener("pointercancel",s),a.addEventListener("keydown",n=>{n.key!==" "&&n.key!=="Enter"||(n.preventDefault(),o(!0))}),a.addEventListener("keyup",n=>{(n.key===" "||n.key==="Enter")&&o(!1)}),a.addEventListener("contextmenu",n=>n.preventDefault()),r.addEventListener("click",()=>{this.history.canUndo&&!window.confirm(this.s.aiUndoConfirm)||this.revertAI()&&(this.setAICompareVisible(!1),this.toast(this.s.aiReverted))}),t.append(a,r),this.aiCompareBar=t,this.aiCompareHold=a,t}setAICompareVisible(t){this.aiCompareBar&&(!t&&this.aiCompareOn&&(this.aiCompareOn=!1,this.setCompareAI(!1),this.aiCompareHold&&(this.aiCompareHold.textContent=this.s.aiCompare,this.aiCompareHold.classList.remove("is-on"),this.aiCompareHold.setAttribute("aria-pressed","false"))),this.aiCompareBar.hidden=!t)}buildCropPane(t){let a=v("div","au-deck__row au-deck__row--top");this.ratioBtn=v("button","au-mode au-glass"),this.ratioBtn.type="button",this.ratioBtn.innerHTML=`${H("crop")}<span class="au-mode__value"></span>`,this.ratioValue=F(this.ratioBtn,".au-mode__value"),this.ratioBtn.setAttribute("aria-pressed","true"),this.ratioBtn.addEventListener("click",()=>this.setCropMode("ratio")),this.rotationBtn=v("button","au-mode au-glass"),this.rotationBtn.type="button",this.rotationBtn.innerHTML=`${H("rotateRight")}<span class="au-mode__value"></span>`,this.rotationValue=F(this.rotationBtn,".au-mode__value"),this.rotationBtn.setAttribute("aria-pressed","false"),this.rotationBtn.addEventListener("click",()=>this.setCropMode("rotation")),this.perspectiveYBtn=v("button","au-mode au-mode--persp au-glass"),this.perspectiveYBtn.type="button",this.perspectiveYBtn.innerHTML=`${H("tiltY")}<span class="au-mode__value"></span>`,this.perspectiveYBtn.title=`${this.s.tiltVertical} · ${this.s.perspectiveHint}`,this.perspectiveYValue=F(this.perspectiveYBtn,".au-mode__value"),this.perspectiveYBtn.setAttribute("aria-pressed","false"),this.perspectiveYBtn.addEventListener("click",()=>this.setCropMode("perspectiveY")),this.perspectiveXBtn=v("button","au-mode au-mode--persp au-glass"),this.perspectiveXBtn.type="button",this.perspectiveXBtn.innerHTML=`${H("tiltX")}<span class="au-mode__value"></span>`,this.perspectiveXBtn.title=`${this.s.tiltHorizontal} · ${this.s.perspectiveHint}`,this.perspectiveXValue=F(this.perspectiveXBtn,".au-mode__value"),this.perspectiveXBtn.setAttribute("aria-pressed","false"),this.perspectiveXBtn.addEventListener("click",()=>this.setCropMode("perspectiveX")),this.modesWrap=v("div","au-modes"),this.modesTrack=v("div","au-modes__track"),this.modesTrack.append(this.ratioBtn,this.rotationBtn,this.perspectiveYBtn,this.perspectiveXBtn),this.modesWrap.appendChild(this.modesTrack);let r=pt("reset",this.s.resetCrop,()=>this.resetCropMode());r.classList.add("au-reset"),this.cropResetBtn=r,a.append(this.modesWrap,r),t.appendChild(a);let o=v("div","au-deck__row au-deck__row--context");this.ratioContext=v("div","au-context is-active"),this.ratioContext.dataset.context="ratio";let s=v("div","au-chipsrail"),n=v("div","au-chips");n.setAttribute("role","group"),n.setAttribute("aria-label",this.s.aspect);for(let u of Ji){let l=v("button","au-chip");l.type="button",l.textContent=this.aspectLabel(u.id),l.setAttribute("aria-pressed","false"),l.addEventListener("click",()=>this.chooseAspect(u.id)),this.aspectButtons.set(u.id,l),n.appendChild(l)}s.appendChild(n),this.chipsEl=n,this.ratioContext.appendChild(s),this.rotationContext=v("div","au-context"),this.rotationContext.dataset.context="rotation",this.rotationControl=this.makeTicks({label:this.s.rotation,min:-180,max:180,step:1,tickStep:5,defaultValue:0,zero:!0,head:!1,ruler:!0,format:u=>`${Math.round(u)}°`,onInput:u=>this.setRotation(u),onDragStart:()=>this.beginRotationDrag(),onDragEnd:()=>this.endRotationDrag()}),this.rotationContext.appendChild(this.rotationControl.row),this.perspectiveYContext=v("div","au-context"),this.perspectiveYContext.dataset.context="perspectiveY",this.perspectiveYControl=this.makeTicks({label:this.s.tiltVertical,min:-100,max:100,step:1,tickStep:5,defaultValue:0,zero:!0,head:!1,ruler:!0,format:u=>yt(Math.round(u)),onInput:u=>this.setPerspective({perspectiveY:u})}),this.perspectiveYControl.rail.addEventListener("dblclick",()=>{this.setPerspective({perspectiveY:0},"perspective")}),this.perspectiveYContext.appendChild(this.perspectiveYControl.row),this.perspectiveXContext=v("div","au-context"),this.perspectiveXContext.dataset.context="perspectiveX",this.perspectiveXControl=this.makeTicks({label:this.s.tiltHorizontal,min:-100,max:100,step:1,tickStep:5,defaultValue:0,zero:!0,head:!1,ruler:!0,format:u=>yt(Math.round(u)),onInput:u=>this.setPerspective({perspectiveX:u})}),this.perspectiveXControl.rail.addEventListener("dblclick",()=>{this.setPerspective({perspectiveX:0},"perspective")}),this.perspectiveXContext.appendChild(this.perspectiveXControl.row),o.append(this.ratioContext,this.rotationContext,this.perspectiveYContext,this.perspectiveXContext),t.appendChild(o)}buildAdjustPane(t){let a=v("div","au-deck__row au-deck__row--top au-deck__row--adjust");this.autoBtn=v("button","au-auto au-glass au-glass--gold"),this.autoBtn.type="button",this.autoBtn.title=this.s.autoTitle,this.autoBtn.setAttribute("aria-label",this.s.autoTitle),this.autoBtn.innerHTML=`${H("auto")}<span data-auto-label></span>`,this.autoLabel=F(this.autoBtn,"[data-auto-label]"),this.autoLabel.textContent=this.s.auto,this.autoBtn.addEventListener("click",()=>{this.runAuto()});let r=v("div","au-params");this.paramsEl=r,r.setAttribute("role","group"),r.setAttribute("aria-label",this.s.adjustTitle);for(let u of er){let l=v("span","au-param-sep");l.dataset.group=u.id;let c=v("b");c.textContent=this.s[u.label],l.appendChild(c),r.appendChild(l);for(let h of u.keys){let f=v("button","au-param");f.type="button",f.dataset.adjust=h,f.textContent=this.s[tr[h]],f.setAttribute("aria-pressed","false"),f.addEventListener("click",()=>this.selectAdjust(h)),this.adjustButtons.set(h,f),r.appendChild(f)}if(u.id==="shape"){let h=v("button","au-param au-param--liquify");h.type="button",h.title=this.s.liquifyTitle,h.setAttribute("aria-label",this.s.liquifyTitle),h.setAttribute("aria-pressed","false"),h.innerHTML=`${H("liquify")}<span>${this.s.liquify}</span>`,h.addEventListener("click",()=>this.setLiquify(!this.liquifyOn)),this.liquifyButton=h,r.appendChild(h)}}this.adjustValue=v("button","au-value au-glass au-glass--gold"),this.adjustValue.type="button",this.adjustValue.addEventListener("click",()=>this.resetAdjust(this.adjustKey)),a.append(this.autoBtn,r,this.adjustValue),t.appendChild(a);let o=v("div","au-deck__row au-deck__row--context");this.adjustContext=o,this.adjustTicks=this.makeTicks({label:this.s[this.adjustKey],min:-100,max:100,step:1,tickStep:5,defaultValue:0,zero:!0,head:!1,ruler:!0,format:u=>this.formatAdjust(u),onInput:u=>this.setAdjust(this.adjustKey,u)}),o.appendChild(this.adjustTicks.row),t.appendChild(o);let s=v("div","au-deck__row au-deck__row--context au-liquify-row");s.style.display="none",this.liquifyContext=s,this.liquifyTicks=this.makeTicks({label:this.s.brushSize,min:1,max:20,step:1,tickStep:1,defaultValue:this.liquifySize,head:!1,ruler:!1,format:u=>`${Math.round(u)}%`,onInput:u=>this.setLiquifySize(u,!1),onReset:()=>this.setLiquifySize(5)}),this.liquifyValue=v("button","au-value au-glass au-glass--gold"),this.liquifyValue.type="button",this.liquifyValue.textContent=`${this.liquifySize}%`,this.liquifyValue.title=`${this.s.reset}: ${this.s.brushSize}`,this.liquifyValue.setAttribute("aria-label",`${this.s.reset}: ${this.s.brushSize}`),this.liquifyValue.addEventListener("click",()=>this.setLiquifySize(5));let n=pt("reset",this.s.clearLiquify,()=>this.clearLiquifyDabs());n.classList.add("au-reset"),s.append(this.liquifyTicks.row,this.liquifyValue,n),t.appendChild(s),this.selectAdjust(this.adjustKey)}buildFilterPane(t){let a=v("div","au-deck__row au-deck__row--top"),r=pt("reset",this.s.resetFilter,()=>this.setFilter("original"));r.classList.add("au-reset"),a.append(r),t.appendChild(a);let o=v("div","au-chips au-filter-cats");o.setAttribute("role","group"),o.setAttribute("aria-label",this.s.filterTitle);let s=[{id:"all",label:"catAll"},{id:"root",label:"catRoot"},{id:"meitu",label:"catMeitu"},{id:"xingtu",label:"catXingtu"},{id:"lr",label:"catLr"},{id:"mono",label:"catMono"}];for(let k of s){let A=v("button","au-chip");A.type="button",A.textContent=this.s[k.label],A.setAttribute("aria-pressed",String(this.filterCat===k.id)),A.addEventListener("click",()=>{this.filterCat=k.id;for(let S of Array.from(o.children))S.setAttribute("aria-pressed",String(S===A));this.buildFilters()}),o.appendChild(A)}this.filterCats=o,t.appendChild(o);let n=v("div","au-tone-hint");n.setAttribute("aria-live","polite"),this.filterHint=n,t.appendChild(n);let u=v("div","au-deck__row au-deck__row--context au-deck__row--filters");this.filterWrap=v("div","au-filters"),this.filterWrap.setAttribute("role","group"),this.filterWrap.setAttribute("aria-label",this.s.filterTitle),u.appendChild(this.filterWrap),t.appendChild(u);let l=v("div","au-tune");l.setAttribute("aria-label",this.s.tuneTitle);let c=v("div","au-tune__head"),h=v("span","au-tune__title");h.textContent=this.s.tuneTitle;let f=v("span","au-tune__hint");f.textContent=this.s.tuneHint;let m=v("button","au-chip au-tune__reset");m.type="button",m.textContent=this.s.tuneReset,m.addEventListener("click",()=>{for(let k of["brightness","contrast","saturation","warmth","tint","vignette","vibrance"])this.setAdjust(k,0);this.syncTuneUI()}),c.append(h,f,m);let p=v("div","au-tune__row"),g=v("div","au-params au-tune__chips"),b=["brightness","contrast","saturation","warmth","tint","vibrance","vignette"],y={brightness:"brightnessShort",contrast:"contrastShort",saturation:"saturationShort",warmth:"warmthShort",tint:"tintShort",vibrance:"vibranceShort",vignette:"vignetteShort"};for(let k of b){let A=v("button","au-param");A.type="button",A.dataset.tune=k;let S=this.s[y[k]];A.textContent=S??k,A.setAttribute("aria-pressed",String(k===this.filterTuneKey)),A.addEventListener("click",()=>this.selectFilterTune(k)),this.filterTuneButtons.set(k,A),g.appendChild(A)}this.filterTuneValue=v("button","au-value au-glass au-glass--gold"),this.filterTuneValue.type="button",this.filterTuneValue.setAttribute("aria-label",this.s.tuneTitle),this.filterTuneValue.addEventListener("click",()=>{this.resetAdjust(this.filterTuneKey),this.syncTuneUI()}),p.append(g,this.filterTuneValue);let w=v("div","au-tune__slider");this.filterTuneTicks=this.makeTicks({label:this.s.tuneTitle,min:-100,max:100,step:1,tickStep:5,defaultValue:0,zero:!0,head:!1,ruler:!0,format:k=>this.formatTune(k),onInput:k=>{this.filterTuneKey==="vignette"?this.setAdjust("vignette",x(k,0,100)):this.setAdjust(this.filterTuneKey,k),this.syncTuneUI()}}),w.appendChild(this.filterTuneTicks.row),this.filterTuneWrap=l,l.append(c,p,w),t.appendChild(l),this.selectFilterTune(this.filterTuneKey);let _=v("div","au-saved"),M=v("div","au-saved__head"),R=v("span","au-saved__title");R.textContent=this.s.savedPresets;let L=document.createElement("input");L.className="au-saved__input",L.type="text",L.maxLength=32,L.spellcheck=!1,L.autocomplete="off",L.setAttribute("aria-label",this.s.presetName),L.placeholder=this.s.presetName;let P=v("button","au-save-preset au-glass au-glass--gold");P.type="button",P.innerHTML=`${H("bookmark")}<span>${this.s.savePreset}</span>`,P.setAttribute("aria-label",this.s.savePreset),P.addEventListener("click",()=>this.saveCurrentPreset(L)),L.addEventListener("keydown",k=>{k.key==="Enter"&&this.saveCurrentPreset(L)}),M.append(R,L,P);let D=v("div","au-saved__list");this.savedList=D,this.savedWrap=_,this.filterNameInput=L,this.filterSaveBtn=P,_.append(M,D),t.appendChild(_),this.renderSavedPresets()}selectFilterTune(t){this.filterTuneKey=t;for(let[u,l]of this.filterTuneButtons)l.setAttribute("aria-pressed",String(u===t));let[a,r]=et[t];this.filterTuneTicks.setRange(a,r,1,5,a<0),this.filterTuneTicks.setLabel(`${this.s.tuneTitle} · ${t}`);let o=this.isReady?this.getState():null,s=o?Math.round(o.adjust[t]):0;this.filterTuneTicks.set(s,!1),this.syncTuneUI();let n=this.filterTuneButtons.get(t);n&&window.requestAnimationFrame(()=>{let u=n.parentElement;if(!u)return;let l=n.getBoundingClientRect(),c=u.getBoundingClientRect();if(!l.width||!c.width)return;let h=l.left-c.left-(c.width-l.width)/2;Math.abs(h)>1&&u.scrollBy({left:h,behavior:"smooth"})})}formatTune(t){let[a]=et[this.filterTuneKey];return a>=0?String(Math.round(t)):yt(Math.round(t))}syncTuneUI(){if(!this.isReady||!this.filterTuneTicks)return;let t=this.getState(),a=document.activeElement,r=Math.round(t.adjust[this.filterTuneKey]);a!==this.filterTuneTicks.rail&&this.filterTuneTicks.set(r,!1),this.filterTuneValue&&(this.filterTuneValue.textContent=this.formatTune(r))}buildTextPane(t){let a=v("div","au-deck__row au-deck__row--top au-text-top"),r=v("span","au-text-hint");r.textContent=this.s.textTitle;let o=v("button","au-add-text au-glass au-glass--gold");o.type="button",o.innerHTML=`${H("plus")}<span>${this.s.addText}</span>`,o.addEventListener("click",()=>this.addTextLayer()),a.append(r,o),t.appendChild(a);let s=v("div","au-text-sub");s.innerHTML=`<span>${Te(this.s.textPinch)}</span><span class="au-text-dot">·</span><span>${Te(this.s.textDoubleTap)}</span>`,t.appendChild(s);let n=v("div","au-text-body"),u=document.createElement("textarea");u.className="au-text-input",u.rows=1,u.maxLength=120,u.spellcheck=!1,u.setAttribute("aria-label",this.s.textInput),u.placeholder=this.s.textInput,u.addEventListener("input",()=>{let S=this.selectedLayer();S&&(S.text=u.value,this.positionTexts(),this.syncTextLayerEl(S))}),this.textInput=u,n.appendChild(u),t.appendChild(n);let l=v("div","au-quick-styles"),c=v("span","au-quick-label");c.textContent=this.s.textQuick,l.appendChild(c);let h=v("div","au-quick-row"),f=[{id:"title",label:this.s.textStyleTitle},{id:"bold",label:this.s.textStyleTitle2},{id:"caption",label:this.s.textStyleCaption},{id:"outline",label:this.s.textStyleOutline}];for(let S of f){let T=v("button","au-quick-chip");T.type="button",T.textContent=S.label,T.dataset.style=S.id,T.setAttribute("aria-pressed","false"),T.addEventListener("click",()=>{let B=this.selectedLayer();if(B){rr(B,S.id);for(let U of Array.from(h.children))U.setAttribute("aria-pressed",String(U===T));this.syncTextControls(B),this.syncTextLayerEl(B),this.positionTexts()}}),h.appendChild(T)}l.appendChild(h),t.appendChild(l);let m=v("div","au-text-meta"),p=v("div","au-seg au-text-fonts");p.setAttribute("role","group"),p.setAttribute("aria-label",this.s.textStyleTitle);for(let S of Vt.slice(0,5)){let T=v("button","au-font-btn");T.type="button",T.textContent=S.label,T.style.fontFamily=S.stack,T.dataset.font=S.id,T.setAttribute("aria-pressed",String(S.id==="sys")),T.addEventListener("click",()=>{let B=this.selectedLayer();if(B){B.font=S.id;for(let U of Array.from(p.children))U.setAttribute("aria-pressed",String(U===T));this.syncTextLayerEl(B)}}),p.appendChild(T)}let g=v("label","au-text-color"),b=v("span","au-text-colordot");b.style.background="#ffffff";let y=document.createElement("input");y.type="color",y.value="#ffffff",y.setAttribute("aria-label",this.s.textColor),y.addEventListener("input",()=>{let S=this.selectedLayer();S&&(S.color=y.value,b.style.background=y.value,this.syncTextLayerEl(S))});let w=v("span");w.textContent=this.s.textColor,g.append(b,y,w),m.append(p,g),t.appendChild(m);let _=v("div","au-text-arrange"),M=v("span","au-quick-label");M.textContent=this.s.textArrange,_.appendChild(M);let R=v("div","au-seg au-align-seg");for(let S of["left","center","right"]){let T=v("button","au-font-btn");T.type="button",T.textContent=S==="left"?this.s.textAlignLeft:S==="center"?this.s.textAlignCenter:this.s.textAlignRight,T.dataset.align=S,T.setAttribute("aria-pressed",String(S==="center")),T.addEventListener("click",()=>{let B=this.selectedLayer();if(B){B.align=S;for(let U of Array.from(R.children))U.setAttribute("aria-pressed",String(U===T));this.syncTextLayerEl(B)}}),R.appendChild(T)}_.appendChild(R),t.appendChild(_);let L=v("div","au-text-toggles"),P=(S,T,B)=>{let U=v("button","au-chip");return U.type="button",U.textContent=S,U.setAttribute("aria-pressed",String(T())),U.addEventListener("click",()=>{B(!T()),U.setAttribute("aria-pressed",String(T()));let Y=this.selectedLayer();Y&&this.syncTextLayerEl(Y)}),L.appendChild(U),U};P(this.s.bold,()=>this.selectedLayer()?.bold??!1,S=>{let T=this.selectedLayer();T&&(T.bold=S)}),P(this.s.italic,()=>this.selectedLayer()?.italic??!1,S=>{let T=this.selectedLayer();T&&(T.italic=S)}),P(this.s.outline,()=>this.selectedLayer()?.outline??!1,S=>{let T=this.selectedLayer();T&&(T.outline=S)}),P(this.s.shadow,()=>this.selectedLayer()?.shadow??!0,S=>{let T=this.selectedLayer();T&&(T.shadow=S)});let D=v("button","au-chip");D.type="button",D.innerHTML=`${H("duplicate")}<span>${this.s.duplicateText}</span>`,D.addEventListener("click",()=>this.duplicateSelectedText());let k=v("button","au-chip au-chip--danger");k.type="button",k.innerHTML=`${H("trash")}<span>${this.s.deleteText}</span>`,k.addEventListener("click",()=>this.deleteSelectedText()),L.append(D,k),t.appendChild(L);let A=v("div","au-text-sliders");this.textSizeTicks=this.makeTicks({label:this.s.fontSize,min:2,max:24,step:1,tickStep:2,defaultValue:7,format:S=>`${S}%`,onInput:S=>{let T=this.selectedLayer();T&&(T.size=S/100,this.positionTexts())}}),this.textOpacityTicks=this.makeTicks({label:this.s.textOpacity,min:10,max:100,step:1,tickStep:5,defaultValue:100,format:S=>`${S}%`,onInput:S=>{let T=this.selectedLayer();T&&(T.opacity=S/100,this.syncTextLayerEl(T))}}),this.textRotateTicks=this.makeTicks({label:this.s.textRotate,min:-180,max:180,step:1,tickStep:15,defaultValue:0,zero:!0,ruler:!0,format:S=>`${Math.round(S)}°`,onInput:S=>{let T=this.selectedLayer();T&&(T.rotation=Math.round(S),this.positionTexts())}}),A.append(this.textSizeTicks.row,this.textOpacityTicks.row,this.textRotateTicks.row),this.textControls=A,t.appendChild(A)}buildAIPane(t){let a=v("div","au-ai-pane"),r=v("div","au-ai-pane__head"),o=v("span","au-ai-pane__icon");o.innerHTML=H("wand");let s=v("div","au-ai-pane__texts"),n=v("div","au-ai-pane__title");n.textContent=this.s.bgTitle;let u=v("div","au-ai-pane__sub");u.textContent=this.s.bgSub,s.append(n,u),r.append(o,s),a.appendChild(r),t.appendChild(a);let l=v("div","au-model-label");l.textContent=this.s.modelLabel,t.appendChild(l);let c=v("div","au-seg au-model-seg");c.setAttribute("role","group");let h=[{id:"isnet-fp16",label:"modelQuality",detail:"modelDetailQuality",recommended:!0},{id:"birefnet-lite-512-fp16",label:"modelBalanced",detail:"modelDetailBalanced"},{id:"modnet-fp16",label:"modelFast",detail:"modelDetailFast"}];for(let k of h){let A=v("button","au-model-btn");A.type="button",A.dataset.model=k.id,A.setAttribute("aria-pressed",String(this.bgModel===k.id));let S=v("span","au-model-btn__name");S.textContent=this.s[k.label];let T=v("span","au-model-btn__detail");if(T.textContent=this.s[k.detail],A.append(S,T),k.recommended){let B=v("span","au-model-btn__badge");B.textContent=this.s.modelRecommended||"Khuyến nghị",A.appendChild(B)}A.addEventListener("click",()=>{this.bgModel=k.id;try{localStorage.setItem("aurum:ai-model",k.id)}catch{}for(let B of Array.from(c.children))B.setAttribute("aria-pressed",String(B===A));if(this.bgModelDetail){let B=h.find(U=>U.id===k.id);B&&(this.bgModelDetail.textContent=`${this.s[B.label]} · ${this.s[B.detail]}`)}}),this.bgModelButtons.set(k.id,A),c.appendChild(A)}t.appendChild(c),this.bgModelDetail=v("div","au-model-detail");let f=h.find(k=>k.id===this.bgModel)??h[0];this.bgModelDetail.textContent=`${this.s[f.label]} · ${this.s[f.detail]}`,t.appendChild(this.bgModelDetail);let m=v("div","au-ai-pane__list"),p=(k,A,S,T=!1)=>{let B=v("button",`au-ai-row ${T?"is-primary":""}`);B.type="button",B.innerHTML=`<b>${Te(A)}</b><span>${Te(S)}</span>`,B.addEventListener("click",()=>{this.runBackground(k)}),m.appendChild(B)};if(p("remove",this.s.bgRemove,"PNG trong suốt · Cọ tay chỉnh viền",!0),p("person",this.s.bgPerson,"MODNet 13 MB · Người · Cọ tay"),p("blur",this.s.bgBlur,"Mờ nền, giữ chủ thể"),p("replace",this.s.bgReplace,"Nền trắng sạch"),!this.backgroundAction){let k=v("div","au-ai-pane__note");k.textContent=this.s.bgNeedHost,m.appendChild(k)}t.appendChild(m);let g=v("div","au-mask-tools");g.style.display="none";let b=v("div","au-mask-tools__label");b.textContent=this.s.brushLabel;let y=v("div","au-seg au-mask-seg");y.setAttribute("role","group");let w=v("button","au-mask-btn");w.type="button",w.innerHTML=`${H("brush")}<span>${this.s.brushAdd}</span>`,w.setAttribute("aria-pressed","true");let _=v("button","au-mask-btn");_.type="button",_.innerHTML=`${H("eraser")}<span>${this.s.brushErase}</span>`,_.setAttribute("aria-pressed","false"),w.addEventListener("click",()=>{this.brushMode="add",w.setAttribute("aria-pressed","true"),_.setAttribute("aria-pressed","false")}),_.addEventListener("click",()=>{this.brushMode="erase",_.setAttribute("aria-pressed","true"),w.setAttribute("aria-pressed","false")}),y.append(w,_);let M=v("button","au-chip");M.type="button",M.innerHTML=`${H("undo")}<span>${this.s.brushUndo}</span>`,M.addEventListener("click",()=>this.refineUndo());let R=v("div","au-mask-hint");R.textContent=this.s.brushHint,this.maskBrushTicks=this.makeTicks({label:this.s.brushSizeMask,min:1,max:30,step:1,tickStep:2,defaultValue:this.brushSize,format:k=>`${Math.round(k)}px`,onInput:k=>{this.brushSize=Math.round(k)}});let L=v("div","au-mask-actions"),P=v("button","au-chip au-chip--danger");P.type="button",P.innerHTML=`<span>${this.s.brushCancel}</span>`,P.addEventListener("click",()=>this.cancelRefine());let D=v("button","au-primary au-mask-apply");D.type="button",D.innerHTML=`<span>${this.s.brushApply}</span>`,D.addEventListener("click",()=>{this.applyRefine()}),L.append(P,D),g.append(b,y,M,R,this.maskBrushTicks.row,L),this.maskToolbar=g,t.appendChild(g)}brushDabLocal(t,a,r,o){if(!this.refineMask)return;let s=this.refineMaskWidth,n=this.refineMaskHeight,u=this.refineMask,l=Math.max(1,r),c=Math.max(0,Math.floor(t-l)),h=Math.min(s-1,Math.ceil(t+l)),f=Math.max(0,Math.floor(a-l)),m=Math.min(n-1,Math.ceil(a+l));for(let p=f;p<=m;p++)for(let g=c;g<=h;g++){let b=g-t,y=p-a,w=Math.sqrt(b*b+y*y)/l;if(w>=1)continue;let _=1-w,M=_*_*(3-2*_),R=p*s+g,L=o*M;u[R]=this.brushMode==="add"?Math.min(1,(u[R]??0)+L):Math.max(0,(u[R]??0)-L)}}resizeMaskLocal(t,a,r,o,s){if(a===o&&r===s)return new Float32Array(t);let n=new Float32Array(o*s),u=a/o,l=r/s;for(let c=0;c<s;c++){let h=(c+.5)*l-.5,f=Math.max(0,Math.floor(h)),m=Math.min(r-1,f+1),p=Math.min(1,Math.max(0,h-f));for(let g=0;g<o;g++){let b=(g+.5)*u-.5,y=Math.max(0,Math.floor(b)),w=Math.min(a-1,y+1),_=Math.min(1,Math.max(0,b-y)),M=(t[f*a+y]??0)*(1-_)+(t[f*a+w]??0)*_,R=(t[m*a+y]??0)*(1-_)+(t[m*a+w]??0)*_;n[c*o+g]=M*(1-p)+R*p}}return n}drawRefinePreview(){if(!this.refineOn||!this.refineCanvas||!this.refineSource||!this.refineMask)return;let t=this.refineCanvas,a=t.getContext("2d");if(!a)return;let r=this.stage.clientWidth||1,o=this.stage.clientHeight||1,n=Math.min(1,1080/Math.max(this.refineWidth,this.refineHeight)),u=Math.max(1,Math.round(this.refineWidth*n)),l=Math.max(1,Math.round(this.refineHeight*n));(t.width!==u||t.height!==l)&&(t.width=u,t.height=l);let c=this.displayCropRect()??{x:0,y:0,width:r,height:o};t.style.left=`${c.x}px`,t.style.top=`${c.y}px`,t.style.width=`${c.width}px`,t.style.height=`${c.height}px`;let h=Math.max(4,Math.round(u/24));for(let g=0;g<l;g+=h)for(let b=0;b<u;b+=h)a.fillStyle=(Math.floor(b/h)+Math.floor(g/h))%2===0?"#3a3a3f":"#232327",a.fillRect(b,g,h,h);let f=this.resizeMaskLocal(this.refineMask,this.refineMaskWidth,this.refineMaskHeight,u,l);a.drawImage(this.refineSource,0,0,this.refineWidth,this.refineHeight,0,0,u,l);let m=a.getImageData(0,0,u,l),p=m.data;for(let g=0,b=0;g<f.length;g++,b+=4)p[b+3]=Math.round(Math.min(1,Math.max(0,f[g]??0))*255);a.putImageData(m,0,0)}enterRefine(t,a,r,o,s,n,u,l){if(this.refineOn=!0,this.refineSource=t,this.refineWidth=a,this.refineHeight=r,this.refineMaskWidth=s,this.refineMaskHeight=n,this.refineMask=new Float32Array(o),this.refineOriginalMask=new Float32Array(o),this.refineMode=u,this.refineModelId=l,this.refineHistory=[],!this.refineCanvas){let c=document.createElement("canvas");c.className="au-maskprev",c.setAttribute("aria-hidden","true");let h=p=>{if(this.refineOn){p.preventDefault();try{c.setPointerCapture(p.pointerId)}catch{}this.refineMask&&this.refineHistory.push(new Float32Array(this.refineMask)),this.refineHistory.length>20&&this.refineHistory.shift(),this.refineStroke={pointerId:p.pointerId,snapshotTaken:!0},this.brushAt(p)}},f=p=>{!this.refineStroke||this.refineStroke.pointerId!==p.pointerId||(p.preventDefault(),this.brushAt(p))},m=()=>{this.refineStroke=null,this.drawRefinePreview()};c.addEventListener("pointerdown",h),c.addEventListener("pointermove",f),c.addEventListener("pointerup",m),c.addEventListener("pointercancel",m),this.stage.appendChild(c),this.refineCanvas=c}this.refineCanvas.style.display="block",this.maskToolbar.style.display="block",this.positionTexts(),this.drawRefinePreview(),this.showTab("ai")}brushAt(t){if(!this.refineCanvas||!this.refineMask)return;let a=this.refineCanvas.getBoundingClientRect();if(a.width<2||a.height<2)return;let r=ft((t.clientX-a.left)/a.width),o=ft((t.clientY-a.top)/a.height),s=r*this.refineMaskWidth,n=o*this.refineMaskHeight,u=Math.max(4,this.brushSize/100*Math.min(this.refineMaskWidth,this.refineMaskHeight)*2);this.brushDabLocal(s,n,u,.9),this.drawRefinePreview()}refineUndo(){let t=this.refineHistory.pop();!t||!this.refineMask||(this.refineMask=t,this.drawRefinePreview())}cancelRefine(){this.refineOn=!1,this.refineMask=null,this.refineHistory=[],this.refineCanvas&&(this.refineCanvas.style.display="none"),this.maskToolbar&&(this.maskToolbar.style.display="none"),this.positionTexts()}async applyRefine(){if(!this.refineOn||!this.refineSource||!this.refineMask)return;let t=this.refineWidth,a=this.refineHeight,r=this.resizeMaskLocal(this.refineMask,this.refineMaskWidth,this.refineMaskHeight,t,a),o=document.createElement("canvas");o.width=t,o.height=a;let s=o.getContext("2d");if(!s)return;s.drawImage(this.refineSource,0,0);let n=s.getImageData(0,0,t,a),u=n.data;for(let c=0,h=0;c<r.length;c++,h+=4)u[h+3]=Math.round(Math.min(1,Math.max(0,r[c]??0))*255);s.putImageData(n,0,0);let l=await new Promise(c=>o.toBlob(c,"image/png"));if(!l){this.toast(this.s.bgFailed,!0);return}this.cancelRefine(),await this.load(l),this.showTab("adjust"),this.toast(this.s.bgDone)}makeTicks(t){let a=v("div","au-ticksrow"),r=null,o=null;if(t.head){let C=v("div","au-slider__head");r=v("span","au-slider__label"),r.textContent=t.label,o=v("button","au-slider__value"),o.type="button",o.title=`${this.s.reset}: ${t.label}`,o.setAttribute("aria-label",`${this.s.reset}: ${t.label}`),o.addEventListener("click",()=>t.onReset?.()),C.append(r,o),a.appendChild(C)}let s=v("div","au-ticks"),n=t.ruler===!0;n&&s.classList.add("au-ticks--ruler"),s.tabIndex=0,s.setAttribute("role","slider"),s.setAttribute("aria-orientation","horizontal"),s.setAttribute("aria-label",t.label);let u=v("div","au-ticks__track");if(u.setAttribute("aria-hidden","true"),s.appendChild(u),n){let C=v("span","au-ticks__center");C.setAttribute("aria-hidden","true"),s.appendChild(C)}a.appendChild(s);let l=t.min,c=t.max,h=Math.max(1e-4,t.step??1),f=Math.max(h,t.tickStep??5),m=t.zero??!1,p=[],g=-1,b=t.defaultValue,y=!1,w=null,_=b,M=0,R=0,L=new WeakMap,P=()=>typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,D=C=>{let I=Math.round((C-l)/h)*h+l;return x(Number(I.toFixed(6)),l,c)},k=()=>{let C=Math.max(2,Math.round((c-l)/f)+1);u.replaceChildren(),p=[];for(let I=0;I<C;I+=1){let E=v("span","au-tick"),N=l+I*f;m&&Math.abs(N)<f/2&&E.classList.add("is-zero"),u.appendChild(E),p.push(E)}g=-1},A=C=>x(Math.round((C-l)/f),0,p.length-1),S=()=>{if(!n)return;let C=Math.max(1,p.length-1),I=x((g>=0?g:A(b))/C,0,1);u.style.transform=`translate3d(${-I*100}%,-50%,0)`},T=(C,I=!1)=>{b=x(Number.isFinite(C)?C:l,l,c);let E=A(b),N=g;if(E!==N){if(N>=0&&p[N]?.classList.remove("is-active"),I&&N>=0&&!P()){let J=Math.max(1,Math.abs(E-N)),Na=Math.min(N,E),Xa=Math.max(N,E);for(let qt=Na;qt<=Xa;qt+=1){if(qt===E)continue;let lt=p[qt];if(!lt)continue;let la=Math.round(Math.abs(qt-N)/J*120);lt.style.setProperty("--wave-delay",`${la}ms`),lt.classList.remove("is-wave"),lt.offsetWidth,lt.classList.add("is-wave");let ca=L.get(lt);ca&&window.clearTimeout(ca),L.set(lt,window.setTimeout(()=>{lt.classList.remove("is-wave"),L.delete(lt)},340+la))}}let W=p[E];if(W){W.classList.remove("is-wave");let J=L.get(W);J&&(window.clearTimeout(J),L.delete(W)),W.classList.add("is-active")}if(g=E,I){let J=performance.now();if(J-R>26&&typeof navigator.vibrate=="function"){try{navigator.vibrate(3)}catch{}R=J}}}s.setAttribute("aria-valuenow",String(Math.round(b))),s.setAttribute("aria-valuetext",t.format(b)),o&&(o.textContent=t.format(b)),S()},B=(C,I,E,N,W=m)=>{l=C,c=I,h=Math.max(1e-4,E),f=Math.max(h,N),m=W,k(),s.setAttribute("aria-valuemin",String(l)),s.setAttribute("aria-valuemax",String(c)),T(x(b,l,c),!1)},U=C=>{s.setAttribute("aria-label",C),r&&(r.textContent=C)},Y=C=>{y=C,a.classList.toggle("is-disabled",y),s.tabIndex=y?-1:0,s.setAttribute("aria-disabled",String(y)),o&&(o.disabled=y),y&&(w=null)},O=()=>{s.focus({preventScroll:!0})},j=C=>{let I=s.getBoundingClientRect(),E=10,N=Math.max(1,I.width-E*2),W=x((C-I.left-E)/N,0,1);return D(l+W*(c-l))},$=C=>{if(!y&&!(C.pointerType==="mouse"&&C.button!==0)){C.preventDefault(),C.stopPropagation(),s.focus({preventScroll:!0}),w=C.pointerId,_=b,M=C.clientX;try{s.setPointerCapture(C.pointerId)}catch{}if(!n){let I=j(C.clientX);T(I,!0),t.onInput(I,"pointer")}t.onDragStart?.()}},Z=C=>{if(y||w!==C.pointerId)return;if(C.preventDefault(),n){let E=s.getBoundingClientRect(),N=Math.max(1,E.width-20),W=(C.clientX-M)/N,J=D(_-W*(c-l));if(Math.abs(J-b)<.001)return;T(J,!0),t.onInput(J,"pointer");return}let I=j(C.clientX);Math.abs(I-b)<.001||(T(I,!0),t.onInput(I,"pointer"))},K=C=>{if(w===C.pointerId){w=null;try{s.releasePointerCapture(C.pointerId)}catch{}t.onDragEnd?.()}},ot=C=>{if(y)return;let I=Math.max(h,h*10),E=b;switch(C.key){case"ArrowLeft":case"ArrowDown":E-=h;break;case"ArrowRight":case"ArrowUp":E+=h;break;case"PageDown":E-=I;break;case"PageUp":E+=I;break;case"Home":E=l;break;case"End":E=c;break;default:return}C.preventDefault(),E=D(E),T(E,!0),t.onInput(E,"keyboard")};return s.addEventListener("pointerdown",$),s.addEventListener("pointermove",Z),s.addEventListener("pointerup",K),s.addEventListener("pointercancel",K),s.addEventListener("keydown",ot),k(),s.setAttribute("aria-valuemin",String(l)),s.setAttribute("aria-valuemax",String(c)),T(x(t.defaultValue,l,c),!1),{row:a,rail:s,set:T,setRange:B,setLabel:U,setDisabled:Y,focus:O}}buildSheet(){let t=v("div","au-sheetwrap");t.setAttribute("aria-hidden","true");let a=v("div","au-sheet");a.setAttribute("role","dialog"),a.setAttribute("aria-modal","true"),a.setAttribute("aria-label",this.s.exportTitle);let r=Ut.filter(u=>this.exportTypes.includes(u.type)),o=r.map(u=>`<button type="button" data-format="${u.type}" aria-pressed="false">${u.label}</button>`).join(""),s=!!this.onSaveCopyCb;a.innerHTML=`
      <div class="au-grabber"></div>
      <div class="au-sheet__title"></div>
      <div class="au-sheet__sub"></div>
      <div class="au-meta">${H("image")}<div><b data-meta-name></b><span data-meta-info></span></div></div>
      <span class="au-label" data-format-label></span>
      <div class="au-seg" role="group" style="grid-template-columns:repeat(${r.length},1fr)">${o}</div>
      <div class="au-slider" data-quality-row></div>
      <div class="au-progress" data-progress hidden>
        <div class="au-progress__head">
          <span class="au-progress__label" data-progress-label></span>
          <span class="au-progress__pct" data-progress-pct>0%</span>
          <button class="au-progress__cancel" type="button" data-progress-cancel></button>
        </div>
        <div class="au-progress__track"><span data-progress-bar></span></div>
      </div>
      <div class="au-sheet__actions${s?" has-copy":""}">
        <button class="au-primary" type="button"><span data-save-label></span></button>
        ${s?'<button class="au-copy" type="button"><span data-copy-label></span></button>':""}
      </div>
      <button class="au-cancel" type="button"></button>
    `,F(a,".au-sheet__title").textContent=this.s.exportTitle,F(a,".au-sheet__sub").textContent=this.s.exportSub,F(a,"[data-format-label]").textContent=this.s.format,this.metaName=F(a,"[data-meta-name]"),this.metaInfo=F(a,"[data-meta-info]"),this.qualityRow=F(a,"[data-quality-row]"),this.progressEl=F(a,"[data-progress]"),this.progressBar=F(a,"[data-progress-bar]"),this.progressText=F(a,"[data-progress-pct]"),this.progressLabel=F(a,"[data-progress-label]"),this.progressCancel=F(a,"[data-progress-cancel]"),this.progressCancel.textContent=this.s.cancelExport,this.progressCancel.addEventListener("click",()=>this.exportAbort?.abort()),this.qualityControl=this.makeTicks({label:this.s.quality,min:10,max:100,step:1,tickStep:5,defaultValue:92,head:!0,format:u=>`${Math.round(u)}%`,onInput:u=>this.applyQuality(u),onReset:()=>this.applyQuality(92)}),this.qualityRow.appendChild(this.qualityControl.row),this.saveImageBtn=F(a,".au-primary"),this.saveImageBtn.insertAdjacentHTML("afterbegin",H("save")),this.saveLabel=F(a,"[data-save-label]"),this.saveLabel.textContent=s?this.s.overwrite:this.s.saveImage,s&&(this.saveCopyBtn=F(a,".au-copy"),this.saveCopyBtn.insertAdjacentHTML("afterbegin",H("copy")),this.saveCopyLabel=F(a,"[data-copy-label]"),this.saveCopyLabel.textContent=this.s.saveCopy);let n=F(a,".au-cancel");n.textContent=this.s.cancel;for(let u of r){let l=F(a,`[data-format="${u.type}"]`);l.addEventListener("click",()=>{this.exportType=u.type,this.updateSheet()}),this.formatButtons.set(u.type,l)}this.saveImageBtn.addEventListener("click",()=>{this.saveImage("overwrite")}),this.saveCopyBtn?.addEventListener("click",()=>{this.saveImage("copy")}),n.addEventListener("click",()=>this.closeSheet()),t.addEventListener("click",u=>{u.target===t&&this.closeSheet()}),t.appendChild(a),this.root.appendChild(t),this.sheetWrap=t,this.applyQuality(92)}buildTextLayer(){let t=v("div","au-textlayer");t.setAttribute("aria-hidden","true"),this.work.appendChild(t),this.textLayer=t}buildBG(){let t=v("div","au-ai au-bg-panel");t.hidden=!0,t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label",this.s.bgTitle);let a=v("div","au-ai__panel au-glass"),r=v("div","au-ai__head"),o=v("span","au-ai__badge");o.innerHTML=H("bg");let s=v("div","au-ai__copy"),n=v("strong");n.textContent=this.s.bgRunning;let u=v("span","au-ai__detail");u.textContent=this.s.bgRunning,s.append(n,u),r.append(o,s);let l=v("button","au-ai__cancel au-glass");l.type="button",l.textContent=this.s.aiCancel,l.addEventListener("click",()=>this.bgAbort?.abort()),r.appendChild(l),a.appendChild(r),t.appendChild(a),this.root.appendChild(t),this.bgPanel=t,this.bgDetail=u}buildAI(){if(!this.aiAction)return;let t=v("div","au-ai");t.hidden=!0,t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label",this.s.aiRunning);let a=v("div","au-ai__panel au-glass"),r=v("div","au-ai__head"),o=v("span","au-ai__badge");o.innerHTML=H("ai");let s=v("div","au-ai__copy"),n=v("strong");n.textContent=this.s.aiRunning;let u=v("span","au-ai__detail");u.textContent=this.s.aiPreparing,s.append(n,u),r.append(o,s);let l=v("button","au-ai__cancel au-glass");l.type="button",l.textContent=this.s.aiCancel,l.addEventListener("click",()=>this.aiAbort?.abort()),r.appendChild(l);let c=v("div","au-ai__track"),h=v("span");c.appendChild(h),a.append(r,c),t.appendChild(a),this.root.appendChild(t),this.aiPanel=t,this.aiDetail=u,this.aiBar=h}reportAI(t,a){if(!this.aiPanel||this.aiPanel.hidden)return;let r=!Number.isFinite(t)||t<0;this.aiPanel.classList.toggle("is-indeterminate",r),this.aiBar.style.width=r?"100%":`${Math.round(x(t,0,1)*100)}%`,a?this.aiDetail.textContent=a:r||(this.aiDetail.textContent=`${Math.round(t*100)}%`)}saveCurrentPreset(t){if(!this.isReady)return;let a=t??this.filterNameInput,r=(a?.value??"").trim()||`${this.s.filterTitle} ${new Date().toLocaleTimeString(this.locale==="vi"?"vi-VN":"en-US",{hour:"2-digit",minute:"2-digit"})}`;if(this.userPresets.some(n=>n.name.toLowerCase()===r.toLowerCase())){this.toast(this.s.presetExists,!0),a?.focus();return}let o=this.getState(),s={id:`u${Date.now().toString(36)}`,name:r,createdAt:Date.now(),filter:o.filter,adjust:{...o.adjust},enhance:JSON.parse(JSON.stringify(o.enhance))};this.userPresets=[s,...this.userPresets].slice(0,24),Ha(this.userPresets),a&&(a.value=""),this.renderSavedPresets(),this.toast(this.s.presetSaved)}renderSavedPresets(){if(this.savedList){if(this.savedList.replaceChildren(),!this.userPresets.length){let t=v("div","au-saved__empty");t.textContent=this.s.noSaved,this.savedList.appendChild(t);return}for(let t of this.userPresets){let a=v("div","au-saved-card"),r=v("span","au-saved-card__label");r.textContent=t.name;let o=v("button","au-saved-card__apply");o.type="button",o.textContent=this.s.apply,o.setAttribute("aria-label",`${this.s.apply}: ${t.name}`),o.addEventListener("click",()=>this.applyUserPreset(t));let s=v("button","au-saved-card__del au-icon au-glass");s.type="button",s.innerHTML=H("trash"),s.setAttribute("aria-label",`${this.s.deletePreset}: ${t.name}`),s.addEventListener("click",()=>{this.userPresets=this.userPresets.filter(n=>n.id!==t.id),Ha(this.userPresets),this.renderSavedPresets(),this.toast(this.s.presetDeleted)}),a.append(r,o,s),this.savedList.appendChild(a)}}}applyUserPreset(t){if(!this.isReady)return;let r={...this.getState(),filter:t.filter,adjust:{...t.adjust},enhance:JSON.parse(JSON.stringify(t.enhance))};this.setState(r),this.syncUI(),this.toast(this.s.presetApplied)}selectedLayer(){return this.texts.find(t=>t.id===this.selectedTextId)}addTextLayer(){if(!this.isReady)return;let t=ir(),a=this.texts.length;t.x=.5+(a%3-1)*.06,t.y=.42+a%4*.08,this.texts.push(t),this.selectedTextId=t.id;let r=this.createTextNode(t);this.textLayer.appendChild(r),this.syncTextControls(t),this.positionTexts(),this.textInput?.focus()}createTextNode(t){let a=v("div","au-textnode");a.dataset.textId=t.id,a.setAttribute("aria-hidden","true"),a.textContent=t.text;let r=document.createElement("span");r.className="au-text-hud",r.setAttribute("aria-hidden","true"),a.appendChild(r);let o=new Map,s=null,n=0;a.addEventListener("pointerdown",l=>{l.preventDefault(),l.stopPropagation();let c=performance.now();if(c-n<320){this.selectedTextId=t.id,this.syncTextControls(t),this.textInput?.focus(),this.textInput?.select(),n=0;return}n=c,this.selectedTextId=t.id,this.syncTextControls(t);try{a.setPointerCapture(l.pointerId)}catch{}if(o.set(l.pointerId,{x:l.clientX,y:l.clientY}),o.size===1)s={mode:"drag",ox:l.clientX,oy:l.clientY,startOX:t.x,startOY:t.y,startDist:0,startAngle:0,startSize:t.size,startRot:t.rotation,midX:l.clientX,midY:l.clientY,lastX:l.clientX,lastY:l.clientY,velX:0,velY:0};else if(o.size===2){let[h,f]=Array.from(o.values()),m=f.x-h.x,p=f.y-h.y;s={mode:"pinch",ox:0,oy:0,startOX:t.x,startOY:t.y,startDist:Math.max(1,Math.hypot(m,p)),startAngle:Math.atan2(p,m),startSize:t.size,startRot:t.rotation,midX:(h.x+f.x)/2,midY:(h.y+f.y)/2,lastX:l.clientX,lastY:l.clientY,velX:0,velY:0}}}),a.addEventListener("pointermove",l=>{if(!s)return;o.set(l.pointerId,{x:l.clientX,y:l.clientY});let c=this.displayCropRect();if(!(!c||c.width<2||c.height<2)){if(s.mode==="drag"){let h=l.clientX-s.ox,f=l.clientY-s.oy,m=s.startOX+h/c.width,p=s.startOY+f/c.height;m=m<0?m*.55:m>1?1+(m-1)*.55:m,p=p<0?p*.55:p>1?1+(p-1)*.55:p,t.x=ft(m),t.y=ft(p),s.velX=l.clientX-s.lastX,s.velY=l.clientY-s.lastY,s.lastX=l.clientX,s.lastY=l.clientY,this.positionTexts()}else if(s.mode==="pinch"){let[h,f]=Array.from(o.values()),m=f.x-h.x,p=f.y-h.y,g=Math.max(1,Math.hypot(m,p)),b=Math.atan2(p,m),y=g/s.startDist,w=s.startSize*y;t.size=w,t.size<.02&&(t.size=.02+(t.size-.02)*.5),t.size>.24&&(t.size=.24+(t.size-.24)*.5),t.size=x(t.size,.015,.3);let _=(b-s.startAngle)*180/Math.PI;t.rotation=Math.round((s.startRot+_+540)%360-180);let M=(h.x+f.x)/2,R=(h.y+f.y)/2,L=M-s.midX,P=R-s.midY;t.x=ft(s.startOX+L/c.width),t.y=ft(s.startOY+P/c.height),this.positionTexts()}}});let u=l=>{if(o.delete(l.pointerId),o.size===0&&s){let c=t.size,h=x(c,.02,.24);if(Math.abs(c-h)>.001){let f=0,m=c,p=performance.now(),g=b=>{let y=Math.min(.032,(b-p)/1e3);p=b;let w=120,_=22,M=1,R=-w*(m-h)-_*f;f+=R/M*y,m+=f*y,t.size=m,this.positionTexts(),Math.abs(m-h)>5e-4||Math.abs(f)>.5?requestAnimationFrame(g):(t.size=h,this.positionTexts())};requestAnimationFrame(g)}this.syncTextControls(t),s=null}else if(o.size===1&&s){let[c]=Array.from(o.values());s={mode:"drag",ox:c.x,oy:c.y,startOX:t.x,startOY:t.y,startDist:0,startAngle:0,startSize:t.size,startRot:t.rotation,midX:c.x,midY:c.y,lastX:c.x,lastY:c.y,velX:0,velY:0}}};return a.addEventListener("pointerup",u),a.addEventListener("pointercancel",u),a.addEventListener("dblclick",l=>{l.preventDefault(),this.selectedTextId=t.id,this.syncTextControls(t),this.textInput?.focus(),this.textInput?.select()}),this.syncTextLayerStyle(a,t),a}syncTextLayerEl(t){let a=this.textLayer?.querySelector(`[data-text-id="${t.id}"]`);a&&(a.textContent=t.text,this.syncTextLayerStyle(a,t),this.positionTexts())}syncTextLayerStyle(t,a){let r=Vt.find(n=>n.id===a.font)??Vt[0],o=this.displayCropRect(),s=Math.max(10,(o?o.height:320)*a.size);t.style.fontFamily=r.stack,t.style.fontSize=`${s}px`,t.style.color=a.color,t.style.fontWeight=a.bold?"700":"400",t.style.fontStyle=a.italic?"italic":"normal",t.style.textAlign=a.align,t.style.opacity=String(a.opacity),t.classList.toggle("is-selected",a.id===this.selectedTextId),t.classList.toggle("is-outline",a.outline),t.classList.toggle("is-shadow",a.shadow&&!a.outline)}syncTextControls(t){this.textInput&&(this.textInput.value=t.text),this.textSizeTicks&&this.textSizeTicks.set(Math.round(t.size*100),!1),this.textOpacityTicks&&this.textOpacityTicks.set(Math.round(t.opacity*100),!1),this.textRotateTicks&&this.textRotateTicks.set(Math.round(t.rotation),!1);for(let a of Array.from(this.textLayer.querySelectorAll(".au-textnode"))){let r=this.texts.find(o=>o.id===a.dataset.textId);r&&this.syncTextLayerStyle(a,r)}}displayCropRect(){if(!this.isReady)return null;let t=this.viewport(),a=this.currentFrame();if(a.width<2||a.height<2)return null;let r=Math.min(t.width/a.width,t.height/a.height),o=a.width*r,s=a.height*r;return{x:(t.width-o)/2,y:(t.height-s)/2,width:o,height:s}}positionTexts(){if(!this.textLayer)return;let t=this.displayCropRect(),a=this.isReady&&this.currentTab!=="crop";if(this.textLayer.style.display=a?"block":"none",!!t)for(let r of Array.from(this.textLayer.querySelectorAll(".au-textnode"))){let o=this.texts.find(l=>l.id===r.dataset.textId);if(!o)continue;let s=t.x+o.x*t.width,n=t.y+o.y*t.height;r.style.transform=`translate(-50%,-50%) translate(${s}px,${n}px) rotate(${o.rotation}deg)`;let u=Math.max(10,t.height*o.size);r.style.fontSize!==`${u}px`&&(r.style.fontSize=`${u}px`)}}deleteSelectedText(){if(!this.selectedTextId)return;this.texts=this.texts.filter(a=>a.id!==this.selectedTextId),this.selectedTextId=this.texts[0]?.id??null,this.textLayer?.querySelector(`[data-text-id="${this.selectedTextId}"]`),this.textLayer.replaceChildren();for(let a of this.texts)this.textLayer.appendChild(this.createTextNode(a));let t=this.selectedLayer();t?this.syncTextControls(t):this.textInput&&(this.textInput.value=""),this.positionTexts()}duplicateSelectedText(){let t=this.selectedLayer();if(!t)return;let a={...t,id:`t${Date.now().toString(36)}${Math.floor(Math.random()*1e4).toString(36)}`,x:ft(t.x+.05),y:ft(t.y+.05)};this.texts.push(a),this.selectedTextId=a.id,this.textLayer.appendChild(this.createTextNode(a)),this.syncTextControls(a),this.positionTexts()}async runBackground(t){if(this.bgBusy||!this.isReady)return;if(!this.backgroundAction){this.toast(this.s.bgNeedHost,!0);return}let a=new AbortController;this.bgBusy=!0,this.bgAbort=a,this.bgPanel.hidden=!1,this.bgPanel.classList.add("is-open"),this.bgDetail.textContent=this.s.bgRunning;let r=this.sourceBitmap(),o=this.source();try{let s=await this.backgroundAction.run(this,{signal:a.signal,report:(n,u)=>{u&&(this.bgDetail.textContent=u)},modelId:this.bgModel},t,this.bgModel);if(a.signal.aborted)return;if(s&&s.mask){let n=s;r?(this.enterRefine(r,o.width,o.height,n.mask,n.maskWidth,n.maskHeight,t,n.modelId),this.toast("AI xong — chỉnh cọ rồi Hoàn tất")):this.toast(this.s.bgDone);return}a.signal.aborted||this.toast(this.s.bgDone)}catch(s){nt(s)||a.signal.aborted?this.toast(this.s.aiCancelled):this.toast(this.s.bgFailed,!0)}finally{this.bgBusy=!1,this.bgAbort=null,this.bgPanel.classList.remove("is-open"),this.bgPanel.hidden=!0}}async compositeTexts(t){if(!this.texts.length)return t;let a=null;try{a=await createImageBitmap(t)}catch{let h=URL.createObjectURL(t),f=new Image;f.src=h;try{await f.decode(),a=f}catch{a=null}window.setTimeout(()=>URL.revokeObjectURL(h),4e3)}if(!a)return t;let r=document.createElement("canvas");r.width=a.width,r.height=a.height;let o=r.getContext("2d");if(!o)return t;o.drawImage(a,0,0);let s=r.width,n=r.height;for(let h of this.texts){let f=h.text.trim();if(!f)continue;let m=Vt.find(g=>g.id===h.font)??Vt[0],p=Math.max(8,n*h.size);o.save(),o.translate(h.x*s,h.y*n),o.rotate((h.rotation||0)*Math.PI/180),o.globalAlpha=ft(h.opacity),o.font=`${h.italic?"italic ":""}${h.bold?"700 ":"400 "}${p}px ${m.stack}`,o.textAlign=h.align,o.textBaseline="middle",h.outline?(o.lineWidth=Math.max(1,p*.09),o.strokeStyle="rgba(0,0,0,.85)",o.lineJoin="round",o.strokeText(f,0,0)):h.shadow&&(o.shadowColor="rgba(0,0,0,.45)",o.shadowBlur=p*.18,o.shadowOffsetY=p*.04),o.fillStyle=h.color,o.fillText(f,0,0),o.restore()}let u=t.type||this.exportType,l=u==="image/png"?void 0:this.quality/100;return await new Promise(h=>{u==="image/png"?r.toBlob(h,u):r.toBlob(h,u,l)})??t}async runAIAction(){if(!this.aiAction||this.aiBusy||!this.isReady||this.saving)return;let t=new AbortController;this.aiBusy=!0,this.aiAbort=t,this.aiBtn&&(this.aiBtn.disabled=!0,this.aiBtn.classList.add("is-busy")),this.setAICompareVisible(!1),this.aiPanel.hidden=!1,this.aiPanel.classList.add("is-open"),this.reportAI(-1,this.s.aiPreparing);try{await this.aiAction.run(this,{signal:t.signal,report:(a,r)=>this.reportAI(a,r)}),t.signal.aborted||(this.setAICompareVisible(this.canRevertAI()),this.toast(this.s.aiDone))}catch(a){nt(a)||t.signal.aborted?this.toast(this.s.aiCancelled):this.toast(a instanceof Error&&a.message?a.message:this.s.aiFailed,!0)}finally{this.aiBusy=!1,this.aiAbort=null,this.aiBtn&&(this.aiBtn.disabled=!1,this.aiBtn.classList.remove("is-busy")),this.aiPanel.classList.remove("is-open"),this.aiPanel.hidden=!0,this.aiPanel.classList.remove("is-indeterminate"),this.aiBar.style.width="0%"}}buildToast(){let t=v("div","au-toast");t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),this.root.appendChild(t),this.toastEl=t}bindEvents(){this.on("ready",()=>{this.root.classList.add("au-ready"),this.setLiquify(!1),this.texts=[],this.selectedTextId=null,this.textLayer?.replaceChildren(),this.textInput&&(this.textInput.value=""),this.positionTexts(),this.setAICompareVisible(!1),this.buildFilters(),this.fitToFrame(),this.positionFrame(this.currentFrame()),this.syncUI(),this.setCropMode(this.cropMode),window.requestAnimationFrame(()=>{this.centerMode(this.cropMode),this.centerAspectChip(this.getState().crop.aspect,!1)})}),this.on("loading",({loading:t})=>{this.root.classList.toggle("au-busy",t),t&&this.root.classList.remove("au-dragover")}),this.on("change",()=>{this.syncUI(),this.positionFrame(this.currentFrame())}),this.on("history",()=>this.syncHistory()),this.on("render",({frame:t})=>{this.positionFrame(t),this.positionTexts()}),this.on("error",({error:t})=>this.toast(t.message||this.s.exportFailed,!0)),this.frameEl.addEventListener("pointerdown",this.onCropPointerDown),this.frameEl.addEventListener("keydown",this.onCropKeyDown),this.root.addEventListener("keydown",t=>{if(t.key==="Escape"&&this.sheetWrap.classList.contains("is-open")){t.preventDefault(),this.closeSheet();return}if(t.key==="Tab"&&this.sheetWrap.classList.contains("is-open")){let r=Array.from(this.sheetWrap.querySelectorAll('button:not([disabled]),input:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')).filter(u=>u.getClientRects().length>0);if(!r.length)return;let o=r[0],s=r[r.length-1],n=document.activeElement;t.shiftKey&&(n===o||!this.sheetWrap.contains(n))?(t.preventDefault(),s.focus()):!t.shiftKey&&(n===s||!this.sheetWrap.contains(n))&&(t.preventDefault(),o.focus());return}if(!t.metaKey&&!t.ctrlKey)return;let a=t.key.toLowerCase();a==="z"?(t.preventDefault(),t.shiftKey?this.redo():this.undo()):a==="y"&&(t.preventDefault(),this.redo())})}aspectLabel(t){return t==="free"?this.s.aspectFree:t==="screen"?this.s.aspectScreen:t}cancel(){if(this.onCloseCb){this.onCloseCb();return}this.root.dispatchEvent(new CustomEvent("aurum:cancel",{bubbles:!0})),this.reset(),this.setTab("crop"),this.toast(this.s.cancelled)}async openSource(t){try{await this.load(t)}catch{}}setTab(t){t!=="adjust"&&this.setLiquify(!1),t!=="crop"&&(this.cropDrag&&this.endCropDrag(),this.clearTransient()),this.currentTab=t;for(let[r,o]of this.tabButtons){let s=r===t;o.setAttribute("aria-selected",String(s)),o.tabIndex=s?0:-1}for(let[r,o]of this.panes)o.classList.toggle("is-active",r===t);let a=t!=="crop";this.setResultMode(a),this.root.classList.toggle("is-result",a),this.refineCanvas&&(this.refineCanvas.style.display=this.refineOn&&t==="ai"?"block":"none"),this.refineOn&&t==="ai"&&this.drawRefinePreview(),this.positionTexts(),a||(this.positionFrame(this.currentFrame()),window.requestAnimationFrame(()=>{this.centerMode(this.cropMode),this.isReady&&this.centerAspectChip(this.getState().crop.aspect,!1)}))}clearTransient(){this.root.classList.remove("au-cropping","au-ratioing","au-rotating"),this.frameEl?.classList.remove("is-rotating"),this.ratioTimer&&(window.clearTimeout(this.ratioTimer),this.ratioTimer=0),this.cropKeyTimer&&(window.clearTimeout(this.cropKeyTimer),this.cropKeyTimer=0)}beginRotationDrag(){this.root.classList.add("au-rotating"),this.frameEl.classList.add("is-rotating")}endRotationDrag(){this.root.classList.remove("au-rotating"),this.frameEl.classList.remove("is-rotating")}centerMode(t){let a=t==="ratio"?this.ratioBtn:t==="rotation"?this.rotationBtn:t==="perspectiveY"?this.perspectiveYBtn:this.perspectiveXBtn;if(!this.modesWrap||!this.modesTrack||!a)return;let r=this.modesWrap.clientWidth;if(r<=0)return;let o=this.modesTrack.scrollWidth,s=o<=r?(r-o)/2:x(r/2-(a.offsetLeft+a.offsetWidth/2),r-o,0);this.modesTrack.style.transform=`translate3d(${s}px,0,0)`}centerAspectChip(t,a=!0){let r=this.aspectButtons.get(t),o=this.chipsEl;if(!r||!o)return;let s=o.clientWidth;if(s<=0)return;let n=r.offsetLeft-(s-r.offsetWidth)/2,u=x(n,0,Math.max(0,o.scrollWidth-s)),l=typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;a&&!l&&typeof o.scrollTo=="function"?o.scrollTo({left:u,behavior:"smooth"}):o.scrollLeft=u}markRatioing(){this.root.classList.add("au-ratioing"),this.ratioTimer&&window.clearTimeout(this.ratioTimer),this.ratioTimer=window.setTimeout(()=>{this.root.classList.remove("au-ratioing"),this.ratioTimer=0},520)}markCropKeying(){this.root.classList.add("au-cropping"),this.cropKeyTimer&&window.clearTimeout(this.cropKeyTimer),this.cropKeyTimer=window.setTimeout(()=>{this.root.classList.remove("au-cropping"),this.cropKeyTimer=0},420)}chooseAspect(t){this.isReady&&(this.setAspect(t),this.markRatioing(),this.positionFrame(this.currentFrame()))}setCropMode(t){this.cropMode=t;let a=t==="ratio",r=t==="rotation",o=t==="perspectiveY",s=t==="perspectiveX";this.ratioBtn.classList.toggle("is-active",a),this.ratioBtn.setAttribute("aria-pressed",String(a)),this.rotationBtn.classList.toggle("is-active",r),this.rotationBtn.setAttribute("aria-pressed",String(r)),this.perspectiveYBtn.classList.toggle("is-active",o),this.perspectiveYBtn.setAttribute("aria-pressed",String(o)),this.perspectiveXBtn.classList.toggle("is-active",s),this.perspectiveXBtn.setAttribute("aria-pressed",String(s)),this.ratioContext.classList.toggle("is-active",a),this.rotationContext.classList.toggle("is-active",r),this.perspectiveYContext.classList.toggle("is-active",o),this.perspectiveXContext.classList.toggle("is-active",s),this.cropResetBtn.classList.toggle("is-left",a);let n=a?this.s.resetCrop:r?this.s.resetRotation:o?this.s.resetPerspectiveY:this.s.resetPerspectiveX;this.cropResetBtn.title=n,this.cropResetBtn.setAttribute("aria-label",n),window.requestAnimationFrame(()=>{this.centerMode(t),a&&this.isReady&&this.centerAspectChip(this.getState().crop.aspect,!0)})}resetCropMode(){this.cropMode==="rotation"?this.resetRotation():this.cropMode==="perspectiveY"?(this.setPerspective({perspectiveY:0},"perspective"),this.syncUI()):this.cropMode==="perspectiveX"?(this.setPerspective({perspectiveX:0},"perspective"),this.syncUI()):(this.resetCrop(),this.markRatioing(),this.positionFrame(this.currentFrame()))}buildLiquifyOverlay(){let t=v("div","au-brush-ring");t.setAttribute("aria-hidden","true"),this.stage.appendChild(t),this.liquifyRing=t,this.stage.addEventListener("pointerdown",this.onLiquifyPointerDown,{passive:!1}),this.stage.addEventListener("pointermove",this.onLiquifyPointerMove,{passive:!1}),this.stage.addEventListener("pointerup",this.onLiquifyPointerUp),this.stage.addEventListener("pointercancel",this.onLiquifyPointerUp),this.stage.addEventListener("pointerleave",()=>{!this.liquifyStroke&&this.liquifyRing&&(this.liquifyRing.style.display="none")})}setLiquify(t){t&&!this.isReady||this.liquifyOn!==t&&(this.liquifyOn=t,this.root.classList.toggle("au-liquify",t),this.liquifyButton?.setAttribute("aria-pressed",String(t)),this.adjustContext&&(this.adjustContext.style.display=t?"none":""),this.liquifyContext&&(this.liquifyContext.style.display=t?"":"none"),this.stage.style.cursor=t?"crosshair":"grab",t?(this.liquifyTicks?.set(this.liquifySize,!1),this.liquifyValue&&(this.liquifyValue.textContent=`${this.liquifySize}%`),this.liquifyButton&&window.requestAnimationFrame(()=>this.centerAdjustChip(this.liquifyButton))):(this.liquifyStroke=null,this.liquifyRing&&(this.liquifyRing.style.display="none")))}setLiquifySize(t,a=!0){let r=x(Math.round(t),1,20);this.liquifySize=r,a&&this.liquifyTicks?.set(r,!1),this.liquifyValue&&(this.liquifyValue.textContent=`${r}%`)}clearLiquifyDabs(){!this.isReady||!this.hasLiquify()||(this.clearLiquify(),this.syncUI())}liquifyRadius(){return this.liquifySize/100}liquifyScreenRadius(){let t=this.liquifyRadius(),a=this.screenPointAt(.5,.5),r=this.screenPointAt(Math.min(1,.5+t),.5);return!a||!r?24:Math.max(4,Math.hypot(r.x-a.x,r.y-a.y))}previewLiquifyRing(t,a){let r=this.liquifyRing;if(!r)return;if(!this.liquifyOn){r.style.display="none";return}let o=this.sourcePointAt(t,a),s=o?this.screenPointAt(o.x,o.y):null;if(!s){r.style.display="none";return}let n=this.liquifyScreenRadius();r.style.display="block",r.style.width=`${n*2}px`,r.style.height=`${n*2}px`,r.style.transform=`translate3d(${s.x-n}px,${s.y-n}px,0)`}selectAdjust(t){this.liquifyOn&&this.setLiquify(!1),this.adjustKey=t;for(let[n,u]of this.adjustButtons)u.setAttribute("aria-pressed",String(n===t));let[a,r]=et[t];this.adjustTicks.setRange(a,r,1,5,a<0),this.adjustTicks.setLabel(this.s[t]);let o=this.isReady?Math.round(this.getState().adjust[t]):0;this.adjustTicks.set(o,!1),this.adjustValue.textContent=this.formatAdjust(o),this.adjustValue.title=`${this.s.reset}: ${this.s[t]}`,this.adjustValue.setAttribute("aria-label",`${this.s.reset}: ${this.s[t]}`);let s=this.adjustButtons.get(t);s&&window.requestAnimationFrame(()=>this.centerAdjustChip(s))}centerAdjustChip(t){let a=this.paramsEl;if(!a||this.currentTab!=="adjust")return;let r=t.getBoundingClientRect(),o=a.getBoundingClientRect();if(!r.width||!o.width)return;let s=r.left-o.left-(o.width-r.width)/2;Math.abs(s)<1||a.scrollBy({left:s,behavior:"smooth"})}async runAuto(){if(this.autoBusy||!this.isReady)return;this.autoBusy=!0,this.autoBtn.disabled=!0,this.autoBtn.classList.add("is-busy");let t=this.autoLabel.textContent||this.s.auto;this.autoLabel.textContent=this.s.autoRunning;try{await this.autoEnhance(),this.syncUI(),this.toast(this.s.autoDone)}catch(a){nt(a)||this.toast(this.s.autoFailed,!0)}finally{this.autoBusy=!1,this.autoBtn.disabled=!1,this.autoBtn.classList.remove("is-busy"),this.autoLabel.textContent=t}}formatAdjust(t){let[a]=et[this.adjustKey];return a>=0?String(Math.round(t)):yt(Math.round(t))}buildFilters(){let t=this.getPreviewBitmap();if(!t)return;let a=this.source(),r=this.getState().filter;this.filterWrap.replaceChildren(),this.filterButtons.clear();let o=Mt.filter(n=>this.filterCat==="all"||n.category===this.filterCat);for(let n of o){let u=v("button","au-filter");u.type="button";let l=za(t,a.width,a.height,n.id),c=v("span"),h=this.locale==="en"?n.labelEn:n.label;c.textContent=h,u.append(l,c),u.setAttribute("aria-pressed",String(r===n.id)),u.setAttribute("aria-label",h),u.addEventListener("click",()=>{this.setFilter(n.id);let f=Mt.find(m=>m.id===n.id);this.filterHint&&f?.hint&&(this.filterHint.textContent=f.hint,this.filterHint.classList.add("is-visible"))}),this.filterWrap.appendChild(u),this.filterButtons.set(n.id,u)}let s=Mt.find(n=>n.id===r);this.filterHint&&s?.hint?this.filterHint.textContent=s.hint:this.filterHint&&(this.filterHint.textContent="")}syncUI(){let t=this.isReady;if(this.root.classList.toggle("au-ready",t),this.saveBtn.disabled=!t,!t)return;let a=this.getState(),r=document.activeElement;for(let[u,l]of this.aspectButtons)l.setAttribute("aria-pressed",String(a.crop.aspect===u));this.lastAspect!==a.crop.aspect&&(this.lastAspect=a.crop.aspect,this.currentTab==="crop"&&this.centerAspectChip(a.crop.aspect,!0)),this.flipButtons.get("flipH")?.classList.toggle("is-on",a.transform.flipH),this.flipButtons.get("flipV")?.classList.toggle("is-on",a.transform.flipV);let o=Math.round(a.adjust[this.adjustKey]);r!==this.adjustTicks.rail&&this.adjustTicks.set(o,!1),this.adjustValue.textContent=this.formatAdjust(o);let s=Math.round(a.transform.rotation);r!==this.rotationControl.rail&&this.rotationControl.set(s,!1),this.rotationValue.textContent=`${s}°`,this.rotationBtn.setAttribute("aria-label",`${this.s.rotation}: ${s}°`),this.syncPerspective();let n=this.aspectLabel(a.crop.aspect);this.ratioValue.textContent=n,this.ratioBtn.setAttribute("aria-label",`${this.s.ratioLabel}: ${n}`);for(let[u,l]of this.filterButtons)l.setAttribute("aria-pressed",String(a.filter===u));this.syncTuneUI(),this.positionTexts(),this.syncHistory()}syncPerspective(){let t=this.getState().transform,a=Math.round(t.perspectiveX),r=Math.round(t.perspectiveY);this.perspectiveYControl.set(r,!1),this.perspectiveXControl.set(a,!1),this.perspectiveYValue.textContent=yt(r),this.perspectiveXValue.textContent=yt(a),this.perspectiveYBtn.setAttribute("aria-label",`${this.s.perspective}: ${this.s.tiltVertical} ${yt(r)}`),this.perspectiveXBtn.setAttribute("aria-label",`${this.s.perspective}: ${this.s.tiltHorizontal} ${yt(a)}`)}syncHistory(){this.undoBtn.disabled=!this.canUndo(),this.redoBtn.disabled=!this.canRedo()}positionFrame(t){let a=this.frameBox;t.x===a.x&&t.y===a.y&&t.width===a.w&&t.height===a.h||((t.x!==a.x||t.y!==a.y)&&(this.frameEl.style.transform=`translate3d(${t.x}px,${t.y}px,0)`),t.width!==a.w&&(this.frameEl.style.width=`${t.width}px`),t.height!==a.h&&(this.frameEl.style.height=`${t.height}px`),a.x=t.x,a.y=t.y,a.w=t.width,a.h=t.height,this.scrimEl.style.setProperty("--au-crop-x",`${t.x}px`),this.scrimEl.style.setProperty("--au-crop-y",`${t.y}px`),this.scrimEl.style.setProperty("--au-crop-w",`${t.width}px`),this.scrimEl.style.setProperty("--au-crop-h",`${t.height}px`))}dragCrop(t){let a=this.cropDrag;if(!a)return;t.preventDefault();let r=t.clientX-a.startX,o=t.clientY-a.startY,s=a.handle==="e"||a.handle==="tr"||a.handle==="br"?1:a.handle==="w"||a.handle==="tl"||a.handle==="bl"?-1:0,n=a.handle==="s"||a.handle==="br"||a.handle==="bl"?1:a.handle==="n"||a.handle==="tl"||a.handle==="tr"?-1:0;if(a.aspect!=="free"&&a.aspect!=="screen"){let l=1;if(s&&n){let h=Math.max(1,a.frame.width*a.frame.width+a.frame.height*a.frame.height);l=1+(s*r*2*a.frame.width+n*o*2*a.frame.height)/h}else s?l=1+s*r*2/Math.max(1,a.frame.width):n&&(l=1+n*o*2/Math.max(1,a.frame.height));let c=x(a.startScale*l,.2,1);this.setCrop({scale:c},a.key)}else{let l=Math.max(24,a.frame.width+s*r*2),c=Math.max(24,a.frame.height+n*o*2),h=x(l/c,.2,8),f=ne(a.viewport,h),m=x(l/Math.max(1,f.width),.2,1);this.setCrop({aspect:"free",ratio:h,scale:m},a.key)}this.positionFrame(this.currentFrame())}endCropDrag(){let t=this.cropDrag;if(t){this.cropDrag=null,t.handleEl.removeEventListener("pointermove",t.move),t.handleEl.removeEventListener("pointerup",t.end),t.handleEl.removeEventListener("pointercancel",t.end);try{t.handleEl.releasePointerCapture(t.pointerId)}catch{}this.frameEl.classList.remove("is-dragging"),this.frameEl.classList.remove("is-locked"),t.handleEl.classList.remove("is-dragging"),this.root.classList.remove("au-cropping")}}openSheet(){this.isReady&&(this.updateSheet(),this.sheetWrap.classList.add("is-open"),this.sheetWrap.setAttribute("aria-hidden","false"),this.saveImageBtn.focus({preventScroll:!0}))}closeSheet(){this.sheetWrap.classList.remove("is-open"),this.sheetWrap.setAttribute("aria-hidden","true"),this.saveBtn.focus({preventScroll:!0})}updateSheet(){let t=this.getExportSize(),a=Ut.find(o=>o.type===this.exportType)||Ut[0];this.metaName.textContent=this.fileName(),this.metaInfo.textContent=`${t.width} × ${t.height} px · ${a.label}`;for(let[o,s]of this.formatButtons)s.setAttribute("aria-pressed",String(o===this.exportType));let r=this.exportType==="image/png";this.qualityRow.hidden=r,this.qualityControl.setDisabled(r),this.applyQuality(this.quality)}applyQuality(t){this.quality=x(Math.round(t),10,100),this.qualityControl.set(this.quality,!1)}fileName(){let t=this.exportType==="image/png"?"png":this.exportType==="image/webp"?"webp":"jpg";return`${this.fileBase}.${t}`}async saveImage(t="overwrite"){if(this.saving||!this.isReady)return;let a=t==="copy"?this.onSaveCopyCb:this.onSaveCb;if(t==="copy"&&!a)return;this.saving=!0,this.saveImageBtn.disabled=!0,this.saveCopyBtn&&(this.saveCopyBtn.disabled=!0);let r=t==="copy"?this.saveCopyLabel:this.saveLabel,o=r?.textContent||"",s=t==="copy"?this.saveCopyBtn:this.saveImageBtn;r&&(r.textContent=this.s.saving),s?.setAttribute("aria-busy","true");let n=new AbortController;this.exportAbort=n,this.updateProgress({phase:"render",progress:0,tile:0,tiles:0}),this.progressEl.hidden=!1;try{let u=await this.export({type:this.exportType,quality:this.quality/100,signal:n.signal,onProgress:c=>this.updateProgress(c)});u=await this.compositeTexts(u);let l=this.fileName();this.updateProgress({phase:"encode",progress:1,tile:0,tiles:0}),a?(this.progressLabel.textContent=this.s.uploading,await a(u,l)):this.autoDownload&&sr(u,l),this.closeSheet(),this.toast(t==="copy"?this.s.savedCopy:this.s.saved)}catch(u){if(nt(u))this.toast(this.s.exportCancelled);else{let l=u instanceof Error&&u.message?`: ${u.message}`:"";this.toast(`${this.s.exportFailed}${l}`,!0)}}finally{this.exportAbort=null,this.progressEl.hidden=!0,this.saving=!1,this.saveImageBtn.disabled=!1,this.saveCopyBtn&&(this.saveCopyBtn.disabled=!1),r&&(r.textContent=o),s?.removeAttribute("aria-busy")}}updateProgress(t){let a=Math.round(x(t.progress,0,1)*100);this.progressBar.style.width=`${a}%`,this.progressText.textContent=`${a}%`,this.progressLabel.textContent=t.progress>=1?this.s.encoding:t.phase==="encode"?this.s.encoding:this.s.rendering}toast(t,a=!1){this.toastEl.className=`au-toast${a?" is-error":""}`,this.toastEl.innerHTML=`${H(a?"alert":"check")}<span></span>`;let r=this.toastEl.querySelector("span");r&&(r.textContent=t),this.toastEl.classList.add("is-open"),this.toastTimer&&window.clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>{this.toastEl.classList.remove("is-open"),this.toastTimer=0},2400)}};function ur(i){let e=i<0?0:i>1?1:i;return e<=.04045?e/12.92:Math.pow((e+.055)/1.055,2.4)}function lr(i){let e=i<0?0:i>1?1:i;return e<=.0031308?e*12.92:1.055*Math.pow(e,1/2.4)-.055}var go="1.0.0";function bo(i){return new Qt(i)}function xo(i){return new At(i)}export{te as ADJUST_KEYS,et as ADJUST_RANGES,At as AurumCore,Qt as AurumEditor,je as CURVE_PRESETS,Ft as HSL_BANDS,Oe as LUTS,Aa as LUT_SIZE,Ht as MAX_LIQUIFY_DABS,Zt as MAX_LIQUIFY_RADIUS,ja as MAX_LIQUIFY_SHIFT,Mt as PRESETS,Ua as UI_CSS,ta as analyzeBitmap,ea as autoAdjust,Ci as buildColorTransform,We as buildCurveLUT,$e as buildLUT,ke as buildLiquifyField,st as cloneState,xo as createCore,bo as createEditor,_i as curvePreset,La as curvesAreIdentity,ee as defaultAdjust,ie as defaultCrop,re as defaultCurves,oe as defaultEnhance,Nt as defaultHSL,Et as defaultState,ae as defaultTransform,ua as ensureStyles,ra as getAIAdapter,lr as linearToSrgb,Yi as listAIAdapters,Ke as lutById,ha as normalizeRetouch,Ae as normalizeState,xt as presetById,Je as probeCapabilities,Ni as registerAIAdapter,we as resolveColorSpace,Kt as resolveDither,oa as runAIPipeline,Dt as sampleCurve,ur as srgbToLinear,Xi as unregisterAIAdapter,go as version};
