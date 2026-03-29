import { Outlet } from "react-router-dom";
import { Header } from "./ui/header/Header";
import { LeftBar } from "./ui/LeftBar/LeftBar";

import  styles from "./RootLayot.module.sass"
export function RootLayot(){
    return (
        <div className={styles.main_conteiner}>
          <Header/>
          <LeftBar/>
          <Outlet />

          

        </div>
    )
}