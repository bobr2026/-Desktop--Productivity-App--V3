
# Архитектура БД (SQLite) От оверинжиниринга к прагматизму

> «Архитектура базы данных — это фундамент всего приложения. Построить хрущёвку на фундаменте сарая не выйдет. В разработке продуктов для людей и бизнеса нет "неважных" вещей».

Эта страница — подробный разбор архитектуры SQLite, принятых решений, выявленных ошибок оверинжиниринга и того, как схема должна выглядеть в зрелом продукте.

## 🏛 1. Полная исходная схема БД 

Ниже представлена первоначальная структура базы данных:

```sql
-- 1. Рабочие пространства и базовые стили
CREATE TABLE IF NOT EXISTS workspace (
    workspace_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    color TEXT NULL
);

CREATE TABLE IF NOT EXISTS Paragraph_styles (
    Paragraph_styles_id INTEGER PRIMARY KEY AUTOINCREMENT,
    font_size TEXT,
    color TEXT,
    background TEXT,
    font_weight TEXT,
    text_decoration TEXT,
    text_align TEXT,
    extra_styles TEXT
);

-- 2. Таблицы категорий (дублирование под каждый тип)
CREATE TABLE IF NOT EXISTS categories_folders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    color TEXT,
    parent_id INTEGER,
    workspace_id INTEGER NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES categories_folders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS globol_categorys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    color TEXT,
    parent_id INTEGER,
    workspace_id INTEGER NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES categories_folders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    color TEXT,
    parent_id INTEGER,
    workspace_id INTEGER NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES categories_notes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories_apps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    color TEXT,
    parent_id INTEGER,
    workspace_id INTEGER NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES categories_apps(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    color TEXT,
    parent_id INTEGER,
    workspace_id INTEGER NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES categories_tasks(id) ON DELETE CASCADE
);

-- 3. Основной контент
CREATE TABLE IF NOT EXISTS notes (
    note_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    note_category_id INTEGER,
    status TEXT NOT NULL,
    marks TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    globol_category_id INTEGER,
    workspace_id INTEGER NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
    FOREIGN KEY (note_category_id) REFERENCES categories_notes(id) ON DELETE CASCADE,
    FOREIGN KEY (globol_category_id) REFERENCES globol_categorys(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS apps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    path TEXT NOT NULL,
    icon_path TEXT NOT NULL,
    hotkey TEXT,
    app_category_id INTEGER,
    globol_category_id INTEGER,
    workspace_id INTEGER NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
    FOREIGN KEY (app_category_id) REFERENCES categories_apps(id) ON DELETE CASCADE,
    FOREIGN KEY (globol_category_id) REFERENCES globol_categorys(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS folders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    icon_id INTEGER,
    path TEXT NOT NULL,
    title TEXT NOT NULL,
    hotkey TEXT,
    folder_category_id INTEGER,
    globol_category_id INTEGER,
    workspace_id INTEGER NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
    FOREIGN KEY (folder_category_id) REFERENCES categories_folders(id) ON DELETE CASCADE,
    FOREIGN KEY (globol_category_id) REFERENCES globol_categorys(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS task (
    task_id INTEGER PRIMARY KEY AUTOINCREMENT,
    marks TEXT,
    status TEXT NOT NULL,
    parent_id INTEGER,
    title TEXT NOT NULL,
    task_category_id INTEGER,
    workspace_id INTEGER NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
    FOREIGN KEY (task_category_id) REFERENCES categories_tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES task(task_id) ON DELETE CASCADE
);

-- 4. Структура внутри заметок
CREATE TABLE IF NOT EXISTS posts (
    post_id INTEGER PRIMARY KEY AUTOINCREMENT,
    note_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    position_in_the_note INTEGER,
    FOREIGN KEY (note_id) REFERENCES notes(note_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Paragraph (
    paragraph_id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    culomm INTEGER NOT NULL,
    row INTEGER NOT NULL,
    style_id INTEGER,
    UNIQUE(post_id, row, culomm),
    FOREIGN KEY(post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY(style_id) REFERENCES Paragraph_styles(Paragraph_styles_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS post_files (
    file_id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    file_type TEXT NOT NULL,
    file_path TEXT NOT NULL,
    row INTEGER,
    col INTEGER,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

-- 5. Вспомогательные элементы и связи
CREATE TABLE IF NOT EXISTS external_post_elements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    app_id INTEGER,
    folder_id INTEGER,
    row INTEGER,
    col INTEGER,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE,
    CHECK ((app_id IS NOT NULL AND folder_id IS NULL) OR (app_id IS NULL AND folder_id IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS folder_icons (
    icon_id INTEGER PRIMARY KEY AUTOINCREMENT,
    folder_id INTEGER,
    icon_path TEXT NOT NULL,
    FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dock_panels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    color TEXT,
    name TEXT NOT NULL,
    posstion TEXT,
    workspace_id INTEGER NOT NULL,
    swoh_element_grubs TEXT,
    hotkey TEXT,
    FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Links (
    link_id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_type TEXT NOT NULL,
    source_id INTEGER NOT NULL,
    target_type TEXT NOT NULL,
    target_id INTEGER NOT NULL,
    link_type TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notes_task_links(
    link_id INTEGER PRIMARY KEY AUTOINCREMENT,  
    perent_element_id INTEGER NOT NULL,
    sub_element_id INTEGER NOT NULL,
    swoh_type TEXT NOT NULL
)
````



---

## ❌ 2. Главные ошибки архитектуры и их исправление

### Ошибка №1: Дублирование таблиц категорий
**Проблема:** Таблицы `categories_folders`, `categories_notes`, `categories_apps`, `categories_tasks` и `globol_categorys` имеют идентичную структуру на 100%[.
* **Минусы:** В 5 раз больше кода на Frontend и Backend (в 10 раз дороже в поддержке) Каждая новая фича требует копипаста кода во всех слоях

**Грамотное решение:** Полиморфная колонка `type`
```sql
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    color TEXT,
    type TEXT NOT NULL, -- 'notes', 'folders', 'apps', 'tasks', 'global', 'ideas'
    parent_id INTEGER,
    workspace_id INTEGER NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE
);
```


> **Плюс:** Позволяет добавлять новые типы сущностей (например, `ideas`) без создания новых таблиц в БД.

---

### Ошибка №2: Отсутствие задела под пользователей и монетизацию
**Проблема:** В локальной БД отсутствует таблица `User`. Без неё невозможно отслеживать статус подписки (Free / Pro) и готовить приложение к монетизации и облачной синхронизации.

**Грамотное решение:** Добавление таблицы профиля.
```sql
CREATE TABLE IF NOT EXISTS User (
    user_id INTEGER PRIMARY KEY,  
    type TEXT NOT NULL DEFAULT 'guest', -- 'guest' | 'user' | 'pro'
    token_subscription TEXT
);
```
---

### Ошибка №3: Оверинжиниринг заметок (Абсолютное позиционирование)
**Проблема:** Попытка сделать «Figma внутри заметок» через координаты `row` и `culomm` в таблицах `Paragraph`, `post_files` и `external_post_elements`
* **Минусы:** Десятки багов при рендеринге, сложнейшие расчёты позиции на клиенте Пользователям нужна простота, а не сложный графический редактор там, где нужен текст.
* 
**Грамотное решение:** Универсальная блочная система.
Вместо 4 разрозненных таблиц (`Paragraph`, `Paragraph_styles`, `post_files`, `external_post_elements`) создаётся одна универсальная таблица `blocks`

 заготовленные пресеты вместо кастомной CSS-верстки  позволят контролировать общую стилистику приложения 

```sql
CREATE TABLE IF NOT EXISTS blocks (
    id TEXT PRIMARY KEY, 
    post_id INTEGER NOT NULL,
    block_type TEXT DEFAULT 'text', -- 'text', 'todo', 'image', 'file', 'app_link'
    content TEXT DEFAULT '',        -- текст, JSON, путь к файлу
    styles TEXT DEFAULT '{"preset":"default"}', -- заготовленные пресеты вместо кастомной CSS-верстки
    position_order INTEGER NOT NULL,
    created_at INTEGER NOT NULL, 
    updated_at INTEGER NOT NULL, 
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);
```

---

## 📈 Итоги архитектурного рефакторинга

| Критерий                   | Как было сделано                                   | Как было нужно сделать                   |
| :------------------------- | :------------------------------------------------- | :--------------------------------------- |
| **Количество таблиц**      | 16+ таблиц                                         | **6–8 универсальных таблиц**             |
| **Поддержка категорий**    | Отдельная таблица под каждый тип                   | Одна таблица `categories` с полем `type` |
| **Контент заметок**        | Разрозненные таблицы с координатами (`row`, `col`) | Универсальная блочная система (`blocks`) |
| **Готовность к Sync/PRO**  | Отсутствует                                        | Вшита модель авторизации и подписки[     |
| **Сложность кодовой базы** | Высокая, дублирование кода                         | Низкая, переиспользуемые Handler         |
