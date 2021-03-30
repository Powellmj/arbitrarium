import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Table, Container, Form, FormControl, Button, Navbar, InputGroup } from 'react-bootstrap';
import EditEntryModel from "./EditEntryModel"
import { requestAllItems, deleteItem, createManyItems, updateItem } from '../actions/item_actions';
import moment from 'moment';

function HomePage() {
  const defaultEntry = { name: "", notes: "", expiration: "0", expiration_date: "", amountLeft: "100", quantity: "1", unit: "" }
  const [item, setItem] = useState(defaultEntry);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState({ catagory: "name", asc: 1 });
  const [shakers, setShakers] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const items = useSelector(state => state.entities.items)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(requestAllItems())
    setItem(defaultEntry)
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

  const handleEditClick = (editingItem, e) => {
    e.persist()
    if (e.target.className.includes("edit")) {
      setItem(editingItem);
      setModalShow(true);
    } else {
      e.target.classList.add("edit");
      setTimeout(() => { e.target.classList.remove("edit") }, 400)
    }
  };

  const parseFile = (e) => {
    if (!e) return;
    let newItem = { name: "", notes: "", expiration: "0", expiration_date: "", amountLeft: "100", quantity: "1", unit: "" };
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
            newItem = { name: "", notes: "", expiration: "0", expiration_date: "", amountLeft: "100", quantity: "1", unit: "" };
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
          if (parseInt(autoUpdateItem.expiration) > 0) {
            let exp_date = new Date()
            exp_date.setDate(exp_date.getDate() + parseInt(autoUpdateItem.expiration || 0))
            autoUpdateItem.expiration_date = moment(exp_date).format("YYYY-MM-DD")
          }
          dispatch(updateItem(autoUpdateItem))
        } else {
          newItems.push(lineItem)
        }
      })
      dispatch(createManyItems(newItems))
    }
  };

  const handleTableSort = (catagory) => {
    if (catagory === sort.catagory) setSort({ catagory, asc: sort.asc * -1 })
    else setSort({ catagory, asc: 1 })
  };

  const timeUntilExp = (listItem) => {
    if (!listItem.expiration_date) return [undefined, undefined];
    let targetDate = moment(listItem.expiration_date).format("DD-MM-YYYY").split("-");
    targetDate = new Date(targetDate[2], targetDate[1] - 1, targetDate[0]);
    let exp = Math.ceil(Math.abs((new Date() - targetDate) / (24 * 60 * 60 * 1000)))
    if (new Date() > targetDate) exp = exp * -1
    if (exp >= 14) return ["fresh", exp];
    else if (exp >= 7) return ["stale", exp];
    else if (exp >= 0) return ["spoiled", exp];
    else return ["rotten", exp];
  };

  const generateItems = () => {
    let rows = [];
    Object.values(items)
      .filter(lineItem => lineItem.visible && lineItem.name.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => {
        if (sort.catagory === "name") return a.name.localeCompare(b.name) * sort.asc;
        if (sort.catagory === "spoilage") {
          a.spoilage = timeUntilExp(a)[1]
          b.spoilage = timeUntilExp(b)[1]
          if (isNaN(parseFloat(a[sort.catagory])) && isNaN(parseFloat(b[sort.catagory]))) return a.name.localeCompare(b.name);
          if (isNaN(parseFloat(a[sort.catagory]))) return 1 * sort.asc;
          if (isNaN(parseFloat(b[sort.catagory]))) return -1 * sort.asc;
        }
        if (isNaN(parseFloat(a[sort.catagory])) && isNaN(parseFloat(b[sort.catagory]))) return a.name.localeCompare(b.name);
        if (isNaN(parseFloat(a[sort.catagory]))) return -1 * sort.asc;
        if (isNaN(parseFloat(b[sort.catagory]))) return 1 * sort.asc;
        if (parseFloat(a[sort.catagory]) > (parseFloat(b[sort.catagory]))) return 1 * sort.asc;
        if (parseFloat(b[sort.catagory]) > (parseFloat(a[sort.catagory]))) return -1 * sort.asc })
      .forEach((listItem, idx) => {
        rows.push(
          <tr className={`home-page-exp-color ${timeUntilExp(listItem)[0]} ${idx % 2 !== 0 ? "home-page-odd" : ""}`} key={listItem._id}>
            <td onClick={e => { handleEditClick(listItem, e) }}>{listItem.name}</td>
            <td onClick={e => { handleEditClick(listItem, e) }}>{moment(listItem.created_at).format("MM/DD")}</td>
            <td onClick={e => { handleEditClick(listItem, e) }}>{listItem.quantity}</td>
            <td onClick={e => { handleEditClick(listItem, e) }}>{listItem.unit}</td>
            <td>
              <div onClick={e => { handleDeleteClick(listItem, e) }} className="trash-can-item-list"></div>
            </td>
          </tr>)
      })
    return rows
  };

  return(
    <Container>
      <Navbar bg="light" expand="lg">
        <InputGroup>
          <Button className="add/edit" style={{ marginRight: "10px" }} onClick={e => { handleEditClick(defaultEntry, e) }} variant="primary" size="sm">Add/Edit</Button>
          <FormControl type="text" placeholder="Search" value={filter} onChange={e => { setFilter(e.target.value) }} />
          <InputGroup.Append>
            <Button style={{ backgroundColor: "White", borderColor: "#ced4da", color: "#6c757d" }} onClick={() => { setFilter(" ") }} variant="outline-secondary">clear</Button>
          </InputGroup.Append>
        </InputGroup>
      </Navbar>
      <Table bordered responsive>
        <thead>
          <tr>
            <th onClick={() => { handleTableSort("name") }}>{`Item ${sort.catagory === 'name' ? sort.asc > 0 ? "↑" : "↓" : " "}`}</th>
            <th className="item-table-header-added" onClick={() => { handleTableSort("created_date") }}>{`Added ${sort.catagory === 'created_date' ? sort.asc > 0 ? "↑" : "↓" : " "}`}</th>
            <th className="item-table-header-qty" onClick={() => { handleTableSort("quantity") }}>{`Qty ${sort.catagory === 'quantity' ? sort.asc > 0 ? "↑" : "↓" : " "}`}</th>
            <th onClick={() => { handleTableSort("unit") }}>{`Unit ${sort.catagory === 'unit' ? sort.asc > 0 ? "↑" : "↓" : " "}`}</th>
            <th className="item-table-header-spoilage" onClick={() => { handleTableSort("spoilage") }}>{`Spoilage ${sort.catagory === 'spoilage' ? sort.asc > 0 ? "↑" : "↓" : " "}`}</th>
          </tr>
        </thead>
        <tbody>
          { generateItems() }
        </tbody>
      </Table>
      <EditEntryModel
        show={modalShow}
        item={{ ...item, expiration_date: moment(item.expiration_date).format("YYYY-MM-DD")}}
        onHide={() => setModalShow(false)} />
      <Form.File onChange={e => { parseFile(e) }}/>
    </Container>
  );
}

export default HomePage;