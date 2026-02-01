CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
)

CREATE TABLE IF NOT EXISTS test_cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL, -- FK
    case_number INTEGER NOT NULL,
    case_settings TEXT, -- JSON string {"url": "", "method": "", "headers": {}, "query": {}, "body": {} }
    case_result TEXT --JSON string { "statusCode": 200, "responseBody": {} }
)

INSERT INTO projects (name) VALUES (?);
SELECT * FROM projects;
DELETE FROM projects WHERE id = ?; -- TODO: also delete correspondind cases

INSERT INTO test_cases (project_id, case_number/* ??? */, case_settings) VALUES (?, ?, ?);
SELECT * FROM test_cases WHERE project_id = ?; -- get all cases
SELECT * FROM test_cases WHERE id = ?; -- get one case
UPDATE test_cases WHERE id = ? SET case_settings = ?; -- update case settings
UPDATE test_cases WHERE id = ? SET case_result = ?; -- update case result
DELETE FROM test_cases WHERE id = ?; -- dedlete case



