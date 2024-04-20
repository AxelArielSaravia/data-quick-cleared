var ORIGIN_TYPES=["extension","protectedWeb"],GLOBAL_TYPES=["appcache","cache","cacheStorage","cookies","downloads","fileSystems","formData","history","indexedDB","localStorage","passwords","serviceWorkers","webSQL"],CURRENT_TYPES=["cache","cookies","localStorage"],GlobalDataTypeSet={appcache:!1,cache:!1,cacheStorage:!1,cookies:!1,downloads:!1,fileSystems:!1,formData:!1,history:!1,indexedDB:!1,localStorage:!1,passwords:!1,serviceWorkers:!1,webSQL:!1},CurrentDataTypeSet={cache:!1,cookies:!1,localStorage:!1},GlobalOriginTypes={extension:!1,protectedWeb:!1,unprotectedWeb:!0},GlobalRemovalOptions={excludeOrigins:void 0,originTypes:GlobalOriginTypes,origins:void 0,since:0},CurrentRemovalOptions={excludeOrigins:void 0,originTypes:{extension:!1,protectedWeb:!1,unprotectedWeb:!0},origins:[],since:0},GlobalPermitted=[],CurrentPermitted=[],currentDataToRemove=0,globalDataToRemove=0,DOMHeaderButtons=document.getElementById("header-buttons");if(DOMHeaderButtons===null)throw Error("#header-buttons does not exist");var DOMCurrent=document.forms.current,DOMGlobal=document.forms.global;if(DOMCurrent===null)throw Error("'current form' does not exist");if(DOMGlobal===null)throw Error("'global form' does not exist");var DOMCurrentSet=DOMCurrent["data-set"],DOMGlobalSet=DOMGlobal["data-set"];if(DOMCurrentSet.children.length!==CURRENT_TYPES.length)throw Error("'current form fieldset' does not have all CURRENT_TYPES");var DOMSelect=document.getElementById("since");if(DOMSelect===null)throw Error("#since does not exist");chrome.browsingData.settings(function(result){console.info(result);let globalPermitted=!1;for(let type of GLOBAL_TYPES)if(result.dataRemovalPermitted[type]&&result.dataToRemove[type])globalPermitted=!0,GlobalDataTypeSet[type]=!0,globalDataToRemove+=1,GlobalPermitted.push(type),DOMGlobal[type]?.removeAttribute("disabled");for(let type of CURRENT_TYPES)if(result.dataRemovalPermitted[type]&&result.dataToRemove[type])CurrentDataTypeSet[type]=!0,CurrentPermitted.push(type),currentDataToRemove+=1;if(globalPermitted)DOMGlobal["button-delete"].disabled=!1,DOMGlobal["button-clear"].disabled=!1;if(result.options.originTypes?.extension)DOMGlobal["extension"].disabled=!1;if(result.options.originTypes?.protectedWeb)DOMGlobal["protectedWeb"].disabled=!1});(async function(){const injection={target:{tabId:(await chrome.tabs.query({active:!0,currentWindow:!0}))[0].id},func:function(){return window.location.origin}};let res;try{res=await chrome.scripting.executeScript(injection)}catch{return}CurrentRemovalOptions.origins.push(res[0].result);let currentPermitted=!1;for(let type of CURRENT_TYPES)if(CurrentDataTypeSet[type])currentPermitted=!0,DOMCurrent[type]?.removeAttribute("disabled");if(currentPermitted)DOMCurrent["button-delete"].removeAttribute("disabled"),DOMCurrent["button-clear"].removeAttribute("disabled")})();DOMCurrent["button-delete"].onclick=function(){if(CurrentDataTypeSet.cookies)chrome.browsingData.removeCookies(CurrentRemovalOptions);if(CurrentDataTypeSet.cache)chrome.browsingData.removeCache(CurrentRemovalOptions);if(CurrentDataTypeSet.localStorage)chrome.browsingData.removeLocalStorage(CurrentRemovalOptions)};DOMCurrent.oninput=function(e){const target=e.target;if(CurrentDataTypeSet[target.name]===void 0){console.error("ERROR: does not have a target.name");return}if(CurrentDataTypeSet[target.name]=target.checked,target.checked)currentDataToRemove+=1;else currentDataToRemove-=1;DOMCurrent["button-delete"].disabled=currentDataToRemove<1};DOMCurrent["button-clear"].onclick=function(){for(let type of CurrentPermitted)DOMCurrent[type].checked=!1,CurrentDataTypeSet[type]=!1};DOMGlobal["button-delete"].onclick=function(){if(GlobalDataTypeSet.appcache)chrome.browsingData.removeAppcache(GlobalRemovalOptions);if(GlobalDataTypeSet.cache)chrome.browsingData.removeCache(GlobalRemovalOptions);if(GlobalDataTypeSet.cacheStorage)chrome.browsingData.removeCacheStorage(GlobalRemovalOptions);if(GlobalDataTypeSet.cookies)chrome.browsingData.removeCookies(GlobalRemovalOptions);if(GlobalDataTypeSet.downloads)chrome.browsingData.removeDownloads(GlobalRemovalOptions);if(GlobalDataTypeSet.fileSystems)chrome.browsingData.removeFileSystems(GlobalRemovalOptions);if(GlobalDataTypeSet.formData)chrome.browsingData.removeFormData(GlobalRemovalOptions);if(GlobalDataTypeSet.history)chrome.browsingData.removeHistory(GlobalRemovalOptions);if(GlobalDataTypeSet.indexedDB)chrome.browsingData.removeIndexedDB(GlobalRemovalOptions);if(GlobalDataTypeSet.localStorage)chrome.browsingData.removeLocalStorage(GlobalRemovalOptions);if(GlobalDataTypeSet.passwords)chrome.browsingData.removePasswords(GlobalRemovalOptions);if(GlobalDataTypeSet.serviceWorkers)chrome.browsingData.removeServiceWorkers(GlobalRemovalOptions);if(GlobalDataTypeSet.webSQL)chrome.browsingData.removeWebSQL(GlobalRemovalOptions)};DOMGlobal.oninput=function(e){const target=e.target;if(target.parentElement?.name==="data-set"){if(GlobalDataTypeSet[target.name]===void 0){console.error("ERROR: does not have a target.name");return}if(GlobalDataTypeSet[target.name]=target.checked,target.checked)globalDataToRemove+=1;else globalDataToRemove-=1;DOMGlobal["button-delete"].disabled=globalDataToRemove<1}else if(target.parentElement?.name==="origin-types"){for(let type of ORIGIN_TYPES)if(target.name===type)DOMGlobal[type]=target.checked,GlobalOriginTypes[type]=target.checked}};DOMGlobal["button-clear"].onclick=function(){for(let type of GlobalPermitted)DOMGlobal[type].checked=!1,GlobalDataTypeSet[type]=!1};DOMSelect.onchange=function(e){switch(e.target.value){case"0":{CurrentRemovalOptions.since=0,GlobalRemovalOptions.since=0;break}case"1":{CurrentRemovalOptions.since=(new Date()).getTime()-3600000,GlobalRemovalOptions.since=(new Date()).getTime()-3600000;break}case"2":{CurrentRemovalOptions.since=(new Date()).getTime()-43200000,GlobalRemovalOptions.since=(new Date()).getTime()-43200000;break}case"3":{CurrentRemovalOptions.since=(new Date()).getTime()-86400000,GlobalRemovalOptions.since=(new Date()).getTime()-86400000;break}case"4":{CurrentRemovalOptions.since=(new Date()).getTime()-604800000,GlobalRemovalOptions.since=(new Date()).getTime()-604800000;break}case"5":{CurrentRemovalOptions.since=(new Date()).getTime()-2419200000,GlobalRemovalOptions.since=(new Date()).getTime()-2419200000;break}}};DOMHeaderButtons.onclick=function(e){const target=e.target;if(console.log(target),target.name==="about"){if(window.open(chrome.runtime.getURL("about.html")),chrome.runtime.openOptionsPage!==void 0)chrome.runtime.openOptionsPage()}else if(target.name==="close")window.close()};