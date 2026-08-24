import { invoke } from "@tauri-apps/api/core";
import { Paragraph } from "../../../shared/types";

export async function addParagraph(
    postId: number,
    content: string,
    culomm: number,
    row: number,
    styleId: number | null
): Promise<void> {
    await invoke("add_Paragraph", {
        postId,
        content,
        culomm,
        row,
        styleId,
    });
}

export async function setPostIdParagraph(
    postId: number,
    paragraphId: number
): Promise<number> {
    return await invoke<number>("set_post_id_paragraph", {
        postId,
        paragraphId,
    });
}

export async function setStyleIdParagraph(
    styleId: number | null,
    paragraphId: number
): Promise<number> {
    return await invoke<number>("set_styleId_paragraph", {
        styleId,
        paragraphId,
    });
}

export async function updateContentParagraph(
    content: string,
    paragraphId: number
): Promise<number> {
    return await invoke<number>("update_content_paragraph", {
        content,
        paragraphId,
    });
}

export async function updatePositionParagraph(
    culomm: number | null,
    row: number | null,
    paragraphId: number
): Promise<number> {
    return await invoke<number>("update_position_paragraph", {
        culomm,
        row,
        paragraphId,
    });
}

export async function deleteParagraph(
    paragraphId: number,
    postId: number
): Promise<number> {
    return await invoke<number>("delete_paragraph_by_post_id", {
        paragraphId,
        postId,
    });
}


export async function getAllParagraphByPostId(
    postId: number
): Promise<Paragraph[]> {
    const data = await invoke<Paragraph[]>("get_all_paragraph_by_post_id", {
        postId,
    });
    console.log("@@@@@@@@@@@@@")
    console.log(data)
    return data
}
export async function get_all_post_and_Paragraph() {
    
}