import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { createItem, updateItem } from '../../actions/contacts_actions';
import { Modal, Button, Form, Col } from 'react-bootstrap';

function EditEntryModal(props) {
  const defaultEntry = { hostname: "", ip_address: "192.168.", mac_address: "", description: "" }
  const [entry, setEntry] = useState(defaultEntry);
  const dispatch = useDispatch();
  const items = useSelector(state => state.entities.contacts)
  const [hostnameMatch, setHostnameMatch] = useState(false);
  const [ipMatch, setIpMatch] = useState(false);
  const [macMatch, setMacMatch] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState(false);
  const [timer, setTimer] = useState({});

  useEffect(() => {
    if (document.getElementById("hostname-field")) {
      document.getElementById("hostname-field").focus();
    }
    setEntry(props.item)
  }, [props.item]);

  useEffect(() => {
      setHostnameMatch(false)
      setIpMatch(false)
      setMacMatch(false)
  }, [props.show]);

  const update = (e, field) => {
    if (field === 'hostname' && !Object.values(items).some(item => {
      let validationFailure = false;
      if (item.hostname === e.target.value) {
        setHostnameMatch(true)
        validationFailure = true;
      }
      return validationFailure;
    })) {
      setHostnameMatch(false)
    }
    if (field === 'ip_address' && !Object.values(items).some(item => {
      let validationFailure = false;
      if (item.ip_address === e.target.value) {
        setIpMatch(true)
        validationFailure = true;
      }
      return validationFailure;
    })) {
      setIpMatch(false)
    }
    if (field === 'mac_address' && !Object.values(items).some(item => {
      let validationFailure = false;
      if (item.mac_address === e.target.value) {
        setMacMatch(true)
        validationFailure = true;
      }
      return validationFailure;
    })) {
      setMacMatch(false)
    }

    return setEntry({ ...entry, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    if (!Object.values(items).some(item => {
      let validationFailure = false;
      if (item.hostname === entry.hostname) {
        setHostnameMatch(true)
        validationFailure = true;
      }
      if (item.ip_address === entry.ip_address) {
        setIpMatch(true)
        validationFailure = true;
      }
      if (item.mac_address === entry.mac_address) {
        setMacMatch(true)
        validationFailure = true;
      }
      return validationFailure;
    }
    )) {
      let entryId = ""
      dispatch(createItem(entry)).then((res) => {
        entryId = res?.item?._id
        handleClear()
        props.setNewItemId(entryId)
      })
      props.onHide()
    }
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
    setHostnameMatch(false)
    setIpMatch(false)
    setMacMatch(false)
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
        {saveTimeout ? <div className={`alert-container ${!!alert ? 'fade-in' : 'fade-out'}`}>
          <div className="alert alert-primary alert-text" role="alert">
            {alert}
          </div>
        </div> : null}
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group as={Col}>
            <Form.Label>Hostname</Form.Label>
            <Form.Control id="hostname-field" className={hostnameMatch ? 'form-input' : ''} value={entry.hostname} onChange={e => { update(e, "hostname") }} />
            {hostnameMatch ? <div>
              <div className='validation-label'>
                -Hostname matches another entry
              </div>
            </div> : null}
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>IP Address</Form.Label>
            <Form.Control className={ipMatch ? 'form-input' : ''} value={entry.ip_address} onChange={e => { update(e, "ip_address") }} />
            {ipMatch ? <div className='validation-label'>
              <div>
                -IP matches another entry
              </div>
            </div> : null}
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>MAC Address</Form.Label>
            <Form.Control className={macMatch ? 'form-input' : ''} value={entry.mac_address} onChange={e => { update(e, "mac_address") }} />
            {macMatch ? <div className='validation-label'>
              <div>
                -MAC address matches another entry
              </div>
            </div> : null}
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} value={entry.description} onChange={e => { update(e, "description") }} />
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