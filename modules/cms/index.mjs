/** Canonical localized/versioned content. Upload security, moderation and persistence are app responsibilities. */
const STATES=['draft','review','approved','published','archived'];
export function newContent({id,tenantId,authorId,category,title,locale='en',body='',mediaKeys=[]}){
 if(!id||!tenantId||!authorId||!category||!title?.trim()||!Array.isArray(mediaKeys))throw new Error('Invalid content');
 return {id,tenantId,authorId,category,locale,title:title.trim(),body,mediaKeys:[...mediaKeys],version:1,status:'draft',history:[]};
}
export function reviseContent(content,patch,{editorId,expectedVersion}){
 if(!content||!editorId||expectedVersion!==content.version||!['draft','review','approved'].includes(content.status))throw new Error('Content cannot be revised');
 const allowed=['title','body','mediaKeys','locale','category'];const update=Object.fromEntries(Object.entries(patch||{}).filter(([key])=>allowed.includes(key)));
 if(update.title!==undefined&&!String(update.title).trim())throw new Error('Title required');
 return {...content,...update,version:content.version+1,status:'draft',approvedBy:null,approvedVersion:null,history:[...content.history,{event:'revised',by:editorId,version:content.version+1}]};
}
export function changePublication(content,to,{actorId,canPublish=false}={}){
 if(!STATES.includes(to)||!actorId)throw new Error('Invalid content transition');
 const legal={draft:['review'],review:['approved','draft'],approved:['published','draft'],published:['archived'],archived:['draft']};
 if(!legal[content?.status]?.includes(to))throw new Error('Invalid content status transition');
 if(to==='approved'&&(!canPublish||actorId===content.authorId))throw new Error('Independent approver required');
 if(to==='published'&&(!canPublish||!content.approvedBy||content.approvedBy===content.authorId||content.approvedVersion!==content.version))throw new Error('Approval and publishing permission required');
 return {...content,status:to,approvedBy:to==='approved'?actorId:content.approvedBy,approvedVersion:to==='approved'?content.version:content.approvedVersion,history:[...content.history,{event:to,by:actorId,version:content.version}]};
}
export function visibleContent(content,{tenantId,locale,now=new Date()}={}){
 return Boolean(content?.tenantId===tenantId&&content.status==='published'&&(!locale||content.locale===locale)&&(!content.startsAt||now>=new Date(content.startsAt))&&(!content.expiresAt||now<=new Date(content.expiresAt)));
}
