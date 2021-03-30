import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { createItem, updateItem } from '../actions/item_actions';
import { Col, Form, Card, Button, NavLink, Accordion, Popover, OverlayTrigger, Table } from 'react-bootstrap';

function NewEntry() {
  const [entry, setEntry] = useState({ name: "", notes: "", expiration: "Nevah Evah", amountLeft: "100", quantity: "1", unit: "" });
  const dispatch = useDispatch();
  const items = useSelector(state => state.entities.items)

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

  const handleEditClick = (editingItem, e) => {
    setEntry(editingItem)
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
    return setEntry({ ...entry, [field]: e.target.value });
  };

  const handleSubmit = () => {
    dispatch(createItem(entry))
    handleClear()
  };

  const handleEdit = () => {
    dispatch(updateItem(entry))
    handleClear()
  };
  
  const handleClear = () => {
    setEntry({ name: "", notes: "", expiration: "Nevah Evah", amountLeft: "100", quantity: "1", unit: "" })
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
    <Accordion>
      <Card style={{ marginBottom: "5px" }}>
        <Accordion.Toggle as={NavLink} style={{ padding: "0px" }} variant="link" eventKey="0">
          <Card.Header style={{ border: "none" }}>
              New Entry
          </Card.Header>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <Form>
              <Form.Group as={Col}>
                <Form.Label>Name</Form.Label>
                <OverlayTrigger trigger="focus" placement="bottom-start" overlay={popover}>
                  <Form.Control value={entry.name} onChange={e => { update(e, "name") }} placeholder="What's dat thingy?" />
                </OverlayTrigger>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Notes</Form.Label>
                <Form.Control as="textarea" rows={3} value={entry.notes} onChange={e => { update(e, "notes") }} placeholder="What's it do?" />
              </Form.Group>
              <Form.Group as={Col}>
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
                <Form.Control type="unit" value={ entry.unit } onChange={e => { update(e, "unit") }} placeholder="Unit"/>
              </Form.Group>
              <Form.Group as={Col} controlId="quantity" style={{ display: "flex", justifyContent: "space-between" }}>
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
              </Form.Group>
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}

export default NewEntry;