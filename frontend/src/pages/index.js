import React, { useState, useEffect} from 'react';
import { Container, Card, Row, Col, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import NewForum from './add-forum';
import EditForum from './edit-forum';
import parse from 'html-react-parser';
import swal from 'sweetalert';
const Index = () => {

    const newState = {
        'header' : '',
        'content' : '',
    }
    const [Forum, setForum] = useState([]);
    const [isUpload, setisUpload] = useState(false)
    const [createShow, setcreateShow] = useState(false)
    const [editShow, seteditShow] = useState(false)
    const [newData, setnewData] = useState(newState)
    const [id, setId] = useState('')

    useEffect(() => {
        const axiosGet = async () => {
            const res = await axios.get('api/forum')
            setForum(res.data)
        }
        axiosGet().then(() => {
            setisUpload(true);
        })
    }, [])

    const openNewform = () => {
        setcreateShow(true)
    }

    const createData = (id) => {
        axios.get(`api/forum/${id}`).then((res) => {
            setnewData({
                ...newData,
                'header' : res.data.forum.forum_header,
                'content' : res.data.forum.forum_content,
            })
        }).then(() => {
            seteditShow(true);
        })
    }

    return (
        <Container className="py-5">
            <NewForum show={createShow} setShow={setcreateShow}></NewForum>
            <EditForum show={editShow} setShow={seteditShow} newData={newData} setnewData={setnewData} id={id}></EditForum>
            <Card>
                <Card.Header>
                    <Row>
                        <Col>
                            <Card.Title className="d-flex justify-content-end">
                                <strong>รายชื่อกระทู้ทั้งหมด</strong>
                            </Card.Title>
                        </Col>
                        <Col xs={5} className="d-flex justify-content-end">
                            <Button onClick={openNewform} variant="primary">สร้างกระทู้</Button>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <Row className="justify-content-md-center">
                        {
                            isUpload ? Forum.data.map((data) => {
                                return (
                                    <Col key={data.id} sm={12} className="justify-content-center d-flex mt-2">
                                        <Card style={{ width: '50rem' }}>
                                            <Card.Header className="fs-2">
                                                <strong>{data.forum_header}</strong>
                                            </Card.Header>
                                            <Card.Body>
                                                {parse(data.forum_content)}
                                            </Card.Body>
                                            <Card.Footer>
                                                <Button variant="primary" onClick={() => {
                                                    setId(data.id);
                                                    createData(data.id);
                                                }}>แก้ไขข้อมูลกระทู้</Button>
                                                <Button variant="danger" onClick={() => {
                                                    axios.delete(`api/deleteforum/${data.id}`).then((res) => {
                                                        swal({
                                                            title: "ดำเนินการเสร็จสิ้น",
                                                            text: res.data.message,
                                                            icon: "success",
                                                        }).then(() => {
                                                            window.location.reload();
                                                        })
                                                    })
                                                }} className="ms-2">ลบกระทู้</Button>
                                            </Card.Footer>

                                        </Card>
                                    </Col>

                                )
                            }) : <Spinner animation="border" variant="primary" />
                        }
                    </Row>
                </Card.Body>
            </Card>




        </Container>
    );
}

export default Index;