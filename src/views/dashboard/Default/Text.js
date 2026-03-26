import React, { useState, useRef } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Card from '@mui/material/Card';
import { gridSpacing } from 'store/constant';
import Button from '@mui/material/Button';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { savePosts } from 'services/post';
import Modal from '@mui/material/Modal';
import { useTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { IconLogout, IconSearch, IconSettings, IconUser } from '@tabler/icons';
// import Box from '@mui/material/Box';
import { Avatar, Box, Chip, Grid, Typography } from '@mui/material';
import Upload from 'components/Upload/upload';
import { uniqueId } from 'lodash';
import filesize from 'filesize';
import FileList from 'components/FileList/FileList';
import { ContentUpload } from 'components/Upload/styles';
import ImageListView from 'components/ImageList/ImageListView';
import { useSelector } from 'react-redux';

function Text(props) {
    const theme = useTheme();
    const anchorRef = useRef(null);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const onChange = (evt) => setEditorState(evt.target.value);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const name = useSelector((state) => state.auth.user.name) || '';
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '30%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        '@media(max-width: 768px)': {
            width: '100%'
        }
    };
    const handleUpload = (files) => {
        const uploadedFile = files.map((file) => ({
            file,
            img: URL.createObjectURL(file),
            id: uniqueId(),
            title: file.name,
            readableSize: filesize(file.size),
            progress: 0,
            uploaded: false,
            error: false,
            url: null
        }));
        setUploadedFiles(uploadedFiles.concat(uploadedFile));
    };
    const handleDelete = (id) => {
        setUploadedFiles(uploadedFiles.filter((file) => file.id !== id));
    };
    const handleForm = (e) => {
        e.preventDefault();
        console.log(uploadedFiles);
        const data = {
            description: `${draftToHtml(convertToRaw(editorState.getCurrentContent()))}`,
            idUser: 1
        };
        savePosts(data).then((resp) => {
            setEditorState(EditorState.createEmpty());
            setUploadedFiles([]);
            props.getAllPost();
            handleClose();
        });
        // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    };
    return (
        <>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="center" spacing={gridSpacing}>
                    <Grid item xs={12} md={8} sm={8}>
                        <Card style={{ padding: '30px' }}>
                            <Grid item xs={12}>
                                <Grid container alignItems="center" justifyContent="center" spacing={gridSpacing}>
                                    <Grid item xs={2} md={1}>
                                        <Chip
                                            sx={{
                                                height: '48px',
                                                alignItems: 'center',
                                                borderRadius: '27px',
                                                transition: 'all .2s ease-in-out',
                                                borderColor: theme.palette.primary.light,
                                                backgroundColor: theme.palette.primary.light,
                                                '&[aria-controls="menu-list-grow"], &:hover': {
                                                    borderColor: theme.palette.primary.main,
                                                    background: `${theme.palette.primary.main}!important`,
                                                    color: theme.palette.primary.light,
                                                    '& svg': {
                                                        stroke: theme.palette.primary.light
                                                    }
                                                },
                                                '& .MuiChip-label': {
                                                    lineHeight: 0
                                                }
                                            }}
                                            icon={
                                                <Avatar
                                                    sx={{
                                                        ...theme.typography.mediumAvatar,
                                                        margin: '8px 0 8px 8px !important',
                                                        cursor: 'pointer',
                                                        bgcolor: red[500]
                                                    }}
                                                    // ref={anchorRef}
                                                    aria-controls={open ? 'menu-list-grow' : undefined}
                                                    aria-haspopup="true"
                                                    color="inherit"
                                                    aria-label="recipe"
                                                >
                                                    {name.length > 0 ? name[0] : 'U'}
                                                </Avatar>
                                            }
                                            // label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
                                            variant="outlined"
                                            ref={anchorRef}
                                            aria-controls={open ? 'menu-list-grow' : undefined}
                                            aria-haspopup="true"
                                            // onClick={handleToggle}
                                            color="primary"
                                        />
                                    </Grid>
                                    <Grid item xs={10} md={10}>
                                        <Chip
                                            sx={{
                                                width: '100%',
                                                height: '48px',
                                                alignItems: 'center',
                                                borderRadius: '27px',
                                                transition: 'all .2s ease-in-out',
                                                borderColor: theme.palette.secondary.light,
                                                backgroundColor: theme.palette.secondary.light,
                                                '&[aria-controls="menu-list-grow"], &:hover': {
                                                    borderColor: theme.palette.secondary.main,
                                                    background: `${theme.palette.secondary.main}!important`,
                                                    color: theme.palette.secondary.light,
                                                    '& svg': {
                                                        stroke: theme.palette.secondary.light
                                                    }
                                                },
                                                '& .MuiChip-label': {
                                                    lineHeight: 1
                                                }
                                            }}
                                            label={<span>Escreva aqui sua publicação ...</span>}
                                            variant="outlined"
                                            ref={anchorRef}
                                            aria-controls={open ? 'menu-list-grow' : undefined}
                                            aria-haspopup="true"
                                            onClick={handleOpen}
                                            color="primary"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Card sx={style}>
                                    {/* <Typography id="modal-modal-title" variant="h6" component="h2">
                                        Text in a modal
                                    </Typography> */}
                                    <form onSubmit={handleForm}>
                                        <Editor
                                            toolbarHidden
                                            // toolbar={{ options: ['emoji'] }}
                                            editorStyle={{
                                                height: '200px',
                                                width: '100%',
                                                border: '1px solid #DCDCDC',
                                                borderRadius: '25px',
                                                padding: '20px',
                                                overflowY: 'hidden'
                                            }}
                                            toolbarStyle={{ position: 'absolute', top: '80%', border: 0 }}
                                            editorState={editorState}
                                            toolbarClassName="toolbarClassName"
                                            wrapperClassName="wrapperClassName"
                                            editorClassName="editorClassName"
                                            mention={{
                                                separator: ' ',
                                                trigger: '@',
                                                suggestions: [
                                                    { text: 'APPLE', value: 'apple', url: 'apple' },
                                                    { text: 'BANANA', value: 'banana', url: 'banana' },
                                                    { text: 'CHERRY', value: 'cherry', url: 'cherry' },
                                                    { text: 'DURIAN', value: 'durian', url: 'durian' },
                                                    { text: 'EGGFRUIT', value: 'eggfruit', url: 'eggfruit' },
                                                    { text: 'FIG', value: 'fig', url: 'fig' },
                                                    { text: 'GRAPEFRUIT', value: 'grapefruit', url: 'grapefruit' },
                                                    { text: 'HONEYDEW', value: 'honeydew', url: 'honeydew' }
                                                ]
                                            }}
                                            onEditorStateChange={(e) => setEditorState(e)}
                                        />
                                        {/* {!!uploadedFiles.length && <FileList files={uploadedFiles} onDelete={handleDelete} />} */}
                                        {!!uploadedFiles.length && <ImageListView files={uploadedFiles} onDelete={handleDelete} />}
                                        <Upload onUpload={handleUpload} />
                                        <Grid
                                            item
                                            xs={12}
                                            style={{ width: '100%', marginTop: '100px' }}
                                            container
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Button type="submit" style={{ width: '100%', borderRadius: '25px' }} variant="contained">
                                                Publicar
                                            </Button>
                                        </Grid>
                                    </form>
                                </Card>
                            </Modal>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

export default Text;
