import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { createItem, updateItem } from '../actions/item_actions';
import { Modal, Button, Form, Col, Popover, OverlayTrigger, Table, InputGroup  } from 'react-bootstrap';
import moment from 'moment';

function EditEntryModel(props) {
  const defaultEntry = { name: "", notes: "", expiration: "0", expiration_date: "", amountLeft: "100", quantity: "1", unit: "" }
  const [entry, setEntry] = useState(defaultEntry);
  const dispatch = useDispatch();
  const items = useSelector(state => state.entities.items)

  useEffect(() => {
    setEntry(props.item)
  }, [props.item]);

  const handleQuantityChange = e => {
    let currentQuantity = parseFloat(entry.quantity)
    switch (e.target.value) {
      case "+":
        setEntry({ ...entry, quantity: (currentQuantity + 1).toFixed(2) });
        break;
      case "-":
        if (entry.quantity - 1 < 0) setEntry({ ...entry, quantity: 0 })
        else setEntry({ ...entry, quantity: (currentQuantity - 1).toFixed(2) })
        break;
      default:
        setEntry({ ...entry, quantity: e.target.value })
        break;
    }
  };

  const handleEditClick = (editingItem, e) => {
    if (!editingItem.expiration_date) {
      let exp_date = new Date()
      exp_date.setDate(exp_date.getDate() + parseInt(editingItem.expiration || 0))
      editingItem.expiration_date = moment(exp_date).format("YYYY-MM-DD")
    }
    setEntry({ ...editingItem, expiration_date: moment(editingItem.expiration_date).format("YYYY-MM-DD") })
  };

  const generateItems = () => {
    let rows = [];
    Object.values(items)
      .filter(lineItem => lineItem.name.toLowerCase().includes(entry.name.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(listItem => {
        rows.push(<tr key={`popover-${listItem._id}`} onClick={e => { handleEditClick(listItem, e) }}><td>{listItem.name}</td></tr>)
      })
    return rows
  };

  const update = (e, field) => {
    if (field === "expiration") {
      let exp_date = new Date()
      exp_date.setDate(exp_date.getDate() + parseInt(e.target.value || 0))
      return setEntry({ ...entry, [field]: e.target.value, expiration_date: moment(exp_date).format("YYYY-MM-DD") });
    } else if (field === "expiration_date") {
      let targetDate = moment(e.target.value).format("DD-MM-YYYY").split("-");
      targetDate = new Date(targetDate[2], targetDate[1] - 1, targetDate[0]);
      let exp = Math.ceil(Math.abs((new Date() - targetDate) / (24 * 60 * 60 * 1000)))
      return setEntry({ ...entry, [field]: e.target.value, expiration: exp });
    }
    return setEntry({ ...entry, [field]: e.target.value });
  };

  const handleSubmit = () => {
    dispatch(createItem(entry))
    handleClear()
    props.onHide()
  };

  const handleEdit = () => {
    dispatch(updateItem(entry))
    handleClear()
    props.onHide()
  };

  const handleClear = () => {
    setEntry(defaultEntry)
  };

  const popover = (
    <Popover id="popover-basic">
      <Table striped bordered hover>
        <tbody>
          {generateItems()}
        </tbody>
      </Table>
    </Popover>
  );

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
            <Form.Label>Name</Form.Label>
            <OverlayTrigger trigger="focus" placement="bottom-start" overlay={popover}>
              <Form.Control value={entry.name} onChange={e => { update(e, "name") }} placeholder="what's dat thingy?" />
            </OverlayTrigger>
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Notes</Form.Label>
            <Form.Control as="textarea" rows={3} value={entry.notes} onChange={e => { update(e, "notes") }} placeholder="what's it for?" />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Expires in</Form.Label>
            <InputGroup>
              <Form.Control value={entry.expiration} onChange={e => { update(e, "expiration") }} placeholder="when's it die?" />
              <InputGroup.Append>
                <InputGroup.Text>Days</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            <Form.Label>Expiration Date</Form.Label>
            <br />
            <input type="date" value={entry.expiration_date} onChange={e => { update(e, "expiration_date") }} />
          </Form.Group>
          <Form.Group as={Col} controlId="amountLeft">
            <Form.Label>How many of em?</Form.Label>
          </Form.Group>
          <Form.Group as={Col} controlId="quantity" style={{ display: "flex" }}>
            <Button variant="outline-danger" value="-" style={{ minWidth: "40px" }} onClick={e => { handleQuantityChange(e) }}>-</Button>
            <Form.Control type="quantity" value={entry.quantity} onChange={e => { handleQuantityChange(e) }} style={{ maxWidth: "75px", textAlign: "center" }} />
            <Button variant="outline-success" value="+" style={{ minWidth: "40px" }} onClick={e => { handleQuantityChange(e) }}>+</Button>
            <Form.Control type="unit" value={entry.unit} onChange={e => { update(e, "unit") }} placeholder="Unit" />
          </Form.Group>
          <Form.Group as={Col} controlId="quantity" style={{ display: "flex", justifyContent: "space-between" }}>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" type="reset" onClick={() => { handleClear() }}>Clear</Button>
        {entry.name in items ?
          <Button
            variant={items[entry.name].visible ? 'warning' : 'primary'}
            type="button" style={{ minWidth: "150px" }}
            onClick={() => { handleEdit() }}>
            {items[entry.name].visible ? 'Edit' : 'Submit'}
          </Button> :
          <Button variant="primary" type="button" style={{ minWidth: "150px" }} onClick={() => { handleSubmit() }}>Submit</Button>
        }
      </Modal.Footer>
    </Modal>
  );
}

export default EditEntryModel;