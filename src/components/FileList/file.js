import React from 'react'
import { Container, FileInfo, Preview } from './styles'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { MdCheckCircle, MdError, MdLink } from 'react-icons/md'
import { Link } from 'react-router-dom'

export default function FileList({ files, onDelete, toEdit, toCadastro, id }) {
    const name = files.split('/')
    return (
        <Container>
            <li >
                <FileInfo>
                    <Preview src="imagens/file.png"></Preview>
                    <div>
                        <strong>{name[5]}</strong>
                        <span>
                            {!!files && (
                                onDelete ? (

                                    <Link id="cancel" to={`${toEdit}`} onClick={() => onDelete(id)}>Excluir</Link>
                                ) : (<span></span>)
                            )}


                            {!files && (
                                onDelete ? (

                                    <Link id="cancel" toCadastro={`${toCadastro}`} onClick={() => onDelete()}>Excluir</Link>
                                ) : (<span></span>)
                            )}
                        </span>
                    </div>
                </FileInfo>
                <div>
                    {/* {!!uploadedFile.uploaded && !!uploadedFile.error &&(
                        <CircularProgressbar styles={{ root:{width:24,color:'#004A34'},path:{stroke:'#7159c1'}}} strokeWiwth={10} percentage={uploadedFile.progress}></CircularProgressbar>
                    )} */}
                    {files && (
                        <a href={files} target="_blank" rel="noopener noreferrer">
                            <MdLink style={{ marginRight: 8 }} size={24} color="#222" />
                        </a>
                    )}
                    {/* {uploadedFile.uploaded && (
                        <MdCheckCircle size={24} color="#78e5d5" />
                    )}
                    {uploadedFile.erros && (
                        <MdError size={24} color="e57878" />
                    )} */}


                </div>



            </li>

        </Container>
    )
}
