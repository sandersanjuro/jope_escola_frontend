import React from 'react';
import { Container, FileInfo, Preview } from './styles';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { MdCheckCircle, MdError, MdLink } from 'react-icons/md';
import { Link } from 'react-router-dom';

export default function FileList({ files, onDelete, toEdit, toCadastro, action, disabled }) {
    return (
        <Container>
            {files.map((uploadedFile) => (
                <li key={uploadedFile.id}>
                    <FileInfo>
                        <Preview src={uploadedFile.viewURL}></Preview>
                        <div>
                            <strong style={{ fontSize: 6 }}>{uploadedFile.name}</strong>
                            <span>
                                {uploadedFile.readableSize} {''}
                                {!!uploadedFile.url && action !== 'view' && disabled !== true && uploadedFile.type !== 2 && onDelete ? (
                                    <a id="cancel" href="#/" onClick={() => onDelete(uploadedFile.id)}>
                                        Excluir
                                    </a>
                                ) : (
                                    <span></span>
                                )}
                                {!uploadedFile.url && action !== 'view' && onDelete ? (
                                    <a id="cancel" href="#/" onClick={() => onDelete(uploadedFile.id)}>
                                        Excluir
                                    </a>
                                ) : (
                                    <span></span>
                                )}
                            </span>
                        </div>
                    </FileInfo>
                    <div>
                        {uploadedFile.url && (
                            <a href={uploadedFile.url} target="_blank" rel="noopener noreferrer">
                                <MdLink style={{ marginRight: 8 }} size={24} color="#222" />
                            </a>
                        )}
                        {uploadedFile.uploaded && <MdCheckCircle size={24} color="#78e5d5" />}
                    </div>
                </li>
            ))}
        </Container>
    );
}
