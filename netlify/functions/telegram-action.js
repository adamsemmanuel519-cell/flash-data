const json=(statusCode,body)=>({statusCode,headers:{"Content-Type":"application/json","Cache-Control":"no-store"},body:JSON.stringify(body)});
exports.handler=async event=>{
 if(event.httpMethod!=="POST")return json(405,{error:"Method not allowed"});let update;try{update=JSON.parse(event.body||"{}")}catch{return json(400,{error:"Invalid update"})}
 const q=update.callback_query;if(!q)return json(200,{ok:true});
 const token=process.env.TELEGRAM_BOT_TOKEN,adminChat=String(process.env.TELEGRAM_CHAT_ID||"");if(!token||!adminChat)return json(503,{error:"Telegram is not configured"});
 if(String(q.message?.chat?.id)!==adminChat)return json(403,{error:"Not authorised"});
 const match=/^(approve|reject):([A-Z0-9-]{5,50})$/.exec(String(q.data||""));if(!match)return json(400,{error:"Invalid action"});
 const approved=match[1]==="approve",claimId=match[2],decision=approved?"✅ APPROVED BY ADMIN":"❌ REJECTED BY ADMIN",old=q.message.text||"Claim details";
 const cleanText=old.replace(/\n\n<b>STATUS:.*$/s,"").replace(/\n\n<[^\n]*PENDING REVIEW[^\n]*>.*$/s,"");
 const text=`${cleanText}\n\n<b>ADMIN DECISION: ${decision}</b>\n<b>Claim ID:</b> <code>${claimId}</code>\n<b>Decision time:</b> ${new Date().toLocaleString("en-GB",{timeZone:"Africa/Accra"})}\n\n${approved?"Administrator marked this claim approved. Confirm payment was checked before fulfilment.":"Administrator rejected this claim. Do not fulfil it."}`;
 try{
  await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({callback_query_id:q.id,text:approved?"Claim marked approved":"Claim marked rejected",show_alert:true})});
  const r=await fetch(`https://api.telegram.org/bot${token}/editMessageText`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:q.message.chat.id,message_id:q.message.message_id,text,parse_mode:"HTML",disable_web_page_preview:true,reply_markup:{inline_keyboard:[]}})});const j=await r.json();if(!r.ok||!j.ok)return json(502,{error:"Could not update the Telegram claim message"});return json(200,{ok:true});
 }catch{return json(502,{error:"Telegram action failed"})}
};
