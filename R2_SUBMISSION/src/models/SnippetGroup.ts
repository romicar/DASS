export interface SnippetGroup {
    Status:                 string;
    supportedTechniques:    string;
    Rating?:                number;
    "Supported Goals":      string[];
    supportedGoals:         string;
    snippetType:            string;
    "Added By"?:            string;
    "Supported Guidance":   string[];
    label:                  string;
    "Snippet Name":         string;
    "Type of Snippet":      string;
    "Snippet Text"?:        string;
    "Audio Duration":       string;
    "Supported Techniques": string[];
    "Audio File":           AudioFile[];
    guidanceLevel?:         string;
    "Skill-level"?:         string[];
    value:                  string;
    silenceDuration:        string;
    skillLevel?:            string;
}

export interface AudioFile {
    filename: string;
    size:     number;
    id:       string;
    type:     string;
    url:      string;
}
