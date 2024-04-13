import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Table, Container, FormControl, Button, Navbar, InputGroup } from 'react-bootstrap';
import EditItemModal from "../../components/EditIEntryModal/EditEntryModal"
import Banner from '../../components/Banner/Banner'
import { requestAllItems, deleteItem, updateItemIndex, pushConfig } from '../../actions/contacts_actions';

function TableRow(props) {
    const { listItem, update, handleEditClick, handleDeleteClick } = props

    const generateTableDataCells = () => {
        const fieldTypes = ['hostname', 'ip_address', 'mac_address', 'description']
        return fieldTypes.map((fieldType) => {
            return (
                <td onClick={e => { handleEditClick(listItem, e) }}>
                    <input
                        type="text"
                        className="form-control table-text-input"
                        value={listItem[fieldType]}
                        onChange={e => { update(e, fieldType, listItem) }}
                        id={`${listItem._id} ${fieldType}`}
                    />
                </td>
            )
        })
    }

    return (
        <tr key={listItem._id} id={listItem._id} className='table-row'>
            {generateTableDataCells()}
            <td>
                <div onClick={e => { handleDeleteClick(listItem, e) }} className="trash-can-item-list"></div>
            </td>
        </tr>
    );
}

export default TableRow;