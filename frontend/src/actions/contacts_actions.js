import * as APIUtil from '../util/contact_util';

export const RECEIVE_ITEM = "RECEIVE_ITEM";
export const RECEIVE_ALL_ITEMS = "RECEIVE_ALL_ITEMS";
export const REMOVE_ITEM = "REMOVE_ITEM";

export const receiveItem = item => ({
  type: RECEIVE_ITEM,
  item
});

export const receiveAllItems = items => ({
  type: RECEIVE_ALL_ITEMS,
  items
});

export const removeItem = id => ({
  type: REMOVE_ITEM,
  id
});

export const requestItem = itemId => dispatch => APIUtil.fetchItem(itemId)
  .then(item => (
    dispatch(receiveItem(item.data))
  ))

export const requestAllItems = () => dispatch => APIUtil.fetchAllItems()
  .then(items => {
    let itemsObj = {}
    items.data.forEach(item => {
      itemsObj[item._id] = item
    })
    return dispatch(receiveAllItems(itemsObj))
  })

  export const pushConfig = () => dispatch => APIUtil.pushConfig()
  .then(items => {
    let itemsObj = {}
    items.data.forEach(item => {
      itemsObj[item._id] = item
    })
    return dispatch(receiveAllItems(itemsObj))
  })

export const createItem = item => dispatch => (
  APIUtil.createItem(item).then((response) => {
    return dispatch(receiveItem(response.data))
  }
  // , err => (
  //   dispatch(receiveErrors(err.response.data))
  // )
  )
)

export const createManyItems = item => dispatch => (
  APIUtil.createManyItems(item).then((response) => {
    dispatch(requestAllItems())
  }
    // , err => (
    //   dispatch(receiveErrors(err.response.data))
    // )
  )
)

export const updateItem = item => dispatch => (
  APIUtil.updateItem(item).then((response) => {
    return dispatch(receiveItem(item))
  }
    // , err => (
    //   dispatch(receiveErrors(err.response.data))
    // )
  )
)

export const updateItemIndex = item => dispatch => (
  APIUtil.updateItem(item).then((response) => {
    // dispatch(requestAllItems())
  }
    // , err => (
    //   dispatch(receiveErrors(err.response.data))
    // )
  )
)

export const updateManyItems = updateObj => dispatch => (
  APIUtil.updateManyItems(updateObj).then((response) => {
    dispatch(requestAllItems())
  }
    // , err => (
    //   dispatch(receiveErrors(err.response.data))
    // )
  )
)

export const deleteItem = (itemId) => dispatch => {
  APIUtil.deleteItem(itemId).then(response => {
    dispatch(removeItem(itemId))
  });
}