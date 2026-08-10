import { app } from './Api';

const base = 'jope_driver';

export const listJopeDriver = (parentId = null, unitId = null) => {
  const params = {};
  if (parentId != null) params.parent_id = parentId;
  if (unitId != null) params.unit_id = unitId;
  return app.get(base, { params });
};

export const createFolder = (parentId, name) => {
  return app.post(`${base}/folder`, { parent_id: parentId, name });
};

export const renameFolder = (id, name) => {
  return app.put(`${base}/folder/${id}`, { name });
};

export const deleteFolder = (id) => {
  return app.delete(`${base}/folder/${id}`);
};

/**
 * @param {boolean} includeSubfolders - duplicar subpastas (árvore)
 * @param {boolean} copyFiles - incluir arquivos; false = apenas pastas vazias
 */
export const duplicateFolder = (id, name, includeSubfolders = true, copyFiles = true) => {
  return app.post(`${base}/folder/${id}/duplicate`, {
    name,
    include_subfolders: includeSubfolders,
    copy_files: copyFiles
  });
};

export const uploadFile = (folderId, file) => {
  const formData = new FormData();
  formData.append('folder_id', folderId);
  formData.append('file', file);
  return app.post(`${base}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const uploadFiles = (folderId, files) => {
  const formData = new FormData();
  formData.append('folder_id', folderId);
  const fileList = Array.isArray(files) ? files : [files];
  fileList.forEach((file) => formData.append('files[]', file));
  return app.post(`${base}/upload-multiple`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const renameFile = (id, name) => {
  return app.put(`${base}/file/${id}`, { name });
};

export const deleteFile = (id) => {
  return app.delete(`${base}/file/${id}`);
};

export const downloadFile = (id, unitId = null, fileName = null) => {
  const params = unitId != null ? { unit_id: unitId } : {};
  return app.get(`${base}/download/${id}`, { responseType: 'blob', params }).then((response) => {
    let name = fileName || null;
    if (!name && response.headers['content-disposition']) {
      const match = response.headers['content-disposition'].match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i)
        || response.headers['content-disposition'].match(/filename=["']?([^"';]+)["']?/i);
      if (match && match[1]) name = decodeURIComponent(match[1].trim());
    }
    if (!name) name = `file_${id}`;
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return response;
  });
};

export const downloadZip = (fileIds, unitId = null) => {
  return app
    .post(
      `${base}/download-zip`,
      { file_ids: fileIds, unit_id: unitId },
      { responseType: 'blob' }
    )
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `jope_driver_${new Date().toISOString().slice(0, 10)}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return response;
    });
};

export const listFolderPermissions = (folderId) => {
  return app.get(`${base}/folder/${folderId}/permissions`);
};

export const grantFolderPermission = (folderId, unitId) => {
  return app.post(`${base}/folder/${folderId}/permissions`, { unit_id: unitId });
};

export const revokeFolderPermission = (folderId, unitId) => {
  return app.delete(`${base}/folder/${folderId}/permissions`, {
    params: { unit_id: unitId }
  });
};
