
import { invoke } from "@tauri-apps/api/core";
import { Post } from "../../../shared/types";
export async function createPostInNote(
    noteId: number,
    title: string,
    positionInTheNote: number
): Promise<Post> {
   const new_post:Post = await invoke("create_post_in_note", {
        noteId,
        title,
        positionInTheNote,
    });
    return new_post
}


export async function getAllPostsByNoteId(
    noteId: number
): Promise<Post[]> {
    return await invoke<Post[]>("get_all_posts_by_note_id", {
        noteId,
    });
}


export async function deletePostInNote(
    postId: number,
    noteId: number
): Promise<number> {
    return await invoke<number>("delite_post_in_note", {
        postId,
        noteId,
    });
}


export async function updatePostInNote(
    title: string,
    positionInTheNote: number,
    postId: number,
    noteId: number
): Promise<number> {
    return await invoke<number>("all_update_post_in_note", {
        title,
        positionInTheNote,
        postId,
        noteId,
    });
}


export async function updatePostTitle(
    title: string,
    postId: number,
    noteId: number
): Promise<number> {
    return await invoke<number>("title_update_post_in_note", {
        title,
        postId,
        noteId,
    });
}


export async function updatePostPosition(
    position: number,
    postId: number,
    noteId: number
): Promise<number> {
    return await invoke<number>("position_update_post_in_note", {
        position,
        postId,
        noteId,
    });
}