import React, { useState } from 'react';
import { Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import swal from 'sweetalert';


const EditForum = (props) => {

    const [error_list, setError_list] = useState([]);
    const [html_error, sethtml_error] = useState('');
    const [content_error, setcontent_error] = useState('');

    const close = () => {
        props.setShow(false)
    }

    const Btn_stage = () => {
        document.getElementById('btn-able').classList.toggle('d-none');
        document.getElementById('btn-disable').classList.toggle('d-none');
    }

    const submit = (e) => {
        e.preventDefault();
        setError_list([]);
        sethtml_error('');
        setcontent_error('');
        axios.put(`api/updateforum/${props.id}`, props.newData).then((res) => {
            switch (res.data.status) {
                case 200:
                    swal({
                        title: "ดำเนินการเสร็จสิ้น",
                        text: res.data.message,
                        icon: "success",
                    }).then(() => {
                        close();
                        window.location.reload();
                    })
                    break;
                case 404:
                    swal({
                        title: "เกิดข้อผิดพลาด",
                        text: res.data.message,
                        icon: "error",
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
                default:
                    break;
            }
        })
    }

    const handleHeader = (e) => {
        let acc_btn = document.getElementById('btn-able');
        let length = props.newData.content.replace(/<\/?[^>]+(>|$)/g, "").length;
        props.setnewData({
            ...props.newData,
            'header': e.target.value,
        })
        switch (e.target.value.length < 4) {
            case true:
                document.getElementById('textHeader').style.color = 'red';
                if (!acc_btn.classList.contains('d-none')) {
                    Btn_stage();
                }
                break;
            case false:
                document.getElementById('textHeader').style.color = 'black';
                if (length >= 6) {
                    if (acc_btn.classList.contains('d-none')) {
                        Btn_stage();
                    }
                }
                break;
            default: break;
        }
    }

    const handleContent = (e, editor) => {
        let resdata = editor.getData();
        let length = resdata.replace(/<\/?[^>]+(>|$)/g, "").length;
        let acc_btn = document.getElementById('btn-able');
        props.setnewData({
            ...props.newData,
            'content': resdata,
        })
        switch (length < 6) {
            case true:
                document.getElementById('textContent').style.color = 'red';
                if (!acc_btn.classList.contains('d-none')) {
                    Btn_stage();
                }
                break;
            case false:
                document.getElementById('textContent').style.color = 'black';
                if (props.newData.header.length >= 4) {
                    if (acc_btn.classList.contains('d-none')) {
                        Btn_stage();
                    }
                }
                break;
            default : break;
        }
        
    }


    return (

        <Modal onHide={close} show={props.show} className="py-5 justify-content-center">
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title><strong>แก้ไขกระทู้</strong></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        <Form>
                            <Form.Group as={Row} className="mb-3">
                                <Col sm="12">
                                    <Form.Control size="md" onChange={handleHeader} value={props.newData.header} className="fw-bold" id="textHeader" placeholder='หัวข้อกระทู้' />
                                    <span className="text-danger">{error_list.header || html_error}</span>
                                </Col>
                            </Form.Group>
                            <Form.Group id="textContent">
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={props.newData.content}
                                    onChange={handleContent}
                                    config={{
                                        removePlugins: ["EasyImage", "ImageUpload", "MediaEmbed", "Table", "TableToolbar", "BlockQuote"],
                                        placeholder: 'เนื้อหากระทู้'
                                    }}
                                >
                                </CKEditor>
                            </Form.Group>

                            <span className="text-danger">{error_list.content || content_error}</span>
                            <Button id="btn-able" onClick={submit} className="mt-3 mb-2 d-flex justify-content-center align-items-center" variant="primary">อัพเดทข้อมูลกระทู้</Button>
                            <Button id="btn-disable" className="mt-3 mb-2 d-none d-flex justify-content-center align-items-center" variant="primary" disabled>อัพเดทข้อมูลกระทู้</Button>
                        </Form>
                    }

                </Modal.Body>

            </Modal.Dialog>
        </Modal>
    )
}

export default EditForum;