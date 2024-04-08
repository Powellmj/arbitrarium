import React, { useState, useEffect, useMemo } from 'react';
import { Table, Container, FormControl, Button, Navbar, InputGroup } from 'react-bootstrap';
import { requestAllItems, deleteItem, updateItemIndex, pushConfig } from '../../actions/contacts_actions';
import { useDispatch, useSelector } from "react-redux";

function Banner({filter, setFilter, setModalShow}) {
  const defaultEntry = { hostname: "", ip_address: "192.168.", mac_address: "", description: "" }
  const dispatch = useDispatch();

  const setPlaceHolder = () => {
    const options = ["Hello, sunshine!", "Howdy, partner!", "Hey, hi, hello!", "What’s kickin’, little chicken?", "Peek-a-boo!", "Howdy-doody!", "Hey there, freshman!", "My name's Ralph, and I'm a bad guy.", "Welcome!", "I come in peace!", "Put that cookie down!", "Ahoy, matey!", "Hiya!", "'Ello, gov'nor!", "Top of the mornin’ to ya!", "What’s crackin’?", "GOOOOOD MORNING, VIETNAM!", "Howdy, howdy, howdy!", "Hello, my name is Inigo Montoya.", "I'm Batman.", "So, at last, we meet for the first time, for the last time!", "Here's Johnny!", "Ghostbusters, whatya want?", "Yo!", "Whaddup.", "Greetings and salutations!", "Doctor.", "‘Ello, mate.", "Oh, yoooouhoooo!", "How you doin'?", "I like your face.", "What's cookin', good lookin'?", "Why, hello there!", "Hey, boo.", "Listen!", "Generic Greeting!"]
    return options[Math.floor(Math.random() * options.length)]
  }
  const placeholder = useMemo(() => setPlaceHolder(), []);

  const handleEditClick = (editingItem, e) => {
    e.persist()
    if (e.target.className.includes("edit")) {
        setModalShow(true);
    } else if (e.target.localName === 'td') {
        e.target.classList.add("edit");
        setTimeout(() => { e.target.classList.remove("edit") }, 400)
    }
};
const handlePushConfig = () => {
  dispatch(pushConfig())
}
  return (
    <Navbar style={{ position: 'fixed', width: '100vw' }} bg="light" expand="lg">
      <InputGroup>
        <Button className="add/edit" style={{ marginRight: "10px" }} onClick={e => { handleEditClick(defaultEntry, e) }} variant="primary" size="sm">Add Entry</Button>
        <FormControl type="text" placeholder={placeholder} value={filter} onChange={e => { setFilter(e.target.value) }} />
        <InputGroup.Append>
          <Button onClick={() => { handlePushConfig() }} variant="info">Push Config</Button>
        </InputGroup.Append>
      </InputGroup>
    </Navbar>
  );
}

export default Banner