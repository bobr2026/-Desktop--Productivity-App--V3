import { ComponentProps } from "react";
import styles from './base_button.module.sass'
interface BaseButtonProps extends ComponentProps<"button"> {}

export default function BaseButton({
  children,
  className, 
  ...props
}: BaseButtonProps) {
  return <button  className={`${styles.base_button} ${className ?? ""}`}{...props}>{children}</button>;
}