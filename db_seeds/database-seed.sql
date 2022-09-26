

CREATE TABLE songs (
	id TEXT NOT NULL PRIMARY KEY,
	"data" jsonb NOT NULL,
	added_at timestamp with time zone NOT NULL DEFAULT timezone('utc', now())
);
