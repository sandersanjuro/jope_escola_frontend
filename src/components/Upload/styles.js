import styled, { css } from 'styled-components';
const dragActive = css`
  border-color: #78e5d5;
`;
const dragReject = css`
  border-color: #e57878;
`;
export const ContentUpload = styled.div`
  width: 100%;
  background-color: #fff;
  border: 1px solid #ced4da;
  margin-bottom: 30px;
  border-radius: 4px;
  padding: 20px;
`;
export const DropContainer = styled.div.attrs({ className: 'dropzone' })`
  border: 1px dashed #ced4da;
  border-radius: 4px;
  cursor: pointer;
  transition: height 0.2s ease;
  ${(props) => props.isDragActive && dragActive}
  ${(props) => props.isDragReject && dragReject}
`;
const messageColors = {
  default: '#000',
  error: '#e57878',
  success: '#78e5d5',
};
export const UploadMessage = styled.p`
  display: flex;
  color: ${(props) => messageColors[props.type || 'default']};
  justify-content: center;
  align-items: center;
  padding: 15px 0;
`;
