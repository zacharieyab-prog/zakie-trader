const signal=document.getElementById("signal"),detail=document.getElementById("detail");
async function refresh(){const s=await chrome.runtime.sendMessage({type:"STATUS"});signal.textContent=s.running?(s.lastSignal||"Monitoring…"):"Not running";detail.textContent=s.lastDetail||"Demo analysis only. No trades are placed.";}
document.getElementById("start").addEventListener("click",async()=>{const [tab]=await chrome.tabs.query({active:true,currentWindow:true});const r=await chrome.runtime.sendMessage({type:"START",tab});if(!r.ok){detail.textContent=r.error;return;}await refresh();});
document.getElementById("stop").addEventListener("click",async()=>{await chrome.runtime.sendMessage({type:"STOP"});await refresh();});
refresh();