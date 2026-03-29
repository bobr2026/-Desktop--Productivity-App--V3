import { I_ginerik_category } from "../types";

export default function get_cildren_category(category_arr:I_ginerik_category[], parent_id:number){
return category_arr.filter((category)=> category.parent_id===parent_id)
}