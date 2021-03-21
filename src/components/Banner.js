import { useState } from 'react';
import { Form, FormControl, Navbar, Container, } from 'react-bootstrap';

function Banner() {

  const greetings = () => {
    const options = ["Hello, sunshine!", "Howdy, partner!", "Hey, hi, hello!", "What’s kickin’, little chicken?", "Peek-a-boo!", "Howdy-doody!", "Hey there, freshman!", "My name's Ralph, and I'm a bad guy.", "Welcome!", "I come in peace!", "Put that cookie down!", "Ahoy, matey!", "Hiya!", "'Ello, gov'nor!", "Top of the mornin’ to ya!", "What’s crackin’?", "GOOOOOD MORNING, VIETNAM!", "Howdy, howdy, howdy!", "Hello, my name is Inigo Montoya.", "I'm Batman.", "So, at last, we meet for the first time, for the last time!", "Here's Johnny!", "Ghostbusters, whatya want?", "Yo!", "Whaddup.", "Greetings and salutations!", "Doctor.", "‘Ello, mate.", "Oh, yoooouhoooo!", "How you doin'?", "I like your face.", "What's cookin', good lookin'?", "Why, hello there!", "Hey, boo.", "Listen!", "Generic Greeting!"]
    return options[Math.floor(Math.random() * options.length)]
  }

  return( 
    <Navbar bg="light">
      <Container>
        {/* <h1>{greetings()}</h1> */}
      </Container>
    </Navbar>
  );
}

export default Banner