import{A as n}from"./analyticsHandler.js";const r=new n;addEventListener("unhandledrejection",async e=>{e.reason instanceof Error?await r.fireErrorEvent({message:e.reason.message}):await r.fireErrorEvent({message:"Unhandled rejection with unknown reason"})});chrome.runtime.onInstalled.addListener(async()=>{await r.fireEvent("install")});setTimeout(async()=>{try{await a()}catch(e){e instanceof Error?await r.fireErrorEvent({message:e.message}):await r.fireErrorEvent({message:"Unknown error occurred"})}},2e3);async function a(){throw new Error("👋 I'm an error")}