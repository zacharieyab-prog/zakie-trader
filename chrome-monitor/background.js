const ALARM = "zakie-chart-capture";
async function state(){return await chrome.storage.local.get(["running","tabId","lastSignal","lastAt","serverUrl"]);}
async function setStatus(signal,detail){await chrome.storage.local.set({lastSignal:signal,lastAt:new Date().toISOString(),lastDetail:detail||""});}
chrome.runtime.onMessage.addListener((msg,sender,sendResponse)=>{
 if(msg.type==="START"){(async()=>{const tab=msg.tab;if(!tab||!tab.id||!/^https?:/.test(tab.url||"")){sendResponse({ok:false,error:"Open your IQ Option chart tab first."});return;}await chrome.storage.local.set({running:true,tabId:tab.id,serverUrl:"http://localhost:3000"});await chrome.alarms.create(ALARM,{periodInMinutes:0.5});await capture();sendResponse({ok:true});})();return true;}
 if(msg.type==="STOP"){(async()=>{await chrome.alarms.clear(ALARM);await chrome.storage.local.set({running:false});sendResponse({ok:true});})();return true;}
 if(msg.type==="STATUS"){state().then(sendResponse);return true;}
});
async function capture(){
 const s=await state();if(!s.running||!s.tabId)return;
 try{
  const tab=await chrome.tabs.get(s.tabId);
  const active=await chrome.tabs.query({active:true,windowId:tab.windowId});
  if(!active.length||active[0].id!==s.tabId){await setStatus("PAUSED","Bring the IQ Option tab to the front to resume chart capture.");return;}
  if(!/iqoption/i.test(tab.url||"")){await setStatus("PAUSED","The selected tab is not recognised as IQ Option. Stop and start again on the chart tab.");return;}
  const dataUrl=await chrome.tabs.captureVisibleTab(tab.windowId,{format:"png"});
  const blob=await (await fetch(dataUrl)).blob();
  const form=new FormData();form.append("chart",blob,"chart.png");
  const response=await fetch((s.serverUrl||"http://localhost:3000")+"/api/analyze",{method:"POST",body:form});
  const result=await response.json();
  if(!response.ok)throw new Error(result.error||"Analysis request failed");
  const signal=String(result.signal||"WAIT").toUpperCase();
  await setStatus(signal,result.reason||"");
  if(signal==="HIGHER"||signal==="LOWER"){chrome.notifications.create({type:"basic",iconUrl:"icon.svg",title:"Zakie Trader: "+signal,message:result.reason||"New chart signal. Confirm manually in demo mode."});}
 }catch(e){await setStatus("ERROR",e.message);}
}
chrome.alarms.onAlarm.addListener(a=>{if(a.name===ALARM)capture();});
