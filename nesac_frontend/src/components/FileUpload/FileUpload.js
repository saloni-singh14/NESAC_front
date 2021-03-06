import React, {Fragment, useState} from 'react'
import axios from 'axios'
import Alert from 'react-bootstrap/Alert';
import Message from '../Message/Message'
import Form from 'react-bootstrap/Form'
import { Upload, Button, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

const FileUpload = () => {
    const [file, setFile]= useState(null);
    const [fileName, setFileName]= useState('No file chosen');
    const [uploadedFile, setUploadedFile]= useState({});
    //const [msg, setMsg]= useState({});
    //const [show, setShow] = useState(true);
    const [uploading, setUploading] = useState(false);

    const openNotificationWithIcon = (type,info) => {
        notification[type]({
            message: type==='success'?'Yay!':'Uh-Oh!',
            description: info,
            duration: 5,
        });
    };

    // const onChange= file => {
    //     // setFile(e.target.files[0]);
    //     // setFileName(e.target.files[0].name);
    //     setFile(file);
    //     setFileName(file.name);
    //     return false;
    // };

    const onSubmit= async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        setUploading(true);

        try {
            const res = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multi-part/form-data'
                }
                });

            const { fileName, filePath } = res.data;

            setUploadedFile({ fileName, filePath });
            setUploading(false);

            openNotificationWithIcon("success", "File uploaded successfully");
            
        } catch(err) {
            if(err.response.status=== 500) {
                setUploading(false);
                openNotificationWithIcon("error", "There was a problem with the server. Try again after a while.");
            } else {
                setUploading(false);
                openNotificationWithIcon("error", err.response.data.msg);
            }

        }
        return false;

    };

    const props = {
      onRemove: file => {
        setFile(null);
        setFileName("no file chosen");
        setUploadedFile({});

      },
      beforeUpload: file => {
        setFile(file);
        setFileName(file.name);
        setUploadedFile({});
        return false;
      },
      
    };

    return (
        <>
            {/* {show? (
            <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>{msg.variant==="success"? "Yay!": "Uh-Oh!"}</Alert.Heading>
                <p>
                {msg.data}
                </p>
            </Alert>) : null} */}
            
                <div className="custom-file mb-4">
                    {/* <input type='file' className='custom-file-input' id='customFile' onChange={onChange} />
                    <label className='custom-file-label' htmlFor='customFile'>
                        {fileName}
                    </label> */}
                    {/* <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <Upload
                        action={onSubmit}
                        listType="picture"
                        maxCount={1}
                        >
                        <Button icon={<UploadOutlined />}>Upload (Max: 1)</Button>
                        </Upload>
                    </Space> */}
                    <Upload  {...props} maxCount={1}>
                        <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                    <Button
                        type="submit"
                        onClick={onSubmit}
                        disabled={file === null}
                        loading={uploading}
                        style={{ marginTop: 16 }}
                        >
                        {uploading ? 'Uploading' : 'Start Upload'}
                    </Button>
                </div>
            {/* <input type="submit" value="upload" className="btn btn-primary btn-block mt-3" /> */}
            

            { uploadedFile ? (
                <div className="row mt-5">
                    <div className='col-md-6 m-auto'>
                        <h4 className='text-center'> {uploadedFile.fileName}</h4>
                        <img style={{width: '100%'}} src={uploadedFile.filePath} alt='' />
                    </div>
                </div>
            ) : null}
        </>
    )
}

export default FileUpload;
