import { invoke } from "@tauri-apps/api/core";
import { register } from "@tauri-apps/plugin-global-shortcut";

type registerHotkeyTypes = "app"|"folder";
 export async function registerHotkey(hotkay:string|string[]|undefined, path:string, type:registerHotkeyTypes) { 
    if(type=="folder"){
        if(hotkay===undefined){
        return null
        }else{
            await register(hotkay, ()=>{
                openFolder(path)
            })
        }
    }
    else{
        if(hotkay===undefined){
            return null
            }else{ 
                await register(hotkay, ()=>{
                    openApp(path)
                })
            }
    }
  }
 export async function openFolder(path: string) {
      try {
          await invoke('open_folder', { folderPath: path });
  
  
      } catch (error) {
        console.error('Failed to open folder:', error);
      }
    }
    

    export async function openApp(path: string) {
        try {
            await invoke('open_app', { appPath: path });
            
            
        } catch (error) {
            console.error('Failed to open folder:', error);
        }
      }
      