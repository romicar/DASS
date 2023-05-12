import React, { useState, useEffect } from 'react';
import { Page } from "./CreateStyles";
import CreateTopBar from "./Topbar_For_Template";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import TemplateModel from "../../../models/TemplateModel";
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
// https://www.figma.com/file/cxLJDtRsGQnlfD1QZLQ5Oa/Product-Meditation-Generator-%7C-CMS?node-id=781%3A2126




function CreateTemplate() {
    const [isLoading, setIsLoading] = useState(false)
    const [visible, setVisible] = useState<Boolean>(false);
    const [text, setText] = useState<string>("");
    const navigate = useNavigate();
    let base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    const [availableTemplates, setAvailableTemplates] = useState<TemplateModel[]>([]);
    const loadTemplatesAndSnippets = async () => {
        let table = base(AirtableTablesAndViews.Templates.TABLE_ID);
        let firstPage = await table.select({ view: AirtableTablesAndViews.Templates.VIEW_ID }).all()
        let templates = firstPage.map((record) => {
            return {
                label: record.get("templateDisplayName"),
                id: record.get("TemplateID"),
                value: record.get("TemplateID"),
                Status: record.get("Status"),
                LastUpdatedArray: record.get("LastUpdatedArray"),
                script: JSON.parse((record.get("templateStructure") ?? "{}") as string),
                Aid: record.id
            } as TemplateModel
        })
        setAvailableTemplates(templates)
    }
    useEffect(() => {
        loadTemplatesAndSnippets()
    }, [])
    let rows = availableTemplates;
    rows = rows.filter((ele) => ele.id !== undefined);
    // console.log(rows)
    // console.log(availableTemplates)


    const sync = async (row: TemplateModel) => {
        // console.log(row.Aid, (new Date()).toString())
        let upstr: any = (row.LastUpdatedArray) || `{"updates" : []}`;
        upstr = JSON.parse(upstr);
        upstr.updates.push((new Date()).toString());
        upstr = JSON.stringify(upstr);
        // console.log((upstr))

        let base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
        setIsLoading(true)
        base('Templates').update([

            {
                "id": row.Aid,
                "fields": {
                    "Status": "Saved",
                    "LastUpdatedArray": upstr
                }
            }
        ], function (err: any, records: any) {
            setIsLoading(false)
            if (err) {
                setVisible(true);
                setText(err.toString())
                console.error(err);
                return;
            }
            window.location.reload()
        });
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
                        Templates
                    </b>
                    <span style={{ float: "right" }}>
                        <BlackButton style={{ marginRight: "30px" }} onClick={() => navigate('./CreateTemplate')}>Create Template</BlackButton>
                    </span>

                </div>

                <br />
                <br />
                <TableContainer component={Paper} style={{ width: '95%', marginLeft: "auto", marginRight: 'auto', textAlign: 'center', fontWeight: "medium" }}>
                    <Table sx={{ border: 1, m: 'auto' }} style={{ alignContent: 'center', textAlign: "center" }} aria-label="simple table" >
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ border: 1, fontWeight: 'bold' }}>Template ID </TableCell>
                                <TableCell align="center" sx={{ border: 1, fontWeight: 'bold' }}>Template Name</TableCell>
                                <TableCell align="center" sx={{ border: 1, fontWeight: 'bold' }}>Action</TableCell>
                                <TableCell align="center" sx={{ border: 1, fontWeight: 'bold' }}>Updates</TableCell>
                                <TableCell align="center" sx={{ border: 1, fontWeight: 'bold' }}>Status</TableCell>
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
                                                onClick={() => navigate(`./EditTemplate/${row.Aid}`)} startIcon={<EditIcon />} size="small" sx={{ width: 50, padding: 0.2, margin: 0.1 }} style={{ backgroundColor: "#3e3e3e", color: "white" }}>
                                                Edit
                                            </Button>
                                            <br />
                                            <Button
                                                onClick={async () => sync(row)}
                                                variant="outlined" startIcon={<SyncIcon />} size="small" sx={{ width: 50, padding: 0.2, margin: 0.1 }} style={{ backgroundColor: "#3e3e3e", color: "white" }}>
                                                Sync
                                            </Button>
                                        </TableCell>
                                        <TableCell align="center" sx={{ border: 1, fontWeight: "medium" }}>{row.Status}</TableCell>
                                        <TableCell align="center" sx={{ border: 1, fontWeight: "medium" }}>{JSON.parse((row.LastUpdatedArray) || "{}").updates?.map((date: any) => {
                                            return <p>{date}</p>
                                        })}</TableCell>
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