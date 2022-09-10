/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SendFill, ArrowLeftShort } from "react-bootstrap-icons";
import { Button, Form, Modal } from "react-bootstrap";
import {
  Text,
  Flex,
  ChakraProvider,
} from "@chakra-ui/react";
import { db } from "../firebase.js";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getDatabase,
  ref,
  push,
  onValue,
  set,
  remove,
} from "firebase/database";

const Messages = () => {
  const location = useLocation();
  const chatUser = location.state;
  const [content, setContent] = useState("");
  const [profileUser, setUser] = useState();
  const [allMessages, setAllMessages] = useState([]);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [modalValues, setModalValues] = useState();

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  //  set logged in profileUser name as title

  useEffect(() => {
    const value = localStorage.getItem("Name");
    const profileUser = JSON.parse(value);
    if (profileUser) {
      setUser(profileUser);
      data(profileUser);
    }
  }, []);

  //  set messages content in allMessages

  const data = (profileUser) => {
    setAllMessages("");
    var messageText = [];
    onValue(
      ref(db, "/users/chat/" + profileUser.uid + chatUser.uid),
      (querySnapShot) => {
        messageText = [];
        querySnapShot.forEach((snap) => {
          messageText.push(snap.val());
        });
        setAllMessages(messageText);
      }
    );
    setAllMessages(messageText);
  };

  // set messsages for sender and receiver in database using key

  // Use the push() method to append data to a list in multiuser applications.
  // The push() method generates a unique key every time a new child is added
  // to the specified Firebase reference. By using these auto-generated keys
  // for each new element in the list, several clients can add children to the
  // same location at the same time without write conflicts. The unique key
  // generated by push() is based on a timestamp, so list items are automatically
  // ordered chronologically.

  const handleSubmit = async (e) => {
    var today = new Date();
    var Time = today.getHours() + ":" + today.getMinutes();
    e.preventDefault();
    const db = getDatabase();
    const firstuserkey = push(
      ref(db, "users/chat/" + profileUser.uid + chatUser.uid)
    ).key;
    const sender = ref(
      db,
      "users/chat/" + profileUser.uid + chatUser.uid + "/" + firstuserkey
    );

    // sender

    set(sender, {
      message: content,
      sender: profileUser.uid + "/" + profileUser.username,
      receiver: chatUser.uid + "/" + chatUser.username,
      messageId: firstuserkey,
      time: Time,
    })
      .then((e) => {
        const receiver = ref(
          db,
          "users/chat/" + chatUser.uid + profileUser.uid + "/" + firstuserkey
        );

        // receiver

        set(receiver, {
          message: content,
          sender: profileUser.uid + "/" + profileUser.username,
          receiver: chatUser.uid + "/" + chatUser.username,
          messageId: firstuserkey,
          time: Time,
        });
      })
      .then(() => data(profileUser));
    setContent("");
  };

  // delete function

  // to delete a message just from one side
  const deleteForMe = (messageId) => {
    setShow(false);
    const senderKeyRef = ref(
      db,
      "users/chat/" + profileUser.uid + chatUser.uid + "/" + messageId
    );
    const receiverKeyRef = ref(
      db,
      "users/chat/" + chatUser.uid + profileUser.uid + "/" + messageId
    );
    if (senderKeyRef) {
      remove(senderKeyRef);
    } else if (receiverKeyRef) {
      remove(receiverKeyRef);
    }
  };
  // to delete a message from both sides
  const deleteForEveryone = (messageId) => {
    setShow(false);
    const senderKeyRef = ref(
      db,
      "users/chat/" + profileUser.uid + chatUser.uid + "/" + messageId
    );
    const receiverKeyRef = ref(
      db,
      "users/chat/" + chatUser.uid + profileUser.uid + "/" + messageId
    );
    remove(senderKeyRef).then(() => {
      remove(receiverKeyRef).then(() => data(profileUser));
    });
  };

  // setting key for modal

  const modalFun = (senderMessages) => {
    handleShow();
    setModalValues(senderMessages.messageId);
  };

  // show / close modal

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // scroll messages/page

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

  // navigate back to profile page

  const backToProfile = () => {
    navigate("/profile");
  };

  return (
    <>
      <ChakraProvider>
        <div id="msg-head">
          <header>
            <h2 id="msg-h2">{chatUser.username}</h2>
          </header>
          <ArrowLeftShort className="back-arrow" onClick={backToProfile} />
        </div>
        <Modal
          className="modal"
          value={modalValues}
          show={show}
          onHide={handleClose}
        >
          <Modal.Body>
              Are you sure you want to delete this message?
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => deleteForMe(modalValues)}
            >
                Delete for me
            </Button>
            <Button
              variant="primary"
              onClick={() => deleteForEveryone(modalValues)}
            >
                Delete for everyone
            </Button>
          </Modal.Footer>
        </Modal>
        <div>
          {allMessages.map((senderMessages, index) => {
            if (senderMessages.sender === profileUser.uid + "/" + profileUser.username) {
              return (
                <>
                  <Flex
                    key={senderMessages.messageId}
                    w="100%"
                    justify="flex-end"
                    onClick={() => modalFun(senderMessages)}
                  >
                    <Flex id="textStyle" bg="grey">
                      <Text>{senderMessages.message}</Text>
                      <span className="msg-time">
                        <Text>{senderMessages.time}</Text>
                      </span>
                    </Flex>
                  </Flex>
                </>
              );
            } else {
              return (
                <Flex
                  w="100%"
                  onClick={() => modalFun(senderMessages)}
                  key={index}
                >
                  <Flex id="textStyle" bg="rgb(20, 131, 243)">
                    <Text>{senderMessages.message}</Text>
                    <span className="msg-time">
                      <Text>{senderMessages.time}</Text>
                    </span>
                  </Flex>
                </Flex>
              );
            }
          })}
          <AlwaysScrollToBottom />
        </div>
        <div className="msg-footer container">
          <Flex mt="5">
            <Form onSubmit={handleSubmit}>
              <Form.Group id="msg-form" className="container">
                <Form.Control
                  value={content}
                  type="textarea"
                  placeholder="Type a message"
                  width="auto"
                  onChange={(e) => handleChange(e)}
                  autoComplete="off"
                />
                <Button
                  type="submit"
                  className="message-btn m-1"
                >
                  <SendFill />
                </Button>
              </Form.Group>
            </Form>
          </Flex>
        </div>
      </ChakraProvider>
    </>
  );
};

export default Messages;
