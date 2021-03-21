import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Table, Container, Form, FormControl, Button } from 'react-bootstrap';
import EditEntryModel from "./EditEntryModel"
import { requestAllItems, deleteItem, createManyItems } from '../actions/item_actions';
import NewEntry from './NewEntry';

function HomePage() {
  const [item, setItem] = useState({ name: "", notes: "", expiration: "Nevah Evah", amountLeft: "100", quantity: "1", unit: "" });
  const [modalShow, setModalShow] = useState(false);
  const items = useSelector(state => state.entities.items)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(requestAllItems())
    setItem({ name: "", notes: "", expiration: "Nevah Evah", amountLeft: "100", quantity: "1", unit: "" })
  }, [dispatch]);

  const handleDeleteClick = (itemId, e) => {
    if (e.target.className.includes("shaker")) {
      dispatch(deleteItem(itemId))
    } else {
      e.target.classList.add("shaker");
      setTimeout(() => {e.target.classList.remove("shaker")}, 5000)
    }
  };

  const handleEditClick = (item, e) => {
    if (e.target.className.includes("edit")) {
      setItem(item);
      setModalShow(true);
    } else {
      e.target.classList.add("edit");
      setTimeout(() => { e.target.classList.remove("edit") }, 400)
    }
  };

  const parseFile = (e) => {
    let reader = new FileReader();
    reader.readAsText(e.target.files[0]);
    reader.onload = () => {

      let rawResultArr = reader.result
        .replace(/&nbsp;/g, ' ')
        .split("Thanks for your order, Michael")[1]
        .replace(/=\s\n/g, '')
        .split("Order Date ")[1]
        .split("Subtotal")[0]
        .replace(/<.*?>/g, '' )
        .replace(/  +/g, '')
        .replace(/&#39;/g, '\'')
        .replace(/&amp;/g, '&')
        .replace(/\n+/g, '\n')
        .split('\n')

      let refinedResultArr = [];
      let concatString = ""
      let unit = /^[0-9]+ /g;

      for (let i = 0; i < rawResultArr.length; i++) {
        let currentLine = rawResultArr[i]
        let name = /[a-zA-Z]/g;
        let quantity = /\$[0-9]+.[0-9][0-9] x/g;
        if (name.test(currentLine[0]) && !currentLine.includes("On Sale")) {
          concatString += concatString.length ? " " + currentLine : currentLine
        } else if (quantity.test(currentLine)) {
          concatString = concatString + " | " + currentLine.split(" x ")[1]
        } else if (unit.test(currentLine)) {
          concatString = concatString + " ^^ " + currentLine
        }else if (concatString.length) {
          refinedResultArr.push(concatString)
          concatString = ""
        }
      }

      let parsedList = [];
      for (let i = 0; i < refinedResultArr.length; i++) {
        let currentLine = refinedResultArr[i]
        if (currentLine.includes("Substituted With")) {
          parsedList.pop();
          continue
        } else if (currentLine.includes(" | ")) {
          parsedList[parsedList.length - 1].quantity = currentLine.split(" | ")[1]
          continue
        } else if (currentLine.includes(" ^^ ")) {
          parsedList[parsedList.length - 1].unit = currentLine.split(" ^^ ")[1]
          continue
        }
        parsedList.push({ name: currentLine, notes: "", expiration: "Nevah Evah", amountLeft: "100", quantity: "1", unit: "" })
      }
      dispatch(createManyItems(parsedList))
    }
  };

  const generateItems = () => {
    let rows = [];
    let itemArr = Object.values(items)
    for (let i = 0; i < itemArr.length; i++) {
      let item = itemArr[i]
      rows.push(
        <tr key={item._id}>
          <td style={{ width: "60px"}}>
            <div onClick={e => { handleDeleteClick(item._id, e) }} className="trash-can-item-list"></div>
          </td>
          <td onClick={ e => { handleEditClick(item, e) }}>{item.name}</td>
          <td onClick={ e => { handleEditClick(item, e) }}>{item.notes}</td>
          <td onClick={ e => { handleEditClick(item, e) }}>{item.expiration}</td>
          <td onClick={ e => { handleEditClick(item, e) }}>{item.quantity}</td>
          <td onClick={ e => { handleEditClick(item, e) }}>{item.unit}</td>
        </tr>)
    }
    return rows
  };

  return(
    <Container>
      <NewEntry />
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th></th>
            <th>Item</th>
            <th>Notes</th>
            <th>Expiration</th>
            <th>Quantity</th>
            <th>Unit</th>
          </tr>
        </thead>
        <tbody>
          { generateItems() }
        </tbody>
      </Table>
      <EditEntryModel
        show={modalShow}
        item={item}
        onHide={() => setModalShow(false)}
      />
      <Form>
        <Form.Group>
          <Form.File id="exampleFormControlFile1" label="file input" onChange={e => { parseFile(e) }}/>
        </Form.Group>
      </Form>
    </Container>
  );
}

export default HomePage;