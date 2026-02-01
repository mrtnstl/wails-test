package suite

import (
	"api-testing-platform/internals/storage"
	"context"
)

type Project struct {
	Name string
}
type ProjectDBRow struct {
	Project
	ID int
}

func (p *Project) addProject() (int64, error) {
	result, err := storage.DB.DB.ExecContext(
		context.Background(),
		"INSERT INTO projects (name) VALUES (?);",
		p.Name,
	)

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return id, nil
}

func (p *Project)getProjectById(id int) (ProjectDBRow, error){
	// var albums []AlbumDbRow
	var project ProjectDBRow
	rows, err := storage.DB.DB.QueryContext(
		context.Background(),
		"",
		id,
	)
	if err != nil {
		return ProjectDBRow{}, err
	}

	defer rows.Close()

	for rows.Next() {
		var selectedProject ProjectDBRow
		if err := rows.Scan(
			&project.ID, &project.Name,
		); err != nil {
			return ProjectDBRow{}, err
		}
		project = selectedProject
	}

	return project, err
}