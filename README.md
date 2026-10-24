# 🚀 Desktop Productivity App (V3) — Case Study & Post-Mortem

Репозиторий с подробным разбором разработки многоверсионного десктопного приложения для продуктивности (Tauri, Rust, React, TypeScript, SQLite).

Это не просто описание кода, а полноценный инженерный и продуктовый кейс: от первых прототипов и поиска гипотез до проектирования базы данных, архитектуры FSD-Lite и рефлексии ошибок.

## 📚 Подробный разбор уроков V3 (Deep Dive Retrospective)

Все материалы разбиты по логическим темам. Выберите интересующий раздел для чтения:

### 📊 1. Продукт, Аналитика и Маркетинг

- 🔗 [0.1 Продуктовая аналитика (Идеал)](./docs/01-product%20analytics%20(ideal).md)
    
    - _Зачем нужна аналитика, Discovery, работы с LLM, Yandex Wordstat, Google Trends и проектирование MVP._
        
- 🔗 [Первые шаги в продуктовой аналитике](./docs/02-First%20steps%20in%20product%20analytics.md)
    
    - _Разбор первых ошибок: иллюзия «уникальности», слепая вера ИИ и сбор фич вместо решения болей._
        

### 🎨 2. UI/UX Design & Эмоциональный UX

- 🔗 [UX/UI Design: От интерфейса 2010 года к референсам](./docs/03-UX%20UI%20Design%20(From%20«2010-style%20interfaces»%20to%20references).md)
    
    - _Эволюция визуального стиля, Pinterest, сборки в Figma, сокращение кликов и формирующий удержание Tone of Voice._
        

### 🏗 3. Архитектура и Инженерные решения

- 🔗 [Архитектура БД (SQLite): От оверинжинирингa к прагматизму](./docs/04-Architecture_&_Databases_SQLite.md)
    
    - _Разбор 16+ таблиц, устранение дублирования категорий через type, блочная система заметок и подготовка к PRO/Sync._
        
- 🔗 [Frontend Architecture: FSD-Lite](./docs/05-Frontend%20Architecture%20FSD-Lite.md)
    
    - _Прагматичный FSD без догм: слои app, pages, layouts, features, shared и tauri-services._
        
- 🔗 [Backend Architecture: Rust / Tauri (Domain-Driven Approach)](./docs/06-Backend-Architecture%20%20(Rust%20Tauri)%20%20Domain-Driven-Approach.md)
    
    - _Изоляция доменов в `src-tauri/src/`, прямые SQL-запросы, Tauri IPC-команды и работа с системными API._
        
- 🔗 [Git & Git-Flow Process (Эволюция работы с версиями)](./docs/07-git-flow-and-vcs.md)
    
    - _Путь от «копия проекта 25 ГБ» к изоляции фиче-веток и стандарту Conventional Commits._
        

### 🧠 4. Менеджмент, Рефлексия и Post-Mortem

- 🔗 [Рефлексия и крах свободы](./docs/08-Reflection%20and%20the%20Collapse%20of%20Freedom.md)
    
    - _Иллюзии легких денег, ошибки позиционирования «комбайна», ранний маркетинг и продуктовый Post-Mortem._
        
- 🔗 [Соло-разработка, TikTok и выгорание](./docs/09-solo%20development%20and%20burnout.md)
    
    - _Честная история про работу по 12 часов, съемку/монтаж/озвучку TikTok в одиночку и выход из выгорания._
        

### 🛠 Технологический стек проекта

- **Frontend:** React, TypeScript, Redux Toolkit, Sass (FSD-Lite).
    
- **Backend:** Rust, Tauri IPC, SQLite (`rusqlite`).
    
- **Инструменты:** Figma, Aseprite, Cursor, Git, Obsidian.
