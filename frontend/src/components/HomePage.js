import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Table, Container, Form, FormControl, Button, Navbar, InputGroup } from 'react-bootstrap';
import EditEntryModel from "./EditEntryModel"
import { requestAllItems, deleteItem, createManyItems, updateItem } from '../actions/item_actions';
import NewEntry from './NewEntry';
import moment from 'moment';

function HomePage() {
  const [item, setItem] = useState({ name: "", notes: "", expiration: "Nevah Evah", amountLeft: "100", quantity: "1", unit: "" });
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState({ catagory: "name", asc: true });
  const [shakers, setShakers] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const items = useSelector(state => state.entities.items)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(requestAllItems())
    setItem({ name: "", notes: "", expiration: "Nevah Evah", amountLeft: "100", quantity: "1", unit: "" })
  }, [dispatch]);

  const handleDeleteClick = (listItem, e) => {
    const deleteId = listItem._id
    e.persist()
    if (!e.target.className.includes("shaker")) {
      e.target.classList.add("shaker");
      setShakers({ ...shakers, deleteId: setTimeout(() => { e.target.classList.remove("shaker") }, 5000) })
    } else {
      dispatch(deleteItem(deleteId, listItem.name))
      clearTimeout(shakers[deleteId])
    }
  };

  const handleEditClick = (item, e) => {
    e.persist()
    if (e.target.className.includes("edit")) {
      setItem(item);
      setModalShow(true);
    } else {
      e.target.classList.add("edit");
      setTimeout(() => { e.target.classList.remove("edit") }, 400)
    }
  };

  const parseFile = (e) => {
    if (!e) return;
    let newItem = { name: "", notes: "", expiration: "Nevah Evah", amountLeft: "100", quantity: "1", unit: "" }
    let refinedResultArr = [];
    let nameCheck = /^[a-zA-Z]+/;
    let quantityCheck = /^[\s]*\$[0-9]+.[0-9][0-9] x/g;
    let unitCheck = /^[\s]*[0-9]+/g;
    let reader = new FileReader();

    reader.readAsText(e.target.files[0]);
    reader.onload = () => {
      reader.result
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
        .filter(ele => ele.length > 1)
        .filter(ele => !ele.includes("On Sale"))
        .slice(1)
        .forEach(lineItem => {
          if (quantityCheck.test(lineItem)) {
            newItem.quantity = parseInt(newItem.quantity) * parseInt(lineItem.split(" x ")[1]);
            refinedResultArr.push(newItem);
            newItem = { name: "", notes: "", expiration: "Nevah Evah", amountLeft: "100", quantity: "1", unit: "" };
          } else if (unitCheck.test(lineItem)) {
            if (lineItem.includes("ct")) {
              newItem.unit = lineItem.split("ct")[1].match(/[0-9]+.+[0-9]+ +[a-zA-Z]+/g) ? lineItem.split("ct")[1].match(/[0-9]+.+[0-9]+ +[a-zA-Z]+/g)[0] : "Individual";
              newItem.quantity = parseInt(newItem.quantity) * parseInt(lineItem.split("ct")[0])
            } else {
              newItem.unit = lineItem
            }
          } else if (nameCheck.test(lineItem)) {
            if (lineItem.includes("Substituted With")) {
              refinedResultArr.pop();
            } else {
              newItem.name = lineItem
            }
          }
        })

      let newItems = [];

      refinedResultArr.forEach(lineItem => {
        if (lineItem.name in items) {
          let autoUpdateItem = items[lineItem.name]
          autoUpdateItem.quantity = `${parseInt(autoUpdateItem.quantity) + parseInt(lineItem.quantity)}`;
          dispatch(updateItem(autoUpdateItem))
        } else {
          newItems.push(lineItem)
        }
      })
      dispatch(createManyItems(newItems))
    }
  };

  const handleTableSort = (catagory) => {
    if (catagory === sort.catagory) {
      setSort({ catagory, asc: !sort.asc })
    } else {
      setSort({ catagory, asc: true })
    }
  };

  const generateItems = () => {
    let rows = [];
    let itemArr = Object.values(items)
      .filter(lineItem => lineItem.name.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => {
        if (sort.catagory === 'name') {
          return sort.asc ?
            a[sort.catagory].localeCompare(b[sort.catagory]) :
            b[sort.catagory].localeCompare(a[sort.catagory])
        } else {
          if (isNaN(parseFloat(a[sort.catagory])) && isNaN(parseFloat(b[sort.catagory]))) return a.name.localeCompare(b.name);
          if (sort.asc) {
            if (isNaN(parseFloat(a[sort.catagory]))) return -1;
            if (isNaN(parseFloat(b[sort.catagory]))) return 1;
            if (parseFloat(a[sort.catagory]) > (parseFloat(b[sort.catagory]))) return 1;
            if (parseFloat(b[sort.catagory]) > (parseFloat(a[sort.catagory]))) return -1;
          } else {
            if (isNaN(parseFloat(a[sort.catagory]))) return 1;
            if (isNaN(parseFloat(b[sort.catagory]))) return -1;
            if (parseFloat(a[sort.catagory]) > (parseFloat(b[sort.catagory]))) return -1;
            if (parseFloat(b[sort.catagory]) > (parseFloat(a[sort.catagory]))) return 1;
          }
        }
      })
    for (let i = 0; i < itemArr.length; i++) {
      let listItem = itemArr[i]
      rows.push(
        <tr key={listItem._id}>
          <td onClick={ e => { handleEditClick(listItem, e) }}>{listItem.name}</td>
          <td onClick={ e => { handleEditClick(listItem, e) }}>{moment(listItem.created_at).format("MM/DD")}</td>
          <td onClick={ e => { handleEditClick(listItem, e) }}>{listItem.quantity}</td>
          <td onClick={ e => { handleEditClick(listItem, e) }}>{listItem.unit}</td>
          <td style={{ width: "60px"}}>
            <div onClick={e => { handleDeleteClick(listItem, e) }} className="trash-can-item-list"></div>
          </td>
        </tr>)
    }
    return rows
  };

  return(
    <Container>
      <NewEntry />
      <Navbar bg="light" expand="lg">
        <InputGroup>
          <FormControl type="text" placeholder="Search" value={filter} onChange={e => { setFilter(e.target.value) }} />
          <InputGroup.Append>
            <Button style={{ backgroundColor: "White", borderColor: "#ced4da", color: "#6c757d" }} onClick={() => { setFilter(" ") }} variant="outline-secondary">clear</Button>
          </InputGroup.Append>
        </InputGroup>
      </Navbar>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th onClick={() => { handleTableSort("name") }}>{`Item ${sort.catagory === 'name' ? sort.asc ? "↑" : "↓" : " "}`}</th>
            <th className="item-table-header-added" onClick={() => { handleTableSort("created_date") }}>{`Added ${sort.catagory === 'created_date' ? sort.asc ? "↑" : "↓" : " "}`}</th>
            <th className="item-table-header-qty" onClick={() => { handleTableSort("quantity") }}>{`Qty ${sort.catagory === 'quantity' ? sort.asc ? "↑" : "↓" : " "}`}</th>
            <th onClick={() => { handleTableSort("unit") }}>{`Unit ${sort.catagory === 'unit' ? sort.asc ? "↑" : "↓" : " "}`}</th>
            <th></th>
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
          <Form.File label="file input" onChange={e => { parseFile(e) }}/>
        </Form.Group>
      </Form>
    </Container>
  );
}

export default HomePage;