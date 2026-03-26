import React, { Component } from 'react'
import Upload from './upload'
import { Content } from './styles'
import FileList from '../FileList/FileList'
import { uniqueId } from 'lodash'
import filesize from 'filesize'
import axios from 'axios'
import { BASE_URL } from '../baseURL/BASE_URL'

const URL = BASE_URL + '/anexo'
export default class Index extends Component {
    state = {
        uploadedFiles: [],
    }

    async componentDidMount() {
        const response = await axios.get(`${URL}`)

        this.setState({
            uploadedFiles: response.data.map(file => ({
                id: file.id,
                name: file.nome,
                readableSize: filesize(file.size),
                uploaded: true,
                url: file.link,
            }))

        })
    }

    handleUpload = files => {
        const uploadedFiles = files.map(file => ({
            file,
            id: uniqueId(),
            name: file.name,
            readableSize: filesize(file.size),

            progress: 0,
            uploaded: false,
            error: false,
            url: null

        }))
        this.setState({
            uploadedFiles: this.state.uploadedFiles.concat(uploadedFiles)
        });
        uploadedFiles.forEach(this.processUpload);

    };
    updateFile = (id, data) => {
        this.setState({
            uploadedFiles: this.state.uploadedFiles.map(uploadedFile => {
                return id === uploadedFile.id ? { ...uploadedFile, ...data } : uploadedFile;
            })
        })
    }

    processUpload = (uploadedFile) => {
        const data = new FormData();



        data.append('file', uploadedFile.file, uploadedFile.name)
        data.append("id_user", '31')
        axios.post(BASE_URL + '/reembolso', data, {
            headers: {
                "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
            },
            onUploadProgress: e => {
                const progress = parseInt(Math.round((e.loaded * 100) / e.total))
                this.updateFile(uploadedFile.id, {
                    progress,
                })

            }
        }).then(resp => {
            this.updateFile(uploadedFile.id, {
                uploaded: true,
                id: resp.data.id,
                url: resp.data.url
            })

        }).then(resp => { this.componentDidMount() })
            .catch(resp => {
                this.updateFile(uploadedFile.id, {
                    error: true
                })

            })
    }
    handleDelete = id => {
        axios.delete(`${URL}/${id}`);
        this.setState({ uploadedFiles: this.state.uploadedFiles.filter(file => file.id !== id) })
    }
    render() {
        const { uploadedFiles } = this.state;
        return (

            <Content>
                <>
                    <Upload onUpload={this.handleUpload} />
                    {!!uploadedFiles.length && (
                        <FileList files={uploadedFiles} onDelete={this.handleDelete} />)}
                </>
            </Content>


        )
    }
}

