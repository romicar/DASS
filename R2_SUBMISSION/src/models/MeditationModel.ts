import { ThirtyFpsTwoTone } from "@mui/icons-material";

export default class MeditationModel {
    id: string;
    label: string;
    value: string;
    // Status: string;
    Aid: string;
    // LastUpdatedArray : string;
    script: Record<string, string>;

    constructor(
        label: string,
        id: string,
        value: string,
        // Status:string,
        // LastUpdatedArray: string,
        Aid : string,
        script: Record<string, string>
    ) {
        this.label = label;
        this.id = id;
        this.value = value;
        this.script = script;
        // this.Status = Status;
        this.Aid = Aid;
        // this.LastUpdatedArray = LastUpdatedArray;
    }
}