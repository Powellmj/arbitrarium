import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { updateFood } from '../actions/food_actions';
import { Modal, Button, Form, Col, NavLink } from 'react-bootstrap';

function EditEntryModel(props) {
  const [entry, setEntry] = useState({ name: "", notes: "", expiration: "Nevah Evah", amountLeft: "100", quantity: "1", unit: "" });
  const dispatch = useDispatch();
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
        if (entry.quantity - 1 < 0) {
          setEntry({ ...entry, quantity: 0 })
        } else {
          setEntry({ ...entry, quantity: (currentQuantity - 1).toFixed(2) })
        }
        break;
      default:
        setEntry({ ...entry, quantity: e.target.value })
        break;
    }
  };

  const update = (e, field) => {
    return setEntry({ ...entry, [field]: e.target.value });
  };

  const handleSubmit = () => {
    dispatch(updateFood(entry))
    props.onHide()
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
          Edit Entry
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Name</Form.Label>
            <Form.Control type="name" value={entry.name} onChange={e => { update(e, "name") }} placeholder="What's dat thingy?" />
          </Form.Group>
          <Form.Group as={Col} controlId="exampleForm.ControlTextarea1">
            <Form.Label>Notes</Form.Label>
            <Form.Control as="textarea" rows={3} value={entry.notes} onChange={e => { update(e, "notes") }} placeholder="What's it do?" />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>Expiration</Form.Label>
            <Form.Control value={entry.expiration} onChange={e => { update(e, "expiration") }} as="select">
              <option>Nevah Evah</option>
              <option>One Week</option>
              <option>Twoish/threeish Weeks</option>
              <option>'bout a monthish</option>
            </Form.Control>
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={props.onHide}>Close</Button>
        <Button variant="primary" type="button" style={{ minWidth: "150px" }} onClick={() => { handleSubmit() }}>Submit</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditEntryModel;