import React, { useState, useEffect } from 'react';
import { Page } from "./CreateStyles";
import CreateTopBar from "./Topbar_For_Meditation";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import MeditationModel from "../../../models/MeditationModel";
import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } from "../../../integrations/credentials";
import { AirtableTablesAndViews } from "../../../integrations/airtable.tables.views";
import Airtable from "airtable";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import SyncIcon from '@mui/icons-material/Sync';
import { BlackButton } from './CreateTemplate/CreateTemplateStyle';
import LoadingSpinner from "../../Loading/loading";
import DialogBox from './EditTemplate/components/DialogBox';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { SnippetGroup } from "../../../models/SnippetGroup";
import { textAlign } from '@mui/system';
import IconButton from '@mui/material/IconButton';
import { asSilenceFloatOr0, groupBy, parseAsJsonObject } from "../../../utils/helpers";
import Crunker from "crunker";

// https://www.figma.com/file/cxLJDtRsGQnlfD1QZLQ5Oa/Product-Meditation-Generator-%7C-CMS?node-id=781%3A2126




function CreateTemplate() {
    const [isLoading, setIsLoading] = useState(false)
    const [visible, setVisible] = useState<Boolean>(false);
    const [text, setText] = useState<string>("");
    const navigate = useNavigate();
    let base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    const [availableMeditations, setAvailableMeditations] = useState<MeditationModel[]>([]);
    const loadMeditations = async () => {
        let table = base(AirtableTablesAndViews.Meditations.TABLE_ID);
        let firstPage = await table.select({ view: AirtableTablesAndViews.Meditations.VIEW_ID }).all()
        let meditations = firstPage.map((record) => {
            return {
                label: record.get("MeditationName"),
                id: record.get("MeditationId"),
                value: record.get("MeditationId"),
                script: JSON.parse((record.get("MeditationValue") ?? "{}") as string),
                Aid: record.id
            } as MeditationModel
        })
        setAvailableMeditations(meditations)
    }
    useEffect(() => {
        loadMeditations()
    }, [])
    let rows = availableMeditations;
    rows = rows.filter((ele) => ele.id !== undefined);

    let crunker = new Crunker();

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
    const [availableSnippetGroups, setAvailableSnippetGroups] = useState<Record<string, SnippetGroup[]>>({});
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
    useEffect(() => {
        loadSnippetGroups();
    }, [])
    async function fetchAudioTemplate(id: string, script: Record<string, string>): Promise<AudioTemplate> {
        let fileName = "cms-"
        let audioBuffers: Promise<AudioBuffer>[] = []

        const snippetsCollection = Object.values(availableSnippetGroups).flat()
        console.log(script);
        for (const snippetKey of Object.keys(script)) {
            let selectedSnippetVariant = script[snippetKey] ??= (availableSnippetGroups)[script[snippetKey]][0]["Snippet Name"]
            fileName += `${selectedSnippetVariant}-`
            if (selectedSnippetVariant.includes("silence")) {
                const silenceDuration = asSilenceFloatOr0(selectedSnippetVariant)
                audioBuffers.push(Promise.resolve(createSilenceBuffer(2, crunker.context.sampleRate, silenceDuration)))
            } else {
                // fetch Audio File and return

                try {
                    let snippetData = snippetsCollection.find((snippet) => snippet["Snippet Name"] === selectedSnippetVariant)!

                    var array_len = snippetData["Audio File"].length;

                    // alert(snippetData["Audio File"][Math.random()%array_len]);
                    let audioFile = snippetData["Audio File"][0]
                    audioBuffers.push(getAudioBufferFromLink(audioFile.url))

                }
                catch (err: any) {
                    alert("Unable to stitch audio \n" + err.toString())
                    return {
                        audioBuffers: [],
                        fileName: ""
                    };
                }

            }
        }


        return {
            audioBuffers: await Promise.all(audioBuffers),
            fileName: fileName
        }
    }


    return (
        <>
            <Page>
                {(isLoading) ? (<LoadingSpinner />) : null}
                {visible && <DialogBox setVisible={setVisible} text={text} />}
                <CreateTopBar />
                <div>
                    <br />
                    <b style={{ fontSize: '30px', marginLeft: '25px' }}>
                        Meditations
                    </b>
                    <span style={{ float: "right" }}>
                        <BlackButton style={{ marginRight: "30px" }} onClick={() => navigate('./CreateMeditation')}>Create Meditation</BlackButton>
                    </span>

                </div>

                <br />
                <br />
                <TableContainer component={Paper} style={{ width: '95%', marginLeft: "auto", marginRight: 'auto', textAlign: 'center', fontWeight: "medium" }}>
                    <Table sx={{ border: 1, m: 'auto' }} style={{ alignContent: 'center', textAlign: "center" }} aria-label="simple table" >
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ border: 1, fontWeight: 'bold' }}>Meditation ID </TableCell>
                                <TableCell align="center" sx={{ border: 1, fontWeight: 'bold' }}>Meditation Name</TableCell>
                                <TableCell align="center" sx={{ border: 1, fontWeight: 'bold' }}>Action</TableCell>
                                <TableCell align="center" sx={{ border: 1, fontWeight: 'bold' }}>Updates</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* {console.log(rows)} */}
                            {rows.map((row) => {
                                console.log();
                                return (

                                    <TableRow
                                        key={row.id}
                                        sx={{ border: 1 }}
                                    >
                                        <TableCell align="center" component="th" scope="row" sx={{ border: 1, fontWeight: "medium" }}>
                                            {row.id}
                                        </TableCell>
                                        <TableCell align="center" sx={{ border: 1, fontWeight: "medium" }}>{row.label}</TableCell>
                                        <TableCell align="center" sx={{ border: 1, fontWeight: "medium" }}>
                                            <Button variant="outlined"
                                                onClick={() => navigate(`./EditMeditation/${row.Aid}`)} startIcon={<EditIcon />} size="small" sx={{ width: 50, padding: 0.2, margin: 0.1 }} style={{ backgroundColor: "#3e3e3e", color: "white" }}>
                                                Edit
                                            </Button>
                                            <br />

                                            <IconButton onClick={
                                                async () => {

                                                    setIsLoading(true)
                                                    let audioTemplate = await fetchAudioTemplate(row.id, row.script)

                                                    if (audioTemplate.audioBuffers.length === 0) {
                                                        setIsLoading(false)
                                                        return;
                                                    }
                                                    // MyLogger.info(audioTemplate.fileName, "fileName")
                                                    let mergedAudio = await crunker.concatAudio(audioTemplate.audioBuffers)
                                                    let exportedAudio = await crunker.export(mergedAudio, 'audio/wav')
                                                    crunker.download(exportedAudio.blob, row.label)
                                                    setIsLoading(false)
                                                }
                                            }>
                                                <DownloadForOfflineIcon />
                                            </IconButton>

                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <br />
                <br />
            </Page>
        </>
    )

};

export default CreateTemplate;