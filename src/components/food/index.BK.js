import React, { useState, useEffect, useContext } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { createFood, deleteFood, updateFood } from '../../graphql/mutations';
import { getFood, listFoods } from '../../graphql/queries';
import { Button, Form, Table, Row, Col, Modal, Spinner, Container } from 'react-bootstrap';
import AppLoading from '../loading';
import ConfirmDelete from '../confirm-delete';
import NotificationsContext from '../../contexts/notifications';

const initialState = { id: '', name: '', email: '', description: '' };
const initialInforDelete = { id: '', name: '' };

const Foods = () => {
  const [foods, setFoods] = useState([]);
  const [formCreate, setFormCreate] = useState(initialState);
  const [formUpdate, setFormUpdate] = useState(initialState);
  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const [inforDelete, setInforDelete] = useState(initialInforDelete);
  const notifications = useContext(NotificationsContext);

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function reload() {
    try {
      const data = await getListFoods();
      setFoods(data);
    } catch (error) {
      console.log('error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
    }
  }

  async function getListFoods() {
    try {
      setLoading(true);
      const response = await API.graphql(graphqlOperation(listFoods));
      setLoading(false);
      return response.data.listFoods.items;
    } catch (error) {
      console.log('error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
      setLoading(false);
      return [];
    }
  }

  function setInput(key, value) {
    setFormCreate({ ...formCreate, [key]: value });
  }

  function setInputUpdate(key, value) {
    setFormUpdate({ ...formUpdate, [key]: value });
  }

  async function onCreateFood(event) {
    event.preventDefault();
    try {
      if (!formCreate.name || !formCreate.description) return;
      const formData = {
        name: formCreate.name,
        email: formCreate.email,
        description: formCreate.description
      };
      setLoading(true);
      const response = await API.graphql(graphqlOperation(createFood, { input: formData }));
      if (response && response.data) {
        notifications({ message: 'Created food successfully!', type: 'success' });
        await reload();
        setFormCreate(initialState);
      }
      setLoading(false);
    } catch (error) {
      console.log('error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
      setLoading(false);
    }
  }

  function handleClose() {
    setDialog(false);
  }

  async function handleShow(food) {
    const data = await getDetailFood(food.id);
    setFormUpdate(data);
    setDialog(true);
  }

  async function onUpdateFood(event) {
    event.preventDefault();
    try {
      if (!formUpdate.name || !formUpdate.description) return;
      const formData = {
        id: formUpdate.id,
        name: formUpdate.name,
        email: formUpdate.email,
        description: formUpdate.description
      };
      setLoading(true);
      const response = await API.graphql(graphqlOperation(updateFood, { input: formData }));
      if (response && response.data) {
        notifications({ message: 'Uodated food successfully!', type: 'success' });
        await reload();
        setFormUpdate(initialState);
      }
      handleClose();
      setLoading(false);
    } catch (error) {
      console.log('error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
      setLoading(false);
    }
  }

  function onOpenConfirmDelete(food) {
    setInforDelete({ id: food.id, name: food.name });
    setDialogConfirm(true);
  }

  function onCloseConfirmDelete() {
    setDialogConfirm(false);
  }

  async function onDeleteFood() {
    try {
      if (!inforDelete && !inforDelete.id) return;
      const formData = {
        id: inforDelete.id
      }
      setLoading(true);
      const response = await API.graphql(graphqlOperation(deleteFood, { input: formData }));
      if (response && response.data) {
        notifications({ message: 'Deleted food successfully!', type: 'success' });
        await reload();
        setInforDelete(initialInforDelete);
      }
      setLoading(false);
      onCloseConfirmDelete();
    } catch (error) {
      console.log('error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
      setLoading(false);
    }
  }

  async function getDetailFood(id) {
    try {
      if (!id) return;
      const response = await API.graphql(graphqlOperation(getFood, { id: id }));
      if (response && response.data && response.data.getFood) {
        return response.data.getFood;
      }
    } catch (error) {
      console.log('error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
      setLoading(false);
      return initialState;
    }
  }

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col>
          <h2>Foods Management</h2>
        </Col>
      </Row>
      <Row>
        <Col sm={12} md={12} lg={4}>
          <Form className="mb-5">
            <Form.Group controlId="txtName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                onChange={event => setInput('name', event.target.value)}
                value={formCreate.name}
              />
            </Form.Group>

            <Form.Group controlId="txtEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={event => setInput('email', event.target.value)}
                value={formCreate.email}
              />
            </Form.Group>
            <Form.Group controlId="txtDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                onChange={event => setInput('description', event.target.value)}
                value={formCreate.description}
              />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={onCreateFood}>
              {
                loading ?
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                /> :
                'Create Food'
              }
            </Button>
          </Form>
        </Col>

        <Col sm={12} md={12} lg={8}>
          {
            loading ? <AppLoading /> :
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  foods.length === 0 ?
                  <tr>
                    <td colSpan="4" className="text-center">No data</td>
                  </tr> :
                  foods.map((food, index) => (
                    <tr key={food.id ? food.id : index}>
                      <td>{food.name}</td>
                      <td>{food.email}</td>
                      <td>{food.description}</td>
                      <td>
                        <Button variant="primary" className="mr-2" onClick={() => handleShow(food)}>Edit</Button>
                        <Button variant="danger" onClick={() => onOpenConfirmDelete(food)}>Delete</Button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          }
        </Col>

        <Modal show={dialog} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update Food</Modal.Title>
          </Modal.Header>
          <Form>
          <Modal.Body>
            <Form.Group controlId="txtName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                onChange={event => setInputUpdate('name', event.target.value)}
                value={formUpdate.name}
              />
            </Form.Group>

            <Form.Group controlId="txtEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={event => setInputUpdate('email', event.target.value)}
                value={formUpdate.email}
              />
            </Form.Group>
            <Form.Group controlId="txtDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                onChange={event => setInputUpdate('description', event.target.value)}
                value={formUpdate.description}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="success" type="submit" onClick={onUpdateFood}>
              {
                loading ?
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                /> :
                'Save changes'
              }
            </Button>
          </Modal.Footer>
          </Form>
        </Modal>

        <ConfirmDelete
          dialog={dialogConfirm}
          loading={loading}
          handleClose={onCloseConfirmDelete}
          handleSubmit={onDeleteFood}
        >
          <p>Are you sure want delete <b>{inforDelete.name}</b>?</p>
        </ConfirmDelete>
      </Row>
    </Container>
  );
};

export default Foods;
