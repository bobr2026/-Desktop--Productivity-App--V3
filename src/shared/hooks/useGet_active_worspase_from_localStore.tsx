import { useDispatch, useSelector } from "react-redux";
import { data } from "react-router-dom";
import { global_store_type } from "../../App/store/global_store.types";
import { AppDispatch } from "../../App/store/store";
import { I_workspace_types } from "../types";

import { useEffect, useState } from "react";
export default function useGet_active_worspase_from_localStore(){
  const active_wokspase= useSelector((state:global_store_type)=>state.global_category.active_worspase)
        const [active_workspase_local_store,setActive_workspase_local_store ]= useState<I_workspace_types>({name:"", color:"", workspace_id:0})
          const dispatch= useDispatch<AppDispatch>()
     
      useEffect(()=>{
        const raw = localStorage.getItem("active_workspase");
        console.log(raw)
        
        if (raw) {
          const data: I_workspace_types = JSON.parse(raw);
          setActive_workspase_local_store(data);
        }
        
      }, [active_wokspase])
      console.log(active_workspase_local_store)
     return active_workspase_local_store
    
}
