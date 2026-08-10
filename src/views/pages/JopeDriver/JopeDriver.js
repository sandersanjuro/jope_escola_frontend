import { useState, useEffect, useRef } from 'react';
import {
    Box,
    Button,
    Grid,
    Typography,
    Alert,
    Snackbar,
    Paper,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Breadcrumbs,
    Link,
    Checkbox,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Autocomplete,
    CircularProgress,
    Tooltip,
    Card,
    CardContent,
    CardActions,
    CardActionArea,
    ToggleButton,
    ToggleButtonGroup,
    FormControlLabel,
    RadioGroup,
    Radio,
    FormLabel
} from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import MainCard from 'ui-component/cards/MainCard';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useDispatch, useSelector } from 'react-redux';
import { MENU_OPEN } from 'store/actions';
import { gridSpacing } from 'store/constant';
import {
    listJopeDriver,
    createFolder,
    renameFolder,
    deleteFolder,
    uploadFile,
    uploadFiles,
    renameFile,
    deleteFile,
    downloadFile,
    downloadZip,
    duplicateFolder,
    listFolderPermissions,
    grantFolderPermission,
    revokeFolderPermission
} from 'services/jopeDriver';
import { getUnit } from 'services/unit';
import BasicModal from 'components/Modal/BasicModal';

const JopeDriver = () => {
    const dispatch = useDispatch();
    const idUnit = useSelector((state) => state.user.unit || '');
    const [loading, setLoading] = useState(false);
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [breadcrumb, setBreadcrumb] = useState([]);
    const [canManage, setCanManage] = useState(false);
    const [parentId, setParentId] = useState(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [selectedFileIds, setSelectedFileIds] = useState([]);
    const [downloading, setDownloading] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

    const [newFolderOpen, setNewFolderOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [uploadFolderId, setUploadFolderId] = useState(null);
    const fileInputRef = useRef(null);
    const [renameDialog, setRenameDialog] = useState({ open: false, type: null, id: null, name: '' });
    const [deleteModal, setDeleteModal] = useState({ open: false, type: null, id: null, name: '' });
    const [permissionsOpen, setPermissionsOpen] = useState(false);
    const [permissionsFolderId, setPermissionsFolderId] = useState(null);
    const [permissionsList, setPermissionsList] = useState([]);
    const [unitOptions, setUnitOptions] = useState([]);
    const [grantUnit, setGrantUnit] = useState(null);
    const [loadingPerms, setLoadingPerms] = useState(false);

    const [duplicateDialog, setDuplicateDialog] = useState({
        open: false,
        folderId: null,
        sourceName: ''
    });
    const [duplicateName, setDuplicateName] = useState('');
    const [duplicateIncludeSubfolders, setDuplicateIncludeSubfolders] = useState(true);
    const [duplicateCopyFiles, setDuplicateCopyFiles] = useState(true);
    const [duplicateSubmitting, setDuplicateSubmitting] = useState(false);

    useEffect(() => {
        const idx = document.location.pathname.split('/').findIndex((x) => x === 'jope_driver');
        if (idx > -1) dispatch({ type: MENU_OPEN, id: 'jope_driver' });
    }, [dispatch]);

    const loadContent = async (pid = null) => {
        setLoading(true);
        setError('');
        try {
            const unitId = idUnit && idUnit !== '14725896312' ? idUnit : null;
            const res = await listJopeDriver(pid, unitId);
            if (res.data.success) {
                setFolders(res.data.data.folders || []);
                setFiles(res.data.data.files || []);
                setBreadcrumb(res.data.data.breadcrumb || []);
                setCanManage(!!res.data.can_manage);
            } else {
                setError(res.data.error || 'Erro ao carregar.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao carregar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadContent(parentId);
    }, [parentId, idUnit]);

    const handleBreadcrumbClick = (id) => {
        setParentId(id === 'root' ? null : id);
    };

    const handleFolderClick = (id) => {
        setParentId(id);
    };

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) {
            setError('Informe o nome da pasta.');
            return;
        }
        setError('');
        try {
            await createFolder(parentId, newFolderName.trim());
            setNewFolderOpen(false);
            setNewFolderName('');
            setSuccess('Pasta criada.');
            loadContent(parentId);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Erro ao criar pasta.');
        }
    };

    const handleUpload = (e) => {
        const fileList = e.target.files;
        if (!fileList?.length || uploadFolderId == null) return;
        setError('');
        setLoading(true);
        const files = Array.from(fileList);
        const uploadPromise = files.length > 1
            ? uploadFiles(uploadFolderId, files)
            : uploadFile(uploadFolderId, files[0]);
        uploadPromise
            .then((res) => {
                const count = res.data?.data?.length ?? (res.data?.data ? 1 : 1);
                setSuccess(files.length > 1 ? `${files.length} arquivos enviados.` : 'Arquivo enviado.');
                loadContent(parentId);
            })
            .catch((err) => {
                setError(err.response?.data?.message || err.response?.data?.error || 'Erro ao enviar arquivo(s).');
            })
            .finally(() => {
                setLoading(false);
                setUploadFolderId(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            });
    };

    const openRename = (type, id, name) => {
        setRenameDialog({ open: true, type, id, name });
    };

    const handleRename = async () => {
        const { type, id, name } = renameDialog;
        if (!name?.trim()) return;
        setError('');
        try {
            if (type === 'folder') await renameFolder(id, name.trim());
            else await renameFile(id, name.trim());
            setRenameDialog({ open: false, type: null, id: null, name: '' });
            setSuccess(type === 'folder' ? 'Pasta renomeada.' : 'Arquivo renomeado.');
            loadContent(parentId);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Erro ao renomear.');
        }
    };

    const openDelete = (type, id, name) => {
        setDeleteModal({ open: true, type, id, name });
    };

    const openDuplicate = (folderId, sourceName) => {
        setDuplicateDialog({ open: true, folderId, sourceName });
        setDuplicateName(`${sourceName} (cópia)`);
        setDuplicateIncludeSubfolders(true);
        setDuplicateCopyFiles(true);
    };

    const closeDuplicate = () => {
        setDuplicateDialog({ open: false, folderId: null, sourceName: '' });
        setDuplicateName('');
    };

    const handleDuplicateSubmit = async () => {
        const name = duplicateName.trim();
        if (!name) {
            setError('Informe o nome da nova pasta.');
            return;
        }
        const { folderId } = duplicateDialog;
        if (!folderId) return;
        setDuplicateSubmitting(true);
        setError('');
        try {
            await duplicateFolder(folderId, name, duplicateIncludeSubfolders, duplicateCopyFiles);
            setSuccess('Pasta duplicada.');
            closeDuplicate();
            loadContent(parentId);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Erro ao duplicar pasta.');
        } finally {
            setDuplicateSubmitting(false);
        }
    };

    const handleDelete = async () => {
        const { type, id } = deleteModal;
        setError('');
        try {
            if (type === 'folder') await deleteFolder(id);
            else await deleteFile(id);
            setDeleteModal({ open: false, type: null, id: null, name: '' });
            setSuccess(type === 'folder' ? 'Pasta excluída.' : 'Arquivo excluído.');
            loadContent(parentId);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Erro ao excluir.');
        }
    };

    const handleDownloadOne = async (fileId, fileName = null) => {
        setDownloading(true);
        setError('');
        try {
            const unitId = idUnit && idUnit !== '14725896312' ? idUnit : null;
            await downloadFile(fileId, unitId, fileName);
            setSuccess('Download iniciado.');
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao fazer download.');
        } finally {
            setDownloading(false);
        }
    };

    const handleDownloadZip = async () => {
        if (selectedFileIds.length === 0) {
            setError('Selecione pelo menos um arquivo.');
            return;
        }
        setDownloading(true);
        setError('');
        try {
            const unitId = idUnit && idUnit !== '14725896312' ? idUnit : null;
            await downloadZip(selectedFileIds, unitId);
            setSuccess('Download em ZIP iniciado.');
            setSelectedFileIds([]);
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao fazer download.');
        } finally {
            setDownloading(false);
        }
    };

    const toggleFileSelect = (fileId) => {
        setSelectedFileIds((prev) =>
            prev.includes(fileId) ? prev.filter((x) => x !== fileId) : [...prev, fileId]
        );
    };

    const openPermissions = async (folderId) => {
        setPermissionsFolderId(folderId);
        setPermissionsOpen(true);
        setLoadingPerms(true);
        try {
            const res = await listFolderPermissions(folderId);
            if (res.data.success) setPermissionsList(res.data.data.permissions || []);
            const unitsRes = await getUnit();
            const list = Array.isArray(unitsRes.data) ? unitsRes.data : unitsRes.data?.data;
            if (list?.length) {
                setUnitOptions(list.map((u) => ({ id: u.id, label: u.nome || u.nameUnit || u.label })));
            }
        } catch (e) {
            setError('Erro ao carregar permissões.');
        } finally {
            setLoadingPerms(false);
        }
    };

    const handleGrantPermission = async () => {
        if (!grantUnit?.id || !permissionsFolderId) return;
        try {
            await grantFolderPermission(permissionsFolderId, grantUnit.id);
            setGrantUnit(null);
            const res = await listFolderPermissions(permissionsFolderId);
            if (res.data.success) setPermissionsList(res.data.data.permissions || []);
            setSuccess('Permissão concedida.');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Erro ao conceder permissão.');
        }
    };

    const handleRevokePermission = async (unitId) => {
        if (!permissionsFolderId) return;
        try {
            await revokeFolderPermission(permissionsFolderId, unitId);
            const res = await listFolderPermissions(permissionsFolderId);
            if (res.data.success) setPermissionsList(res.data.data.permissions || []);
            setSuccess('Permissão removida.');
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao remover permissão.');
        }
    };

    const showSnack = (error || success);

    return (
        <MainCard>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Jope Driver
            </Typography>

            {showSnack && (
                <Snackbar open={!!showSnack} autoHideDuration={5000} onClose={() => { setError(''); setSuccess(''); }}>
                    <Alert severity={error ? 'error' : 'success'} onClose={() => { setError(''); setSuccess(''); }}>
                        {error || success}
                    </Alert>
                </Snackbar>
            )}

            <Breadcrumbs sx={{ mb: 2 }}>
                <Link
                    component="button"
                    variant="body1"
                    onClick={() => handleBreadcrumbClick('root')}
                    sx={{ cursor: 'pointer' }}
                >
                    Raiz
                </Link>
                {breadcrumb.map((b) => (
                    <Link
                        key={b.id}
                        component="button"
                        variant="body1"
                        onClick={() => handleBreadcrumbClick(b.id)}
                        sx={{ cursor: 'pointer' }}
                    >
                        {b.name}
                    </Link>
                ))}
            </Breadcrumbs>

            {canManage && (
                <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        startIcon={<CreateNewFolderIcon />}
                        onClick={() => setNewFolderOpen(true)}
                    >
                        Nova pasta
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<UploadFileIcon />}
                        onClick={() => {
                            setUploadFolderId(parentId);
                            fileInputRef.current?.click();
                        }}
                        disabled={parentId === null}
                    >
                        Enviar arquivo(s)
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        hidden
                        onChange={handleUpload}
                    />
                </Box>
            )}

            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(e, val) => val != null && setViewMode(val)}
                    size="small"
                >
                    <ToggleButton value="list" aria-label="lista">
                        <ViewListIcon />
                    </ToggleButton>
                    <ToggleButton value="grid" aria-label="cards">
                        <ViewModuleIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
                {files.length > 0 && (
                    <Button
                        variant="outlined"
                        startIcon={<FolderZipIcon />}
                        onClick={handleDownloadZip}
                        disabled={selectedFileIds.length === 0 || downloading}
                    >
                        Baixar selecionados (ZIP)
                    </Button>
                )}
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                </Box>
            ) : viewMode === 'grid' ? (
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                        {folders.map((f) => (
                            <Grid item xs={6} sm={4} md={3} lg={2} key={`folder-${f.id}`}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardActionArea sx={{ flex: 1 }} onClick={() => handleFolderClick(f.id)}>
                                        <Box
                                            sx={{
                                                height: 140,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                bgcolor: 'action.hover'
                                            }}
                                        >
                                            <FolderOpenIcon sx={{ fontSize: 64 }} color="primary" />
                                        </Box>
                                        <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                                            <Typography variant="body2" noWrap title={f.name}>
                                                {f.name}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    {canManage && (
                                        <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                                            <Tooltip title="Renomear">
                                                <IconButton size="small" onClick={() => openRename('folder', f.id, f.name)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Permissões">
                                                <IconButton size="small" onClick={() => openPermissions(f.id)}>
                                                    <LockIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Duplicar pasta">
                                                <IconButton size="small" onClick={() => openDuplicate(f.id, f.name)}>
                                                    <ContentCopyIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Excluir">
                                                <IconButton size="small" onClick={() => openDelete('folder', f.id, f.name)} color="error">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </CardActions>
                                    )}
                                </Card>
                            </Grid>
                        ))}
                        {files.map((file) => (
                            <Grid item xs={6} sm={4} md={3} lg={2} key={`file-${file.id}`}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardActionArea
                                        sx={{ flex: 1 }}
                                        onClick={() => handleDownloadOne(file.id, file.name)}
                                        disabled={downloading}
                                    >
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                height: 140,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                bgcolor: 'action.hover',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '100%',
                                                    height: '100%'
                                                }}
                                            >
                                                <InsertDriveFileIcon sx={{ fontSize: 64 }} color="action" />
                                            </Box>
                                            {file.preview_url && (
                                                <Box
                                                    component="img"
                                                    src={file.preview_url}
                                                    alt={file.name}
                                                    sx={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            )}
                                        </Box>
                                        <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                                            <Typography variant="body2" noWrap title={file.name}>
                                                {file.name}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions sx={{ justifyContent: 'space-between', pt: 0 }}>
                                        <Checkbox
                                            checked={selectedFileIds.includes(file.id)}
                                            onChange={() => toggleFileSelect(file.id)}
                                            size="small"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <Box>
                                            <Tooltip title="Baixar">
                                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDownloadOne(file.id, file.name); }} disabled={downloading}>
                                                    <DownloadIcon />
                                                </IconButton>
                                            </Tooltip>
                                            {canManage && (
                                                <>
                                                    <Tooltip title="Renomear">
                                                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); openRename('file', file.id, file.name); }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Excluir">
                                                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); openDelete('file', file.id, file.name); }} color="error">
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </Box>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    {folders.length === 0 && files.length === 0 && (
                        <Typography color="textSecondary" sx={{ py: 3, textAlign: 'center' }}>
                            Nenhuma pasta ou arquivo aqui.
                        </Typography>
                    )}
                </Paper>
            ) : (
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <List>
                        {folders.map((f) => (
                            <ListItem
                                key={f.id}
                                secondaryAction={
                                    canManage && (
                                        <Box component="span">
                                            <Tooltip title="Renomear">
                                                <IconButton size="small" onClick={() => openRename('folder', f.id, f.name)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Permissões">
                                                <IconButton size="small" onClick={() => openPermissions(f.id)}>
                                                    <LockIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Duplicar pasta">
                                                <IconButton size="small" onClick={() => openDuplicate(f.id, f.name)}>
                                                    <ContentCopyIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Excluir">
                                                <IconButton size="small" onClick={() => openDelete('folder', f.id, f.name)} color="error">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    )
                                }
                                disablePadding
                            >
                                <ListItemButton onClick={() => handleFolderClick(f.id)}>
                                    <ListItemIcon>
                                        <FolderOpenIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary={f.name} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                        {files.map((file) => (
                            <ListItem
                                key={file.id}
                                secondaryAction={
                                    <Box component="span" display="flex" alignItems="center">
                                        <Checkbox
                                            checked={selectedFileIds.includes(file.id)}
                                            onChange={() => toggleFileSelect(file.id)}
                                            size="small"
                                        />
                                        <Tooltip title="Baixar">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDownloadOne(file.id, file.name)}
                                                disabled={downloading}
                                            >
                                                <DownloadIcon />
                                            </IconButton>
                                        </Tooltip>
                                        {canManage && (
                                            <>
                                                <Tooltip title="Renomear">
                                                    <IconButton size="small" onClick={() => openRename('file', file.id, file.name)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Excluir">
                                                    <IconButton size="small" onClick={() => openDelete('file', file.id, file.name)} color="error">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                    </Box>
                                }
                                disablePadding
                            >
                                <ListItemIcon>
                                    <InsertDriveFileIcon />
                                </ListItemIcon>
                                <ListItemText primary={file.name} />
                            </ListItem>
                        ))}
                    </List>
                    {folders.length === 0 && files.length === 0 && !loading && (
                        <Typography color="textSecondary" sx={{ py: 3, textAlign: 'center' }}>
                            Nenhuma pasta ou arquivo aqui.
                        </Typography>
                    )}
                </Paper>
            )}

            <Dialog open={newFolderOpen} onClose={() => setNewFolderOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Nova pasta</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        fullWidth
                        label="Nome da pasta"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNewFolderOpen(false)}>Cancelar</Button>
                    <Button variant="contained" onClick={handleCreateFolder}>
                        Criar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={duplicateDialog.open} onClose={closeDuplicate} maxWidth="sm" fullWidth>
                <DialogTitle>Duplicar pasta</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Será criada uma nova pasta no mesmo nível que &quot;{duplicateDialog.sourceName}&quot;, com as opções abaixo.
                    </Typography>
                    <TextField
                        autoFocus
                        fullWidth
                        label="Nome da nova pasta"
                        value={duplicateName}
                        onChange={(e) => setDuplicateName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={duplicateIncludeSubfolders}
                                onChange={(e) => setDuplicateIncludeSubfolders(e.target.checked)}
                            />
                        }
                        label="Incluir subpastas (replicar toda a estrutura de diretórios)"
                    />
                    <FormLabel component="legend" sx={{ mt: 2, mb: 1 }}>
                        Conteúdo
                    </FormLabel>
                    <RadioGroup
                        value={duplicateCopyFiles ? 'with_files' : 'dirs_only'}
                        onChange={(e) => setDuplicateCopyFiles(e.target.value === 'with_files')}
                    >
                        <FormControlLabel value="dirs_only" control={<Radio />} label="Apenas pastas (sem arquivos)" />
                        <FormControlLabel
                            value="with_files"
                            control={<Radio />}
                            label="Pastas e arquivos (copia os arquivos no armazenamento)"
                        />
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDuplicate} disabled={duplicateSubmitting}>
                        Cancelar
                    </Button>
                    <Button variant="contained" onClick={handleDuplicateSubmit} disabled={duplicateSubmitting}>
                        {duplicateSubmitting ? 'Duplicando…' : 'Duplicar'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={renameDialog.open} onClose={() => setRenameDialog({ open: false })} maxWidth="sm" fullWidth>
                <DialogTitle>{renameDialog.type === 'folder' ? 'Renomear pasta' : 'Renomear arquivo'}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Nome"
                        value={renameDialog.name}
                        onChange={(e) => setRenameDialog((p) => ({ ...p, name: e.target.value }))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRenameDialog({ open: false })}>Cancelar</Button>
                    <Button variant="contained" onClick={handleRename}>
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>

            <BasicModal
                open={deleteModal.open}
                title={deleteModal.type === 'folder' ? 'Excluir pasta' : 'Excluir arquivo'}
                description={`Tem certeza que deseja excluir "${deleteModal.name}"?${deleteModal.type === 'folder' ? ' Todas as subpastas e arquivos serão excluídos.' : ''}`}
                handleClose={() => setDeleteModal({ open: false })}
                onDelete={handleDelete}
            />

            <Dialog open={permissionsOpen} onClose={() => setPermissionsOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Permissões da pasta</DialogTitle>
                <DialogContent>
                    {loadingPerms ? (
                        <Box display="flex" justifyContent="center" py={2}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <Typography variant="subtitle2" sx={{ mt: 1 }}>
                                Unidades com acesso (e subpastas):
                            </Typography>
                            <List dense>
                                {permissionsList.map((p) => (
                                    <ListItem
                                        key={p.id}
                                        secondaryAction={
                                            <IconButton size="small" onClick={() => handleRevokePermission(p.unit_id)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText primary={p.unit_name || `Unidade ${p.unit_id}`} />
                                    </ListItem>
                                ))}
                            </List>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Conceder acesso a uma unidade
                                </Typography>
                                <Autocomplete
                                    options={unitOptions}
                                    getOptionLabel={(o) => o.label || ''}
                                    value={grantUnit}
                                    onChange={(e, v) => setGrantUnit(v)}
                                    renderInput={(params) => <TextField {...params} label="Unidade" size="small" />}
                                    isOptionEqualToValue={(o, v) => o.id === v.id}
                                />
                                <Button variant="contained" sx={{ mt: 1 }} onClick={handleGrantPermission} disabled={!grantUnit}>
                                    Conceder
                                </Button>
                            </Box>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPermissionsOpen(false)}>Fechar</Button>
                </DialogActions>
            </Dialog>
        </MainCard>
    );
};

export default JopeDriver;
