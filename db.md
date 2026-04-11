 CREATE TABLE IF NOT EXISTS notes (
      note_id INTEGER PRIMARY KEY AUTOINCREMENT,
	  title TEXT NOT NULL,
      note_category_id INTEGER NULL,
       status TEXT NOT NULL,
       marks TEXT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
       globol_category_id INTEGER NULL, 
       workspace_id INTEGER NOT NULL
         FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id)  ON DELETE CASCADE
      FOREIGN KEY (note_category_id) REFERENCES categories_notes(id) ON DELETE CASCADE
          FOREIGN KEY (globol_category_id) REFERENCES globol_categorys(id)  ON DELETE CASCADE

  );


     CREATE TABLE IF NOT EXISTS posts(
      post_id INTEGER PRIMARY KEY AUTOINCREMENT,
      note_id INTEGER NOT NULL,
	  title TEXT NOT NULL,
	 position_in_the_note INTEGER, 
	  FOREIGN KEY (note_id) REFERENCES notes(note_id) ON DELETE CASCADE

    
  );

   CREATE TABLE IF NOT EXISTS Paragraph(
      paragraph_id INTEGER PRIMARY KEY AUTOINCREMENT,
       post_id INTEGER NOT NULL,
     content TEXT NOT NULL,
	 culomm INTEGER NOT NULL,
     row INTEGER NOT NULL,
    style_id INTEGER NULL,
      UNIQUE(post_id, row, culomm),
      FOREIGN KEY(post_id) REFERENCES posts(post_id), ON DELETE CASCADE
    FOREIGN KEY(style_id) REFERENCES Paragraph_styles(Paragraph_styles_id) ON DELETE SET NULL
    
  );
 CREATE TABLE IF NOT EXISTS  Paragraph_styles(
      Paragraph_styles_id INTEGER PRIMARY KEY AUTOINCREMENT,
	  font_size TEXT NULL,
      color TEXT NULL ,
     background TEXT NULL,
     font_weight TEXT NULL,
     text_decoration TEXT NULL,
     text_align TEXT NULL, 
     extra_styles TEXT NULL, 

    
  );

CREATE TABLE IF NOT EXISTS external_post_elements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    app_id INTEGER NULL,
    folder_id INTEGER NULL,
     row   INTEGER,
      col INTEGER,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE,


CHECK (
    (app_id IS NOT NULL AND folder_id IS NULL) OR
    (app_id IS NULL AND folder_id IS NOT NULL)
)
);
CREATE TABLE IF NOT EXISTS post_files (
    file_id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    file_type TEXT NOT NULL,       
    file_path TEXT NOT NULL,        
     row   INTEGER,
      col INTEGER,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);
