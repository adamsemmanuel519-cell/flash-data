const json = (statusCode, body) => ({ statusCode, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }, body: JSON.stringify(body) });
const clean = (v, n=300) => String(v || "").replace(/[<>]/g, "").trim().slice(0,n);
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const validPhone = v => /^(0\d{9}|\+233\d{9})$/.test(v);
exports.handler = async event => {
  if (event.httpMethod !== "POST") return json(405,{error:"Method not allowed"});
  let d; try { d=JSON.parse(event.body||"{}"); } catch { return json(400,{error:"Invalid request"}); }
  const name=clean(d.name,80), phone=clean(d.phone,16), email=clean(d.email,160).toLowerCase();
  if(!name||!validPhone(phone)||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400,{error:"Enter a valid name, Ghana phone number and email address."});
  const token=process.env.TELEGRAM_BOT_TOKEN, chatId=process.env.TELEGRAM_CHAT_ID;
  if(!token||!chatId) return json(503,{error:"Registration notifications are not configured. Please contact the administrator."});
  const date=new Date(d.registeredAt||Date.now());
  const fields=["<b>NEW USER REGISTERED — FlashData GH</b>","","<b>USER DETAILS</b>",`<b>Full name:</b> ${esc(name)}`,`<b>Phone number:</b> ${esc(phone)}`,`<b>Email address:</b> ${esc(email)}`,`<b>Registration date and time:</b> ${esc(date.toLocaleString("en-GB",{timeZone:"Africa/Accra"}))}`,"","<b>DEVICE &amp; BROWSER</b>",`<b>Device type:</b> ${esc(clean(d.deviceType,60)||"Unknown")}`,`<b>Browser:</b> ${esc(clean(d.browser,60)||"Unknown")}`,`<b>User agent:</b> <code>${esc(clean(d.userAgent,900)||"Not supplied")}</code>`];
  try { const r=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:chatId,text:fields.join("\n"),parse_mode:"HTML",disable_web_page_preview:true})}); const j=await r.json(); if(!r.ok||!j.ok) throw new Error("Telegram error"); return json(200,{ok:true}); }
  catch { return json(502,{error:"Could not send registration notification. Please try again later."}); }
};
