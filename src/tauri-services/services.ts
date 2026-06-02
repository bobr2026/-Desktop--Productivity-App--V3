import { invoke } from "@tauri-apps/api/core";
import { isRegistered, register, unregister } from "@tauri-apps/plugin-global-shortcut";

type registerHotkeyTypes = "app"|"folder";
 export async function registerHotkey1(hotkay:string|string[]|undefined, path:string, type:registerHotkeyTypes) { 
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
  export async function registerHotkey(
    hotkay: string | string[] | undefined, 
    path: string, 
    type: registerHotkeyTypes
  ) {
    // 1. Проверяем на "пустоту" более надежно
    if (!hotkay || (Array.isArray(hotkay) && hotkay.length === 0)) {
      return null;
    }
  
    try {
      // 2. Если hotkay — массив, проходим циклом, если строка — делаем её массивом для удобства
      const keys = Array.isArray(hotkay) ? hotkay : [hotkay];
  
      for (const key of keys) {
        if (!key || key.trim() === "") continue; // Пропуск пустых строк
  
        // 3. Проверяем, зарегистрирован ли уже такой ключ
        const alreadyRegistered = await isRegistered(key);
        
        if (alreadyRegistered) {
          // Опционально: отменяем старую регистрацию, если хотим "перезаписать"
          await unregister(key);
        }
  
        // 4. Регистрация
        await register(key, () => {
          if (type === "folder") {
            openFolder(path);
          } else {
            openApp(path);
          }
        });
      }
    } catch (error) {
      console.error("Ошибка при регистрации хоткея:", error);
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
      