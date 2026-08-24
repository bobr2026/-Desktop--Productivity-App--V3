import { invoke } from "@tauri-apps/api/core";
import { ParagraphStyle } from "../../../shared/types";

export async function addParagraphStyle(
    fontSize: string | null,
    color: string | null,
    background: string | null,
    fontWeight: string | null,
    textDecoration: string | null,
    textAlign: string | null,
    extraStyles: string | null
): Promise<void> {
    await invoke("add_Paragraph_styles", {
        fontSize,
        color,
        background,
        fontWeight,
        textDecoration,
        textAlign,
        extraStyles,
    });
}

export async function getParagraphStyleById(
    styleId: number
): Promise<ParagraphStyle> {
    return await invoke<ParagraphStyle>("get_paragraph_style_by_id", {
        styleId,
    });
}

export async function updateStyleFont(
    styleId: number,
    fontSize: string | null,
    fontWeight: string | null
): Promise<number> {
    return await invoke<number>("update_style_font", {
        styleId,
        fontSize,
        fontWeight,
    });
}

export async function updateStyleColors(
    styleId: number,
    color: string | null,
    background: string | null
): Promise<number> {
    return await invoke<number>("update_style_colors", {
        styleId,
        color,
        background,
    });
}

export async function updateStyleFormatting(
    styleId: number,
    textDecoration: string | null,
    textAlign: string | null
): Promise<number> {
    return await invoke<number>("update_style_formatting", {
        styleId,
        textDecoration,
        textAlign,
    });
}

export async function deleteParagraphStyle(
    styleId: number
): Promise<number> {
    return await invoke<number>("delete_paragraph_style", {
        styleId,
    });
}