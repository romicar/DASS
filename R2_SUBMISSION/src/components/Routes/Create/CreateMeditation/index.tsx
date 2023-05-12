
import { Page, Section, SectionContent, SnippetText } from "../CreateStyles";
import {
    TemplateInfoForm,
    RowTR, ColTDLabel,
    TemplateNameInput,
    ColTD,
    DSInfoBox,
    DSBox,
    Line,
    AddButton,
    BlackButton,
    IconDelete
} from '../CreateTemplate/CreateTemplateStyle'
import SnippetGroupPicker from ".././component/SnippetGroupPicker";
import { SilencePicker } from ".././component/SilencePicker";
// @ts-ignore
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import MyLogger from "../../../../integrations/myLogger";
import TemplateModel from "../../../../models/TemplateModel";
import CreateTopBar from "./Topbar";
import React, { useEffect, useState } from "react";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import DropDownPicker from "../../../DropDownPicker";
import DialogBox from "./components/DialogBox";
import Airtable from "airtable";
import LoadingSpinner from "../../../Loading/loading";
import { TemplatePicker } from "../component/TemplatePicker";
import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } from "../../../../integrations/credentials";
import { AirtableTablesAndViews } from "../../../../integrations/airtable.tables.views";
import { asSilenceFloatOr0, groupBy, parseAsJsonObject } from "../../../../utils/helpers";
import { SnippetGroup } from "../../../../models/SnippetGroup";
import SubTemplateModel from "../../../../models/SubTemplateModel";




const { v4: uuidv4 } = require('uuid');
const durationLevel: string[] = ["1", "2", "3", "4", "5", "6", "8", "10", "12", "15", "20", "30"];
const silenceLevel: string[] = ["Very High", "High", "Normal", "Low", "Very-Low"];

interface MeditationInfoInterface {
    meditationID: string;
    meditationName: string;
    templateID: string
}

interface DSInfoInterface {
    duration: string;
    silenceLevel: string;
}

interface MeditationStructure {
    type: string;
    value: string;
    id: string;
}

function TemplateInfo({ setmeditationInfoData,
    meditationInfoData,
    active,
    setActive,
    setVisible,
    setText,
    availableTemplates,
    selectedTemplateValue, onTemplateChange }:
    {
        setmeditationInfoData: React.Dispatch<React.SetStateAction<MeditationInfoInterface>>,
        meditationInfoData: MeditationInfoInterface,
        active: Boolean,
        setActive: React.Dispatch<React.SetStateAction<Boolean>>,
        setVisible: React.Dispatch<React.SetStateAction<Boolean>>,
        setText: React.Dispatch<React.SetStateAction<string>>,
        availableTemplates: { label: string, value: any }[],
        selectedTemplateValue?: any,
        onTemplateChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
    }) {
    return <>
        <TemplateInfoForm>
            <RowTR>
                <ColTDLabel>
                    meditationID
                </ColTDLabel>
                <ColTD><label>{meditationInfoData.meditationID}</label>
                </ColTD>
            </RowTR>
            <RowTR>
                <ColTDLabel><label >
                    meditationName
                </label>
                </ColTDLabel>
                <ColTD>
                    <TemplateNameInput
                        placeholder="Add Name"
                        type="email" id="email"
                        autoComplete="off"
                        onChange={(evt) => {
                            setmeditationInfoData({ ...meditationInfoData, meditationName: evt.target.value })
                        }}
                        value={meditationInfoData.meditationName}
                    />
                </ColTD>
            </RowTR>

            <RowTR>
                <ColTDLabel><label >
                    templateSelect
                </label>
                </ColTDLabel>
                <ColTD style={{ paddingLeft: "0px" }}>
                    <TemplatePicker
                        vis={true}
                        allTemplates={availableTemplates}
                        selectedTemplate={selectedTemplateValue}
                        onTemplateChange={onTemplateChange}
                    />
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
            className={(!exist && "notexistDSbox") || (exist && active && "activeDSbox") || ""}
            onClick={() => {
                // if (DSInfoData.silenceLevel === "Master")
                //     setDSInfoData({ silenceLevel: "", duration: text });
                if (exist) setDSInfoData({ ...DSInfoData, duration: text });

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
            className={(!exist && "notexistDSbox") || (exist && active && "activeDSbox") || ""}
            onClick={() => {
                if (exist) setDSInfoData({ ...DSInfoData, silenceLevel: text });
                //  setDSInfoData({ ...DSInfoData, silenceLevel: text });
            }}>{text}
        </DSBox>
    </>
}

function DSInfo({ setDSInfoData, DSInfoData, selectedTemplateValue, availableSubTemplates }:
    {
        setDSInfoData: React.Dispatch<React.SetStateAction<DSInfoInterface>>,
        DSInfoData: DSInfoInterface,
        availableSubTemplates: SubTemplateModel[]
        selectedTemplateValue: string
    }) {

    let tem_arr = availableSubTemplates.filter((s) => {
        return s.TemplateId === selectedTemplateValue;
    });
    console.log(tem_arr)
    return <>
        <DSInfoBox>
            <TemplateInfoForm>
                <RowTR>
                    <ColTDLabel><label >
                        Duration
                    </label>
                    </ColTDLabel>
                    <ColTD>
                        {durationLevel.map((level) => {
                            return <>
                                <DSDElem
                                    text={level}
                                    key={level}
                                    active={DSInfoData.duration === level}
                                    setDSInfoData={setDSInfoData}
                                    DSInfoData={DSInfoData}
                                    exist={
                                        tem_arr.filter((s) => {
                                            return s.Duration === level;
                                        }).length > 0
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
                        {silenceLevel.map((level) => {
                            return <>
                                <DSSElem
                                    text={level}
                                    key={level}
                                    active={DSInfoData.silenceLevel === level}
                                    setDSInfoData={setDSInfoData}
                                    DSInfoData={DSInfoData}
                                    exist={
                                        tem_arr.filter((s) => {
                                            return s.Duration === DSInfoData.duration && s.SilenceLevel === level;
                                        }).length !== 0
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



function CreateMeditation() {
    const [visible, setVisible] = useState<Boolean>(false);
    const [active, setActive] = useState<Boolean>(true);
    const [text, setText] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false)
    // const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});


    const [mediationStructure, setMeditationStructure] = useState<MeditationStructure[]>([]);

    const i_meditationInfoData = {
        meditationID: uuidv4(),
        meditationName: "",
        templateID: ""
    };

    const i_DSInfoData = {
        duration: "",
        silenceLevel: ""
    };

    const [meditationInfoData, setmeditationInfoData] = useState<MeditationInfoInterface>(i_meditationInfoData);
    const [DSInfoData, setDSInfoData] = useState<DSInfoInterface>(i_DSInfoData);
    const [availableTemplates, setAvailableTemplates] = useState<TemplateModel[]>([]);
    const [selectedTemplateValue, setSelectedTemplateValue] = useState<string>('No Template Selected');
    const [availableSnippetGroups, setAvailableSnippetGroups] = useState<Record<string, SnippetGroup[]>>({});
    const [availableSubTemplates, setAvailableSubTemplates] = useState<SubTemplateModel[]>([]);

    const onTemplateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTemplateValue = event.target.value
        setSelectedTemplateValue(selectedTemplateValue);
    }

    const [snippetContainerOptions, setSnippetContainerOptions] = useState<string[]>([])
    let base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    useEffect(() => {
        let snips: any = []
        setIsLoading(true);
        base('Atom Snippet Group Library')
            .select({
                fields: ['Type of Snippet']
            }).eachPage(function page(records, fetchNextPage) {
                records.forEach(function (record) {
                    if (!snips.includes(record.get('Type of Snippet'))) {
                        snips.push(record.get('Type of Snippet'));
                    }
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
            });
    }, []);


    function getSelectedSubTemplate(selectedSubTempValue: string = selectedTemplateValue + "-" + DSInfoData.duration + "-" + DSInfoData.silenceLevel): SubTemplateModel {
        return availableSubTemplates.find((temp) => temp.id === selectedSubTempValue)!
    }


    const loadSnippetGroups = async () => {
        let table = base(AirtableTablesAndViews.SnippetGroups.TABLE_ID);
        let firstPage = await table.select({
            view: AirtableTablesAndViews.SnippetGroups.VIEW_ID,
        }).all()
        let results: object = firstPage.map(record => {
            record.fields["label"] = record.fields["Snippet Name"];
            record.fields["value"] = record.fields["Snippet Name"];
            return record.fields
        });
        // @ts-ignore
        results = groupBy(results, item => item["Type of Snippet"]);
        setAvailableSnippetGroups(parseAsJsonObject(results));
    }


    const loadTemplatesAndSnippets = async () => {
        let table = base(AirtableTablesAndViews.Templates.TABLE_ID);
        let firstPage = await table.select({ view: AirtableTablesAndViews.Templates.VIEW_ID }).all()
        firstPage = firstPage.filter((x) => x.get("Status") === "Saved")
        let templates = firstPage.map((record) => {
            return {
                label: record.get("templateDisplayName"),
                id: record.get("TemplateID"),
                value: record.get("TemplateID"),
                script: JSON.parse((record.get("templateStructure") ?? "{}") as string)
            } as TemplateModel
        })
        setAvailableTemplates(templates)
        setSelectedTemplateValue(templates[0].value)
        loadSnippetGroups()
    }

    useEffect(() => {
        loadTemplatesAndSnippets()
    }, []);

    useEffect(() => {

        console.log("mydata", selectedTemplateValue, availableSubTemplates, DSInfoData, selectedTemplateValue)
        let selectedVariants: MeditationStructure[] = []
        for (const [snippetPos, snippetName] of Object.entries(getSelectedSubTemplate()?.script ?? {})) {
            if (availableSnippetGroups[snippetName]) {
                selectedVariants.push({ type: snippetName, value: availableSnippetGroups[snippetName][0].value, id: uuidv4() })
            } else if (snippetName.toLocaleString().includes("silence")) {
                selectedVariants.push({ type: "silence", value: snippetName, id: uuidv4() })
            }
        }
        setMeditationStructure(selectedVariants)
        MyLogger.info("selectedVariants", selectedVariants)

    }, [availableSnippetGroups, selectedTemplateValue, availableSubTemplates, DSInfoData])


    function addSelectedVariant(idx: number, type: string, value: string) {
        let temp = mediationStructure.map((data, index) => {
            if (index === idx) {
                return { type, value, id: data.id };
            }
            return data;
        })
        setMeditationStructure(temp)
    }


    const loadSubTemplatesAndSnippets = async () => {
        let table = base(AirtableTablesAndViews.SubTemplates.TABLE_ID);
        let firstPage = await table.select({ view: AirtableTablesAndViews.SubTemplates.VIEW_ID }).all()
        let Subtemplates = firstPage.map((record) => {
            return {
                Duration: record.get("Duration"),
                id: record.get("SubtemplateId"),
                TemplateId: record.get("TemplateId"),
                SilenceLevel: record.get("SilenceLevel"),
                script: JSON.parse((record.get("templateStructure") ?? "{}") as string)
            } as SubTemplateModel
        })

        // .select({
        //     view: 'YOUR_VIEW_NAME'
        // }).eachPage(function page(records, fetchNextPage) {
        //     // This function will iterate through each record in the table
        //     records.forEach(function (record) {
        //         console.log('Retrieved', record.get('COLUMN_NAME'));
        //     });

        //     // To fetch the next page of records, call fetchNextPage()
        //     fetchNextPage();
        // });
        setAvailableSubTemplates(Subtemplates)
        loadSnippetGroups()
    }

    useEffect(() => {
        loadSubTemplatesAndSnippets()
    }, []);

    const saveMeditation = async () => {
        if (!meditationInfoData.meditationName) {
            setVisible(true);
            setText("Please provide meditationName");
            return;
        }
        if (mediationStructure.length === 0) {
            setVisible(true);
            setText("Please provide meditation");
            return;
        }

        // console.log("dsfs", mediationStructure)

        let medV: any = {}, medS: any = {};
        for (let i = 1; i <= mediationStructure.length; i++) {
            medV[`position${i}`] = mediationStructure[i - 1].value;
            medS[`position${i}`] = mediationStructure[i - 1].type;
        }

        let MeditationBody = {
            "MeditationId": meditationInfoData.meditationID,
            "MeditationName": meditationInfoData.meditationName,
            "MeditationValue": JSON.stringify(medV),
            "MeditationStructure": JSON.stringify(medS)
        };
        console.log("MeditationBody", MeditationBody)
        setIsLoading(true);
        var base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
        try {
            await base('Meditations').create([
                {
                    "fields": MeditationBody
                }
            ]);
            setIsLoading(false);
            setVisible(true);
            setText("Meditation updated successfully");
            setTimeout(() => {
                window.location.reload()
            }, 2000);
        }
        catch (err: any) {
            setIsLoading(false)
            setVisible(true);
            setText(err.toString());
            console.error(err);
        }
    }


    const [toAdd, setToAdd] = useState<string>("");

    function handleOnDragEnd(result: any) {
        if (!result.destination) return;

        const items = Array.from(mediationStructure);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setMeditationStructure(items);
    }


    let sil_dur = 0;
    let total_dur = 0;
    let audio_dur = 0;
    mediationStructure.forEach((data, index) => {
        // console.log("tdata", availableSnippetGroups[data.type])

        if (data.type !== 'silence') {

            let temp = availableSnippetGroups[data.type]?.filter((x) => x.value === data.value)[0];
            if (temp) {
                sil_dur += Number(temp["silenceDuration"]) || 0
                total_dur += Number(temp["Audio Duration"]) || 0
                audio_dur += Number(temp["Audio Duration"]) || 0
            }


        }
        else {
            if (data.value) {
                sil_dur += Number(data.value.substring(7)) || 0;
                total_dur += Number(data.value.substring(7)) || 0;
                // console.log("valueS", data.value)
            }
        }
    })



    return (
        <Page>
            {(isLoading) ? (<LoadingSpinner />) : null}
            {visible && <DialogBox setVisible={setVisible} text={text} />}
            {/* {(isLoading) ? (<LoadingSpinner/>) : null} */}
            <CreateTopBar />

            <Section>
                {"Meditations/Create"}
                <span style={{ float: "right" }}>
                    <BlackButton
                        onClick={saveMeditation}
                    >
                        Save Meditation
                    </BlackButton>
                </span>
                <br />
                <br />
                <br />
                <SectionContent>
                    <TemplateInfo
                        setmeditationInfoData={setmeditationInfoData}
                        meditationInfoData={meditationInfoData}
                        active={active}
                        setActive={setActive}
                        setVisible={setVisible}
                        setText={setText}
                        availableTemplates={availableTemplates}
                        selectedTemplateValue={selectedTemplateValue}
                        onTemplateChange={onTemplateChange}
                    />
                </SectionContent>
            </Section>

            {
                active && <><Section>
                    <DSInfo
                        DSInfoData={DSInfoData}
                        setDSInfoData={setDSInfoData}
                        availableSubTemplates={availableSubTemplates}
                        selectedTemplateValue={selectedTemplateValue}
                    />
                </Section>
                    <center>

                        <Line />
                        <br />
                        <br />
                    </center>
                    <Section>
                        {"Meditation Script"}
                        {/* <BlackButton2 style={{ marginLeft: "20px" }}>Randomise <ShuffleIcon /></BlackButton2> */}
                        <br />
                        <br />
                        <span style={{ float: "right", marginRight: "10%" }}>Silence Percentage:{" "}
                            {Math.floor((sil_dur * 100) / total_dur)}%
                        </span>

                        <span style={{ float: "right", marginRight: "5%" }}>Audio Duration:{" "}
                            {Math.floor(audio_dur / 60).toLocaleString('en-US', {
                                minimumIntegerDigits: 2,
                                useGrouping: false
                            }) || 0}:{(audio_dur % 60).toLocaleString('en-US', {
                                minimumIntegerDigits: 2,
                                useGrouping: false
                            }) || 0}
                        </span>
                        <span style={{ float: "right", marginRight: "5%" }}>Total Duration:{" "}
                            {Math.floor(total_dur / 60).toLocaleString('en-US', {
                                minimumIntegerDigits: 2,
                                useGrouping: false
                            }) || 0}:{(total_dur % 60).toLocaleString('en-US', {
                                minimumIntegerDigits: 2,
                                useGrouping: false
                            }) || 0}
                        </span>
                        <br />


                        <DragDropContext onDragEnd={handleOnDragEnd}>
                            <Droppable droppableId="characters">
                                {(provided: any) => (
                                    <div className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                                        {mediationStructure.map(({ type, value, id }, index) => {
                                            let obj = availableSnippetGroups[type]?.find((obj) => { return value === obj.value })

                                            return (<div className="dragg"><Draggable key={id} draggableId={id} index={index}>
                                                {(provided: any) => (<SectionContent
                                                    ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    <IconDelete>
                                                        <DeleteIcon style={{ float: "right" }} onClick={
                                                            () => {
                                                                setMeditationStructure([...mediationStructure.filter((data, idx) => {
                                                                    return idx !== index;
                                                                })])
                                                            }
                                                        } /></IconDelete>
                                                    {type === ("silence")
                                                        ? <SilencePicker
                                                            key={index}
                                                            defaultSilenceDuration={asSilenceFloatOr0(value)}
                                                            selectedSilenceDuration={asSilenceFloatOr0(value)}
                                                            onSilenceDurationChange={(event) => {
                                                                MyLogger.info(event.target.value, `Silence Change ${value}`)
                                                                addSelectedVariant(index, "silence", `silence${event.target.value}`)
                                                            }}
                                                        /> :
                                                        (<><SnippetGroupPicker
                                                            title={type ?? "No Snippet Group Selected"}
                                                            avlblVariants={(availableSnippetGroups as any)[type] ?? []}
                                                            selectedVariant={value}
                                                            onVariantChange={(event) => {
                                                                addSelectedVariant(index, type, event.target.value)
                                                                // addSelectedVariant(snippetKey, event.target.value)
                                                            }}
                                                        />
                                                            <br />
                                                            <SnippetText>{obj &&
                                                                obj['Snippet Text']}</SnippetText></>)
                                                    }
                                                </SectionContent>)}
                                            </Draggable></div>)

                                        })}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </Section>
                    <center>
                        <TemplateInfoForm>
                            <RowTR>
                                <ColTD
                                    style={
                                        {
                                            paddingRight: "0px",
                                            margin: "0px"
                                        }
                                    }>
                                    <AddButton onClick={
                                        () => {
                                            if (toAdd === '' || toAdd === 'Snippet Group Type') {
                                                setVisible(true);
                                                setText(`Please select snippet value`);
                                                return;
                                            }
                                            setMeditationStructure([...mediationStructure, { type: toAdd, value: availableSnippetGroups[toAdd][0].value, id: uuidv4() }]);
                                        }
                                    }><AddCircleOutlineOutlinedIcon />
                                        Add snippetGroup</AddButton>
                                    <br />
                                    <DropDownPicker
                                        title={""}
                                        options={snippetContainerOptions.map((op) => { return { label: op, value: op } })}
                                        selectedValue={snippetContainerOptions[0]}
                                        onChange={(evt) => {
                                            setToAdd(evt.target.value);
                                        }}
                                    />

                                </ColTD>
                                <ColTD style={
                                    {
                                        paddingLeft: "0",
                                        marginLeft: "-6px"
                                    }
                                }>
                                    <AddButton onClick={
                                        () => {
                                            setMeditationStructure([...mediationStructure, { type: "silence", value: "0", id: uuidv4() }])
                                        }
                                    }><AddCircleOutlineOutlinedIcon />
                                        Add silenceDuration</AddButton>
                                </ColTD>
                            </RowTR>
                        </TemplateInfoForm>
                    </center>

                </>
            }


        </Page >
    )
}

export default CreateMeditation

//glpat-fSUPKXwB7uqd2HHf7qVv
//glpat-hEb7WsiryrQKJ3XCt11L