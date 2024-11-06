var v=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var b=v(($e,D)=>{var j={strict:!0,getObjectId:t=>t.id||t._id||t.uuid||t.slug,getTimestamp:Date.now};function te(t){Object.assign(j,t)}function ne(t,e,i){if(i){let r=O(i);r&&(e=`[${r}]`)}return oe(t,e)}function ie(t){return typeof t=="string"&&(t.indexOf("/")!==-1||t.indexOf("~")!==-1)?t.replace(/~/g,"~0").replace(/\//g,"~1"):t}function re(t){return typeof t=="string"&&(t.indexOf("~1")!==-1||t.indexOf("~0")!==-1)?t.replace(/~1/g,"/").replace(/~0/g,"~"):t}function se(t){return t.split("/").map(e=>re(e))}function oe(t,e){return e=ie(e),[t,e].filter(i=>i!=null).join("/").replace("//","/")}function h(t){return Array.isArray(t)?"array":t===null?"null":typeof t}function q(t){let e=h(t);return e==="number"||e==="null"||e==="boolean"||e=="string"}function ce(t){return h(t)==="array"&&t.every(e=>q(e))}function P(t){let e=h(t);if(e=="array"){let i=Array(t.length);for(let r=0;r<t.length;r++)i[r]=P(t[r]);return i}else if(e=="object"){if(t.toJSON)return t.toJSON();{let i={};for(let r in t)i[r]=P(t[r]);return i}}else if(q(t))return typeof t=="number"?isFinite(t)?t:null:t}function fe(t,e){if(q(t))return t===e;if(h(t)=="object")return O(t)===O(e);if(h(t)=="array")throw new Error("can't compare arrays of arrays")}function O(t){if(h(t)=="object"){let e=j.getObjectId(t);if(e!=null)return e;if(j.strict)throw new Error("couldn't find id for object",{cause:t});return M(m(t))}else return null}function ae(t,e,i){let r={op:t,path:e};return Object.assign(r,i),r}function m(t){return h(t)=="array"?`[${t.map(m).join(",")}]`:h(t)=="object"?`{${Object.keys(t).sort().map(e=>`${JSON.stringify(e)}:${m(t[e])}`).join(",")}}`:JSON.stringify(t)}function M(t){return Math.abs([].reduce.call(t,(e,i,r,n)=>(e<<5)-e+n.charCodeAt(r),0))}function ue(t){return M(m(t))}D.exports={_path:ne,_typeof:h,_isPrimitive:q,_isArrayOfPrimitives:ce,_clone:P,_entangled:fe,_objId:O,_op:ae,_stable:m,_crc:ue,_decodePath:se,_config:j,_configure:te}});var I=v((Ae,G)=>{var{_path:d,_typeof:y,_isPrimitive:F,_isArrayOfPrimitives:k,_clone:C,_entangled:le,_op:N,_config:pe}=b();function ge(t,e){let i=y(t);if(i!==y(e))throw new Error("can't diff different types");if(F(t)||k(t))return K(t,e);if(i=="array")return W(t,e);if(i=="object")return H(t,e);throw new Error("unsupported type")}function K(t,e,i="/"){return t!==e?[N("replace",d(i),{value:e,_prev:t})]:[]}function W(t,e,i="/"){let r={},n={},s=[];for(let c=0;c<t.length;c++)for(let o=0;o<e.length;o++)o in n||c in r||(!pe.strict&&y(t[c])=="array"&&y(e[o])=="array"&&c==o||le(t[c],e[o]))&&(r[c]=o,n[o]=c);let f=[];for(let c=0,o=0;o<e.length||c<t.length;){if(o in e&&c in t&&n[o]==c){y(e[o])==="object"&&f.push(...H(t[c],e[o],d(i,c,e[o]))),o++,c++;continue}if(c<t.length&&!(c in r)){f.push(N("remove",d(i,c,t[c]),{_prev:t[c]})),c++;continue}if(o<e.length&&!(o in n)){s.unshift(N("add",d(i,o,e[o+1]),{value:e[o]})),o++;continue}if(o<e.length&&o in n){let l=d(i,n[o],t[n[o]]),p=d(i,o);p!=l&&(f.push({op:"move",from:l,path:p}),y(n[o])=="object"&&f.push(...H(t[n[o]],e[o],i))),c++,o++;continue}throw new Error("couldn't create diff")}return f.concat(s)}function H(t,e,i="/",r){let n=[],s=Object.keys(t),f=s.length,c=0;for(let p=0;p<f;p++){let a=s[p];if(!e.hasOwnProperty(a)){c++,n.push({op:"remove",path:d(i,a),_prev:C(t[a])});continue}if(t[a]===e[a])continue;let g=y(t[a]);F(t[a])||k(t[a])?n.push(...K(t[a],e[a],d(i,a),r)):g!==y(e[a])?n.push({op:"replace",path:d(i,a),value:C(e[a]),_prev:C(t[a])}):g==="array"?n.push(...W(t[a],e[a],d(i,a))):g==="object"&&n.push(...H(t[a],e[a],d(i,a),r))}let o=Object.keys(e),l=o.length;if(l>f-c)for(let p=0;p<l;p++){let a=o[p];t.hasOwnProperty(a)||n.push({op:"add",path:d(i,a),value:C(e[a])})}return n}G.exports=ge});var S=v((Ee,Y)=>{var{_typeof:de,_clone:_,_objId:L,_decodePath:he}=b();function ye(t,e){e=_(e);let i=[],r=null;e:for(let[n,s]of e.entries()){let f=he(s.path),c=f.shift(),o=f.pop(),l=t;for(let g of f){if(!l){i.push(s);continue e}let w=R(g);w?l=l.find(ee=>L(ee)==w):l=l[g]}let p=R(o);if(p){let g=l.findIndex(w=>L(w)==p);~g?o=g:i.push(s)}let a=de(l);if(s.op=="replace")l[o]=_(s.value);else if(s.op=="move"){r={};let g=[{op:"remove",path:s.from},{op:"add",path:s.path,value:r}];e.splice(n+1,0,...g)}else if(s.op=="remove"){if(a=="object")r&&(r.value=_(l[o])),delete l[o];else if(a=="array"){let g=l.splice(o,1);r&&([r.value]=g)}}else s.op=="add"&&(a=="object"?l[o]=_(s.value):a=="array"&&(r&&s.value===r?(l.splice(o,0,r.value),r=null):l.splice(o,0,_(s.value))))}return t}function R(t){if(t===void 0)return;let e=t.match(/^\[(.+)\]$/);if(e)return e[1]}Y.exports=ye});var $=v((Je,z)=>{var{_clone:ve,_objId:me}=b();function be(t){let e=ve(t).reverse();for(let n of e){if(n.op=="add"){n.op="remove";let s=me(n.value);s&&(n._index=n.path.split("/").pop(),n.path=n.path.replace(/\d+$/,`[${s}]`))}else n.op=="remove"&&(n.op="add");if("_prev"in n)var i=n._prev;if("value"in n)var r=n.value;i===void 0?delete n.value:n.value=i,r===void 0?delete n._prev:n._prev=r}return e}z.exports=be});var X=v((Te,V)=>{var _e=I(),A=S(),we=$(),{_clone:E,_crc:je,_configure:Oe,_config:B}=b(),J=1e3,u=new WeakMap,Q=U(),T=class t{constructor(){u.set(this,{history:[],stash:[],warning:null,gids:{}})}static from(e,i=Q){let r=new t;return u.get(r).cid=i,r=t.change(r,n=>Object.assign(n,e)),r}static _forge(e,i=Q){let r=new t;return u.get(r).cid=i,Object.assign(r,E(e)),r}static alias(e){let i=new t;return u.set(i,u.get(e)),Object.assign(i,e),i}static init(){return t.from({})}static clone(e,i=J){let r=t._forge(e);return u.get(r).history=u.get(e).history,u.get(r).gids=E(u.get(e).gids),t.pruneHistory(u.get(r),i),r}static pruneHistory(e,i){let r=e.history.length;if(r>i){let n=e.history.slice(0,r-i);for(let s of n)delete e.gids[s.gid]}e.history=e.history.slice(-i)}static getChanges(e,i){return{diff:_e(e,i),cid:u.get(e).cid,ts:B.getTimestamp(),seq:Ce(),gid:U()}}static rewindChanges(e,i,r){let{history:n}=u.get(e);for(;!(n.length<=1);){let s=n[n.length-1];if(s.ts>i||s.ts==i&&s.cid>r){let f=u.get(e).history.pop();A(e,we(f.diff)),delete u.get(e).gids[f.gid],u.get(e).stash.push(f);continue}break}}static fastForwardChanges(e){let{stash:i,history:r}=u.get(e),n;for(;n=i.pop();)A(e,n.diff),u.get(e).gids[n.gid]=1,r.push(n)}static applyChangesInPlace(e,i){return t.applyChanges(e,i,!0)}static applyChanges(e,i,r){u.get(e).warning=null;let n=r?e:t.clone(e);if(u.get(e).gids[i.gid])return n;try{t.rewindChanges(n,i.ts,i.cid)}catch(c){u.get(n).warning="rewind failed: "+c}try{A(n,i.diff),u.get(n).gids[i.gid]=1}catch(c){u.get(n).warning="patch failed: "+c}try{t.fastForwardChanges(n)}catch(c){u.get(n).warning="forward failed: "+c}let s=u.get(n).history,f=s.length;for(;f>1&&s[f-1].ts>i.ts;)f--;return s.splice(f,0,i),n}static change(e,i){let r=E(e);i(r);let n=t.getChanges(e,r);return t.applyChanges(e,n)}static getHistory(e){return u.get(e).history}static merge(e,i){let r=t.from({}),n=t.getHistory(e),s=t.getHistory(i),f=[];for(;n.length||s.length;)s.length?n.length?n[0].gid===s[0].gid?f.push(n.shift()&&s.shift()):n[0].ts<s[0].ts||n[0].ts==s[0].ts&&n[0].seq<s[0].seq?f.push(n.shift()):f.push(s.shift()):f.push(s.shift()):f.push(n.shift());for(let c of f)r=t.applyChanges(r,c);return r}static getWarning(e){return u.get(e).warning}static getMissingDeps(e){return!1}static setHistoryLength(e){J=e}static setTimestamp(e){B.getTimestamp=e}static crc(e){return je(e)}static load(e,i=J){let{meta:r,data:n}=JSON.parse(e);t.pruneHistory(r,i);let s=t.from(n);return Object.assign(u.get(s),r),s}static save(e){let{cid:i,...r}=u.get(e);return JSON.stringify({meta:r,data:e})}static configure(e){Oe(e)}};function U(){return Math.random().toString(36).substring(2)}var qe=0;function Ce(){return qe++}V.exports=T});var Ie=v((Me,x)=>{var He=I(),Pe=S(),Ne=$(),Z=X();x.exports=Object.assign(Z,{auto:Z,diff:He,patch:Pe,reverse:Ne})});export default Ie();
