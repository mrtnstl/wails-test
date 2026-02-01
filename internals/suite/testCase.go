package suite

type TestCase struct {
	ProjectId int
	CaseNumber int
	CaseSettings map[string]string
	CaseResult map[string]any
}
type TestCaseDBRow struct {
	TestCase
	ID int
}

