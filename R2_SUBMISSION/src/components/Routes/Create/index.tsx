import { Page, Section, SectionContent, SnippetText } from "./CreateStyles";
import CreateTopBar from "./Topbar";
import { TemplatePicker } from "./component/TemplatePicker";
import { SilenceLevelPicker } from "./component/SilenceLevelPicker";
import { DurationPicker } from "./component/DurationPicker";
import React, { useEffect, useState } from "react";
import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } from "../../../integrations/credentials";
import { AirtableTablesAndViews } from "../../../integrations/airtable.tables.views";
import Airtable from "airtable";
import { asSilenceFloatOr0, groupBy, parseAsJsonObject } from "../../../utils/helpers";
import SnippetGroupPicker from "./component/SnippetGroupPicker";
import Crunker from "crunker";
import LoadingSpinner from "../../Loading/loading";
import TemplateModel from "../../../models/TemplateModel";
import SubTemplateModel from "../../../models/SubTemplateModel";
import { SnippetGroup } from "../../../models/SnippetGroup";
import MyLogger from "../../../integrations/myLogger";
import { SilencePicker } from "./component/SilencePicker";
import { BlackButton2 } from "./CreateTemplate/CreateTemplateStyle";
import ShuffleIcon from '@mui/icons-material/Shuffle';

function CreatePage() {

    let crunker = new Crunker();
    let base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

    const [availableTemplates, setAvailableTemplates] = useState<TemplateModel[]>([]);
    const [selectedTemplateValue, setSelectedTemplateValue] = useState<string>('No Template Selected');

    const [availableSubTemplates, setAvailableSubTemplates] = useState<SubTemplateModel[]>([]);
    // const [selectedSubTemplateValue, setSelectedSubTemplateValue] = useState<string>('No SubTemplate Selected');

    const [selectedDurationsValue, setSelectedDurationsValue] = useState<string>('1');
    const [selectedSileneceLevelValue, setSelectedSilenceLevelValue] = useState<string>('Very High');

    const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

    const [availableSnippetGroups, setAvailableSnippetGroups] = useState<Record<string, SnippetGroup[]>>({});

    const [isLoading, setIsLoading] = useState(false)

    const availableDurations = [{ label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' },
    { label: '4', value: '4' }, { label: '5', value: '5' }, { label: '6', value: '6' }, { label: '8', value: '8' },
    { label: '10', value: '10' }, { label: '12', value: '12' }, { label: '15', value: '15' }, { label: '20', value: '20' }, { label: '30', value: '30' }];

    const availableSilenceLevel = [{ label: 'Very High', value: 'Very High' }, { label: 'High', value: 'High' }, { label: 'Normal', value: 'Normal' },
    { label: 'Low', value: 'Low' }, { label: 'Very-Low', value: 'Very-Low' }];

    const onTemplateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTemplateValue = event.target.value
        setSelectedTemplateValue(selectedTemplateValue);
    }

    const onDurationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDurationsValue = event.target.value
        setSelectedDurationsValue(selectedDurationsValue);
    }

    const onSilenceLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSilenceLevelValue = event.target.value
        setSelectedSilenceLevelValue(selectedSilenceLevelValue);
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
        setAvailableSubTemplates(Subtemplates)
        // setSelectedSubTemplateValue(Subtemplates[0].id.toString());
        loadSnippetGroups()
    }
    useEffect(() => {
        loadTemplatesAndSnippets()
    }, [])

    useEffect(() => {
        loadSubTemplatesAndSnippets()
    }, [])

    useEffect(() => {
        let selectedVariants: Record<string, string> = {}
        for (const [snippetPos, snippetName] of Object.entries(getSelectedSubTemplate()?.script ?? {})) {
            MyLogger.info("snippet", snippetName)
            if (availableSnippetGroups[snippetName]) {
                MyLogger.info(` matched snippet at ${snippetPos} ->`, availableSnippetGroups[snippetName][0].value)
                var array_len = availableSnippetGroups[snippetName].length;
                if (array_len === undefined)
                    selectedVariants[snippetPos] = availableSnippetGroups[snippetName][0].value
                else {
                    var idx = Math.floor(Math.random() * 100) % array_len;
                    selectedVariants[snippetPos] = availableSnippetGroups[snippetName][0].value
                }
            } else if (snippetName.toLocaleString().includes("silence")) {
                MyLogger.info(` matched silence at ${snippetPos} ->`, snippetName)
                selectedVariants[snippetPos] = snippetName
            }
        }
        setSelectedVariants(selectedVariants)
        MyLogger.info("selectedVariants", selectedVariants)

    }, [availableSnippetGroups, selectedTemplateValue, availableSubTemplates, selectedDurationsValue, selectedSileneceLevelValue])



    function getSelectedSubTemplate(selectedSubTempValue: string = selectedTemplateValue + "-" + selectedDurationsValue + "-" + selectedSileneceLevelValue): SubTemplateModel {
        return availableSubTemplates.find((temp) => temp.id === selectedSubTempValue)!
    }

    function addSelectedVariant(key: string, value: string) {
        setSelectedVariants({ ...selectedVariants, [key]: value })
    }

    interface AudioTemplate {
        audioBuffers: AudioBuffer[],
        fileName: string
    }

    function createSilenceBuffer(
        channelNo: number = 2, // stereo
        sampleRate: number = crunker.context.sampleRate,
        duration: number,
    ): AudioBuffer {
        return crunker.context.createBuffer(
            channelNo,
            sampleRate * duration,
            sampleRate
        )
    }

    async function getAudioBufferFromLink(link: string): Promise<AudioBuffer> {
        let response = await fetch(link);
        let arrayBuffer = await response.arrayBuffer();
        return await crunker.context.decodeAudioData(arrayBuffer);
    }

    async function fetchAudioTemplate(script: Record<string, string> = getSelectedSubTemplate().script): Promise<AudioTemplate> {
        let fileName = "cms-"
        let audioBuffers: Promise<AudioBuffer>[] = []

        const snippetsCollection = Object.values(availableSnippetGroups).flat()
        console.log("here :", script, Object.keys(script));
        for (const snippetKey of Object.keys(script)) {
            console.log("checking: ", selectedVariants, selectedVariants[snippetKey]);
            let selectedSnippetVariant = selectedVariants[snippetKey] ??= (availableSnippetGroups)[script[snippetKey]][0]["Snippet Name"]
            console.log("printing : ", selectedSnippetVariant);
            fileName += `${selectedSnippetVariant}-`
            if (selectedSnippetVariant.includes("silence")) {
                const silenceDuration = asSilenceFloatOr0(selectedSnippetVariant)
                audioBuffers.push(Promise.resolve(createSilenceBuffer(2, crunker.context.sampleRate, silenceDuration)))
            } else {
                // fetch Audio File and return
                let snippetData = snippetsCollection.find((snippet) => snippet["Snippet Name"] === selectedSnippetVariant)!
                var array_len = snippetData["Audio File"].length;
                // alert(snippetData["Audio File"][Math.random()%array_len]);
                let audioFile = snippetData["Audio File"][0]
                audioBuffers.push(getAudioBufferFromLink(audioFile.url))
            }
        }


        return {
            audioBuffers: await Promise.all(audioBuffers),
            fileName: fileName
        }
    }

    return (
        <Page>
            {(isLoading) ? (<LoadingSpinner />) : null}
            <CreateTopBar
                onGenerateClick={async () => {
                    setIsLoading(true)
                    //return
                    try {
                        let audioTemplate = await fetchAudioTemplate()
                        MyLogger.info(audioTemplate.fileName, "fileName")
                        let mergedAudio = await crunker.concatAudio(audioTemplate.audioBuffers)
                        let exportedAudio = await crunker.export(mergedAudio, 'audio/wav')
                        crunker.download(exportedAudio.blob, audioTemplate.fileName)
                    } catch (error) {
                        throw error;
                    } finally {
                        setIsLoading(false)
                    }
                }}
            />

            <Section>
                {"Templates"}
                <SectionContent>
                    <span style={{ display: "flex" }}>
                        <TemplatePicker
                            allTemplates={availableTemplates}
                            selectedTemplate={selectedTemplateValue}
                            onTemplateChange={onTemplateChange}
                        />
                        {" "}
                        <DurationPicker
                            allDurations={availableDurations}
                            selectedDuration={selectedDurationsValue}
                            onDurationChange={onDurationChange}
                        />
                    </span>
                    <br />
                    <SilenceLevelPicker
                        allSilenceLevels={availableSilenceLevel}
                        selectedSilenceLevel={selectedSileneceLevelValue}
                        onSilenceLevelChange={onSilenceLevelChange}
                    />
                </SectionContent>
            </Section>
            <Section>
                {"Meditation Script"}
                {/* <BlackButton2 style={{ marginLeft: "20px" }}>Randomise <ShuffleIcon /></BlackButton2> */}
                <br />
                <br />
                {getSelectedSubTemplate()?.script &&
                    Object.entries(getSelectedSubTemplate().script).map(([snippetKey, snippetValue]) => {
                        let obj = availableSnippetGroups[snippetValue]?.find((obj) => { return selectedVariants[snippetKey] === obj.value })

                        return <SectionContent key={snippetKey}>
                            {snippetValue.includes("silence")
                                ? <SilencePicker
                                    key={snippetKey}
                                    defaultSilenceDuration={asSilenceFloatOr0(snippetValue)}
                                    selectedSilenceDuration={asSilenceFloatOr0(selectedVariants[snippetKey] ?? snippetValue)}
                                    onSilenceDurationChange={(event) => {
                                        MyLogger.info(event.target.value, `Silence Change ${snippetKey}`)
                                        addSelectedVariant(snippetKey, `silence${event.target.value}`)
                                    }}
                                /> :
                                (<><SnippetGroupPicker
                                    title={snippetValue ?? "No Snippet Group Selected"}
                                    avlblVariants={(availableSnippetGroups as any)[snippetValue] ?? []}
                                    selectedVariant={selectedVariants[snippetKey]}
                                    onVariantChange={(event) => {
                                        addSelectedVariant(snippetKey, event.target.value)
                                    }}
                                />
                                    <br />
                                    <SnippetText>{obj &&
                                        obj['Snippet Text']}</SnippetText></>)
                            }
                        </SectionContent>

                    })}
            </Section>
        </Page >
    )
}

export default CreatePage