
import { Page, Section, SectionContent } from "../CreateStyles";
import {
    TemplateInfoForm,
    RowTR, ColTDLabel,
    TemplateNameInput,
    ColTD,
    TechniqueBox,
    DSInfoBox,
    DSBox,
    Line,
    MidLabel,
    AddButton,
    BlackButton,
    TransButton,
    InputBox,
    IconDelete,
    CopyButton, CopyLabel

} from '../CreateTemplate/CreateTemplateStyle'
import CreateTopBar from "./Topbar";
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import DropDownPicker from "../../../DropDownPicker";
import DialogBox from "./components/DialogBox";
import Airtable from "airtable";
import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } from "../../../../integrations/credentials";
import LoadingSpinner from "../../../Loading/loading";
import { useParams } from "react-router-dom";
import { setTextRange } from "typescript";

// @ts-ignore
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
const { v4: uuidv4 } = require('uuid');
const primaryTechniques: string[] = ["breathFocus", "gratitude", "breathControl", "Normal", "Low", "Very-Low"];
const secondaryTechniques: string[] = ["none", "gratitude", "breathControl", "Normal", "Low", "Very-Low"];
const durationLevel: string[] = ["1", "2", "3", "4", "5", "6", "8", "10", "12", "15", "20", "30"];
const silenceLevel: string[] = ["Very High", "High", "Normal", "Low", "Very-Low"];

interface TemplateInfoInterface {
    templateID: string;
    templateName: string;
    primaryTechnique: string;
    secondaryTechnique: string[];
}

interface CopyToInterface {
    duration: string;
    silenceLevel: string[];
}

interface DSInfoInterface {
    duration: string;
    silenceLevel: string;
}

interface CopyDSInfoInterface {
    duration: string;
    silenceLevel: string;
}

interface snippetDataInterface {
    type: "snippet" | "silence";
    value: string;
    id: string;
}

interface templateScript {
    templateID: string;
    templateName: string;
    primaryTechnique: string;
    secondaryTechnique: string[];
    duration: string;
    silenceLevel: string;
    script: string;
}

function PrimaryTechniqueElem({ text, active, setTemplateInfoData, templateInfoData, activeState }: {
    text: string,
    active: boolean,
    setTemplateInfoData: React.Dispatch<React.SetStateAction<TemplateInfoInterface>>,
    templateInfoData: TemplateInfoInterface
    activeState: Boolean
}) {
    return <>
        <TechniqueBox
            className={active ? "activeTechnique" : ""}
            onClick={() => {
                if (!activeState)
                    setTemplateInfoData({ ...templateInfoData, primaryTechnique: text });
            }}>{text}
        </TechniqueBox>
    </>
}

function SecondaryTechniqueElem({ text, active, setTemplateInfoData, templateInfoData, activeState }: {
    text: string,
    active: boolean,
    setTemplateInfoData: React.Dispatch<React.SetStateAction<TemplateInfoInterface>>,
    templateInfoData: TemplateInfoInterface
    activeState: Boolean
}) {
    return <>
        <TechniqueBox
            className={active ? "activeTechnique" : ""}
            onClick={() => {
                if (!activeState) {

                    if (templateInfoData.secondaryTechnique.includes(text) && templateInfoData.secondaryTechnique.length > 1)
                        setTemplateInfoData({ ...templateInfoData, secondaryTechnique: templateInfoData.secondaryTechnique.filter((t) => t !== text) });
                    else if (!templateInfoData.secondaryTechnique.includes(text)) {
                        if (text === "none") {
                            setTemplateInfoData({ ...templateInfoData, secondaryTechnique: [text] });
                            return;
                        }
                        else {
                            setTemplateInfoData({ ...templateInfoData, secondaryTechnique: [...templateInfoData.secondaryTechnique.filter((x) => x !== "none"), text] });
                        }

                    }
                }
            }}>{text}
        </TechniqueBox>
    </>
}

function TemplateInfo({ setTemplateInfoData, templateInfoData, setVisible, setText }:
    {
        setTemplateInfoData: React.Dispatch<React.SetStateAction<TemplateInfoInterface>>,
        templateInfoData: TemplateInfoInterface,
        setVisible: React.Dispatch<React.SetStateAction<Boolean>>,
        setText: React.Dispatch<React.SetStateAction<string>>,
    }) {
    return <>
        <TemplateInfoForm>
            <RowTR>
                <ColTDLabel>
                    templateID
                </ColTDLabel>
                <ColTD><label>{templateInfoData.templateID}</label>
                </ColTD>
            </RowTR>
            <RowTR>
                <ColTDLabel><label >
                    templateName
                </label>
                </ColTDLabel>
                <ColTD>
                    <TemplateNameInput
                        placeholder="Add Name"
                        type="email" id="email"
                        autoComplete="off"
                        value={templateInfoData.templateName}
                    />
                </ColTD>
            </RowTR>
            <RowTR>
                <ColTDLabel><label >
                    primaryTechnique
                </label>
                </ColTDLabel>
                <ColTD>
                    {primaryTechniques.map((technique) => {
                        return <PrimaryTechniqueElem
                            text={technique}
                            key={technique}
                            active={templateInfoData.primaryTechnique === technique}
                            setTemplateInfoData={setTemplateInfoData}
                            templateInfoData={templateInfoData}
                            activeState={false}
                        />
                    })}
                </ColTD>
            </RowTR>
            <RowTR>
                <ColTDLabel><label >
                    secondaryTechnique
                </label>
                </ColTDLabel>
                <ColTD>
                    {secondaryTechniques.map((technique) => {
                        return <SecondaryTechniqueElem
                            text={technique}
                            key={technique}
                            active={templateInfoData.secondaryTechnique.includes(technique)}
                            setTemplateInfoData={setTemplateInfoData}
                            templateInfoData={templateInfoData}
                            activeState={false}
                        />
                    })}
                </ColTD>
            </RowTR>
        </TemplateInfoForm>

    </>
}

function DSDElem({ text, active, exist, setDSInfoData, DSInfoData }: {
    text: string,
    active: boolean,
    exist: boolean,
    setDSInfoData: React.Dispatch<React.SetStateAction<DSInfoInterface>>,
    DSInfoData: DSInfoInterface
}) {
    return <>

        <DSBox
            className={(!exist && active && "active_notexistDSbox") || (!exist && "notexistDSbox") || (exist && active && "activeDSbox") || ""}
            onClick={() => {
                if (DSInfoData.silenceLevel === "Master")
                    setDSInfoData({ silenceLevel: "", duration: text });
                else setDSInfoData({ ...DSInfoData, duration: text });

            }}>{text}
        </DSBox>
    </>
}

function DSSElem({ text, active, exist, setDSInfoData, DSInfoData }: {
    text: string,
    active: boolean,
    exist: boolean,
    setDSInfoData: React.Dispatch<React.SetStateAction<DSInfoInterface>>,
    DSInfoData: DSInfoInterface
}) {
    return <>
        <DSBox
            className={(!exist && active && "active_notexistDSbox") || (!exist && "notexistDSbox") || (exist && active && "activeDSbox") || ""}
            onClick={() => {
                // if (exist) setDSInfoData({ ...DSInfoData, silenceLevel: text });
                if (DSInfoData.silenceLevel === "Master")
                    setDSInfoData({ duration: "", silenceLevel: text });
                else setDSInfoData({ ...DSInfoData, silenceLevel: text });
            }}>{text}
        </DSBox>
    </>
}

function DSInfo({ setDSInfoData, DSInfoData, savedTemplates }:
    {
        setDSInfoData: React.Dispatch<React.SetStateAction<DSInfoInterface>>,
        DSInfoData: DSInfoInterface,
        savedTemplates: templateScript[]
    }) {
    let master_exists = savedTemplates.filter((s) => {
        return s.duration === "Master" && s.silenceLevel === "Master";
    }).length === 1;

    let master_active = DSInfoData.duration === "Master";

    // console.log(master_exists)
    return <>
        <DSInfoBox>
            <TemplateInfoForm>
                <RowTR>
                    <ColTDLabel><label >
                        Duration
                    </label>
                    </ColTDLabel>
                    <ColTD>
                        {<DSBox
                            className={(!master_exists && master_active && "active_notexistDSbox") || (!master_exists && "notexistDSbox") || (master_exists && DSInfoData.duration === "Master" && "activeDSbox") || ""}
                            onClick={() => {
                                setDSInfoData({ silenceLevel: "Master", duration: "Master" })
                            }}>{"Master"}
                        </DSBox>}
                        {durationLevel.map((level) => {
                            return <>
                                <DSDElem
                                    text={level}
                                    key={level}
                                    active={DSInfoData.duration === level}
                                    setDSInfoData={setDSInfoData}
                                    DSInfoData={DSInfoData}
                                    exist={
                                        savedTemplates.filter((s) => {
                                            return s.duration === level;
                                        }).length !== 0
                                    }
                                />
                            </>
                        })}
                    </ColTD>
                </RowTR>
                <RowTR>
                    <ColTDLabel><label >
                        Silence Level
                    </label>
                    </ColTDLabel>
                    <ColTD>
                        {<DSBox
                            className={(!master_exists && master_active && "active_notexistDSbox") || (!master_exists && "notexistDSbox") || (master_exists && DSInfoData.silenceLevel === "Master" && "activeDSbox") || ""}
                            onClick={() => {
                                setDSInfoData({ silenceLevel: "Master", duration: "Master" })
                            }}>{"Master"}
                        </DSBox>}
                        {silenceLevel.map((level) => {
                            return <>
                                <DSSElem
                                    text={level}
                                    key={level}
                                    active={DSInfoData.silenceLevel === level}
                                    setDSInfoData={setDSInfoData}
                                    DSInfoData={DSInfoData}
                                    exist={
                                        savedTemplates.filter((s) => {
                                            return s.duration === DSInfoData.duration && s.silenceLevel === level;
                                        }).length === 1
                                    }
                                />
                            </>
                        })}
                    </ColTD>
                </RowTR>
            </TemplateInfoForm>
        </DSInfoBox>
    </>
}


function CopyDSDElem({ text, active, exist, setCopyDSInfoData, CopyDSInfoData }: {
    text: string,
    active: boolean,
    exist: boolean,
    setCopyDSInfoData: React.Dispatch<React.SetStateAction<CopyDSInfoInterface>>,
    CopyDSInfoData: CopyDSInfoInterface
}) {
    return <>
        <DSBox
            className={(!exist && "notexistDSbox") || (exist && active && "activeDSbox") || ""}
            onClick={() => {
                if (!exist) return;
                // if (exist) setCopyDSInfoData({ ...CopyDSInfoData, duration: text });
                if (CopyDSInfoData.silenceLevel === "Master")
                    setCopyDSInfoData({ silenceLevel: "", duration: text });
                else setCopyDSInfoData({ ...CopyDSInfoData, duration: text });
            }}>{text}
        </DSBox>
    </>
}

function CopyDSSElem({ text, active, exist, setCopyDSInfoData, CopyDSInfoData }: {
    text: string,
    active: boolean,
    exist: boolean,
    setCopyDSInfoData: React.Dispatch<React.SetStateAction<CopyDSInfoInterface>>,
    CopyDSInfoData: CopyDSInfoInterface
}) {
    return <>
        <DSBox
            className={(!exist && "notexistDSbox") || (exist && active && "activeDSbox") || ""}
            onClick={() => {
                if (!exist) return;
                // if (exist) setCopyDSInfoData({ ...CopyDSInfoData, silenceLevel: text });
                if (CopyDSInfoData.duration === "Master")
                    setCopyDSInfoData({ duration: "", silenceLevel: text });
                else setCopyDSInfoData({ ...CopyDSInfoData, silenceLevel: text });
            }}>{text}
        </DSBox>
    </>
}

function DSCopyInfo({ setCopyDSInfoData, CopyDSInfoData, savedTemplates }:
    {
        setCopyDSInfoData: React.Dispatch<React.SetStateAction<CopyDSInfoInterface>>,
        CopyDSInfoData: CopyDSInfoInterface
        savedTemplates: templateScript[]
    }) {

    let master_active = savedTemplates.filter((s) => s.duration === "Master").length > 0;
    return <>
        <DSInfoBox>
            <TemplateInfoForm>
                <RowTR>
                    <ColTD>
                        {<DSBox
                            className={(!master_active && "notexistDSbox") || (master_active && CopyDSInfoData.duration === "Master" && "activeDSbox") || ""}
                            onClick={() => {
                                setCopyDSInfoData({ duration: "Master", silenceLevel: "Master" });
                            }}>{"Master"}
                        </DSBox>}
                        {durationLevel.map((level) => {
                            return <>
                                <CopyDSDElem
                                    text={level}
                                    key={level}
                                    active={CopyDSInfoData.duration === level}
                                    setCopyDSInfoData={setCopyDSInfoData}
                                    CopyDSInfoData={CopyDSInfoData}
                                    exist={savedTemplates.filter((s) => s.duration === level).length > 0}
                                />
                            </>
                        })}
                    </ColTD>
                </RowTR>
                <RowTR>
                    <ColTD>
                        {<DSBox
                            className={(!master_active && "notexistDSbox") || (master_active && CopyDSInfoData.duration === "Master" && "activeDSbox") || ""}
                            onClick={() => {
                                setCopyDSInfoData({ duration: "Master", silenceLevel: "Master" });
                            }}>{"Master"}
                        </DSBox>}
                        {silenceLevel.map((level) => {
                            return <>
                                <CopyDSSElem
                                    text={level}
                                    key={level}
                                    active={CopyDSInfoData.silenceLevel === level}
                                    setCopyDSInfoData={setCopyDSInfoData}
                                    CopyDSInfoData={CopyDSInfoData}
                                    exist={savedTemplates.filter((s) => {
                                        return s.duration === CopyDSInfoData.duration && s.silenceLevel === level;
                                    }).length !== 0}
                                />
                            </>
                        })}
                    </ColTD>
                </RowTR>
            </TemplateInfoForm>
        </DSInfoBox>
    </>
}

function SnippetContainer({ setSnippetData, snippetData, options, idx, snippetOptionsData }:
    {
        setSnippetData: React.Dispatch<React.SetStateAction<snippetDataInterface[]>>,
        snippetData: snippetDataInterface[],
        options: string[],
        idx: number,
        snippetOptionsData: any
    }) {
    var min_a = 0, max_a = 0, min_s = 0, max_s = 0;
    if (snippetOptionsData[snippetData[idx]?.value]) {
        min_a = Math.min(...snippetOptionsData[snippetData[idx]?.value]?.audio)
        max_a = Math.max(...snippetOptionsData[snippetData[idx]?.value]?.audio)
        min_s = Math.min(...snippetOptionsData[snippetData[idx]?.value]?.silence)
        max_s = Math.max(...snippetOptionsData[snippetData[idx]?.value]?.silence)
    }
    return <>
        <TemplateInfoForm>
            <IconDelete><DeleteIcon style={{ float: "right" }} onClick={
                () => {
                    setSnippetData(snippetData.filter((elem, index) => index !== idx))
                }
            } /></IconDelete>

            <RowTR>
                <ColTDLabel><label >
                    {idx + 1}. snippetGroupName
                </label>
                </ColTDLabel>
                <ColTD>
                    <DropDownPicker
                        title={""}
                        options={options.map((op) => { return { label: op, value: op } })}
                        selectedValue={snippetData[idx].value}
                        onChange={(evt) => {
                            let copy = [...snippetData];
                            copy[idx].value = evt.target.value;
                            setSnippetData(copy);
                        }}
                    />
                </ColTD>
                <ColTD><div style={{ width: "100px" }}></div></ColTD>
                <ColTD>
                    {Math.floor(min_a / 60).toLocaleString('en-US', {
                        minimumIntegerDigits: 2,
                        useGrouping: false
                    }) || 0}:{(min_a % 60).toLocaleString('en-US', {
                        minimumIntegerDigits: 2,
                        useGrouping: false
                    }) || 0} - {Math.floor(max_a / 60).toLocaleString('en-US', {
                        minimumIntegerDigits: 2,
                        useGrouping: false
                    }) || 0}:{(max_a % 60).toLocaleString('en-US', {
                        minimumIntegerDigits: 2,
                        useGrouping: false
                    }) || 0}
                </ColTD>
                <ColTD><div style={{ width: "80px" }}></div></ColTD>
                <ColTD>
                    {Math.floor(min_s / 60).toLocaleString('en-US', {
                        minimumIntegerDigits: 2,
                        useGrouping: false
                    }) || 0}:{(min_s % 60).toLocaleString('en-US', {
                        minimumIntegerDigits: 2,
                        useGrouping: false
                    }) || 0} - {Math.floor(max_s / 60).toLocaleString('en-US', {
                        minimumIntegerDigits: 2,
                        useGrouping: false
                    }) || 0}:{(max_s % 60).toLocaleString('en-US', {
                        minimumIntegerDigits: 2,
                        useGrouping: false
                    }) || 0}
                </ColTD>
            </RowTR>
        </TemplateInfoForm>
    </>

}

function SilenceContainer({ setSnippetData, snippetData, idx }:
    {
        setSnippetData: React.Dispatch<React.SetStateAction<snippetDataInterface[]>>,
        snippetData: snippetDataInterface[],
        idx: number
    }) {

    return <>
        <TemplateInfoForm>
            <IconDelete><DeleteIcon style={{ float: "right" }} onClick={
                () => {
                    setSnippetData(snippetData.filter((elem, index) => index !== idx))
                }
            } /></IconDelete>

            <RowTR>
                <ColTDLabel><label >
                    {idx + 1}. silenceDuration
                </label>
                </ColTDLabel>
                <ColTD>
                    <InputBox
                        value={snippetData[idx].value}
                        placeholder={"Time in sec"}
                        onChange={(event) => {
                            let copy = [...snippetData]
                            copy[idx].value = event.target.value
                            if ((!isNaN(parseFloat(copy[idx].value)) && isFinite(Number(copy[idx].value))) || event.target.value === "")
                                setSnippetData(copy)
                        }}
                    />
                </ColTD>
            </RowTR>
        </TemplateInfoForm>
    </>

}

const stringToScript = (str: string) => {
    let script = JSON.parse(str);
    let snipData: snippetDataInterface[] = [];
    for (let i = 1; script[`position${i}`]; i++) {
        if (script[`position${i}`].startsWith("silence")) {
            snipData.push({ type: "silence", value: script[`position${i}`].slice(7), id: uuidv4() })
        }
        else {
            snipData.push({ type: "snippet", value: script[`position${i}`], id: uuidv4() })
        }
    }
    return snipData;
}



function CreatePage() {
    const { temID } = useParams();
    const [savedTemplates, setSavedTemplates] = useState<templateScript[]>([]);
    const [visible, setVisible] = useState<Boolean>(false);
    const [text, setText] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false)
    const [copy, setCopy] = useState(false)
    const [copyTo, setCopyTo] = useState<CopyToInterface[]>([])

    const i_templateInfoData = {
        templateID: "",
        templateName: "",
        primaryTechnique: "",
        secondaryTechnique: [],
    };

    const i_DSInfoData = {
        duration: "",
        silenceLevel: ""
    };

    const [templateInfoData, setTemplateInfoData] = useState<TemplateInfoInterface>(i_templateInfoData);
    const [DSInfoData, setDSInfoData] = useState<DSInfoInterface>(i_DSInfoData);
    const [CopyDSInfoData, setCopyDSInfoData] = useState<CopyDSInfoInterface>(
        {
            duration: "",
            silenceLevel: ""
        });

    const [snippetData, setSnippetData] = useState<snippetDataInterface[]>(
        []);
    const [preRecordsId, setPreRecordsId] = useState<string[]>([]);
    const [snippetContainerOptions, setSnippetContainerOptions] = useState<string[]>([]);

    useEffect(() => {
        let preExistingRecords: any[] = []
        var base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
        setIsLoading(true);
        base('Templates').find(String(temID), function (err, record: any) {
            setIsLoading(false);
            if (err) {
                setVisible(true);
                setText(err.toString());
                console.error(err); return;
            }
            // console.log('Retrieved', record.fields)
            let tid = record.fields.TemplateID;
            let tname = record.fields.templateDisplayName;
            let tpt = record.fields.PrimaryTechnique || "";
            let tst = record.fields.SecondaryTechnique || [];
            setTemplateInfoData({
                templateID: record.fields.TemplateID,
                templateName: record.fields.templateDisplayName,
                primaryTechnique: record.fields.PrimaryTechnique || "",
                secondaryTechnique: record.fields.SecondaryTechnique || [],
            });
            setIsLoading(true);
            base('SubTemplates')
                .select({
                    view: "Grid view"
                }).eachPage(function page(records, fetchNextPage) {
                    records.forEach(function (record) {

                        if (record.fields.TemplateId === tid)
                            preExistingRecords.push(record)
                    });
                    fetchNextPage();
                }, function done(err) {
                    setIsLoading(false);
                    if (err) {
                        setVisible(true);
                        setText(err.toString());
                        console.error(err);
                        return;
                    }
                    // setSnippetData([]);
                    setPreRecordsId(preExistingRecords.map((rec) => rec.id))
                    setSavedTemplates(preExistingRecords.map((rec) => {
                        return {
                            templateID: tid,
                            templateName: tname,
                            primaryTechnique: tpt,
                            secondaryTechnique: tst,
                            duration: rec.fields.Duration,
                            silenceLevel: rec.fields.SilenceLevel,
                            script: rec.fields.templateStructure
                        }
                    }));
                });
        });
    }, []);
    // console.log(savedTemplates)

    const saveCurrentTemplate = () => {
        if (templateInfoData.templateName === "") {
            setVisible(true);
            setText("Please provide template name");
            return;
        }
        if (snippetData.length === 0) {
            setVisible(true);
            setText("Please provide template script");
            return;
        }
        if (DSInfoData.duration === "") {
            setVisible(true);
            setText("Please provide duration");
            return;
        }
        if (DSInfoData.silenceLevel === "") {
            setVisible(true);
            setText("Please provide silenceLevel");
            return;
        }
        for (let i = 0; i < snippetData.length; i++) {
            if (snippetData[i].type === 'silence') {
                if (snippetData[i].value === '') {
                    setVisible(true);
                    setText(`Please provide silence value at position ${i + 1} of script`);
                    return;
                }
            }
            else {
                if (snippetData[i].value === '' || snippetData[i].value === 'Snippet Group Type') {
                    setVisible(true);
                    setText(`Please select snippet value at position ${i + 1} of script`);
                    return;
                }
            }
        }
        let script: any = {};
        for (let i = 1; i <= snippetData.length; i++) {
            if (snippetData[i - 1].type === "silence")
                script[`position${i}`] = `silence${snippetData[i - 1].value}`;
            else
                script[`position${i}`] = `${snippetData[i - 1].value}`;
        }
        let template: templateScript = {
            templateID: templateInfoData.templateID,
            templateName: templateInfoData.templateName,
            primaryTechnique: templateInfoData.primaryTechnique,
            secondaryTechnique: templateInfoData.secondaryTechnique,
            duration: DSInfoData.duration,
            silenceLevel: DSInfoData.silenceLevel,
            script: JSON.stringify(script)
        };
        setSavedTemplates([...savedTemplates.filter((st) => {
            return st.duration !== template.duration || st.silenceLevel !== template.silenceLevel;
        }), template]);
        // setDSInfoData({
        //     duration: "", silenceLevel: ""
        // });
        // setSnippetData([]);

        setVisible(true);
        setText("Added Subtemplate")
    }

    const copyTemplate = () => {
        let copy: templateScript[] = savedTemplates.filter((st) => {
            return st.duration === CopyDSInfoData.duration
                && st.silenceLevel === CopyDSInfoData.silenceLevel;
        });
        if (copy.length === 0) {
            setVisible(true);
            setText(`No template saved with duration '${CopyDSInfoData.duration}' and silenceLevel '${CopyDSInfoData.silenceLevel}'`);
            return;
        }


        let newAdds: templateScript[] = []

        let templateS = savedTemplates.filter((st) => {
            return st.duration === CopyDSInfoData.duration
                && st.silenceLevel === CopyDSInfoData.silenceLevel;
        })[0];
        // alert(JSON.stringify(templateS))
        for (let x of copyTo) {
            let duration = x.duration
            let silenceList = x.silenceLevel

            if (silenceList.includes("All")) {
                for (let silence of silenceLevel) {
                    newAdds.push({ ...templateS, duration: duration, silenceLevel: silence })
                }
            }
            else {
                for (let silence of silenceList) {
                    newAdds.push({ ...templateS, duration: duration, silenceLevel: silence })
                }
            }

        }
        setSavedTemplates([...savedTemplates, ...newAdds])
        setCopyTo([])
    }
    // console.log(savedTemplates)

    useEffect(() => {
        // if (DSInfoData.duration && DSInfoData.silenceLevel) {
        let copy: templateScript[] = savedTemplates.filter((st) => {
            return st.duration === DSInfoData.duration
                && st.silenceLevel === DSInfoData.silenceLevel;
        });
        if (copy.length !== 0)
            setSnippetData(stringToScript(copy[0].script))
        else setSnippetData([])
        // console.log(DSInfoData)
        // }
    }, [DSInfoData]);



    const getChunks = (SubTemplates: any) => {
        let ret = [];
        for (let i = 1; i <= Math.ceil(SubTemplates.length / 10); i++) {
            let l = 10 * (i - 1), r = Math.min(SubTemplates.length, 10 * i);
            let templates = []
            while (l < r) {
                templates.push(SubTemplates[l])
                l++;
            }
            ret.push(templates)
        }
        return ret;
    }

    const saveTemplate = async () => {


        async function createRows(templates: any) {
            try {
                const createdRecords = await base('SubTemplates').create(templates);
                console.log('Created records:', createdRecords);
            } catch (err: any) {
                setIsLoading(false);
                setVisible(true);
                setText(err.toString());
                console.error(err);
                return;
            }
        }


        async function deleteRows(templates: any) {
            try {
                const createdRecords = await base('SubTemplates').destroy(templates);
                console.log('Deleted records:', createdRecords);
            } catch (err: any) {
                setIsLoading(false);
                setVisible(true);
                setText(err.toString());
                console.error(err);
                return;
            }
        }

        if (!templateInfoData.templateName) {
            setVisible(true);
            setText("Please provide templateName");
            return;
        }
        let TemplatesBody = {
            "TemplateID": templateInfoData.templateID,
            "templateDisplayName": templateInfoData.templateName,
            "PrimaryTechnique": templateInfoData.primaryTechnique,
            "SecondaryTechnique": templateInfoData.secondaryTechnique,
            "Status": "Draft",
        };
        setIsLoading(true);
        var base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);


        try {
            await base('Templates').update([
                {
                    "id": temID || "",
                    "fields": TemplatesBody
                }
            ]);


            let SubTemplates = []
            for (let data of savedTemplates) {
                let chunk = {
                    "fields": {
                        "templateStructure": data.script,
                        "TemplateId": data.templateID,
                        "Duration": data.duration,
                        "SilenceLevel": data.silenceLevel
                    }
                }
                SubTemplates.push(chunk)
            }
            // setIsLoading(true);

            // for (let templates of getChunks(SubTemplates)) {
            //     await createRows(templates);
            // }


            const yy = getChunks(SubTemplates);
            for (let i = 0; i < yy.length; i++) {
                let value: any = yy[i];
                await createRows(value);
            }
            if (preRecordsId.length === 0) {
                setIsLoading(false);
                setVisible(true);
                setText("Template updated successfully");
                setTimeout(() => {
                    // navigate('/templates')
                    window.location.reload()
                }, 4000);
            }
            const xx = getChunks(preRecordsId);
            xx.forEach(async function (value, i) {
                await deleteRows(value);
                if (xx.length - 1 === i) {
                    setIsLoading(false);
                    setVisible(true);
                    setText("Template updated successfully");
                    setTimeout(() => {
                        // navigate('/templates')
                        window.location.reload()
                    }, 2000);
                }
            });

        } catch (err: any) {
            setIsLoading(false);
            setVisible(true);
            setText(err.toString());
            console.error(err);
            return;
        }


        // base('Templates').update([
        //     {
        //         "id": temID || "",
        //         "fields": TemplatesBody
        //     }
        // ], async function (err, records: any) {

        //     if (err) {

        //     }

        // });
    }
    const [snippetOptionsData, setSnippetOptionsData] = useState<any>(null)
    useEffect(() => {
        let snips: any = []
        let snipsData: any = {};
        var base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
        setIsLoading(true);
        base('Atom Snippet Group Library')
            .select({
                fields: ['Type of Snippet', 'Audio Duration', 'silenceDuration']
            }).eachPage(function page(records, fetchNextPage) {
                records.forEach(function (record) {
                    if (snipsData[record.get('Type of Snippet') as string]) {
                        snipsData[record.get('Type of Snippet') as string].audio.push(record.get('Audio Duration') || 0)
                        snipsData[record.get('Type of Snippet') as string].silence.push(record.get('silenceDuration') || 0)
                    }
                    else {
                        snipsData[record.get('Type of Snippet') as string] = {
                            audio: [record.get('Audio Duration') || 0],
                            silence: [record.get('silenceDuration') || 0]
                        }
                    }
                    if (!snips.includes(record.get('Type of Snippet')))
                        snips.push(record.get('Type of Snippet'));
                });
                fetchNextPage();
            }, function done(err) {
                setIsLoading(false);
                if (err) {
                    setVisible(true);
                    setText(err.toString());
                    console.error(err);
                    return;
                }
                setSnippetContainerOptions(["Snippet Group Type", ...snips.filter((x: any) => x !== "" && x)]);
                setSnippetOptionsData(snipsData);
                // console.log("snipdata", snipsData)
            });
    }, []);

    let dur_min = 0, dur_max = 0;
    let sil_min = 0, sil_max = 0;
    let total_dur_min = 0;
    let total_dur_max = 0;
    // console.log("asdlnasbf", snippetData)
    snippetData.forEach((data, index) => {
        if (data.type !== 'silence') {
            if (snippetOptionsData[data.value]) {
                console.log("snipppp", snippetOptionsData[data.value])
                dur_min += Math.min(...snippetOptionsData[data.value]?.audio);
                dur_max += Math.max(...snippetOptionsData[data.value]?.audio);
                sil_min += Math.min(...snippetOptionsData[data.value]?.silence);
                sil_max += Math.max(...snippetOptionsData[data.value]?.silence);
                total_dur_min += Math.min(...snippetOptionsData[data.value]?.audio);
                total_dur_max += Math.max(...snippetOptionsData[data.value]?.audio);
            }
        }
        else {
            if (data.value) {
                sil_min += Number(data.value);
                sil_max += Number(data.value);
                total_dur_min += Number(data.value);
                total_dur_max += Number(data.value);
            }
        }

    })
    // console.log("values", dur_max, dur_min)


    const navigate = useNavigate();

    const deleteTemplate = async () => {
        // alert("delete")


        async function deleteRows(templates: any) {
            try {
                const createdRecords = await base('SubTemplates').destroy(templates);
                console.log('Deleted records:', createdRecords);
            } catch (err: any) {
                setVisible(true);
                setText(err.toString());
                console.error(err);
                return;
            }
        }



        setIsLoading(true);
        var base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);


        try {
            await base('Templates').destroy([temID || ""]);
            if (preRecordsId.length) {
                setIsLoading(true);
                const chunks = getChunks(preRecordsId)
                chunks.forEach(async (templates, i) => {
                    await deleteRows(templates);
                    if (i === chunks.length - 1) {
                        setIsLoading(false);
                        setVisible(true);
                        setText("Template Deleted Successfully");
                        setTimeout(() => {
                            navigate('/templates')
                        }, 2000);
                    }
                })
            }
            else {
                setIsLoading(false)
                setVisible(true);
                setText("Template Deleted Successfully");
                setTimeout(() => {
                    navigate('/templates')
                }, 2000);
            }
        }
        catch (err: any) {
            setVisible(true);
            setText(err.toString());
            console.error(err);
            return;
        }



        // base('Templates').destroy([temID || ""], function (err: any, deletedRecords: any) {
        //     setIsLoading(false);
        //     if (err) {

        //     }



        // });
    }

    function handleOnDragEnd(result: any) {
        if (!result.destination) return;

        const items = Array.from(snippetData);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setSnippetData(items);
    }


    const deleteCurrentTemplate = () => {
        if (templateInfoData.templateName === "") {
            setVisible(true);
            setText("Please provide template name");
            return;
        }
        if (DSInfoData.duration === "") {
            setVisible(true);
            setText("Please provide duration");
            return;
        }
        if (DSInfoData.silenceLevel === "") {
            setVisible(true);
            setText("Please provide silenceLevel");
            return;
        }
        setSavedTemplates([...savedTemplates.filter((st) => {
            return st.duration !== DSInfoData.duration || st.silenceLevel !== DSInfoData.silenceLevel;
        })]);
        // setDSInfoData({
        //     duration: "", silenceLevel: ""
        // });
        setSnippetData([]);
        setVisible(true);
        setText("Removed Subtemplate")
    }
    return (
        <Page>
            {(isLoading) ? (<LoadingSpinner />) : null}
            {visible && <DialogBox setVisible={setVisible} text={text} />}
            {/* {(isLoading) ? (<LoadingSpinner/>) : null} */}
            <CreateTopBar />

            <Section>
                {"Templates/Edit"}
                <span style={{ float: "right" }}>
                    <TransButton
                        onClick={() => {
                            if (window.confirm("Confirm deletion") === true) {
                                deleteTemplate()
                            }
                        }}
                    >
                        Delete Template
                    </TransButton>
                    <BlackButton
                        onClick={saveTemplate}
                    >
                        Save Template
                    </BlackButton>

                </span>
                <br />
                <br />
                <br />
                <SectionContent>
                    <TemplateInfo
                        setTemplateInfoData={setTemplateInfoData}
                        templateInfoData={templateInfoData}
                        setVisible={setVisible}
                        setText={setText}
                    />
                </SectionContent>
            </Section>

            {
                <><Section>
                    <DSInfo
                        DSInfoData={DSInfoData}
                        setDSInfoData={setDSInfoData}
                        savedTemplates={savedTemplates}
                    />
                </Section>
                    <CopyButton className={!copy ? "" : "active_notexistCopy"} onClick={
                        () => {
                            setCopy(!copy)
                        }
                    }>
                        Create New</CopyButton>
                    <CopyButton className={copy ? "" : "active_notexistCopy"} onClick={
                        () => {
                            setCopy(!copy)
                        }
                    }>
                        Use Existing</CopyButton>
                    <br />
                    <br />
                    <br />
                    {!copy && <><Line />
                        <br />
                        <br />
                        {<>
                            <BlackButton onClick={saveCurrentTemplate}>Save SubTemplate</BlackButton>
                            <BlackButton onClick={deleteCurrentTemplate}>Delete SubTemplate</BlackButton>
                        </>}
                        {/* </center> */}
                        {snippetData.length > 0 && <>
                            <br />
                            <br />
                            <span style={{ float: "right", marginRight: "10%" }}>Silence Range:{" "}
                                {Math.floor((sil_min * 100) / total_dur_min)}% - {Math.floor((sil_max * 100) / total_dur_max)}%
                            </span>
                            <span style={{ float: "right", marginRight: "5%" }}>Duration Range:{" "}
                                {Math.floor(dur_min / 60).toLocaleString('en-US', {
                                    minimumIntegerDigits: 2,
                                    useGrouping: false
                                }) || 0}:{(dur_min % 60).toLocaleString('en-US', {
                                    minimumIntegerDigits: 2,
                                    useGrouping: false
                                }) || 0} - {Math.floor(dur_max / 60).toLocaleString('en-US', {
                                    minimumIntegerDigits: 2,
                                    useGrouping: false
                                }) || 0}:{(dur_max % 60).toLocaleString('en-US', {
                                    minimumIntegerDigits: 2,
                                    useGrouping: false
                                }) || 0}
                            </span>
                            <br />
                        </>}
                        <DragDropContext onDragEnd={handleOnDragEnd}>
                            <Droppable droppableId="characters">
                                {(provided: any) => (
                                    <div className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                                        {snippetData.map((data, index) => {
                                            if (data.type === 'silence') {
                                                return (<div className="dragg"><Draggable key={data.id} draggableId={data.id} index={index}>
                                                    {(provided: any) => (<SectionContent
                                                        ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                        <SilenceContainer setSnippetData={setSnippetData} snippetData={snippetData} idx={index} key={index} />
                                                    </SectionContent>)}
                                                </Draggable></div>)
                                            }

                                            return (<div className="dragg"><Draggable key={data.id} draggableId={data.id} index={index}>
                                                {(provided: any) => (<SectionContent ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    <SnippetContainer
                                                        setSnippetData={setSnippetData}
                                                        snippetData={snippetData}
                                                        idx={index}
                                                        key={index}
                                                        options={snippetContainerOptions}
                                                        snippetOptionsData={snippetOptionsData}
                                                    />
                                                </SectionContent>)}
                                            </Draggable></div>)
                                        })}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                        <center>
                            <TemplateInfoForm>
                                <RowTR>
                                    <ColTDLabel>
                                        <AddButton onClick={
                                            () => {
                                                setSnippetData([...snippetData, { type: "snippet", value: "", id: uuidv4() }])
                                            }
                                        }><AddCircleOutlineOutlinedIcon />
                                            Add snippetGroup</AddButton>
                                    </ColTDLabel>
                                    <ColTD>
                                        <AddButton onClick={
                                            () => {
                                                setSnippetData([...snippetData, { type: "silence", value: "", id: uuidv4() }])
                                            }
                                        }><AddCircleOutlineOutlinedIcon />
                                            Add silenceDuration</AddButton>
                                    </ColTD>
                                </RowTR>
                            </TemplateInfoForm>
                            <br />

                        </center></>}


                    {copy && <><CopyLabel className={""}>
                        Copy From</CopyLabel>
                        <Section>
                            <DSCopyInfo
                                CopyDSInfoData={CopyDSInfoData}
                                setCopyDSInfoData={setCopyDSInfoData}
                                savedTemplates={savedTemplates}
                                key={Math.random()}
                            />
                        </Section>
                        <CopyLabel className={""}>
                            Copy To</CopyLabel>
                        <Section>
                            <center>
                                {durationLevel.map((d) => {
                                    let duration_active = copyTo.filter((x) => x.duration === d).length !== 0;
                                    let duration_existence = savedTemplates.filter((x) => x.duration === d).length !== silenceLevel.length;
                                    let all_existence = savedTemplates.filter(x => x.duration === d).length === 0;
                                    let all_active = copyTo.filter((x) => x.duration === d && x.silenceLevel.includes("All")).length !== 0;
                                    return <>
                                        <DSBox
                                            className={(!duration_existence && "notexistDSbox") || (duration_existence && duration_active && "activeDSbox") || ""}
                                            onClick={() => {
                                                if (!duration_existence) return;
                                                if (duration_active) {
                                                    setCopyTo(copyTo.filter((x) => x.duration !== d))
                                                }
                                                else {
                                                    setCopyTo([...copyTo, { duration: d, silenceLevel: [] }])
                                                }
                                            }}>{d}
                                        </DSBox>

                                        <DSBox
                                            className={(!all_existence && "notexistDSbox") || (all_active && "activeDSbox") || ""}
                                            onClick={() => {
                                                if (!all_existence) return;
                                                if (all_active) {
                                                    setCopyTo([...(copyTo.filter((x) => x.duration !== d)), { duration: d, silenceLevel: [] }])
                                                }
                                                else {
                                                    setCopyTo([...(copyTo.filter((x) => x.duration !== d)), { duration: d, silenceLevel: ["All"] }])
                                                }
                                            }}>{"All"}
                                        </DSBox>
                                        {
                                            silenceLevel.map((s) => {

                                                let silence_existence = savedTemplates.filter(x => x.duration === d && x.silenceLevel === s).length !== 0;;
                                                let silence_active = copyTo.filter((x) => x.duration === d && x.silenceLevel.includes(s)).length !== 0;
                                                return <>
                                                    <DSBox
                                                        key={s}
                                                        className={(silence_existence && "notexistDSbox") || (!silence_existence && silence_active && "activeDSbox") || ""}
                                                        onClick={() => {
                                                            // alert(silence_existence + " " + !all_active)
                                                            if (silence_existence || all_active) return;
                                                            if (silence_active) {
                                                                let temp = copyTo.map((x) => {
                                                                    if (x.duration === d) {
                                                                        return { duration: x.duration, silenceLevel: x.silenceLevel.filter((y) => y !== s) }
                                                                    }
                                                                    return x;
                                                                })
                                                                setCopyTo(temp)
                                                            }
                                                            else {
                                                                let temp = copyTo.map((x) => {
                                                                    if (x.duration === d) {
                                                                        return { duration: x.duration, silenceLevel: [...(x.silenceLevel), s] }
                                                                    }
                                                                    return x;
                                                                })
                                                                setCopyTo(temp)
                                                            }
                                                        }}>{s}
                                                    </DSBox>
                                                </>
                                            })
                                        }
                                        <br />
                                        <br />
                                        <br />
                                    </>
                                })}
                            </center>
                        </Section>

                        <center>
                            <BlackButton
                                onClick={copyTemplate}
                            >
                                Copy
                            </BlackButton>
                            <br />
                            <br />
                        </center></>}
                </>
            }


        </Page >
    )
}

export default CreatePage

//glpat-fSUPKXwB7uqd2HHf7qVv
//glpat-hEb7WsiryrQKJ3XCt11L