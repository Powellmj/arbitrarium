import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { createItem, updateItem } from '../actions/contacts_actions';
import { Modal, Button, Form, Col } from 'react-bootstrap';

function EditEntryModal(props) {
  const defaultEntry = { hostname: "", ip_address: "192.168.", mac_address: "", description: ""}
  const [entry, setEntry] = useState(defaultEntry);
  const dispatch = useDispatch();
  const items = useSelector(state => state.entities.contacts)

  useEffect(() => {
    if (document.getElementById("hostname-field")) {
      document.getElementById("hostname-field").focus();
    }
    setEntry(props.item)
  }, [props.item]);

  const update = (e, field) => {
    return setEntry({ ...entry, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    let entryId = ""
    dispatch(createItem(entry)).then((res) => {
      entryId = res?.item?._id
      handleClear()
      props.setNewItemId(entryId)
    })
    props.onHide()
  };

  const handleEdit = (e) => {
    let entryId = ""
    dispatch(updateItem(entry)).then((res) => {
      entryId = res?.item?._id
      handleClear()
      props.setNewItemId(entryId)
    })
    props.onHide()
  };

  const handleClear = () => {
    setEntry(defaultEntry)
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create/Edit Entry
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group as={Col}>
            <Form.Label>Hostname</Form.Label>
              <Form.Control id="hostname-field" value={entry.hostname} onChange={e => { update(e, "hostname") }} />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>IP Address</Form.Label>
              <Form.Control value={entry.ip_address} onChange={e => { update(e, "ip_address") }} />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>MAC Address</Form.Label>
              <Form.Control value={entry.mac_address} onChange={e => { update(e, "mac_address") }} />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} value={entry.description} onChange={e => { update(e, "description") }}/>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button variant="danger" type="reset" onClick={() => { handleClear() }}>Clear</Button> */}
        {entry._id in items ?
          <Button
          variant="primary"
          type="submit" style={{ minWidth: "150px" }}
          onClick={() => { handleEdit() }}>
            Edit
          </Button> :
          <Button variant="primary" type="submit" style={{ minWidth: "150px" }} onClick={() => { handleSubmit() }}>Submit</Button>
        }
      </Modal.Footer>
    </Modal>
  );
}

export default EditEntryModal;