/*! aurum-image-editor v1.0.0 | MIT | headless core + optional iOS dark/gold UI */
var Ya=Object.defineProperty;var Ga=(i,a,t)=>a in i?Ya(i,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[a]=t;var d=(i,a,t)=>Ga(i,typeof a!="symbol"?a+"":a,t);var Ht=640,Zt=.35,ja=.09;function Ct(i,a,t){return i<a?a:i>t?t:i}function Te(i,a,t){if(!i.length)return null;let e=64,r=Ct(t/Math.max(1,a),.05,20),o=Math.max(24,Math.min(128,Math.round(e*r))),s=e*o,n=new Float32Array(s),u=new Float32Array(s);for(let p of i){let v=Ct(p.radius,.002,.35),f=v/r,m=Math.max(0,Math.floor((p.x-v)*e)),g=Math.min(e-1,Math.ceil((p.x+v)*e)),y=Math.max(0,Math.floor((p.y-f)*o)),S=Math.min(o-1,Math.ceil((p.y+f)*o));for(let b=y;b<=S;b+=1){let k=((b+.5)/o-p.y)/f;for(let T=m;T<=g;T+=1){let D=((T+.5)/e-p.x)/v,U=D*D+k*k;if(U>=1)continue;let C=1-U,z=C*C,P=b*e+T;n[P]+=p.dx*z,u[P]+=p.dy*z}}}let l=0;for(let p=0;p<s;p+=1)l=Math.max(l,Math.abs(n[p]),Math.abs(u[p]));if(l<1e-6)return null;let c=Math.min(.09,l*1.02),h=new Uint8Array(s*4);for(let p=0;p<s;p+=1){let v=Ct(n[p],-c,c),f=Ct(u[p],-c,c),m=p*4;h[m]=Math.round(Ct(128+v/c*127,0,255)),h[m+1]=Math.round(Ct(128+f/c*127,0,255)),h[m+2]=0,h[m+3]=255}return{width:e,height:o,data:h,shift:c}}var et={brightness:[-100,100],contrast:[-100,100],saturation:[-100,100],exposure:[-100,100],warmth:[-100,100],vignette:[0,100],highlights:[-100,100],shadows:[-100,100],whites:[-100,100],blacks:[-100,100],tint:[-100,100],vibrance:[-100,100],gamma:[-100,100],clarity:[-100,100],sharpen:[0,100],denoise:[0,100],smoothSkin:[0,100],blemish:[0,100],skinTexture:[0,100],skinTone:[-100,100],faceSlim:[-100,100],jawline:[-100,100],chin:[-100,100],eyeSize:[-100,100],noseSize:[-100,100],mouthSize:[-100,100]},te=Object.keys(et),Ft=["red","orange","yellow","green","aqua","blue","purple","magenta"];function ee(){return{brightness:0,contrast:0,saturation:0,exposure:0,warmth:0,vignette:0,highlights:0,shadows:0,whites:0,blacks:0,tint:0,vibrance:0,gamma:0,clarity:0,sharpen:0,denoise:0,smoothSkin:0,blemish:0,skinTexture:55,skinTone:0,faceSlim:0,jawline:0,chin:0,eyeSize:0,noseSize:0,mouthSize:0}}function ae(){return{zoom:1,turn:0,rotation:0,flipH:!1,flipV:!1,offsetX:0,offsetY:0,perspectiveX:0,perspectiveY:0}}function ie(){return{aspect:"free",ratio:3/2,scale:1}}function xt(){return[{x:0,y:0},{x:1,y:1}]}function re(){return{rgb:xt(),r:xt(),g:xt(),b:xt()}}function gt(){return{hue:0,saturation:0,luminance:0}}function Nt(){return{red:gt(),orange:gt(),yellow:gt(),green:gt(),aqua:gt(),blue:gt(),purple:gt(),magenta:gt()}}function oe(){return{curves:re(),hsl:Nt(),lut:"none",lutStrength:100,auto:!1}}function Xt(){return{liquify:[]}}function ca(i){let a=Xt();if(!i||typeof i!="object")return a;let t=i;if(!Array.isArray(t.liquify))return a;let e=[],r=Math.max(0,t.liquify.length-640);for(let o=r;o<t.liquify.length;o+=1){let s=t.liquify[o];if(!s||typeof s!="object")continue;let n=s;!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.dx)||!Number.isFinite(n.dy)||!Number.isFinite(n.radius)||e.push({x:_(n.x,0,1),y:_(n.y,0,1),dx:_(n.dx,-.25,.25),dy:_(n.dy,-.25,.25),radius:_(n.radius,.002,.35)})}return a.liquify=e,a}function Et(){return{version:1,transform:ae(),crop:ie(),adjust:ee(),filter:"original",enhance:oe(),retouch:Xt()}}function Jt(i){return i.map(a=>({x:a.x,y:a.y}))}function nt(i){let a=i.enhance||oe(),t=i.retouch||Xt(),e=Nt();for(let r of Ft)e[r]={...a.hsl[r]||e[r]};return{version:1,transform:{...i.transform},crop:{...i.crop},adjust:{...i.adjust},filter:i.filter,enhance:{curves:{rgb:Jt(a.curves.rgb),r:Jt(a.curves.r),g:Jt(a.curves.g),b:Jt(a.curves.b)},hsl:e,lut:a.lut,lutStrength:a.lutStrength,auto:a.auto},retouch:{liquify:t.liquify.map(r=>({...r}))}}}function _(i,a,t){return i<a?a:i>t?t:i}function J(i,a){return typeof i=="number"&&Number.isFinite(i)?i:a}function ke(i,a){return typeof i=="boolean"?i:a}var Wa=["free","1:1","4:3","3:4","16:9","9:16","screen"];function Le(i){return typeof i=="string"&&Wa.includes(i)}function Rt(i){let a=[];if(Array.isArray(i))for(let r of i){if(!r||typeof r!="object")continue;let o=r;!Number.isFinite(o.x)||!Number.isFinite(o.y)||a.push({x:_(o.x,0,1),y:_(o.y,0,1)})}a.sort((r,o)=>r.x-o.x);let t=[];for(let r of a){let o=t[t.length-1];o&&Math.abs(o.x-r.x)<5e-4?o.y=r.y:t.push(r)}if(t.length<2)return xt();t[0].x>5e-4&&t.unshift({x:0,y:t[0].y});let e=t[t.length-1];if(e.x<.9995&&t.push({x:1,y:e.y}),t.length>16){let r=[t[0]],o=t.length-2,s=14;for(let n=1;n<=s;n+=1){let u=1+Math.round(n*(o-1)/s),l=t[u];l&&l.x>r[r.length-1].x+5e-4&&r.push(l)}return r.push(t[t.length-1]),r}return t}function Oa(i){let a=i||{};return{hue:_(J(a.hue,0),-100,100),saturation:_(J(a.saturation,0),-100,100),luminance:_(J(a.luminance,0),-100,100)}}function se(i){let a=oe();if(!i||typeof i!="object")return a;let t=i,e=t.curves||{};a.curves={rgb:Rt(e.rgb),r:Rt(e.r),g:Rt(e.g),b:Rt(e.b)};let r=t.hsl||{};for(let o of Ft)a.hsl[o]=Oa(r[o]);return a.lut=typeof t.lut=="string"&&/^[a-z0-9-]{1,24}$/i.test(t.lut)?t.lut:"none",a.lutStrength=_(J(t.lutStrength,100),0,100),a.auto=ke(t.auto,!1),a}function Me(i){let a=Et();if(!i||typeof i!="object")return a;let t=i,e=t.transform||{},r=t.crop||{},o=t.adjust||{},s=J(e.rotation,a.transform.rotation),n=Math.round(J(e.turn,0));a.transform={zoom:_(J(e.zoom,1),.2,12),turn:(n%4+4)%4,rotation:((s+180)%360+360)%360-180,flipH:ke(e.flipH,!1),flipV:ke(e.flipV,!1),offsetX:_(J(e.offsetX,0),-4,4),offsetY:_(J(e.offsetY,0),-4,4),perspectiveX:_(J(e.perspectiveX,0),-100,100),perspectiveY:_(J(e.perspectiveY,0),-100,100)};let u=Le(r.aspect)?r.aspect:"free";a.crop={aspect:u,ratio:_(J(r.ratio,a.crop.ratio),.2,8),scale:_(J(r.scale,1),.2,1)},a.adjust={...a.adjust};for(let l of te){let[c,h]=et[l];a.adjust[l]=_(J(o[l],a.adjust[l]),c,h)}return a.filter=typeof t.filter=="string"&&t.filter?t.filter:"original",a.enhance=se(t.enhance),a.retouch=ca(t.retouch),a}var Yt=class{constructor(a=60){d(this,"entries",[]);d(this,"index",-1);d(this,"limit");this.limit=Math.max(2,a)}reset(a){this.entries=[{state:nt(a),key:"",at:0}],this.index=0}push(a,t=""){let e=Date.now(),r=this.entries[this.index];if(r&&t&&t===r.key&&e-r.at<900){r.state=nt(a),r.at=e;return}this.entries=this.entries.slice(0,this.index+1),this.entries.push({state:nt(a),key:t,at:e}),this.entries.length>this.limit&&this.entries.shift(),this.index=this.entries.length-1}undo(){return this.index<=0?null:(this.index-=1,nt(this.entries[this.index].state))}redo(){return this.index>=this.entries.length-1?null:(this.index+=1,nt(this.entries[this.index].state))}get canUndo(){return this.index>0}get canRedo(){return this.index<this.entries.length-1}get depth(){return this.entries.length}};var Re=Math.PI/180;function ht(i,a,t){return i<a?a:i>t?t:i}function Ka(i,a,t){switch(i){case"1:1":return 1;case"4:3":return 4/3;case"3:4":return 3/4;case"16:9":return 16/9;case"9:16":return 9/16;case"screen":return a.height>0?a.width/a.height:1;default:return ht(t,.2,8)}}function Va(i){return ht(Math.min(i.width,i.height)*.018,2,8)}function Gt(i){return(i.turn||0)*90+i.rotation}function ne(i,a){let t=Va(i),e=Math.max(24,i.width-t*2),r=Math.max(24,i.height-t*2);return e/r>a?{width:r*a,height:r}:{width:e,height:e/a}}function dt(i,a){let t=Ka(a.aspect,i,a.ratio),e=ne(i,t),r=ht(a.scale,.2,1),o=e.width*r,s=e.height*r;return{x:(i.width-o)/2,y:(i.height-s)/2,width:o,height:s}}function jt(i){let a=i.width/2,t=i.height/2;return[{x:-a,y:-t},{x:a,y:-t},{x:a,y:t},{x:-a,y:t}]}function da(i,a){let t=Math.cos(a),e=Math.sin(a);return{x:t*i.x-e*i.y,y:e*i.x+t*i.y}}function at(i,a){let t=Math.cos(a),e=Math.sin(a);return{x:t*i.x+e*i.y,y:-e*i.x+t*i.y}}function it(i,a,t,e){let r=Math.max(i.width/a,i.height/t)||1,o=Math.max(.01,e.zoom),s=a*r*o/2,n=t*r*o/2;return{sx:s*(e.flipH?-1:1),sy:n*(e.flipV?-1:1),cover:r,radians:Gt(e)*Re}}var ha=.32;function rt(i){return{a:ht(i.perspectiveY,-100,100)/100*ha,b:ht(i.perspectiveX,-100,100)/100*ha}}function zt(i,a){let t=1+a.a*i.y+a.b*i.x;return{x:i.x/t,y:i.y/t}}function Tt(i,a){let t=1-a.a*i.y-a.b*i.x;return{x:i.x/t,y:i.y/t}}function $a(i,a,t,e,r){let o=Math.max(i.width/a,i.height/t)||1,s=e*Re,n=jt(r),u=0,l=0;for(let p of n){let v=at(p,s);u=Math.max(u,Math.abs(v.x)),l=Math.max(l,Math.abs(v.y))}let c=u/(a*o/2),h=l/(t*o/2);return Math.max(.2,c,h)}function bt(i,a,t,e,r){let o=$a(i,a,t,Gt(e),r),s=rt(e);if(Math.abs(s.a)<1e-4&&Math.abs(s.b)<1e-4)return o;let n=Math.max(i.width/a,i.height/t)||1,u=Gt(e)*Re,l=jt(r),c=a*n/2,h=t*n/2,p=m=>{let g=c*m*(e.flipH?-1:1),y=h*m*(e.flipV?-1:1);for(let S of l){let b=at(S,u),w=Tt({x:b.x/g,y:b.y/y},s);if(Math.abs(w.x)>1.00001||Math.abs(w.y)>1.00001)return!1}return!0};if(p(o))return o;let v=o,f=Math.max(o,12);if(!p(f))return f;for(let m=0;m<24;m+=1){let g=(v+f)/2;p(g)?f=g:v=g}return f}function Ae(i,a,t,e,r,o,s){let n=it(i,a,t,e),u=rt(e);for(let l of jt(r)){let c=at(l,n.radians),h=Tt({x:c.x/n.sx-o,y:c.y/n.sy-s},u);if(Math.abs(h.x)>1.00001||Math.abs(h.y)>1.00001)return!1}return!0}function ft(i,a,t,e,r){let o=rt(e);if(Math.abs(o.a)>1e-4||Math.abs(o.b)>1e-4){let p=e.offsetX,v=e.offsetY;if(Ae(i,a,t,e,r,p,v))return{x:p,y:v};if(!Ae(i,a,t,e,r,0,0))return{x:0,y:0};let f=0,m=1;for(let g=0;g<22;g+=1){let y=(f+m)/2;Ae(i,a,t,e,r,p*y,v*y)?f=y:m=y}return{x:p*f,y:v*f}}let s=it(i,a,t,e),n=jt(r),u=-1/0,l=1/0,c=-1/0,h=1/0;for(let p of n){let v=at(p,s.radians),f=v.x/s.sx,m=v.y/s.sy;u=Math.max(u,f-1),l=Math.min(l,f+1),c=Math.max(c,m-1),h=Math.min(h,m+1)}return u>l&&(u=l=(u+l)/2),c>h&&(c=h=(c+h)/2),{x:ht(e.offsetX,u,l),y:ht(e.offsetY,c,h)}}function fa(i,a,t){let e=at({x:i,y:a},t.radians);return{x:e.x/t.sx,y:e.y/t.sy}}function ue(i,a,t,e,r){let o=it(i,a,t,e),s=rt(e),u=jt(r).map(l=>{let c=at(l,o.radians),h=c.x/o.sx-e.offsetX,p=c.y/o.sy-e.offsetY,v=Tt({x:h,y:p},s);return{x:(v.x+1)/2*a,y:(v.y+1)/2*t}});return{tl:u[0],tr:u[1],br:u[2],bl:u[3]}}function pa(i,a,t){let e=i.tl.x,r=i.tl.y,o=i.tr.x,s=i.tr.y,n=i.br.x,u=i.br.y,l=i.bl.x,c=i.bl.y,h=e-o+n-l,p=r-s+u-c,v,f,m,g,y,S,b=0,w=0;if(Math.abs(h)<1e-7&&Math.abs(p)<1e-7)v=o-e,f=n-o,m=e,g=s-r,y=u-s,S=r;else{let A=o-n,D=l-n,U=s-u,C=c-u,z=A*C-D*U;Math.abs(z)<1e-7?(v=o-e,f=n-o,m=e,g=s-r,y=u-s,S=r):(b=(h*C-D*p)/z,w=(A*p-h*U)/z,v=o-e+b*o,f=l-e+w*l,m=e,g=s-r+b*s,y=c-r+w*c,S=r)}let k=Math.max(1,a),T=Math.max(1,t);return[v/k,f/T,m,g/k,y/T,S,b/k,w/T,1]}function Ee(i,a,t){let e=i[6]*a+i[7]*t+i[8];return Math.abs(e)<1e-9?{x:0,y:0,w:1}:{x:(i[0]*a+i[1]*t+i[2])/e,y:(i[3]*a+i[4]*t+i[5])/e,w:e}}function Ce(i,a){return Math.hypot(a.x-i.x,a.y-i.y)}function ze(i){return{width:Math.max(1,Math.round(Ce(i.tl,i.tr))),height:Math.max(1,Math.round(Ce(i.tl,i.bl)))}}function Be(i){return i.length<2?0:Ce(i[0],i[1])}function Ie(i){if(!i.length)return{x:0,y:0};let a=0,t=0;for(let e of i)a+=e.x,t+=e.y;return{x:a/i.length,y:t/i.length}}var le=.24,ce=class{constructor(a){d(this,"host");d(this,"pointers",new Map);d(this,"panStart",null);d(this,"pinchStart",null);d(this,"lastTap",{at:0,x:0,y:0});d(this,"wheelTimer",null);d(this,"disposed",!1);d(this,"enabled",!0);d(this,"onPointerDown",a=>{if(!(!this.enabled||!a.isPrimary&&this.pointers.size===0||a.target?.closest("[data-gesture-ignore]"))&&!(a.pointerType==="mouse"&&a.button!==0)){if(this.pointers.set(a.pointerId,{x:a.clientX,y:a.clientY}),this.pointers.size===1){let e=this.host.state();this.panStart={id:a.pointerId,x:a.clientX,y:a.clientY,offsetX:e.transform.offsetX,offsetY:e.transform.offsetY,moved:!1},this.pinchStart=null}else this.pointers.size===2&&this.beginPinch();this.host.stage.setPointerCapture?.(a.pointerId),a.preventDefault()}});d(this,"onPointerMove",a=>{this.pointers.has(a.pointerId)&&(this.pointers.set(a.pointerId,{x:a.clientX,y:a.clientY}),this.pointers.size===1&&this.panStart?this.pan():this.pointers.size>=2&&this.pinchStart&&this.pinch(),a.preventDefault())});d(this,"onPointerUp",a=>{if(!this.pointers.has(a.pointerId))return;let t=this.pointers.size===1,e=this.panStart;if(this.pointers.delete(a.pointerId),this.pointers.size===0)this.panStart=null,this.pinchStart=null,this.finish(t,e,a);else if(this.pointers.size===1){let[r,o]=Array.from(this.pointers.entries())[0],s=this.host.state();this.panStart={id:r,x:o.x,y:o.y,offsetX:s.transform.offsetX,offsetY:s.transform.offsetY,moved:!0},this.pinchStart=null}});d(this,"onPointerCancel",a=>{this.pointers.delete(a.pointerId),this.pointers.size===0&&(this.panStart=null,this.pinchStart=null,this.settle())});d(this,"onWheel",a=>{if(!this.enabled)return;a.preventDefault();let t=this.host.stage.getBoundingClientRect(),e={x:a.clientX-t.left-t.width/2,y:a.clientY-t.top-t.height/2},r=this.host.state(),o=Math.exp(-a.deltaY*.0018),s=this.softZoom(r.transform.zoom*o),n=this.zoomAround(s,e,r.transform);this.host.setTransform(n),this.wheelTimer!==null&&window.clearTimeout(this.wheelTimer),this.wheelTimer=window.setTimeout(()=>{this.wheelTimer=null,this.settle()},220)});this.host=a;let t=a.stage;t.addEventListener("pointerdown",this.onPointerDown),t.addEventListener("pointermove",this.onPointerMove),t.addEventListener("pointerup",this.onPointerUp),t.addEventListener("pointercancel",this.onPointerCancel),t.addEventListener("wheel",this.onWheel,{passive:!1})}beginPinch(){let a=Array.from(this.pointers.values()),t=this.host.state(),e=this.host.stage.getBoundingClientRect(),r=Ie(a);this.pinchStart={distance:Math.max(1,Be(a)),mid:{x:r.x-e.left-e.width/2,y:r.y-e.top-e.height/2},zoom:t.transform.zoom,offsetX:t.transform.offsetX,offsetY:t.transform.offsetY},this.panStart=null}stagePoint(a,t){let e=this.host.stage.getBoundingClientRect();return{x:a-e.left-e.width/2,y:t-e.top-e.height/2}}pan(){let a=this.panStart;if(!a)return;let t=this.host.state(),e=it(this.host.viewport(),this.host.source().width,this.host.source().height,t.transform),r=(this.pointers.get(a.id)?.x??a.x)-a.x,o=(this.pointers.get(a.id)?.y??a.y)-a.y;!a.moved&&Math.hypot(r,o)>2.5&&(a.moved=!0);let s=fa(r,o,e),n=a.offsetX+s.x,u=a.offsetY+s.y;this.applyOffsets(n,u,t.transform,!0)}pinch(){let a=this.pinchStart;if(!a)return;let t=Array.from(this.pointers.values()),e=Math.max(1,Be(t)),r=this.host.state(),o=this.softZoom(a.zoom*(e/a.distance)),s=this.pointers.values().next().value,n=this.host.stage.getBoundingClientRect(),u=Ie(t),l={x:u.x-n.left-n.width/2,y:u.y-n.top-n.height/2},c=this.zoomAround(o,l,{...r.transform,zoom:a.zoom,offsetX:a.offsetX,offsetY:a.offsetY},a.mid,s);this.host.setTransform(c)}zoomAround(a,t,e,r,o,s=!0){let n=this.host.viewport(),u=this.host.source(),l=r||t,c=it(n,u.width,u.height,e),h=rt(e),p=at(l,c.radians),v=Tt({x:p.x/c.sx-e.offsetX,y:p.y/c.sy-e.offsetY},h),f=zt(v,h),m=it(n,u.width,u.height,{...e,zoom:a}),g=at(t,m.radians),y=g.x/m.sx-f.x,S=g.y/m.sy-f.y,b=ft(n,u.width,u.height,{...e,zoom:a,offsetX:y,offsetY:S},this.host.frame());return s?(y=b.x+(y-b.x)*le,S=b.y+(S-b.y)*le):(y=b.x,S=b.y),{zoom:a,offsetX:y,offsetY:S}}softZoom(a){let t=this.minimum(),e=this.host.maxZoom;return a<t?Math.max(t*.6,t+(a-t)*.35):a>e?Math.min(e*1.15,e+(a-e)*.35):a}minimum(){let a=this.host.viewport(),t=this.host.source(),e=this.host.state();return bt(a,t.width,t.height,e.transform,this.host.frame())}applyOffsets(a,t,e,r){let o=this.host.viewport(),s=this.host.source(),n=this.host.frame(),u={...e,offsetX:a,offsetY:t},l=ft(o,s.width,s.height,u,n),c=r?l.x+(a-l.x)*le:l.x,h=r?l.y+(t-l.y)*le:l.y;this.host.setTransform({offsetX:c,offsetY:h})}settle(){let a=this.host.state(),t=this.host.viewport(),e=this.host.source(),r=this.host.frame(),o=this.minimum(),s=ht(a.transform.zoom,o,this.host.maxZoom),n=ft(t,e.width,e.height,{...a.transform,zoom:s},r);Math.abs(s-a.transform.zoom)>.001||Math.abs(n.x-a.transform.offsetX)>5e-4||Math.abs(n.y-a.transform.offsetY)>5e-4?this.host.settle({zoom:s,offsetX:n.x,offsetY:n.y},420):this.host.commit()}finish(a,t,e){if(a&&t&&!t.moved){let r=Date.now(),o=Math.hypot(e.clientX-this.lastTap.x,e.clientY-this.lastTap.y);if(r-this.lastTap.at<320&&o<22){this.lastTap={at:0,x:0,y:0},this.doubleTap(this.stagePoint(e.clientX,e.clientY));return}this.lastTap={at:r,x:e.clientX,y:e.clientY}}this.settle()}doubleTap(a){let t=this.host.state(),e=this.minimum(),r=t.transform.zoom>e*1.35?e:Math.min(this.host.maxZoom,e*2.2),o=this.zoomAround(r,a,t.transform,void 0,void 0,!1);this.host.settle(o,380)}setEnabled(a){this.enabled!==a&&(this.enabled=a,a||(this.pointers.clear(),this.panStart=null,this.pinchStart=null))}destroy(){if(this.disposed)return;this.disposed=!0;let a=this.host.stage;a.removeEventListener("pointerdown",this.onPointerDown),a.removeEventListener("pointermove",this.onPointerMove),a.removeEventListener("pointerup",this.onPointerUp),a.removeEventListener("pointercancel",this.onPointerCancel),a.removeEventListener("wheel",this.onWheel),this.wheelTimer!==null&&window.clearTimeout(this.wheelTimer)}};function Bt(i="Aborted"){return typeof DOMException<"u"?new DOMException(i,"AbortError"):Object.assign(new Error(i),{name:"AbortError"})}function ut(i){return!!i&&typeof i=="object"&&i.name==="AbortError"}function pt(i){if(i?.aborted)throw Bt()}function he(){return new Promise(i=>{let a=!1,t=()=>{a||(a=!0,i())};typeof requestAnimationFrame=="function"&&requestAnimationFrame(t),setTimeout(t,250)})}var De=`attribute vec2 a_pos;
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
`},Qa=Object.keys(de);function ma(i,a,t){return i?a?t?"beauty-liquify":"beauty":t?"base-linear-liquify":"base-linear":a?t?"beauty-gamma-liquify":"beauty-gamma":t?"base-liquify":"base"}var Pe=0,Ue=1,qe=2,Za=new Float32Array(16),Ja=new Float32Array(24),ti=new Float32Array([1,0,0,0,1,0,0,0,1]),ei=[0,0],lt=10,ai=24;function va(i,a,t,e){let r=i.createShader(a);if(!r)return null;if(i.shaderSource(r,t),i.compileShader(r),!i.getShaderParameter(r,i.COMPILE_STATUS)){let o=i.getShaderInfoLog(r)||"unknown compile error";return console.warn(`[aurum] ${e} shader failed: ${o}`),i.deleteShader(r),null}return r}function ii(i,a){let t=e=>i.getUniformLocation(a,e);return{matrix:t("u_matrix"),warp:t("u_warp"),color:t("u_color"),offset:t("u_offset"),vignette:t("u_vignette"),aspect:t("u_aspect"),vigCenter:t("u_vigCenter"),vigHalf:t("u_vigHalf"),texel:t("u_texel"),textureLoc:t("u_texture"),curveLoc:t("u_curve"),lutLoc:t("u_lut"),maskLoc:t("u_mask"),liquifyLoc:t("u_liquify"),liquifyShift:t("u_liquifyShift"),dither:t("u_dither"),exposure:t("u_exposure"),brightness:t("u_brightness"),contrast:t("u_contrast"),saturation:t("u_saturation"),highlights:t("u_highlights"),shadows:t("u_shadows"),whites:t("u_whites"),blacks:t("u_blacks"),warmth:t("u_warmth"),tint:t("u_tint"),vibrance:t("u_vibrance"),gamma:t("u_gamma"),clarity:t("u_clarity"),sharpen:t("u_sharpen"),denoise:t("u_denoise"),smoothSkin:t("u_smoothSkin"),blemish:t("u_blemish"),skinTexture:t("u_skinTexture"),skinTone:t("u_skinTone"),hasMask:t("u_hasMask"),hasCurve:t("u_hasCurve"),lutStrength:t("u_lutStrength"),lutSize:t("u_lutSize"),quality:t("u_quality"),faces:t("u_faces"),faceCount:t("u_faceCount"),anchors:t("u_anchors"),hasAnchors:t("u_hasAnchors"),hsl:t("u_hsl"),faceSlim:t("u_faceSlim"),jawline:t("u_jawline"),chin:t("u_chin"),eyeSize:t("u_eyeSize"),noseSize:t("u_noseSize"),mouthSize:t("u_mouthSize")}}function He(i,a){let t=va(i,i.VERTEX_SHADER,De,`${a} vertex`);if(!t)return null;let e=va(i,i.FRAGMENT_SHADER,de[a],`${a} fragment`);if(!e)return i.deleteShader(t),null;let r=i.createProgram();if(!r)return i.deleteShader(t),i.deleteShader(e),null;if(i.attachShader(r,t),i.attachShader(r,e),i.bindAttribLocation(r,Pe,"a_pos"),i.bindAttribLocation(r,Ue,"a_uv"),i.bindAttribLocation(r,qe,"a_w"),i.linkProgram(r),i.deleteShader(t),i.deleteShader(e),!i.getProgramParameter(r,i.LINK_STATUS)){let o=i.getProgramInfoLog(r)||"unknown link error";return console.warn(`[aurum] ${a} program failed: ${o}`),i.deleteProgram(r),null}return{program:r,u:ii(i,r)}}function ri(i,a){if(i.programs.has(a))return i.programs.get(a)??i.fallback;let t=He(i.gl,a);return i.programs.set(a,t),t||(console.warn(`[aurum] shader variant "${a}" unavailable; using the fallback program`),i.fallback)}function Fe(i,a){for(let t of a.values())t&&i.deleteProgram(t.program);a.clear()}function oi(i){i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.LINEAR)}function kt(i){let a=i.createTexture();return a?(i.bindTexture(i.TEXTURE_2D,a),oi(i),a):null}function Ne(i,a=!1){let t=null;try{t=i.getContext("webgl",{alpha:!0,premultipliedAlpha:!1,antialias:!1,depth:!1,stencil:!1,preserveDrawingBuffer:a,powerPreference:"high-performance"})}catch{t=null}if(!t)return null;let e=new Map,r=He(t,"base");e.set("base",r);let o=r;if(!o){let m=He(t,"fallback");e.set("fallback",m),o=m}if(!o)return null;let s=t.createBuffer();if(!s)return Fe(t,e),null;let n=new Float32Array([-1,-1,0,0,1,1,-1,1,0,1,1,1,1,1,1,-1,-1,0,0,1,1,1,1,1,1,-1,1,0,1,1]);t.bindBuffer(t.ARRAY_BUFFER,s),t.bufferData(t.ARRAY_BUFFER,n,t.STATIC_DRAW);let u=kt(t),l=kt(t),c=kt(t),h=kt(t),p=kt(t),v=kt(t),f=kt(t);if(!u||!l||!c||!h||!p||!v||!f){t.deleteBuffer(s);for(let m of[u,l,c,h,p,v,f])m&&t.deleteTexture(m);return Fe(t,e),null}return t.bindTexture(t.TEXTURE_2D,v),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.bindTexture(t.TEXTURE_2D,f),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([255,255,255,255])),{gl:t,buffer:s,texture:u,curveTexture:l,lutTexture:c,maskTexture:h,liquifyTexture:p,anchorTexture:v,whiteTexture:f,programs:e,active:o,fallback:o,maxTexture:Math.min(8192,t.getParameter(t.MAX_TEXTURE_SIZE)),texWidth:1,texHeight:1,curveRef:null,lutRef:null,maskRef:null,liquifyRef:null,anchorRef:null,lutSize:0}}function Ye(i){return i instanceof HTMLImageElement?{width:i.naturalWidth||i.width,height:i.naturalHeight||i.height}:{width:i.width,height:i.height}}function xa(i,a){let{gl:t}=i;try{let e=Ye(a);return t.bindTexture(t.TEXTURE_2D,i.texture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,a),i.texWidth=e.width,i.texHeight=e.height,!0}catch{return!1}}function ba(i,a){let{gl:t}=i;if(a.curve!==i.curveRef&&(a.curve&&(t.bindTexture(t.TEXTURE_2D,i.curveTexture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,256,1,0,t.RGBA,t.UNSIGNED_BYTE,a.curve)),i.curveRef=a.curve),a.lut!==i.lutRef||a.lutSize!==i.lutSize){if(a.lut){let e=Math.max(2,Math.round(a.lutSize));t.bindTexture(t.TEXTURE_2D,i.lutTexture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,e*e,e,0,t.RGBA,t.UNSIGNED_BYTE,a.lut)}i.lutRef=a.lut,i.lutSize=a.lutSize}a.mask!==i.maskRef&&(a.mask&&(t.bindTexture(t.TEXTURE_2D,i.maskTexture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,a.mask.width,a.mask.height,0,t.RGBA,t.UNSIGNED_BYTE,a.mask.data)),i.maskRef=a.mask),a.liquify!==i.liquifyRef&&(a.liquify&&(t.bindTexture(t.TEXTURE_2D,i.liquifyTexture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,a.liquify.width,a.liquify.height,0,t.RGBA,t.UNSIGNED_BYTE,a.liquify.data)),i.liquifyRef=a.liquify)}function si(i){let a=i.matrix;return{matrix:new Float32Array([a[0],a[3],a[6],a[1],a[4],a[7],a[2],a[5],a[8]]),offset:new Float32Array([i.offset[0],i.offset[1],i.offset[2]])}}function ni(i){let a=i.rotation*Math.PI/180,t=Math.cos(a),e=Math.sin(a),r=Math.max(1,i.width/2),o=Math.max(1,i.height/2),s=i.view.scale,n=t*i.sx*s,u=e*i.sx*s,l=-e*i.sy*s,c=t*i.sy*s,h=t*(i.sx*i.offsetX)-e*(i.sy*i.offsetY),p=e*(i.sx*i.offsetX)+t*(i.sy*i.offsetY),v=r+h,f=o+p,m=v*s+i.view.x,g=f*s+i.view.y;return new Float32Array([n/r,-u/o,0,l/r,-c/o,0,(m-r)/r,(o-g)/o,1])}function ui(i){let{gl:a}=i;a.bindBuffer(a.ARRAY_BUFFER,i.buffer),a.enableVertexAttribArray(Pe),a.vertexAttribPointer(Pe,2,a.FLOAT,!1,20,0),a.enableVertexAttribArray(Ue),a.vertexAttribPointer(Ue,2,a.FLOAT,!1,20,8),a.enableVertexAttribArray(qe),a.vertexAttribPointer(qe,1,a.FLOAT,!1,20,16)}function ya(i,a){let{gl:t}=i,e=si(a.color),r=a.enhance,o=ri(i,ma(r.linear>.5,!!r.mask,!!r.liquify));i.active=o;let s=o.u;t.useProgram(o.program),ui(i),t.uniformMatrix3fv(s.matrix,!1,a.matrix),t.uniform2f(s.warp,a.warp[0],a.warp[1]),t.uniformMatrix3fv(s.color,!1,e.matrix),t.uniform3fv(s.offset,e.offset),t.uniform1f(s.vignette,Math.max(0,Math.min(1,a.vignette))),t.uniform1f(s.aspect,a.aspect),t.uniform2f(s.vigCenter,a.vigCenter[0],a.vigCenter[1]),t.uniform2f(s.vigHalf,a.vigHalf[0],a.vigHalf[1]),t.uniform2f(s.texel,a.texel[0],a.texel[1]),t.uniform1f(s.dither,r.dither),t.uniform1f(s.exposure,r.exposure),t.uniform1f(s.brightness,r.brightness),t.uniform1f(s.contrast,r.contrast),t.uniform1f(s.saturation,r.saturation),t.uniform1f(s.highlights,r.highlights),t.uniform1f(s.shadows,r.shadows),t.uniform1f(s.whites,r.whites),t.uniform1f(s.blacks,r.blacks),t.uniform1f(s.warmth,r.warmth),t.uniform1f(s.tint,r.tint),t.uniform1f(s.vibrance,r.vibrance),t.uniform1f(s.gamma,r.gamma),t.uniform1f(s.clarity,r.clarity),t.uniform1f(s.sharpen,r.sharpen),t.uniform1f(s.denoise,r.denoise),t.uniform1f(s.smoothSkin,r.smoothSkin),t.uniform1f(s.blemish,r.blemish),t.uniform1f(s.skinTexture,r.skinTexture),t.uniform1f(s.skinTone,r.skinTone),t.uniform1f(s.hasMask,r.mask?1:0),t.uniform1f(s.liquifyShift,r.liquify?r.liquify.shift:0),t.uniform1f(s.hasCurve,r.curve?1:0),t.uniform1f(s.lutStrength,r.lut?r.lutStrength:0),t.uniform1f(s.lutSize,Math.max(2,r.lutSize)),t.uniform1f(s.quality,r.quality),t.uniform4fv(s.faces,r.faces||Za),t.uniform1i(s.faceCount,Math.max(0,Math.min(4,r.faceCount))),t.uniform1f(s.hasAnchors,r.anchors?1:0),t.uniform3fv(s.hsl,r.hsl||Ja),t.uniform1f(s.faceSlim,r.faceSlim),t.uniform1f(s.jawline,r.jawline),t.uniform1f(s.chin,r.chin),t.uniform1f(s.eyeSize,r.eyeSize),t.uniform1f(s.noseSize,r.noseSize),t.uniform1f(s.mouthSize,r.mouthSize),t.uniform1i(s.textureLoc,0),t.uniform1i(s.curveLoc,1),t.uniform1i(s.lutLoc,2),t.uniform1i(s.maskLoc,3),t.uniform1i(s.liquifyLoc,4),t.uniform1i(s.anchors,5),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,i.texture),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,r.curve?i.curveTexture:i.whiteTexture),t.activeTexture(t.TEXTURE2),t.bindTexture(t.TEXTURE_2D,r.lut?i.lutTexture:i.whiteTexture),t.activeTexture(t.TEXTURE3),t.bindTexture(t.TEXTURE_2D,r.mask?i.maskTexture:i.whiteTexture),t.activeTexture(t.TEXTURE4),t.bindTexture(t.TEXTURE_2D,r.liquify?i.liquifyTexture:i.whiteTexture),t.activeTexture(t.TEXTURE5),t.bindTexture(t.TEXTURE_2D,r.anchors?i.anchorTexture:i.whiteTexture),r.anchors&&i.anchorRef!==r.anchors&&(t.texImage2D(t.TEXTURE_2D,0,t.RGBA,4,4,0,t.RGBA,t.UNSIGNED_BYTE,r.anchors),i.anchorRef=r.anchors),t.drawArrays(t.TRIANGLES,0,6)}function li(i){let a=Math.max(1,i.width),t=Math.max(1,i.height),e=i.vignetteRect;return{center:[(e.x+e.width/2)/a*2-1,1-(e.y+e.height/2)/t*2],half:[Math.max(1e-4,e.width/a),Math.max(1e-4,e.height/t)],aspect:e.width/Math.max(1,e.height)}}function _a(i){return!i||Math.abs(i.a)<1e-4&&Math.abs(i.b)<1e-4}function ci(i,a,t,e,r,o){let s=a.x-i.x,n=a.y-i.y,u=t.x-i.x,l=t.y-i.y,c=s*l-n*u;if(Math.abs(c)<1e-8)return null;let h=r.x-e.x,p=o.x-e.x,v=r.y-e.y,f=o.y-e.y,m=(h*l-p*n)/c,g=(-h*u+p*s)/c,y=(v*l-f*n)/c,S=(-v*u+f*s)/c;return[m,y,g,S,e.x-m*i.x-g*i.y,e.y-y*i.x-S*i.y]}function fe(i,a,t,e,r,o,s,n,u){let l=ci(t,e,r,o,s,n);l&&(i.save(),i.beginPath(),i.moveTo(o.x,o.y),i.lineTo(s.x,s.y),i.lineTo(n.x,n.y),i.closePath(),i.clip(),i.setTransform(u*l[0],u*l[1],u*l[2],u*l[3],u*l[4],u*l[5]),i.drawImage(a,0,0),i.restore())}function hi(i,a,t){let e=Ye(a),r=Math.max(1,e.width),o=Math.max(1,e.height),s=t.rotation*Math.PI/180,n=Math.cos(s),u=Math.sin(s),l=t.view,c=t.width/2,h=t.height/2,p=(f,m)=>{let g=zt({x:f*2-1,y:m*2-1},t.warp),y=(g.x+t.offsetX)*t.sx,S=(g.y+t.offsetY)*t.sy;return{x:l.x+l.scale*(c+n*y-u*S),y:l.y+l.scale*(h+u*y+n*S)}},v=[];for(let f=0;f<=lt;f+=1){let m=[];for(let g=0;g<=lt;g+=1)m.push(p(g/lt,f/lt));v.push(m)}i.imageSmoothingEnabled=!0,i.imageSmoothingQuality="high";for(let f=0;f<lt;f+=1)for(let m=0;m<lt;m+=1){let g=m/lt,y=(m+1)/lt,S=f/lt,b=(f+1)/lt,w={x:g*r,y:S*o},k={x:y*r,y:S*o},T={x:y*r,y:b*o},A={x:g*r,y:b*o},D=v[f][m],U=v[f][m+1],C=v[f+1][m+1],z=v[f+1][m];fe(i,a,w,k,T,D,U,C,t.dpr),fe(i,a,w,T,A,D,C,z,t.dpr)}}function di(i,a,t){i.save(),i.setTransform(t.dpr,0,0,t.dpr,0,0),i.clearRect(0,0,t.width,t.height),t.clipRect&&t.clipRect.width>0&&t.clipRect.height>0&&(i.beginPath(),i.rect(t.clipRect.x,t.clipRect.y,t.clipRect.width,t.clipRect.height),i.clip()),i.filter=t.css||"none",_a(t.warp)?(i.translate(t.view.x,t.view.y),i.scale(t.view.scale,t.view.scale),i.translate(t.width/2,t.height/2),i.rotate(t.rotation*Math.PI/180),i.scale(t.sx,t.sy),i.translate(t.offsetX,t.offsetY),i.imageSmoothingEnabled=!0,i.imageSmoothingQuality="high",i.drawImage(a,-1,-1,2,2)):hi(i,a,t),i.filter="none",i.restore();let e=t.vignetteRect;if(t.vignette>0&&e.width>0&&e.height>0){i.save(),i.setTransform(t.dpr,0,0,t.dpr,0,0),i.beginPath(),i.rect(e.x,e.y,e.width,e.height),i.clip();let r=e.x+e.width/2,o=e.y+e.height/2,s=Math.max(e.width,e.height)*.74,n=i.createRadialGradient(r,o,Math.min(e.width,e.height)*.22,r,o,s);n.addColorStop(0,"rgba(0,0,0,0)"),n.addColorStop(.62,`rgba(0,0,0,${t.vignette*.25})`),n.addColorStop(1,`rgba(0,0,0,${t.vignette*.88})`),i.fillStyle=n,i.fillRect(e.x,e.y,e.width,e.height),i.restore()}}function fi(i,a,t,e){if(e<=0)return;let r=i.createRadialGradient(a/2,t/2,Math.min(a,t)*.2,a/2,t/2,Math.max(a,t)*.74);r.addColorStop(0,"rgba(0,0,0,0)"),r.addColorStop(.62,`rgba(0,0,0,${e*.25})`),r.addColorStop(1,`rgba(0,0,0,${e*.88})`),i.fillStyle=r,i.fillRect(0,0,a,t)}function Xe(i,a,t){return new Promise((e,r)=>{i.toBlob(o=>o?e(o):r(new Error("Export failed: canvas is empty")),a,t)})}var pe=class{constructor(a){d(this,"canvas");d(this,"glState",null);d(this,"ctx2d",null);d(this,"bitmap",null);d(this,"cssWidth",0);d(this,"cssHeight",0);d(this,"dpr",1);d(this,"textureDirty",!0);d(this,"lastSpec",null);d(this,"contextLost",!1);d(this,"onContextLost",a=>{a.preventDefault(),this.contextLost=!0});d(this,"onContextRestored",()=>{this.contextLost=!1,this.glState=Ne(this.canvas),this.ctx2d=null,this.textureDirty=!0,this.lastSpec&&this.render(this.lastSpec)});this.canvas=a,this.glState=Ne(a),this.glState||(this.ctx2d=a.getContext("2d",{alpha:!0})),a.addEventListener("webglcontextlost",this.onContextLost),a.addEventListener("webglcontextrestored",this.onContextRestored)}get accelerated(){return this.glState!==null&&!this.contextLost}setBitmap(a){this.bitmap=a,this.textureDirty=!0}resize(a,t,e){this.cssWidth=Math.max(1,a),this.cssHeight=Math.max(1,t),this.dpr=Math.max(1,Math.min(3,e||1));let r=Math.max(1,Math.round(this.cssWidth*this.dpr)),o=Math.max(1,Math.round(this.cssHeight*this.dpr));(this.canvas.width!==r||this.canvas.height!==o)&&(this.canvas.width=r,this.canvas.height=o)}render(a){if(!this.bitmap||(this.lastSpec=a,this.contextLost))return;let t=this.glState;if(t){let{gl:r}=t;if(r.isContextLost()){this.contextLost=!0;return}if(this.textureDirty){if(!xa(t,this.bitmap)){this.textureDirty=!1;return}this.textureDirty=!1}ba(t,a.enhance),r.viewport(0,0,this.canvas.width,this.canvas.height),r.clearColor(0,0,0,0),r.clear(r.COLOR_BUFFER_BIT),r.disable(r.BLEND);let o=a.clipRect,s=!!o&&o.width>0&&o.height>0;s&&(r.enable(r.SCISSOR_TEST),r.scissor(Math.round(o.x*this.dpr),Math.round((a.height-o.y-o.height)*this.dpr),Math.max(1,Math.round(o.width*this.dpr)),Math.max(1,Math.round(o.height*this.dpr))));let n=li(a);ya(t,{matrix:ni(a),warp:[a.warp.a,a.warp.b],color:a.color,vignette:a.vignette,aspect:n.aspect,vigCenter:n.center,vigHalf:n.half,texel:[1/Math.max(1,t.texWidth),1/Math.max(1,t.texHeight)],enhance:a.enhance}),s&&r.disable(r.SCISSOR_TEST);return}let e=this.ctx2d;e&&di(e,this.bitmap,a)}dispose(){this.canvas.removeEventListener("webglcontextlost",this.onContextLost),this.canvas.removeEventListener("webglcontextrestored",this.onContextRestored);let a=this.glState;a&&wa(a),this.glState=null,this.ctx2d=null,this.bitmap=null,this.lastSpec=null,this.contextLost=!1}};function wa(i){let{gl:a}=i;a.deleteBuffer(i.buffer),a.deleteTexture(i.texture),a.deleteTexture(i.curveTexture),a.deleteTexture(i.lutTexture),a.deleteTexture(i.maskTexture),a.deleteTexture(i.liquifyTexture),a.deleteTexture(i.anchorTexture),a.deleteTexture(i.whiteTexture),Fe(a,i.programs)}function pi(i,a){let t=Ye(i);if(!t.width||!t.height||Math.max(t.width,t.height)<=a)return i;let e=a/Math.max(t.width,t.height),r=document.createElement("canvas");r.width=Math.max(1,Math.round(t.width*e)),r.height=Math.max(1,Math.round(t.height*e));let o=r.getContext("2d");return o?(o.imageSmoothingQuality="high",o.drawImage(i,0,0,r.width,r.height),r):i}function Sa(i,a,t){let e=pa(i,a,t),r=e[8],o=e[6]*a+e[8],s=e[7]*t+e[8],n=e[6]*a+e[7]*t+e[8];return r+o+s+n<0?[-e[0],-e[1],-e[2],-e[3],-e[4],-e[5],-e[6],-e[7],-e[8]]:e}function mi(i,a,t,e){let r=ai,o=[];for(let s=0;s<=r;s+=1){let n=[];for(let u=0;u<=r;u+=1){let l=Ee(e,u/r*t.width,s/r*t.height);n.push({x:l.x,y:l.y})}o.push(n)}i.imageSmoothingEnabled=!0,i.imageSmoothingQuality="high";for(let s=0;s<r;s+=1)for(let n=0;n<r;n+=1){let u={x:n/r*t.width,y:s/r*t.height},l={x:(n+1)/r*t.width,y:s/r*t.height},c={x:(n+1)/r*t.width,y:(s+1)/r*t.height},h={x:n/r*t.width,y:(s+1)/r*t.height},p=o[s][n],v=o[s][n+1],f=o[s+1][n+1],m=o[s+1][n];fe(i,a,p,v,f,u,l,c,1),fe(i,a,p,f,m,u,c,h,1)}}function vi(i,a,t,e,r){pt(r.signal);let o=document.createElement("canvas");o.width=a.width,o.height=a.height;let s=o.getContext("2d");if(!s)return Promise.reject(new Error("2D canvas is unavailable"));let n=Sa(a.quad,a.width,a.height);if(s.save(),s.beginPath(),s.rect(0,0,a.width,a.height),s.clip(),s.filter=a.css||"none",_a(a.warp)){let{tl:u,tr:l,bl:c}=a.quad,h=(l.x-u.x)/a.width,p=(l.y-u.y)/a.width,v=(c.x-u.x)/a.height,f=(c.y-u.y)/a.height,m=h*f-p*v;if(Math.abs(m)>1e-8){let g=f/m,y=-v/m,S=-p/m,b=h/m,w=-(g*u.x+y*u.y),k=-(S*u.x+b*u.y);s.setTransform(g,S,y,b,w,k),s.imageSmoothingQuality="high",s.drawImage(i,0,0)}}else mi(s,i,a,n);return s.filter="none",s.restore(),s.setTransform(1,0,0,1,0,0),fi(s,a.width,a.height,a.vignette),r.onProgress?.({phase:"encode",progress:.9,tile:1,tiles:1}),Xe(o,t,e).then(u=>(r.onProgress?.({phase:"encode",progress:1,tile:1,tiles:1}),u))}function gi(i,a,t,e,r,o){let{gl:s}=i,n=Sa(a.quad,a.width,a.height),u=Math.max(1,a.srcWidth),l=Math.max(1,a.srcHeight),c=[[t,e],[t+r,e],[t+r,e+o],[t,e+o]],h=(f,m)=>{let g=Ee(n,f,m),y=g.w>1e-4?g.w:1e-4,S=2*(f-t)/Math.max(1,r)-1,b=1-2*(m-e)/Math.max(1,o);return[S*y,b*y,g.x/u,g.y/l,y]},p=c.map(([f,m])=>h(f,m)),v=new Float32Array([...p[0],...p[1],...p[2],...p[0],...p[2],...p[3]]);s.bindBuffer(s.ARRAY_BUFFER,i.buffer),s.bufferData(s.ARRAY_BUFFER,v,s.DYNAMIC_DRAW)}function xi(i,a,t,e,r,o){let s=r/i,u=-(2*t/i-1+s)/s,l=1/s,c=o/a,p=-(1-2*e/a-c)/c,v=1/c;return{center:[u,p],half:[l,v]}}function ga(i,a,t,e,r,o){let{gl:s}=i;s.viewport(0,0,r,o),s.clearColor(0,0,0,0),s.clear(s.COLOR_BUFFER_BIT),s.disable(s.BLEND),gi(i,a,t,e,r,o);let n=xi(a.width,a.height,t,e,r,o);ya(i,{matrix:ti,warp:ei,color:a.color,vignette:a.vignette,aspect:a.width/Math.max(1,a.height),vigCenter:n.center,vigHalf:n.half,texel:[1/Math.max(1,i.texWidth),1/Math.max(1,i.texHeight)],enhance:{...a.enhance,quality:1}})}async function bi(i,a,t,e,r){let o=Math.max(256,Math.min(8192,Math.round(r.tileSize??2048))),s=Math.ceil(a.width/o),n=Math.ceil(a.height/o),u=s*n,l=u===1,c=document.createElement("canvas");c.width=l?a.width:Math.min(o,a.width),c.height=l?a.height:Math.min(o,a.height);let h=Ne(c,!0);if(!h)throw new Error("WebGL unavailable");try{let p=pi(i,h.maxTexture);if(!xa(h,p))throw new Error("Texture upload failed");if(ba(h,a.enhance),l){ga(h,a,0,0,a.width,a.height),r.onProgress?.({phase:"encode",progress:.9,tile:1,tiles:1});let y=await Xe(c,t,e);return r.onProgress?.({phase:"encode",progress:1,tile:1,tiles:1}),y}let v=document.createElement("canvas");v.width=a.width,v.height=a.height;let f=v.getContext("2d");if(!f)throw new Error("2D canvas is unavailable");let m=0;for(let y=0;y<n;y+=1)for(let S=0;S<s;S+=1){pt(r.signal);let b=S*o,w=y*o,k=Math.min(o,a.width-b),T=Math.min(o,a.height-w);c.width=k,c.height=T,ga(h,a,b,w,k,T),f.drawImage(c,b,w),m+=1,r.onProgress?.({phase:"render",progress:m/u*.9,tile:m,tiles:u}),await he()}pt(r.signal),r.onProgress?.({phase:"encode",progress:.95,tile:u,tiles:u});let g=await Xe(v,t,e);return r.onProgress?.({phase:"encode",progress:1,tile:u,tiles:u}),g}finally{wa(h)}}async function Ta(i,a,t,e,r={}){pt(r.signal);try{if(typeof WebGLRenderingContext<"u"&&document.createElement("canvas").getContext("webgl"))return await bi(i,a,t,e,r)}catch(o){if(ut(o))throw o}return vi(i,a,t,e,r)}function yi(i){let a=i.length;if(a<2)return[0];let t=new Array(a-1);for(let r=0;r<a-1;r+=1){let o=Math.max(1e-6,i[r+1].x-i[r].x);t[r]=(i[r+1].y-i[r].y)/o}let e=new Array(a);e[0]=t[0],e[a-1]=t[a-2];for(let r=1;r<a-1;r+=1)e[r]=(t[r-1]+t[r])*.5;for(let r=0;r<a-1;r+=1){if(Math.abs(t[r])<1e-9){e[r]=0,e[r+1]=0;continue}let o=e[r]/t[r],s=e[r+1]/t[r],n=o*o+s*s;if(n>9){let u=3/Math.sqrt(n);e[r]=u*o*t[r],e[r+1]=u*s*t[r]}}return e}function It(i,a){let t=i.length;if(t===0)return _(a,0,1);if(t===1)return _(i[0].y,0,1);if(a<=i[0].x)return _(i[0].y,0,1);if(a>=i[t-1].x)return _(i[t-1].y,0,1);let e=0,r=t-1;for(;r-e>1;){let g=e+r>>1;i[g].x<=a?e=g:r=g}let o=i[e],s=i[r],n=Math.max(1e-6,s.x-o.x),u=(a-o.x)/n,l=yi(i),c=u*u,h=c*u,p=2*h-3*c+1,v=h-2*c+u,f=-2*h+3*c,m=h-c;return _(p*o.y+v*n*l[e]+f*s.y+m*n*l[r],0,1)}function me(i){if(i.length!==2){for(let a=0;a<=16;a+=1){let t=a/16;if(Math.abs(It(i,t)-t)>1/255)return!1}return!0}return Math.abs(i[0].x)<1e-6&&Math.abs(i[0].y)<1e-6&&Math.abs(i[1].x-1)<1e-6&&Math.abs(i[1].y-1)<1e-6}function ka(i){return me(i.rgb)&&me(i.r)&&me(i.g)&&me(i.b)}function je(i){if(ka(i))return null;let a=new Uint8Array(256*4);for(let t=0;t<256;t+=1){let e=t/255,r=It(i.rgb,e);a[t*4]=Math.round(_(It(i.r,r),0,1)*255),a[t*4+1]=Math.round(_(It(i.g,r),0,1)*255),a[t*4+2]=Math.round(_(It(i.b,r),0,1)*255),a[t*4+3]=255}return a}var V=(i,a)=>({x:i,y:a}),Ge=[{id:"linear",label:"Tuyến tính",labelEn:"Linear",points:xt()},{id:"soft",label:"Mềm",labelEn:"Soft",points:[V(0,.03),V(.25,.22),V(.5,.5),V(.75,.79),V(1,.98)]},{id:"contrast",label:"Tương phản",labelEn:"Contrast",points:[V(0,0),V(.22,.16),V(.5,.5),V(.78,.85),V(1,1)]},{id:"fade",label:"Bạc màu",labelEn:"Fade",points:[V(0,.1),V(.28,.3),V(.5,.52),V(.74,.73),V(1,.9)]}];function _i(i,a="rgb"){let t=Ge.find(e=>e.id===i)||Ge[0];return a==="rgb"?t.points.map(e=>({...e})):xt()}var Ma=17,We=[{id:"none",label:"Không",labelEn:"None"},{id:"cinema",label:"Điện ảnh",labelEn:"Cinema"},{id:"teal",label:"Xanh ngọc",labelEn:"Teal & Orange"},{id:"fade",label:"Bạc màu",labelEn:"Fade"},{id:"noir",label:"Đen trắng",labelEn:"Noir"},{id:"warm",label:"Ấm",labelEn:"Warm"},{id:"cool",label:"Lạnh",labelEn:"Cool"}],Lt=i=>i<0?0:i>1?1:i,ve=(i,a,t)=>i*.2126+a*.7152+t*.0722;function wi(i,a,t){let e=Lt((t-i)/Math.max(1e-6,a-i));return e*e*(3-2*e)}function Wt(i,a){let t=ve(i[0],i[1],i[2]);return[t+(i[0]-t)*a,t+(i[1]-t)*a,t+(i[2]-t)*a]}function La(i,a,t=.5){return[(i[0]-t)*a+t,(i[1]-t)*a+t,(i[2]-t)*a+t]}function Ot(i){return[Lt(i[0]),Lt(i[1]),Lt(i[2])]}var Si={cinema(i,a,t){let e=ve(i,a,t),r=[i+.032*e-.018*(1-e),a+.006*e+.008*(1-e),t-.03*e+.045*(1-e)];return r=La(r,1.06,.46),r=Wt(r,1.06),Ot(r)},teal(i,a,t){let e=ve(i,a,t),r=[i+.06*e-.035*(1-e),a+.012*e+.022*(1-e),t-.05*e+.075*(1-e)];return r=La(r,1.08,.47),r=Wt(r,1.1),Ot(r)},fade(i,a,t){let e=[i*.82+.11,a*.82+.105,t*.82+.1];return e=Wt(e,.82),e=[e[0]*1.015,e[1],e[2]*.99],Ot(e)},noir(i,a,t){let e=ve(i,a,t);return e=wi(.06,.94,e),[e*.995,e,e*1.012]},warm(i,a,t){let e=[i*1.06,a*1.012,t*.915];return e=Wt(e,1.05),Ot(e)},cool(i,a,t){let e=[i*.93,a*.995,t*1.075];return e=Wt(e,.97),Ot(e)}};function Oe(i){return We.find(a=>a.id===i)||We[0]}function Ke(i,a=17){if(i==="none")return null;let t=Si[i];if(!t)return null;let e=Math.max(2,Math.round(a)),r=e*e,o=e,s=new Uint8Array(r*o*4),n=e-1;for(let u=0;u<e;u+=1)for(let l=0;l<e;l+=1)for(let c=0;c<e;c+=1){let h=t(c/n,l/n,u/n),p=((u*e+l)*r+(u*e+c))*4;s[p]=Math.round(Lt(h[0])*255),s[p+1]=Math.round(Lt(h[1])*255),s[p+2]=Math.round(Lt(h[2])*255),s[p+3]=255}return s}var Ca=[1,0,0,0,1,0,0,0,1],be=[0,0,0];function Ti(i,a){let t=new Array(9);for(let e=0;e<3;e+=1){let r=e*3;for(let o=0;o<3;o+=1)t[r+o]=(i[r]||0)*(a[o]||0)+(i[r+1]||0)*(a[3+o]||0)+(i[r+2]||0)*(a[6+o]||0)}return t}function ki(i,a){return[(i[0]||0)*a[0]+(i[1]||0)*a[1]+(i[2]||0)*a[2],(i[3]||0)*a[0]+(i[4]||0)*a[1]+(i[5]||0)*a[2],(i[6]||0)*a[0]+(i[7]||0)*a[1]+(i[8]||0)*a[2]]}function E(i,a){let t=Ti(i.matrix,a.matrix),e=ki(i.matrix,a.offset);return{matrix:t,offset:[e[0]+i.offset[0],e[1]+i.offset[1],e[2]+i.offset[2]]}}function Li(){return{matrix:Ca.slice(),offset:be.slice()}}function Y(i,a,t,e=be){return{matrix:[i,0,0,0,a,0,0,0,t],offset:e.slice()}}function X(i){let a=Math.max(0,1+i),t=.2126,e=.7152,r=.0722,o=1-a;return{matrix:[t*o+a,e*o,r*o,t*o,e*o+a,r*o,t*o,e*o,r*o+a],offset:be.slice()}}function $(i){let a=Math.max(.05,1+i);return{matrix:[a,0,0,0,a,0,0,0,a],offset:[.5*(1-a),.5*(1-a),.5*(1-a)]}}function Ra(i){let a=i*.22;return{matrix:Ca.slice(),offset:[a,a,a]}}function Mi(i){let a=Math.pow(2,i);return{matrix:[a,0,0,0,a,0,0,0,a],offset:be.slice()}}function Ai(i){return Y(1+i*.16,1+i*.03,1-i*.16)}function q(i,a,t,e,r,o,s){return{id:i,label:a,labelEn:t,color:e,css:r,category:o,hint:s}}var Mt=[q("original","Nguyên bản","Original",Li(),"","root","Không đổi màu"),q("vivid","Sống động","Vivid",E($(.08),X(.38)),"saturate(1.38) contrast(1.08)","root"),q("dramatic","Kịch tính","Dramatic",E({matrix:[1.05,0,0,0,1.02,0,0,0,1.08],offset:[-.012,-.008,.012]},E($(.27),X(-.18))),"contrast(1.27) saturate(0.82)","root"),q("mono","Đen trắng","Mono",E($(.1),X(-1)),"grayscale(1) contrast(1.1)","mono"),q("vintage","Cổ điển","Vintage",{matrix:[.92,.32,.08,.14,.86,.11,.06,.19,.72],offset:[.035,.02,0]},"sepia(0.42) saturate(0.86) contrast(0.95)","root"),q("warm","Ấm","Warm",Y(1.12,1.02,.88),"sepia(0.18) saturate(1.06) brightness(1.02)","root"),q("cool","Lạnh","Cool",Y(.9,1,1.16),"saturate(0.96) hue-rotate(-8deg) brightness(1.01)","root"),q("meitu-natural","Tự nhiên","Natural",E(Y(1.04,1.02,.98),X(.12)),"brightness(1.03) saturate(1.12) sepia(0.08)","meitu","Meitu · Sáng nhẹ, giữ tông da tự nhiên"),q("meitu-korea","Hàn Quốc","Korea",E(Y(1.06,1,.98),X(.15)),"brightness(1.06) saturate(1.15) contrast(0.97)","meitu","Meitu · Da hồng sáng, tương phản mềm"),q("meitu-japan","Nhật Bản","Japan",E(Y(1.03,1.01,1.02),$(-.08)),"brightness(1.03) saturate(1.06) contrast(0.92)","meitu","Meitu · Trong vắt, đỡ gắt"),q("meitu-skin","Sáng da","Bright Skin",E(Y(1.05,1.03,.99),Ra(.14)),"brightness(1.07) saturate(1.05)","meitu","Meitu · Nâng sáng vùng da, giữ chi tiết"),q("meitu-pink","Hồng đào","Peach Pink",E(Y(1.07,.99,.97),X(.2)),"saturate(1.2) brightness(1.04)","meitu","Meitu · Hồng ấm, hợp chân dung"),q("meitu-white","Trắng sáng","Bright White",E(Y(1.08,1.08,1.08),X(-.05)),"brightness(1.08) saturate(0.95)","meitu","Meitu · Sáng tinh khôi, giảm bão hoà nhẹ"),q("xingtu-film","Điện ảnh","Cinematic",E(Y(.97,1.02,1.07),E($(.12),X(.05))),"contrast(1.12) saturate(1.05) hue-rotate(-6deg)","xingtu","Xingtu · Teal–orange mềm, hợp đường phố"),q("xingtu-hk","Hồng Kông","Hong Kong",E(Y(1.02,1,1.04),E($(.1),X(-.08))),"contrast(1.1) saturate(0.92) hue-rotate(4deg)","xingtu","Xingtu · Đêm đô thị, xanh lạnh"),q("xingtu-showa","Chiêu Hoà","Showa",E(Y(1.04,1,.93),E($(-.05),X(-.15))),"sepia(0.22) saturate(0.85) contrast(0.95)","xingtu","Xingtu · Hoài cổ, phai màu nhẹ"),q("xingtu-kama","Kamakura","Kamakura",E(Y(1.06,1.02,.9),X(.1)),"brightness(1.05) sepia(0.2) saturate(1.1)","xingtu","Xingtu · Bình minh biển, ấm sáng"),q("xingtu-night","Ban đêm","Night",E(Y(.94,.98,1.08),E($(.08),X(-.05))),"brightness(0.96) contrast(1.08) hue-rotate(-10deg)","xingtu","Xingtu · Đêm sâu, giữ bóng tối"),q("xingtu-morning","Buổi sáng","Morning",E(Y(1.07,1.04,.93),X(.08)),"brightness(1.05) sepia(0.14) saturate(1.08)","xingtu","Xingtu · Nắng sớm, ấm và trong"),q("lr-cinema","Cinematic","Cinematic",E(Y(.98,1.02,1.06),E($(.15),X(.05))),"contrast(1.15) saturate(1.05) hue-rotate(-8deg)","lr","Lightroom · Điện ảnh tương phản mạnh"),q("lr-moody","Moody","Moody",E(Y(.97,.98,1.02),E($(.18),X(-.15))),"contrast(1.18) saturate(0.85) brightness(0.97)","lr","Lightroom · Ẩm ướt, bóng gắt"),q("lr-vibrant","Vibrant","Vibrant",E($(.05),X(.35)),"saturate(1.35) contrast(1.05)","lr","Lightroom · Màu rực, hợp phong cảnh"),q("lr-pastel","Pastel","Pastel",E(Y(1.03,1.03,1.03),E($(-.1),X(.1))),"brightness(1.04) contrast(0.9) saturate(1.1)","lr","Lightroom · Nhẹ, trong, chữ chụp đồ"),q("lr-desert","Sa mạc","Desert",E(Y(1.08,1,.88),X(.15)),"sepia(0.28) saturate(1.15) contrast(1.04)","lr","Lightroom · Vàng cát ấm"),q("lr-street","Đường phố","Street",E($(.2),X(-.1)),"contrast(1.2) saturate(0.9)","lr","Lightroom · Grit, hợp street life"),q("lr-faded","Mờ phai","Faded",E(Y(1.02,1.02,1.02),E($(-.12),X(-.15))),"brightness(1.03) contrast(0.88) saturate(0.85)","lr","Lightroom · Film phai, giảm tương phản"),q("lr-teal","Teal","Teal",E(Y(.93,1.04,1.07),X(.1)),"hue-rotate(-14deg) saturate(1.1) contrast(1.05)","lr","Lightroom · Xanh teal mát"),q("mono-warm","Đen trắng ấm","Mono Warm",E(Y(1.06,1.02,.94),X(-1)),"grayscale(1) sepia(0.18) contrast(1.06)","mono","Đen trắng · Ấm hạt"),q("mono-cool","Đen trắng lạnh","Mono Cool",E(Y(.94,.98,1.06),X(-1)),"grayscale(1) hue-rotate(-10deg) contrast(1.06)","mono","Đen trắng · Lạnh, gắt")];function wt(i){return Mt.find(a=>a.id===i)||Mt[0]}function Ci(i,a){let t=wt(a).color;return t=E(Mi(i.exposure/100),t),t=E(Ra(i.brightness/100),t),t=E($(i.contrast/100),t),t=E(X(i.saturation/100),t),t=E(Ai(i.warmth/100),t),t}function $e(i){return _(i.vignette/100,0,1)}function Qe(i,a,t=!0){let e=[];if(t){let n=wt(a).css;n&&e.push(n)}let r=Math.pow(2,i.exposure/100),o=1+i.brightness/200;Math.abs(r*o-1)>.005&&e.push(`brightness(${(r*o).toFixed(4)})`),i.contrast!==0&&e.push(`contrast(${Math.max(.05,1+i.contrast/100).toFixed(4)})`);let s=Math.max(0,1+i.saturation/100+i.vibrance/260);return Math.abs(s-1)>.005&&e.push(`saturate(${s.toFixed(4)})`),i.warmth!==0&&e.push(`sepia(${(Math.abs(i.warmth)*.0015).toFixed(4)})`),i.tint!==0&&e.push(`hue-rotate(${(i.tint*.045).toFixed(3)}deg)`),e.join(" ")||"none"}function Ri(i,a){let t=i.data,e=a.matrix,r=a.offset;for(let o=0;o<t.length;o+=4){if(t[o+3]===0)continue;let s=t[o]/255,n=t[o+1]/255,u=t[o+2]/255;t[o]=_((e[0]*s+e[1]*n+e[2]*u+r[0])*255,0,255),t[o+1]=_((e[3]*s+e[4]*n+e[5]*u+r[1])*255,0,255),t[o+2]=_((e[6]*s+e[7]*n+e[8]*u+r[2])*255,0,255)}}function Ea(i,a,t,e){let o=document.createElement("canvas");o.width=128,o.height=128;let s=o.getContext("2d",{willReadFrequently:!0});if(!s)return o;let n=Math.max(128/a,128/t),u=a*n,l=t*n;s.drawImage(i,(128-u)/2,(128-l)/2,u,l);try{let c=s.getImageData(0,0,128,128);Ri(c,wt(e).color),s.putImageData(c,0,0)}catch{}return o}function Ei(i){let a=[i.hsl.red,i.hsl.orange,i.hsl.yellow,i.hsl.green,i.hsl.aqua,i.hsl.blue,i.hsl.purple,i.hsl.magenta],t=new Float32Array(24);for(let e=0;e<a.length;e+=1){let r=a[e];t[e*3]=_(r.hue/100,-1,1),t[e*3+1]=_(r.saturation/100,-1,1),t[e*3+2]=_(r.luminance/100,-1,1)}return t}function ye(i){let a=i.filter(e=>e.w>0&&e.h>0).slice().sort((e,r)=>(r.confidence??0)-(e.confidence??0)).slice(0,4),t=new Float32Array(16);for(let e=0;e<a.length;e+=1){let r=a[e];t[e*4]=_(r.x+r.w/2,0,1),t[e*4+1]=_(r.y+r.h/2,0,1),t[e*4+2]=_(r.w*.62,.01,1),t[e*4+3]=_(r.h*.72,.01,1)}return{data:t,count:a.length}}var Ve=.6,zi={x:-.34,y:-.18},Bi={x:.34,y:-.18},Ii={x:0,y:.1},Di={x:0,y:.4},Aa={x:.22,y:.16},Pi={x:.2,y:.24},Ui={x:.3,y:.16};function ge(i,a){return!i||!Number.isFinite(i.x)||!Number.isFinite(i.y)?a:{x:_(i.x,-.92,.92),y:_(i.y,-.92,.92)}}function xe(i,a){return!i||!Number.isFinite(i.x)||!Number.isFinite(i.y)?a:{x:_(i.x,.02,Ve),y:_(i.y,.02,Ve)}}function yt(i){return Math.round(_(i*.5+.5,0,1)*255)}function _t(i){return Math.round(_(i/Ve,0,1)*255)}function za(i){let a=i.filter(o=>o&&o.box&&Number.isFinite(o.box.x)&&Number.isFinite(o.box.y)&&Number.isFinite(o.box.w)&&Number.isFinite(o.box.h)&&o.box.w>0&&o.box.h>0).slice().sort((o,s)=>{let n=o.box.w*o.box.h,u=s.box.w*s.box.h;return(s.confidence??u)-(o.confidence??n)}).slice(0,4),t=new Float32Array(16),e=new Uint8Array(64),r=[];for(let o=0;o<a.length;o+=1){let s=a[o],n=_(s.box.x,0,1),u=_(s.box.y,0,1),l=_(s.box.w,0,1),c=_(s.box.h,0,1);t[o*4]=_(n+l/2,0,1),t[o*4+1]=_(u+c/2,0,1),t[o*4+2]=_(l*.62,.01,1),t[o*4+3]=_(c*.72,.01,1),r.push({x:n,y:u,w:l,h:c,confidence:s.confidence??l*c});let h=ge(s.eyeL,zi),p=ge(s.eyeR,Bi),v=ge(s.nose,Ii),f=ge(s.mouth,Di),m=xe(s.eyeLRadius,Aa),g=xe(s.eyeRRadius,Aa),y=xe(s.noseRadius,Pi),S=xe(s.mouthRadius,Ui),b=o*16;e[b]=yt(h.x),e[b+1]=yt(h.y),e[b+2]=yt(p.x),e[b+3]=yt(p.y),e[b+4]=yt(v.x),e[b+5]=yt(v.y),e[b+6]=yt(f.x),e[b+7]=yt(f.y),e[b+8]=_t(m.x),e[b+9]=_t(m.y),e[b+10]=_t(g.x),e[b+11]=_t(g.y),e[b+12]=_t(y.x),e[b+13]=_t(y.y),e[b+14]=_t(S.x),e[b+15]=_t(S.y)}return{data:t,anchors:e,count:a.length,boxes:r}}function Ba(i){let a=i.adjust;return{exposure:a.exposure/100,brightness:a.brightness/100,contrast:a.contrast/100,saturation:a.saturation/100,highlights:a.highlights/100,shadows:a.shadows/100,whites:a.whites/100,blacks:a.blacks/100,warmth:a.warmth/100,tint:a.tint/100,vibrance:a.vibrance/100,gamma:a.gamma/100,clarity:a.clarity/100,sharpen:a.sharpen/100,denoise:a.denoise/100,smoothSkin:a.smoothSkin/100,blemish:a.blemish/100,skinTexture:a.skinTexture/100,skinTone:a.skinTone/100,faceSlim:a.faceSlim/100,jawline:a.jawline/100,chin:a.chin/100,eyeSize:a.eyeSize/100,noseSize:a.noseSize/100,mouthSize:a.mouthSize/100,curve:i.curve,lut:i.lut,lutSize:17,lutStrength:i.enhance.lutStrength/100,faces:i.faces.count?i.faces.data:null,faceCount:i.faces.count,anchors:i.faces.count?i.anchors??null:null,hsl:Ei(i.enhance),mask:i.mask??null,liquify:i.liquify??null,linear:i.linear?1:0,dither:i.dither??0,quality:i.quality}}var _e={webgl:0,highp:!1,maxTexture:2048,maxVaryings:8,maxUniforms:16,gpuVendor:"",gpuRenderer:"",deviceMemoryGB:null,hardwareConcurrency:2,dpr:1,mobile:!1,ios:!1,saveData:!1,reducedMotion:!1,tier:"low"},Dt=null;function qi(i,a,t,e,r,o,s){let n=i===2?2:i===1?1:0;a&&(n+=2),t>=8192?n+=2:t>=4096&&(n+=1),e!==null?e>=8?n+=2:e>=4&&(n+=1):r>=8&&(n+=1),o||(n+=1),s&&(n-=1);let u=n>=8?"ultra":n>=6?"high":n>=4?"mid":"low";return u==="ultra"&&(i<2||!a)?"high":u}function Ze(){if(Dt)return Dt;if(typeof document>"u"||typeof navigator>"u")return Dt=_e,Dt;let i=navigator.userAgent||"",a=/Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(i),t=/iP(hone|ad|od)/.test(i)||i.includes("Macintosh")&&"ontouchend"in document,e=typeof navigator.deviceMemory=="number"?navigator.deviceMemory:null,r=navigator.hardwareConcurrency||2,o=navigator.connection?.saveData===!0,s=typeof window<"u"&&typeof window.matchMedia=="function"?window.matchMedia("(prefers-reduced-motion: reduce)").matches:!1,n=typeof window<"u"?Math.min(3,Math.max(1,window.devicePixelRatio||1)):1,u=0,l=!1,c=_e.maxTexture,h=_e.maxVaryings,p=_e.maxUniforms,v="",f="",m=document.createElement("canvas");m.width=1,m.height=1;let g={alpha:!1,antialias:!1,depth:!1,stencil:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"},y=null;try{y=m.getContext("webgl2",g),y&&(u=2),y||(y=m.getContext("webgl",g),y&&(u=1))}catch{y=null}if(y){try{let S=y.getShaderPrecisionFormat(y.FRAGMENT_SHADER,y.HIGH_FLOAT);l=!!S&&S.precision>0,c=y.getParameter(y.MAX_TEXTURE_SIZE)||c,h=y.getParameter(y.MAX_VARYING_VECTORS)||h,p=y.getParameter(y.MAX_FRAGMENT_UNIFORM_VECTORS)||p;let b=y.getExtension("WEBGL_debug_renderer_info");b?(v=String(y.getParameter(b.UNMASKED_VENDOR_WEBGL)||""),f=String(y.getParameter(b.UNMASKED_RENDERER_WEBGL)||"")):(v=String(y.getParameter(y.VENDOR)||""),f=String(y.getParameter(y.RENDERER)||""))}catch{}try{y.getExtension("WEBGL_lose_context")?.loseContext()}catch{}}return Dt={webgl:u,highp:l,maxTexture:c,maxVaryings:h,maxUniforms:p,gpuVendor:v,gpuRenderer:f,deviceMemoryGB:e,hardwareConcurrency:r,dpr:n,mobile:a,ios:t,saveData:o,reducedMotion:s,tier:qi(u,l,c,e,r,a,o)},Dt}function we(i,a){return i==="linear"?"linear":i==="srgb"?"srgb":a.webgl>0&&a.highp&&a.tier!=="low"?"linear":"srgb"}function Kt(i,a,t){return typeof i=="boolean"?i:a==="linear"||t.tier==="low"}function Hi(i,a,t){return i*.2126+a*.7152+t*.0722}function Vt(i,a,t){let e=a*t,r=0;for(let o=0;o<256;o+=1)if(r+=i[o],r>=e)return o/255;return 1}function Fi(i){if(!i.length)return 0;i.sort((t,e)=>t-e);let a=i.length>>1;return i.length%2?i[a]:(i[a-1]+i[a])*.5}async function Je(i,a=256,t=0){let e="width"in i?i.width:0,r="height"in i?i.height:0;if(!e||!r)throw new Error("Cannot analyse an empty image");let o=Math.min(1,a/Math.max(e,r)),s=Math.max(8,Math.round(e*o)),n=Math.max(8,Math.round(r*o)),u=document.createElement("canvas");u.width=s,u.height=n;let l=u.getContext("2d",{willReadFrequently:!0});if(!l)throw new Error("2D canvas is unavailable");l.imageSmoothingQuality="high",l.drawImage(i,0,0,s,n);let c;try{c=l.getImageData(0,0,s,n).data}catch{throw new Error("Cannot analyse a cross-origin image without CORS")}await new Promise(L=>{typeof requestAnimationFrame=="function"?requestAnimationFrame(()=>L()):setTimeout(L,0)});let h=s*n,p=new Uint32Array(256),v=new Float32Array(h),f=0,m=0,g=0,y=0,S=0,b=0,w=0,k=0;for(let L=0,G=0;L<h;L+=1,G+=4){let j=c[G]/255,K=c[G+1]/255,Q=c[G+2]/255,O=Hi(j,K,Q);v[L]=O,p[Math.round(O*255)]+=1,f+=j,m+=K,g+=Q,O<.02&&(w+=1),O>.98&&(k+=1);let st=Math.max(j,K,Q),M=Math.min(j,K,Q);st>.04&&(y+=(st-M)/st,S+=1);let B=-.168736*j-.331264*K+.5*Q+.5,R=.5*j-.418688*K-.081312*Q+.5;R>.34&&R<.66&&B>.31&&B<.6&&O>.12&&O<.95&&(b+=1)}let T=0,A=0,D=8,U=[],C=[];for(let L=0;L+D<=n;L+=D)for(let G=0;G+D<=s;G+=D){let j=0,K=0,Q=0,O=0;for(let B=L;B<L+D;B+=1)for(let R=G;R<G+D;R+=1){let F=B*s+R,W=v[F];if(j+=W,K+=W*W,R>0&&B>0&&R<s-1&&B<n-1){let Z=4*W-v[F-1]-v[F+1]-v[F-s]-v[F+s];Q+=Math.abs(Z),T+=Math.abs(Z),A+=1}O+=1}let st=j/Math.max(1,O),M=Math.max(0,K/Math.max(1,O)-st*st);U.push(Math.sqrt(M)),C.push(Q/Math.max(1,O))}let z=[];if(C.length){let L=C.slice().sort((j,K)=>j-K),G=L[Math.floor(L.length*.3)]??0;for(let j=0;j<C.length;j+=1)C[j]<=G&&z.push(U[j])}let P=z.length?Fi(z):0,tt=A?T/A:0;return{width:s,height:n,mean:(f+m+g)/(h*3),median:Vt(p,h,.5),p1:Vt(p,h,.01),p5:Vt(p,h,.05),p95:Vt(p,h,.95),p99:Vt(p,h,.99),clipLow:w/h,clipHigh:k/h,meanR:f/h,meanG:m/h,meanB:g/h,saturation:S?y/S:0,noise:P,sharpness:tt,skinRatio:b/h,faceCount:Math.max(0,Math.round(t))}}function ta(i){let a=ee(),t=[],e=(l,c)=>{let[h,p]=et[l];a[l]=_(Math.round(c),h,p)},r=Math.max(.035,i.median),o=_(Math.log2(.46/r),-.75,.75);e("exposure",o*100),i.median<.3&&t.push("low-light"),i.clipHigh>.03&&t.push("overexposed"),i.clipLow>.05&&t.push("underexposed");let s=i.p95-i.p5;e("contrast",_((.62-s)*90,-18,30)),s<.45&&t.push("flat"),i.clipHigh>.015?e("highlights",-_(i.clipHigh*900,10,65)):i.p95>.94?e("highlights",-15):i.p95<.78&&e("highlights",10),i.p5<.08&&e("shadows",_((.08-i.p5)*420,8,55)),i.p99<.88?e("whites",_((.88-i.p99)*120,0,20)):i.clipHigh>.03&&e("whites",-12),i.p1>.1?e("blacks",-_((i.p1-.1)*180,0,20)):i.p1<.01&&e("blacks",6);let n=(i.meanB-i.meanR)*90;e("warmth",_(n,-22,22)),n>8&&t.push("cool-cast"),n<-8&&t.push("warm-cast");let u=(i.meanG-(i.meanR+i.meanB)*.5)*120;return e("tint",_(u,-18,18)),u>8&&t.push("green-cast"),u<-8&&t.push("magenta-cast"),e("saturation",_((.3-i.saturation)*70,-12,22)),e("vibrance",_((.34-i.saturation)*55,-8,26)),i.sharpness<.025&&e("sharpen",_((.025-i.sharpness)*600,0,30)),i.sharpness<.012&&t.push("soft"),i.noise>.008&&e("denoise",_((i.noise-.008)*700,0,40)),i.noise>.02&&t.push("noisy"),e("clarity",_((.62-s)*40,0,18)),(i.skinRatio>.015||i.faceCount>0)&&(e("smoothSkin",_(i.skinRatio*120+i.faceCount*3,0,24)),t.push("portrait")),{adjust:a,analysis:i,notes:t}}var Se=new Map;function Ni(i){Se.set(i.id,i)}function Xi(i){Se.delete(i)}function Yi(){return Array.from(Se.values())}function ia(i){return Se.get(i)}function ea(i,a){let t=document.createElement("canvas");return t.width=Math.max(1,Math.round(i)),t.height=Math.max(1,Math.round(a)),t}function aa(i,a=!1){let t=i.getContext("2d",{willReadFrequently:a});if(!t)throw new Error("2D canvas is unavailable");return t}function Gi(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement?{width:i.naturalWidth||i.width,height:i.naturalHeight||i.height}:{width:i.width,height:i.height}}function ji(i,a,t,e,r=1){if(!t&&!e)return{width:i,height:a,k:1};let o=t?Math.sqrt(Math.max(1,t)/Math.max(1,i*a)):1,s=e?Math.sqrt(Math.max(1,e)/Math.max(1,i*a*r*r)):1,n=Math.min(1,o,s);return{width:Math.max(1,Math.floor(i*n)),height:Math.max(1,Math.floor(a*n)),k:n}}function Wi(i,a,t,e,r,o,s,n,u){let l=r-u,c=o-u,h=s+u*2,p=n+u*2,v=Math.max(0,l),f=Math.max(0,c),m=Math.min(t,l+h)-v,g=Math.min(e,c+p)-f;i.clearRect(0,0,h,p),i.drawImage(a,v,f,m,g,v-l,f-c,m,g),f>c&&i.drawImage(a,v,0,m,1,v-l,0,m,f-c),f+g<c+p&&i.drawImage(a,v,e-1,m,1,v-l,f+g-c,m,c+p-(f+g)),v>l&&i.drawImage(a,0,f,1,g,0,f-c,v-l,g),v+m<l+h&&i.drawImage(a,t-1,f,1,g,v+m-l,f-c,l+h-(v+m),g),v>l&&f>c&&i.drawImage(a,0,0,1,1,0,0,v-l,f-c),v+m<l+h&&f>c&&i.drawImage(a,t-1,0,1,1,v+m-l,0,l+h-(v+m),f-c),v>l&&f+g<c+p&&i.drawImage(a,0,e-1,1,1,0,f+g-c,v-l,c+p-(f+g)),v+m<l+h&&f+g<c+p&&i.drawImage(a,t-1,e-1,1,1,v+m-l,f+g-c,l+h-(v+m),c+p-(f+g))}async function ra(i,a,t={}){let{width:e,height:r}=Gi(a);if(!e||!r)throw new Error("AI pipeline needs a non-empty image");let o=Math.max(.25,Math.min(4,t.scale??1)),s=Math.max(32,Math.min(2048,Math.round(t.tileSize??512))),n=Math.max(0,Math.min(128,Math.round(t.halo??t.overlap??8))),u=ji(e,r,t.maxInputPixels,t.maxOutputPixels,o),l=a,c=e,h=r;if(u.k<1){t.onStage?.("resize");let k=ea(u.width,u.height),T=aa(k);T.imageSmoothingEnabled=!0,T.imageSmoothingQuality="high",T.drawImage(a,0,0,e,r,0,0,u.width,u.height),l=k,c=u.width,h=u.height}let p=Math.max(1,Math.round(c*o)),v=Math.max(1,Math.round(h*o)),f=ea(p,v),m=aa(f);m.imageSmoothingEnabled=!0,m.imageSmoothingQuality="high";let g=ea(s+n*2,s+n*2),y=aa(g,!0),S=Math.ceil(c/s),b=Math.ceil(h/s),w=S*b;try{t.onStage?.("load"),await i.load(t.signal);let k=0;for(let T=0;T<b;T+=1)for(let A=0;A<S;A+=1){pt(t.signal);let D=A*s,U=T*s,C=Math.min(s,c-D),z=Math.min(s,h-U),P=C+n*2,tt=z+n*2;(g.width!==P||g.height!==tt)&&(g.width=P,g.height=tt),Wi(y,l,c,h,D,U,C,z,n);let I=await i.run(g,t.signal);pt(t.signal);let L="width"in I?I.width:P,G="height"in I?I.height:tt,j=L/Math.max(1,P),K=G/Math.max(1,tt),Q=Math.min(L-1,n*j),O=Math.min(G-1,n*K),st=Math.min(L-Q,C*j),M=Math.min(G-O,z*K),B=Math.round(D*o),R=Math.round(U*o),F=Math.max(1,Math.round((D+C)*o)-B),W=Math.max(1,Math.round((U+z)*o)-R);m.drawImage(I,Q,O,st,M,B,R,F,W),"close"in I&&typeof I.close=="function"&&I.close(),k+=1,t.onStage?.("tile",k,w),t.onProgress?.(k/w),await he()}t.onStage?.("done",w,w)}finally{i.dispose()}return f}var mt={maxPreview:1080,maxHistory:60,maxZoom:8,maxExport:8192,maxPixels:67108864,previewQuality:"fast",colorSpace:"auto",dither:"auto"};function Oi(){if(typeof navigator>"u")return mt.maxPixels;let i=navigator.userAgent||"";return/iP(hone|ad|od)/.test(i)||navigator.platform==="MacIntel"&&(navigator.maxTouchPoints||0)>1?16777216:mt.maxPixels}function Ki(i){if(typeof i=="string"){let a=document.querySelector(i);if(!a)throw new Error(`Aurum: container "${i}" was not found`);return a}return i}function Pt(i){return i instanceof HTMLImageElement?{width:i.naturalWidth||i.width,height:i.naturalHeight||i.height}:{width:i.width,height:i.height}}async function oa(i){return new Promise((a,t)=>{let e=new Image;e.crossOrigin="anonymous",e.decoding="async",e.onload=()=>a(e),e.onerror=()=>t(new Error("Could not load the image (check the URL and CORS headers).")),e.src=i})}async function Vi(i){if(typeof i=="string")try{let a=await fetch(i,{mode:"cors",credentials:"same-origin"});if(!a.ok)throw new Error(`HTTP ${a.status}`);let t=await a.blob();if(typeof createImageBitmap=="function")try{return{bitmap:await createImageBitmap(t,{imageOrientation:"from-image"}),owned:!0}}catch{}let e=URL.createObjectURL(t);try{return{bitmap:await oa(e),owned:!0}}finally{URL.revokeObjectURL(e)}}catch(a){if(i.startsWith("data:")||i.startsWith("blob:"))return{bitmap:await oa(i),owned:!0};throw a}if(i instanceof Blob){if(typeof createImageBitmap=="function")try{return{bitmap:await createImageBitmap(i,{imageOrientation:"from-image"}),owned:!0}}catch{}let a=URL.createObjectURL(i);try{return{bitmap:await oa(a),owned:!0}}finally{URL.revokeObjectURL(a)}}if(i instanceof HTMLImageElement){if(i.complete||await new Promise((a,t)=>{i.addEventListener("load",()=>a(),{once:!0}),i.addEventListener("error",()=>t(new Error("Could not load the image")),{once:!0})}),!i.naturalWidth)throw new Error("The image has no pixels");return{bitmap:i,owned:!1}}return{bitmap:i,owned:!1}}async function Ia(i,a){let t=Pt(i),e=Math.max(t.width,t.height);if(e<=a)return{bitmap:i,owned:!1};let r=a/e,o=Math.max(1,Math.round(t.width*r)),s=Math.max(1,Math.round(t.height*r));if(typeof createImageBitmap=="function")try{return{bitmap:await createImageBitmap(i,{resizeWidth:o,resizeHeight:s,resizeQuality:"high"}),owned:!0}}catch{}let n=document.createElement("canvas");n.width=o,n.height=s;let u=n.getContext("2d");if(!u)throw new Error("Could not create the preview canvas");return u.imageSmoothingQuality="high",u.drawImage(i,0,0,o,s),{bitmap:n,owned:!0}}var At=class{constructor(a){d(this,"stage");d(this,"canvas");d(this,"maxZoom");d(this,"state",Et());d(this,"history");d(this,"renderer");d(this,"gesture");d(this,"options");d(this,"original",null);d(this,"preview",null);d(this,"ownsOriginal",!1);d(this,"ownsPreview",!1);d(this,"ready",!1);d(this,"loading",!1);d(this,"loadSeq",0);d(this,"lastFrame",{x:0,y:0,width:0,height:0});d(this,"lastViewport",{width:0,height:0});d(this,"dpr",1);d(this,"renderPending",!1);d(this,"raf",0);d(this,"animation",null);d(this,"animationSeq",0);d(this,"resizeObserver",null);d(this,"listeners",new Map);d(this,"destroyed",!1);d(this,"commitKey","");d(this,"resultMode",!1);d(this,"faces",[]);d(this,"serverFaces",[]);d(this,"faceAnchors",[]);d(this,"beautyMask",null);d(this,"facePack",{data:new Float32Array(16),count:0});d(this,"anchorPack",null);d(this,"curveCache",{source:null,data:null});d(this,"lutCache",new Map);d(this,"liquifyCache",{source:null,width:0,height:0,field:null});d(this,"previewQuality",0);d(this,"colorMode");d(this,"ditherEnabled");d(this,"capabilities");d(this,"aiSeq",0);d(this,"aiController",null);d(this,"aiBefore",null);d(this,"resize",()=>{if(this.destroyed)return;let a=this.viewport();this.dpr=Math.min(3,window.devicePixelRatio||1),this.renderer.resize(a.width,a.height,this.dpr),this.ready?(this.syncViewport(a),this.renderNow()):this.lastViewport=a});let t=Ki(a.container);this.options={maxPreview:a.maxPreview??mt.maxPreview,maxHistory:a.maxHistory??mt.maxHistory,maxZoom:a.maxZoom??mt.maxZoom,maxExport:a.maxExport??mt.maxExport,maxPixels:a.maxPixels??Oi(),previewQuality:a.previewQuality??mt.previewQuality,colorSpace:a.colorSpace??mt.colorSpace,dither:a.dither??mt.dither,background:a.background??"#08080a"},this.capabilities=Ze(),this.colorMode=we(this.options.colorSpace,this.capabilities),this.ditherEnabled=Kt(this.options.dither,this.colorMode,this.capabilities),this.maxZoom=this.options.maxZoom,this.previewQuality=this.options.previewQuality==="high"?1:0,this.history=new Yt(this.options.maxHistory),getComputedStyle(t).position==="static"&&(t.style.position="relative"),this.stage=document.createElement("div"),this.stage.className="au-stage",Object.assign(this.stage.style,{position:"absolute",inset:"0",overflow:"hidden",width:"100%",height:"100%",background:this.options.background,touchAction:"none",userSelect:"none",WebkitUserSelect:"none",cursor:"grab"}),this.canvas=document.createElement("canvas"),this.canvas.className="au-canvas",Object.assign(this.canvas.style,{position:"absolute",inset:"0",width:"100%",height:"100%",display:"block"}),this.stage.appendChild(this.canvas),t.appendChild(this.stage),this.renderer=new pe(this.canvas);let e={stage:this.stage,maxZoom:this.maxZoom,viewport:()=>this.viewport(),frame:()=>this.currentFrame(),source:()=>this.source(),state:()=>this.state,setTransform:r=>this.applyTransform(r),commit:()=>this.commit("transform"),settle:(r,o)=>this.settle(r,o)};this.gesture=new ce(e),typeof ResizeObserver<"u"?(this.resizeObserver=new ResizeObserver(()=>this.resize()),this.resizeObserver.observe(this.stage)):window.addEventListener("resize",this.resize),this.resize(),a.image&&this.load(a.image).catch(()=>{})}on(a,t){let e=this.listeners.get(a);return e||(e=new Set,this.listeners.set(a,e)),e.add(t),()=>this.off(a,t)}off(a,t){this.listeners.get(a)?.delete(t)}emit(a,t){let e=this.listeners.get(a);if(e)for(let r of e)try{r(t)}catch{}}get isReady(){return this.ready}get isLoading(){return this.loading}get accelerated(){return this.renderer.accelerated}viewport(){return{width:Math.max(1,this.stage.clientWidth),height:Math.max(1,this.stage.clientHeight)}}source(){return this.original?Pt(this.original):{width:1,height:1}}sourceBitmap(){return this.original}currentFrame(){return dt(this.viewport(),this.state.crop)}getFrame(){return this.ready?this.currentFrame():{...this.lastFrame}}paintView(){let a=this.viewport(),t=this.currentFrame();if(this.resultMode&&t.width>1&&t.height>1){let e=Math.min(a.width/t.width,a.height/t.height);return{scale:e,x:(a.width-t.width*e)/2-t.x*e,y:(a.height-t.height*e)/2-t.y*e}}return{scale:1,x:0,y:0}}sourcePointAt(a,t){if(!this.ready)return null;let e=this.stage.getBoundingClientRect(),r=this.viewport(),o=this.source(),s=this.state.transform,n=this.paintView(),u=a-e.left-r.width/2,l=t-e.top-r.height/2,c=it(r,o.width,o.height,s),h=at({x:(u-n.x)/n.scale,y:(l-n.y)/n.scale},c.radians),p={x:h.x/c.sx-s.offsetX,y:h.y/c.sy-s.offsetY},v=Tt(p,rt(s)),f=(v.x+1)/2,m=(v.y+1)/2;return f<0||f>1||m<0||m>1?null:{x:f,y:m}}screenPointAt(a,t){if(!this.ready)return null;let e=this.viewport(),r=this.source(),o=this.state.transform,s=this.paintView(),n=it(e,r.width,r.height,o),u=zt({x:a*2-1,y:t*2-1},rt(o)),l=da({x:(u.x+o.offsetX)*n.sx,y:(u.y+o.offsetY)*n.sy},n.radians);return{x:e.width/2+l.x*s.scale+s.x,y:e.height/2+l.y*s.scale+s.y}}getPreviewBitmap(){return this.preview}async load(a){let t=++this.loadSeq;this.loading=!0,this.emit("loading",{loading:!0});try{let{bitmap:e,owned:r}=await Vi(a);if(t!==this.loadSeq){r&&e instanceof ImageBitmap&&e.close();return}let o=await Ia(e,this.options.maxPreview);if(t!==this.loadSeq){r&&e instanceof ImageBitmap&&e.close(),o.owned&&o.bitmap instanceof ImageBitmap&&o.bitmap.close();return}this.releaseBitmaps(),this.original=e,this.ownsOriginal=r,this.preview=o.bitmap,this.ownsPreview=o.owned,this.beautyMask=null,this.renderer.setBitmap(o.bitmap),this.ready=!0,this.loading=!1;let s=Pt(e);this.state=Et(),this.lastViewport={width:0,height:0},this.lastFrame={x:0,y:0,width:0,height:0},this.curveCache.source=null,this.state.crop.ratio=s.width/s.height,this.state.transform.zoom=.2,this.ensureCoverage(),this.history.reset(this.state),await new Promise(n=>{let u=!1,l=()=>{u||(u=!0,n())};requestAnimationFrame(l),window.setTimeout(l,120)}),this.resize(),this.renderNow(),this.emit("ready",s),this.emit("loading",{loading:!1}),this.emitState(),this.emitHistory()}catch(e){this.loading=!1,this.emit("loading",{loading:!1});let r=e instanceof Error?e:new Error(String(e));throw this.emit("error",{error:r}),r}}setImage(a){return this.load(a)}releaseBitmaps(){this.disposeAIBefore(),this.ownsOriginal&&this.original instanceof ImageBitmap&&this.original.close(),this.ownsPreview&&this.preview instanceof ImageBitmap&&this.preview!==this.original&&this.preview.close(),this.original=null,this.preview=null,this.ownsOriginal=!1,this.ownsPreview=!1}getState(){return nt(this.state)}setState(a,t={}){this.state=Me(a),this.curveCache.source=null,this.ready&&(this.ensureCoverage(),t.history!==!1&&this.history.push(this.state,"set-state"),this.scheduleRender()),t.silent||(this.emitState(),this.emitHistory())}exportState(){return JSON.stringify({version:1,state:this.getState()},null,2)}importState(a){let t=typeof a=="string"?JSON.parse(a):a,e=t&&typeof t=="object"&&"state"in t?t.state:t;this.setState(e)}setAdjust(a,t,e){let r=et[a];if(!r||!Number.isFinite(t))return;let o=_(t,r[0],r[1]);this.state.adjust[a]!==o&&(this.state.adjust[a]=o,this.scheduleRender(),this.commit(e||`adjust:${a}`))}resetAdjust(a){this.setAdjust(a,0,`reset:${a}`)}resetAdjustments(){let a=!1;for(let t of te)this.state.adjust[t]!==0&&(this.state.adjust[t]=0,a=!0);a&&(this.scheduleRender(),this.commit("reset-adjust"))}setFilter(a){let t=wt(a);this.state.filter!==t.id&&(this.state.filter=t.id,this.scheduleRender(),this.commit("filter"))}setCurve(a,t,e="curve"){let r=this.state.enhance.curves;if(!(a in r))return;let o=Rt(t),s=r[a];s.length===o.length&&s.every((n,u)=>Math.abs(n.x-o[u].x)<1e-5&&Math.abs(n.y-o[u].y)<1e-5)||(r[a]=o,this.curveCache.source=null,this.scheduleRender(),this.commit(e))}resetCurves(){this.state.enhance.curves=re(),this.curveCache.source=null,this.scheduleRender(),this.commit("reset-curves")}setHSL(a,t,e="hsl"){if(!Ft.includes(a))return;let r=this.state.enhance.hsl[a],o={hue:_(t.hue??r.hue,-100,100),saturation:_(t.saturation??r.saturation,-100,100),luminance:_(t.luminance??r.luminance,-100,100)};o.hue===r.hue&&o.saturation===r.saturation&&o.luminance===r.luminance||(this.state.enhance.hsl[a]=o,this.scheduleRender(),this.commit(e))}resetHSL(){this.state.enhance.hsl=Nt(),this.scheduleRender(),this.commit("reset-hsl")}setLUT(a,t){let e=Oe(a),r=t===void 0?this.state.enhance.lutStrength:_(t,0,100);this.state.enhance.lut===e.id&&this.state.enhance.lutStrength===r||(this.state.enhance.lut=e.id,this.state.enhance.lutStrength=r,this.scheduleRender(),this.commit("lut"))}setLUTStrength(a,t="lut-strength"){let e=_(a,0,100);this.state.enhance.lutStrength!==e&&(this.state.enhance.lutStrength=e,this.scheduleRender(),this.commit(t))}setEnhance(a,t="enhance"){let e=JSON.stringify(this.state.enhance),r=se({...this.state.enhance,...a,curves:{...this.state.enhance.curves,...a.curves||{}},hsl:{...this.state.enhance.hsl,...a.hsl||{}}});JSON.stringify(r)!==e&&(this.state.enhance=r,this.curveCache.source=null,this.scheduleRender(),this.commit(t))}resetEnhance(){this.state.enhance=se(null),this.curveCache.source=null,this.scheduleRender(),this.commit("reset-enhance")}setPreviewQuality(a){this.previewQuality=a==="high"?1:0,this.options.previewQuality=a,this.scheduleRender()}get colorSpace(){return this.colorMode}get dither(){return this.ditherEnabled}setColorSpace(a){this.options.colorSpace=a;let t=we(a,this.capabilities);this.ditherEnabled=Kt(this.options.dither,t,this.capabilities),t!==this.colorMode&&(this.colorMode=t,this.scheduleRender())}setDither(a){this.options.dither=a,this.ditherEnabled=Kt(a,this.colorMode,this.capabilities),this.scheduleRender()}setFaces(a){this.serverFaces=this.normalizeFaceBoxes(a),this.faceAnchors=[],this.anchorPack=null,this.faces=this.serverFaces.map(t=>({...t})),this.facePack=ye(this.faces),this.scheduleRender()}setFaceAnchors(a){if(!Array.isArray(a)||!a.length){this.faceAnchors=[],this.anchorPack=null,this.faces=this.serverFaces.map(e=>({...e})),this.facePack=ye(this.faces),this.scheduleRender();return}let t=za(a);t.count?(this.faceAnchors=a.slice(),this.faces=t.boxes.map(e=>({...e})),this.facePack={data:t.data,count:t.count},this.anchorPack=t.anchors):(this.faceAnchors=[],this.anchorPack=null,this.faces=this.serverFaces.map(e=>({...e})),this.facePack=ye(this.faces)),this.scheduleRender()}clearFaceAnchors(){this.setFaceAnchors(null)}normalizeFaceBoxes(a){return a.filter(t=>Number.isFinite(t.x)&&Number.isFinite(t.y)&&Number.isFinite(t.w)&&Number.isFinite(t.h)&&t.w>0&&t.h>0).map(t=>({x:_(t.x,0,1),y:_(t.y,0,1),w:_(t.w,0,1),h:_(t.h,0,1),confidence:Number.isFinite(t.confidence)?t.confidence:0}))}clearFaces(){this.serverFaces=[],this.faceAnchors=[],this.faces=[],this.facePack={data:new Float32Array(16),count:0},this.anchorPack=null,this.scheduleRender()}getFaces(){return this.faces.map(a=>({...a}))}hasFaceAnchors(){return this.faceAnchors.length>0}setBeautyMask(a){a&&(!Number.isFinite(a.width)||!Number.isFinite(a.height)||a.width<1||a.height<1||a.data.length!==a.width*a.height*4)||(this.beautyMask=a,this.scheduleRender())}getBeautyMask(){return this.beautyMask}addLiquifyDab(a,t="liquify"){if(!this.ready||!a||!Number.isFinite(a.x)||!Number.isFinite(a.y)||!Number.isFinite(a.dx)||!Number.isFinite(a.dy)||!Number.isFinite(a.radius)||Math.abs(a.dx)+Math.abs(a.dy)<1e-6)return;let e=this.state.retouch||(this.state.retouch=Xt());e.liquify.push({x:_(a.x,0,1),y:_(a.y,0,1),dx:_(a.dx,-.25,.25),dy:_(a.dy,-.25,.25),radius:_(a.radius,.002,.35)}),e.liquify.length>640&&e.liquify.splice(0,e.liquify.length-640),this.liquifyCache.source=null,this.scheduleRender(),this.commit(t||"liquify")}clearLiquify(a="liquify-clear"){let t=this.state.retouch?.liquify;!t||t.length===0||(this.state.retouch={liquify:[]},this.liquifyCache.source=null,this.scheduleRender(),this.commit(a))}getLiquify(){return(this.state.retouch?.liquify||[]).map(a=>({...a}))}hasLiquify(){return(this.state.retouch?.liquify.length||0)>0}async analyze(){let a=this.original||this.preview;if(!a)throw new Error("No image loaded");return Je(a,256,this.faces.length)}async autoEnhance(){let a=await this.analyze(),t=ta(a);return this.state.adjust=t.adjust,this.state.enhance.auto=!0,this.scheduleRender(),this.commit("auto"),this.emit("auto",t),t}cancelAI(){this.aiSeq+=1,this.aiController&&(this.aiController.abort(),this.aiController=null)}async runAI(a,t={}){let e=ia(a);if(!e)throw new Error(`AI adapter "${a}" is not registered`);if(!this.ready||!this.original)throw new Error("No image loaded");this.cancelAI();let r=new AbortController;this.aiController=r;let o=this.aiSeq,s=this.linkAbort(r,t.signal);try{let n=await e.load();if(o!==this.aiSeq)throw n.dispose(),Bt();let u=await ra(n,this.original,{...t,signal:s});if(o!==this.aiSeq)throw Bt();let l=this.original,c=this.preview,h=this.ownsOriginal,p=this.ownsPreview;this.original=u,this.ownsOriginal=!0,this.beautyMask=null;let v=await Ia(u,this.options.maxPreview);if(o!==this.aiSeq)throw v.owned&&v.bitmap instanceof ImageBitmap&&v.bitmap.close(),Bt();this.preview=v.bitmap,this.ownsPreview=v.owned,this.renderer.setBitmap(v.bitmap),this.disposeAIBefore(),l&&c?this.aiBefore={original:l,preview:c,ownsOriginal:h,ownsPreview:p,state:nt(this.state),history:this.history}:h&&l instanceof ImageBitmap&&l.close(),this.state.transform=ae(),this.state.crop={...ie(),ratio:u.width/u.height},this.lastViewport={width:0,height:0},this.lastFrame={x:0,y:0,width:0,height:0},this.curveCache.source=null,this.ensureCoverage(),this.history=new Yt(this.options.maxHistory),this.history.reset(this.state),this.resize(),this.fitToFrame(),this.renderNow(),this.emit("ready",Pt(u)),this.emitState(),this.emitHistory()}catch(n){if(!ut(n))throw n}finally{this.aiController===r&&(this.aiController=null)}}canRevertAI(){return this.aiBefore!==null}setCompareAI(a){let t=this.aiBefore;if(!t||!this.ready)return;let e=a?t.preview:this.preview;e&&(this.renderer.setBitmap(e),this.renderNow())}revertAI(){let a=this.aiBefore;return a?(this.ownsOriginal&&this.original instanceof ImageBitmap&&this.original.close(),this.ownsPreview&&this.preview instanceof ImageBitmap&&this.preview!==this.original&&this.preview.close(),this.original=a.original,this.preview=a.preview,this.ownsOriginal=a.ownsOriginal,this.ownsPreview=a.ownsPreview,this.beautyMask=null,this.state=a.state,this.history=a.history,this.aiBefore=null,this.curveCache.source=null,this.renderer.setBitmap(a.preview),this.lastViewport={width:0,height:0},this.lastFrame={x:0,y:0,width:0,height:0},this.resize(),this.fitToFrame(),this.renderNow(),this.emit("ready",Pt(a.original)),this.emitState(),this.emitHistory(),!0):!1}disposeAIBefore(){let a=this.aiBefore;a&&(this.aiBefore=null,a.ownsOriginal&&a.original instanceof ImageBitmap&&a.original.close(),a.ownsPreview&&a.preview instanceof ImageBitmap&&a.preview!==a.original&&a.preview.close())}linkAbort(a,t){return t?t.aborted?(a.abort(),a.signal):(t.addEventListener("abort",()=>a.abort(),{once:!0}),a.signal):a.signal}enhanceSpec(a){let t=this.state.enhance;this.curveCache.source!==t.curves&&(this.curveCache.source=t.curves,this.curveCache.data=je(t.curves));let e=this.lutCache.get(t.lut);e===void 0&&(e=Ke(t.lut),this.lutCache.set(t.lut,e));let r=this.state.retouch?.liquify,o=null;if(r&&r.length){let s=this.source(),n=this.liquifyCache;(n.source!==r||n.width!==s.width||n.height!==s.height)&&(this.liquifyCache={source:r,width:s.width,height:s.height,field:Te(r,s.width,s.height)}),o=this.liquifyCache.field}return Ba({adjust:this.state.adjust,enhance:t,curve:this.curveCache.data,lut:e,faces:this.facePack,quality:a,linear:this.colorMode==="linear",dither:this.ditherEnabled?1:0,mask:this.beautyMask,liquify:o,anchors:this.anchorPack})}setAspect(a){let t=this.currentFrame();this.state.crop.aspect===a&&a!=="free"||(a==="free"?this.state.crop.ratio=t.width/Math.max(1,t.height):this.state.crop.scale=1,this.state.crop.aspect=a,this.ensureCoverage(),this.scheduleRender(),this.commit("aspect"))}setCrop(a,t="crop"){let e=this.state.crop;a.ratio!==void 0&&Number.isFinite(a.ratio)&&(e.ratio=_(a.ratio,.2,8)),a.scale!==void 0&&Number.isFinite(a.scale)&&(e.scale=_(a.scale,.2,1)),a.aspect!==void 0&&Le(a.aspect)&&(e.aspect=a.aspect),this.ensureCoverage(),this.scheduleRender(),this.commit(t)}setRotation(a,t="rotation"){if(!Number.isFinite(a))return;let e=((a+180)%360+360)%360-180;Math.abs(e-this.state.transform.rotation)<.01||(this.state.transform.rotation=e,this.ensureCoverage(),this.scheduleRender(),this.commit(t))}rotateBy(a){if(!Number.isFinite(a)||a===0)return;let t=a/90;if(Number.isInteger(t)){this.state.transform.turn=((this.state.transform.turn+t)%4+4)%4,this.state.crop.aspect==="free"&&Math.abs(t)%2===1?(this.state.crop.ratio=_(1/this.state.crop.ratio,.2,8),this.fitToFrame()):(this.ensureCoverage(),this.scheduleRender()),this.commit(`turn:${Date.now()}`);return}this.setRotation(this.state.transform.rotation+a,`rotate:${Date.now()}`)}resetRotation(){let a=this.state.transform;a.turn===0&&a.rotation===0||(a.turn=0,a.rotation=0,this.ensureCoverage(),this.scheduleRender(),this.commit("reset-rotation"))}flip(a){a==="h"?this.state.transform.flipH=!this.state.transform.flipH:this.state.transform.flipV=!this.state.transform.flipV,this.ensureCoverage(),this.scheduleRender(),this.commit(`flip:${a}`)}resetCrop(){let a=this.source();this.state.transform={zoom:.2,turn:0,rotation:0,flipH:!1,flipV:!1,offsetX:0,offsetY:0,perspectiveX:0,perspectiveY:0},this.state.crop={aspect:"free",ratio:a.width/Math.max(1,a.height),scale:1},this.ensureCoverage(),this.scheduleRender(),this.commit("reset-crop")}setPerspective(a,t="perspective"){let e=this.state.transform,r=_(a.perspectiveX??e.perspectiveX,-100,100),o=_(a.perspectiveY??e.perspectiveY,-100,100);if(r===e.perspectiveX&&o===e.perspectiveY)return;let s=this.viewport(),n=this.source();if(this.ready&&s.width>=8&&s.height>=8){let l=dt(s,this.state.crop),c=bt(s,n.width,n.height,e,l),h=c>0?e.zoom/c:1;e.perspectiveX=r,e.perspectiveY=o;let p=bt(s,n.width,n.height,e,l);e.zoom=_(h*p,p,this.maxZoom);let v=ft(s,n.width,n.height,e,l);e.offsetX=v.x,e.offsetY=v.y}else e.perspectiveX=r,e.perspectiveY=o;this.scheduleRender(),this.commit(t)}resetPerspective(){this.state.transform.perspectiveX===0&&this.state.transform.perspectiveY===0||this.setPerspective({perspectiveX:0,perspectiveY:0},"reset-perspective")}reset(){let a=this.source();this.state=Et(),this.state.crop.ratio=a.width/Math.max(1,a.height),this.state.transform.zoom=.2,this.ensureCoverage(),this.scheduleRender(),this.commit("reset")}applyHistoryState(a){let t=this.state,e=t.transform.turn===a.transform.turn&&t.transform.rotation===a.transform.rotation&&t.transform.flipH===a.transform.flipH&&t.transform.flipV===a.transform.flipV&&t.transform.perspectiveX===a.transform.perspectiveX&&t.transform.perspectiveY===a.transform.perspectiveY&&t.crop.aspect===a.crop.aspect&&t.crop.ratio===a.crop.ratio&&t.crop.scale===a.crop.scale&&Math.abs(t.transform.zoom-a.transform.zoom)<1e-4&&Math.abs(t.transform.offsetX-a.transform.offsetX)<1e-4&&Math.abs(t.transform.offsetY-a.transform.offsetY)<1e-4;if(this.state=a,e)this.state.transform.zoom=t.transform.zoom,this.state.transform.offsetX=t.transform.offsetX,this.state.transform.offsetY=t.transform.offsetY;else if(this.state.transform.zoom=_(a.transform.zoom,.2,this.maxZoom),this.ready){let r=this.viewport();if(r.width>=8&&r.height>=8){let o=this.source(),s=dt(r,this.state.crop),n=ft(r,o.width,o.height,this.state.transform,s);this.state.transform.offsetX=n.x,this.state.transform.offsetY=n.y}}if(this.ready){let r=this.viewport();if(r.width<8||r.height<8)return;let o=this.source();if(o.width<2||o.height<2)return;let s=dt(r,this.state.crop),n=bt(r,o.width,o.height,this.state.transform,s);if(this.state.transform.zoom<n-.001){this.state.transform.zoom=_(n,.2,this.maxZoom);let u=ft(r,o.width,o.height,this.state.transform,s);this.state.transform.offsetX=u.x,this.state.transform.offsetY=u.y}this.lastViewport=r}}undo(){if(this.aiBefore&&!this.history.canUndo)return this.revertAI();let a=this.history.undo();return a?(this.applyHistoryState(a),this.scheduleRender(),this.emitState(),this.emitHistory(),!0):!1}redo(){let a=this.history.redo();return a?(this.applyHistoryState(a),this.scheduleRender(),this.emitState(),this.emitHistory(),!0):!1}canUndo(){return this.history.canUndo||this.aiBefore!==null}canRedo(){return this.history.canRedo}setResultMode(a){this.resultMode!==a&&(this.resultMode=a,this.cancelAnimation(),this.gesture.setEnabled(!a),this.scheduleRender())}get isResultMode(){return this.resultMode}getExportSize(){if(!this.ready)return{width:0,height:0};let a=this.viewport();if(a.width<8||a.height<8)return{width:0,height:0};let t=this.source(),e=this.currentFrame(),r=ze(ue(a,t.width,t.height,{...this.state.transform,perspectiveX:0,perspectiveY:0},e)),o=this.exportScale(r.width,r.height);return{width:Math.max(1,Math.round(r.width*o)),height:Math.max(1,Math.round(r.height*o))}}exportScale(a,t){let e=Math.max(1,a,t),r=Math.max(1,a*t);return Math.min(1,this.options.maxExport/e,Math.sqrt(this.options.maxPixels/r))}async export(a={}){if(!this.ready||!this.original)throw new Error("No image loaded");let t=a.type||"image/jpeg",e=_(Number.isFinite(a.quality)?a.quality:.92,.05,1),r=this.viewport(),o=this.source(),s=this.currentFrame(),n=ue(r,o.width,o.height,this.state.transform,s),u=ze(ue(r,o.width,o.height,{...this.state.transform,perspectiveX:0,perspectiveY:0},s)),l=this.exportScale(u.width,u.height),c=Math.max(1,Math.round(u.width*l)),h=Math.max(1,Math.round(u.height*l)),p=await Ta(this.original,{width:c,height:h,quad:n,warp:rt(this.state.transform),srcWidth:o.width,srcHeight:o.height,color:wt(this.state.filter).color,css:Qe(this.state.adjust,this.state.filter),vignette:$e(this.state.adjust),enhance:this.enhanceSpec(1),texel:[1/Math.max(1,o.width),1/Math.max(1,o.height)]},t,e,a);if(p.type!==t)throw new Error(`This browser cannot encode ${t}. Choose JPEG or PNG.`);return this.emit("export",{blob:p}),p}async toDataURL(a={}){let t=await this.export(a);return new Promise((e,r)=>{let o=new FileReader;o.onload=()=>e(String(o.result)),o.onerror=()=>r(o.error||new Error("Could not encode the image")),o.readAsDataURL(t)})}async toFile(a="aurum-edited.jpg",t={}){let e=await this.export(t),r=e.type||t.type||"image/jpeg";return new File([e],a,{type:r})}async getImageData(a={}){let t=await this.export({type:"image/png",...a});if(typeof createImageBitmap!="function")throw new Error("createImageBitmap is unavailable");let e=await createImageBitmap(t),r=document.createElement("canvas");r.width=e.width,r.height=e.height;let o=r.getContext("2d",{willReadFrequently:!0});if(!o)throw new Error("2D canvas is unavailable");o.drawImage(e,0,0);let s=o.getImageData(0,0,r.width,r.height);return e.close(),s}applyTransform(a){this.cancelAnimation(),Object.assign(this.state.transform,a),this.scheduleRender()}settle(a,t=420){this.cancelAnimation();let e=performance.now(),r={zoom:a.zoom??this.state.transform.zoom,offsetX:a.offsetX??this.state.transform.offsetX,offsetY:a.offsetY??this.state.transform.offsetY},o=++this.animationSeq;this.animation={id:o,target:r,velocity:{zoom:0,offsetX:0,offsetY:0},last:e,duration:t,started:e,commit:!0};let s=n=>{if(!this.animation||this.animation.id!==o)return;let u=Math.min(.04,Math.max(.001,(n-this.animation.last)/1e3));this.animation.last=n;let l=this.state.transform,c=(p,v,f)=>{let m=this.animation.velocity[f],g=(v-p)*220-m*26,y=m+g*u;return this.animation.velocity[f]=y,p+y*u};if(l.zoom=c(l.zoom,this.animation.target.zoom,"zoom"),l.offsetX=c(l.offsetX,this.animation.target.offsetX,"offsetX"),l.offsetY=c(l.offsetY,this.animation.target.offsetY,"offsetY"),Math.abs(l.zoom-this.animation.target.zoom)<8e-4&&Math.abs(l.offsetX-this.animation.target.offsetX)<4e-4&&Math.abs(l.offsetY-this.animation.target.offsetY)<4e-4||n-this.animation.started>this.animation.duration){l.zoom=this.animation.target.zoom,l.offsetX=this.animation.target.offsetX,l.offsetY=this.animation.target.offsetY,this.animation=null,this.scheduleRender(),this.commit("transform");return}this.scheduleRender(),requestAnimationFrame(s)};requestAnimationFrame(s)}cancelAnimation(){this.animation&&(this.animation=null)}fitToFrame(){if(!this.ready)return;let a=this.viewport();if(a.width<8||a.height<8)return;let t=this.source(),e=dt(a,this.state.crop);this.state.transform.zoom=bt(a,t.width,t.height,this.state.transform,e),this.state.transform.offsetX=0,this.state.transform.offsetY=0,this.ensureCoverage(),this.scheduleRender()}ensureCoverage(){if(!this.ready)return;let a=this.viewport();if(a.width<8||a.height<8)return;let t=this.source(),e=dt(a,this.state.crop),r=bt(a,t.width,t.height,this.state.transform,e);this.state.transform.zoom=_(this.state.transform.zoom,r,this.maxZoom);let o=ft(a,t.width,t.height,this.state.transform,e);this.state.transform.offsetX=o.x,this.state.transform.offsetY=o.y,this.lastViewport=a}commit(a=""){this.commitKey=a,this.history.push(this.state,a),this.emitState(),this.emitHistory()}emitState(){this.emit("change",this.getState())}emitHistory(){this.emit("history",{canUndo:this.history.canUndo,canRedo:this.history.canRedo})}syncViewport(a){if(!this.ready){this.lastViewport=a;return}if(a.width<8||a.height<8)return;let t=this.lastViewport;t.width===a.width&&t.height===a.height||(this.preserveCropOnResize(t,a),this.ensureCoverage(),this.lastViewport=a)}preserveCropOnResize(a,t){if(a.width<8||a.height<8||t.width<8||t.height<8)return;let e=dt(a,this.state.crop),r=dt(t,this.state.crop);if(e.width<1||r.width<1)return;let o=this.source();if(o.width<2||o.height<2)return;let s=Math.max(a.width/o.width,a.height/o.height)||1,n=Math.max(t.width/o.width,t.height/o.height)||1,u=r.width/e.width;this.state.transform.zoom=_(this.state.transform.zoom*u*(s/n),.2,this.maxZoom)}scheduleRender(){this.renderPending||this.destroyed||(this.renderPending=!0,this.raf=requestAnimationFrame(()=>{this.renderPending=!1,this.renderNow()}))}renderNow(){if(!this.ready||!this.preview)return;let a=this.viewport();this.syncViewport(a);let t=this.source(),e=this.state.transform,r=this.currentFrame();this.lastFrame=r;let o=it(a,t.width,t.height,e),s={scale:1,x:0,y:0},n=r,u=null;if(this.resultMode&&r.width>1&&r.height>1){let c=Math.min(a.width/r.width,a.height/r.height),h=(a.width-r.width*c)/2-r.x*c,p=(a.height-r.height*c)/2-r.y*c;s={scale:c,x:h,y:p},n={x:r.x*c+h,y:r.y*c+p,width:r.width*c,height:r.height*c},u=n}this.renderer.resize(a.width,a.height,this.dpr);let l=this.preview?Pt(this.preview):t;this.renderer.render({width:a.width,height:a.height,srcWidth:t.width,srcHeight:t.height,sx:o.sx,sy:o.sy,rotation:Gt(e),offsetX:e.offsetX,offsetY:e.offsetY,warp:rt(e),view:s,vignetteRect:n,clipRect:u,color:wt(this.state.filter).color,css:Qe(this.state.adjust,this.state.filter),vignette:$e(this.state.adjust),enhance:this.enhanceSpec(this.previewQuality),texel:[1/Math.max(1,l.width),1/Math.max(1,l.height)],dpr:this.dpr}),this.lastViewport=a,this.emit("render",{frame:r})}destroy(){this.destroyed||(this.destroyed=!0,this.cancelAI(),this.cancelAnimation(),cancelAnimationFrame(this.raf),this.gesture.destroy(),this.resizeObserver?.disconnect(),this.resizeObserver=null,window.removeEventListener("resize",this.resize),this.releaseBitmaps(),this.renderer.dispose(),this.stage.remove(),this.listeners.clear())}};var Da=`.au-root{
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
.au-quick-chip--icon{display:inline-flex;align-items:center;gap:6px}
.au-quick-chip--icon svg{width:14px;height:14px}
.au-quick-chip--icon.is-active{background:linear-gradient(180deg,#f9d693,#e2ad52);color:#2a1c06;border-color:rgba(255,235,190,.6)}
.au-root.au-text-placing .au-canvas{cursor:copy}
.au-text-arrange{display:flex;align-items:center;gap:8px;margin-top:4px}
.au-align-seg{grid-template-columns:repeat(3,1fr)!important;flex:1 1 auto;margin:0}
.au-textnode .au-text-hud{position:absolute;inset:-6px;border:1px dashed rgba(243,199,123,.7);border-radius:10px;pointer-events:none;opacity:0}
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
.au-ai-pane__list--row{flex-direction:row;overflow-x:auto;scroll-snap-type:x proximity;padding:2px 0 4px;scrollbar-width:none;gap:8px}
.au-ai-pane__list--row::-webkit-scrollbar{display:none}
.au-ai-pill{flex:0 0 auto;display:flex;flex-direction:column;align-items:center;gap:5px;min-width:74px;min-height:58px;padding:9px 10px;border-radius:13px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.09);scroll-snap-align:start;transition:transform .12s ease,border-color .15s ease,background .15s ease}
.au-ai-pill svg{width:20px;height:20px;color:#d8d5df}
.au-ai-pill span{font-size:10.5px;font-weight:650;color:#e8e4db;white-space:nowrap}
.au-ai-pill:active{transform:scale(.96)}
.au-ai-pill.is-primary{border-color:rgba(243,199,123,.4);background:rgba(243,199,123,.09)}
.au-ai-pill.is-primary svg{color:var(--au-gold)}
.au-ai-pill.is-primary span{color:var(--au-gold)}
.au-ai-pane__note{color:var(--au-muted);font-size:10.5px;line-height:1.4;padding:4px 2px}
.au-bg-panel{z-index:70}

`;var Pa=Da,sa=!1;function na(){if(sa||typeof document>"u")return;if(document.querySelector("style[data-aurum],link[data-aurum]")){sa=!0;return}let i=document.createElement("style");i.setAttribute("data-aurum",""),i.textContent=Pa,document.head.appendChild(i),sa=!0}var Qi={close:'<path d="M6 6l12 12M18 6L6 18"/>',undo:'<path d="M9 14 4.5 9.5 9 5"/><path d="M4.5 9.5H14a5.5 5.5 0 0 1 0 11H9.5"/>',redo:'<path d="M15 14l4.5-4.5L15 5"/><path d="M19.5 9.5H10a5.5 5.5 0 0 0 0 11h4.5"/>',crop:'<path d="M6 2.5v14A1.5 1.5 0 0 0 7.5 18h14"/><path d="M2.5 6h14A1.5 1.5 0 0 1 18 7.5v14"/>',perspective:'<path d="M5 5h14l-2.1 14H7.1L5 5Z"/><path d="M9.5 12h5M12 9.5v5"/>',tiltY:'<path d="M12 3.4v17.2"/><path d="m8.2 7.2 3.8-3.8 3.8 3.8"/><path d="m8.2 16.8 3.8 3.8 3.8-3.8"/>',tiltX:'<path d="M3.4 12h17.2"/><path d="m7.2 8.2-3.8 3.8 3.8 3.8"/><path d="m16.8 8.2 3.8 3.8-3.8 3.8"/>',adjust:'<path d="M4 6h7M15 6h5M4 12h3M11 12h9M4 18h9M17 18h3"/><circle cx="13" cy="6" r="1.9"/><circle cx="9" cy="12" r="1.9"/><circle cx="15" cy="18" r="1.9"/>',filter:'<circle cx="9.2" cy="9.2" r="5.7"/><circle cx="14.8" cy="9.2" r="5.7"/><circle cx="12" cy="14.4" r="5.7"/>',rotateLeft:'<path d="M4.2 10.2a8 8 0 1 1 2.2 6.9"/><path d="M4 4.5v6h6"/>',rotateRight:'<path d="M19.8 10.2a8 8 0 1 0-2.2 6.9"/><path d="M20 4.5v6h-6"/>',flipH:'<path d="M12 3v18" stroke-dasharray="2 3"/><path d="M9 6 4 12l5 6V6Z"/><path d="M15 6l5 6-5 6V6Z"/>',flipV:'<path d="M3 12h18" stroke-dasharray="2 3"/><path d="M6 9l6-5 6 5H6Z"/><path d="M6 15l6 5 6-5H6Z"/>',image:'<rect x="3" y="3" width="18" height="18" rx="4.5"/><circle cx="8.6" cy="8.6" r="1.4"/><path d="m21 15-5-5L5 21"/>',download:'<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v2.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V17"/>',save:'<path d="M5 3.5h11l3 3V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 3 19V5a1.5 1.5 0 0 1 1.5-1.5Z"/><path d="M7.5 3.5v6h8v-6"/><path d="M7.5 20.5v-6h9v6"/>',copy:'<rect x="8" y="8" width="12.5" height="12.5" rx="2.4"/><path d="M16 8V5.5A2.5 2.5 0 0 0 13.5 3h-8A2.5 2.5 0 0 0 3 5.5v8A2.5 2.5 0 0 0 5.5 16H8"/>',auto:'<path d="M12 3.2l1.55 4.25L17.8 9l-4.25 1.55L12 14.8l-1.55-4.25L6.2 9l4.25-1.55L12 3.2Z"/><path d="M18.4 14.4l.72 1.98 1.98.72-1.98.72-.72 1.98-.72-1.98-1.98-.72 1.98-.72.72-1.98Z"/><path d="M5.4 14.8l.55 1.5 1.5.55-1.5.55-.55 1.5-.55-1.5-1.5-.55 1.5-.55.55-1.5Z"/>',ai:'<path d="M12 2.8l2.05 5.15L19.2 10l-5.15 2.05L12 17.2l-2.05-5.15L4.8 10l5.15-2.05L12 2.8Z"/><path d="M18.6 15.4v3.2M17 17h3.2"/><path d="M5.4 4.2v2.4M4.2 5.4h2.4"/>',wand:'<path d="M5 19.2 15.4 8.8"/><path d="M14.5 3.5l1.7 1.7M17.2 6.2l1.7 1.7M19 3.5l.9.9M14.5 3.5l.9-.9M19 3.5l.9 1.7M18.5 13.5l1.2 1.2M18.1 10.2l1.9.5M13.2 4.1l.4 2.1M9.8 3.2l.4 2.1M5.5 5.5l1.7 1.7"/>',brush:'<path d="M16.5 3.5l4 4L11 17 6.5 17.8 7 13.2 16.5 3.5Z"/><path d="M6.5 17.8l1.7 1.7"/><path d="M12.5 13.5l-1.5 1.5"/>',eraser:'<path d="M6 13.5 13.5 6l4.5 4.5L12.5 16 6 13.5Z"/><path d="M6 13.5v4.5h3"/>',magic:'<path d="M12 2.8l2.05 5.15L19.2 10l-5.15 2.05L12 17.2l-2.05-5.15L4.8 10l5.15-2.05L12 2.8Z"/><circle cx="12" cy="10" r="2.3"/>',layers:'<path d="M12 3.5 21 8.5l-9 5-9-5 9-5Z"/><path d="M3 12.5l9 5 9-5"/>',contrast:'<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17Z" fill="currentColor" stroke="none"/>',slider:'<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',liquify:'<path d="M3.5 15.8c3.4-7.2 7.9 5.6 11.5-.9 1.4-2.5 3.3-3.1 5.5-1.8"/><path d="M3.5 9.6c3.4-7.2 7.9 5.6 11.5-.9 1.4-2.5 3.3-3.1 5.5-1.8"/>',reset:'<path d="M20 12a8 8 0 1 1-2.35-5.65"/><path d="M20 4.5V10h-5.5"/>',check:'<path d="m5 12 4.5 4.5L19 7"/>',alert:'<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><circle cx="12" cy="16.5" r=".9" fill="currentColor" stroke="none"/>',text:'<path d="M5 6h14M12 6v13.2"/><path d="M9.5 19.2h5"/>',bg:'<path d="M12 12a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"/><path d="M6.5 19.2c.6-2.3 2.8-3.6 5.5-3.6s4.9 1.3 5.5 3.6"/>',bookmark:'<path d="M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v15l-6.5-4.2L5.5 20V5A1.5 1.5 0 0 1 7 3.5Z"/>',trash:'<path d="M4 6.5h16"/><path d="M9 6V4.8A1.3 1.3 0 0 1 10.3 3.5h3.4A1.3 1.3 0 0 1 15 4.8V6"/><path d="M6.5 6.5 7.3 19a1.6 1.6 0 0 0 1.6 1.5h6.2a1.6 1.6 0 0 0 1.6-1.5l.8-12.5"/><path d="M10 10.5v6M14 10.5v6"/>',plus:'<path d="M12 5.5v13M5.5 12h13"/>',duplicate:'<rect x="8.5" y="8.5" width="12" height="12" rx="2.3"/><path d="M15.5 8.5v-3A2.5 2.5 0 0 0 13 3H6a2.5 2.5 0 0 0-2.5 2.5v7A2.5 2.5 0 0 0 6 15h2.5"/>'};function H(i){return`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Qi[i]}</svg>`}var Zi={vi:{title:"Chỉnh ảnh",undo:"Hoàn tác",redo:"Làm lại",save:"Lưu",cancel:"Hủy",cancelled:"Đã hủy thay đổi",emptyTitle:"Chỉnh ảnh của bạn",emptyHint:"Kéo ảnh vào đây hoặc chọn từ thiết bị. Hỗ trợ JPEG, PNG, WebP.",openImage:"Mở ảnh",tabCrop:"Cắt",tabAdjust:"Tinh chỉnh",tabFilter:"Bộ lọc",aspect:"Tỷ lệ khung",ratioLabel:"Tỷ lệ",aspectFree:"Tự do",aspectScreen:"Màn hình",rotateLeft:"Xoay trái",rotateRight:"Xoay phải",flipH:"Lật ngang",flipV:"Lật dọc",rotation:"Góc xoay",reset:"Đặt lại",adjustTitle:"Tinh chỉnh",brightness:"Độ sáng",contrast:"Độ tương phản",saturation:"Độ bão hòa",exposure:"Phơi sáng",warmth:"Độ ấm",vignette:"Mờ góc",highlights:"Vùng sáng",shadows:"Vùng tối",whites:"Điểm trắng",blacks:"Điểm đen",tint:"Sắc thái màu",vibrance:"Độ sống động",gamma:"Gamma",clarity:"Độ rõ nét",sharpen:"Làm nét",denoise:"Khử nhiễu",smoothSkin:"Làm mịn da",blemish:"Xóa mụn / đốm",skinTexture:"Giữ chi tiết da",skinTone:"Tông da",faceSlim:"Thon gọng mặt",jawline:"Hàm",chin:"Cằm",eyeSize:"Mắt",noseSize:"Mũi",mouthSize:"Miệng",liquify:"Bóp méo",liquifyTitle:"Bóp méo vùng ảnh bằng cọ",brushSize:"Cỡ cọ",clearLiquify:"Xóa bóp méo",brightnessShort:"Sáng",contrastShort:"Tương phản",saturationShort:"Bão hòa",exposureShort:"Phơi sáng",warmthShort:"Ấm",vignetteShort:"Mờ góc",highlightsShort:"Vùng sáng",shadowsShort:"Vùng tối",whitesShort:"Trắng",blacksShort:"Đen",tintShort:"Sắc thái",vibranceShort:"Sống động",gammaShort:"Gamma",clarityShort:"Rõ nét",sharpenShort:"Nét",denoiseShort:"Khử nhiễu",smoothSkinShort:"Mịn da",blemishShort:"Xóa mụn",skinTextureShort:"Chi tiết",skinToneShort:"Tông da",faceSlimShort:"Thon mặt",jawlineShort:"Hàm",chinShort:"Cằm",eyeSizeShort:"Mắt",noseSizeShort:"Mũi",mouthSizeShort:"Miệng",groupLight:"Ánh sáng",groupColor:"Màu",groupDetail:"Chi tiết",groupPortrait:"Chân dung",groupShape:"Dáng mặt",groupEffect:"Hiệu ứng",auto:"Tự động",autoTitle:"Tự động tối ưu ảnh",autoRunning:"Đang phân tích…",autoDone:"Đã tối ưu tự động",autoFailed:"Không thể tối ưu tự động",ai:"AI 4×",aiTitle:"Phóng to và làm nét bằng AI (Real-ESRGAN)",aiRunning:"Đang chạy AI…",aiDone:"Đã làm nét bằng AI",aiFailed:"Không thể chạy AI",aiCancelled:"Đã hủy AI",aiCancel:"Hủy AI",aiPreparing:"Đang kiểm tra thiết bị…",aiTiles:"Đang xử lý từng vùng ảnh…",aiCompare:"Giữ để so sánh",aiBefore:"Bản trước AI",aiUndo:"Hoàn tác AI",aiUndoConfirm:"Hoàn tác AI sẽ bỏ các chỉnh sửa sau đó. Tiếp tục?",aiReverted:"Đã hoàn tác AI",filterTitle:"Bộ lọc màu",cropFrame:"Khung cắt",cropKeys:"Dùng phím mũi tên để đổi kích thước, giữ Shift để đổi nhanh.",perspective:"Phối cảnh",tiltVertical:"Trên / dưới",tiltHorizontal:"Trái / phải",perspectiveHint:"Kéo thanh để chỉnh độ nghiêng. Nhấn đúp vào thanh để đặt lại.",resetCrop:"Đặt lại khung cắt",resetRotation:"Đặt lại góc xoay",resetPerspective:"Đặt lại phối cảnh",resetPerspectiveY:"Đặt lại nghiêng trên / dưới",resetPerspectiveX:"Đặt lại nghiêng trái / phải",resetFilter:"Đặt lại bộ lọc",exportTitle:"Lưu ảnh",exportSub:"Kết xuất từ file gốc ở độ phân giải đầy đủ.",format:"Định dạng",quality:"Chất lượng",saveImage:"Lưu ảnh",overwrite:"Lưu đè",saveCopy:"Lưu bản sao",saving:"Đang lưu…",rendering:"Đang kết xuất ảnh…",encoding:"Đang mã hóa ảnh…",uploading:"Đang tải lên…",cancelExport:"Hủy xuất ảnh",exportCancelled:"Đã hủy xuất ảnh",saved:"Đã lưu ảnh",savedCopy:"Đã lưu bản sao",exportFailed:"Không thể xuất ảnh",notImage:"Tệp này không phải là ảnh",tabText:"Chữ",tabAi:"AI",catAll:"Tất cả",catRoot:"Chuẩn",catMeitu:"Meitu",catXingtu:"Xingtu",catLr:"Lightroom",catMono:"Đen trắng",savePreset:"Lưu bộ lọc",presetName:"Tên bộ lọc…",savedPresets:"Đã lưu",noSaved:"Chưa có bộ lọc đã lưu. Tuỳ chỉnh màu rồi bấm Lưu.",apply:"Áp dụng",deletePreset:"Xoá",presetSaved:"Đã lưu bộ lọc",presetApplied:"Đã áp dụng bộ lọc",presetDeleted:"Đã xoá bộ lọc",presetExists:"Tên này đã có — chọn tên khác",textTitle:"Thêm chữ lên ảnh",addText:"Thêm chữ",textInput:"Nội dung chữ…",fontSize:"Cỡ chữ",textOpacity:"Độ mờ",textRotate:"Xoay",bold:"Đậm",italic:"Nghiêng",outline:"Viền",shadow:"Bóng đổ",textColor:"Màu chữ",tapTextHint:"Chạm vào chữ trên ảnh để kéo • Kéo 2 tay không có — dùng thanh trượt",deleteText:"Xoá chữ",duplicateText:"Nhân đôi",bgTitle:"AI tách nền",bgSub:"Chạy offline trên máy. Model tải 1 lần (kiểm tra SHA-256), inference không dùng mạng.",bgRemove:"Xoá phông (trong suốt)",bgBlur:"Mờ phông",bgReplace:"Đổi nền trắng",bgPerson:"Tách người (MODNet)",bgRemoveShort:"Xoá phông",bgBlurShort:"Mờ phông",bgReplaceShort:"Nền trắng",bgPersonShort:"Tách người",bgNeedHost:"Bản dựng này chưa bật AI tách nền. Mở demo/ai-panel.html để thử engine offline-first.",bgRunning:"Đang tách nền…",bgDone:"Đã tách nền — cảnh báo: lịch sử chỉnh sửa được đặt lại.",bgFailed:"Chưa tách được nền",tuneTitle:"Tùy chỉnh tone",tuneHint:"Chọn tone, kéo slider để tinh chỉnh rồi Lưu.",collapse:"Thu gọn",expand:"Mở rộng",tuneStrength:"Độ đậm",tuneBright:"Sáng",tuneContrast:"Tương phản",tuneSat:"Bão hòa",tuneWarm:"Ấm",tuneTint:"Sắc thái",tuneVig:"Mờ góc",tuneReset:"Reset tone",modelLabel:"Model",modelFast:"MODNet · Nhanh",modelBalanced:"BiRefNet · Cân bằng",modelQuality:"ISNet · Chất lượng",modelRecommended:"Khuyến nghị",modelDetailFast:"13 MB · Tách người · iPhone siêu nhẹ",modelDetailBalanced:"98 MB · Đa dụng · Chân dung + vật",modelDetailQuality:"88 MB · Tốt nhất · Edge tóc mịn",brushLabel:"Cọ",brushAdd:"Giữ (thêm)",brushErase:"Xoá",brushSizeMask:"Kích thước cọ",brushUndo:"Hoàn tác nét",brushApply:"Hoàn tất",brushCancel:"Huỷ",brushHint:"Chạm kéo trên ảnh để chỉnh viền. Thêm = giữ chủ thể, Xoá = bỏ nền.",textPinch:"Chụm 2 ngón để co giãn · Xoay bằng ngón xoay",textDoubleTap:"Chạm đúp vào chữ để sửa",textStyleTitle:"Kiểu chữ",textStyleTitle2:"Chữ đậm",textStyleCaption:"Chú thích",textStyleOutline:"Viền nổi",textQuick:"Mẫu nhanh",textArrange:"Căn chỉnh",textAlignLeft:"Trái",textAlignCenter:"Giữa",textAlignRight:"Phải"},en:{title:"Edit photo",undo:"Undo",redo:"Redo",save:"Save",cancel:"Cancel",cancelled:"Changes discarded",emptyTitle:"Edit your photo",emptyHint:"Drop an image here or choose one from your device. JPEG, PNG and WebP are supported.",openImage:"Open image",tabCrop:"Crop",tabAdjust:"Adjust",tabFilter:"Filters",aspect:"Aspect ratio",ratioLabel:"Ratio",aspectFree:"Free",aspectScreen:"Screen",rotateLeft:"Rotate left",rotateRight:"Rotate right",flipH:"Flip H",flipV:"Flip V",rotation:"Rotation",reset:"Reset",adjustTitle:"Adjust",brightness:"Brightness",contrast:"Contrast",saturation:"Saturation",exposure:"Exposure",warmth:"Warmth",vignette:"Vignette",highlights:"Highlights",shadows:"Shadows",whites:"Whites",blacks:"Blacks",tint:"Tint",vibrance:"Vibrance",gamma:"Gamma",clarity:"Clarity",sharpen:"Sharpen",denoise:"Denoise",smoothSkin:"Skin smoothing",blemish:"Blemish removal",skinTexture:"Skin texture",skinTone:"Skin tone",faceSlim:"Face slim",jawline:"Jawline",chin:"Chin",eyeSize:"Eyes",noseSize:"Nose",mouthSize:"Mouth",liquify:"Liquify",liquifyTitle:"Push pixels with a brush",brushSize:"Brush size",clearLiquify:"Clear liquify",brightnessShort:"Bright",contrastShort:"Contrast",saturationShort:"Color",exposureShort:"Exposure",warmthShort:"Warmth",vignetteShort:"Vignette",highlightsShort:"Highlights",shadowsShort:"Shadows",whitesShort:"Whites",blacksShort:"Blacks",tintShort:"Tint",vibranceShort:"Vibrance",gammaShort:"Gamma",clarityShort:"Clarity",sharpenShort:"Sharpen",denoiseShort:"Denoise",smoothSkinShort:"Smooth skin",blemishShort:"Blemish",skinTextureShort:"Texture",skinToneShort:"Skin tone",faceSlimShort:"Face",jawlineShort:"Jaw",chinShort:"Chin",eyeSizeShort:"Eyes",noseSizeShort:"Nose",mouthSizeShort:"Mouth",groupLight:"Light",groupColor:"Color",groupDetail:"Detail",groupPortrait:"Portrait",groupShape:"Face shape",groupEffect:"Effect",auto:"Auto",autoTitle:"Auto enhance",autoRunning:"Analyzing…",autoDone:"Auto enhance applied",autoFailed:"Could not auto enhance",ai:"AI 4×",aiTitle:"Upscale and sharpen with AI (Real-ESRGAN)",aiRunning:"Running AI…",aiDone:"AI enhancement complete",aiFailed:"AI processing failed",aiCancelled:"AI cancelled",aiCancel:"Cancel AI",aiPreparing:"Checking device…",aiTiles:"Processing image tiles…",aiCompare:"Hold to compare",aiBefore:"Before AI",aiUndo:"Undo AI",aiUndoConfirm:"Undo AI will discard edits made after it. Continue?",aiReverted:"AI reverted",filterTitle:"Color presets",cropFrame:"Crop frame",cropKeys:"Use the arrow keys to resize, hold Shift for larger steps.",perspective:"Perspective",tiltVertical:"Top / bottom",tiltHorizontal:"Left / right",perspectiveHint:"Drag the ruler to adjust the tilt. Double-tap it to reset.",resetCrop:"Reset crop frame",resetRotation:"Reset rotation",resetPerspective:"Reset perspective",resetPerspectiveY:"Reset top / bottom tilt",resetPerspectiveX:"Reset left / right tilt",resetFilter:"Reset filters",exportTitle:"Save image",exportSub:"Rendered from the original file at full resolution.",format:"Format",quality:"Quality",saveImage:"Save image",overwrite:"Overwrite",saveCopy:"Save copy",saving:"Saving…",rendering:"Rendering image…",encoding:"Encoding image…",uploading:"Uploading…",cancelExport:"Cancel export",exportCancelled:"Export cancelled",saved:"Image saved",savedCopy:"Copy saved",exportFailed:"Could not export the image",notImage:"That file is not an image",tabText:"Text",tabAi:"AI",catAll:"All",catRoot:"Basic",catMeitu:"Meitu",catXingtu:"Xingtu",catLr:"Lightroom",catMono:"Mono",savePreset:"Save filter",presetName:"Filter name…",savedPresets:"Saved",noSaved:"No saved filters yet. Tune the look, then tap Save.",apply:"Apply",deletePreset:"Delete",presetSaved:"Filter saved",presetApplied:"Filter applied",presetDeleted:"Filter deleted",presetExists:"That name exists — pick another",textTitle:"Add text to photo",addText:"Add text",textInput:"Text content…",fontSize:"Size",textOpacity:"Opacity",textRotate:"Rotate",bold:"Bold",italic:"Italic",outline:"Outline",shadow:"Shadow",textColor:"Text color",tapTextHint:"Drag the text on the photo • Use sliders to size/rotate",deleteText:"Delete text",duplicateText:"Duplicate",bgTitle:"AI background",bgSub:"Runs offline on-device. Model downloads once (SHA-256 checked); inference never uses the network.",bgRemove:"Remove background (transparent)",bgBlur:"Blur background",bgReplace:"White background",bgPerson:"Person matte (MODNet)",bgRemoveShort:"Remove",bgBlurShort:"Blur",bgReplaceShort:"White bg",bgPersonShort:"Person",bgNeedHost:"This build has no AI background action. Open demo/ai-panel.html to try the offline engine.",bgRunning:"Removing background…",bgDone:"Background removed — note: edit history is reset.",bgFailed:"Could not remove background",tuneTitle:"Tone tune",tuneHint:"Pick a tone, drag sliders to refine, then Save.",collapse:"Collapse",expand:"Expand",tuneStrength:"Strength",tuneBright:"Brightness",tuneContrast:"Contrast",tuneSat:"Saturation",tuneWarm:"Warmth",tuneTint:"Tint",tuneVig:"Vignette",tuneReset:"Reset tune",modelLabel:"Model",modelFast:"MODNet · Fast",modelBalanced:"BiRefNet · Balanced",modelQuality:"ISNet · Quality",modelRecommended:"Recommended",modelDetailFast:"13 MB · Portrait · iPhone light",modelDetailBalanced:"98 MB · General · Portrait + object",modelDetailQuality:"88 MB · Best · Fine hair edge",brushLabel:"Brush",brushAdd:"Keep (add)",brushErase:"Erase",brushSizeMask:"Brush size",brushUndo:"Undo stroke",brushApply:"Done",brushCancel:"Cancel",brushHint:"Drag on the photo to fix edges. Keep = foreground, Erase = background.",textPinch:"Pinch to resize · Twist to rotate",textDoubleTap:"Double-tap text to edit",textStyleTitle:"Title",textStyleTitle2:"Bold title",textStyleCaption:"Caption",textStyleOutline:"Outline",textQuick:"Quick styles",textArrange:"Align",textAlignLeft:"Left",textAlignCenter:"Center",textAlignRight:"Right"}},Ua=[{id:"adjust",icon:"adjust",label:"tabAdjust"},{id:"filter",icon:"filter",label:"tabFilter"},{id:"text",icon:"text",label:"tabText"},{id:"ai",icon:"wand",label:"tabAi"},{id:"crop",icon:"crop",label:"tabCrop"}],Ji=[{id:"free",label:"free"},{id:"1:1",label:"1:1"},{id:"4:3",label:"4:3"},{id:"3:4",label:"3:4"},{id:"16:9",label:"16:9"},{id:"9:16",label:"9:16"},{id:"screen",label:"screen"}],tr={brightness:"brightnessShort",contrast:"contrastShort",saturation:"saturationShort",exposure:"exposureShort",warmth:"warmthShort",vignette:"vignetteShort",highlights:"highlightsShort",shadows:"shadowsShort",whites:"whitesShort",blacks:"blacksShort",tint:"tintShort",vibrance:"vibranceShort",gamma:"gammaShort",clarity:"clarityShort",sharpen:"sharpenShort",denoise:"denoiseShort",smoothSkin:"smoothSkinShort",blemish:"blemishShort",skinTexture:"skinTextureShort",skinTone:"skinToneShort",faceSlim:"faceSlimShort",jawline:"jawlineShort",chin:"chinShort",eyeSize:"eyeSizeShort",noseSize:"noseSizeShort",mouthSize:"mouthSizeShort"},er=[{id:"light",label:"groupLight",keys:["brightness","exposure","contrast","highlights","shadows","whites","blacks"]},{id:"color",label:"groupColor",keys:["saturation","vibrance","warmth","tint","gamma"]},{id:"detail",label:"groupDetail",keys:["clarity","sharpen","denoise"]},{id:"portrait",label:"groupPortrait",keys:["smoothSkin","skinTexture","blemish","skinTone"]},{id:"shape",label:"groupShape",keys:["faceSlim","jawline","chin","eyeSize","noseSize","mouthSize"]},{id:"effect",label:"groupEffect",keys:["vignette"]}],Ut=[{type:"image/jpeg",label:"JPEG"},{type:"image/webp",label:"WebP"},{type:"image/png",label:"PNG"}],ar=0,$t=[{id:"sys",label:"San",stack:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"},{id:"serif",label:"Serif",stack:"Georgia,'Times New Roman',serif"},{id:"mono",label:"Mono",stack:"'SF Mono',Menlo,Consolas,monospace"},{id:"round",label:"Rounded",stack:"'Arial Rounded MT Bold','Helvetica Neue',sans-serif"},{id:"heavy",label:"Heavy",stack:"'Arial Black',Impact,sans-serif"},{id:"title",label:"Title",stack:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"},{id:"caption",label:"Caption",stack:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"}];function qa(){return{id:`t${Date.now().toString(36)}${Math.floor(Math.random()*1e4).toString(36)}`,text:"",x:.5,y:.5,size:.07,color:"#ffffff",bold:!1,italic:!1,outline:!1,shadow:!0,align:"center",rotation:0,opacity:1,font:"sys"}}function ir(i,a){a==="title"?(i.font="sys",i.bold=!0,i.size=.11,i.outline=!1,i.shadow=!0,i.color="#ffffff"):a==="bold"?(i.font="heavy",i.bold=!0,i.size=.09,i.outline=!1,i.shadow=!1):a==="caption"?(i.font="sys",i.bold=!1,i.italic=!1,i.size=.045,i.outline=!1,i.shadow=!1):a==="outline"&&(i.font="heavy",i.bold=!0,i.size=.09,i.outline=!0,i.shadow=!1,i.color="#ffffff")}var Fa="aurum:user-presets:v1";function rr(){try{let i=localStorage.getItem(Fa);if(!i)return[];let a=JSON.parse(i);return Array.isArray(a)?a.filter(t=>!!t&&typeof t=="object"&&typeof t.name=="string"):[]}catch{return[]}}function Ha(i){try{localStorage.setItem(Fa,JSON.stringify(i))}catch{}}function ot(i){return i<0?0:i>1?1:i}function or(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function x(i,a){let t=document.createElement(i);return a&&(t.className=a),t}function N(i,a){let t=i.querySelector(a);if(!t)throw new Error(`Aurum: missing UI node ${a}`);return t}function vt(i,a,t){let e=x("button","au-icon au-glass");return e.type="button",e.title=a,e.setAttribute("aria-label",a),e.innerHTML=H(i),e.addEventListener("click",t),e}function sr(i,a){let t=URL.createObjectURL(i),e=x("a");e.href=t,e.download=a,document.body.appendChild(e),e.click(),e.remove(),window.setTimeout(()=>URL.revokeObjectURL(t),4e3)}function nr(i,a){let t=a||"";if(!t&&typeof i=="string")try{let e=new URL(i,location.href);t=decodeURIComponent(e.pathname.split("/").pop()||"")}catch{t=""}return!t&&i instanceof File&&(t=i.name),t=t.replace(/\.[a-z0-9]{1,5}$/i,"").replace(/[\\/:*?"<>|]+/g,"").trim(),t.slice(0,64)||"aurum"}function St(i){return i>0?`+${i}`:String(i)}var Qt=class extends At{constructor(t){let e=typeof t.container=="string"?document.querySelector(t.container):t.container;if(!e)throw new Error(`Aurum: container "${String(t.container)}" was not found`);t.injectStyles!==!1&&na();let r=x("div","au-root");r.tabIndex=-1;let o=x("div","au-work");r.appendChild(o),e.appendChild(r);let{image:s,locale:n,title:u,fileName:l,theme:c,onSave:h,onSaveCopy:p,onClose:v,autoDownload:f,startTab:m,exportTypes:g,aiAction:y,backgroundAction:S,...b}=t;super({...b,container:o,background:b.background??"transparent"});d(this,"root");d(this,"work");d(this,"frameEl");d(this,"sheetWrap");d(this,"toastEl");d(this,"undoBtn");d(this,"redoBtn");d(this,"saveBtn");d(this,"ratioBtn");d(this,"rotationBtn");d(this,"perspectiveYBtn");d(this,"perspectiveXBtn");d(this,"ratioValue");d(this,"rotationValue");d(this,"perspectiveYValue");d(this,"perspectiveXValue");d(this,"ratioContext");d(this,"rotationContext");d(this,"perspectiveYContext");d(this,"perspectiveXContext");d(this,"perspectiveYControl");d(this,"perspectiveXControl");d(this,"modesWrap");d(this,"modesTrack");d(this,"chipsEl");d(this,"scrimEl");d(this,"cropResetBtn");d(this,"adjustValue");d(this,"autoBtn");d(this,"autoLabel");d(this,"aiAction");d(this,"aiBtn",null);d(this,"aiPanel");d(this,"aiDetail");d(this,"aiBar");d(this,"aiBusy",!1);d(this,"aiAbort",null);d(this,"aiCompareBar",null);d(this,"aiCompareHold",null);d(this,"aiCompareOn",!1);d(this,"paramsEl");d(this,"filterWrap");d(this,"filterCats");d(this,"filterCat","all");d(this,"filterHint");d(this,"savedWrap");d(this,"filterNameInput");d(this,"filterSaveBtn");d(this,"savedList");d(this,"userPresets",rr());d(this,"filterTuneKey","brightness");d(this,"filterTuneTicks");d(this,"filterTuneValue");d(this,"filterTuneButtons",new Map);d(this,"filterTuneWrap");d(this,"backgroundAction");d(this,"bgBusy",!1);d(this,"bgAbort",null);d(this,"bgDetail");d(this,"bgPanel");d(this,"bgModel",(()=>{try{let t=localStorage.getItem("aurum:ai-model");return t==="isnet-fp16"||t==="birefnet-lite-512-fp16"||t==="modnet-fp16"?t:"isnet-fp16"}catch{return"isnet-fp16"}})());d(this,"bgModelButtons",new Map);d(this,"bgModelDetail");d(this,"refineCanvas");d(this,"refineOn",!1);d(this,"refineSource",null);d(this,"refineWidth",0);d(this,"refineHeight",0);d(this,"refineMaskWidth",0);d(this,"refineMaskHeight",0);d(this,"refineMask",null);d(this,"refineOriginalMask",null);d(this,"refineMode","remove");d(this,"refineModelId","");d(this,"brushMode","add");d(this,"brushSize",7);d(this,"refineHistory",[]);d(this,"refineStroke",null);d(this,"maskToolbar");d(this,"maskBrushTicks");d(this,"textLayer");d(this,"texts",[]);d(this,"selectedTextId",null);d(this,"textPlacing",!1);d(this,"textPlaceBtn");d(this,"textInput");d(this,"textSizeTicks");d(this,"textOpacityTicks");d(this,"textRotateTicks");d(this,"textControls");d(this,"qualityRow");d(this,"progressEl");d(this,"progressBar");d(this,"progressText");d(this,"progressLabel");d(this,"progressCancel");d(this,"exportAbort",null);d(this,"saveLabel");d(this,"saveImageBtn");d(this,"saveCopyBtn",null);d(this,"saveCopyLabel",null);d(this,"metaName");d(this,"metaInfo");d(this,"s");d(this,"locale");d(this,"fileBase");d(this,"customTitle");d(this,"onSaveCb");d(this,"onSaveCopyCb");d(this,"onCloseCb");d(this,"autoDownload");d(this,"quality",92);d(this,"exportType","image/jpeg");d(this,"exportTypes",Ut.map(t=>t.type));d(this,"currentTab","adjust");d(this,"cropMode","ratio");d(this,"lastAspect",null);d(this,"adjustKey","brightness");d(this,"liquifyOn",!1);d(this,"liquifySize",5);d(this,"liquifyGesture",0);d(this,"liquifyButton",null);d(this,"adjustContext",null);d(this,"liquifyContext",null);d(this,"liquifyTicks",null);d(this,"liquifyValue",null);d(this,"liquifyRing",null);d(this,"liquifyStroke",null);d(this,"saving",!1);d(this,"autoBusy",!1);d(this,"uiDestroyed",!1);d(this,"dragDepth",0);d(this,"toastTimer",0);d(this,"ratioTimer",0);d(this,"cropKeyTimer",0);d(this,"cropDrag",null);d(this,"frameBox",{x:NaN,y:NaN,w:NaN,h:NaN});d(this,"uid",`au${++ar}`);d(this,"tabButtons",new Map);d(this,"panes",new Map);d(this,"aspectButtons",new Map);d(this,"flipButtons",new Map);d(this,"adjustButtons",new Map);d(this,"filterButtons",new Map);d(this,"formatButtons",new Map);d(this,"rotationControl");d(this,"adjustTicks");d(this,"qualityControl");d(this,"fileInput");d(this,"tapToPlaceText",t=>{if(this.currentTab!=="text"||!this.isReady||!this.textPlacing||t.target?.closest(".au-textnode, .au-ticks, .au-tabs, .au-deck"))return;let r=this.displayCropRect();if(!r)return;let o=this.stage.getBoundingClientRect(),s=(t.clientX-o.left-r.x)/r.width,n=(t.clientY-o.top-r.y)/r.height;if(s<.05||s>.95||n<.05||n>.95)return;t.preventDefault();let u=qa();u.x=ot(s),u.y=ot(n),u.text="",this.texts.push(u),this.selectedTextId=u.id;let l=this.createTextNode(u);this.textLayer.appendChild(l),this.syncTextControls(u),this.positionTexts(),this.openInlineTextEditor(l,u),this.textPlacing=!1,this.textPlaceBtn?.setAttribute("aria-pressed","false"),this.textPlaceBtn?.classList.remove("is-active"),this.root.classList.remove("au-text-placing")});d(this,"onLiquifyPointerDown",t=>{if(!this.liquifyOn||!this.isReady||t.pointerType==="mouse"&&t.button!==0)return;let e=this.sourcePointAt(t.clientX,t.clientY);if(e){t.preventDefault(),t.stopPropagation();try{this.stage.setPointerCapture(t.pointerId)}catch{}this.liquifyStroke={pointerId:t.pointerId,key:`liquify:${++this.liquifyGesture}`,x:t.clientX,y:t.clientY,u:e.x,v:e.y},this.previewLiquifyRing(t.clientX,t.clientY)}});d(this,"onLiquifyPointerMove",t=>{if(!this.liquifyOn)return;this.previewLiquifyRing(t.clientX,t.clientY);let e=this.liquifyStroke;if(!e||e.pointerId!==t.pointerId)return;t.preventDefault(),t.stopPropagation();let r=Math.max(1.5,this.liquifyScreenRadius()*.35),o=Math.hypot(t.clientX-e.x,t.clientY-e.y);if(o<r)return;let s=(t.clientX-e.x)/o,n=(t.clientY-e.y)/o,u=Math.min(48,Math.floor(o/r));for(;u>0;){u-=1,e.x+=s*r,e.y+=n*r,o-=r;let l=this.sourcePointAt(e.x,e.y);if(!l)continue;let c=l.x-e.u,h=l.y-e.v;Math.abs(c)+Math.abs(h)>1e-5&&this.addLiquifyDab({x:e.u,y:e.v,dx:c,dy:h,radius:this.liquifyRadius()},e.key),e.u=l.x,e.v=l.y}});d(this,"onLiquifyPointerUp",t=>{if(!(!this.liquifyStroke||this.liquifyStroke.pointerId!==t.pointerId)){this.liquifyStroke=null;try{this.stage.releasePointerCapture(t.pointerId)}catch{}}});d(this,"onCropKeyDown",t=>{if(!this.isReady)return;let e=t.key==="ArrowRight"||t.key==="ArrowDown",r=t.key==="ArrowLeft"||t.key==="ArrowUp";if(!e&&!r)return;t.preventDefault();let o=this.currentFrame();if(o.width<2||o.height<2)return;let s=t.shiftKey?24:8,n=this.getState(),u=n.crop.aspect!=="free"&&n.crop.aspect!=="screen",l=`crop-key:${Date.now()}`;if(u){let c=1+(e?1:-1)*s*2/Math.max(1,o.width);this.setCrop({scale:_(n.crop.scale*c,.2,1)},l)}else{let c=t.key==="ArrowRight"?s:t.key==="ArrowLeft"?-s:0,h=t.key==="ArrowDown"?s:t.key==="ArrowUp"?-s:0,p=Math.max(24,o.width+c*2),v=Math.max(24,o.height+h*2),f=_(p/v,.2,8),m=ne(this.viewport(),f),g=_(p/Math.max(1,m.width),.2,1);this.setCrop({aspect:"free",ratio:f,scale:g},l)}this.markCropKeying(),this.positionFrame(this.currentFrame())});d(this,"onCropPointerDown",t=>{let r=t.target?.closest("[data-crop-handle]");if(!r||!this.frameEl.contains(r)||t.pointerType==="mouse"&&t.button!==0||!this.isReady||this.cropDrag)return;t.preventDefault(),t.stopPropagation();let o=this.currentFrame();if(o.width<2||o.height<2)return;let s=this.getState(),n=this.viewport(),u=t.pointerId,l=h=>{h.pointerId===u&&this.dragCrop(h)},c=h=>{h.pointerId===u&&this.endCropDrag()};this.cropDrag={pointerId:u,handle:r.dataset.cropHandle||"",startX:t.clientX,startY:t.clientY,frame:o,viewport:n,aspect:s.crop.aspect,startScale:s.crop.scale,startRatio:o.width/Math.max(1,o.height),key:`crop-drag:${Date.now()}`,handleEl:r,move:l,end:c},this.frameEl.classList.add("is-locked"),r.classList.add("is-dragging");try{r.setPointerCapture(u)}catch{}r.addEventListener("pointermove",l),r.addEventListener("pointerup",c),r.addEventListener("pointercancel",c),this.cropKeyTimer&&(window.clearTimeout(this.cropKeyTimer),this.cropKeyTimer=0),this.frameEl.classList.add("is-dragging"),this.root.classList.add("au-cropping")});if(this.root=r,this.work=o,this.locale=n==="en"?"en":"vi",this.s=Zi[this.locale],this.fileBase=nr(s,l),this.customTitle=u,this.onSaveCb=h,this.onSaveCopyCb=p,this.onCloseCb=v,this.autoDownload=f!==!1,this.aiAction=y,this.backgroundAction=S,g&&g.length&&(this.exportTypes=g.filter((w,k)=>Ut.some(T=>T.type===w)&&g.indexOf(w)===k),this.exportTypes.length||(this.exportTypes=Ut.map(w=>w.type)),this.exportType=this.exportTypes[0]),c)for(let[w,k]of Object.entries(c))r.style.setProperty(w.startsWith("--")?w:`--au-${w}`,k);this.buildChrome(),this.syncUI(),this.setCropMode("ratio"),this.setTab(m||"adjust"),s&&this.openSource(s)}showTab(t){this.setTab(t)}openExport(){this.openSheet()}undo(){let t=this.canRevertAI(),e=super.undo();return e&&t&&!this.canRevertAI()&&(this.setAICompareVisible(!1),this.toast(this.s.aiReverted)),e}destroy(){this.uiDestroyed||(this.uiDestroyed=!0,this.setLiquify(!1),this.toastTimer&&window.clearTimeout(this.toastTimer),this.clearTransient(),this.cropDrag&&this.endCropDrag(),super.destroy(),this.root.remove())}buildChrome(){this.buildOverlay(),this.buildTextLayer(),this.buildEmpty(),this.buildLoading(),this.buildHeader(),this.buildDock(),this.buildSheet(),this.buildAI(),this.buildBG(),this.buildToast(),this.buildLiquifyOverlay(),this.bindEvents()}buildOverlay(){let t=x("div","au-overlay"),e=x("div","au-scrim");e.setAttribute("aria-hidden","true");let r=x("div","au-frame");r.setAttribute("role","group"),r.tabIndex=0,r.setAttribute("aria-label",`${this.s.cropFrame}. ${this.s.cropKeys}`);for(let o of["33.333%","66.666%"]){let s=x("span","au-grid v");s.style.left=o,s.setAttribute("aria-hidden","true"),r.appendChild(s);let n=x("span","au-grid h");n.style.top=o,n.setAttribute("aria-hidden","true"),r.appendChild(n)}for(let o of["tl","tr","br","bl"]){let s=x("span",`au-corner ${o}`);s.dataset.cropHandle=o,s.setAttribute("aria-hidden","true"),r.appendChild(s)}for(let o of["n","e","s","w"]){let s=x("span",`au-edge ${o}`);s.dataset.cropHandle=o,s.setAttribute("aria-hidden","true"),r.appendChild(s)}t.appendChild(e),t.appendChild(r),this.work.appendChild(t),this.frameEl=r,this.scrimEl=e}buildEmpty(){let t=x("div","au-empty");t.innerHTML=`<div class="au-empty__icon">${H("image")}</div><h3></h3><p></p><button class="au-ghost" type="button"></button>`,N(t,"h3").textContent=this.s.emptyTitle,N(t,"p").textContent=this.s.emptyHint;let e=N(t,"button");e.textContent=this.s.openImage,e.addEventListener("click",()=>this.fileInput?.click());let r=document.createElement("input");r.type="file",r.accept="image/*",r.hidden=!0,r.addEventListener("change",()=>{let o=r.files?.[0];r.value="",o&&this.openSource(o)}),this.fileInput=r,t.appendChild(r),this.work.appendChild(t),this.work.addEventListener("dragenter",o=>{o.preventDefault(),this.dragDepth+=1,this.root.classList.add("au-dragover")}),this.work.addEventListener("dragover",o=>{o.preventDefault(),o.dataTransfer&&(o.dataTransfer.dropEffect="copy")}),this.work.addEventListener("dragleave",()=>{this.dragDepth=Math.max(0,this.dragDepth-1),this.dragDepth||this.root.classList.remove("au-dragover")}),this.work.addEventListener("drop",o=>{o.preventDefault(),this.dragDepth=0,this.root.classList.remove("au-dragover");let s=o.dataTransfer?.files?.[0];if(s){if(!s.type.startsWith("image/")){this.toast(this.s.notImage,!0);return}this.openSource(s)}})}buildLoading(){let t=x("div","au-loading");t.innerHTML='<div class="au-spinner"></div>',this.work.appendChild(t)}buildHeader(){let t=x("header","au-top");t.setAttribute("aria-label",this.customTitle||this.s.title);let e=x("div","au-top__row au-top__row--primary"),r=x("button","au-top__cancel au-glass");r.type="button",r.textContent=this.s.cancel,r.addEventListener("click",()=>this.cancel()),this.saveBtn=x("button","au-top__save au-glass au-glass--gold"),this.saveBtn.type="button",this.saveBtn.innerHTML=`${H("save")}<span></span>`;let o=this.saveBtn.querySelector("span");o&&(o.textContent=this.s.save),this.saveBtn.disabled=!0,this.saveBtn.addEventListener("click",()=>this.openSheet()),e.append(r,this.saveBtn);let s=x("div","au-top__row au-top__row--tools"),n=x("div","au-top__group");this.undoBtn=vt("undo",this.s.undo,()=>this.undo()),this.redoBtn=vt("redo",this.s.redo,()=>this.redo()),this.undoBtn.disabled=!0,this.redoBtn.disabled=!0,n.append(this.undoBtn,this.redoBtn);let u=x("div","au-top__group"),l=vt("rotateLeft",this.s.rotateLeft,()=>this.rotateBy(-90)),c=vt("rotateRight",this.s.rotateRight,()=>this.rotateBy(90)),h=vt("flipH",this.s.flipH,()=>this.flip("h")),p=vt("flipV",this.s.flipV,()=>this.flip("v"));if(this.flipButtons.set("flipH",h),this.flipButtons.set("flipV",p),u.append(l,c,h,p),s.append(n,u),this.aiAction){let v=x("div","au-top__group"),f=x("button","au-top__ai au-glass");f.type="button",f.title=this.aiAction.title,f.setAttribute("aria-label",this.aiAction.title),f.innerHTML=`${H("ai")}<span></span>`;let m=f.querySelector("span");m&&(m.textContent=this.aiAction.label),f.addEventListener("click",()=>{this.runAIAction()}),this.aiBtn=f,v.appendChild(f),s.appendChild(v)}t.append(e,s),this.root.insertBefore(t,this.work)}buildDock(){let t=x("div","au-dock"),e=x("div","au-deck"),r=x("div","au-tabs");r.setAttribute("role","tablist"),r.setAttribute("aria-label",this.s.title);for(let s of Ua){let n=`${this.uid}-pane-${s.id}`,u=`${this.uid}-tab-${s.id}`,l=x("button","au-tab");l.type="button",l.id=u,l.setAttribute("role","tab"),l.setAttribute("aria-selected","false"),l.setAttribute("aria-controls",n),l.innerHTML=H(s.icon);let c=x("span");c.textContent=this.s[s.label],l.appendChild(c),l.addEventListener("click",()=>this.setTab(s.id)),this.tabButtons.set(s.id,l),r.appendChild(l);let h=x("section","au-pane");h.id=n,h.setAttribute("role","tabpanel"),h.setAttribute("aria-labelledby",u),s.id==="crop"&&this.buildCropPane(h),s.id==="adjust"&&this.buildAdjustPane(h),s.id==="filter"&&this.buildFilterPane(h),s.id==="text"&&this.buildTextPane(h),s.id==="ai"&&this.buildAIPane(h),this.panes.set(s.id,h),e.appendChild(h)}r.addEventListener("keydown",s=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(s.key))return;s.preventDefault();let u=Ua.map(h=>h.id),l=Math.max(0,u.indexOf(this.currentTab)),c=s.key==="Home"?u[0]:s.key==="End"?u[u.length-1]:u[(l+(s.key==="ArrowRight"?1:-1)+u.length)%u.length];this.setTab(c),this.tabButtons.get(c)?.focus()});let o=this.buildAICompare();t.append(e,...o?[o]:[],r),this.root.appendChild(t)}buildAICompare(){if(!this.aiAction)return null;let t=x("div","au-aicmp au-glass");t.hidden=!0;let e=x("button","au-aicmp__hold");e.type="button",e.textContent=this.s.aiCompare,e.setAttribute("aria-pressed","false");let r=x("button","au-aicmp__undo");r.type="button",r.textContent=this.s.aiUndo;let o=n=>{this.aiCompareOn!==n&&(this.aiCompareOn=n,this.setCompareAI(n),e.classList.toggle("is-on",n),e.setAttribute("aria-pressed",String(n)),e.textContent=n?this.s.aiBefore:this.s.aiCompare)},s=()=>o(!1);return e.addEventListener("pointerdown",n=>{if(n.button===0){try{e.setPointerCapture(n.pointerId)}catch{}o(!0),n.preventDefault()}}),e.addEventListener("pointerup",s),e.addEventListener("pointercancel",s),e.addEventListener("keydown",n=>{n.key!==" "&&n.key!=="Enter"||(n.preventDefault(),o(!0))}),e.addEventListener("keyup",n=>{(n.key===" "||n.key==="Enter")&&o(!1)}),e.addEventListener("contextmenu",n=>n.preventDefault()),r.addEventListener("click",()=>{this.history.canUndo&&!window.confirm(this.s.aiUndoConfirm)||this.revertAI()&&(this.setAICompareVisible(!1),this.toast(this.s.aiReverted))}),t.append(e,r),this.aiCompareBar=t,this.aiCompareHold=e,t}setAICompareVisible(t){this.aiCompareBar&&(!t&&this.aiCompareOn&&(this.aiCompareOn=!1,this.setCompareAI(!1),this.aiCompareHold&&(this.aiCompareHold.textContent=this.s.aiCompare,this.aiCompareHold.classList.remove("is-on"),this.aiCompareHold.setAttribute("aria-pressed","false"))),this.aiCompareBar.hidden=!t)}buildCropPane(t){let e=x("div","au-deck__row au-deck__row--top");this.ratioBtn=x("button","au-mode au-glass"),this.ratioBtn.type="button",this.ratioBtn.innerHTML=`${H("crop")}<span class="au-mode__value"></span>`,this.ratioValue=N(this.ratioBtn,".au-mode__value"),this.ratioBtn.setAttribute("aria-pressed","true"),this.ratioBtn.addEventListener("click",()=>this.setCropMode("ratio")),this.rotationBtn=x("button","au-mode au-glass"),this.rotationBtn.type="button",this.rotationBtn.innerHTML=`${H("rotateRight")}<span class="au-mode__value"></span>`,this.rotationValue=N(this.rotationBtn,".au-mode__value"),this.rotationBtn.setAttribute("aria-pressed","false"),this.rotationBtn.addEventListener("click",()=>this.setCropMode("rotation")),this.perspectiveYBtn=x("button","au-mode au-mode--persp au-glass"),this.perspectiveYBtn.type="button",this.perspectiveYBtn.innerHTML=`${H("tiltY")}<span class="au-mode__value"></span>`,this.perspectiveYBtn.title=`${this.s.tiltVertical} · ${this.s.perspectiveHint}`,this.perspectiveYValue=N(this.perspectiveYBtn,".au-mode__value"),this.perspectiveYBtn.setAttribute("aria-pressed","false"),this.perspectiveYBtn.addEventListener("click",()=>this.setCropMode("perspectiveY")),this.perspectiveXBtn=x("button","au-mode au-mode--persp au-glass"),this.perspectiveXBtn.type="button",this.perspectiveXBtn.innerHTML=`${H("tiltX")}<span class="au-mode__value"></span>`,this.perspectiveXBtn.title=`${this.s.tiltHorizontal} · ${this.s.perspectiveHint}`,this.perspectiveXValue=N(this.perspectiveXBtn,".au-mode__value"),this.perspectiveXBtn.setAttribute("aria-pressed","false"),this.perspectiveXBtn.addEventListener("click",()=>this.setCropMode("perspectiveX")),this.modesWrap=x("div","au-modes"),this.modesTrack=x("div","au-modes__track"),this.modesTrack.append(this.ratioBtn,this.rotationBtn,this.perspectiveYBtn,this.perspectiveXBtn),this.modesWrap.appendChild(this.modesTrack);let r=vt("reset",this.s.resetCrop,()=>this.resetCropMode());r.classList.add("au-reset"),this.cropResetBtn=r,e.append(this.modesWrap,r),t.appendChild(e);let o=x("div","au-deck__row au-deck__row--context");this.ratioContext=x("div","au-context is-active"),this.ratioContext.dataset.context="ratio";let s=x("div","au-chipsrail"),n=x("div","au-chips");n.setAttribute("role","group"),n.setAttribute("aria-label",this.s.aspect);for(let u of Ji){let l=x("button","au-chip");l.type="button",l.textContent=this.aspectLabel(u.id),l.setAttribute("aria-pressed","false"),l.addEventListener("click",()=>this.chooseAspect(u.id)),this.aspectButtons.set(u.id,l),n.appendChild(l)}s.appendChild(n),this.chipsEl=n,this.ratioContext.appendChild(s),this.rotationContext=x("div","au-context"),this.rotationContext.dataset.context="rotation",this.rotationControl=this.makeTicks({label:this.s.rotation,min:-180,max:180,step:1,tickStep:3,defaultValue:0,zero:!0,head:!1,ruler:!0,format:u=>`${Math.round(u)}°`,onInput:u=>this.setRotation(u),onDragStart:()=>this.beginRotationDrag(),onDragEnd:()=>this.endRotationDrag()}),this.rotationContext.appendChild(this.rotationControl.row),this.perspectiveYContext=x("div","au-context"),this.perspectiveYContext.dataset.context="perspectiveY",this.perspectiveYControl=this.makeTicks({label:this.s.tiltVertical,min:-100,max:100,step:1,tickStep:2,defaultValue:0,zero:!0,head:!1,ruler:!0,format:u=>St(Math.round(u)),onInput:u=>this.setPerspective({perspectiveY:u})}),this.perspectiveYControl.rail.addEventListener("dblclick",()=>{this.setPerspective({perspectiveY:0},"perspective")}),this.perspectiveYContext.appendChild(this.perspectiveYControl.row),this.perspectiveXContext=x("div","au-context"),this.perspectiveXContext.dataset.context="perspectiveX",this.perspectiveXControl=this.makeTicks({label:this.s.tiltHorizontal,min:-100,max:100,step:1,tickStep:2,defaultValue:0,zero:!0,head:!1,ruler:!0,format:u=>St(Math.round(u)),onInput:u=>this.setPerspective({perspectiveX:u})}),this.perspectiveXControl.rail.addEventListener("dblclick",()=>{this.setPerspective({perspectiveX:0},"perspective")}),this.perspectiveXContext.appendChild(this.perspectiveXControl.row),o.append(this.ratioContext,this.rotationContext,this.perspectiveYContext,this.perspectiveXContext),t.appendChild(o)}buildAdjustPane(t){let e=x("div","au-deck__row au-deck__row--top au-deck__row--adjust");this.autoBtn=x("button","au-auto au-glass au-glass--gold"),this.autoBtn.type="button",this.autoBtn.title=this.s.autoTitle,this.autoBtn.setAttribute("aria-label",this.s.autoTitle),this.autoBtn.innerHTML=`${H("auto")}<span data-auto-label></span>`,this.autoLabel=N(this.autoBtn,"[data-auto-label]"),this.autoLabel.textContent=this.s.auto,this.autoBtn.addEventListener("click",()=>{this.runAuto()});let r=x("div","au-params");this.paramsEl=r,r.setAttribute("role","group"),r.setAttribute("aria-label",this.s.adjustTitle);for(let u of er){let l=x("span","au-param-sep");l.dataset.group=u.id;let c=x("b");c.textContent=this.s[u.label],l.appendChild(c),r.appendChild(l);for(let h of u.keys){let p=x("button","au-param");p.type="button",p.dataset.adjust=h,p.textContent=this.s[tr[h]],p.setAttribute("aria-pressed","false"),p.addEventListener("click",()=>this.selectAdjust(h)),this.adjustButtons.set(h,p),r.appendChild(p)}if(u.id==="shape"){let h=x("button","au-param au-param--liquify");h.type="button",h.title=this.s.liquifyTitle,h.setAttribute("aria-label",this.s.liquifyTitle),h.setAttribute("aria-pressed","false"),h.innerHTML=`${H("liquify")}<span>${this.s.liquify}</span>`,h.addEventListener("click",()=>this.setLiquify(!this.liquifyOn)),this.liquifyButton=h,r.appendChild(h)}}this.adjustValue=x("button","au-value au-glass au-glass--gold"),this.adjustValue.type="button",this.adjustValue.addEventListener("click",()=>this.resetAdjust(this.adjustKey)),e.append(this.autoBtn,r,this.adjustValue),t.appendChild(e);let o=x("div","au-deck__row au-deck__row--context");this.adjustContext=o,this.adjustTicks=this.makeTicks({label:this.s[this.adjustKey],min:-100,max:100,step:1,tickStep:2,defaultValue:0,zero:!0,head:!1,ruler:!0,format:u=>this.formatAdjust(u),onInput:u=>this.setAdjust(this.adjustKey,u)}),o.appendChild(this.adjustTicks.row),t.appendChild(o);let s=x("div","au-deck__row au-deck__row--context au-liquify-row");s.style.display="none",this.liquifyContext=s,this.liquifyTicks=this.makeTicks({label:this.s.brushSize,min:1,max:20,step:1,tickStep:1,defaultValue:this.liquifySize,head:!1,ruler:!1,format:u=>`${Math.round(u)}%`,onInput:u=>this.setLiquifySize(u,!1),onReset:()=>this.setLiquifySize(5)}),this.liquifyValue=x("button","au-value au-glass au-glass--gold"),this.liquifyValue.type="button",this.liquifyValue.textContent=`${this.liquifySize}%`,this.liquifyValue.title=`${this.s.reset}: ${this.s.brushSize}`,this.liquifyValue.setAttribute("aria-label",`${this.s.reset}: ${this.s.brushSize}`),this.liquifyValue.addEventListener("click",()=>this.setLiquifySize(5));let n=vt("reset",this.s.clearLiquify,()=>this.clearLiquifyDabs());n.classList.add("au-reset"),s.append(this.liquifyTicks.row,this.liquifyValue,n),t.appendChild(s),this.selectAdjust(this.adjustKey)}buildFilterPane(t){let e=x("div","au-deck__row au-deck__row--top"),r=vt("reset",this.s.resetFilter,()=>this.setFilter("original"));r.classList.add("au-reset"),e.append(r),t.appendChild(e);let o=x("div","au-chips au-filter-cats");o.setAttribute("role","group"),o.setAttribute("aria-label",this.s.filterTitle);let s=[{id:"all",label:"catAll"},{id:"root",label:"catRoot"},{id:"meitu",label:"catMeitu"},{id:"xingtu",label:"catXingtu"},{id:"lr",label:"catLr"},{id:"mono",label:"catMono"}];for(let I of s){let L=x("button","au-chip");L.type="button",L.textContent=this.s[I.label],L.setAttribute("aria-pressed",String(this.filterCat===I.id)),L.addEventListener("click",()=>{this.filterCat=I.id;for(let G of Array.from(o.children))G.setAttribute("aria-pressed",String(G===L));this.buildFilters()}),o.appendChild(L)}this.filterCats=o,t.appendChild(o);let n=x("div","au-tone-hint");n.setAttribute("aria-live","polite"),this.filterHint=n,t.appendChild(n);let u=x("div","au-deck__row au-deck__row--context au-deck__row--filters");this.filterWrap=x("div","au-filters"),this.filterWrap.setAttribute("role","group"),this.filterWrap.setAttribute("aria-label",this.s.filterTitle),u.appendChild(this.filterWrap),t.appendChild(u);let l=x("div","au-tune au-collapsible");l.setAttribute("aria-label",this.s.tuneTitle);let c=x("button","au-tune__head au-collapsible__head");c.type="button",c.setAttribute("aria-expanded","false");let h=x("span","au-tune__title");h.textContent=this.s.tuneTitle;let p=x("span","au-tune__hint");p.textContent=this.s.tuneHint;let v=x("div","au-collapsible__body");v.hidden=!0;let f=x("span","au-chev");f.textContent="▾",c.append(h,p,f);let m=x("button","au-chip au-tune__reset");m.type="button",m.textContent=this.s.tuneReset,m.addEventListener("click",I=>{I.stopPropagation();for(let L of["brightness","contrast","saturation","warmth","tint","vignette","vibrance"])this.setAdjust(L,0);this.syncTuneUI()});let g=x("div","au-tune__row"),y=x("div","au-params au-tune__chips"),S=["brightness","contrast","saturation","warmth","tint","vibrance","vignette"],b={brightness:"brightnessShort",contrast:"contrastShort",saturation:"saturationShort",warmth:"warmthShort",tint:"tintShort",vibrance:"vibranceShort",vignette:"vignetteShort"};for(let I of S){let L=x("button","au-param");L.type="button",L.dataset.tune=I;let G=this.s[b[I]];L.textContent=G??I,L.setAttribute("aria-pressed",String(I===this.filterTuneKey)),L.addEventListener("click",()=>this.selectFilterTune(I)),this.filterTuneButtons.set(I,L),y.appendChild(L)}this.filterTuneValue=x("button","au-value au-glass au-glass--gold"),this.filterTuneValue.type="button",this.filterTuneValue.setAttribute("aria-label",this.s.tuneTitle),this.filterTuneValue.addEventListener("click",()=>{this.resetAdjust(this.filterTuneKey),this.syncTuneUI()}),g.append(y,this.filterTuneValue);let w=x("div","au-tune__slider");this.filterTuneTicks=this.makeTicks({label:this.s.tuneTitle,min:-100,max:100,step:1,tickStep:2,defaultValue:0,zero:!0,head:!1,ruler:!0,format:I=>this.formatTune(I),onInput:I=>{this.filterTuneKey==="vignette"?this.setAdjust("vignette",_(I,0,100)):this.setAdjust(this.filterTuneKey,I),this.syncTuneUI()}}),w.appendChild(this.filterTuneTicks.row),v.append(m,g,w),c.addEventListener("click",I=>{if(I.target.closest(".au-tune__reset"))return;let L=v.hidden;v.hidden=!L,c.setAttribute("aria-expanded",String(L)),f.textContent=L?"▴":"▾",l.classList.toggle("is-open",L),L&&window.requestAnimationFrame(()=>this.selectFilterTune(this.filterTuneKey))}),this.filterTuneWrap=l,l.append(c,v),t.appendChild(l),this.selectFilterTune(this.filterTuneKey);let k=x("div","au-saved au-collapsible"),T=x("button","au-collapsible__head");T.type="button",T.setAttribute("aria-expanded","false");let A=x("div","au-saved__head"),D=x("span","au-saved__title");D.textContent=this.s.savedPresets;let U=x("span","au-chev");U.textContent="▾",A.append(D,U),T.append(A);let C=document.createElement("input");C.className="au-saved__input",C.type="text",C.maxLength=32,C.spellcheck=!1,C.autocomplete="off",C.setAttribute("aria-label",this.s.presetName),C.placeholder=this.s.presetName;let z=x("button","au-save-preset au-glass au-glass--gold");z.type="button",z.innerHTML=`${H("bookmark")}<span>${this.s.savePreset}</span>`,z.setAttribute("aria-label",this.s.savePreset),z.addEventListener("click",()=>this.saveCurrentPreset(C)),C.addEventListener("keydown",I=>{I.key==="Enter"&&this.saveCurrentPreset(C)}),A.append(D,C,z);let P=x("div","au-collapsible__body");P.hidden=!0;let tt=x("div","au-saved__list");this.savedList=tt,this.savedWrap=k,this.filterNameInput=C,this.filterSaveBtn=z,P.append(tt),T.addEventListener("click",I=>{if(I.target.closest(".au-saved__input, .au-save-preset"))return;let L=P.hidden;P.hidden=!L,T.setAttribute("aria-expanded",String(L)),U.textContent=L?"▴":"▾",k.classList.toggle("is-open",L)}),k.append(T,P),t.appendChild(k),this.renderSavedPresets()}selectFilterTune(t){this.filterTuneKey=t;for(let[u,l]of this.filterTuneButtons)l.setAttribute("aria-pressed",String(u===t));let[e,r]=et[t];this.filterTuneTicks.setRange(e,r,1,2,e<0),this.filterTuneTicks.setLabel(`${this.s.tuneTitle} · ${t}`);let o=this.isReady?this.getState():null,s=o?Math.round(o.adjust[t]):0;this.filterTuneTicks.set(s,!1),this.syncTuneUI();let n=this.filterTuneButtons.get(t);n&&window.requestAnimationFrame(()=>{let u=n.parentElement;if(!u)return;let l=n.getBoundingClientRect(),c=u.getBoundingClientRect();if(!l.width||!c.width)return;let h=l.left-c.left-(c.width-l.width)/2;Math.abs(h)>1&&u.scrollBy({left:h,behavior:"smooth"})})}formatTune(t){let[e]=et[this.filterTuneKey];return e>=0?String(Math.round(t)):St(Math.round(t))}syncTuneUI(){if(!this.isReady||!this.filterTuneTicks)return;let t=this.getState(),e=document.activeElement,r=Math.round(t.adjust[this.filterTuneKey]);e!==this.filterTuneTicks.rail&&this.filterTuneTicks.set(r,!1),this.filterTuneValue&&(this.filterTuneValue.textContent=this.formatTune(r))}buildTextPane(t){let e=document.createElement("textarea");e.className="au-text-input",e.style.display="none",e.rows=1,e.maxLength=120,e.spellcheck=!1,e.setAttribute("aria-label",this.s.textInput),e.placeholder=this.s.textInput,e.addEventListener("input",()=>{let b=this.selectedLayer();b&&(b.text=e.value,this.positionTexts(),this.syncTextLayerEl(b))}),this.textInput=e,t.appendChild(e);let r=x("div","au-quick-styles"),o=x("div","au-quick-row"),s=x("button","au-quick-chip au-quick-chip--icon");s.type="button",s.innerHTML=`${H("plus")}<span>${this.locale==="vi"?"Chạm đặt":"Place"}</span>`,s.setAttribute("aria-pressed","false"),s.title=this.locale==="vi"?"Bật chế độ: chạm vào ảnh để đặt chữ":"Toggle: tap photo to place text",s.addEventListener("click",()=>{this.textPlacing=!this.textPlacing,s.setAttribute("aria-pressed",String(this.textPlacing)),s.classList.toggle("is-active",this.textPlacing),this.root.classList.toggle("au-text-placing",this.textPlacing),this.toast(this.textPlacing?this.locale==="vi"?"Chạm vào ảnh để đặt chữ mới":"Tap photo to place text":this.locale==="vi"?"Tắt chế độ đặt chữ":"Place mode off",!1)}),this.textPlaceBtn=s,o.appendChild(s);let n=[{id:"title",label:this.s.textStyleTitle},{id:"bold",label:this.s.textStyleTitle2},{id:"caption",label:this.s.textStyleCaption},{id:"outline",label:this.s.textStyleOutline}];for(let b of n){let w=x("button","au-quick-chip");w.type="button",w.textContent=b.label,w.dataset.style=b.id,w.setAttribute("aria-pressed","false"),w.addEventListener("click",()=>{let k=this.selectedLayer();if(k){ir(k,b.id);for(let T of Array.from(o.children))T.setAttribute("aria-pressed",String(T===w));this.syncTextControls(k),this.syncTextLayerEl(k),this.positionTexts()}}),o.appendChild(w)}r.appendChild(o),t.appendChild(r);let u=x("div","au-text-meta"),l=x("div","au-seg au-text-fonts");l.setAttribute("role","group"),l.setAttribute("aria-label",this.s.textStyleTitle);for(let b of $t.slice(0,5)){let w=x("button","au-font-btn");w.type="button",w.textContent=b.label,w.style.fontFamily=b.stack,w.dataset.font=b.id,w.setAttribute("aria-pressed",String(b.id==="sys")),w.addEventListener("click",()=>{let k=this.selectedLayer();if(k){k.font=b.id;for(let T of Array.from(l.children))T.setAttribute("aria-pressed",String(T===w));this.syncTextLayerEl(k)}}),l.appendChild(w)}let c=x("label","au-text-color"),h=x("span","au-text-colordot");h.style.background="#ffffff";let p=document.createElement("input");p.type="color",p.value="#ffffff",p.setAttribute("aria-label",this.s.textColor),p.addEventListener("input",()=>{let b=this.selectedLayer();b&&(b.color=p.value,h.style.background=p.value,this.syncTextLayerEl(b))});let v=x("span");v.textContent=this.s.textColor,c.append(h,p,v),u.append(l,c),t.appendChild(u);let f=x("div","au-text-toggles"),m=(b,w,k)=>{let T=x("button","au-chip");return T.type="button",T.textContent=b,T.setAttribute("aria-pressed",String(w())),T.addEventListener("click",()=>{k(!w()),T.setAttribute("aria-pressed",String(w()));let A=this.selectedLayer();A&&this.syncTextLayerEl(A)}),f.appendChild(T),T};m(this.s.bold,()=>this.selectedLayer()?.bold??!1,b=>{let w=this.selectedLayer();w&&(w.bold=b)}),m(this.s.italic,()=>this.selectedLayer()?.italic??!1,b=>{let w=this.selectedLayer();w&&(w.italic=b)}),m(this.s.outline,()=>this.selectedLayer()?.outline??!1,b=>{let w=this.selectedLayer();w&&(w.outline=b)}),m(this.s.shadow,()=>this.selectedLayer()?.shadow??!0,b=>{let w=this.selectedLayer();w&&(w.shadow=b)});let g=x("button","au-chip");g.type="button",g.innerHTML=`${H("duplicate")}<span>${this.s.duplicateText}</span>`,g.addEventListener("click",()=>this.duplicateSelectedText());let y=x("button","au-chip au-chip--danger");y.type="button",y.innerHTML=`${H("trash")}<span>${this.s.deleteText}</span>`,y.addEventListener("click",()=>this.deleteSelectedText()),f.append(g,y),t.appendChild(f);let S=x("div","au-text-sliders");this.textOpacityTicks=this.makeTicks({label:this.s.textOpacity,min:10,max:100,step:1,tickStep:2,defaultValue:100,ruler:!0,format:b=>`${b}%`,onInput:b=>{let w=this.selectedLayer();w&&(w.opacity=b/100,this.syncTextLayerEl(w))}}),this.textSizeTicks=this.makeTicks({label:this.s.fontSize,min:2,max:24,step:1,tickStep:2,defaultValue:7,format:b=>`${b}%`,onInput:()=>{}}),this.textRotateTicks=this.makeTicks({label:this.s.textRotate,min:-180,max:180,step:1,tickStep:10,defaultValue:0,zero:!0,ruler:!0,format:b=>`${Math.round(b)}°`,onInput:()=>{}}),S.append(this.textOpacityTicks.row),this.textControls=S,t.appendChild(S)}buildAIPane(t){let e=x("div","au-model-label");e.textContent=this.s.modelLabel,t.appendChild(e);let r=x("div","au-seg au-model-seg");r.setAttribute("role","group");let o=[{id:"isnet-fp16",label:"modelQuality",detail:"modelDetailQuality",recommended:!0},{id:"birefnet-lite-512-fp16",label:"modelBalanced",detail:"modelDetailBalanced"},{id:"modnet-fp16",label:"modelFast",detail:"modelDetailFast"}];for(let b of o){let w=x("button","au-model-btn");w.type="button",w.dataset.model=b.id,w.setAttribute("aria-pressed",String(this.bgModel===b.id));let k=x("span","au-model-btn__name");k.textContent=this.s[b.label];let T=x("span","au-model-btn__detail");if(T.textContent=this.s[b.detail],w.append(k,T),b.recommended){let A=x("span","au-model-btn__badge");A.textContent=this.s.modelRecommended||"Khuyến nghị",w.appendChild(A)}w.addEventListener("click",()=>{this.bgModel=b.id;try{localStorage.setItem("aurum:ai-model",b.id)}catch{}for(let A of Array.from(r.children))A.setAttribute("aria-pressed",String(A===w));if(this.bgModelDetail){let A=o.find(D=>D.id===b.id);A&&(this.bgModelDetail.textContent=`${this.s[A.label]} · ${this.s[A.detail]}`)}}),this.bgModelButtons.set(b.id,w),r.appendChild(w)}t.appendChild(r),this.bgModelDetail=x("div","au-model-detail");let s=o.find(b=>b.id===this.bgModel)??o[0];this.bgModelDetail.textContent=`${this.s[s.label]} · ${this.s[s.detail]}`,t.appendChild(this.bgModelDetail);let n=x("div","au-ai-pane__list au-ai-pane__list--row"),u=(b,w,k,T=!1)=>{let A=x("button",`au-ai-pill ${T?"is-primary":""}`);A.type="button",A.innerHTML=`${H(k)}<span>${or(w)}</span>`,A.setAttribute("aria-label",w),A.addEventListener("click",()=>{this.runBackground(b)}),n.appendChild(A)};if(u("remove",this.s.bgRemoveShort,"eraser",!0),u("person",this.s.bgPersonShort,"bg"),u("blur",this.s.bgBlurShort,"contrast"),u("replace",this.s.bgReplaceShort,"image"),!this.backgroundAction){let b=x("div","au-ai-pane__note");b.textContent=this.s.bgNeedHost,n.appendChild(b)}t.appendChild(n);let l=x("div","au-mask-tools");l.style.display="none";let c=x("div","au-mask-tools__label");c.textContent=this.s.brushLabel;let h=x("div","au-seg au-mask-seg");h.setAttribute("role","group");let p=x("button","au-mask-btn");p.type="button",p.innerHTML=`${H("brush")}<span>${this.s.brushAdd}</span>`,p.setAttribute("aria-pressed","true");let v=x("button","au-mask-btn");v.type="button",v.innerHTML=`${H("eraser")}<span>${this.s.brushErase}</span>`,v.setAttribute("aria-pressed","false"),p.addEventListener("click",()=>{this.brushMode="add",p.setAttribute("aria-pressed","true"),v.setAttribute("aria-pressed","false")}),v.addEventListener("click",()=>{this.brushMode="erase",v.setAttribute("aria-pressed","true"),p.setAttribute("aria-pressed","false")}),h.append(p,v);let f=x("button","au-chip");f.type="button",f.innerHTML=`${H("undo")}<span>${this.s.brushUndo}</span>`,f.addEventListener("click",()=>this.refineUndo());let m=x("div","au-mask-hint");m.textContent=this.s.brushHint,this.maskBrushTicks=this.makeTicks({label:this.s.brushSizeMask,min:1,max:30,step:1,tickStep:2,defaultValue:this.brushSize,format:b=>`${Math.round(b)}px`,onInput:b=>{this.brushSize=Math.round(b)}});let g=x("div","au-mask-actions"),y=x("button","au-chip au-chip--danger");y.type="button",y.innerHTML=`<span>${this.s.brushCancel}</span>`,y.addEventListener("click",()=>this.cancelRefine());let S=x("button","au-primary au-mask-apply");S.type="button",S.innerHTML=`<span>${this.s.brushApply}</span>`,S.addEventListener("click",()=>{this.applyRefine()}),g.append(y,S),l.append(c,h,f,m,this.maskBrushTicks.row,g),this.maskToolbar=l,t.appendChild(l)}brushDabLocal(t,e,r,o){if(!this.refineMask)return;let s=this.refineMaskWidth,n=this.refineMaskHeight,u=this.refineMask,l=Math.max(1,r),c=Math.max(0,Math.floor(t-l)),h=Math.min(s-1,Math.ceil(t+l)),p=Math.max(0,Math.floor(e-l)),v=Math.min(n-1,Math.ceil(e+l));for(let f=p;f<=v;f++)for(let m=c;m<=h;m++){let g=m-t,y=f-e,S=Math.sqrt(g*g+y*y)/l;if(S>=1)continue;let b=1-S,w=b*b*(3-2*b),k=f*s+m,T=o*w;u[k]=this.brushMode==="add"?Math.min(1,(u[k]??0)+T):Math.max(0,(u[k]??0)-T)}}resizeMaskLocal(t,e,r,o,s){if(e===o&&r===s)return new Float32Array(t);let n=new Float32Array(o*s),u=e/o,l=r/s;for(let c=0;c<s;c++){let h=(c+.5)*l-.5,p=Math.max(0,Math.floor(h)),v=Math.min(r-1,p+1),f=Math.min(1,Math.max(0,h-p));for(let m=0;m<o;m++){let g=(m+.5)*u-.5,y=Math.max(0,Math.floor(g)),S=Math.min(e-1,y+1),b=Math.min(1,Math.max(0,g-y)),w=(t[p*e+y]??0)*(1-b)+(t[p*e+S]??0)*b,k=(t[v*e+y]??0)*(1-b)+(t[v*e+S]??0)*b;n[c*o+m]=w*(1-f)+k*f}}return n}drawRefinePreview(){if(!this.refineOn||!this.refineCanvas||!this.refineSource||!this.refineMask)return;let t=this.refineCanvas,e=t.getContext("2d");if(!e)return;let r=this.stage.clientWidth||1,o=this.stage.clientHeight||1,n=Math.min(1,1080/Math.max(this.refineWidth,this.refineHeight)),u=Math.max(1,Math.round(this.refineWidth*n)),l=Math.max(1,Math.round(this.refineHeight*n));(t.width!==u||t.height!==l)&&(t.width=u,t.height=l);let c=this.displayCropRect()??{x:0,y:0,width:r,height:o};t.style.left=`${c.x}px`,t.style.top=`${c.y}px`,t.style.width=`${c.width}px`,t.style.height=`${c.height}px`;let h=Math.max(4,Math.round(u/24));for(let m=0;m<l;m+=h)for(let g=0;g<u;g+=h)e.fillStyle=(Math.floor(g/h)+Math.floor(m/h))%2===0?"#3a3a3f":"#232327",e.fillRect(g,m,h,h);let p=this.resizeMaskLocal(this.refineMask,this.refineMaskWidth,this.refineMaskHeight,u,l);e.drawImage(this.refineSource,0,0,this.refineWidth,this.refineHeight,0,0,u,l);let v=e.getImageData(0,0,u,l),f=v.data;for(let m=0,g=0;m<p.length;m++,g+=4)f[g+3]=Math.round(Math.min(1,Math.max(0,p[m]??0))*255);e.putImageData(v,0,0)}enterRefine(t,e,r,o,s,n,u,l){if(this.refineOn=!0,this.refineSource=t,this.refineWidth=e,this.refineHeight=r,this.refineMaskWidth=s,this.refineMaskHeight=n,this.refineMask=new Float32Array(o),this.refineOriginalMask=new Float32Array(o),this.refineMode=u,this.refineModelId=l,this.refineHistory=[],!this.refineCanvas){let c=document.createElement("canvas");c.className="au-maskprev",c.setAttribute("aria-hidden","true");let h=f=>{if(this.refineOn){f.preventDefault();try{c.setPointerCapture(f.pointerId)}catch{}this.refineMask&&this.refineHistory.push(new Float32Array(this.refineMask)),this.refineHistory.length>20&&this.refineHistory.shift(),this.refineStroke={pointerId:f.pointerId,snapshotTaken:!0},this.brushAt(f)}},p=f=>{!this.refineStroke||this.refineStroke.pointerId!==f.pointerId||(f.preventDefault(),this.brushAt(f))},v=()=>{this.refineStroke=null,this.drawRefinePreview()};c.addEventListener("pointerdown",h),c.addEventListener("pointermove",p),c.addEventListener("pointerup",v),c.addEventListener("pointercancel",v),this.stage.appendChild(c),this.refineCanvas=c}this.refineCanvas.style.display="block",this.maskToolbar.style.display="block",this.positionTexts(),this.drawRefinePreview(),this.showTab("ai")}brushAt(t){if(!this.refineCanvas||!this.refineMask)return;let e=this.refineCanvas.getBoundingClientRect();if(e.width<2||e.height<2)return;let r=ot((t.clientX-e.left)/e.width),o=ot((t.clientY-e.top)/e.height),s=r*this.refineMaskWidth,n=o*this.refineMaskHeight,u=Math.max(4,this.brushSize/100*Math.min(this.refineMaskWidth,this.refineMaskHeight)*2);this.brushDabLocal(s,n,u,.9),this.drawRefinePreview()}refineUndo(){let t=this.refineHistory.pop();!t||!this.refineMask||(this.refineMask=t,this.drawRefinePreview())}cancelRefine(){this.refineOn=!1,this.refineMask=null,this.refineHistory=[],this.refineCanvas&&(this.refineCanvas.style.display="none"),this.maskToolbar&&(this.maskToolbar.style.display="none"),this.positionTexts()}async applyRefine(){if(!this.refineOn||!this.refineSource||!this.refineMask)return;let t=this.refineWidth,e=this.refineHeight,r=this.resizeMaskLocal(this.refineMask,this.refineMaskWidth,this.refineMaskHeight,t,e),o=document.createElement("canvas");o.width=t,o.height=e;let s=o.getContext("2d");if(!s)return;s.drawImage(this.refineSource,0,0);let n=s.getImageData(0,0,t,e),u=n.data;for(let c=0,h=0;c<r.length;c++,h+=4)u[h+3]=Math.round(Math.min(1,Math.max(0,r[c]??0))*255);s.putImageData(n,0,0);let l=await new Promise(c=>o.toBlob(c,"image/png"));if(!l){this.toast(this.s.bgFailed,!0);return}this.cancelRefine(),await this.load(l),this.showTab("adjust"),this.toast(this.s.bgDone)}makeTicks(t){let e=x("div","au-ticksrow"),r=null,o=null;if(t.head){let M=x("div","au-slider__head");r=x("span","au-slider__label"),r.textContent=t.label,o=x("button","au-slider__value"),o.type="button",o.title=`${this.s.reset}: ${t.label}`,o.setAttribute("aria-label",`${this.s.reset}: ${t.label}`),o.addEventListener("click",()=>t.onReset?.()),M.append(r,o),e.appendChild(M)}let s=x("div","au-ticks"),n=t.ruler===!0;n&&s.classList.add("au-ticks--ruler"),s.tabIndex=0,s.setAttribute("role","slider"),s.setAttribute("aria-orientation","horizontal"),s.setAttribute("aria-label",t.label);let u=x("div","au-ticks__track");if(u.setAttribute("aria-hidden","true"),s.appendChild(u),n){let M=x("span","au-ticks__center");M.setAttribute("aria-hidden","true"),s.appendChild(M)}e.appendChild(s);let l=t.min,c=t.max,h=Math.max(1e-4,t.step??1),p=Math.max(h,t.tickStep??5),v=t.zero??!1,f=[],m=-1,g=t.defaultValue,y=!1,S=null,b=g,w=0,k=0,T=new WeakMap,A=()=>typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,D=M=>{let B=Math.round((M-l)/h)*h+l;return _(Number(B.toFixed(6)),l,c)},U=()=>{let M=Math.max(2,Math.round((c-l)/p)+1);u.replaceChildren(),f=[];for(let B=0;B<M;B+=1){let R=x("span","au-tick"),F=l+B*p;v&&Math.abs(F)<p/2&&R.classList.add("is-zero"),(B%5===0||v&&Math.abs(F)<p/2)&&R.classList.add("is-major"),u.appendChild(R),f.push(R)}m=-1},C=M=>_(Math.round((M-l)/p),0,f.length-1),z=()=>{if(!n)return;let M=Math.max(1,f.length-1),B=_((m>=0?m:C(g))/M,0,1);u.style.transform=`translate3d(${-B*100}%,-50%,0)`},P=(M,B=!1)=>{g=_(Number.isFinite(M)?M:l,l,c);let R=C(g),F=m;if(R!==F){if(F>=0&&f[F]?.classList.remove("is-active"),B&&F>=0&&!A()){let Z=Math.max(1,Math.abs(R-F)),Na=Math.min(F,R),Xa=Math.max(F,R);for(let qt=Na;qt<=Xa;qt+=1){if(qt===R)continue;let ct=f[qt];if(!ct)continue;let ua=Math.round(Math.abs(qt-F)/Z*120);ct.style.setProperty("--wave-delay",`${ua}ms`),ct.classList.remove("is-wave"),ct.offsetWidth,ct.classList.add("is-wave");let la=T.get(ct);la&&window.clearTimeout(la),T.set(ct,window.setTimeout(()=>{ct.classList.remove("is-wave"),T.delete(ct)},340+ua))}}let W=f[R];if(W){W.classList.remove("is-wave");let Z=T.get(W);Z&&(window.clearTimeout(Z),T.delete(W)),W.classList.add("is-active")}if(m=R,B){let Z=performance.now();if(Z-k>26&&typeof navigator.vibrate=="function"){try{navigator.vibrate(3)}catch{}k=Z}}}s.setAttribute("aria-valuenow",String(Math.round(g))),s.setAttribute("aria-valuetext",t.format(g)),o&&(o.textContent=t.format(g)),z()},tt=(M,B,R,F,W=v)=>{l=M,c=B,h=Math.max(1e-4,R),p=Math.max(h,F),v=W,U(),s.setAttribute("aria-valuemin",String(l)),s.setAttribute("aria-valuemax",String(c)),P(_(g,l,c),!1)},I=M=>{s.setAttribute("aria-label",M),r&&(r.textContent=M)},L=M=>{y=M,e.classList.toggle("is-disabled",y),s.tabIndex=y?-1:0,s.setAttribute("aria-disabled",String(y)),o&&(o.disabled=y),y&&(S=null)},G=()=>{s.focus({preventScroll:!0})},j=M=>{let B=s.getBoundingClientRect(),R=10,F=Math.max(1,B.width-R*2),W=_((M-B.left-R)/F,0,1);return D(l+W*(c-l))},K=M=>{if(!y&&!(M.pointerType==="mouse"&&M.button!==0)){M.preventDefault(),M.stopPropagation(),s.focus({preventScroll:!0}),S=M.pointerId,b=g,w=M.clientX;try{s.setPointerCapture(M.pointerId)}catch{}if(!n){let B=j(M.clientX);P(B,!0),t.onInput(B,"pointer")}t.onDragStart?.()}},Q=M=>{if(y||S!==M.pointerId)return;if(M.preventDefault(),n){let R=s.getBoundingClientRect(),F=Math.max(1,R.width-20),W=(M.clientX-w)/F,Z=D(b-W*(c-l));if(Math.abs(Z-g)<.001)return;P(Z,!0),t.onInput(Z,"pointer");return}let B=j(M.clientX);Math.abs(B-g)<.001||(P(B,!0),t.onInput(B,"pointer"))},O=M=>{if(S===M.pointerId){S=null;try{s.releasePointerCapture(M.pointerId)}catch{}t.onDragEnd?.()}},st=M=>{if(y)return;let B=Math.max(h,h*10),R=g;switch(M.key){case"ArrowLeft":case"ArrowDown":R-=h;break;case"ArrowRight":case"ArrowUp":R+=h;break;case"PageDown":R-=B;break;case"PageUp":R+=B;break;case"Home":R=l;break;case"End":R=c;break;default:return}M.preventDefault(),R=D(R),P(R,!0),t.onInput(R,"keyboard")};return s.addEventListener("pointerdown",K),s.addEventListener("pointermove",Q),s.addEventListener("pointerup",O),s.addEventListener("pointercancel",O),s.addEventListener("keydown",st),U(),s.setAttribute("aria-valuemin",String(l)),s.setAttribute("aria-valuemax",String(c)),P(_(t.defaultValue,l,c),!1),{row:e,rail:s,set:P,setRange:tt,setLabel:I,setDisabled:L,focus:G}}buildSheet(){let t=x("div","au-sheetwrap");t.setAttribute("aria-hidden","true");let e=x("div","au-sheet");e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-label",this.s.exportTitle);let r=Ut.filter(u=>this.exportTypes.includes(u.type)),o=r.map(u=>`<button type="button" data-format="${u.type}" aria-pressed="false">${u.label}</button>`).join(""),s=!!this.onSaveCopyCb;e.innerHTML=`
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
    `,N(e,".au-sheet__title").textContent=this.s.exportTitle,N(e,".au-sheet__sub").textContent=this.s.exportSub,N(e,"[data-format-label]").textContent=this.s.format,this.metaName=N(e,"[data-meta-name]"),this.metaInfo=N(e,"[data-meta-info]"),this.qualityRow=N(e,"[data-quality-row]"),this.progressEl=N(e,"[data-progress]"),this.progressBar=N(e,"[data-progress-bar]"),this.progressText=N(e,"[data-progress-pct]"),this.progressLabel=N(e,"[data-progress-label]"),this.progressCancel=N(e,"[data-progress-cancel]"),this.progressCancel.textContent=this.s.cancelExport,this.progressCancel.addEventListener("click",()=>this.exportAbort?.abort()),this.qualityControl=this.makeTicks({label:this.s.quality,min:10,max:100,step:1,tickStep:3,defaultValue:92,head:!0,format:u=>`${Math.round(u)}%`,onInput:u=>this.applyQuality(u),onReset:()=>this.applyQuality(92)}),this.qualityRow.appendChild(this.qualityControl.row),this.saveImageBtn=N(e,".au-primary"),this.saveImageBtn.insertAdjacentHTML("afterbegin",H("save")),this.saveLabel=N(e,"[data-save-label]"),this.saveLabel.textContent=s?this.s.overwrite:this.s.saveImage,s&&(this.saveCopyBtn=N(e,".au-copy"),this.saveCopyBtn.insertAdjacentHTML("afterbegin",H("copy")),this.saveCopyLabel=N(e,"[data-copy-label]"),this.saveCopyLabel.textContent=this.s.saveCopy);let n=N(e,".au-cancel");n.textContent=this.s.cancel;for(let u of r){let l=N(e,`[data-format="${u.type}"]`);l.addEventListener("click",()=>{this.exportType=u.type,this.updateSheet()}),this.formatButtons.set(u.type,l)}this.saveImageBtn.addEventListener("click",()=>{this.saveImage("overwrite")}),this.saveCopyBtn?.addEventListener("click",()=>{this.saveImage("copy")}),n.addEventListener("click",()=>this.closeSheet()),t.addEventListener("click",u=>{u.target===t&&this.closeSheet()}),t.appendChild(e),this.root.appendChild(t),this.sheetWrap=t,this.applyQuality(92)}buildTextLayer(){let t=x("div","au-textlayer");t.setAttribute("aria-hidden","true"),this.work.appendChild(t),this.textLayer=t}buildBG(){let t=x("div","au-ai au-bg-panel");t.hidden=!0,t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label",this.s.bgTitle);let e=x("div","au-ai__panel au-glass"),r=x("div","au-ai__head"),o=x("span","au-ai__badge");o.innerHTML=H("bg");let s=x("div","au-ai__copy"),n=x("strong");n.textContent=this.s.bgRunning;let u=x("span","au-ai__detail");u.textContent=this.s.bgRunning,s.append(n,u),r.append(o,s);let l=x("button","au-ai__cancel au-glass");l.type="button",l.textContent=this.s.aiCancel,l.addEventListener("click",()=>this.bgAbort?.abort()),r.appendChild(l),e.appendChild(r),t.appendChild(e),this.root.appendChild(t),this.bgPanel=t,this.bgDetail=u}buildAI(){if(!this.aiAction)return;let t=x("div","au-ai");t.hidden=!0,t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label",this.s.aiRunning);let e=x("div","au-ai__panel au-glass"),r=x("div","au-ai__head"),o=x("span","au-ai__badge");o.innerHTML=H("ai");let s=x("div","au-ai__copy"),n=x("strong");n.textContent=this.s.aiRunning;let u=x("span","au-ai__detail");u.textContent=this.s.aiPreparing,s.append(n,u),r.append(o,s);let l=x("button","au-ai__cancel au-glass");l.type="button",l.textContent=this.s.aiCancel,l.addEventListener("click",()=>this.aiAbort?.abort()),r.appendChild(l);let c=x("div","au-ai__track"),h=x("span");c.appendChild(h),e.append(r,c),t.appendChild(e),this.root.appendChild(t),this.aiPanel=t,this.aiDetail=u,this.aiBar=h}reportAI(t,e){if(!this.aiPanel||this.aiPanel.hidden)return;let r=!Number.isFinite(t)||t<0;this.aiPanel.classList.toggle("is-indeterminate",r),this.aiBar.style.width=r?"100%":`${Math.round(_(t,0,1)*100)}%`,e?this.aiDetail.textContent=e:r||(this.aiDetail.textContent=`${Math.round(t*100)}%`)}saveCurrentPreset(t){if(!this.isReady)return;let e=t??this.filterNameInput,r=(e?.value??"").trim()||`${this.s.filterTitle} ${new Date().toLocaleTimeString(this.locale==="vi"?"vi-VN":"en-US",{hour:"2-digit",minute:"2-digit"})}`;if(this.userPresets.some(n=>n.name.toLowerCase()===r.toLowerCase())){this.toast(this.s.presetExists,!0),e?.focus();return}let o=this.getState(),s={id:`u${Date.now().toString(36)}`,name:r,createdAt:Date.now(),filter:o.filter,adjust:{...o.adjust},enhance:JSON.parse(JSON.stringify(o.enhance))};this.userPresets=[s,...this.userPresets].slice(0,24),Ha(this.userPresets),e&&(e.value=""),this.renderSavedPresets(),this.toast(this.s.presetSaved)}renderSavedPresets(){if(this.savedList){if(this.savedList.replaceChildren(),!this.userPresets.length){let t=x("div","au-saved__empty");t.textContent=this.s.noSaved,this.savedList.appendChild(t);return}for(let t of this.userPresets){let e=x("div","au-saved-card"),r=x("span","au-saved-card__label");r.textContent=t.name;let o=x("button","au-saved-card__apply");o.type="button",o.textContent=this.s.apply,o.setAttribute("aria-label",`${this.s.apply}: ${t.name}`),o.addEventListener("click",()=>this.applyUserPreset(t));let s=x("button","au-saved-card__del au-icon au-glass");s.type="button",s.innerHTML=H("trash"),s.setAttribute("aria-label",`${this.s.deletePreset}: ${t.name}`),s.addEventListener("click",()=>{this.userPresets=this.userPresets.filter(n=>n.id!==t.id),Ha(this.userPresets),this.renderSavedPresets(),this.toast(this.s.presetDeleted)}),e.append(r,o,s),this.savedList.appendChild(e)}}}applyUserPreset(t){if(!this.isReady)return;let r={...this.getState(),filter:t.filter,adjust:{...t.adjust},enhance:JSON.parse(JSON.stringify(t.enhance))};this.setState(r),this.syncUI(),this.toast(this.s.presetApplied)}selectedLayer(){return this.texts.find(t=>t.id===this.selectedTextId)}addTextLayer(){if(!this.isReady)return;let t=qa(),e=this.texts.length;t.x=.5+(e%3-1)*.06,t.y=.42+e%4*.08,this.texts.push(t),this.selectedTextId=t.id;let r=this.createTextNode(t);this.textLayer.appendChild(r),this.syncTextControls(t),this.positionTexts(),this.openInlineTextEditor(r,t)}createTextNode(t){let e=x("div","au-textnode");e.dataset.textId=t.id,e.setAttribute("aria-hidden","true");let r=document.createElement("span");r.className="au-text-span",r.textContent=t.text,e.appendChild(r);let o=document.createElement("span");o.className="au-text-hud",o.setAttribute("aria-hidden","true"),e.appendChild(o);let s=document.createElement("span");s.className="au-text-handle au-text-handle--scale",s.setAttribute("aria-hidden","true");let n=document.createElement("span");n.className="au-text-handle au-text-handle--rotate",n.setAttribute("aria-hidden","true");let u=document.createElement("span");u.className="au-text-handle-stem",u.setAttribute("aria-hidden","true"),e.append(u,s,n);let l=(f,m)=>{f.addEventListener("pointerdown",g=>{if(g.target!==f&&!f.contains(g.target))return;g.preventDefault(),g.stopPropagation(),this.selectedTextId=t.id,this.syncTextControls(t);try{f.setPointerCapture(g.pointerId)}catch{}let y=this.displayCropRect(),S=y?{x:y.x+t.x*y.width,y:y.y+t.y*y.height}:null;if(!S||!y)return;let b=g.clientX,w=g.clientY,k=t.size,T=t.rotation,A=Math.max(1,Math.hypot(g.clientX-(this.stage.getBoundingClientRect().left+S.x),g.clientY-(this.stage.getBoundingClientRect().top+S.y))),D=Math.atan2(g.clientY-(this.stage.getBoundingClientRect().top+S.y),g.clientX-(this.stage.getBoundingClientRect().left+S.x)),U=z=>{if(z.pointerId!==g.pointerId)return;z.preventDefault(),z.stopPropagation();let P=this.stage.getBoundingClientRect(),tt=Math.max(1,Math.hypot(z.clientX-(P.left+S.x),z.clientY-(P.top+S.y))),I=Math.atan2(z.clientY-(P.top+S.y),z.clientX-(P.left+S.x));if(m==="scale"){let L=tt/A;t.size=_(k*L,.02,.24),this.positionTexts()}else{let L=(I-D)*180/Math.PI;t.rotation=Math.round((T+L+540)%360-180),this.positionTexts()}},C=z=>{z.pointerId===g.pointerId&&(f.removeEventListener("pointermove",U),f.removeEventListener("pointerup",C),f.removeEventListener("pointercancel",C),this.syncTextControls(t))};f.addEventListener("pointermove",U),f.addEventListener("pointerup",C),f.addEventListener("pointercancel",C)})};l(s,"scale"),l(n,"rotate");let c=new Map,h=null,p=0;e.addEventListener("pointerdown",f=>{f.preventDefault(),f.stopPropagation();let m=performance.now();if(m-p<320){this.selectedTextId=t.id,this.syncTextControls(t),this.openInlineTextEditor(e,t),p=0;return}p=m,this.selectedTextId=t.id,this.syncTextControls(t);try{e.setPointerCapture(f.pointerId)}catch{}if(c.set(f.pointerId,{x:f.clientX,y:f.clientY}),c.size===1)h={mode:"drag",ox:f.clientX,oy:f.clientY,startOX:t.x,startOY:t.y,startDist:0,startAngle:0,startSize:t.size,startRot:t.rotation,midX:f.clientX,midY:f.clientY,lastX:f.clientX,lastY:f.clientY,velX:0,velY:0};else if(c.size===2){let[g,y]=Array.from(c.values()),S=y.x-g.x,b=y.y-g.y;h={mode:"pinch",ox:0,oy:0,startOX:t.x,startOY:t.y,startDist:Math.max(1,Math.hypot(S,b)),startAngle:Math.atan2(b,S),startSize:t.size,startRot:t.rotation,midX:(g.x+y.x)/2,midY:(g.y+y.y)/2,lastX:f.clientX,lastY:f.clientY,velX:0,velY:0}}}),e.addEventListener("pointermove",f=>{if(!h)return;c.set(f.pointerId,{x:f.clientX,y:f.clientY});let m=this.displayCropRect();if(!(!m||m.width<2||m.height<2)){if(h.mode==="drag"){let g=f.clientX-h.ox,y=f.clientY-h.oy,S=h.startOX+g/m.width,b=h.startOY+y/m.height;S=S<0?S*.55:S>1?1+(S-1)*.55:S,b=b<0?b*.55:b>1?1+(b-1)*.55:b,t.x=ot(S),t.y=ot(b),h.velX=f.clientX-h.lastX,h.velY=f.clientY-h.lastY,h.lastX=f.clientX,h.lastY=f.clientY,this.positionTexts()}else if(h.mode==="pinch"){let[g,y]=Array.from(c.values()),S=y.x-g.x,b=y.y-g.y,w=Math.max(1,Math.hypot(S,b)),k=Math.atan2(b,S),T=w/h.startDist,A=h.startSize*T;t.size=A,t.size<.02&&(t.size=.02+(t.size-.02)*.5),t.size>.24&&(t.size=.24+(t.size-.24)*.5),t.size=_(t.size,.015,.3);let D=(k-h.startAngle)*180/Math.PI;t.rotation=Math.round((h.startRot+D+540)%360-180);let U=(g.x+y.x)/2,C=(g.y+y.y)/2,z=U-h.midX,P=C-h.midY;t.x=ot(h.startOX+z/m.width),t.y=ot(h.startOY+P/m.height),this.positionTexts()}}});let v=f=>{if(c.delete(f.pointerId),c.size===0&&h){let m=t.size,g=_(m,.02,.24);if(Math.abs(m-g)>.001){let y=0,S=m,b=performance.now(),w=k=>{let T=Math.min(.032,(k-b)/1e3);b=k;let A=120,D=22,U=1,C=-A*(S-g)-D*y;y+=C/U*T,S+=y*T,t.size=S,this.positionTexts(),Math.abs(S-g)>5e-4||Math.abs(y)>.5?requestAnimationFrame(w):(t.size=g,this.positionTexts())};requestAnimationFrame(w)}this.syncTextControls(t),h=null}else if(c.size===1&&h){let[m]=Array.from(c.values());h={mode:"drag",ox:m.x,oy:m.y,startOX:t.x,startOY:t.y,startDist:0,startAngle:0,startSize:t.size,startRot:t.rotation,midX:m.x,midY:m.y,lastX:m.x,lastY:m.y,velX:0,velY:0}}};return e.addEventListener("pointerup",v),e.addEventListener("pointercancel",v),e.addEventListener("dblclick",f=>{f.preventDefault(),this.selectedTextId=t.id,this.syncTextControls(t),this.openInlineTextEditor(e,t)}),this.syncTextLayerStyle(e,t),e}syncTextLayerEl(t){let e=this.textLayer?.querySelector(`[data-text-id="${t.id}"]`);if(!e)return;let r=e.querySelector(".au-text-span");r?r.textContent=t.text:e.textContent=t.text,e.querySelector(".au-text-handle--scale"),this.syncTextLayerStyle(e,t),this.positionTexts()}openInlineTextEditor(t,e){let r=t.querySelector(".au-text-inline");if(r){r.focus();return}let o=document.createElement("textarea");o.className="au-text-inline",o.value=e.text,o.rows=1,o.maxLength=120,o.spellcheck=!1,o.placeholder=this.s.textInput,o.setAttribute("aria-label",this.s.textInput),o.addEventListener("pointerdown",n=>n.stopPropagation()),o.addEventListener("input",()=>{e.text=o.value;let n=t.querySelector(".au-text-span");n&&(n.textContent=e.text),this.positionTexts()});let s=()=>{e.text=o.value;let n=t.querySelector(".au-text-span");n&&(n.textContent=e.text),o.remove(),this.syncTextLayerEl(e),this.positionTexts()};o.addEventListener("keydown",n=>{n.key==="Enter"&&!n.shiftKey&&(n.preventDefault(),s()),n.key==="Escape"&&(n.preventDefault(),s())}),o.addEventListener("blur",s),t.appendChild(o),requestAnimationFrame(()=>{o.focus(),o.select()})}syncTextLayerStyle(t,e){let r=$t.find(n=>n.id===e.font)??$t[0],o=this.displayCropRect(),s=Math.max(10,(o?o.height:320)*e.size);t.style.fontFamily=r.stack,t.style.fontSize=`${s}px`,t.style.color=e.color,t.style.fontWeight=e.bold?"700":"400",t.style.fontStyle=e.italic?"italic":"normal",t.style.textAlign=e.align,t.style.opacity=String(e.opacity),t.classList.toggle("is-selected",e.id===this.selectedTextId),t.classList.toggle("is-outline",e.outline),t.classList.toggle("is-shadow",e.shadow&&!e.outline)}syncTextControls(t){this.textInput&&(this.textInput.value=t.text),this.textSizeTicks&&this.textSizeTicks.set(Math.round(t.size*100),!1),this.textOpacityTicks&&(document.activeElement===this.textOpacityTicks.rail||this.textOpacityTicks.set(Math.round(t.opacity*100),!1)),this.textRotateTicks&&this.textRotateTicks.set(Math.round(t.rotation),!1);for(let e of Array.from(this.textLayer.querySelectorAll(".au-textnode"))){let r=this.texts.find(o=>o.id===e.dataset.textId);r&&this.syncTextLayerStyle(e,r)}}displayCropRect(){if(!this.isReady)return null;let t=this.viewport(),e=this.currentFrame();if(e.width<2||e.height<2)return null;let r=Math.min(t.width/e.width,t.height/e.height),o=e.width*r,s=e.height*r;return{x:(t.width-o)/2,y:(t.height-s)/2,width:o,height:s}}positionTexts(){if(!this.textLayer)return;let t=this.displayCropRect(),e=this.isReady&&this.currentTab!=="crop";if(this.textLayer.style.display=e?"block":"none",!!t)for(let r of Array.from(this.textLayer.querySelectorAll(".au-textnode"))){let o=this.texts.find(l=>l.id===r.dataset.textId);if(!o)continue;let s=t.x+o.x*t.width,n=t.y+o.y*t.height;r.style.transform=`translate(-50%,-50%) translate(${s}px,${n}px) rotate(${o.rotation}deg)`;let u=Math.max(10,t.height*o.size);r.style.fontSize!==`${u}px`&&(r.style.fontSize=`${u}px`)}}deleteSelectedText(){if(!this.selectedTextId)return;this.texts=this.texts.filter(e=>e.id!==this.selectedTextId),this.selectedTextId=this.texts[0]?.id??null,this.textLayer?.querySelector(`[data-text-id="${this.selectedTextId}"]`),this.textLayer.replaceChildren();for(let e of this.texts)this.textLayer.appendChild(this.createTextNode(e));let t=this.selectedLayer();t?this.syncTextControls(t):this.textInput&&(this.textInput.value=""),this.positionTexts()}duplicateSelectedText(){let t=this.selectedLayer();if(!t)return;let e={...t,id:`t${Date.now().toString(36)}${Math.floor(Math.random()*1e4).toString(36)}`,x:ot(t.x+.05),y:ot(t.y+.05)};this.texts.push(e),this.selectedTextId=e.id,this.textLayer.appendChild(this.createTextNode(e)),this.syncTextControls(e),this.positionTexts()}async runBackground(t){if(this.bgBusy||!this.isReady)return;if(!this.backgroundAction){this.toast(this.s.bgNeedHost,!0);return}let e=new AbortController;this.bgBusy=!0,this.bgAbort=e,this.bgPanel.hidden=!1,this.bgPanel.classList.add("is-open"),this.bgDetail.textContent=this.s.bgRunning;let r=this.sourceBitmap(),o=this.source();try{let s=await this.backgroundAction.run(this,{signal:e.signal,report:(n,u)=>{u&&(this.bgDetail.textContent=u)},modelId:this.bgModel},t,this.bgModel);if(e.signal.aborted)return;if(s&&s.mask){let n=s;r?(this.enterRefine(r,o.width,o.height,n.mask,n.maskWidth,n.maskHeight,t,n.modelId),this.toast("AI xong — chỉnh cọ rồi Hoàn tất")):this.toast(this.s.bgDone);return}e.signal.aborted||this.toast(this.s.bgDone)}catch(s){ut(s)||e.signal.aborted?this.toast(this.s.aiCancelled):this.toast(this.s.bgFailed,!0)}finally{this.bgBusy=!1,this.bgAbort=null,this.bgPanel.classList.remove("is-open"),this.bgPanel.hidden=!0}}async compositeTexts(t){if(!this.texts.length)return t;let e=null;try{e=await createImageBitmap(t)}catch{let h=URL.createObjectURL(t),p=new Image;p.src=h;try{await p.decode(),e=p}catch{e=null}window.setTimeout(()=>URL.revokeObjectURL(h),4e3)}if(!e)return t;let r=document.createElement("canvas");r.width=e.width,r.height=e.height;let o=r.getContext("2d");if(!o)return t;o.drawImage(e,0,0);let s=r.width,n=r.height;for(let h of this.texts){let p=h.text.trim();if(!p)continue;let v=$t.find(m=>m.id===h.font)??$t[0],f=Math.max(8,n*h.size);o.save(),o.translate(h.x*s,h.y*n),o.rotate((h.rotation||0)*Math.PI/180),o.globalAlpha=ot(h.opacity),o.font=`${h.italic?"italic ":""}${h.bold?"700 ":"400 "}${f}px ${v.stack}`,o.textAlign=h.align,o.textBaseline="middle",h.outline?(o.lineWidth=Math.max(1,f*.09),o.strokeStyle="rgba(0,0,0,.85)",o.lineJoin="round",o.strokeText(p,0,0)):h.shadow&&(o.shadowColor="rgba(0,0,0,.45)",o.shadowBlur=f*.18,o.shadowOffsetY=f*.04),o.fillStyle=h.color,o.fillText(p,0,0),o.restore()}let u=t.type||this.exportType,l=u==="image/png"?void 0:this.quality/100;return await new Promise(h=>{u==="image/png"?r.toBlob(h,u):r.toBlob(h,u,l)})??t}async runAIAction(){if(!this.aiAction||this.aiBusy||!this.isReady||this.saving)return;let t=new AbortController;this.aiBusy=!0,this.aiAbort=t,this.aiBtn&&(this.aiBtn.disabled=!0,this.aiBtn.classList.add("is-busy")),this.setAICompareVisible(!1),this.aiPanel.hidden=!1,this.aiPanel.classList.add("is-open"),this.reportAI(-1,this.s.aiPreparing);try{await this.aiAction.run(this,{signal:t.signal,report:(e,r)=>this.reportAI(e,r)}),t.signal.aborted||(this.setAICompareVisible(this.canRevertAI()),this.toast(this.s.aiDone))}catch(e){ut(e)||t.signal.aborted?this.toast(this.s.aiCancelled):this.toast(e instanceof Error&&e.message?e.message:this.s.aiFailed,!0)}finally{this.aiBusy=!1,this.aiAbort=null,this.aiBtn&&(this.aiBtn.disabled=!1,this.aiBtn.classList.remove("is-busy")),this.aiPanel.classList.remove("is-open"),this.aiPanel.hidden=!0,this.aiPanel.classList.remove("is-indeterminate"),this.aiBar.style.width="0%"}}buildToast(){let t=x("div","au-toast");t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),this.root.appendChild(t),this.toastEl=t}bindEvents(){this.on("ready",()=>{this.root.classList.add("au-ready"),this.setLiquify(!1),this.texts=[],this.selectedTextId=null,this.textLayer?.replaceChildren(),this.textInput&&(this.textInput.value=""),this.positionTexts(),this.setAICompareVisible(!1),this.buildFilters(),this.fitToFrame(),this.positionFrame(this.currentFrame()),this.syncUI(),this.setCropMode(this.cropMode),window.requestAnimationFrame(()=>{this.centerMode(this.cropMode),this.centerAspectChip(this.getState().crop.aspect,!1)})}),this.on("loading",({loading:t})=>{this.root.classList.toggle("au-busy",t),t&&this.root.classList.remove("au-dragover")}),this.on("change",()=>{this.syncUI(),this.positionFrame(this.currentFrame())}),this.on("history",()=>this.syncHistory()),this.on("render",({frame:t})=>{this.positionFrame(t),this.positionTexts()}),this.on("error",({error:t})=>this.toast(t.message||this.s.exportFailed,!0)),this.frameEl.addEventListener("pointerdown",this.onCropPointerDown),this.frameEl.addEventListener("keydown",this.onCropKeyDown),this.stage.addEventListener("pointerdown",this.tapToPlaceText),this.root.addEventListener("keydown",t=>{if(t.key==="Escape"&&this.sheetWrap.classList.contains("is-open")){t.preventDefault(),this.closeSheet();return}if(t.key==="Tab"&&this.sheetWrap.classList.contains("is-open")){let r=Array.from(this.sheetWrap.querySelectorAll('button:not([disabled]),input:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')).filter(u=>u.getClientRects().length>0);if(!r.length)return;let o=r[0],s=r[r.length-1],n=document.activeElement;t.shiftKey&&(n===o||!this.sheetWrap.contains(n))?(t.preventDefault(),s.focus()):!t.shiftKey&&(n===s||!this.sheetWrap.contains(n))&&(t.preventDefault(),o.focus());return}if(!t.metaKey&&!t.ctrlKey)return;let e=t.key.toLowerCase();e==="z"?(t.preventDefault(),t.shiftKey?this.redo():this.undo()):e==="y"&&(t.preventDefault(),this.redo())})}aspectLabel(t){return t==="free"?this.s.aspectFree:t==="screen"?this.s.aspectScreen:t}cancel(){if(this.onCloseCb){this.onCloseCb();return}this.root.dispatchEvent(new CustomEvent("aurum:cancel",{bubbles:!0})),this.reset(),this.setTab("crop"),this.toast(this.s.cancelled)}async openSource(t){try{await this.load(t)}catch{}}setTab(t){t!=="adjust"&&this.setLiquify(!1),t!=="text"&&this.textPlacing&&(this.textPlacing=!1,this.textPlaceBtn?.setAttribute("aria-pressed","false"),this.textPlaceBtn?.classList.remove("is-active"),this.root.classList.remove("au-text-placing")),t!=="crop"&&(this.cropDrag&&this.endCropDrag(),this.clearTransient()),this.currentTab=t;for(let[r,o]of this.tabButtons){let s=r===t;o.setAttribute("aria-selected",String(s)),o.tabIndex=s?0:-1}for(let[r,o]of this.panes)o.classList.toggle("is-active",r===t);let e=t!=="crop";this.setResultMode(e),this.root.classList.toggle("is-result",e),this.refineCanvas&&(this.refineCanvas.style.display=this.refineOn&&t==="ai"?"block":"none"),this.refineOn&&t==="ai"&&this.drawRefinePreview(),this.positionTexts(),e||(this.positionFrame(this.currentFrame()),window.requestAnimationFrame(()=>{this.centerMode(this.cropMode),this.isReady&&this.centerAspectChip(this.getState().crop.aspect,!1)}))}clearTransient(){this.root.classList.remove("au-cropping","au-ratioing","au-rotating"),this.frameEl?.classList.remove("is-rotating"),this.ratioTimer&&(window.clearTimeout(this.ratioTimer),this.ratioTimer=0),this.cropKeyTimer&&(window.clearTimeout(this.cropKeyTimer),this.cropKeyTimer=0)}beginRotationDrag(){this.root.classList.add("au-rotating"),this.frameEl.classList.add("is-rotating")}endRotationDrag(){this.root.classList.remove("au-rotating"),this.frameEl.classList.remove("is-rotating")}centerMode(t){let e=t==="ratio"?this.ratioBtn:t==="rotation"?this.rotationBtn:t==="perspectiveY"?this.perspectiveYBtn:this.perspectiveXBtn;if(!this.modesWrap||!this.modesTrack||!e)return;let r=this.modesWrap.clientWidth;if(r<=0)return;let o=this.modesTrack.scrollWidth,s=o<=r?(r-o)/2:_(r/2-(e.offsetLeft+e.offsetWidth/2),r-o,0);this.modesTrack.style.transform=`translate3d(${s}px,0,0)`}centerAspectChip(t,e=!0){let r=this.aspectButtons.get(t),o=this.chipsEl;if(!r||!o)return;let s=o.clientWidth;if(s<=0)return;let n=r.offsetLeft-(s-r.offsetWidth)/2,u=_(n,0,Math.max(0,o.scrollWidth-s)),l=typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;e&&!l&&typeof o.scrollTo=="function"?o.scrollTo({left:u,behavior:"smooth"}):o.scrollLeft=u}markRatioing(){this.root.classList.add("au-ratioing"),this.ratioTimer&&window.clearTimeout(this.ratioTimer),this.ratioTimer=window.setTimeout(()=>{this.root.classList.remove("au-ratioing"),this.ratioTimer=0},520)}markCropKeying(){this.root.classList.add("au-cropping"),this.cropKeyTimer&&window.clearTimeout(this.cropKeyTimer),this.cropKeyTimer=window.setTimeout(()=>{this.root.classList.remove("au-cropping"),this.cropKeyTimer=0},420)}chooseAspect(t){this.isReady&&(this.setAspect(t),this.markRatioing(),this.positionFrame(this.currentFrame()))}setCropMode(t){this.cropMode=t;let e=t==="ratio",r=t==="rotation",o=t==="perspectiveY",s=t==="perspectiveX";this.ratioBtn.classList.toggle("is-active",e),this.ratioBtn.setAttribute("aria-pressed",String(e)),this.rotationBtn.classList.toggle("is-active",r),this.rotationBtn.setAttribute("aria-pressed",String(r)),this.perspectiveYBtn.classList.toggle("is-active",o),this.perspectiveYBtn.setAttribute("aria-pressed",String(o)),this.perspectiveXBtn.classList.toggle("is-active",s),this.perspectiveXBtn.setAttribute("aria-pressed",String(s)),this.ratioContext.classList.toggle("is-active",e),this.rotationContext.classList.toggle("is-active",r),this.perspectiveYContext.classList.toggle("is-active",o),this.perspectiveXContext.classList.toggle("is-active",s),this.cropResetBtn.classList.toggle("is-left",e);let n=e?this.s.resetCrop:r?this.s.resetRotation:o?this.s.resetPerspectiveY:this.s.resetPerspectiveX;this.cropResetBtn.title=n,this.cropResetBtn.setAttribute("aria-label",n),window.requestAnimationFrame(()=>{this.centerMode(t),e&&this.isReady&&this.centerAspectChip(this.getState().crop.aspect,!0)})}resetCropMode(){this.cropMode==="rotation"?this.resetRotation():this.cropMode==="perspectiveY"?(this.setPerspective({perspectiveY:0},"perspective"),this.syncUI()):this.cropMode==="perspectiveX"?(this.setPerspective({perspectiveX:0},"perspective"),this.syncUI()):(this.resetCrop(),this.markRatioing(),this.positionFrame(this.currentFrame()))}buildLiquifyOverlay(){let t=x("div","au-brush-ring");t.setAttribute("aria-hidden","true"),this.stage.appendChild(t),this.liquifyRing=t,this.stage.addEventListener("pointerdown",this.onLiquifyPointerDown,{passive:!1}),this.stage.addEventListener("pointermove",this.onLiquifyPointerMove,{passive:!1}),this.stage.addEventListener("pointerup",this.onLiquifyPointerUp),this.stage.addEventListener("pointercancel",this.onLiquifyPointerUp),this.stage.addEventListener("pointerleave",()=>{!this.liquifyStroke&&this.liquifyRing&&(this.liquifyRing.style.display="none")})}setLiquify(t){t&&!this.isReady||this.liquifyOn!==t&&(this.liquifyOn=t,this.root.classList.toggle("au-liquify",t),this.liquifyButton?.setAttribute("aria-pressed",String(t)),this.adjustContext&&(this.adjustContext.style.display=t?"none":""),this.liquifyContext&&(this.liquifyContext.style.display=t?"":"none"),this.stage.style.cursor=t?"crosshair":"grab",t?(this.liquifyTicks?.set(this.liquifySize,!1),this.liquifyValue&&(this.liquifyValue.textContent=`${this.liquifySize}%`),this.liquifyButton&&window.requestAnimationFrame(()=>this.centerAdjustChip(this.liquifyButton))):(this.liquifyStroke=null,this.liquifyRing&&(this.liquifyRing.style.display="none")))}setLiquifySize(t,e=!0){let r=_(Math.round(t),1,20);this.liquifySize=r,e&&this.liquifyTicks?.set(r,!1),this.liquifyValue&&(this.liquifyValue.textContent=`${r}%`)}clearLiquifyDabs(){!this.isReady||!this.hasLiquify()||(this.clearLiquify(),this.syncUI())}liquifyRadius(){return this.liquifySize/100}liquifyScreenRadius(){let t=this.liquifyRadius(),e=this.screenPointAt(.5,.5),r=this.screenPointAt(Math.min(1,.5+t),.5);return!e||!r?24:Math.max(4,Math.hypot(r.x-e.x,r.y-e.y))}previewLiquifyRing(t,e){let r=this.liquifyRing;if(!r)return;if(!this.liquifyOn){r.style.display="none";return}let o=this.sourcePointAt(t,e),s=o?this.screenPointAt(o.x,o.y):null;if(!s){r.style.display="none";return}let n=this.liquifyScreenRadius();r.style.display="block",r.style.width=`${n*2}px`,r.style.height=`${n*2}px`,r.style.transform=`translate3d(${s.x-n}px,${s.y-n}px,0)`}selectAdjust(t){this.liquifyOn&&this.setLiquify(!1),this.adjustKey=t;for(let[n,u]of this.adjustButtons)u.setAttribute("aria-pressed",String(n===t));let[e,r]=et[t];this.adjustTicks.setRange(e,r,1,2,e<0),this.adjustTicks.setLabel(this.s[t]);let o=this.isReady?Math.round(this.getState().adjust[t]):0;this.adjustTicks.set(o,!1),this.adjustValue.textContent=this.formatAdjust(o),this.adjustValue.title=`${this.s.reset}: ${this.s[t]}`,this.adjustValue.setAttribute("aria-label",`${this.s.reset}: ${this.s[t]}`);let s=this.adjustButtons.get(t);s&&window.requestAnimationFrame(()=>this.centerAdjustChip(s))}centerAdjustChip(t){let e=this.paramsEl;if(!e||this.currentTab!=="adjust")return;let r=t.getBoundingClientRect(),o=e.getBoundingClientRect();if(!r.width||!o.width)return;let s=r.left-o.left-(o.width-r.width)/2;Math.abs(s)<1||e.scrollBy({left:s,behavior:"smooth"})}async runAuto(){if(this.autoBusy||!this.isReady)return;this.autoBusy=!0,this.autoBtn.disabled=!0,this.autoBtn.classList.add("is-busy");let t=this.autoLabel.textContent||this.s.auto;this.autoLabel.textContent=this.s.autoRunning;try{await this.autoEnhance(),this.syncUI(),this.toast(this.s.autoDone)}catch(e){ut(e)||this.toast(this.s.autoFailed,!0)}finally{this.autoBusy=!1,this.autoBtn.disabled=!1,this.autoBtn.classList.remove("is-busy"),this.autoLabel.textContent=t}}formatAdjust(t){let[e]=et[this.adjustKey];return e>=0?String(Math.round(t)):St(Math.round(t))}buildFilters(){let t=this.getPreviewBitmap();if(!t)return;let e=this.source(),r=this.getState().filter;this.filterWrap.replaceChildren(),this.filterButtons.clear();let o=Mt.filter(n=>this.filterCat==="all"||n.category===this.filterCat);for(let n of o){let u=x("button","au-filter");u.type="button";let l=Ea(t,e.width,e.height,n.id),c=x("span"),h=this.locale==="en"?n.labelEn:n.label;c.textContent=h,u.append(l,c),u.setAttribute("aria-pressed",String(r===n.id)),u.setAttribute("aria-label",h),u.addEventListener("click",()=>{this.setFilter(n.id);let p=Mt.find(v=>v.id===n.id);this.filterHint&&p?.hint&&(this.filterHint.textContent=p.hint,this.filterHint.classList.add("is-visible"))}),this.filterWrap.appendChild(u),this.filterButtons.set(n.id,u)}let s=Mt.find(n=>n.id===r);this.filterHint&&s?.hint?this.filterHint.textContent=s.hint:this.filterHint&&(this.filterHint.textContent="")}syncUI(){let t=this.isReady;if(this.root.classList.toggle("au-ready",t),this.saveBtn.disabled=!t,!t)return;let e=this.getState(),r=document.activeElement;for(let[u,l]of this.aspectButtons)l.setAttribute("aria-pressed",String(e.crop.aspect===u));this.lastAspect!==e.crop.aspect&&(this.lastAspect=e.crop.aspect,this.currentTab==="crop"&&this.centerAspectChip(e.crop.aspect,!0)),this.flipButtons.get("flipH")?.classList.toggle("is-on",e.transform.flipH),this.flipButtons.get("flipV")?.classList.toggle("is-on",e.transform.flipV);let o=Math.round(e.adjust[this.adjustKey]);r!==this.adjustTicks.rail&&this.adjustTicks.set(o,!1),this.adjustValue.textContent=this.formatAdjust(o);let s=Math.round(e.transform.rotation);r!==this.rotationControl.rail&&this.rotationControl.set(s,!1),this.rotationValue.textContent=`${s}°`,this.rotationBtn.setAttribute("aria-label",`${this.s.rotation}: ${s}°`),this.syncPerspective();let n=this.aspectLabel(e.crop.aspect);this.ratioValue.textContent=n,this.ratioBtn.setAttribute("aria-label",`${this.s.ratioLabel}: ${n}`);for(let[u,l]of this.filterButtons)l.setAttribute("aria-pressed",String(e.filter===u));this.syncTuneUI(),this.positionTexts(),this.syncHistory()}syncPerspective(){let t=this.getState().transform,e=Math.round(t.perspectiveX),r=Math.round(t.perspectiveY);this.perspectiveYControl.set(r,!1),this.perspectiveXControl.set(e,!1),this.perspectiveYValue.textContent=St(r),this.perspectiveXValue.textContent=St(e),this.perspectiveYBtn.setAttribute("aria-label",`${this.s.perspective}: ${this.s.tiltVertical} ${St(r)}`),this.perspectiveXBtn.setAttribute("aria-label",`${this.s.perspective}: ${this.s.tiltHorizontal} ${St(e)}`)}syncHistory(){this.undoBtn.disabled=!this.canUndo(),this.redoBtn.disabled=!this.canRedo()}positionFrame(t){let e=this.frameBox;t.x===e.x&&t.y===e.y&&t.width===e.w&&t.height===e.h||((t.x!==e.x||t.y!==e.y)&&(this.frameEl.style.transform=`translate3d(${t.x}px,${t.y}px,0)`),t.width!==e.w&&(this.frameEl.style.width=`${t.width}px`),t.height!==e.h&&(this.frameEl.style.height=`${t.height}px`),e.x=t.x,e.y=t.y,e.w=t.width,e.h=t.height,this.scrimEl.style.setProperty("--au-crop-x",`${t.x}px`),this.scrimEl.style.setProperty("--au-crop-y",`${t.y}px`),this.scrimEl.style.setProperty("--au-crop-w",`${t.width}px`),this.scrimEl.style.setProperty("--au-crop-h",`${t.height}px`))}dragCrop(t){let e=this.cropDrag;if(!e)return;t.preventDefault();let r=t.clientX-e.startX,o=t.clientY-e.startY,s=e.handle==="e"||e.handle==="tr"||e.handle==="br"?1:e.handle==="w"||e.handle==="tl"||e.handle==="bl"?-1:0,n=e.handle==="s"||e.handle==="br"||e.handle==="bl"?1:e.handle==="n"||e.handle==="tl"||e.handle==="tr"?-1:0;if(e.aspect!=="free"&&e.aspect!=="screen"){let l=1;if(s&&n){let h=Math.max(1,e.frame.width*e.frame.width+e.frame.height*e.frame.height);l=1+(s*r*2*e.frame.width+n*o*2*e.frame.height)/h}else s?l=1+s*r*2/Math.max(1,e.frame.width):n&&(l=1+n*o*2/Math.max(1,e.frame.height));let c=_(e.startScale*l,.2,1);this.setCrop({scale:c},e.key)}else{let l=Math.max(24,e.frame.width+s*r*2),c=Math.max(24,e.frame.height+n*o*2),h=_(l/c,.2,8),p=ne(e.viewport,h),v=_(l/Math.max(1,p.width),.2,1);this.setCrop({aspect:"free",ratio:h,scale:v},e.key)}this.positionFrame(this.currentFrame())}endCropDrag(){let t=this.cropDrag;if(t){this.cropDrag=null,t.handleEl.removeEventListener("pointermove",t.move),t.handleEl.removeEventListener("pointerup",t.end),t.handleEl.removeEventListener("pointercancel",t.end);try{t.handleEl.releasePointerCapture(t.pointerId)}catch{}this.frameEl.classList.remove("is-dragging"),this.frameEl.classList.remove("is-locked"),t.handleEl.classList.remove("is-dragging"),this.root.classList.remove("au-cropping")}}openSheet(){this.isReady&&(this.updateSheet(),this.sheetWrap.classList.add("is-open"),this.sheetWrap.setAttribute("aria-hidden","false"),this.saveImageBtn.focus({preventScroll:!0}))}closeSheet(){this.sheetWrap.classList.remove("is-open"),this.sheetWrap.setAttribute("aria-hidden","true"),this.saveBtn.focus({preventScroll:!0})}updateSheet(){let t=this.getExportSize(),e=Ut.find(o=>o.type===this.exportType)||Ut[0];this.metaName.textContent=this.fileName(),this.metaInfo.textContent=`${t.width} × ${t.height} px · ${e.label}`;for(let[o,s]of this.formatButtons)s.setAttribute("aria-pressed",String(o===this.exportType));let r=this.exportType==="image/png";this.qualityRow.hidden=r,this.qualityControl.setDisabled(r),this.applyQuality(this.quality)}applyQuality(t){this.quality=_(Math.round(t),10,100),this.qualityControl.set(this.quality,!1)}fileName(){let t=this.exportType==="image/png"?"png":this.exportType==="image/webp"?"webp":"jpg";return`${this.fileBase}.${t}`}async saveImage(t="overwrite"){if(this.saving||!this.isReady)return;let e=t==="copy"?this.onSaveCopyCb:this.onSaveCb;if(t==="copy"&&!e)return;this.saving=!0,this.saveImageBtn.disabled=!0,this.saveCopyBtn&&(this.saveCopyBtn.disabled=!0);let r=t==="copy"?this.saveCopyLabel:this.saveLabel,o=r?.textContent||"",s=t==="copy"?this.saveCopyBtn:this.saveImageBtn;r&&(r.textContent=this.s.saving),s?.setAttribute("aria-busy","true");let n=new AbortController;this.exportAbort=n,this.updateProgress({phase:"render",progress:0,tile:0,tiles:0}),this.progressEl.hidden=!1;try{let u=await this.export({type:this.exportType,quality:this.quality/100,signal:n.signal,onProgress:c=>this.updateProgress(c)});u=await this.compositeTexts(u);let l=this.fileName();this.updateProgress({phase:"encode",progress:1,tile:0,tiles:0}),e?(this.progressLabel.textContent=this.s.uploading,await e(u,l)):this.autoDownload&&sr(u,l),this.closeSheet(),this.toast(t==="copy"?this.s.savedCopy:this.s.saved)}catch(u){if(ut(u))this.toast(this.s.exportCancelled);else{let l=u instanceof Error&&u.message?`: ${u.message}`:"";this.toast(`${this.s.exportFailed}${l}`,!0)}}finally{this.exportAbort=null,this.progressEl.hidden=!0,this.saving=!1,this.saveImageBtn.disabled=!1,this.saveCopyBtn&&(this.saveCopyBtn.disabled=!1),r&&(r.textContent=o),s?.removeAttribute("aria-busy")}}updateProgress(t){let e=Math.round(_(t.progress,0,1)*100);this.progressBar.style.width=`${e}%`,this.progressText.textContent=`${e}%`,this.progressLabel.textContent=t.progress>=1?this.s.encoding:t.phase==="encode"?this.s.encoding:this.s.rendering}toast(t,e=!1){this.toastEl.className=`au-toast${e?" is-error":""}`,this.toastEl.innerHTML=`${H(e?"alert":"check")}<span></span>`;let r=this.toastEl.querySelector("span");r&&(r.textContent=t),this.toastEl.classList.add("is-open"),this.toastTimer&&window.clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>{this.toastEl.classList.remove("is-open"),this.toastTimer=0},2400)}};function ur(i){let a=i<0?0:i>1?1:i;return a<=.04045?a/12.92:Math.pow((a+.055)/1.055,2.4)}function lr(i){let a=i<0?0:i>1?1:i;return a<=.0031308?a*12.92:1.055*Math.pow(a,1/2.4)-.055}var go="1.0.0";function xo(i){return new Qt(i)}function bo(i){return new At(i)}export{te as ADJUST_KEYS,et as ADJUST_RANGES,At as AurumCore,Qt as AurumEditor,Ge as CURVE_PRESETS,Ft as HSL_BANDS,We as LUTS,Ma as LUT_SIZE,Ht as MAX_LIQUIFY_DABS,Zt as MAX_LIQUIFY_RADIUS,ja as MAX_LIQUIFY_SHIFT,Mt as PRESETS,Pa as UI_CSS,Je as analyzeBitmap,ta as autoAdjust,Ci as buildColorTransform,je as buildCurveLUT,Ke as buildLUT,Te as buildLiquifyField,nt as cloneState,bo as createCore,xo as createEditor,_i as curvePreset,ka as curvesAreIdentity,ee as defaultAdjust,ie as defaultCrop,re as defaultCurves,oe as defaultEnhance,Nt as defaultHSL,Et as defaultState,ae as defaultTransform,na as ensureStyles,ia as getAIAdapter,lr as linearToSrgb,Yi as listAIAdapters,Oe as lutById,ca as normalizeRetouch,Me as normalizeState,wt as presetById,Ze as probeCapabilities,Ni as registerAIAdapter,we as resolveColorSpace,Kt as resolveDither,ra as runAIPipeline,It as sampleCurve,ur as srgbToLinear,Xi as unregisterAIAdapter,go as version};
