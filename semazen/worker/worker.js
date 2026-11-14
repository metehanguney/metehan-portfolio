// Semazen D1 API. Deploy only after configuring D1 and Cloudflare Access.
const JSON_HEADERS={"content-type":"application/json; charset=utf-8","cache-control":"no-store"};
const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:JSON_HEADERS});
const columns="id,category,name_tr,name_en,name_ar,price,image_url";
function b64url(s){const x=s.replace(/-/g,"+").replace(/_/g,"/");return Uint8Array.from(atob(x+"=".repeat((4-x.length%4)%4)),c=>c.charCodeAt(0))}
function decode(s){return JSON.parse(new TextDecoder().decode(b64url(s)))}
async function accessVerified(request,env){
 const token=request.headers.get("Cf-Access-Jwt-Assertion");
 if(!token||!env.ACCESS_TEAM_DOMAIN||!env.ACCESS_AUD)return false;
 const parts=token.split(".");if(parts.length!==3)return false;
 try{
  const header=decode(parts[0]),claims=decode(parts[1]);
  if(header.alg!=="RS256"||!header.kid||!claims.exp||claims.exp*1000<=Date.now()||claims.nbf&&claims.nbf*1000>Date.now())return false;
  const domain=env.ACCESS_TEAM_DOMAIN.replace(/^https?:\/\//,"").replace(/\/$/,"");
  if(!/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(domain))return false;
  if(claims.iss!==`https://${domain}`||!Array.isArray(claims.aud)||!claims.aud.includes(env.ACCESS_AUD))return false;
  const jwks=await fetch(`https://${domain}/cdn-cgi/access/certs`,{cf:{cacheTtl:300,cacheEverything:true}});
  if(!jwks.ok)return false;
  const body=await jwks.json();const jwk=body.keys?.find(k=>k.kid===header.kid&&k.kty==="RSA");
  if(!jwk)return false;
  const key=await crypto.subtle.importKey("jwk",jwk,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["verify"]);
  return await crypto.subtle.verify("RSASSA-PKCS1-v1_5",key,b64url(parts[2]),new TextEncoder().encode(parts[0]+"."+parts[1]));
 }catch{return false}
}
export default {async fetch(request,env){
 const url=new URL(request.url);
 if(!url.pathname.startsWith("/api/semazen/"))return env.ASSETS.fetch(request);
 if(!env.SEMAZEN_DB)return reply({error:"Database binding not configured"},503);
 if(url.pathname==="/api/semazen/menu"&&request.method==="GET"){
  try{const {results}=await env.SEMAZEN_DB.prepare(`SELECT ${columns} FROM menu_items ORDER BY category,id`).all();
   return reply(results.map(p=>({id:p.id,cat:p.category,names:[p.name_tr,p.name_en,p.name_ar],price:p.price,image:p.image_url||null})));
  }catch{return reply({error:"Database unavailable"},503)}
 }
 if(url.pathname==="/api/semazen/admin/items"&&request.method==="GET"){
  if(!await accessVerified(request,env))return reply({error:"Unauthorized"},401);
  const {results}=await env.SEMAZEN_DB.prepare(`SELECT ${columns} FROM menu_items ORDER BY category,id`).all();
  return reply(results.map(p=>({id:p.id,cat:p.category,names:[p.name_tr,p.name_en,p.name_ar],price:p.price,image:p.image_url||null})));
 }
 const match=url.pathname.match(/^\/api\/semazen\/admin\/items\/([a-zA-Z0-9-]+)$/);
 if(match&&request.method==="PUT"){
  if(!await accessVerified(request,env))return reply({error:"Unauthorized"},401);
  if(Number(request.headers.get("content-length"))>8192)return reply({error:"Payload too large"},413);
  let p;try{p=await request.json()}catch{return reply({error:"Invalid JSON"},400)}
  if(!p||!Array.isArray(p.names)||p.names.length!==3||p.names.some(n=>typeof n!=="string"||!n.trim()||n.length>180)||!Number.isInteger(p.price)||p.price<0||p.price>1000000||!Number.isInteger(p.cat)||p.cat<1||p.cat>7||p.image!=null&&(typeof p.image!=="string"||p.image.length>2048||!/^https:\/\//.test(p.image)))return reply({error:"Invalid product fields"},400);
  const result=await env.SEMAZEN_DB.prepare("UPDATE menu_items SET category=?,name_tr=?,name_en=?,name_ar=?,price=?,image_url=?,updated_at=datetime('now') WHERE id=?").bind(p.cat,...p.names.map(x=>x.trim()),p.price,p.image||null,match[1]).run();
  if(!result.meta?.changes)return reply({error:"Product not found"},404);
  return reply({ok:true,id:match[1]});
 }
 return reply({error:"Not found"},404);
}};
