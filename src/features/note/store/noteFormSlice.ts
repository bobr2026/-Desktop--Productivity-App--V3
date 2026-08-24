import {
  createEntityAdapter,
  createSlice,
  createSelector,
  PayloadAction,
} from '@reduxjs/toolkit';
import { Paragraph, ParagraphStyle, Post } from '../../../shared/types';
import { postsAdapter, paragraphsAdapter, paragraphStylesAdapter } from '../../../App/store/global_store.types';


// ── Типы (ваши, без изменений) ──────────────────────────────────



// ── Entity adapters ──────────────────────────────────────────────
// selectId говорит адаптеру, какое поле в объекте считать ключом —
// у вас это не "id", а "paragraphId" / "postId" и т.д.




// ── Состояние слайса ─────────────────────────────────────────────

interface NoteFormState {
  noteId: number | null;
  activePostId: number | null;
  activeParagraphId: number | null;
  posts: ReturnType<typeof postsAdapter.getInitialState>;
  paragraphs: ReturnType<typeof paragraphsAdapter.getInitialState>;
  paragraphStyles: ReturnType<typeof paragraphStylesAdapter.getInitialState>;
}

const initialState: NoteFormState = {
  noteId: null,
  activePostId: null,
  activeParagraphId: null,
  posts: postsAdapter.getInitialState(),
  paragraphs: paragraphsAdapter.getInitialState(),
  paragraphStyles: paragraphStylesAdapter.getInitialState(),
};

// ── Slice ─────────────────────────────────────────────────────────

const noteFormSlice = createSlice({
  name: 'noteForm',
  initialState,
  reducers: {
    // Заметка загружена из БД (например, после Tauri-команды get_note) —
    // ВСЕГДА заменяем содержимое целиком через setAll, а не мёржим,
    // иначе при переключении между заметками останутся чужие данные.
    noteOpened(
      state,
      action: PayloadAction<{
        noteId: number;
        posts: Post[];
        paragraphs: Paragraph[];
        paragraphStyles: ParagraphStyle[];
      }>
    ) {
      const { noteId, posts, paragraphs, paragraphStyles } = action.payload;
      state.noteId = noteId;
      postsAdapter.setAll(state.posts, posts);
      paragraphsAdapter.setAll(state.paragraphs, paragraphs);
      paragraphStylesAdapter.setAll(state.paragraphStyles, paragraphStyles);
      state.activePostId = posts[0]?.post_id ?? null;
      state.activeParagraphId = null;
    },

    // Юзер выбрал пост (вкладка/страница внутри заметки)
    postSelected(state, action: PayloadAction<number>) {
      state.activePostId = action.payload;
      state.activeParagraphId = null;
    },
    update_Post_Title(
      state,
      action: PayloadAction<{ post_id: number; title: string}>
    ) {
      postsAdapter.updateOne(state.posts, {
        id: action.payload.post_id,
        changes: { title: action.payload.title },
      });
    },


    // Юзер кликнул в параграф — сохраняем только id,
    // сам объект достаётся селектором из entities (см. ниже)
    paragraphFocused(state, action: PayloadAction<number>) {
      state.activeParagraphId = action.payload;
    },

    // Изменился текст параграфа — O(1) точечное обновление,
    // никакого find()/map() по всему массиву
    paragraphContentChanged(
      state,
      action: PayloadAction<{ paragraph_id: number; content: string }>
    ) {
      paragraphsAdapter.updateOne(state.paragraphs, {
        id: action.payload.paragraph_id,
        changes: { content: action.payload.content },
      });
    },


    // Применили стиль к параграфу
    paragraphStyleChanged(
      state,
      action: PayloadAction<{ paragraph_id: number; style_id: number | null }>
    ) {
      paragraphsAdapter.updateOne(state.paragraphs, {
        id: action.payload.paragraph_id,
        changes: { style_id: action.payload.style_id },
      });
    },

    // Новый параграф создан (например, Enter в редакторе).
    // Payload — уже готовый объект с id, который вернула БД
    // после INSERT (см. комментарий про Tauri-command ниже).
    paragraphAdded(state, action: PayloadAction<Paragraph>) {
      paragraphsAdapter.addOne(state.paragraphs, action.payload);
    },


    paragraphStyleAdded(state, action: PayloadAction<ParagraphStyle>) {
      paragraphStylesAdapter.addOne(state.paragraphStyles, action.payload);
    },
    paragraphStyleRemoved(state, action: PayloadAction<number>) {
      paragraphStylesAdapter.removeOne(state.paragraphStyles, action.payload);
     },
     paragraphStyle_font_size_update(
      state,
      action: PayloadAction<{ style_id: number; font_size: string | null }>
    ) {
      paragraphStylesAdapter.updateOne(state.paragraphStyles, {
      id: action.payload.style_id,
        changes: { font_size: action.payload.font_size},
      });
    },
    paragraphStyle_color_update(
      state,
      action: PayloadAction<{ style_id: number; color: string | null }>
    ) {
      paragraphStylesAdapter.updateOne(state.paragraphStyles, {
      id: action.payload.style_id,
        changes: { color:action.payload.color},
      });
    },
    paragraphStyle_background_update(
      state,
      action: PayloadAction<{ style_id: number; background: string | null }>
    ) {
      paragraphStylesAdapter.updateOne(state.paragraphStyles, {
      id: action.payload.style_id,
        changes: { background:action.payload.background},
      });
    },
    resetParagraphStyle: (state, action: PayloadAction<number>) => {
      paragraphStylesAdapter.updateOne(state.paragraphStyles, {
        id: action.payload,
        changes: {
          font_size: null,
          color: null,
          background: null,
          font_weight: null,
          text_decoration: null,
          text_align: null,
          extra_styles: null,
        },
      });
    },
    //  paragraphStyle_font_size_update(state, action: PayloadAction<{Paragraph_styles_id:number, font_size:number}>) {
    //   paragraphStylesAdapter.updateOne(state.paragraphStyles, {
    //     id:action.payload.Paragraph_styles_id,
    //     caches:{font_size:action.payload.font_size}
    //   });
    //  },
    

    // Параграф удалён
    paragraphRemoved(state, action: PayloadAction<number>) {
      paragraphsAdapter.removeOne(state.paragraphs, action.payload);
      if (state.activeParagraphId === action.payload) {
        state.activeParagraphId = null;
      }
    },
    postRemoved(state, action: PayloadAction<number>) {
      postsAdapter.removeOne(state.posts, action.payload);
      if (state.activePostId === action.payload) {
        state.activePostId = null;
      }
    },
        // Новый пост создан (кнопка "Новый пост"). Payload — уже готовый
    // объект с postId, который вернула БД после INSERT.
    postAdded(state, action: PayloadAction<Post>) {
      postsAdapter.addOne(state.posts, action.payload);
      state.activePostId = action.payload.post_id;
      state.activeParagraphId = null;
    },
 

  },
});

export const {
  noteOpened,
  postSelected,
  paragraphFocused,
  paragraphContentChanged,
  paragraphStyleChanged,
  paragraphAdded,
  paragraphRemoved,
  postAdded,
  postRemoved,
  update_Post_Title
} = noteFormSlice.actions;

export default noteFormSlice.reducer;

// ── Селекторы ────────────────────────────────────────────────────
// RootState замените на реальный тип вашего корневого стора

type RootState = { noteForm: NoteFormState };

export const paragraphsSelectors = paragraphsAdapter.getSelectors<RootState>(
  (state) => state.noteForm.paragraphs
);

export const postsSelectors = postsAdapter.getSelectors<RootState>(
  (state) => state.noteForm.posts
);

export const paragraphStylesSelectors =
  paragraphStylesAdapter.getSelectors<RootState>(
    (state) => state.noteForm.paragraphStyles
  );



// Активный параграф — не отдельная копия данных, а поиск по id
// в единственном источнике истины (entities)
export const selectActiveParagraph = (state: RootState) => {
  const id = state.noteForm.activeParagraphId;
  return id !== null ? paragraphsSelectors.selectById(state, id) : undefined;
};

// Стиль активного параграфа — тоже без отдельного поля в сторе
export const selectActiveParagraphStyle = createSelector(
  [selectActiveParagraph, (state: RootState) => state.noteForm.paragraphStyles],
  (paragraph, stylesState) => {
    if (!paragraph?.style_id) return null;
    return paragraphStylesAdapter
      .getSelectors()
      .selectById(stylesState, paragraph.style_id) ?? null;
  }
);

    // Новый пост создан (кнопка "Новый пост"). Payload — уже готовый
    // объект с postId, который вернула БД после INSERT.


// Параграфы активного поста, отсортированные для рендера холста.
// createSelector кэширует результат — компонент не перерендерится
// зря, пока paragraphs/activePostId реально не изменились.
export const selectParagraphsOfActivePost = createSelector(
  [paragraphsSelectors.selectAll, (state: RootState) => state.noteForm.activePostId],
  (allParagraphs, activePostId) =>
    allParagraphs
      .filter((p) => p.post_id === activePostId)
      .sort((a, b) => a.row - b.row || a.culomm - b.culomm)
);

export const selectParagraphsGroupedByPost = createSelector(
  [paragraphsSelectors.selectAll],
  (allParagraphs) => {
    const grouped: Record<number, Paragraph[]> = {};
    for (const paragraph of allParagraphs) {
      (grouped[paragraph.post_id] ??= []).push(paragraph);
    }
    for (const postId in grouped) {
      grouped[postId].sort((a, b) => a.row - b.row || a.culomm - b.culomm);
    }
    return grouped;
  }
);
