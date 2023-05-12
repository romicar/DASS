export default class SubTemplateModel {
    TemplateId: string;
    Duration: string
    SilenceLevel: string; 
    script: Record<string, string>;
    id : String;

    constructor(
        Duration: string,
        TemplateId: string,
        SilenceLevel:string,
        id : string,
        script: Record<string, string>
    ) {
        this.Duration = Duration;
        this.TemplateId = TemplateId;
        this.script = script;
        this.id = id;
        this.SilenceLevel = SilenceLevel;
    }
}