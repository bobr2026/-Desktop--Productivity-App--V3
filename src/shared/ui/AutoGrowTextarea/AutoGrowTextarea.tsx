// import { useEffect, useRef, useState } from "react";

// export default function AutoGrowTextarea() {
//   const [value, setValue] = useState("");
//   const [inputHeight,setInputHeight]=useState(20)
//   const [old_value_len, set_old_value_len]=useState(4)
//   const [old_value_len1, set_old_value_len1]=useState(20)
//   const [inputWidth,setInputWidth]=useState(100)
//   useEffect(() => {
// if(value.length>old_value_len){

//     setInputWidth(prev=>prev+40)
//     set_old_value_len(prev=>prev+4)
//     if(value.length>=old_value_len1){
// setInputHeight(prev=>prev+20)
// set_old_value_len1(prev=>prev+30)
// setInputWidth(prev=>prev-40)
//     }

// }
//   }, [value.length]);

//   return (
//     <textarea
//       value={value}
//        maxLength={200}
//       onChange={(e) => setValue(e.target.value)}
//       style={{
//         width:inputWidth +'px',
//         height:inputHeight+ 'px'
//       }}
//       placeholder="Введите текст..."   />
//   )
// }
 import { useLayoutEffect, useRef, useState } from "react";

export default function AutoGrowTextarea() {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  const LINE_HEIGHT = 20; // под твой font-size
  const MAX_LINES = 2;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // сбрасываем высоту, чтобы корректно пересчитать
    el.style.height = "0px";

    const scrollHeight = el.scrollHeight;
    const maxHeight = LINE_HEIGHT * MAX_LINES;

    // если меньше 2 строк → растёт/сжимается
    if (scrollHeight <= maxHeight) {
      el.style.height = scrollHeight + "px";
      el.style.overflow = "hidden";
    } 
    // если больше → фиксируем 2 строки и включаем скролл
    else {
      el.style.height = maxHeight + "px";
      el.style.overflow = "auto";
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Введите текст..."
      style={{
        width: "300px",
        fontSize: "14px",
        lineHeight: "20px",
        resize: "none",
        padding: "6px 8px",
        border: "1px solid #ccc",
        borderRadius: "6px",
      }}
    />
  );
}