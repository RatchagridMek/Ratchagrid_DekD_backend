import React, { useState } from 'react';
import { Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import swal from 'sweetalert';


const NewForum = (props) => {

    const state = {
        header: '',
        content: '',
    }
    const [data, setData] = useState(state);
    const [error_list, setError_list] = useState([]);
    const [html_error, sethtml_error] = useState('');
    const [content_error, setcontent_error] = useState('');
    const Btn_stage = () => {
        document.getElementById('btn-able').classList.toggle('d-none');
        document.getElementById('btn-disable').classList.toggle('d-none');
    }
    const handleHeader = (e) => {
        let acc_btn = document.getElementById('btn-able');
        let length = data.content.replace(/<\/?[^>]+(>|$)/g, "").length;
        setData({
            ...data,
            'header': e.target.value,
        });
        switch (e.target.value.length < 4) {
            case true:
                document.getElementById('textHeader').style.color = 'red';
                if (!acc_btn.classList.contains('d-none')) {
                    Btn_stage();
                };
                break;
            case false:
                document.getElementById('textHeader').style.color = 'black';
                if (length >= 6) {
                    if (acc_btn.classList.contains('d-none')) {
                        Btn_stage();
                    }
                };
                break;
            default: break;
        }
    }
    const handleContent = (e, editor) => {
        let resdata = editor.getData();
        let length = resdata.replace(/<\/?[^>]+(>|$)/g, "").length;
        let acc_btn = document.getElementById('btn-able');
        setData({
            ...data,
            'content': resdata,
        });
        switch (length < 6) {
            case true:
                document.getElementById('textContent').style.color = 'red';
                if (!acc_btn.classList.contains('d-none')) {
                    Btn_stage();
                }
                break;
            case false:
                document.getElementById('textContent').style.color = 'black';
                if (data.header.length >= 4) {
                    if (acc_btn.classList.contains('d-none')) {
                        Btn_stage();
                    }
                }
                break;
            default : break;
        }
    }

    const Close = () => {
        props.setShow(false);
        setError_list([]);
        sethtml_error('');
        setcontent_error('');
    }

    const submit = (e) => {
        e.preventDefault();
        setError_list([]);
        sethtml_error('');
        setcontent_error('');
        axios.post('api/newforum', data).then((res) => {
            switch (res.data.status) {
                case 200:
                    swal({
                        title: "ดำเนินการเสร็จสิ้น",
                        text: res.data.message,
                        icon: "success",
                    }).then(() => {
                        props.setShow(false);
                        window.location.reload();
                    })
                    break;
                case 422:
                    setError_list(res.data.validate_err);
                    break;
                case 400:
                    sethtml_error(res.data.message);
                    break;
                case 401:
                    setcontent_error(res.data.message);
                    break;
                default : break;
            }
        })
    }

    return (

        <Modal onHide={Close} show={props.show} className="py-5 justify-content-center">
            <Modal.Dialog className='w-100'>
                <Modal.Header closeButton>
                    <Modal.Title><strong>สร้างกระทู้ใหม่</strong></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row} className="mb-3">
                            <Col sm="12">
                                <Form.Control size="md" onChange={handleHeader} className="fw-bold" id="textHeader" placeholder='หัวข้อกระทู้' />
                                <span className="text-danger">{error_list.header || html_error}</span>
                            </Col>
                        </Form.Group>
                        <Form.Group id="textContent">
                            <CKEditor
                                editor={ClassicEditor}
                                data={data.content}
                                onChange={handleContent}
                                config={{
                                    removePlugins: ["EasyImage", "ImageUpload", "MediaEmbed", "Table", "TableToolbar", "BlockQuote"],
                                    placeholder: 'เนื้อหากระทู้'
                                }}
                            >
                            </CKEditor>
                        </Form.Group>
                        <span className="text-danger">{error_list.content || content_error}</span>
                        <Button id="btn-able" onClick={submit} className="mt-3 mb-2 d-none d-flex justify-content-center align-items-center" variant="primary">สร้างกระทู้</Button>
                        <Button id="btn-disable" className="mt-3 mb-2 d-flex justify-content-center align-items-center" variant="primary" disabled>สร้างกระทู้</Button>
                    </Form>
                </Modal.Body>

            </Modal.Dialog>
        </Modal>
    )
}

export default NewForum;