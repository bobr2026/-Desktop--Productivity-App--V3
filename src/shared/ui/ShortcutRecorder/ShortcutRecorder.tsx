import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../App/store/store';
import { global_store_type } from '../../../App/store/global_store.types';
import { set_created_app_hotkey } from '../../../features/app/store/app_slise_store';
import { shortcutRecorder_item_type_enum } from '../../types';
import styles from './ShortcutRecorder.module.sass'
import { setSelectedHotkey } from '../../../App/store/hotkey_and_category_slise';
// import { invoke } from '@tauri-apps/api/core';
// import { useDispatch } from 'react-redux';

interface ShortcutRecorderProps {
  onSave: (shortcut: string) => void;
  item_type:shortcutRecorder_item_type_enum
}

export const ShortcutRecorder = () => {
  const [keys, setKeys] = useState<string[]>([]);
  const [hotkey, setHotkey]= useState<string>("")
  const [isRecording, setIsRecording] = useState(false);
  const dispatch = useDispatch<AppDispatch>()
const app_hotkey= useSelector((state:global_store_type)=>state.apps_list.created_app_hotkey)
const pressedKeys = useRef<string[]>([]);

const handleKeyDown = (e: KeyboardEvent) => {
  if (!pressedKeys.current.includes(e.key)) {
    pressedKeys.current.push(e.key);
    const combo = [...pressedKeys.current];
  
    setKeys(combo)
  }
};
//   const handleKeyDown = useCallback((e: KeyboardEvent) => {
//     e.preventDefault(); // Блокируем стандартные действия браузера (например, Ctrl+S)

//     const currentKeys: string[] = [];
    
//     // Собираем модификаторы в формате Tauri
//     // if (e.ctrlKey || e.metaKey) currentKeys.push('CommandOrControl');
//     // if (e.altKey){
//     //   console.log(e.altKey)
//     //   currentKeys.push('Alt');


//     // } 
      
      
//     // if (e.shiftKey) currentKeys.push('Shift');
// // 1. Сначала вы проверяете Ctrl
// if (e.ctrlKey || e.metaKey) currentKeys.push('CommandOrControl');

// // 2. Затем вы проверяете Alt
// if (e.altKey){
//   currentKeys.push('Alt');
// } 

// // 3. И только потом проверяете Shift
// if (e.shiftKey) currentKeys.push('Shift');
//     // Если нажата не только клавиша-модификатор, добавляем ее
//     if (!['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
//       // Приводим букву к верхнему регистру для стандарта Tauri
//       const keyName = e.key === ' ' ? 'Space' : e.key.toUpperCase();
//       currentKeys.push(keyName);
//     }

//     setKeys(currentKeys);
//   }, []);
const handleKeyUp = (e: KeyboardEvent) => {
  if (!['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
    const combo = [...pressedKeys.current];
    // setKeys(combo)
    console.log(combo.join(' + '));
    
 
    // pressedKeys.current = [];
  }
};
  // const handleKeyUp = useCallback((e: KeyboardEvent) => {
  //   e.preventDefault();
    
  //   // Если отпустили не модификатор, считаем ввод комбинации завершенным
  //   if (!['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
  //     setIsRecording(false);
      
  //     // Формируем итоговую строку: "CommandOrControl+Shift+K"
  //     const shortcutString = keys.join('+');
  //     onSave(shortcutString);
  //   }
  // }, [keys, onSave]);

  useEffect(() => {
    if (!isRecording) return;

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isRecording, handleKeyDown, handleKeyUp]);
useEffect(()=>{
  function get_hotkey(){
    let out_hotkey:string=""
    keys.forEach(key=>{
      if(out_hotkey.length==0){
        out_hotkey=  out_hotkey+`${key}`
      }else{
        out_hotkey=  out_hotkey+`+${key}`
      }
    })
    console.log(out_hotkey)
      dispatch(setSelectedHotkey(out_hotkey))

   
 
  } 
  get_hotkey()
}, [keys])
return (
  <div className={styles.shortcut_recorder_module}>
      <button type='button' onClick={() => {
        if(isRecording){
          setIsRecording(false)
          pressedKeys.current = [];
        }else{
          setIsRecording(true)
          setKeys([])
        }
    
      }}>
        {isRecording ? 'Нажмите комбинацию...' : 'Задать хоткей'}
      </button>
             
      {keys.length > 0 && (
        <div style={{ marginTop: '10px', fontSize: '18px', fontWeight: 'bold' }}>
          {keys.join(' + ')}
        </div>
    
      )}
    </div>
  );
};